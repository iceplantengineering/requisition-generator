import * as XLSX from "xlsx";
import Papa from "papaparse";
import { findEquipmentTypeByCode } from "./equipmentTypesData.js";

const HEADER_LABELS = [
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

const HEADER_MAP = {
  工程番号: "processId",
  工程名: "processName",
  主機能: "mainFunction",
  機器種別: "equipmentType",
  機器名称: "equipmentName",
  "型式/仕様": "model",
  数量: "quantity",
  メーカー: "manufacturer",
  備考: "remarks"
};

const REQUIRED_FIELDS = ["processId", "processName", "mainFunction"];

export function createExcelTemplate() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([HEADER_LABELS]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "REQUISITION");
  return workbook;
}

export function createTemplateBlob() {
  const workbook = createExcelTemplate();
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });
}

function normalizeRow(row) {
  return Object.entries(row).reduce((acc, [key, value]) => {
    const mappedKey = HEADER_MAP[key];
    if (!mappedKey) return acc;
    acc[mappedKey] = typeof value === "string" ? value.trim() : value ?? "";
    return acc;
  }, {});
}

export async function parseExcelFile(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: ",", RS: "\n" });
  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => (typeof value === "string" ? value.trim() : value)
  });

  const warnings = [];
  const records = parsed.data
    .map((row, index) => {
      const normalized = normalizeRow(row);
      const missing = REQUIRED_FIELDS.filter((field) => !normalized[field]);
      if (missing.length > 0) {
        warnings.push({
          index: index + 2,
          message: `必須項目が不足しています: ${missing.join(", ")}`
        });
        return null;
      }

      if (normalized.equipmentType && !findEquipmentTypeByCode(normalized.equipmentType)) {
        warnings.push({
          index: index + 2,
          message: `存在しない機器種別コードです: ${normalized.equipmentType}`
        });
        return null;
      }

      return {
        processId: normalized.processId || "",
        processName: normalized.processName || "",
        mainFunction: normalized.mainFunction || "",
        equipmentType: normalized.equipmentType || "",
        equipmentName: normalized.equipmentName || "",
        model: normalized.model || "",
        quantity: normalized.quantity ? Number(normalized.quantity) || 0 : 0,
        manufacturer: normalized.manufacturer || "",
        remarks: normalized.remarks || "",
        equipmentNumber: ""
      };
    })
    .filter(Boolean);

  return { records, warnings };
}
