import { llmService } from './service';
import { LLMRequest } from './types';

export interface ReportData {
  creditData: {
    anCredits: number;
    panCredits: number;
    cfCredits: number;
    totalCredits: number;
    usage: Array<{
      date: string;
      creditsUsed: number;
      purpose: string;
    }>;
  };
  productionData: {
    anInput: number;
    panProduction: number;
    cfProduction: number;
    efficiency: number;
    quality: number;
  };
  supplierData: Array<{
    name: string;
    sustainability: number;
    reliability: number;
    lastDelivery: string;
  }>;
  auditData: {
    lastAudit: string;
    nextAudit: string;
    compliance: number;
    findings: Array<{
      severity: 'high' | 'medium' | 'low';
      description: string;
      status: 'open' | 'resolved';
    }>;
  };
}

export interface ReportRequest {
  type: 'credit-audit' | 'supplier-evaluation' | 'production-efficiency' | 'sustainability-progress' | 'risk-assessment';
  data: ReportData;
  language: 'ja' | 'en';
  includeRecommendations: boolean;
  provider?: string;
}

export interface ReportSection {
  title: string;
  content: string;
  charts?: Array<{
    type: 'line' | 'bar' | 'pie';
    data: Record<string, unknown>;
    title: string;
  }>;
  tables?: Array<{
    headers: string[];
    rows: string[][];
    title: string;
  }>;
}

export interface GeneratedReport {
  title: string;
  summary: string;
  sections: ReportSection[];
  recommendations?: string[];
  metadata: {
    generatedAt: Date;
    provider: string;
    model: string;
    tokensUsed: number;
    cost: number;
  };
}

