import { useMemo } from "react";
import {
  generateRequisitionHTML,
  generateRequisitionMarkdown
} from "../utils/requisitionGenerator.js";

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function RequisitionPreview({ projectInfo, equipmentList, flowDiagram, numberingRules }) {
  const htmlContent = useMemo(
    () => generateRequisitionHTML(projectInfo, equipmentList, flowDiagram, numberingRules),
    [projectInfo, equipmentList, flowDiagram, numberingRules]
  );

  const markdownContent = useMemo(
    () => generateRequisitionMarkdown(projectInfo, equipmentList, flowDiagram, numberingRules),
    [projectInfo, equipmentList, flowDiagram, numberingRules]
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">ステップ6: REQUISITION生成</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadFile(htmlContent, "requisition.html", "text/html")}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          📄 HTMLダウンロード
        </button>
        <button
          type="button"
          onClick={() => downloadFile(markdownContent, "requisition.md", "text/markdown")}
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          📝 Markdownダウンロード
        </button>
      </div>
      <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-600">プレビュー</p>
        <div
          className="mt-3 space-y-4 text-sm leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
}
