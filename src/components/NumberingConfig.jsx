import { useCallback } from "react";

export default function NumberingConfig({ numberingRules, onChange, onApply, isDisabled }) {
  const handleChange = useCallback(
    (field) => (event) => {
      onChange(field, field === "startNumber" ? Number(event.target.value) || 1 : event.target.value);
    },
    [onChange]
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">ステップ3: 機器番号採番設定</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          プレフィックス
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={numberingRules.prefix}
            onChange={handleChange("prefix")}
            placeholder="例：BS"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          開始番号
          <input
            type="number"
            min={1}
            className="rounded border border-slate-300 px-3 py-2"
            value={numberingRules.startNumber}
            onChange={handleChange("startNumber")}
          />
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onApply}
            disabled={isDisabled}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            🔢 自動採番実行
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">機器種別ごとに独立した連番が付与されます。</p>
    </section>
  );
}