export class AIReportEngine {
  private reportTemplates = {
    'credit-audit': {
      systemPrompt: `あなたはISCC+クレジット監査の専門家です。以下のデータに基づいて、クレジット監査レポートを作成してください。

【重要】これは「クレジット監査レポート」です。クレジットの監査とコンプライアンスに特化した内容を作成してください。

【レポート構造の指示】
まず、タイトルを見出し1（# ）で記述し、その後に要約を2-3文で記述してください。
要約の後、以下のセクションを見出し2（## ）で記述してください：

## クレジット残高分析
## 使用状況分析
## コンプライアンス評価
## 異常検知結果
## 改善推奨事項

各セクションでは具体的な数値と分析結果を記載してください。

データは日本語で提供されていますが、レポートは{{language}}で作成してください。`,
      analysisPrompt: (data: ReportData) => `
【クレジット監査レポート作成用データ】

クレジット残高：
- ANクレジット: ${data.creditData.anCredits} 単位
- PANクレジット: ${data.creditData.panCredits} 単位
- CFクレジット: ${data.creditData.cfCredits} 単位
- 総クレジット: ${data.creditData.totalCredits} 単位

クレジット使用履歴：
${data.creditData.usage.map(u => `- ${u.date}: ${u.creditsUsed}単位使用 (${u.purpose})`).join('\n')}

監査コンプライアンス情報：
- 前回監査日: ${data.auditData.lastAudit}
- 次回監査予定: ${data.auditData.nextAudit}
- コンプライアンススコア: ${data.auditData.compliance}%

監査指摘事項：
${data.auditData.findings.map(f => `- ${f.severity}レベル: ${f.description} (${f.status})`).join('\n')}

上記データを基に、クレジット監査の専門家として、ISCC+クレジットシステムの監査結果を詳細に分析し、具体的な数値と評価を含めたレポートを作成してください。特にコンプライアンスとリスク管理に焦点を当ててください。`
    },
    'supplier-evaluation': {
      systemPrompt: `あなたはサプライヤー評価の専門家です。提供されたサプライヤーデータに基づいて評価レポートを作成してください。

【重要】これは「サプライヤー評価レポート」です。サプライヤーの持続可能性と信頼性の評価に特化した内容を作成してください。

【レポート構造の指示】
まず、タイトルを見出し1（# ）で記述し、その後に要約を2-3文で記述してください。
要約の後、以下のセクションを見出し2（## ）で記述してください：

## サプライヤー概要
## 持続可能性評価
## 信頼性評価
## リスク分析
## 改善推奨事項

各セクションでは具体的な評価基準と結果を記載してください。

レポートは{{language}}で作成してください。`,
      analysisPrompt: (data: ReportData) => `
【サプライヤー評価レポート作成用データ】

サプライヤー評価一覧：
${data.supplierData.map(s => `
【${s.name}】
- 持続可能性スコア: ${s.sustainability}%
- 信頼性スコア: ${s.reliability}%
- 最終納入日: ${s.lastDelivery}
`).join('')}

評価基準：
- 持続可能性90%以上: 優れた環境配慮
- 信頼性90%以上: 優れた納期遵守
- 納入遅延がある場合: 信頼性に問題あり

上記データを基に、サプライヤー管理の専門家として、各サプライヤーの持続可能性と信頼性を詳細に評価し、サプライヤー選定の具体的な推奨事項を含めたレポートを作成してください。特にサプライヤーリスクと供給チェーンの安定性に焦点を当ててください。`
    },
    'production-efficiency': {
      systemPrompt: `あなたはISCC+認証工場の生産効率分析の専門家です。提供された生産データに基づいて、生産効率分析レポートを作成してください。

【重要】これは「生産効率分析レポート」です。生産プロセスの効率性と品質管理に特化した内容を作成してください。

【レポート構造の指示】
まず、タイトルを見出し1（# ）で記述し、その後に要約を2-3文で記述してください。
要約の後、以下のセクションを見出し2（## ）で記述してください：

## 生産実績概要
## 効率性分析
## 品質評価
## ボトルネック分析
## 改善提案

各セクションでは具体的な数値データと分析結果を記載してください。

データは日本語で提供されていますが、レポートは{{language}}で作成してください。`,
      analysisPrompt: (data: ReportData) => `
【生産効率分析レポート作成用データ】

生産実績データ：
- AN投入量: ${data.productionData.anInput} トン
- PAN生産量: ${data.productionData.panProduction} トン
- CF生産量: ${data.productionData.cfProduction} トン
- 生産効率: ${data.productionData.efficiency}%
- 品質スコア: ${data.productionData.quality}%

計算指標：
- PAN変換効率: ${((data.productionData.panProduction / data.productionData.anInput) * 100).toFixed(1)}%
- CF変換効率: ${((data.productionData.cfProduction / data.productionData.anInput) * 100).toFixed(1)}%

評価基準：
- 効率性85%以上: 優れた生産効率
- 品質スコア90%以上: 高品質生産
- 効率性80%未満: 改善が必要

上記データを基に、生産効率分析の専門家として、ISCC+認証工場の生産プロセス効率を詳細に分析し、具体的な数値と評価を含めたレポートを作成してください。特に生産性向上と品質安定化に焦点を当ててください。`
    },
    'sustainability-progress': {
      systemPrompt: `あなたはISCC+認証におけるサステナビリティ進捗管理の専門家です。提供されたデータに基づいて、サステナビリティ進捗報告書を作成してください。

【重要】これは「サステナビリティ進捗報告書」です。環境配慮と持続可能な生産活動の進捗管理に特化した内容を作成してください。

【レポート構造の指示】
まず、タイトルを見出し1（# ）で記述し、その後に要約を2-3文で記述してください。
要約の後、以下のセクションを見出し2（## ）で記述してください：

## サステナビリティ進捗概要
## 環境影響評価
## 目標達成状況
## 課題と機会
## 今後のアクションプラン

各セクションでは具体的な進捗データと評価結果を記載してください。

データは日本語で提供されていますが、レポートは{{language}}で作成してください。`,
      analysisPrompt: (data: ReportData) => `
【サステナビリティ進捗報告書作成用データ】

総合サステナビリティ指標：
- ISCC+クレジット総量: ${data.creditData.totalCredits} 単位
- 生産効率: ${data.productionData.efficiency}%
- 品質スコア: ${data.productionData.quality}%
- コンプライアンススコア: ${data.auditData.compliance}%

クレジット内訳：
- ANクレジット: ${data.creditData.anCredits} 単位
- PANクレジット: ${data.creditData.panCredits} 単位
- CFクレジット: ${data.creditData.cfCredits} 単位

サプライヤーサステナビリティ評価：
${data.supplierData.map(s => `
【${s.name}】
- 持続可能性スコア: ${s.sustainability}%
- 信頼性スコア: ${s.reliability}%
- 最終納入日: ${s.lastDelivery}
`).join('')}

評価基準：
- 総合サステナビリティ90%以上: 優れた環境配慮
- サプライヤー持続可能性85%以上: グリーンサプライヤー
- コンプライアンス95%以上: 優れたガバナンス

上記データを基に、サステナビリティ進捗管理の専門家として、ISCC+認証における持続可能な生産活動の進捗を詳細に分析し、具体的な数値と評価を含めた報告書を作成してください。特に環境負荷削減と持続可能性向上に焦点を当ててください。`
    },
    'risk-assessment': {
      systemPrompt: `あなたはISCC+認証システムにおけるリスク評価の専門家です。提供されたデータに基づいて、包括的なリスク評価レポートを作成してください。

【重要】これは「リスク評価レポート」です。ISCC+クレジットシステム全体のリスク要因分析とリスク管理に特化した内容を作成してください。

【レポート構造の指示】
まず、タイトルを見出し1（# ）で記述し、その後に要約を2-3文で記述してください。
要約の後、以下のセクションを見出し2（## ）で記述してください：

## リスク評価概要
## 主要リスクの特定
## リスクレベル評価
## 緩和策の提案
## 監視計画

各セクションでは具体的なリスクデータと評価結果を記載してください。

データは日本語で提供されていますが、レポートは{{language}}で作成してください。`,
      analysisPrompt: (data: ReportData) => `
【リスク評価レポート作成用データ】

クレジットリスク評価：
- ANクレジット残高: ${data.creditData.anCredits} 単位
- PANクレジット残高: ${data.creditData.panCredits} 単位
- CFクレジット残高: ${data.creditData.cfCredits} 単位
- 総クレジット: ${data.creditData.totalCredits} 単位

クレジット使用状況：
${data.creditData.usage.map(u => `- ${u.date}: ${u.creditsUsed}単位 (${u.purpose})`).join('\n')}

サプライヤーリスク評価：
${data.supplierData.map(s => `
【${s.name}】
- 持続可能性リスク: ${100 - s.sustainability}% (リスクレベル)
- 信頼性リスク: ${100 - s.reliability}% (リスクレベル)
- 最終納入日: ${s.lastDelivery}
`).join('')}

監査コンプライアンスリスク：
- コンプライアンススコア: ${data.auditData.compliance}% (リスクレベル: ${100 - data.auditData.compliance}%)
- 前回監査日: ${data.auditData.lastAudit}
- 次回監査予定: ${data.auditData.nextAudit}
- 未解決の監査指摘事項: ${data.auditData.findings.filter(f => f.status === 'open').length}件

生産プロセスリスク：
- 生産効率リスク: ${100 - data.productionData.efficiency}% (効率性低下リスク)
- 品質リスク: ${100 - data.productionData.quality}% (品質低下リスク)

監査指摘事項詳細：
${data.auditData.findings.map(f => `- ${f.severity}レベル: ${f.description} (${f.status})`).join('\n')}

評価基準：
- リスクレベル20%未満: 低リスク（監視不要）
- リスクレベル20-50%: 中リスク（定期監視）
- リスクレベル50%以上: 高リスク（即時対応）

上記データを基に、リスク評価の専門家として、ISCC+クレジットシステム全体のリスク要因を詳細に分析し、具体的なリスクレベル評価と緩和策を含めたレポートを作成してください。特に予防的リスク管理と事業継続性に焦点を当ててください。`
    }
  };

