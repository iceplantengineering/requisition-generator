import { useState } from "react";

export default function ProjectAnalysis({ projectInfo, onAnalysisUpdate }) {
  const [requirements, setRequirements] = useState({
    functional: { must: [], nice: [] },
    performance: [],
    constraints: []
  });
  const [schedule, setSchedule] = useState({
    deadline: "",
    milestones: []
  });
  const [budget, setBudget] = useState({
    max: "",
    constraints: []
  });

  const handleRequirementAdd = (category, type, value) => {
    if (value.trim()) {
      const updated = { ...requirements };
      if (category === 'functional') {
        updated.functional[type].push(value.trim());
      } else {
        updated[category].push(value.trim());
      }
      setRequirements(updated);
      onAnalysisUpdate({ requirements: updated });
    }
  };

  const handleRequirementRemove = (category, type, index) => {
    const updated = { ...requirements };
    if (category === 'functional') {
      updated.functional[type].splice(index, 1);
    } else {
      updated[category].splice(index, 1);
    }
    setRequirements(updated);
    onAnalysisUpdate({ requirements: updated });
  };

  const handleMilestoneAdd = (name, date) => {
    if (name && date) {
      setSchedule(prev => ({
        ...prev,
        milestones: [...prev.milestones, { name, date }]
      }));
    }
  };

  const handleMilestoneRemove = (index) => {
    setSchedule(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">プロジェクト詳細分析</h2>

      {/* 要求事項 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-slate-700 mb-4">要求事項</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 必須要件 */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              必須要件 (Must Have)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="必須要件を入力"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleRequirementAdd('functional', 'must', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleRequirementAdd('functional', 'must', input.value);
                  input.value = '';
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                追加
              </button>
            </div>
            <ul className="space-y-1">
              {requirements.functional.must.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-red-800">{item}</span>
                  <button
                    onClick={() => handleRequirementRemove('functional', 'must', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 期待要件 */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              期待要件 (Nice to Have)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="期待要件を入力"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleRequirementAdd('functional', 'nice', e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleRequirementAdd('functional', 'nice', input.value);
                  input.value = '';
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                追加
              </button>
            </div>
            <ul className="space-y-1">
              {requirements.functional.nice.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-800">{item}</span>
                  <button
                    onClick={() => handleRequirementRemove('functional', 'nice', index)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 性能要件 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            性能要件
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="例：同時接続100ユーザー、レスポンス3秒以内"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRequirementAdd('performance', null, e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                handleRequirementAdd('performance', null, input.value);
                input.value = '';
              }}
              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              追加
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {requirements.performance.map((item, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm text-purple-800">{item}</span>
                <button
                  onClick={() => handleRequirementRemove('performance', null, index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* スケジュール */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-slate-700 mb-4">スケジュール</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              納期
            </label>
            <input
              type="date"
              value={schedule.deadline}
              onChange={(e) => {
                setSchedule(prev => ({ ...prev, deadline: e.target.value }));
                onAnalysisUpdate({ schedule: { ...schedule, deadline: e.target.value } });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              マイルストーン
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="マイルストーン名"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="milestone-name"
              />
              <input
                type="date"
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="milestone-date"
              />
              <button
                onClick={() => {
                  const name = document.getElementById('milestone-name').value;
                  const date = document.getElementById('milestone-date').value;
                  handleMilestoneAdd(name, date);
                  document.getElementById('milestone-name').value = '';
                  document.getElementById('milestone-date').value = '';
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                追加
              </button>
            </div>
            <ul className="space-y-1">
              {schedule.milestones.map((milestone, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-800">
                    {milestone.name} ({milestone.date})
                  </span>
                  <button
                    onClick={() => handleMilestoneRemove(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 予算 */}
      <div>
        <h3 className="text-lg font-medium text-slate-700 mb-4">予算情報</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              予算上限
            </label>
            <input
              type="text"
              placeholder="例：5000万円"
              value={budget.max}
              onChange={(e) => {
                setBudget(prev => ({ ...prev, max: e.target.value }));
                onAnalysisUpdate({ budget: { ...budget, max: e.target.value } });
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              制約条件
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="例：年度内発注必須"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setBudget(prev => ({
                      ...prev,
                      constraints: [...prev.constraints, e.target.value.trim()]
                    }));
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input.value.trim()) {
                    setBudget(prev => ({
                      ...prev,
                      constraints: [...prev.constraints, input.value.trim()]
                    }));
                    input.value = '';
                  }
                }}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                追加
              </button>
            </div>
            <ul className="space-y-1">
              {budget.constraints.map((constraint, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm text-orange-800">{constraint}</span>
                  <button
                    onClick={() => {
                      setBudget(prev => ({
                        ...prev,
                        constraints: prev.constraints.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}