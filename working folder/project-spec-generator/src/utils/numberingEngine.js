function sanitizePrefix(prefix) {
  if (!prefix) return "";
  return prefix.trim().endsWith("-") ? prefix.trim() : `${prefix.trim()}-`;
}

export function applyAutoNumbering(records, options) {
  const { prefix = "", startNumber = 1 } = options || {};
  const numericStart = Number.isFinite(startNumber) ? Number(startNumber) : 1;
  const paddedStart = Math.max(1, Math.floor(numericStart));
  const normalizedPrefix = sanitizePrefix(prefix);
  const counters = new Map();

  return records.map((record) => {
    const type = record.equipmentType ? record.equipmentType.trim().toUpperCase() : "";
    if (!type) {
      return { ...record, equipmentNumber: record.equipmentNumber || "" };
    }

    if (!counters.has(type)) {
      counters.set(type, paddedStart);
    }

    const currentIndex = counters.get(type);
    counters.set(type, currentIndex + 1);
    const number = String(currentIndex).padStart(3, "0");

    return {
      ...record,
      equipmentType: type,
      equipmentNumber: `${normalizedPrefix}${type}-${number}`
    };
  });
}

export function updateRecordField(records, index, field, value) {
  return records.map((record, idx) =>
    idx === index
      ? {
          ...record,
          [field]: field === "quantity" ? Number(value) || 0 : value
        }
      : record
  );
}
