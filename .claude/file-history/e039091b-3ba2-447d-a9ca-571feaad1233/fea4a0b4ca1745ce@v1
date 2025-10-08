import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Settings,
  Brain,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Eye
} from 'lucide-react';
import { aiReportEngine, ReportRequest, GeneratedReport } from '@/lib/llm/report-engine';
import { LLMProvider, DEFAULT_PROVIDERS } from '@/lib/llm/types';
import { llmService } from '@/lib/llm/service';

interface AIReportGeneratorProps {
  onDataFetch?: () => Promise<any>;
}

export default function AIReportGenerator({ onDataFetch }: AIReportGeneratorProps) {
  const [reportTypes, setReportTypes] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadProviders();
    loadReportTypes();
  }, []);

  const loadProviders = () => {
    try {
      // llmServiceから利用可能なプロバイダーを取得
      const availableProviders = llmService.getAvailableProviders();
      if (availableProviders.length > 0) {
        setProviders(availableProviders);
        setSelectedProvider(availableProviders[0].id);
        console.log('Loaded providers from llmService:', availableProviders);
      } else {
        // フォールバック：localStorageから読み込み
        const saved = localStorage.getItem('llm-providers');
        if (saved) {
          const parsed = JSON.parse(saved);
          const enabledProviders = parsed.filter((p: LLMProvider) => p.enabled && p.apiKey);
          setProviders(enabledProviders);
          if (enabledProviders.length > 0) {
            setSelectedProvider(enabledProviders[0].id);
          }
        } else {
          // デフォルトプロバイダーを設定
          const defaultProviders = DEFAULT_PROVIDERS.map(p => ({
            ...p,
            apiKey: p.id === 'deepseek' ? 'sk-4e01224ca2884cb5bfc77fd109900062' :
                     p.id === 'zhipu' ? '266ab136106349518c4ab1afe9834123.WSvVNnoKfJgho4ii' : '',
            enabled: p.id === 'deepseek' || p.id === 'zhipu'
          }));
          const enabledProviders = defaultProviders.filter((p: LLMProvider) => p.enabled && p.apiKey);
          setProviders(enabledProviders);
          if (enabledProviders.length > 0) {
            setSelectedProvider(enabledProviders[0].id);
            // localStorageに保存
            localStorage.setItem('llm-providers', JSON.stringify(defaultProviders));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      // エラー時はデフォルトプロバイダーを使用
      const fallbackProviders = DEFAULT_PROVIDERS.map(p => ({
        ...p,
        apiKey: p.id === 'deepseek' ? 'sk-4e01224ca2884cb5bfc77fd109900062' :
                 p.id === 'zhipu' ? '266ab136106349518c4ab1afe9834123.WSvVNnoKfJgho4ii' : '',
        enabled: p.id === 'deepseek' || p.id === 'zhipu'
      })).filter((p: LLMProvider) => p.enabled && p.apiKey);
      setProviders(fallbackProviders);
      if (fallbackProviders.length > 0) {
        setSelectedProvider(fallbackProviders[0].id);
      }
    }
  };

  const loadReportTypes = async () => {
    const types = await aiReportEngine.getReportTypes();
    setReportTypes(types);
    if (types.length > 0) {
      setSelectedType(types[0].id);
    }
  };

  const generateReport = async () => {
    if (!selectedType || !selectedProvider) {
      setError('Please select report type and provider');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError('');

    try {
      const data = await onDataFetch?.() || generateMockData();

      setProgress(30);

      const request: ReportRequest = {
        type: selectedType as any,
        data,
        language,
        includeRecommendations,
        provider: selectedProvider,
      };

      console.log('🔍 Language setting being sent:', language);
      console.log('🔍 Report request:', request);

      const report = await aiReportEngine.generateReport(request);

      setProgress(100);
      setGeneratedReport(report);
      setSuccess('Report generation completed successfully');
      setTimeout(() => setSuccess(''), 5000); // 5秒後に成功メッセージを消す
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report generation failed');
      setTimeout(() => setError(''), 5000); // 5秒後にエラーメッセージを消す
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockData = () => {
    return {
      creditData: {
        anCredits: 1500,
        panCredits: 2300,
        cfCredits: 800,
        totalCredits: 4600,
        usage: [
          { date: '2024-01-15', creditsUsed: 150, purpose: 'PAN出荷' },
          { date: '2024-01-20', creditsUsed: 200, purpose: 'CF出荷' },
          { date: '2024-01-25', creditsUsed: 100, purpose: '検査費用' },
        ],
      },
      productionData: {
        anInput: 5000,
        panProduction: 3200,
        cfProduction: 1200,
        efficiency: 87.5,
        quality: 94.2,
      },
      supplierData: [
        { name: 'サプライヤーA', sustainability: 92, reliability: 88, lastDelivery: '2024-01-28' },
        { name: 'サプライヤーB', sustainability: 87, reliability: 91, lastDelivery: '2024-01-27' },
        { name: 'サプライヤーC', sustainability: 78, reliability: 85, lastDelivery: '2024-01-26' },
      ],
      auditData: {
        lastAudit: '2023-12-15',
        nextAudit: '2024-12-15',
        compliance: 96.5,
        findings: [
          { severity: 'medium', description: '一部の記録不備', status: 'resolved' },
          { severity: 'low', description: 'フォーマット更新遅延', status: 'open' },
        ],
      },
    };
  };

  const downloadPDF = async () => {
    if (!generatedReport) return;

    try {
      // HTMLレポートを生成
      const htmlContent = generateClientPDF(generatedReport);

      // HTMLファイルとしてダウンロード
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-report-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 新しいウィンドウで開くオプションも提供
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }

      setSuccess('Report downloaded in HTML format');
      setTimeout(() => setSuccess(''), 5000); // 5秒後に成功メッセージを消す
    } catch (error) {
      console.error('Report generation error:', error);
      setError('Report generation failed');
      setTimeout(() => setError(''), 5000); // 5秒後にエラーメッセージを消す
    }
  };

  // クライアントサイドPDF生成（HTMLベース）
  const generateClientPDF = (report: any) => {
    // HTMLコンテンツを生成
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .meta { font-size: 12px; color: #666; margin-bottom: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; border-left: 4px solid #007bff; padding-left: 15px; }
        .recommendations { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 30px; }
        .recommendations h3 { color: #155724; margin-bottom: 15px; }
        .recommendations ol { margin: 0; padding-left: 20px; }
        .recommendations li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${report.title}</div>
        <div class="meta">
            Generated: ${new Date(report.metadata.generatedAt).toLocaleString('en')}<br>
            Model Used: ${report.metadata.provider} - ${report.metadata.model}<br>
            Tokens Used: ${report.metadata.tokensUsed}
        </div>
    </div>

    <div class="summary">
        <h3>Summary</h3>
        <p>${report.summary.replace(/\n/g, '<br>')}</p>
    </div>

    ${report.sections.map((section: any, index: number) => `
    <div class="section">
        <div class="section-title">${section.title}</div>
        <div>${section.content.replace(/\n/g, '<br>')}</div>
    </div>
    `).join('')}

    ${report.recommendations ? `
    <div class="recommendations">
        <h3>Recommendations</h3>
        <ol>
            ${report.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ol>
    </div>
    ` : ''}
</body>
</html>
    `;

    // HTMLをBlobとして返す（ブラウザで表示可能）
    return new Blob([htmlContent], { type: 'text/html' });
  };

  const selectedReportType = reportTypes.find(t => t.id === selectedType);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Report Generator</h2>
          <p className="text-muted-foreground">
            Advanced AI-powered analysis and automated report generation
          </p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Brain className="w-4 h-4" />
          <span>AI Powered</span>
        </Badge>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="generate" className="w-full">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Settings</CardTitle>
                <CardDescription>Configure report type and generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedReportType && (
                    <p className="text-sm text-muted-foreground">
                      {selectedReportType.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>LLM Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={(value: 'ja' | 'en') => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="recommendations"
                    checked={includeRecommendations}
                    onCheckedChange={setIncludeRecommendations}
                  />
                  <Label htmlFor="recommendations">Include improvement recommendations</Label>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={isGenerating || !selectedType || !selectedProvider}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Generation Status</CardTitle>
                <CardDescription>
                  {isGenerating ? 'AI is generating report...' : 'Generation Results'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Usually takes 30-60 seconds</span>
                    </div>
                  </div>
                ) : generatedReport ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{generatedReport.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {generatedReport.summary}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {generatedReport.metadata.provider}
                        </Badge>
                        <Badge>
                          {Math.round(generatedReport.metadata.tokensUsed)} tokens
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Sections ({generatedReport.sections.length})</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {generatedReport.sections.map((section, index) => (
                          <div key={index} className="p-2 border rounded">
                            <h4 className="font-medium text-sm">{section.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {section.content.substring(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {generatedReport.recommendations && (
                      <div className="space-y-2">
                        <Label>Recommendations ({generatedReport.recommendations.length})</Label>
                        <div className="space-y-1">
                          {generatedReport.recommendations.slice(0, 3).map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec.substring(0, 80)}...</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Dialog open={showDetails} onOpenChange={setShowDetails}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{generatedReport?.title}</DialogTitle>
                            <DialogDescription>
                              Generated: {generatedReport?.metadata.generatedAt.toLocaleString('en')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Summary</h3>
                              <p className="text-sm whitespace-pre-wrap">{generatedReport?.summary}</p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Detailed Sections</h3>
                              {generatedReport?.sections.map((section, index) => (
                                <div key={index} className="mb-6">
                                  <h4 className="text-md font-medium mb-2">{section.title}</h4>
                                  <p className="text-sm whitespace-pre-wrap">{section.content}</p>
                                </div>
                              ))}
                            </div>
                            {generatedReport?.recommendations && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                  {generatedReport.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">{rec}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground border-t pt-4">
                              <p>Model Used: {generatedReport?.metadata.provider} - {generatedReport?.metadata.model}</p>
                              <p>Tokens Used: {generatedReport?.metadata.tokensUsed}</p>
                              <p>コスト: ${generatedReport?.metadata.cost?.toFixed(4)}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button onClick={downloadPDF} className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download HTML
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Generate a report to see results here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>History of previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No generation history yet
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Detailed settings for report generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select defaultValue="ja">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-save">Auto Save</Label>
                  <Switch id="auto-save" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    defaultValue="4000"
                    placeholder="4000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Creativity Level</Label>
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}