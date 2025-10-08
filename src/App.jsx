import { useCallback, useMemo, useState } from "react";
import ProjectInfoForm from "./components/ProjectInfoForm.jsx";
import ProjectAnalysis from "./components/ProjectAnalysis.jsx";
import ExcelUploader from "./components/ExcelUploader.jsx";
import NumberingConfig from "./components/NumberingConfig.jsx";
import EquipmentList from "./components/EquipmentList.jsx";
import FlowDiagramEditor from "./components/FlowDiagramEditor.jsx";
import ScopeSelector from "./components/ScopeSelector.jsx";
import MultiDocumentGenerator from "./components/MultiDocumentGenerator.jsx";
import RequisitionPreview from "./components/RequisitionPreview.jsx";
import PromptViewer from "./components/PromptViewer.jsx";
import { applyAutoNumbering, updateRecordField } from "./utils/numberingEngine.js";

function generateProjectId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `PRJ-${y}${m}${d}-${suffix}`;
}

const initialProjectInfo = {
  projectId: generateProjectId(),
  projectName: "",
  customer: "",
  shop: "welding",
  lineScope: "",
  deliveryDate: "",
  responsiblePM: ""
};

const initialNumberingRules = {
  prefix: "BS",
  startNumber: 1
};

const shopLabels = {
  welding: "溶接",
  painting: "塗装",
  assembly: "組立",
  inspection: "検査"
};

const initialFlowDiagram = {
  format: "mermaid",
  content: "",
  metadata: {
    createdBy: "",
    createdDate: new Date().toISOString().slice(0, 10)
  }
};

