import { useCallback, useState } from "react";
import { createTemplateBlob, parseExcelFile } from "../utils/excelParser.js";

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExcelUploader({ onDataImported, warnings }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleTemplateDownload = useCallback(() => {
    const blob = createTemplateBlob();
    saveBlob(blob, "REQUISITION_template.xlsx");
  }, []);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setError("");
      setIsProcessing(true);
      try {
        const { records, warnings: parseWarnings } = await parseExcelFile(file);
        onDataImported(records, parseWarnings);
      } catch (err) {
        setError(err.message || "Excelの解析に失敗しました。");
      } finally {
        setIsProcessing(false);
      }
    },
    [onDataImported]
  );

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">ステップ2: 機器リスト作成</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleTemplateDownload}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          📥 Excelテンプレートダウンロード
        </button>
        <label className="inline-flex cursor-pointer items-center rounded border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-700">
          📤 ファイルを選択
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      <div
        className="mt-4 rounded border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        Excelファイルをドラッグ＆ドロップしてください。
      </div>
      {isProcessing && <p className="mt-3 text-sm text-slate-500">解析中...</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {warnings?.length ? (
        <div className="mt-4 rounded border border-amber-400 bg-amber-50 p-3 text-sm text-amber-700">
          <p className="font-semibold">スキップされた行:</p>
          <ul className="mt-2 list-disc pl-5">
            {warnings.map((warning, index) => (
              <li key={`${warning.index}-${index}`}>
                {warning.index} 行目: {warning.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
