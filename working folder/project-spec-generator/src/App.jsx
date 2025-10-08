import { useCallback, useMemo, useState } from "react";
import ProjectInfoForm from "./components/ProjectInfoForm.jsx";
import ExcelUploader from "./components/ExcelUploader.jsx";
import NumberingConfig from "./components/NumberingConfig.jsx";
import EquipmentList from "./components/EquipmentList.jsx";
import FlowDiagramEditor from "./components/FlowDiagramEditor.jsx";
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
            <h1 className="text-2xl font-bold text-slate-800">REQUISITION Generator - Phase 1 MVP</h1>
            <p className="text-sm text-slate-500">購入要求書の作成を効率化するための支援ツール</p>
          </div>
          <div className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            MVP Build
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
            REQUISITION生成
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
        ) : (
          <PromptViewer />
        )}
      </main>
    </div>
  );
}