  async generateReport(request: ReportRequest): Promise<GeneratedReport> {
    console.log('🔍 AI Report Engine - Generating report:', request.type);
    console.log('🔍 Using provider:', request.provider || 'deepseek');

    const template = this.reportTemplates[request.type];
    if (!template) {
      throw new Error(`Unknown report type: ${request.type}`);
    }

    const systemPrompt = template.systemPrompt.replace('{{language}}', request.language);
    const analysisPrompt = template.analysisPrompt(request.data);

    console.log('🔍 Request language:', request.language);
    console.log('🔍 System prompt after language replacement:', systemPrompt.substring(0, 200) + '...');

    console.log('🔍 System prompt length:', systemPrompt.length);
    console.log('🔍 Analysis prompt length:', analysisPrompt.length);
    console.log('🔍 Analysis prompt preview:', analysisPrompt.substring(0, 200) + '...');

    const llmRequest: LLMRequest = {
      provider: request.provider || 'deepseek', // デフォルトをDeepseekに変更
      prompt: analysisPrompt,
      systemPrompt,
      maxTokens: 4000,
      temperature: 0.7,
    };

    console.log('🔍 Sending LLM request...');
    const response = await llmService.generateResponse(llmRequest);
    console.log('🔍 LLM response received:', response.content.substring(0, 100) + '...');
    console.log('🔍 Tokens used:', response.tokensUsed);

    const report = this.parseLLMResponse(response.content, request.type);

    if (request.includeRecommendations) {
      report.recommendations = await this.generateRecommendations(request.data, request.provider, request.type, request.language);
    }

    return {
      ...report,
      metadata: {
        generatedAt: new Date(),
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed.input + response.tokensUsed.output,
        cost: response.cost || 0,
      },
    };
  }

