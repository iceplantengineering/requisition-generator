function renderProjectInfo(projectInfo, numberingRules) {
  const entries = [
    { label: "プロジェクトID", value: projectInfo.projectId },
    { label: "プロジェクト名", value: projectInfo.projectName },
    { label: "顧客名", value: projectInfo.customer },
    { label: "ショップ", value: projectInfo.shop },
    { label: "ライン名称", value: projectInfo.lineScope },
    { label: "納期", value: projectInfo.deliveryDate },
    { label: "担当PM", value: projectInfo.responsiblePM }
  ];

  const numberingEntries = [
    { label: "プレフィックス", value: numberingRules.prefix || "-" },
    { label: "開始番号", value: numberingRules.startNumber },
    { label: "採番対象", value: "機器種別ごとの連番" }
  ];

  const infoRows = entries
    .map((item) => `<tr><th>${item.label}</th><td>${item.value || "-"}</td></tr>`)
    .join("");

  const numberingRows = numberingEntries
    .map((item) => `<tr><th>${item.label}</th><td>${item.value || "-"}</td></tr>`)
    .join("");

  return `
    <section>
      <h2>プロジェクト概要</h2>
      <table>${infoRows}</table>
    </section>
    <section>
      <h2>機器番号採番設定</h2>
      <table>${numberingRows}</table>
    </section>
  `;
}

function renderEquipmentTable(equipmentList) {
  if (!equipmentList.length) {
    return "<p>機器データがありません。</p>";
  }

  const header = [
    "機器番号",
    "工程番号",
    "工程名",
    "主機能",
    "機器種別",
    "機器名称",
    "型式/仕様",
    "数量",
    "メーカー",
    "備考"
  ];

  const headerHtml = header.map((label) => `<th>${label}</th>`).join("");

  const bodyHtml = equipmentList
    .map((item) => {
      const cells = [
        item.equipmentNumber || "",
        item.processId,
        item.processName,
        item.mainFunction,
        item.equipmentType,
        item.equipmentName,
        item.model,
        item.quantity,
        item.manufacturer,
        item.remarks
      ];
      return `<tr>${cells.map((value) => `<td>${value ?? ""}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<section>
    <h2>機器リスト</h2>
    <table>
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  </section>`;
}

function renderFlowDiagram(flowDiagram) {
  if (!flowDiagram.content) {
    return "";
  }

  return `<section>
    <h2>フロー図</h2>
    <pre><code class="language-mermaid">${flowDiagram.content}</code></pre>
  </section>`;
}

export function generateRequisitionHTML(projectInfo, equipmentList, flowDiagram, numberingRules) {
  return `<!doctype html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <title>REQUISITION - ${projectInfo.projectName || ""}</title>
      <style>
        body { font-family: "Noto Sans JP", "Segoe UI", sans-serif; line-height: 1.6; padding: 24px; }
        h1 { font-size: 24px; margin-bottom: 16px; }
        h2 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #d4d4d4; padding: 8px; text-align: left; font-size: 14px; }
        th { background-color: #f7fafc; }
        pre { background: #f3f4f6; padding: 12px; overflow-x: auto; }
      </style>
    </head>
    <body>
      <h1>REQUISITION</h1>
      ${renderProjectInfo(projectInfo, numberingRules)}
      ${renderEquipmentTable(equipmentList)}
      ${renderFlowDiagram(flowDiagram)}
    </body>
  </html>`;
}

export function generateRequisitionMarkdown(projectInfo, equipmentList, flowDiagram, numberingRules) {
  const header = `# REQUISITION\n\n## プロジェクト概要\n`;
  const infoLines = [
    `- プロジェクトID: ${projectInfo.projectId || ""}`,
    `- プロジェクト名: ${projectInfo.projectName || ""}`,
    `- 顧客名: ${projectInfo.customer || ""}`,
    `- ショップ: ${projectInfo.shop || ""}`,
    `- ライン名称: ${projectInfo.lineScope || ""}`,
    `- 納期: ${projectInfo.deliveryDate || ""}`,
    `- 担当PM: ${projectInfo.responsiblePM || ""}`
  ].join("\n");

  const numberingLines = [
    "\n## 機器番号採番設定",
    `- プレフィックス: ${numberingRules.prefix || ""}`,
    `- 開始番号: ${numberingRules.startNumber}`,
    "- 採番対象: 機器種別ごとの連番"
  ].join("\n");

  const equipmentHeader = "\n## 機器リスト\n";
  const equipmentTable = [
    "| 機器番号 | 工程番号 | 工程名 | 主機能 | 機器種別 | 機器名称 | 型式/仕様 | 数量 | メーカー | 備考 |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...equipmentList.map((item) =>
      `| ${item.equipmentNumber || ""} | ${item.processId || ""} | ${item.processName || ""} | ${item.mainFunction || ""} | ${item.equipmentType || ""} | ${item.equipmentName || ""} | ${item.model || ""} | ${item.quantity ?? ""} | ${item.manufacturer || ""} | ${item.remarks || ""} |`
    )
  ].join("\n");

  const flowSection = flowDiagram.content
    ? `\n## フロー図\n\n\`\`\`mermaid\n${flowDiagram.content}\n\`\`\``
    : "";

  return `${header}${infoLines}${numberingLines}${equipmentHeader}${equipmentTable}${flowSection}`;
}