export default function App() {
  const [projectInfo, setProjectInfo] = useState(initialProjectInfo);
  const [numberingRules, setNumberingRules] = useState(initialNumberingRules);
  const [equipmentRecords, setEquipmentRecords] = useState([]);
  const [importWarnings, setImportWarnings] = useState([]);
  const [flowDiagram, setFlowDiagram] = useState(initialFlowDiagram);
  const [activeTab, setActiveTab] = useState("builder");

  // Enhanced features state
  const [projectAnalysis, setProjectAnalysis] = useState({});
  const [scopeDefinition, setScopeDefinition] = useState({});
  const [generatedDocuments, setGeneratedDocuments] = useState({});
  const [currentStep, setCurrentStep] = useState("basic"); // basic, analysis, scope, generation, preview

  const handleProjectInfoChange = useCallback((field, value) => {
    setProjectInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleRegenerateProjectId = useCallback(() => {
    setProjectInfo((prev) => ({ ...prev, projectId: generateProjectId() }));
  }, []);

  const handleImportedData = useCallback((records, warnings) => {
    setEquipmentRecords(records);
    setImportWarnings(warnings || []);
  }, []);

  const handleNumberingChange = useCallback((field, value) => {
    setNumberingRules((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleApplyNumbering = useCallback(() => {
    setEquipmentRecords((prev) => applyAutoNumbering(prev, numberingRules));
  }, [numberingRules]);

  const handleRecordUpdate = useCallback((index, field, value) => {
    setEquipmentRecords((prev) => updateRecordField(prev, index, field, value));
  }, []);

  const handleFlowContentChange = useCallback((content) => {
    setFlowDiagram((prev) => ({ ...prev, content }));
  }, []);

  const handleFlowMetadataChange = useCallback((partial) => {
    setFlowDiagram((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...partial }
    }));
  }, []);

  // Enhanced feature handlers
  const handleAnalysisUpdate = useCallback((analysisData) => {
    setProjectAnalysis(prev => ({ ...prev, ...analysisData }));
  }, []);

  const handleScopeChange = useCallback((scopeData) => {
    setScopeDefinition(scopeData);
    setCurrentStep("generation");
  }, []);

  const handleDocumentsGenerated = useCallback((documents) => {
    setGeneratedDocuments(documents);
    setCurrentStep("preview");
  }, []);

  const projectSummary = useMemo(
    () => ({
      ...projectInfo,
      shop: shopLabels[projectInfo.shop] || projectInfo.shop,
      createdDate: new Date().toISOString().slice(0, 10)
    }),
    [projectInfo]
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">REQUISITION Generator - Enhanced</h1>
            <p className="text-sm text-slate-500">購入要求書の作成を効率化するための支援ツール（Enhanced版）</p>
          </div>
          <div className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Enhanced Build
          </div>
        </div>
      </header>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl gap-2 px-6 py-3">
          <button
            type="button"
            onClick={() => setActiveTab("builder")}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              activeTab === "builder"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
            aria-selected={activeTab === "builder"}
          >
            基本版
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("enhanced")}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              activeTab === "enhanced"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
            aria-selected={activeTab === "enhanced"}
          >
            Enhanced版
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("prompt")}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              activeTab === "prompt"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
            aria-selected={activeTab === "prompt"}
          >
            プロンプト仕様
          </button>
        </div>
      </div>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        {activeTab === "builder" ? (
          <>
            <ProjectInfoForm
              projectInfo={projectInfo}
              onChange={handleProjectInfoChange}
              onRegenerateId={handleRegenerateProjectId}
            />
            <ExcelUploader onDataImported={handleImportedData} warnings={importWarnings} />
            <NumberingConfig
              numberingRules={numberingRules}
              onChange={handleNumberingChange}
              onApply={handleApplyNumbering}
              isDisabled={!equipmentRecords.length}
            />
            <EquipmentList records={equipmentRecords} onUpdateRecord={handleRecordUpdate} />
            <FlowDiagramEditor
              flowDiagram={flowDiagram}
              onChangeContent={handleFlowContentChange}
              onChangeMetadata={handleFlowMetadataChange}
            />
            <RequisitionPreview
              projectInfo={projectSummary}
              equipmentList={equipmentRecords}
              flowDiagram={flowDiagram}
              numberingRules={numberingRules}
            />
          </>
        ) : activeTab === "enhanced" ? (
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                {["basic", "analysis", "scope", "generation", "preview"].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold ${
                        index <= ["basic", "analysis", "scope", "generation", "preview"].indexOf(currentStep)
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${
                      index <= ["basic", "analysis", "scope", "generation", "preview"].indexOf(currentStep)
                        ? "text-blue-600 font-medium"
                        : "text-gray-400"
                    }`}>
                      {step === "basic" && "基本情報"}
                      {step === "analysis" && "分析"}
                      {step === "scope" && "スコープ"}
                      {step === "generation" && "生成"}
                      {step === "preview" && "プレビュー"}
                    </span>
                    {index < 4 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          index < ["basic", "analysis", "scope", "generation", "preview"].indexOf(currentStep)
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {currentStep === "basic" && (
              <>
                <ProjectInfoForm
                  projectInfo={projectInfo}
                  onChange={handleProjectInfoChange}
                  onRegenerateId={handleRegenerateProjectId}
                />
                <ExcelUploader onDataImported={handleImportedData} warnings={importWarnings} />
                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentStep("analysis")}
                    disabled={!projectInfo.projectName || !projectInfo.customer}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    次へ：プロジェクト分析
                  </button>
                </div>
              </>
            )}

            {currentStep === "analysis" && (
              <>
                <ProjectAnalysis
                  projectInfo={projectInfo}
                  onAnalysisUpdate={handleAnalysisUpdate}
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep("basic")}
                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    戻る
                  </button>
                  <button
                    onClick={() => setCurrentStep("scope")}
                    disabled={Object.keys(projectAnalysis).length === 0}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    次へ：スコープ選択
                  </button>
                </div>
              </>
            )}

            {currentStep === "scope" && (
              <>
                <ScopeSelector
                  analysis={{ ...projectInfo, ...projectAnalysis }}
                  onScopeChange={handleScopeChange}
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep("analysis")}
                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    戻る
                  </button>
                </div>
              </>
            )}

            {currentStep === "generation" && (
              <>
                <MultiDocumentGenerator
                  projectInfo={projectInfo}
                  analysis={projectAnalysis}
                  scope={scopeDefinition}
                  equipmentList={equipmentRecords}
                  onDocumentsGenerated={handleDocumentsGenerated}
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep("scope")}
                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    戻る
                  </button>
                </div>
              </>
            )}

            {currentStep === "preview" && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">完成プレビュー</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="text-green-900 font-medium mb-2">✅ 生成完了</h3>
                    <p className="text-green-800">
                      {Object.keys(generatedDocuments).length}件のドキュメントが正常に生成されました。
                      各ドキュメントはMultiDocumentGeneratorセクションで確認・ダウンロードできます。
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">プロジェクト情報</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>案件名: {projectInfo.projectName}</li>
                        <li>顧客: {projectInfo.customer}</li>
                        <li>ショップ: {shopLabels[projectInfo.shop]}</li>
                        <li>プロジェクトID: {projectInfo.projectId}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">生成ドキュメント</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {Object.keys(generatedDocuments).map(docKey => (
                          <li key={docKey} className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {docKey === "requisition" && "購入要求書"}
                            {docKey === "technical" && "技術仕様書"}
                            {docKey === "cost" && "コスト見積明細"}
                            {docKey === "risk" && "リスク分析レポート"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep("generation")}
                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                  >
                    戻る
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep("basic");
                      setProjectAnalysis({});
                      setScopeDefinition({});
                      setGeneratedDocuments({});
                    }}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    新規プロジェクト
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <PromptViewer />
        )}
      </main>
    </div>
  );
}