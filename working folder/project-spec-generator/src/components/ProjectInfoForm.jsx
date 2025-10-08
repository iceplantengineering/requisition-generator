const shopOptions = [
  { value: "welding", label: "溶接" },
  { value: "painting", label: "塗装" },
  { value: "assembly", label: "組立" },
  { value: "inspection", label: "検査" }
];

export default function ProjectInfoForm({ projectInfo, onChange, onRegenerateId }) {
  const handleChange = (field) => (event) => {
    onChange(field, event.target.value);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">ステップ1: プロジェクト基本情報</h2>
        <button
          type="button"
          onClick={onRegenerateId}
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
        >
          プロジェクトID再生成
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          プロジェクトID
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.projectId}
            readOnly
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          プロジェクト名
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.projectName}
            onChange={handleChange("projectName")}
            placeholder="例：XX工場 新車種対応"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          顧客名
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.customer}
            onChange={handleChange("customer")}
            placeholder="例：ABC自動車株式会社"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          ショップ
          <select
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.shop}
            onChange={handleChange("shop")}
          >
            {shopOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          ライン名称
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.lineScope}
            onChange={handleChange("lineScope")}
            placeholder="例：Bodyside Line"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          納期
          <input
            type="date"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.deliveryDate}
            onChange={handleChange("deliveryDate")}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          担当PM
          <input
            type="text"
            className="rounded border border-slate-300 px-3 py-2"
            value={projectInfo.responsiblePM}
            onChange={handleChange("responsiblePM")}
            placeholder="例：山田太郎"
          />
        </label>
      </div>
    </section>
  );
}
