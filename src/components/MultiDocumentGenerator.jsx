import { useState } from "react";

export default function MultiDocumentGenerator({
  projectInfo,
  analysis,
  scope,
  equipmentList,
  onDocumentsGenerated
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedDocs, setGeneratedDocs] = useState({});
  const [activeDoc, setActiveDoc] = useState("requisition");

  const generateRequisitionContent = () => {
    const selectedMustItems = scope.selectedItems?.filter(item => item.type === "must") || [];
    const selectedNiceItems = scope.selectedItems?.filter(item => item.type === "nice") || [];
    const selectedPerfItems = scope.selectedItems?.filter(item => item.type === "performance") || [];

    return `# 購入要求書

## 1. 購入目的・背景

### 1.1 プロジェクト概要
- **案件名**: ${projectInfo.projectName || "未設定"}
- **顧客**: ${projectInfo.customer || "未設定"}
- **対象ショップ**: ${projectInfo.shop || "未設定"}
- **納期**: ${analysis?.schedule?.deadline || "未設定"}

### 1.2 購入目的
${analysis?.requirements?.functional?.must?.length > 0
  ? `以下の必須要件を満たす設備導入が必要です：\n${analysis.requirements.functional.must.map(req => `- ${req}`).join('\n')}`
  : "設備更新による生産性向上を目的としています。"
}

## 2. 購入対象の詳細

### 2.1 概要
${projectInfo.lineScope || "新規設備導入プロジェクト"}

### 2.2 主要機器リスト
${equipmentList.length > 0
  ? equipmentList.map((eq, index) =>
      `${index + 1}. **${eq.name || eq.itemName || "未設定"}** (${eq.type || "未分類"})\n   - 数量: ${eq.quantity || 1}\n   - 型式: ${eq.model || "要指定"}\n   - 備考: ${eq.notes || "-"}`
    ).join('\n\n')
  : "機器リストはExcelから読み込んでください。"
}

### 2.3 詳細仕様
#### 必須要件
${selectedMustItems.length > 0
  ? selectedMustItems.map(item => `- ${item.description}`).join('\n')
  : "- 要確認"
}

#### 期待要件
${selectedNiceItems.length > 0
  ? selectedNiceItems.map(item => `- ${item.description}`).join('\n')
  : "- 特になし"
}

## 3. 調達理由

### 3.1 技術的妥当性
- 現行設備の老朽化による性能低下
- 生産効率化によるコスト削減
- 品質安定化による競争力強化

### 3.2 代替案の検討
- 既存設備改造：技術的制約により不可
- リース：長期コスト面で割高
- 外部委託：品質管理の観点から自社設備を希望

### 3.3 選定理由
- 技術仕様の適合性
- サポート体制の充実
- 実績と信頼性

## 4. スケジュール

| マイルストーン | 予定日 | 備考 |
|--------------|--------|------|
| ${analysis?.schedule?.deadline ? "納品" : "基本設計完了"} | ${analysis?.schedule?.deadline || "未設定"} | ${analysis?.schedule?.deadline ? "最終納品" : "設計完了時点"} |
${analysis?.schedule?.milestones?.map(milestone =>
  `| ${milestone.name} | ${milestone.date} | |`
).join('\n') || "| 要件定義完了 | 未設定 | |"}

## 5. 予算

### 5.1 概算費用
${analysis?.budget?.max
  ? `- 上限: ${analysis.budget.max}`
  : "- 予算: 要確認"
}

### 5.2 予算措置
- ${new Date().getFullYear()}年度設備投資予算
- 減価償却: 5年定額法

## 6. リスク管理

### 6.1 想定リスク
- 納期遅延リスク: ${scope.priority === "high" ? "高" : "中"}
- 技術リスク: 中
- コスト超過リスク: 中

### 6.2 対策
- 早期発注による納期リスク低減
- 技術仕様の詳細化によるリスク最小化
- 変動費の契約によるコスト管理

## 7. 承認フロー

1. **申請**: 設備担当部長
2. **審査**: 購買部長
3. **承認**: 工場長
4. **最終承認**: 社長

## 添付資料リスト
- 設備仕様書 (本書)
- 機器リスト明細
- レイアウト図
- 技術仕様書
- コスト見積明細

---

## 備考・特記事項

- ${scope.additionalItems || "特記事項なし"}
- 除外項目: ${scope.excludedItems || "なし"}
- 優先度: ${scope.priority === "high" ? "高" : scope.priority === "medium" ? "中" : "低"}

**作成日**: ${new Date().toLocaleDateString('ja-JP')}
**作成者**: ${projectInfo.responsiblePM || "設備担当"}
**プロジェクトID**: ${projectInfo.projectId || "未設定"}

---
*本書はREQUISITION Generator Phase 1 Enhancedにより自動生成されました。*
`;
  };

  const generateTechnicalSpecContent = () => {
    const hasTechnicalItems = scope.selectedItems?.some(item => item.type === "technical" || item.category === "技術資料");

    if (!hasTechnicalItems) {
      return "# 技術仕様書\n\n**注**: スコープ選択で技術仕様書が選択されていません。\n\nスコープ選択画面で「技術仕様書の作成」を選択して再生成してください。";
    }

    return `# 技術仕様書

## 1. 文書管理情報
- **文書番号**: TS-${projectInfo.projectId || "未設定"}-001
- **版数**: 1.0
- **作成日**: ${new Date().toLocaleDateString('ja-JP')}
- **最終更新日**: ${new Date().toLocaleDateString('ja-JP')}
- **承認者**: [要入力]

## 2. システム概要

### 2.1 目的
${projectInfo.projectName || "設備更新"}プロジェクトの技術仕様を定義し、設備導入の技術的基準を明確にすること。

### 2.2 適用範囲
- 対象エリア: ${projectInfo.lineScope || "全生産ライン"}
- 適用工程: ${projectInfo.shop === "welding" ? "溶接工程" : projectInfo.shop === "painting" ? "塗装工程" : projectInfo.shop === "assembly" ? "組立工程" : "検査工程"}

### 2.3 前提条件・制約事項
- 既存設備との整合性
- 設置スペースの制約
- 電源容量の制約
${analysis?.requirements?.constraints?.length > 0
  ? `- ${analysis.requirements.constraints.join('\n- ')}`
  : ""
}

## 3. システム構成

### 3.1 全体構成図
\`\`\`mermaid
graph TB
    A[原材料投入] --> B[加工]
    B --> C[組立]
    C --> D[検査]
    D --> E[製品出荷]

    subgraph "${projectInfo.shop || "工程"}"
        B
        C
        D
    end

    style B fill:#ff9999
    style C fill:#99ccff
    style D fill:#99ff99
\`\`\`

### 3.2 ハードウェア構成

| 項目 | 仕様 | 数量 | 備考 |
|------|------|------|------|
${equipmentList.length > 0
  ? equipmentList.map(eq =>
      `| ${eq.name || eq.itemName || "未設定"} | ${eq.model || "要仕様決定"} | ${eq.quantity || 1} | ${eq.notes || "-"}`
    ).join('\n')
  : "| 主要設備 | 要仕様決定 | - | -|"
}

### 3.3 ソフトウェア構成

| 分類 | 製品名 | バージョン | ライセンス |
|------|--------|-----------|----------|
| OS | Windows 10/11 Pro | 最新版 | 付属 |
| プログラミング環境 | IEC 61131-3 | 準拠 | 別途 |
| HMIソフト | [選定中] | 最新版 | 別途 |

## 4. 機能仕様

### 4.1 機能一覧
${analysis?.requirements?.functional?.must?.length > 0
  ? analysis.requirements.functional.must.map((req, index) =>
      `${index + 1}. ${req}`
    ).join('\n')
  : "1. 基本動作機能\n2. 安全機能\n3. 監視機能"
}

### 4.2 機能詳細

#### 4.2.1 基本動作機能
- **機能ID**: F001
- **機能名**: 自動運転機能
- **概要**: 設定されたレシピに基づき自動で一連の工程を実行
- **入力**: レシピデータ、開始信号
- **処理**: シーケンス制御
- **出力**: 各装置への制御信号
- **エラー処理**: 異常検出時の安全停止

#### 4.2.2 安全機能
- **機能ID**: S001
- **機能名**: 緊急停止機能
- **概要**: 異常時の即時停止と安全確保
- **入力**: 緊急停止信号、安全ライトカーテン
- **処理**: 即時停止指令
- **出力**: 全設備停止信号
- **エラー処理**: フェイルセーフ設計

## 5. 非機能要件

### 5.1 性能要件
- **レスポンスタイム**: ${analysis?.requirements?.performance?.join(", ") || "1秒以内"}
- **スループット**: 毎時XX個
- **稼働率**: 99%以上
- **MTBF**: 1000時間以上

### 5.2 可用性要件
- **稼働率目標**: 99.5%
- **保守時間帯**: 毎週土曜日 14:00-18:00
- **バックアップ戦略**: 定期バックアップ

### 5.3 セキュリティ要件
- **認証方式**: パスワード認証
- **アクセス制御**: 権限レベル別制御
- **データ暗号化**: 通信はSSL/TLS

### 5.4 運用要件
- **バックアップ方式**: 毎日自動バックアップ
- **監視項目**: 温度、圧力、電流値
- **ログ保存期間**: 1年間

## 6. インターフェース仕様

### 6.1 外部システム連携
${analysis?.technical?.interfaces?.length > 0
  ? analysis.technical.interfaces.map(iface => `- ${iface}`).join('\n')
  : "- 既存生産管理システムとの連携\n- 品質管理システムとの連携"
}

### 6.2 データ連携仕様
- **連携方式**: OPC UA / Modbus TCP
- **データフォーマット**: JSON, CSV
- **連携タイミング**: リアルタイム

## 7. データ設計

### 7.1 データモデル
主要エンティティ:
- 設備状態
- 生産実績
- 品質データ
- 警報履歴

### 7.2 主要テーブル定義

| テーブル名 | 概要 | 主キー | 備考 |
|-----------|------|--------|------|
| EQUIPMENT | 設備マスタ | equipment_id | |
| PRODUCTION | 生産実績 | production_id | |
| QUALITY | 品質データ | quality_id | |
| ALARM | 警報履歴 | alarm_id | |

## 8. 移行計画

### 8.1 移行対象データ
- 既存設備パラメータ
- 生産レシピ
- 運用マニュアル

### 8.2 移行方式
- **移行ツール**: 専用ツール開発
- **移行手順**: 1. データ洗浄 2. 変換 3. 検証 4. 切替
- **ロールバック計画**: 切替後48時間以内に旧システム復帰可能

## 9. テスト計画

### 9.1 テスト種別
- **単体テスト**: 各機能単位の動作確認
- **結合テスト**: 複数機能連携の確認
- **システムテスト**: 全体システムの動作確認
- **受入テスト**: 本番環境での受検

### 9.2 テスト環境
- 試験機: 現場と同等の環境
- テストデータ: 実際の生産データ

## 10. 用語集

| 用語 | 説明 |
|------|------|
| PLC | プログラマブルロジックコントローラ |
| HMI | ヒューマンマシンインターフェース |
| SCADA | 監視制御データ収集システム |
| MTBF | 平均故障間隔 |

## 11. 参考資料
- 設備メーカー技術資料
- 安全規格 (JIS B 9703)
- IEC 61131-3 規格

---

**技術担当**: [技術部長署名]
**承認**: [工場長署名]

**注**: 本仕様書はプロジェクト進行に応じて更新される場合があります。
`;
  };

  const generateCostEstimateContent = () => {
    const hasCostItems = scope.selectedItems?.some(item => item.type === "cost" || item.category === "コスト管理");

    if (!hasCostItems) {
      return "# コスト見積明細\n\n**注**: スコープ選択でコスト見積が選択されていません。\n\nスコープ選択画面で「コスト見積シートの作成」を選択して再生成してください。";
    }

    // 装置リストからのコスト計算
    const hardwareCost = equipmentList.reduce((sum, eq) => {
      const price = eq.unitPrice || 1000000; // デフォルト単価
      const quantity = eq.quantity || 1;
      return sum + (price * quantity);
    }, 0);

    const softwareCost = Math.round(hardwareCost * 0.15); // HWの15%
    const developmentCost = Math.round(hardwareCost * 0.8); // HWの80%
    const installationCost = Math.round(hardwareCost * 0.2); // HWの20%
    const otherCosts = Math.round(hardwareCost * 0.1); // HWの10%

    const subtotal = hardwareCost + softwareCost + developmentCost + installationCost + otherCosts;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    return `# コスト見積明細

## 見積サマリー

| 大分類 | 小計（円） | 備考 |
|--------|-------------|------|
| ハードウェア費用 | ${(hardwareCost / 10000).toFixed(1)}万円 | 設備本体費用 |
| ソフトウェア費用 | ${(softwareCost / 10000).toFixed(1)}万円 | 制御ソフト等 |
| 開発費用 | ${(developmentCost / 10000).toFixed(1)}万円 | 設計・製造 |
| 導入・設置費用 | ${(installationCost / 10000).toFixed(1)}万円 | 据付・調整 |
| その他費用 | ${(otherCosts / 10000).toFixed(1)}万円 | 諸経費 |
| **合計（税抜）** | **${(subtotal / 10000).toFixed(1)}万円** | |
| 消費税10% | **${(tax / 10000).toFixed(1)}万円** | |
| **総額（税込）** | **${(total / 10000).toFixed(1)}万円** | |

**予算上限**: ${analysis?.budget?.max || "未設定"}
**残予算**: ${analysis?.budget?.max ? `${(parseInt(analysis.budget.max.replace(/[^0-9]/g, '')) - total) / 10000}万円` : "計算不可"}

## 1. ハードウェア費用

### 1.1 主要設備

| No. | 項目名 | 型式・仕様 | 数量 | 単価（円） | 小計（円） | 備考 |
|-----|--------|-----------|------|------------|------------|------|
${equipmentList.map((eq, index) =>
  `| ${index + 1} | ${eq.name || eq.itemName || "未設定"} | ${eq.model || "要仕様決定"} | ${eq.quantity || 1} | ${eq.unitPrice || "1,000,000"} | ${((eq.unitPrice || 1000000) * (eq.quantity || 1)).toLocaleString()} | ${eq.notes || "-"} |`
).join('\n')}
| | **小計** | | | | **${hardwareCost.toLocaleString()}** | |

### 1.2 周辺機器
| 項目 | 仕様 | 数量 | 単価（円） | 小計（円） | 備考 |
|------|------|------|------------|------------|------|
| 制御盤 | PLC+HMI一式 | 1セット | 500,000 | 500,000 | |
| センサ類 | 光電・近接等 | 20個 | 25,000 | 500,000 | 見積 |
| 配材・電線 | - | 1式 | 300,000 | 300,000 | 見積 |
| **小計** | | | | **1,300,000** | |

### 1.3 ハードウェア合計
**${hardwareCost.toLocaleString()}円** (${(hardwareCost / 10000).toFixed(1)}万円)

## 2. ソフトウェア費用

### 2.1 制御ソフトウェア
| 項目 | 内容 | 数量 | 単価（円） | 小計（円） |
|------|------|------|------------|------------|
| プログラミングソフト | ライセンス | 1式 | 200,000 | 200,000 |
| HMIソフト | ライセンス | 1式 | 300,000 | 300,000 |
| 監視ソフト | オプション | 1式 | 100,000 | 100,000 |

### 2.2 サポート費用
| 項目 | 内容 | 期間 | 金額（円） |
|------|------|------|------------|
| 技術サポート | 年間サポート | 1年間 | 150,000 |

### 2.3 ソフトウェア合計
**${softwareCost.toLocaleString()}円** (${(softwareCost / 10000).toFixed(1)}万円)

## 3. 開発費用

### 3.1 設計費用
| 工程 | 担当 | 工数（人月） | 単価（円/月） | 金額（円） |
|------|------|-------------|---------------|------------|
| 基本設計 | 設計課 | 1.0 | 800,000 | 800,000 |
| 詳細設計 | 設計課 | 2.0 | 800,000 | 1,600,000 |
| 電気設計 | 設備課 | 1.5 | 700,000 | 1,050,000 |

### 3.2 製造費用
| 工程 | 担当 | 工数（人月） | 単価（円/月） | 金額（円） |
|------|------|-------------|---------------|------------|
| 機械加工 | 製造課 | 2.0 | 600,000 | 1,200,000 |
| 組立・調整 | 製造課 | 1.5 | 600,000 | 900,000 |

### 3.3 開発合計
**${developmentCost.toLocaleString()}円** (${(developmentCost / 10000).toFixed(1)}万円)

## 4. 導入・設置費用

### 4.1 据付工事
| 項目 | 内容 | 数量 | 単価（円） | 小計（円） |
|------|------|------|------------|------------|
| 基礎工事 | コンクリート基礎 | 1式 | 800,000 | 800,000 |
| 設備据付 | 設備・調整 | 1式 | 1,000,000 | 1,000,000 |

### 4.2 試運転
| 項目 | 内容 | 期間 | 金額（円） |
|------|------|------|------------|
| 試運転調整 | 機能確認 | 3日間 | 600,000 |

### 4.3 導入合計
**${installationCost.toLocaleString()}円** (${(installationCost / 10000).toFixed(1)}万円)

## 5. その他費用

### 5.1 諸経費
| 項目 | 内容 | 金額（円） | 備考 |
|------|------|------------|------|
| 交通費 | 出張旅費 | 100,000 | 見積 |
| 宿泊費 | 作業員宿泊 | 50,000 | 見積 |
| 消耗品 | 工具・材料等 | 50,000 | 見積 |

### 5.2 予備費
| 項目 | 割合 | 金額（円） | 備考 |
|------|------|------------|------|
| リスク予備費 | 5% | ${Math.round(subtotal * 0.05).toLocaleString()} | 設計変更等 |

### 5.3 その他合計
**${otherCosts.toLocaleString()}円** (${(otherCosts / 10000).toFixed(1)}万円)

## 算出根拠

### 開発工数算出方法
- 基本設計: 過去実績より1.0人月
- 詳細設計: 基本設計の2倍
- 製造: 設備規模から逆算

### 人月単価設定根拠
- 設計課長: 80万円/月
- 設計担当: 70万円/月
- 製造担当: 60万円/月

### リスク予備費
- 全体費用の5%を予備費として計上

## 前提条件

### 見積有効期限
本見積の有効期限は作成日より3ヶ月間とします。

### 支払条件
- 契約時: 30%
- 納品時: 60%
- 検収時: 10%

### 納品条件
- 工場据付完了時点
- 試運転合格後

## 注意事項

1. 本見積は概算見積です。詳細設計後に金額が変動する場合があります。
2. 為替変動、原材料価格変動により価格が変更される場合があります。
3. 顧客側の既存設備改修費用は含まれておりません。
4. 運転人員の教育費用は別途お見積りします。

---

**作成日**: ${new Date().toLocaleDateString('ja-JP')}
**作成者**: 購買部
**見積番号**: Q-${projectInfo.projectId || "未設定"}-${new Date().getFullYear()}

---
*本見積書はREQUISITION Generatorにより自動生成されました。*
`;
  };

  const generateRiskAnalysisContent = () => {
    const hasRiskItems = scope.selectedItems?.some(item => item.type === "risk" || item.category === "リスク管理");

    if (!hasRiskItems) {
      return "# リスク分析レポート\n\n**注**: スコープ選択でリスク分析が選択されていません。\n\nスコープ選択画面で「リスク分析レポートの作成」を選択して再生成してください。";
    }

    return `# リスク分析レポート

## プロジェクト概要
- **案件名**: ${projectInfo.projectName || "未設定"}
- **プロジェクトID**: ${projectInfo.projectId || "未設定"}
- **分析日**: ${new Date().toLocaleDateString('ja-JP')}
- **担当者**: ${projectInfo.responsiblePM || "未設定"}

## 1. スケジュールリスク

### 1.1 納期の妥当性評価
- **要求納期**: ${analysis?.schedule?.deadline || "未設定"}
- **標準工期**: 通常6ヶ月
- **評価**: ${scope.priority === "high" ? "スケジュールが厳しい" : "妥当な範囲"}

### 1.2 クリティカルパス分析
1. **設計完了** → 2. **機器手配** → 3. **製造** → 4. **据付** → 5. **試運転** → 6. **納品**

最長経路: 設計(2ヶ月) + 機器手配(1ヶ月) + 製造(1ヶ月) + 据付(0.5ヶ月) + 試運転(0.5ヶ月) = 5ヶ月

### 1.3 スケジュールリスク評価

| リスクID | リスク項目 | 発生確率 | 影響度 | リスク値 | 対策優先度 |
|---------|-----------|---------|--------|---------|-----------|
| S001 | 設計遅延 | 中 | 高 | 高 | 高 |
| S002 | 機器納期遅延 | 中 | 中 | 中 | 中 |
| S003 | 据付工事遅延 | 低 | 中 | 低 | 低 |

### 1.4 対策
- **設計遅延**: 早期発注、並行作業
- **機器納期遅延**: 代替メーカー検討、安全在庫確保
- **据付工事遅延**: 事前準備の徹底、専門業者確保

## 2. コストリスク

### 2.1 予算超過の可能性
- **予算上限**: ${analysis?.budget?.max || "未設定"}
- **見積総額**: 見積明細を参照
- **バッファ率**: 10%
- **評価**: 予算内で収まる見込み

### 2.2 コスト要因分析

| コスト要因 | 変動要因 | 影響度 | 対策 |
|-----------|---------|--------|------|
| 材料費 | 原材料価格変動 | 中 | 早期契約、価格固定条項 |
| 人件費 | 残業・特急手当 | 中 | 工程管理の徹底 |
| 為替レート | 円安進行 | 低 | 円建て契約の推進 |

### 2.3 隠れコストの可能性
- 予期せぬ設計変更: 100-200万円
- 追加試験費用: 50-100万円
- トレーニング費用: 30-50万円

## 3. 技術リスク

### 3.1 技術的実現可能性
- **新技術採用**: なし（既存技術の応用）
- **技術的難易度**: 中
- **実現可能性**: 95%以上

### 3.2 既存システムとの整合性
- **接続インターフェース**: 標準規格 (OPC UA)
- **データ互換性**: 確保済み
- **運用継続性**: 切替時停止時間最小化

### 3.3 技術者のスキルギャップ

| 技術分野 | 必要スキル | 現有スキル | ギャップ | 対策 |
|---------|-----------|-----------|---------|------|
| PLC制御 | IEC 61131-3 | あり | なし | - |
| HMI設計 | C#/JavaScript | 一部あり | 中 | 研修 |
| ネットワーク | 工業イーサネット | あり | なし | - |

## 4. 要件リスク

### 4.1 要件の明確性
- **仕様書完成度**: 80%
- **未確定項目**: ${analysis?.requirements?.functional?.must?.length > 0 ? "一部あり" : "多数あり"}
- **顧客確認**: 要追加

### 4.2 要件変更の可能性
- **変更確率**: 中（30%）
- **主な変更要因**: 現場制約、品質要求
- **影響範囲**: 設計、製造、スケジュール

### 4.3 ステークホルダー間の合意度
- **技術部**: 合意済み
- **製造部**: 概ね合意
- **品質部**: 要協議
- **購買部**: 合意済み

## 5. 品質リスク

### 5.1 テスト期間の妥当性
- **計画テスト期間**: 2週間
- **推奨テスト期間**: 3-4週間
- **評価**: やや短いが、事前準備で対応可能

### 5.2 品質基準の明確性
- **品質目標**: 明確化済み
- **測定基準**: 一部未確定
- **合格基準**: 要定義

### 5.3 品質保証体制
- **品質管理体制**: 整備済み
- **レビュープロセス**: 導入済み
- **テスト環境**: 要準備

## 6. 外部リスク

### 6.1 ベンダー依存度
- **主要サプライヤー**: 3社に分散
- **単一障害点**: なし
- **代替サプライヤー**: 確保済み

### 6.2 法規制変更の可能性
- **関連法規**: 労働安全衛生法、電気用品安全法
- **変更リスク**: 低
- **対応準備**: 保守契約にて対応

### 6.3 災害等の外部要因
- **地震リスク**: 中（工場所在地）
- **台風リスク**: 中
- **感染症リスク**: 低

## 7. リスク評価マトリクス

### 7.1 総合リスク評価

| リスクレベル | 発生確率×影響度 | 対応方針 |
|-------------|----------------|----------|
| 高 (赤) | > 0.6 | 即時対策、上層部報告 |
| 中 (黄) | 0.3-0.6 | 計画的対策、定期進捗管理 |
| 低 (緑) | < 0.3 | 定期的監視、文書化 |

### 7.2 主要リスクTOP3

1. **設計遅延リスク** (S001)
   - リスク値: 高
   - 要因: 要件確定の遅れ
   - 対策: 早期要件定義、並行作業

2. **技術スキルギャップ** (T001)
   - リスク値: 中
   - 要因: 新技術導入
   - 対策: 事前研修、外部支援

3. **品質基準未確定** (Q001)
   - リスク値: 中
   - 要因: 顧客との合意不足
   - 対策: 早期合意形成

## 8. 対策一覧

| リスクID | 予防策 | 発生時対応 | 責任者 | 期限 |
|---------|--------|-----------|--------|------|
| S001 | 早期要件定義 | 並行作業、追加要員 | 設計部長 | 設計開始時 |
| T001 | 事前研修 | 外部専門家支援 | 技術部長 | 製造開始前 |
| Q001 | 早期合議 | 品質基準の確定 | 品質部長 | 設計完了前 |

## 9. 総合評価

### 9.1 プロジェクト全体のリスクレベル
**中リスク** - 計画的なリスク管理により実施可能

### 9.2 実施可否の推奨
**条件付推奨** - 以下の条件を満たす場合に実施を推奨

- 要件定義を1ヶ月以内に完了すること
- 主要技術者の研修を計画に含めること
- 品質基準を早期に合意すること

### 9.3 推奨事項

1. **プロジェクト管理体制の強化**
   - 週次進捗会議の設置
   - リスク管理シートの作成・維持
   - 上層部への定期報告

2. **技術準備の早期化**
   - 技術研修の事前実施
   - 試作機による技術検証
   - 外部専門家の事前相談

3. **品質保証の徹底**
   - 品質基準の文書化
   - テスト計画の早期策定
   - 第三者によるレビューの実施

## 10. モニタリング計画

### 10.1 定期評価
- **月次リスク評価**: 毎月最終金曜日
- **四半期見直し**: 3ヶ月ごと
- **重大事象報告**: 発生時48時間以内

### 10.2 成功指標 (KPI)
- スケジュール遵守率: 95%以上
- 予算遵守率: 110%以内
- 品質合格率: 98%以上
- リスク対応実施率: 100%

---

**作成者**: ${projectInfo.responsiblePM || "プロジェクトマネージャー"}
**承認者**: [リスク管理責任者]
**最終更新**: ${new Date().toLocaleDateString('ja-JP')}

---
*本リスク分析レポートはREQUISITION Generatorにより自動生成されました。*
`;
  };

  const generateDocuments = async () => {
    setIsGenerating(true);
    setProgress(0);

    const documents = {};

    // 購入要求書
    setProgress(20);
    await new Promise(resolve => setTimeout(resolve, 500));
    documents.requisition = generateRequisitionContent();

    // 技術仕様書
    setProgress(40);
    await new Promise(resolve => setTimeout(resolve, 500));
    documents.technical = generateTechnicalSpecContent();

    // コスト見積
    setProgress(60);
    await new Promise(resolve => setTimeout(resolve, 500));
    documents.cost = generateCostEstimateContent();

    // リスク分析
    setProgress(80);
    await new Promise(resolve => setTimeout(resolve, 500));
    documents.risk = generateRiskAnalysisContent();

    // 進捗完了
    setProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300));

    setGeneratedDocs(documents);
    setIsGenerating(false);
    onDocumentsGenerated(documents);
  };

  const availableDocs = [
    { id: "requisition", name: "購入要求書", description: "メインの購入要求書" },
    { id: "technical", name: "技術仕様書", description: "詳細な技術仕様" },
    { id: "cost", name: "コスト見積明細", description: "詳細なコスト内訳" },
    { id: "risk", name: "リスク分析レポート", description: "リスク評価と対策" }
  ];

  const documentExists = (docId) => {
    return generatedDocs[docId] || (scope.selectedItems?.some(item =>
      (item.type === "technical" && docId === "technical") ||
      (item.type === "cost" && docId === "cost") ||
      (item.type === "risk" && docId === "risk")
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">複数ドキュメント生成</h2>

      {!isGenerating && Object.keys(generatedDocs).length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">ドキュメント生成準備完了</h3>
          <p className="text-slate-600 mb-6">
            スコープ選択に基づいて以下のドキュメントを生成します
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6 text-left max-w-2xl mx-auto">
            {availableDocs.map(doc => (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border ${
                  documentExists(doc.id)
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    documentExists(doc.id) ? "bg-green-500" : "bg-gray-400"
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-900">{doc.name}</h4>
                    <p className="text-sm text-slate-600">{doc.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generateDocuments}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            ドキュメント生成開始
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">ドキュメント生成中...</h3>
          <p className="text-slate-600 mb-4">
            {progress < 25 && "購入要求書を生成中..."}
            {progress >= 25 && progress < 50 && "技術仕様書を生成中..."}
            {progress >= 50 && progress < 75 && "コスト見積明細を生成中..."}
            {progress >= 75 && progress < 100 && "リスク分析レポートを生成中..."}
            {progress === 100 && "生成完了！"}
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">{progress}% 完了</p>
        </div>
      )}

      {Object.keys(generatedDocs).length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900">生成完了</h3>
              <p className="text-slate-600">{Object.keys(generatedDocs).length}件のドキュメントが生成されました</p>
            </div>
            <button
              onClick={generateDocuments}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              再生成
            </button>
          </div>

          <div className="border-b border-slate-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {availableDocs.filter(doc => documentExists(doc.id)).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeDoc === doc.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {doc.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-slate-800 font-mono leading-relaxed">
                {generatedDocs[activeDoc] || "ドキュメントが選択されていません"}
              </pre>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                const blob = new Blob([generatedDocs[activeDoc]], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${availableDocs.find(doc => doc.id === activeDoc)?.name || "document"}_${new Date().toISOString().split('T')[0]}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              ダウンロード
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedDocs[activeDoc]);
              }}
              className="px-4 py-2 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 transition-colors"
            >
              クリップボードにコピー
            </button>
          </div>
        </div>
      )}
    </div>
  );
}