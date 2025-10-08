import { useState } from "react";

export default function ScopeSelector({ analysis, onScopeChange }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [additionalItems, setAdditionalItems] = useState("");
  const [excludedItems, setExcludedItems] = useState("");
  const [priority, setPriority] = useState("medium");

  // 分析から候補項目を生成
  const suggestedItems = [
    ...((analysis?.requirements?.functional?.must || []).map(item => ({
      id: `must-${Math.random().toString(36).substr(2, 9)}`,
      category: "必須要件",
      description: item,
      aiConfidence: 90,
      suggestedByAI: true,
      type: "must"
    }))),
    ...((analysis?.requirements?.functional?.nice || []).map(item => ({
      id: `nice-${Math.random().toString(36).substr(2, 9)}`,
      category: "期待要件",
      description: item,
      aiConfidence: 70,
      suggestedByAI: true,
      type: "nice"
    }))),
    ...((analysis?.requirements?.performance || []).map(item => ({
      id: `perf-${Math.random().toString(36).substr(2, 9)}`,
      category: "性能要件",
      description: item,
      aiConfidence: 85,
      suggestedByAI: true,
      type: "performance"
    }))),
    {
      id: "tech-doc",
      category: "技術資料",
      description: "技術仕様書の作成",
      aiConfidence: 95,
      suggestedByAI: true,
      type: "technical"
    },
    {
      id: "cost-est",
      category: "コスト管理",
      description: "コスト見積シートの作成",
      aiConfidence: 95,
      suggestedByAI: true,
      type: "cost"
    },
    {
      id: "risk-analysis",
      category: "リスク管理",
      description: "リスク分析レポートの作成",
      aiConfidence: 80,
      suggestedByAI: true,
      type: "risk"
    }
  ];

  const toggleItem = (item) => {
    const isSelected = selectedItems.find(selected => selected.id === item.id);

    if (isSelected) {
      setSelectedItems(prev => prev.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const handleSubmit = () => {
    const scopeData = {
      selectedItems,
      additionalItems,
      excludedItems,
      priority,
      completeness: calculateCompleteness()
    };

    onScopeChange(scopeData);
  };

  const calculateCompleteness = () => {
    const totalItems = suggestedItems.length;
    const selectedMustItems = selectedItems.filter(item => item.type === "must").length;
    const selectedNiceItems = selectedItems.filter(item => item.type === "nice").length;
    const totalMustItems = suggestedItems.filter(item => item.type === "must").length;

    let completeness = 0;
    if (totalMustItems > 0) {
      completeness = (selectedMustItems / totalMustItems) * 70 + (selectedNiceItems / (totalItems - totalMustItems || 1)) * 30;
    }

    return Math.min(100, Math.round(completeness));
  };

  const priorityLabels = {
    high: "高 - 至急対応が必要",
    medium: "中 - 通常の優先度",
    low: "低 - 時間的余裕あり"
  };

  const categoryColors = {
    "必須要件": "border-red-200 bg-red-50",
    "期待要件": "border-green-200 bg-green-50",
    "性能要件": "border-purple-200 bg-purple-50",
    "技術資料": "border-blue-200 bg-blue-50",
    "コスト管理": "border-yellow-200 bg-yellow-50",
    "リスク管理": "border-orange-200 bg-orange-50"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">見積範囲の選択</h2>

      {/* 信頼度サマリー */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">プロジェクト概要</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700">顧客:</span>
            <span className="text-blue-900 ml-2 font-medium">{analysis?.customer || "未入力"}</span>
          </div>
          <div>
            <span className="text-blue-700">納期:</span>
            <span className="text-blue-900 ml-2 font-medium">{analysis?.schedule?.deadline || "未設定"}</span>
          </div>
          <div>
            <span className="text-blue-700">情報充足率:</span>
            <span className="text-blue-900 ml-2 font-medium">{calculateCompleteness()}%</span>
          </div>
        </div>
      </div>

      {/* AI提案項目 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-700 mb-4">AI提案項目</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {suggestedItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${categoryColors[item.category]} ${
                selectedItems.find(selected => selected.id === item.id)
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "hover:shadow-md"
              }`}
              onClick={() => toggleItem(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.find(selected => selected.id === item.id) || false}
                    onChange={() => toggleItem(item)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-800 bg-white rounded mb-2">
                      {item.category}
                    </span>
                    <p className="text-sm font-medium text-gray-900">{item.description}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>AI提案確信度: {item.aiConfidence}%</span>
                      {item.suggestedByAI && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">AI提案</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 追加・除外項目 */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            追加したい項目
          </label>
          <textarea
            value={additionalItems}
            onChange={(e) => setAdditionalItems(e.target.value)}
            placeholder="AI提案されていない項目で見積に含めたいものを記入..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            除外したい項目
          </label>
          <textarea
            value={excludedItems}
            onChange={(e) => setExcludedItems(e.target.value)}
            placeholder="見積から除外したい項目を記入..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </div>

      {/* 優先度設定 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-3">
          案件の優先度
        </label>
        <div className="space-y-2">
          {Object.entries(priorityLabels).map(([value, label]) => (
            <label key={value} className="flex items-center space-x-3">
              <input
                type="radio"
                name="priority"
                value={value}
                checked={priority === value}
                onChange={(e) => setPriority(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* サマリー */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-medium text-slate-900 mb-2">選択サマリー</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-600">選択項目数:</span>
            <span className="text-slate-900 ml-2 font-medium">{selectedItems.length}件</span>
          </div>
          <div>
            <span className="text-slate-600">カテゴリー:</span>
            <span className="text-slate-900 ml-2 font-medium">
              {[...new Set(selectedItems.map(item => item.category))].join(", ") || "未選択"}
            </span>
          </div>
          <div>
            <span className="text-slate-600">優先度:</span>
            <span className="text-slate-900 ml-2 font-medium">{priorityLabels[priority]}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedItems.length === 0}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        スコープを確定して次へ ({selectedItems.length}件選択中)
      </button>
    </div>
  );
}