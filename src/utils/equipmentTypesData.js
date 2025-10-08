export const equipmentTypesData = {
  common: [
    { code: "CTL", name: "制御盤", nameEn: "Control Panel", category: "電気" },
    { code: "PWR", name: "分電盤", nameEn: "Power Panel", category: "電気" },
    { code: "OPR", name: "操作盤", nameEn: "Operation Panel", category: "電気" },
    { code: "CNV", name: "コンベア", nameEn: "Conveyor", category: "搬送" },
    { code: "MON", name: "監視システム", nameEn: "Monitor System", category: "制御" }
  ],
  welding: [
    { code: "WRB", name: "溶接ロボット", nameEn: "Welding Robot", category: "ロボット" },
    { code: "WGN", name: "溶接ガン", nameEn: "Welding Gun", category: "アクセサリ" },
    { code: "HRB", name: "ハンドリングロボット", nameEn: "Handling Robot", category: "ロボット" },
    { code: "JIG", name: "溶接治具", nameEn: "Jig", category: "治具" },
    { code: "SEL", name: "シーリング装置", nameEn: "Sealing Device", category: "専用機" },
    { code: "POS", name: "ポジショナー", nameEn: "Positioner", category: "治具" }
  ],
  painting: [
    { code: "PRB", name: "塗装ロボット", nameEn: "Painting Robot", category: "ロボット" },
    { code: "BTH", name: "塗装ブース", nameEn: "Booth", category: "専用機" },
    { code: "OVN", name: "乾燥炉", nameEn: "Oven", category: "専用機" },
    { code: "PTK", name: "前処理槽", nameEn: "Pretreatment Tank", category: "専用機" },
    { code: "EDT", name: "電着槽", nameEn: "Electrodeposition Tank", category: "専用機" },
    { code: "SPY", name: "スプレー装置", nameEn: "Spray Device", category: "専用機" }
  ],
  assembly: [
    { code: "ARB", name: "組立ロボット", nameEn: "Assembly Robot", category: "ロボット" },
    { code: "NUT", name: "ナットランナー", nameEn: "Nutrunner", category: "工具" },
    { code: "LFT", name: "リフター", nameEn: "Lifter", category: "搬送" },
    { code: "TRN", name: "ターンテーブル", nameEn: "Turntable", category: "搬送" }
  ],
  inspection: [
    { code: "INS", name: "検査装置", nameEn: "Inspection Device", category: "専用機" },
    { code: "CAM", name: "カメラシステム", nameEn: "Camera System", category: "センサ" },
    { code: "TST", name: "試験装置", nameEn: "Test Device", category: "専用機" }
  ]
};

export function findEquipmentTypeByCode(code) {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();
  return Object.values(equipmentTypesData)
    .flat()
    .find((item) => item.code === normalized);
}
