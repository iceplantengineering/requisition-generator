const columns = [
  { key: "equipmentNumber", label: "機器番号", editable: true },
  { key: "processId", label: "工程番号", editable: true },
  { key: "processName", label: "工程名", editable: true },
  { key: "mainFunction", label: "主機能", editable: true },
  { key: "equipmentType", label: "機器種別", editable: true },
  { key: "equipmentName", label: "機器名称", editable: true },
  { key: "model", label: "型式/仕様", editable: true },
  { key: "quantity", label: "数量", editable: true },
  { key: "manufacturer", label: "メーカー", editable: true },
  { key: "remarks", label: "備考", editable: true }
];

export default function EquipmentList({ records, onUpdateRecord }) {
  const handleChange = (index, field) => (event) => {
    const value = field === "quantity" ? Number(event.target.value) || 0 : event.target.value;
    onUpdateRecord(index, field, value);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">ステップ4: 機器リスト確認＆編集</h2>
      {!records.length ? (
        <p className="mt-4 text-sm text-slate-500">Excelを取り込むと機器リストが表示されます。</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap px-4 py-2 text-left font-semibold text-slate-600">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record, index) => (
                <tr key={`${record.processId}-${record.equipmentType}-${index}`} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-2">
                      <input
                        type={column.key === "quantity" ? "number" : "text"}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                        value={
                          column.key === "quantity" && typeof record[column.key] !== "number"
                            ? record[column.key] || 0
                            : record[column.key] ?? ""
                        }
                        onChange={handleChange(index, column.key)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