  private parseLLMResponse(content: string, reportType: string): Omit<GeneratedReport, 'metadata' | 'recommendations'> {
    console.log('🔍 Parsing LLM response for report type:', reportType);
    console.log('🔍 Raw LLM response content:', content.substring(0, 500) + '...');

    const lines = content.split('\n');
    let title = '';
    let summary = '';
    const sections: ReportSection[] = [];
    let currentSection: Partial<ReportSection> = {};
    let inSection = false;
    let foundFirstSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
        // 最初のセクションが見つかったら、それ以降は要約の収集を停止
        if (!foundFirstSection) {
          foundFirstSection = true;
        }

        if (currentSection.title && currentSection.content) {
          sections.push(currentSection as ReportSection);
        }

        const sectionTitle = trimmed.replace(/^#+\s*/, '');
        if (!title) {
          title = sectionTitle;
        } else {
          currentSection = { title: sectionTitle, content: '' };
          inSection = true;
        }
      } else if (inSection) {
        currentSection.content += trimmed + '\n';
      } else if (!foundFirstSection) {
        // 最初のセクションが見つかるまで、すべてのコンテンツを要約として収集
        if (summary) {
          summary += ' ';
        }
        summary += trimmed;
      }
    }

    if (currentSection.title && currentSection.content) {
      sections.push(currentSection as ReportSection);
    }

    // 要約が空の場合、セクションの最初の内容を要約として使用
    if (!summary && sections.length > 0) {
      summary = sections[0].content.substring(0, 200) + '...';
    }

    const result = {
      title: title || `${reportType} Report`,
      summary: summary || 'レポートの要約が生成されませんでした。AIによる分析結果は各セクションを参照してください。',
      sections,
    };

    console.log('🔍 Parsed report result:', {
      title: result.title,
      summary: result.summary.substring(0, 100) + '...',
      sectionsCount: result.sections.length,
      sections: result.sections.map(s => ({ title: s.title, contentLength: s.content.length }))
    });

