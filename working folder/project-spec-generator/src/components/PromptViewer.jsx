import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import promptContent from "../../coding_ai_prompt.md?raw";

export default function PromptViewer() {
  const markdown = useMemo(() => promptContent, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">coding_ai_prompt.md</h2>
      <p className="mt-1 text-sm text-slate-500">
        プロジェクトの基準となるプロンプト仕様を下記に表示しています。
      </p>
      <div className="markdown-container mt-4 max-h-[70vh] overflow-y-auto rounded border border-slate-200 bg-slate-50 p-4">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
