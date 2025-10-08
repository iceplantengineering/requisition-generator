import { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false });

export default function FlowDiagramEditor({ flowDiagram, onChangeContent, onChangeMetadata }) {
  const [renderedDiagram, setRenderedDiagram] = useState("");
  const [renderError, setRenderError] = useState("");

  useEffect(() => {
    let isCancelled = false;
    if (!flowDiagram.content) {
      setRenderedDiagram("");
      setRenderError("");
      return () => {
        isCancelled = true;
      };
    }

    (async () => {
      try {
        const { svg } = await mermaid.render(`flow-${Date.now()}`, flowDiagram.content);
        if (!isCancelled) {
          setRenderedDiagram(svg);
          setRenderError("");
        }
      } catch (error) {
        if (!isCancelled) {
          setRenderedDiagram("");
          setRenderError(error?.message || "Mermaidのレンダリングに失敗しました。");
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [flowDiagram.content]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">ステップ5: フロー図作成</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          Mermaid記法入力
          <textarea
            className="h-56 rounded border border-slate-300 px-3 py-2 font-mono text-xs"
            value={flowDiagram.content}
            onChange={(event) => onChangeContent(event.target.value)}
            placeholder={`graph LR\n  A[#010 Sidebody GEO溶接] --> B[#020 Door RESPOT]`}
          />
        </label>
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">プレビュー</p>
          <div className="mt-2 min-h-[200px] overflow-x-auto">
            {renderError ? (
              <p className="text-sm text-red-600">{renderError}</p>
            ) : renderedDiagram ? (
              <div dangerouslySetInnerHTML={{ __html: renderedDiagram }} />
            ) : (
              <p className="text-sm text-slate-400">Mermaid記法を入力するとプレビューが表示されます。</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          作成者
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={flowDiagram.metadata.createdBy}
            onChange={(event) => onChangeMetadata({ createdBy: event.target.value })}
            placeholder="例：設計太郎"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          作成日
          <input
            type="date"
            className="rounded border border-slate-300 px-3 py-2"
            value={flowDiagram.metadata.createdDate}
            onChange={(event) => onChangeMetadata({ createdDate: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