    return result;
  }

  private async generateRecommendations(data: ReportData, provider?: string, reportType?: string, language: 'ja' | 'en' = 'ja'): Promise<string[]> {
    console.log('🔍 Generating recommendations for report type:', reportType, 'language:', language);

    const languageInstructions = {
      ja: {
        instruction: '以下の改善推奨事項を日本語で作成してください。',
        format: '各推奨事項は具体的で実行可能な内容とし、データに基づいた深い洞察を含めてください。',
        focus: '項目を絞り、質の高い、戦略的な提言に焦点を当ててください。'
      },
      en: {
        instruction: 'Please create the following recommendations in English.',
        format: 'Each recommendation should be specific, actionable, and include deep insights based on the data.',
        focus: 'Focus on fewer, high-quality, strategic recommendations rather than many generic ones.'
      }
    };

    const lang = languageInstructions[language];

    const recommendationPrompts = language === 'ja' ? {
      'credit-audit': `
${lang.instruction}

${lang.format}
${lang.focus}

【クレジット監査データ】
クレジット残高:
- ANクレジット: ${data.creditData.anCredits} 単位
- PANクレジット: ${data.creditData.panCredits} 単位
- CFクレジット: ${data.creditData.cfCredits} 単位
- 総クレジット: ${data.creditData.totalCredits} 単位

使用トレンド:
${data.creditData.usage.map(u => `- ${u.date}: ${u.creditsUsed}単位 (${u.purpose})`).join('\n')}

監査状況:
- コンプライアンススコア: ${data.auditData.compliance}%
- 未解決指摘事項: ${data.auditData.findings.filter(f => f.status === 'open').length}件
- 指摘内容: ${data.auditData.findings.map(f => `${f.description}(${f.severity})`).join(', ')}

【戦略的分析のポイント】
1. クレジットバランスの最適化（AN→PAN→CFの流れ）
2. コンプライアンススコア${data.auditData.compliance}%から見えるリスク
3. 使用パターンからの異常検知可能性
4. 未解決指摘事項の優先度と影響度

ISCC+クレジット監査の専門家として、上記データを深く分析し、具体的な数値目標と実行計画を含む3-5つの戦略的推奨事項を作成してください。`,

      'supplier-evaluation': `
${lang.instruction}

${lang.format}
${lang.focus}

【サプライヤー評価データ】
${data.supplierData.map(s => `
${s.name}:
- 持続可能性: ${s.sustainability}% (${s.sustainability >= 90 ? '優秀' : s.sustainability >= 85 ? '良好' : '改善必要'})
- 信頼性: ${s.reliability}% (${s.reliability >= 90 ? '優秀' : s.reliability >= 85 ? '良好' : '改善必要'})
- 最終納入: ${s.lastDelivery} (${new Date(s.lastDelivery) > new Date(Date.now() - 7*24*60*60*1000) ? '最新' : '遅延'})
`).join('')}

【サプライヤー別分析】
- 最優秀サプライヤー: ${data.supplierData.reduce((best, current) => (current.sustainability + current.reliability) > (best.sustainability + best.reliability) ? current : best).name}
- リスク要因: ${data.supplierData.filter(s => s.sustainability < 85 || s.reliability < 85).map(s => s.name).join(', ')}

【戦略的考察ポイント】
1. サプライヤー間のパフォーマンス格差とその原因
2. 持続可能性と信頼性の相関関係分析
3. 納期遅延の根本原因と影響度
4. 供給チェーンの最適化機会

サプライヤー管理の専門家として、具体的な改善目標と実施スケジュールを含む3-5つの戦略的推奨事項を作成してください。`,

      'production-efficiency': `
${lang.instruction}

${lang.format}
${lang.focus}

【生産効率データ】
投入・産出:
- AN投入量: ${data.productionData.anInput} トン
- PAN生産量: ${data.productionData.panProduction} トン
- CF生産量: ${data.productionData.cfProduction} トン

効率性指標:
- 総合生産効率: ${data.productionData.efficiency}% (${data.productionData.efficiency >= 85 ? '優秀' : data.productionData.efficiency >= 80 ? '標準' : '改善必要'})
- 品質スコア: ${data.productionData.quality}% (${data.productionData.quality >= 90 ? '高品質' : data.productionData.quality >= 85 ? '標準' : '改善必要'})
- PAN変換効率: ${((data.productionData.panProduction / data.productionData.anInput) * 100).toFixed(1)}%
- CF変換効率: ${((data.productionData.cfProduction / data.productionData.anInput) * 100).toFixed(1)}%

【ボトルネック分析】
- PANへの変換効率: ${((data.productionData.panProduction / data.productionData.anInput) * 100).toFixed(1)}%
- CFへの変換効率: ${((data.productionData.cfProduction / data.productionData.anInput) * 100).toFixed(1)}%
- 総合ロス率: ${((1 - data.productionData.efficiency/100) * 100).toFixed(1)}%

【改善機会の特定】
1. 現在の効率性${data.productionData.efficiency}%から目標値90%へのギャップ分析
2. 品質スコア${data.productionData.quality}%と効率性のトレードオフ関係
3. PANからCFへの変換プロセスにおける損失要因
4. 投入資源の最適配分方案

生産効率分析の専門家として、具体的な数値目標とROI（投資対効果）を考慮した3-5つの戦略的推奨事項を作成してください。`,

      'sustainability-progress': `
${lang.instruction}

${lang.format}
${lang.focus}

【サステナビリティ総合評価】
コア指標:
- ISCC+クレジット総量: ${data.creditData.totalCredits} 単位
- 生産効率: ${data.productionData.efficiency}% (${data.productionData.efficiency >= 85 ? '優秀' : '改善必要'})
- 品質スコア: ${data.productionData.quality}% (${data.productionData.quality >= 90 ? '高品質' : '改善必要'})
- コンプライアンス: ${data.auditData.compliance}% (${data.auditData.compliance >= 95 ? '優秀' : '改善必要'})

サプライヤーサステナビリティ:
${data.supplierData.map(s => `- ${s.name}: ${s.sustainability}% (${s.sustainability >= 85 ? 'グリーン' : s.sustainability >= 80 ? '標準' : '改善必要'})`).join('\n')}

【総合サステナビリティスコア算出】
総合スコア = (生産効率${data.productionData.efficiency}% + 品質${data.productionData.quality}% + コンプライアンス${data.auditData.compliance}%) / 3 = ${((data.productionData.efficiency + data.productionData.quality + data.auditData.compliance) / 3).toFixed(1)}%

【進捗評価とギャップ分析】
- 現在の総合スコア: ${((data.productionData.efficiency + data.productionData.quality + data.auditData.compliance) / 3).toFixed(1)}%
- 目標総合スコア: 90%
- 改善必要領域: ${[
  data.productionData.efficiency < 85 ? '生産効率' : '',
  data.productionData.quality < 90 ? '品質' : '',
  data.auditData.compliance < 95 ? 'コンプライアンス' : ''
].filter(x => x).join(', ') || 'すべて順調'}

サステナビリティ進捗管理の専門家として、SDGs目標達成に貢献する具体的な数値目標と実施計画を含む3-5つの戦略的推奨事項を作成してください。`,

      'risk-assessment': `
${lang.instruction}

${lang.format}
${lang.focus}

【リスクマトリックス分析】
定量リスク評価:
- クレジット残高リスク: ${Math.max(0, 100 - (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) / 100).toFixed(1)}% (${(data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) < 3000 ? '高' : '中'})
- 生産効率リスク: ${(100 - data.productionData.efficiency).toFixed(1)}% (${data.productionData.efficiency < 80 ? '高' : data.productionData.efficiency < 85 ? '中' : '低'})
- 品質リスク: ${(100 - data.productionData.quality).toFixed(1)}% (${data.productionData.quality < 85 ? '高' : data.productionData.quality < 90 ? '中' : '低'})
- コンプライアンスリスク: ${(100 - data.auditData.compliance).toFixed(1)}% (${data.auditData.compliance < 90 ? '高' : data.auditData.compliance < 95 ? '中' : '低'})

サプライヤーリスクプロファイル:
${data.supplierData.map(s => `- ${s.name}: 信頼性リスク${(100 - s.reliability).toFixed(1)}%(${s.reliability < 85 ? '高' : '中'}), 持続可能性リスク${(100 - s.sustainability).toFixed(1)}%(${s.sustainability < 85 ? '高' : '中'})`).join('\n')}

【緊急度対応マトリックス】
高リスク項目: ${[
  (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) < 3000 ? 'クレジット残高不足' : '',
  data.productionData.efficiency < 80 ? '生産効率低下' : '',
  data.productionData.quality < 85 ? '品質問題' : '',
  data.auditData.compliance < 90 ? 'コンプライアンス違反' : '',
  data.auditData.findings.filter(f => f.status === 'open').length > 2 ? '未解決監査指摘' : ''
].filter(x => x).join(', ') || '該当なし'}

【事業継続性影響度評価】
総合リスクスコア: ${(
  (100 - Math.max(0, 100 - (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) / 100)) +
  data.productionData.efficiency +
  data.productionData.quality +
  data.auditData.compliance
) / 4}.toFixed(1)}%

リスク評価の専門家として、具体的な軽減目標と実施タイムラインを含む3-5つの戦略的リスク管理推奨事項を作成してください。`
    } : {
      'credit-audit': `
${lang.instruction}

${lang.format}
${lang.focus}

[Credit Audit Data]
Credit Balance:
- AN Credits: ${data.creditData.anCredits} units
- PAN Credits: ${data.creditData.panCredits} units
- CF Credits: ${data.creditData.cfCredits} units
- Total Credits: ${data.creditData.totalCredits} units

Usage Trends:
${data.creditData.usage.map(u => `- ${u.date}: ${u.creditsUsed} units used (${u.purpose})`).join('\n')}

Audit Status:
- Compliance Score: ${data.auditData.compliance}%
- Open Findings: ${data.auditData.findings.filter(f => f.status === 'open').length} items
- Findings: ${data.auditData.findings.map(f => `${f.description}(${f.severity})`).join(', ')}

[Strategic Analysis Points]
1. Credit balance optimization (AN→PAN→CF flow)
2. Risk visibility from ${data.auditData.compliance}% compliance score
3. Anomaly detection potential from usage patterns
4. Priority and impact of unresolved findings

As an ISCC+ credit audit expert, create 3-5 strategic recommendations with specific numerical targets and implementation plans.`,

      'supplier-evaluation': `
${lang.instruction}

${lang.format}
${lang.focus}

[Supplier Evaluation Data]
${data.supplierData.map(s => `
${s.name}:
- Sustainability: ${s.sustainability}% (${s.sustainability >= 90 ? 'Excellent' : s.sustainability >= 85 ? 'Good' : 'Needs Improvement'})
- Reliability: ${s.reliability}% (${s.reliability >= 90 ? 'Excellent' : s.reliability >= 85 ? 'Good' : 'Needs Improvement'})
- Last Delivery: ${s.lastDelivery} (${new Date(s.lastDelivery) > new Date(Date.now() - 7*24*60*60*1000) ? 'Recent' : 'Delayed'})
`).join('')}

[Supplier Analysis]
- Top Performer: ${data.supplierData.reduce((best, current) => (current.sustainability + current.reliability) > (best.sustainability + best.reliability) ? current : best).name}
- Risk Factors: ${data.supplierData.filter(s => s.sustainability < 85 || s.reliability < 85).map(s => s.name).join(', ')}

[Strategic Considerations]
1. Performance gaps between suppliers and root causes
2. Correlation analysis between sustainability and reliability
3. Root cause analysis of delivery delays and impact
4. Supply chain optimization opportunities

As a supplier management expert, create 3-5 strategic recommendations with specific improvement targets and implementation schedules.`,

      'production-efficiency': `
${lang.instruction}

${lang.format}
${lang.focus}

[Production Efficiency Data]
Input/Output:
- AN Input: ${data.productionData.anInput} tons
- PAN Production: ${data.productionData.panProduction} tons
- CF Production: ${data.productionData.cfProduction} tons

Efficiency Metrics:
- Overall Production Efficiency: ${data.productionData.efficiency}% (${data.productionData.efficiency >= 85 ? 'Excellent' : data.productionData.efficiency >= 80 ? 'Standard' : 'Needs Improvement'})
- Quality Score: ${data.productionData.quality}% (${data.productionData.quality >= 90 ? 'High Quality' : data.productionData.quality >= 85 ? 'Standard' : 'Needs Improvement'})
- PAN Conversion Efficiency: ${((data.productionData.panProduction / data.productionData.anInput) * 100).toFixed(1)}%
- CF Conversion Efficiency: ${((data.productionData.cfProduction / data.productionData.anInput) * 100).toFixed(1)}%

[Bottleneck Analysis]
- PAN conversion efficiency: ${((data.productionData.panProduction / data.productionData.anInput) * 100).toFixed(1)}%
- CF conversion efficiency: ${((data.productionData.cfProduction / data.productionData.anInput) * 100).toFixed(1)}%
- Overall loss rate: ${((1 - data.productionData.efficiency/100) * 100).toFixed(1)}%

[Improvement Opportunities]
1. Gap analysis from current ${data.productionData.efficiency}% efficiency to 90% target
2. Trade-off relationship between quality score ${data.productionData.quality}% and efficiency
3. Loss factors in PAN to CF conversion process
4. Optimal resource allocation plan

As a production efficiency expert, create 3-5 strategic recommendations with specific numerical targets and ROI considerations.`,

      'sustainability-progress': `
${lang.instruction}

${lang.format}
${lang.focus}

[Sustainability Comprehensive Assessment]
Core Metrics:
- ISCC+ Credit Total: ${data.creditData.totalCredits} units
- Production Efficiency: ${data.productionData.efficiency}% (${data.productionData.efficiency >= 85 ? 'Excellent' : 'Needs Improvement'})
- Quality Score: ${data.productionData.quality}% (${data.productionData.quality >= 90 ? 'High Quality' : 'Needs Improvement'})
- Compliance: ${data.auditData.compliance}% (${data.auditData.compliance >= 95 ? 'Excellent' : 'Needs Improvement'})

Supplier Sustainability:
${data.supplierData.map(s => `- ${s.name}: ${s.sustainability}% (${s.sustainability >= 85 ? 'Green' : s.sustainability >= 80 ? 'Standard' : 'Needs Improvement'})`).join('\n')}

[Overall Sustainability Score Calculation]
Overall Score = (Efficiency ${data.productionData.efficiency}% + Quality ${data.productionData.quality}% + Compliance ${data.auditData.compliance}%) / 3 = ${((data.productionData.efficiency + data.productionData.quality + data.auditData.compliance) / 3).toFixed(1)}%

[Progress Evaluation and Gap Analysis]
- Current Overall Score: ${((data.productionData.efficiency + data.productionData.quality + data.auditData.compliance) / 3).toFixed(1)}%
- Target Overall Score: 90%
- Areas Needing Improvement: ${[
  data.productionData.efficiency < 85 ? 'Production Efficiency' : '',
  data.productionData.quality < 90 ? 'Quality' : '',
  data.auditData.compliance < 95 ? 'Compliance' : ''
].filter(x => x).join(', ') || 'All on track'}

As a sustainability progress management expert, create 3-5 strategic recommendations contributing to SDGs goal achievement with specific numerical targets and implementation plans.`,

      'risk-assessment': `
${lang.instruction}

${lang.format}
${lang.focus}

[Risk Matrix Analysis]
Quantitative Risk Assessment:
- Credit Balance Risk: ${Math.max(0, 100 - (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) / 100).toFixed(1)}% (${(data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) < 3000 ? 'High' : 'Medium'})
- Production Efficiency Risk: ${(100 - data.productionData.efficiency).toFixed(1)}% (${data.productionData.efficiency < 80 ? 'High' : data.productionData.efficiency < 85 ? 'Medium' : 'Low'})
- Quality Risk: ${(100 - data.productionData.quality).toFixed(1)}% (${data.productionData.quality < 85 ? 'High' : data.productionData.quality < 90 ? 'Medium' : 'Low'})
- Compliance Risk: ${(100 - data.auditData.compliance).toFixed(1)}% (${data.auditData.compliance < 90 ? 'High' : data.auditData.compliance < 95 ? 'Medium' : 'Low'})

Supplier Risk Profiles:
${data.supplierData.map(s => `- ${s.name}: Reliability Risk ${(100 - s.reliability).toFixed(1)}%(${s.reliability < 85 ? 'High' : 'Medium'}), Sustainability Risk ${(100 - s.sustainability).toFixed(1)}%(${s.sustainability < 85 ? 'High' : 'Medium'})`).join('\n')}

[Urgency Response Matrix]
High Risk Items: ${[
  (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) < 3000 ? 'Insufficient Credit Balance' : '',
  data.productionData.efficiency < 80 ? 'Production Efficiency Decline' : '',
  data.productionData.quality < 85 ? 'Quality Issues' : '',
  data.auditData.compliance < 90 ? 'Compliance Violations' : '',
  data.auditData.findings.filter(f => f.status === 'open').length > 2 ? 'Unresolved Audit Findings' : ''
].filter(x => x).join(', ') || 'None'}

[Business Continuity Impact Assessment]
Overall Risk Score: ${(
  (100 - Math.max(0, 100 - (data.creditData.anCredits + data.creditData.panCredits + data.creditData.cfCredits) / 100)) +
  data.productionData.efficiency +
  data.productionData.quality +
  data.auditData.compliance
) / 4}.toFixed(1)}%

As a risk assessment expert, create 3-5 strategic risk management recommendations with specific mitigation targets and implementation timelines.`
    };

    const prompt = recommendationPrompts[reportType || 'credit-audit'] || recommendationPrompts['credit-audit'];

    const request: LLMRequest = {
      provider: provider || 'deepseek',
      prompt,
      maxTokens: 1500,
      temperature: 0.7,
    };

    const response = await llmService.generateResponse(request);

    return response.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[\d+\-\.\s\*]+/, '').trim())
      .filter(line => line.length > 10);
  }

  async getReportTypes(): Promise<Array<{ id: string; name: string; description: string }>> {
    return [
      {
        id: 'credit-audit',
        name: 'クレジット監査レポート',
        description: 'ISCC+クレジットの使用状況とコンプライアンスに関する詳細監査レポート'
      },
      {
        id: 'supplier-evaluation',
        name: 'サプライヤー評価レポート',
        description: 'サプライヤーの持続可能性と信頼性に関する評価レポート'
      },
      {
        id: 'production-efficiency',
        name: '生産効率分析レポート',
        description: '生産プロセスの効率性と品質に関する分析レポート'
      },
      {
        id: 'sustainability-progress',
        name: 'サステナビリティ進捗報告書',
        description: 'サステナビリティ目標の達成状況に関する進捗報告'
      },
      {
        id: 'risk-assessment',
        name: 'リスク評価レポート',
        description: 'システム全体のリスク評価と緩和策に関するレポート'
      }
    ];
  }
}

export const aiReportEngine = new AIReportEngine();