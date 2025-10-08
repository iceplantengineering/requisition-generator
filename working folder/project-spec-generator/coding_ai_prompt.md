import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScopeSelectorProps {
  contextAnalysis: any;
  onSubmit: (scope: any) => void;
  isProcessing: boolean;
}

export default function ScopeSelector({
  contextAnalysis,
  onSubmit,
  isProcessing,
}: ScopeSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [additionalItems, setAdditionalItems] = useState('');
  const [excludedItems, setExcludedItems] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = () => {
    onSubmit({
      selectedItems,
      additionalItems,
      excludedItems,
      priority,
    });
  };

  const toggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">見積範囲の確認</h2>
        <p className="text-gray-600">
          AIが分析した内容を確認し、見積に含める項目を選択してください
        </p>
      </div>

      {/* 検出された情報サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">検出された案件情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="font-medium">顧客:</span>{' '}
            {contextAnalysis.customer?.company}
          </div>
          <div>
            <span className="font-medium">案件名:</span>{' '}
            {contextAnalysis.project?.name}
          </div>
          <div>
            <span className="font-medium">納期:</span>{' '}
            {contextAnalysis.schedule?.deadline}
          </div>
          <div>
            <span className="font-medium">信頼度:</span>{' '}
            <Badge variant={contextAnalysis.confidence > 80 ? 'default' : 'secondary'}>
              {contextAnalysis.confidence}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 要求事項の選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">検出された要求事項</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contextAnalysis.requirements?.functional?.must?.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`item-${index}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => toggleItem(item)}
                />
                <Label htmlFor={`item-${index}`} className="flex-1 cursor-pointer">
                  {item}
                  <Badge variant="outline" className="ml-2">必須</Badge>
                </Label>
              </div>
            ))}
            {contextAnalysis.requirements?.functional?.nice?.map((item: string, index: number) => (
              <div key={`nice-${index}`} className="flex items-center space-x-3">
                <Checkbox
                  id={`nice-${index}`}
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => toggleItem(item)}
                />
                <Label htmlFor={`nice-${index}`} className="flex-1 cursor-pointer">
                  {item}
                  <Badge variant="secondary" className="ml-2">オプション</Badge>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 追加・除外項目 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="additional">追加したい項目</Label>
          <Textarea
            id="additional"
            value={additionalItems}
            onChange={(e) => setAdditionalItems(e.target.value)}
            placeholder="検出されていない項目で見積に含めたいものを記入..."
            className="mt-2"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="excluded">除外したい項目</Label>
          <Textarea
            id="excluded"
            value={excludedItems}
            onChange={(e) => setExcludedItems(e.target.value)}
            placeholder="見積から除外したい項目を記入..."
            className="mt-2"
            rows={4}
          />
        </div>
      </div>

      {/* 優先度設定 */}
      <div>
        <Label className="mb-3 block">案件の優先度</Label>
        <RadioGroup value={priority} onValueChange={(v: any) => setPriority(v)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="priority-high" />
            <Label htmlFor="priority-high">高 - 至急対応が必要</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="priority-medium" />
            <Label htmlFor="priority-medium">中 - 通常の優先度</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="priority-low" />
            <Label htmlFor="priority-low">低 - 時間的余裕あり</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedItems.length === 0 || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? '分析中...' : '次へ進む'}
      </Button>
    </div>
  );
}
```

## API実装例

### Next.js API Routes

```typescript
// app/api/n8n/purchase-request-start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const workflowId = uuidv4();

    // n8n webhookへリクエスト転送
    const n8nFormData = new FormData();
    files.forEach(file => n8nFormData.append('files', file));
    n8nFormData.append('workflowId', workflowId);

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/purchase-request-start`,
      {
        method: 'POST',
        body: n8nFormData,
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('n8n workflow failed');
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      workflowId,
      contextAnalysis: result.contextAnalysis,
      message: 'Files uploaded and analyzed successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/n8n/scope-selection/[workflowId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const body = await request.json();
    const { workflowId } = params;

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/scope-selection/${workflowId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('Scope selection failed');
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      gapAnalysis: result.gapAnalysis,
      message: 'Scope selection completed',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/n8n/generate-documents/[workflowId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const { workflowId } = params;

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/generate-documents/${workflowId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('Document generation failed');
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      documents: result.documents,
      message: 'Documents generated successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/n8n/finalize/[workflowId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const body = await request.json();
    const { workflowId } = params;

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/finalize/${workflowId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('Finalization failed');
    }

    const result = await n8nResponse.json();

    return NextResponse.json({
      downloadUrl: result.downloadUrl,
      message: 'Workflow completed successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/n8n/download/[workflowId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const { workflowId } = params;

    const n8nResponse = await fetch(
      `${process.env.N8N_WEBHOOK_URL}/download/${workflowId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_API_KEY}`,
        },
      }
    );

    if (!n8nResponse.ok) {
      throw new Error('Download failed');
    }

    const blob = await n8nResponse.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="purchase-requisition-${workflowId}.zip"`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### package.json

```json
{
  "name": "purchase-requisition-generator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "n8n": "n8n start"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "archiver": "^6.0.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "docxtemplater": "^3.44.0",
    "exceljs": "^4.4.0",
    "lucide-react": "^0.344.0",
    "mailparser": "^3.6.6",
    "mammoth": "^1.6.0",
    "markdown-it": "^14.0.0",
    "next": "14.1.0",
    "pdf-lib": "^1.17.1",
    "pdf-parse": "^1.1.1",
    "pizzip": "^3.1.6",
    "puppeteer": "^22.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.50.1",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^9.0.1",
    "xlsx": "^0.18.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/archiver": "^6.0.2",
    "@types/markdown-it": "^13.0.7",
    "@types/node": "^20",
    "@types/pdf-parse": "^1.1.4",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^9.0.7",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.1.0",
    "n8n": "^1.23.0",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## Docker Compose 設定 (オプション)

```yaml
# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=Asia/Tokyo
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./custom-nodes:/home/node/.n8n/custom
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8npassword
      - POSTGRES_DB=n8n
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped

  app:
    build: .
    container_name: requisition-app
    ports:
      - "3000:3000"
    environment:
      - N8N_WEBHOOK_URL=http://n8n:5678/webhook
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - n8n
    restart: unless-stopped

volumes:
  postgres-data:
  n8n-data:
```

## テストデータ作成スクリプト

```typescript
// scripts/generateTestData.ts
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

async function generateTestPDF() {
  const doc = new PDFDocument();
  const outputPath = path.join(__dirname, '../test-data/sample_requirements.pdf');
  
  doc.pipe(fs.createWriteStream(outputPath));
  
  doc.fontSize(20).text('システム要求仕様書', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(14).text('1. プロジェクト概要');
  doc.fontSize(12).text('本プロジェクトは、既存の基幹システムを刷新し、業務効率化を図ることを目的とする。');
  doc.moveDown();
  
  doc.fontSize(14).text('2. 主要機能要件');
  doc.fontSize(12).list([
    '在庫管理機能の実装',
    '自動発注機能の追加',
    'リアルタイムレポート機能',
    'モバイル対応（iOS/Android）',
  ]);
  doc.moveDown();
  
  doc.fontSize(14).text('3. 非機能要件');
  doc.fontSize(12).text('- 同時接続ユーザー数: 100人');
  doc.text('- レスポンスタイム: 3秒以内');
  doc.text('- 稼働率: 99.9%以上');
  doc.moveDown();
  
  doc.fontSize(14).text('4. スケジュール');
  doc.fontSize(12).text('納期: 2025年12月31日');
  doc.text('要件定義完了: 2025年3月31日');
  doc.moveDown();
  
  doc.fontSize(14).text('5. 予算');
  doc.fontSize(12).text('概算予算: 5,000万円');
  
  doc.end();
  
  console.log('✓ Test PDF created:', outputPath);
}

async function generateTestDOCX() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: '見積依頼書',
          heading: 'Heading1',
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '株式会社サンプル御中', bold: true }),
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: '下記の通り、システム開発の見積をご依頼いたします。',
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: '【案件名】',
          bold: true,
        }),
        new Paragraph({
          text: '基幹システム刷新プロジェクト',
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: '【納期希望】',
          bold: true,
        }),
        new Paragraph({
          text: '2025年12月31日',
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: '【要件概要】',
          bold: true,
        }),
        new Paragraph({
          text: '1. 在庫管理システムの構築',
        }),
        new Paragraph({
          text: '2. 自動発注機能の実装',
        }),
        new Paragraph({
          text: '3. レポート機能の強化',
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '../test-data/sample_rfq.docx');
  fs.writeFileSync(outputPath, buffer);
  
  console.log('✓ Test DOCX created:', outputPath);
}

async function generateTestXLSX() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('購入要求書テンプレート');

  // ヘッダー
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = '購入要求書';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center' };

  // 基本情報
  worksheet.getCell('A3').value = '案件名:';
  worksheet.getCell('B3').value = '{{projectName}}';
  
  worksheet.getCell('A4').value = '顧客名:';
  worksheet.getCell('B4').value = '{{customerName}}';
  
  worksheet.getCell('A5').value = '納期:';
  worksheet.getCell('B5').value = '{{deadline}}';

  // 見積明細ヘッダー
  worksheet.getCell('A7').value = '大分類';
  worksheet.getCell('B7').value = '項目';
  worksheet.getCell('C7').value = '数量';
  worksheet.getCell('D7').value = '単価';
  worksheet.getCell('E7').value = '小計';

  worksheet.getRow(7).font = { bold: true };
  worksheet.getRow(7).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // サンプルデータ
  worksheet.getCell('A8').value = 'ハードウェア';
  worksheet.getCell('B8').value = 'サーバー';
  worksheet.getCell('C8').value = 2;
  worksheet.getCell('D8').value = 500000;
  worksheet.getCell('E8').value = { formula: 'C8*D8' };

  // カラム幅調整
  worksheet.getColumn('A').width = 15;
  worksheet.getColumn('B').width = 30;
  worksheet.getColumn('C').width = 10;
  worksheet.getColumn('D').width = 15;
  worksheet.getColumn('E').width = 15;

  const outputPath = path.join(__dirname, '../test-data/requisition_template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  
  console.log('✓ Test XLSX created:', outputPath);
}

async function generateTestEmail() {
  const emailContent = `From: customer@example.com
To: sales@yourcompany.com
Subject: システム開発の見積依頼
Date: Mon, 08 Jan 2025 10:00:00 +0900
Content-Type: text/plain; charset=UTF-8

お世話になっております。
株式会社サンプルの山田です。

以下の内容でシステム開発の見積をお願いしたく、ご連絡いたしました。

【案件概要】
- 案件名: 基幹システム刷新プロジェクト
- 目的: 業務効率化およびデータ統合
- 納期: 2025年12月31日

【主要要件】
1. 在庫管理機能
2. 自動発注機能
3. レポート機能
4. モバイル対応

【技術要件】
- 既存システム: Oracle DB 11g
- ユーザー数: 約100名
- オンプレミス環境での構築

【予算】
概算で5,000万円程度を想定しております。

詳細は添付の要件定義書をご確認ください。

ご検討のほど、よろしくお願いいたします。

---
山田 太郎
株式会社サンプル
情報システム部
TEL: 03-1234-5678
Email: yamada@example.com`;

  const outputPath = path.join(__dirname, '../test-data/sample_email.eml');
  fs.writeFileSync(outputPath, emailContent);
  
  console.log('✓ Test Email created:', outputPath);
}

async function main() {
  const testDataDir = path.join(__dirname, '../test-data');
  
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }

  console.log('Generating test data...\n');
  
  await generateTestPDF();
  await generateTestDOCX();
  await generateTestXLSX();
  await generateTestEmail();
  
  console.log('\n✓ All test files created successfully!');
  console.log(`Test data directory: ${testDataDir}`);
}

main().catch(console.error);
```

## デプロイメント手順

### ステップ1: ローカル開発環境のセットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd purchase-requisition-generator

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPIキー等を設定

# テストデータの生成
npm run generate-test-data

# 開発サーバーの起動
npm run dev
```

### ステップ2: n8nのセットアップ

```bash
# n8nの起動（別ターミナル）
npm run n8n

# ブラウザでn8nにアクセス
# http://localhost:5678

# ワークフローのインポート
# 提供されたJSON定義をn8nにインポート
```

### ステップ3: 本番デプロイ (Vercel + Railway)

```bash
# Vercelへのデプロイ (フロントエンド)
vercel deploy --prod

# Railwayへのデプロイ (n8n)
# Railway.app でプロジェクト作成
# GitHub連携で自動デプロイ設定
```

## トラブルシューティング

### 問題1: Claude APIのレート制限エラー

```typescript
// utils/claudeWithRetry.ts
export async function callClaudeWithRetry(
  options: ClaudeRequestOptions,
  maxRetries: number = 3
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callClaude(options);
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
}
```

### 問題2: 大きなファイルの処理タイムアウト

```typescript
// n8nノード設定でタイムアウトを延長
{
  "settings": {
    "executionTimeout": 300,
    "saveExecutionProgress": true
  }
}
```

### 問題3: メモリ不足

```json
// package.json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--max-old-space-size=4096' next dev",
    "n8n": "N8N_RUNNERS_MAX_OLD_SPACE_SIZE=4096 n8n start"
  }
}
```

## 最終チェックリスト

実装前に以下を確認してください:

- [ ] Anthropic APIキーの取得と設定
- [ ] n8nのインストールと起動確認
- [ ] 必要なnpmパッケージのインストール
- [ ] テストデータの準備
- [ ] 環境変数の設定完了
- [ ] サンプルREQUISITIONテンプレート（Excel/DOCX）の準備
- [ ] Phase1で作成したプロンプトの統合
- [ ] エラーハンドリングの実装
- [ ] セキュリティ設定（APIキー、認証等）
- [ ] ログ記録の実装

## 次のステップ

このプロンプトとコードをコーディングAIに渡す際は、以下も一緒に提供してください:

1. **Phase1で作成したプロンプト** - 購入要求書生成用の詳細プロンプト
2. **サンプルREQUISITIONテンプレート** - Excel形式とDOCX形式
3. **テスト用の顧客資料** - 上記スクリプトで生成したサンプルファイル
4. **具体的な要件** - どの機能を優先実装するか

コーディングAIへの指示例:
```
上記のプロンプトとコードに基づいて、購入要求書自動生成システムを実装してください。
まずは最小構成版(MVP)から始めて、段階的に機能を拡張します。
Phase1で作成した以下のプロンプトを購入要求書生成部分に統合してください:
[Phase1のプロンプトをここに貼り付け]
```# 購入要求書自動生成システム実装プロンプト

## プロジェクト概要

既存の購入要求書作成アプリ(Phase1)を拡張し、以下の機能を持つ自動化システムを実装してください:

1. 顧客資料・メール・関連ドキュメントの自動読み込みと分析
2. 見積範囲の簡易入力インターフェース
3. 不足情報の自動検出と推奨資料の提案
4. 複数ドキュメントの自動生成と統合
5. インタラクティブな編集機能
6. 完成パッケージの出力

## 技術スタック

### バックエンド
- **ワークフローエンジン**: n8n (self-hosted)
- **AI API**: Anthropic Claude API (claude-sonnet-4-5-20250929)
- **ランタイム**: Node.js 18+

### ドキュメント処理
- **PDF解析**: pdf-parse, pdf-lib
- **Word文書**: mammoth (読込), docxtemplater (生成)
- **Excel**: xlsx, exceljs
- **メール**: mailparser, imap

### フロントエンド（オプション）
- **フレームワーク**: React 18+ / Next.js 14+
- **UI**: Tailwind CSS, shadcn/ui
- **フォーム**: React Hook Form

### インフラ
- **ストレージ**: Google Drive API / AWS S3
- **認証**: OAuth 2.0
- **通知**: Slack API / Microsoft Teams Webhook

## 実装要件

### フェーズ1: コア機能実装（最優先）

#### 1.1 ファイルアップロード・解析モジュール

```typescript
// 必要な機能:
interface FileProcessorConfig {
  supportedFormats: ['pdf', 'docx', 'xlsx', 'msg', 'eml', 'txt'];
  maxFileSize: 50 * 1024 * 1024; // 50MB
  extractionMethod: 'text' | 'structured';
}

// 実装すべきメソッド:
- uploadFiles(files: File[]): Promise<UploadResult>
- extractText(file: Buffer, type: string): Promise<string>
- parseEmail(emailFile: Buffer): Promise<EmailData>
- extractTables(excelFile: Buffer): Promise<TableData[]>
```

**n8nノード構成例:**
```json
{
  "nodes": [
    {
      "name": "File Upload Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "upload-documents",
        "httpMethod": "POST",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Parse PDF",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// pdf-parseを使用した実装"
      }
    },
    {
      "name": "Parse DOCX",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// mammothを使用した実装"
      }
    }
  ]
}
```

#### 1.2 AI分析エンジン

```typescript
interface ContextAnalysisResult {
  customer: string;
  projectName: string;
  deadline: string;
  requirements: string[];
  technicalSpecs: Record<string, any>;
  budget?: string;
  contacts: ContactInfo[];
  confidence: number; // 0-100
}

// Claude APIを使用したプロンプト:
const CONTEXT_ANALYSIS_PROMPT = `
あなたは購買部門のベテラン担当者です。
以下の資料から案件情報を構造化して抽出してください。

【入力資料】
{extracted_text}

【抽出項目】
1. 顧客情報（会社名、部署、担当者名、連絡先）
2. 案件名・プロジェクト名
3. 納期・スケジュール
4. 主要要求事項（箇条書き）
5. 技術仕様（判明している範囲）
6. 予算情報（記載があれば）
7. 添付されている参考資料の種類

【出力形式】
JSON形式で以下の構造を厳密に守ってください:
{
  "customer": {"company": "", "department": "", "contact": ""},
  "projectName": "",
  "deadline": "YYYY-MM-DD",
  "requirements": [],
  "technicalSpecs": {},
  "budget": "",
  "attachments": [],
  "confidence": 0-100
}
`;
```

#### 1.3 見積範囲入力UI

**実装方式: n8n Form または React Component**

```typescript
interface ScopeInputForm {
  // AI提案項目（自動生成）
  suggestedItems: ScopeItem[];
  
  // ユーザー入力
  selectedItems: string[];
  additionalItems: string;
  excludedItems: string;
  priority: 'high' | 'medium' | 'low';
  specialRequirements: string;
}

interface ScopeItem {
  id: string;
  category: string;
  description: string;
  aiConfidence: number;
  suggestedByAI: boolean;
}
```

**n8nフォームノード設定:**
```json
{
  "name": "Scope Selection Form",
  "type": "n8n-nodes-base.formTrigger",
  "parameters": {
    "formTitle": "見積範囲の確認と選択",
    "formDescription": "AIが分析した内容を確認し、見積に含める項目を選択してください",
    "formFields": {
      "values": [
        {
          "fieldId": "scope_items",
          "fieldType": "multiselect",
          "fieldLabel": "見積対象項目（複数選択可）",
          "fieldOptions": {
            "values": "={{ $json.suggestedItems }}"
          }
        },
        {
          "fieldId": "additional_scope",
          "fieldType": "textarea",
          "fieldLabel": "追加したい項目"
        },
        {
          "fieldId": "exclusions",
          "fieldType": "textarea",
          "fieldLabel": "除外したい項目"
        }
      ]
    }
  }
}
```

#### 1.4 ギャップ分析・推奨エンジン

```typescript
interface GapAnalysisResult {
  completeness: number; // 0-100
  availableInfo: Record<string, any>;
  missingInfo: MissingInfoItem[];
  suggestedDocs: SuggestedDocument[];
  riskAssessment: RiskItem[];
}

interface MissingInfoItem {
  field: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  suggestedSource: string;
}

interface SuggestedDocument {
  type: 'technical_spec' | 'reference' | 'standard' | 'template';
  title: string;
  reason: string;
  searchQuery?: string;
}
```

**Claude APIプロンプト:**
```typescript
const GAP_ANALYSIS_PROMPT = `
購入要求書作成に必要な情報の充足度を分析してください。

【現在利用可能な情報】
{available_data}

【見積範囲】
{scope_definition}

【タスク】
1. 購入要求書作成に必要な情報の充足率を算出（0-100）
2. 不足している情報を重要度順にリスト化
3. 必要な技術資料・参考文献を提案
4. リスク評価（情報不足による影響）

【購入要求書の必須項目チェックリスト】
- [ ] 購入目的の明確な記述
- [ ] 詳細仕様（数量、型番、性能要件）
- [ ] 納期・スケジュール
- [ ] 予算概算
- [ ] 調達理由・背景
- [ ] 技術的妥当性の根拠
- [ ] 代替案の検討結果
- [ ] リスク分析

【出力JSON形式】
{
  "completeness": 85,
  "availableInfo": {...},
  "missingInfo": [
    {
      "field": "詳細な技術仕様",
      "importance": "high",
      "description": "具体的な性能要件が不明",
      "suggestedSource": "顧客への追加ヒアリング"
    }
  ],
  "suggestedDocs": [
    {
      "type": "technical_spec",
      "title": "○○システム技術仕様書テンプレート",
      "reason": "技術要件の標準化に必要"
    }
  ],
  "riskAssessment": [...]
}
`;
```

#### 1.5 購入要求書生成エンジン

**既存Phase1プロンプトを活用:**

```typescript
const REQUISITION_GENERATION_PROMPT = `
以下の情報を基に、正式な購入要求書を作成してください。

【基本情報】
{context_data}

【見積範囲】
{scope_data}

【ギャップ分析結果】
{gap_analysis}

【出力形式】
Markdown形式で以下の構造に従ってください:

# 購入要求書

## 1. 購入目的・背景
[ここに購入の目的と背景を記述]

## 2. 購入対象の詳細
### 2.1 概要
### 2.2 詳細仕様
### 2.3 数量・単価

## 3. 調達理由
### 3.1 技術的妥当性
### 3.2 代替案の検討
### 3.3 選定理由

## 4. スケジュール
| マイルストーン | 予定日 |
|--------------|--------|
| 発注         |        |
| 納品         |        |

## 5. 予算
### 5.1 概算費用
### 5.2 予算措置

## 6. リスク管理
### 6.1 想定リスク
### 6.2 対策

## 7. 承認フロー

## 添付資料リスト

---

## 備考・特記事項

【重要】
- 不足情報がある場合は「[要確認: ○○]」と明記
- 推測で記載した箇所は「[推定値]」と表示
- すべての数値には根拠を併記
`;
```

### フェーズ2: ドキュメント生成・統合

#### 2.1 複数ドキュメント同時生成

```typescript
interface DocumentGenerationPipeline {
  mainDocument: {
    type: 'requisition';
    format: 'docx' | 'pdf';
    template?: string;
  };
  
  technicalSpec?: {
    type: 'technical_specification';
    format: 'docx' | 'pdf';
  };
  
  costEstimate?: {
    type: 'cost_breakdown';
    format: 'xlsx';
  };
  
  attachments: {
    type: 'reference';
    files: string[];
  };
}
```

**n8n並列処理ノード:**
```json
{
  "name": "Parallel Document Generation",
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": {
    "batchSize": 1,
    "options": {
      "reset": false
    }
  },
  "branches": [
    {
      "name": "Generate Main Requisition",
      "node": "Claude API - Requisition"
    },
    {
      "name": "Generate Technical Spec",
      "node": "Claude API - TechSpec"
    },
    {
      "name": "Generate Cost Sheet",
      "node": "Excel Template Fill"
    }
  ]
}
```

#### 2.2 Excel見積テンプレート自動入力

```typescript
// exceljs を使用した実装例
import ExcelJS from 'exceljs';

async function fillRequisitionTemplate(
  templatePath: string,
  data: RequisitionData
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templatePath);
  
  const sheet = workbook.getWorksheet('購入要求書');
  
  // セルマッピング
  sheet.getCell('B3').value = data.projectName;
  sheet.getCell('B4').value = data.customer.company;
  sheet.getCell('B5').value = new Date(data.deadline);
  
  // 明細行の追加
  let startRow = 10;
  data.items.forEach((item, index) => {
    sheet.getCell(`A${startRow + index}`).value = item.name;
    sheet.getCell(`B${startRow + index}`).value = item.quantity;
    sheet.getCell(`C${startRow + index}`).value = item.unitPrice;
    sheet.getCell(`D${startRow + index}`).value = {
      formula: `B${startRow + index}*C${startRow + index}`
    };
  });
  
  return await workbook.xlsx.writeBuffer();
}
```

#### 2.3 Word文書生成（docxtemplater使用）

```typescript
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';

async function generateRequisitionDocx(
  templatePath: string,
  data: RequisitionData
): Promise<Buffer> {
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  
  doc.render({
    projectName: data.projectName,
    customer: data.customer,
    date: new Date().toLocaleDateString('ja-JP'),
    requirements: data.requirements,
    items: data.items,
    totalCost: data.items.reduce((sum, item) => 
      sum + item.quantity * item.unitPrice, 0
    ),
  });
  
  return doc.getZip().generate({ type: 'nodebuffer' });
}
```

### フェーズ3: 編集UI・パッケージング

#### 3.1 編集インターフェース（React実装）

```typescript
// components/RequisitionEditor.tsx
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RequisitionEditorProps {
  initialData: {
    mainDocument: string;
    technicalSpec: string;
    missingInfo: string[];
  };
  onSave: (data: EditedRequisition) => Promise<void>;
}

export default function RequisitionEditor({ 
  initialData, 
  onSave 
}: RequisitionEditorProps) {
  const [mainDoc, setMainDoc] = useState(initialData.mainDocument);
  const [techSpec, setTechSpec] = useState(initialData.technicalSpec);
  
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="main">
        <TabsList>
          <TabsTrigger value="main">購入要求書</TabsTrigger>
          <TabsTrigger value="tech">技術仕様書</TabsTrigger>
          <TabsTrigger value="missing">不足情報</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main">
          <Textarea
            value={mainDoc}
            onChange={(e) => setMainDoc(e.target.value)}
            className="min-h-[600px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="tech">
          <Textarea
            value={techSpec}
            onChange={(e) => setTechSpec(e.target.value)}
            className="min-h-[600px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="missing">
          <div className="space-y-4">
            <h3 className="font-bold">要確認事項</h3>
            <ul className="list-disc pl-6">
              {initialData.missingInfo.map((item, i) => (
                <li key={i} className="text-yellow-700">{item}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex gap-4">
        <Button onClick={() => onSave({ mainDoc, techSpec })}>
          保存して次へ
        </Button>
        <Button variant="outline">下書き保存</Button>
      </div>
    </div>
  );
}
```

#### 3.2 パッケージング機能

```typescript
import archiver from 'archiver';
import { PDFDocument } from 'pdf-lib';

async function createRequisitionPackage(
  documents: GeneratedDocuments
): Promise<Buffer> {
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  // メインドキュメント追加
  archive.append(documents.mainPdf, { 
    name: '購入要求書.pdf' 
  });
  
  // 技術仕様書追加
  if (documents.technicalSpec) {
    archive.append(documents.technicalSpec, { 
      name: '技術仕様書.pdf' 
    });
  }
  
  // 見積明細（Excel）追加
  if (documents.costSheet) {
    archive.append(documents.costSheet, { 
      name: '見積明細.xlsx' 
    });
  }
  
  // 関連資料フォルダ
  if (documents.attachments?.length > 0) {
    documents.attachments.forEach((file, i) => {
      archive.append(file.buffer, { 
        name: `関連資料/${file.originalName}` 
      });
    });
  }
  
  // 目次PDF生成
  const tocPdf = await generateTableOfContents(documents);
  archive.append(tocPdf, { name: '00_目次.pdf' });
  
  await archive.finalize();
  
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);
  });
}
```

## 完全なn8nワークフロー実装

### メインワークフロー

```json
{
  "name": "購入要求書自動生成_完全版",
  "nodes": [
    {
      "id": "webhook-start",
      "name": "Start: File Upload",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 400],
      "parameters": {
        "path": "purchase-request-start",
        "httpMethod": "POST",
        "responseMode": "responseNode"
      }
    },
    {
      "id": "extract-files",
      "name": "Extract & Parse Files",
      "type": "n8n-nodes-base.code",
      "position": [450, 400],
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": `
// pdf-parse, mammoth, xlsxを使用
const pdfs = [];
const docx = [];
const excel = [];
const emails = [];

for (const item of items) {
  const fileType = item.binary.data.mimeType;
  
  if (fileType.includes('pdf')) {
    const pdfParse = require('pdf-parse');
    const text = await pdfParse(item.binary.data.data);
    pdfs.push(text.text);
  } else if (fileType.includes('word')) {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({
      buffer: item.binary.data.data
    });
    docx.push(result.value);
  } else if (fileType.includes('sheet')) {
    const XLSX = require('xlsx');
    const workbook = XLSX.read(item.binary.data.data);
    // 処理続く...
  }
}

return [{
  json: {
    allText: [...pdfs, ...docx].join('\\n\\n'),
    tables: excel,
    emails: emails
  }
}];
`
      }
    },
    {
      "id": "claude-context-analysis",
      "name": "AI: Context Analysis",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "position": [650, 400],
      "parameters": {
        "model": "claude-sonnet-4-5-20250929",
        "prompt": "={{ $node['Extract & Parse Files'].json.allText }}を分析し、JSON形式で情報抽出",
        "options": {
          "temperature": 0.3,
          "maxTokens": 4000
        }
      }
    },
    {
      "id": "form-scope-selection",
      "name": "User: Scope Selection",
      "type": "n8n-nodes-base.formTrigger",
      "position": [850, 400],
      "parameters": {
        "formTitle": "見積範囲の選択",
        "formFields": "={{ $json.suggestedItems }}"
      }
    },
    {
      "id": "claude-gap-analysis",
      "name": "AI: Gap Analysis",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "position": [1050, 400],
      "parameters": {
        "model": "claude-sonnet-4-5-20250929",
        "prompt": "不足情報分析プロンプト"
      }
    },
    {
      "id": "switch-completeness",
      "name": "Check Completeness",
      "type": "n8n-nodes-base.if",
      "position": [1250, 400],
      "parameters": {
        "conditions": {
          "number": [{
            "value1": "={{ $json.completeness }}",
            "operation": "largerEqual",
            "value2": 75
          }]
        }
      }
    },
    {
      "id": "parallel-generation",
      "name": "Split for Parallel Gen",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [1450, 300]
    },
    {
      "id": "claude-main-requisition",
      "name": "Generate: Main Requisition",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "position": [1650, 200],
      "parameters": {
        "model": "claude-sonnet-4-5-20250929",
        "prompt": "Phase1プロンプト + 追加コンテキスト"
      }
    },
    {
      "id": "claude-tech-spec",
      "name": "Generate: Tech Spec",
      "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
      "position": [1650, 350]
    },
    {
      "id": "excel-fill",
      "name": "Generate: Cost Sheet",
      "type": "n8n-nodes-base.code",
      "position": [1650, 500],
      "parameters": {
        "jsCode": "// ExcelJSでテンプレート入力"
      }
    },
    {
      "id": "merge-docs",
      "name": "Merge Documents",
      "type": "n8n-nodes-base.merge",
      "position": [1850, 350]
    },
    {
      "id": "edit-form",
      "name": "User: Edit & Approve",
      "type": "n8n-nodes-base.formTrigger",
      "position": [2050, 350]
    },
    {
      "id": "convert-to-pdf",
      "name": "Convert to PDF",
      "type": "n8n-nodes-base.code",
      "position": [2250, 300],
      "parameters": {
        "jsCode": "// Markdown -> PDF変換"
      }
    },
    {
      "id": "create-package",
      "name": "Create ZIP Package",
      "type": "n8n-nodes-base.code",
      "position": [2250, 400],
      "parameters": {
        "jsCode": "// archiver使用"
      }
    },
    {
      "id": "upload-gdrive",
      "name": "Upload to Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "position": [2450, 350],
      "parameters": {
        "operation": "upload"
      }
    },
    {
      "id": "send-notification",
      "name": "Send Notification",
      "type": "n8n-nodes-base.emailSend",
      "position": [2650, 350]
    }
  ],
  "connections": {
    "webhook-start": {
      "main": [[{"node": "extract-files"}]]
    },
    "extract-files": {
      "main": [[{"node": "claude-context-analysis"}]]
    },
    "claude-context-analysis": {
      "main": [[{"node": "form-scope-selection"}]]
    },
    "form-scope-selection": {
      "main": [[{"node": "claude-gap-analysis"}]]
    },
    "claude-gap-analysis": {
      "main": [[{"node": "switch-completeness"}]]
    },
    "switch-completeness": {
      "main": [[
        {"node": "parallel-generation"},
        {"node": "form-scope-selection"}
      ]]
    },
    "parallel-generation": {
      "main": [[
        {"node": "claude-main-requisition"},
        {"node": "claude-tech-spec"},
        {"node": "excel-fill"}
      ]]
    },
    "claude-main-requisition": {
      "main": [[{"node": "merge-docs"}]]
    },
    "claude-tech-spec": {
      "main": [[{"node": "merge-docs"}]]
    },
    "excel-fill": {
      "main": [[{"node": "merge-docs"}]]
    },
    "merge-docs": {
      "main": [[{"node": "edit-form"}]]
    },
    "edit-form": {
      "main": [[
        {"node": "convert-to-pdf"},
        {"node": "create-package"}
      ]]
    },
    "create-package": {
      "main": [[{"node": "upload-gdrive"}]]
    },
    "upload-gdrive": {
      "main": [[{"node": "send-notification"}]]
    }
  }
}
```

## 実装ステップ

### Step 1: 環境構築

```bash
# n8nインストール
npm install -g n8n

# 必要なパッケージインストール
npm install pdf-parse mammoth xlsx exceljs docxtemplater pizzip archiver

# n8n起動
n8n start
```

### Step 2: Claude API設定

```bash
# n8nの環境変数設定
export ANTHROPIC_API_KEY="your-api-key"
```

### Step 3: 段階的実装

1. **最小構成版（1週間）**
   - ファイルアップロード → AI分析 → 購入要求書生成
   
2. **機能拡張版（2週間）**
   - ギャップ分析追加
   - 複数ドキュメント生成
   
3. **完全版（4週間）**
   - 編集UI実装
   - パッケージング
   - 外部連携（Google Drive等）

## テスト用サンプルファイル要件

以下のサンプルファイルを準備してください:

1. **顧客メール例** (sample_email.eml)
   - 件名、本文、添付ファイルを含む実際のメール形式
   
2. **技術要件書** (sample_requirements.pdf)
   - システム概要、機能要件、非機能要件を含むPDF
   
3. **見積依頼書** (sample_rfq.docx)
   - 正式な見積依頼書のWord文書
   
4. **購入要求書テンプレート** (requisition_template.xlsx)
   - 入力すべきセルがマークされたExcelテンプレート

5. **購入要求書テンプレート** (requisition_template.docx)
   - docxtemplater用のWord テンプレート（変数プレースホルダー付き）

## 出力仕様

最終的に以下の構成でZIPファイルを生成:

```
{ProjectName}_購入要求書_20250108.zip
├── 00_目次.pdf
├── 01_購入要求書.pdf
├── 02_技術仕様書.pdf
├── 03_見積明細.xlsx
└── 関連資料/
    ├── 顧客要件書.pdf
    ├── 参考資料_01.pdf
    └── ...
```

## エラーハンドリング

各ノードで以下のエラー処理を実装:

```typescript
try {
  // メイン処理
} catch (error) {
  // エラーログ
  console.error('Error in node:', error);
  
  // ユーザーへの通知
  return [{
    json: {
      error: true,
      message: error.message,
      failedNode: $node.name,
      timestamp: new Date().toISOString()
    }
  }];
}
```

## セキュリティ要件

### 1. APIキー管理

```typescript
// .env.example
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_DRIVE_CLIENT_ID=xxxxx
GOOGLE_DRIVE_CLIENT_SECRET=xxxxx
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@example.com
SMTP_PASS=xxxxx

// n8nでの環境変数使用
const apiKey = process.env.ANTHROPIC_API_KEY;
```

### 2. ファイルアクセス制御

```typescript
// Webhook認証の実装
{
  "name": "Auth Check",
  "type": "n8n-nodes-base.function",
  "parameters": {
    "functionCode": `
const authHeader = $input.item.headers.authorization;
const expectedToken = process.env.WEBHOOK_AUTH_TOKEN;

if (!authHeader || authHeader !== \`Bearer \${expectedToken}\`) {
  throw new Error('Unauthorized');
}

return $input.item;
`
  }
}
```

### 3. データ保持ポリシー

```typescript
// 処理完了後の一時ファイル削除
{
  "name": "Cleanup Temp Files",
  "type": "n8n-nodes-base.function",
  "parameters": {
    "functionCode": `
const fs = require('fs');
const path = require('path');

// 24時間以上前のファイルを削除
const tempDir = '/tmp/n8n-uploads';
const files = fs.readdirSync(tempDir);
const now = Date.now();

files.forEach(file => {
  const filePath = path.join(tempDir, file);
  const stats = fs.statSync(filePath);
  const age = now - stats.mtimeMs;
  
  if (age > 24 * 60 * 60 * 1000) {
    fs.unlinkSync(filePath);
  }
});

return $input.all();
`
  }
}
```

## 詳細プロンプト集

### プロンプト1: メール内容解析

```typescript
const EMAIL_ANALYSIS_PROMPT = `
あなたは企業の購買部門担当者です。
以下の顧客からのメールを分析し、購入要求書作成に必要な情報を抽出してください。

【入力メール】
差出人: {from}
宛先: {to}
件名: {subject}
日時: {date}

本文:
{body}

添付ファイル:
{attachments}

【抽出タスク】
1. 顧客情報の特定
   - 会社名、部署名、担当者名、連絡先

2. 案件情報の抽出
   - プロジェクト名または案件名
   - 案件の背景・目的
   - 期待される成果物

3. 要求事項の整理
   - 機能要求（Must Have / Nice to Have）
   - 性能要求
   - 制約条件

4. スケジュール情報
   - 希望納期
   - マイルストーン
   - 制約となる日程

5. 予算・コスト情報
   - 予算上限（記載があれば）
   - コスト制約
   - 支払条件

6. 技術情報
   - 既存システム・環境
   - 技術的制約
   - インターフェース要件

7. その他重要事項
   - 特記事項
   - リスク要因
   - 添付資料の内容サマリー

【出力形式】
JSON形式で以下の構造を厳守:
{
  "customer": {
    "company": "株式会社○○",
    "department": "情報システム部",
    "contact": {
      "name": "山田太郎",
      "email": "yamada@example.com",
      "phone": "03-1234-5678"
    }
  },
  "project": {
    "name": "基幹システム刷新プロジェクト",
    "background": "現行システムの老朽化により...",
    "objectives": ["業務効率化", "データ統合"]
  },
  "requirements": {
    "functional": {
      "must": ["在庫管理機能", "発注機能"],
      "nice": ["モバイル対応"]
    },
    "performance": ["同時接続100ユーザー"],
    "constraints": ["既存DB移行必須"]
  },
  "schedule": {
    "deadline": "2025-12-31",
    "milestones": [
      {"name": "要件定義完了", "date": "2025-03-31"}
    ]
  },
  "budget": {
    "max": "5000万円",
    "constraints": ["年度内発注必須"]
  },
  "technical": {
    "existingSystem": "Oracle DB 11g",
    "constraints": ["オンプレミス限定"],
    "interfaces": ["既存会計システムとAPI連携"]
  },
  "attachments": [
    {"name": "現行システム概要.pdf", "summary": "..."}
  ],
  "risks": ["納期が短い", "要件が流動的"],
  "confidence": 85
}

【重要な注意事項】
- 明記されていない情報は推測せず、空文字列またはnullとする
- 曖昧な表現は「[要確認]」とマークする
- 複数の解釈が可能な場合は、最も妥当な解釈を採用し、その旨を備考に記載
- 数値情報は必ず根拠となるメール本文の該当箇所を引用する
- confidenceスコアは情報の明確さと完全性に基づいて算出（0-100）
`;
```

### プロンプト2: 技術仕様書自動生成

```typescript
const TECH_SPEC_GENERATION_PROMPT = `
以下の情報から技術仕様書を作成してください。

【入力情報】
顧客要求: {requirements}
見積範囲: {scope}
技術制約: {constraints}

【作成する技術仕様書の構成】

# 技術仕様書

## 1. 文書管理情報
- 文書番号: [自動採番]
- 版数: 1.0
- 作成日: {today}
- 最終更新日: {today}
- 承認者: [要入力]

## 2. システム概要
### 2.1 目的
{requirements.objectives}を達成するためのシステムを構築する。

### 2.2 適用範囲
{scope}

### 2.3 前提条件・制約事項
{constraints}

## 3. システム構成
### 3.1 全体構成図
[テキストベースの構成図を作成]

### 3.2 ハードウェア構成
| 項目 | 仕様 | 数量 | 備考 |
|------|------|------|------|
| サーバー | [スペック] | X台 | |
| ストレージ | [容量] | X台 | |

### 3.3 ソフトウェア構成
| 分類 | 製品名 | バージョン | ライセンス |
|------|--------|-----------|----------|
| OS | | | |
| DB | | | |
| MW | | | |

## 4. 機能仕様
### 4.1 機能一覧
{requirements.functional}を基に詳細化

### 4.2 機能詳細
各機能について以下を記述:
- 機能ID
- 機能名
- 概要
- 入力
- 処理
- 出力
- エラー処理

## 5. 非機能要件
### 5.1 性能要件
- レスポンスタイム: 
- スループット: 
- 同時接続数: {requirements.performance}

### 5.2 可用性要件
- 稼働率目標: 
- 保守時間帯: 

### 5.3 セキュリティ要件
- 認証方式: 
- アクセス制御: 
- データ暗号化: 

### 5.4 運用要件
- バックアップ方式: 
- 監視項目: 
- ログ保存期間: 

## 6. インターフェース仕様
### 6.1 外部システム連携
{technical.interfaces}

### 6.2 データ連携仕様
- 連携方式: 
- データフォーマット: 
- 連携タイミング: 

## 7. データ設計
### 7.1 データモデル
[ER図相当の記述]

### 7.2 主要テーブル定義
| テーブル名 | 概要 | 主キー | 備考 |
|-----------|------|--------|------|

## 8. 移行計画
### 8.1 移行対象データ
{technical.existingSystem}からの移行

### 8.2 移行方式
- 移行ツール: 
- 移行手順: 
- ロールバック計画: 

## 9. テスト計画
### 9.1 テスト種別
- 単体テスト
- 結合テスト
- システムテスト
- 受入テスト

### 9.2 テスト環境

## 10. 用語集

## 11. 参考資料

---

【作成時の注意事項】
1. 不明な項目は「[要確認: ○○が未定義]」と明記
2. 推定値は「[推定値: 根拠○○]」と表記
3. すべての技術用語は用語集に記載
4. 図表が必要な箇所はテキストベースで代替表現
5. 顧客要求との対応関係を明確にする

【出力形式】
Markdown形式で出力してください。
`;
```

### プロンプト3: コスト見積自動算出

```typescript
const COST_ESTIMATION_PROMPT = `
以下の情報から見積金額を算出してください。

【入力情報】
- 見積範囲: {scope}
- 要求仕様: {requirements}
- 納期: {deadline}
- 技術制約: {constraints}

【見積項目の分類】

## 1. ハードウェア費用
### 1.1 サーバー・ストレージ
- 項目ごとに: 製品名、スペック、単価、数量、小計

### 1.2 ネットワーク機器
- 項目ごとに: 製品名、スペック、単価、数量、小計

### 1.3 周辺機器
- 項目ごとに: 製品名、スペック、単価、数量、小計

## 2. ソフトウェア費用
### 2.1 ライセンス費用（初期）
- OS、DB、MW等

### 2.2 ライセンス費用（年間保守）
- 年間保守料

### 2.3 開発ツール

## 3. 開発費用
### 3.1 要件定義
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.2 基本設計
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.3 詳細設計
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.4 製造・単体テスト
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.5 結合テスト
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.6 システムテスト
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 3.7 プロジェクト管理
- 工数: XX人月 × 単価YY万円 = ZZ万円

## 4. 導入・移行費用
### 4.1 環境構築
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 4.2 データ移行
- 工数: XX人月 × 単価YY万円 = ZZ万円

### 4.3 教育・トレーニング
- 工数: XX人日 × 単価YY万円 = ZZ万円

## 5. その他費用
### 5.1 諸経費
- 交通費、宿泊費等

### 5.2 予備費
- 全体の10%程度

## 6. 見積サマリー
| 大分類 | 小計（万円） | 備考 |
|--------|-------------|------|
| ハードウェア | | |
| ソフトウェア | | |
| 開発費用 | | |
| 導入・移行 | | |
| その他 | | |
| **合計（税抜）** | | |
| 消費税10% | | |
| **総額（税込）** | | |

【算出根拠】
- 開発工数算出方法: {method}
- 人月単価設定根拠: {basis}
- リスク予備費: {risk_reserve}%

【前提条件】
- 見積有効期限: {validity_period}
- 支払条件: {payment_terms}
- 納品条件: {delivery_terms}

【注意事項】
1. 概算見積である旨を明記
2. 詳細設計後に金額変動の可能性を記載
3. 為替変動、製品価格改定のリスクを明記
4. 顧客側の作業範囲を明確化

【出力形式】
Excel互換のテーブル形式（CSV）とMarkdown形式の両方で出力してください。

CSVフォーマット:
大分類,中分類,項目,単価,数量,単位,小計,備考
...

Markdownフォーマット:
上記の構造に従って出力
`;
```

### プロンプト4: リスク分析

```typescript
const RISK_ANALYSIS_PROMPT = `
以下のプロジェクト情報からリスク分析を実施してください。

【プロジェクト情報】
- 案件名: {projectName}
- 納期: {deadline}
- 予算: {budget}
- 要求仕様: {requirements}
- 技術制約: {constraints}
- 顧客情報: {customer}

【リスク分析の視点】

## 1. スケジュールリスク
以下の観点で分析:
- 納期の妥当性評価
- クリティカルパスの特定
- バッファ期間の有無
- 依存関係によるリスク

各リスクについて:
- リスク項目: 
- 発生確率: 高/中/低
- 影響度: 高/中/低
- リスク値: 発生確率 × 影響度
- 対策: 予防策と発生時対応

## 2. コストリスク
以下の観点で分析:
- 予算超過の可能性
- 為替変動リスク
- 人件費変動リスク
- 隠れコストの可能性

## 3. 技術リスク
以下の観点で分析:
- 技術的実現可能性
- 新技術採用のリスク
- 既存システムとの整合性
- 技術者のスキルギャップ

## 4. 要件リスク
以下の観点で分析:
- 要件の明確性
- 要件変更の可能性
- ステークホルダー間の合意度
- スコープクリープの可能性

## 5. 品質リスク
以下の観点で分析:
- テスト期間の妥当性
- 品質基準の明確性
- レビュープロセスの有無
- 品質保証体制

## 6. 外部リスク
以下の観点で分析:
- ベンダー依存度
- 法規制変更の可能性
- 災害等の外部要因
- 顧客側体制の不確実性

【リスク評価マトリクス】

| リスクID | リスク項目 | 発生確率 | 影響度 | リスク値 | 対策優先度 |
|---------|-----------|---------|--------|---------|-----------|
| R001 | | | | | |

【対策一覧】

| リスクID | 予防策 | 発生時対応 | 責任者 | 期限 |
|---------|--------|-----------|--------|------|
| R001 | | | | |

【総合評価】
- プロジェクト全体のリスクレベル: 高/中/低
- 最重要リスク TOP3
- プロジェクト実施可否の推奨: 実施推奨/条件付推奨/非推奨

【推奨事項】
1. 
2. 
3. 

【出力形式】
Markdown形式で、見やすい表形式を使用してください。
`;
```

## 実装用ヘルパー関数集

### ヘルパー1: Claude API呼び出しラッパー

```typescript
// utils/claudeApi.ts
import Anthropic from '@anthropic-ai/sdk';

interface ClaudeRequestOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export async function callClaude(
  options: ClaudeRequestOptions
): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.5,
      system: options.systemPrompt || '',
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response type');
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Claude API failed: ${error.message}`);
  }
}

// JSON抽出ヘルパー
export function extractJSON(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  return JSON.parse(jsonMatch[0]);
}
```

### ヘルパー2: ドキュメント変換ユーティリティ

```typescript
// utils/documentConverter.ts
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';

export async function markdownToPdf(
  markdown: string,
  outputPath: string
): Promise<void> {
  const md = new MarkdownIt();
  const html = md.render(markdown);

  const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Noto Sans JP', sans-serif;
      line-height: 1.6;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { color: #333; border-bottom: 2px solid #333; }
    h2 { color: #555; border-bottom: 1px solid #ddd; margin-top: 30px; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th { background-color: #f5f5f5; }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
  });
  await browser.close();
}

export async function markdownToDocx(
  markdown: string,
  outputPath: string
): Promise<void> {
  // pandocを使用した変換
  const { execSync } = require('child_process');
  const fs = require('fs');
  
  const tempMdPath = '/tmp/temp.md';
  fs.writeFileSync(tempMdPath, markdown);
  
  execSync(`pandoc ${tempMdPath} -o ${outputPath}`);
  fs.unlinkSync(tempMdPath);
}
```

### ヘルパー3: Excel操作ユーティリティ

```typescript
// utils/excelUtils.ts
import ExcelJS from 'exceljs';

export interface ExcelCellMapping {
  cell: string;
  value: any;
  formula?: string;
}

export async function fillExcelTemplate(
  templatePath: string,
  mappings: ExcelCellMapping[],
  outputPath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(templatePath);

  const worksheet = workbook.getWorksheet(1);

  mappings.forEach(mapping => {
    const cell = worksheet.getCell(mapping.cell);
    if (mapping.formula) {
      cell.value = { formula: mapping.formula };
    } else {
      cell.value = mapping.value;
    }
  });

  await workbook.xlsx.writeFile(outputPath);
}

export async function createCostEstimateSheet(
  data: CostEstimateData,
  outputPath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('見積明細');

  // ヘッダー設定
  worksheet.columns = [
    { header: '大分類', key: 'category', width: 15 },
    { header: '中分類', key: 'subcategory', width: 20 },
    { header: '項目', key: 'item', width: 30 },
    { header: '単価', key: 'unitPrice', width: 12 },
    { header: '数量', key: 'quantity', width: 8 },
    { header: '単位', key: 'unit', width: 8 },
    { header: '小計', key: 'subtotal', width: 15 },
    { header: '備考', key: 'notes', width: 25 },
  ];

  // スタイル設定
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // データ行追加
  let rowNumber = 2;
  data.items.forEach(item => {
    const row = worksheet.addRow({
      category: item.category,
      subcategory: item.subcategory,
      item: item.item,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      unit: item.unit,
      subtotal: { formula: `D${rowNumber}*E${rowNumber}` },
      notes: item.notes,
    });
    
    row.getCell(7).numFmt = '¥#,##0';
    rowNumber++;
  });

  // 合計行
  const totalRow = worksheet.addRow({
    category: '合計',
    subtotal: { 
      formula: `SUM(G2:G${rowNumber - 1})` 
    },
  });
  totalRow.font = { bold: true };
  totalRow.getCell(7).numFmt = '¥#,##0';

  await workbook.xlsx.writeFile(outputPath);
}
```

## 完全なTypeScript型定義

```typescript
// types/index.ts

// 顧客情報
export interface CustomerInfo {
  company: string;
  department: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

// プロジェクト情報
export interface ProjectInfo {
  name: string;
  background: string;
  objectives: string[];
  deadline: string;
}

// 要求仕様
export interface Requirements {
  functional: {
    must: string[];
    nice: string[];
  };
  performance: string[];
  constraints: string[];
}

// 技術情報
export interface TechnicalInfo {
  existingSystem: string;
  constraints: string[];
  interfaces: string[];
}

// コンテキスト分析結果
export interface ContextAnalysisResult {
  customer: CustomerInfo;
  project: ProjectInfo;
  requirements: Requirements;
  technical: TechnicalInfo;
  budget?: {
    max: string;
    constraints: string[];
  };
  attachments: Array<{
    name: string;
    summary: string;
  }>;
  risks: string[];
  confidence: number;
}

// 見積範囲
export interface ScopeDefinition {
  selectedItems: string[];
  additionalItems: string;
  excludedItems: string;
  priority: 'high' | 'medium' | 'low';
  specialRequirements: string;
}

// ギャップ分析結果
export interface GapAnalysisResult {
  completeness: number;
  availableInfo: Record<string, any>;
  missingInfo: Array<{
    field: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    suggestedSource: string;
  }>;
  suggestedDocs: Array<{
    type: 'technical_spec' | 'reference' | 'standard' | 'template';
    title: string;
    reason: string;
    searchQuery?: string;
  }>;
  riskAssessment: Array<{
    risk: string;
    impact: 'high' | 'medium' | 'low';
    mitigation: string;
  }>;
}

// 生成ドキュメント
export interface GeneratedDocuments {
  mainRequisition: string;
  technicalSpec?: string;
  costEstimate?: Buffer;
  attachments?: Array<{
    originalName: string;
    buffer: Buffer;
  }>;
}

// コスト見積データ
export interface CostEstimateData {
  items: Array<{
    category: string;
    subcategory: string;
    item: string;
    unitPrice: number;
    quantity: number;
    unit: string;
    notes: string;
  }>;
  summary: {
    hardware: number;
    software: number;
    development: number;
    deployment: number;
    other: number;
    total: number;
    tax: number;
    grandTotal: number;
  };
}

// ワークフロー状態
export interface WorkflowState {
  id: string;
  status: 'pending' | 'analyzing' | 'scope_selection' | 'generating' | 'editing' | 'completed' | 'error';
  currentStep: string;
  contextAnalysis?: ContextAnalysisResult;
  scopeDefinition?: ScopeDefinition;
  gapAnalysis?: GapAnalysisResult;
  documents?: GeneratedDocuments;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## n8n カスタムノード実装例

### カスタムノード: 高度なファイル解析

```typescript
// nodes/AdvancedFileParser/AdvancedFileParser.node.ts
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import { parseEmail } from 'mailparser';

export class AdvancedFileParser implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Advanced File Parser',
    name: 'advancedFileParser',
    group: ['transform'],
    version: 1,
    description: 'Parse PDF, DOCX, XLSX, and Email files with advanced extraction',
    defaults: {
      name: 'Advanced File Parser',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'File Type',
        name: 'fileType',
        type: 'options',
        options: [
          { name: 'PDF', value: 'pdf' },
          { name: 'Word Document', value: 'docx' },
          { name: 'Excel', value: 'xlsx' },
          { name: 'Email', value: 'email' },
          { name: 'Auto Detect', value: 'auto' },
        ],
        default: 'auto',
      },
      {
        displayName: 'Binary Property',
        name: 'binaryProperty',
        type: 'string',
        default: 'data',
        required: true,
      },
      {
        displayName: 'Extract Tables',
        name: 'extractTables',
        type: 'boolean',
        default: true,
        description: 'Extract tables from documents (PDF, DOCX, XLSX)',
      },
      {
        displayName: 'Extract Metadata',
        name: 'extractMetadata',
        type: 'boolean',
        default: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;
        const fileType = this.getNodeParameter('fileType', i) as string;
        const extractTables = this.getNodeParameter('extractTables', i) as boolean;
        const extractMetadata = this.getNodeParameter('extractMetadata', i) as boolean;

        const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
        const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

        let result: any = {};

        // ファイルタイプの自動検出
        const detectedType = fileType === 'auto' 
          ? this.detectFileType(binaryData.mimeType, binaryData.fileName)
          : fileType;

        switch (detectedType) {
          case 'pdf':
            result = await this.parsePDF(buffer, extractTables, extractMetadata);
            break;
          case 'docx':
            result = await this.parseDOCX(buffer, extractTables, extractMetadata);
            break;
          case 'xlsx':
            result = await this.parseXLSX(buffer, extractMetadata);
            break;
          case 'email':
            result = await this.parseEmail(buffer, extractMetadata);
            break;
          default:
            throw new Error(`Unsupported file type: ${detectedType}`);
        }

        returnData.push({
          json: {
            fileType: detectedType,
            fileName: binaryData.fileName,
            ...result,
          },
          binary: items[i].binary,
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }

  private detectFileType(mimeType: string, fileName?: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || fileName?.endsWith('.docx')) return 'docx';
    if (mimeType.includes('sheet') || fileName?.endsWith('.xlsx')) return 'xlsx';
    if (mimeType.includes('message') || fileName?.endsWith('.eml')) return 'email';
    return 'unknown';
  }

  private async parsePDF(
    buffer: Buffer,
    extractTables: boolean,
    extractMetadata: boolean
  ): Promise<any> {
    const data = await pdf(buffer);
    
    const result: any = {
      text: data.text,
      pageCount: data.numpages,
    };

    if (extractMetadata && data.info) {
      result.metadata = {
        title: data.info.Title,
        author: data.info.Author,
        subject: data.info.Subject,
        creator: data.info.Creator,
        creationDate: data.info.CreationDate,
      };
    }

    if (extractTables) {
      // 簡易的なテーブル検出（正規表現ベース）
      result.tables = this.extractTablesFromText(data.text);
    }

    return result;
  }

  private async parseDOCX(
    buffer: Buffer,
    extractTables: boolean,
    extractMetadata: boolean
  ): Promise<any> {
    const result = await mammoth.extractRawText({ buffer });
    
    const output: any = {
      text: result.value,
    };

    if (extractTables) {
      // mammothでテーブル抽出
      const tableResult = await mammoth.convertToHtml({ buffer });
      output.tables = this.extractTablesFromHtml(tableResult.value);
    }

    return output;
  }

  private async parseXLSX(
    buffer: Buffer,
    extractMetadata: boolean
  ): Promise<any> {
    const workbook = XLSX.read(buffer, { 
      cellDates: true,
      cellStyles: extractMetadata 
    });

    const result: any = {
      sheets: [],
    };

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      result.sheets.push({
        name: sheetName,
        data: data,
        rowCount: data.length,
        columnCount: data[0]?.length || 0,
      });
    });

    if (extractMetadata && workbook.Props) {
      result.metadata = {
        title: workbook.Props.Title,
        subject: workbook.Props.Subject,
        author: workbook.Props.Author,
        createdDate: workbook.Props.CreatedDate,
      };
    }

    return result;
  }

  private async parseEmail(
    buffer: Buffer,
    extractMetadata: boolean
  ): Promise<any> {
    const parsed = await parseEmail(buffer);

    const result: any = {
      from: parsed.from?.text,
      to: parsed.to?.text,
      subject: parsed.subject,
      date: parsed.date,
      text: parsed.text,
      html: parsed.html,
      attachments: parsed.attachments?.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
      })),
    };

    if (extractMetadata) {
      result.metadata = {
        messageId: parsed.messageId,
        inReplyTo: parsed.inReplyTo,
        references: parsed.references,
        headers: parsed.headers,
      };
    }

    return result;
  }

  private extractTablesFromText(text: string): any[] {
    // 簡易的なテーブル検出ロジック
    const tables: any[] = [];
    const lines = text.split('\n');
    let currentTable: string[] = [];
    let inTable = false;

    for (const line of lines) {
      // 行に複数のタブまたは複数のスペース区切りがある場合、テーブルと判定
      const cellCount = line.split(/\t|\s{2,}/).length;
      
      if (cellCount > 2) {
        inTable = true;
        currentTable.push(line);
      } else if (inTable) {
        if (currentTable.length > 2) {
          tables.push(this.parseTableLines(currentTable));
        }
        currentTable = [];
        inTable = false;
      }
    }

    return tables;
  }

  private parseTableLines(lines: string[]): any {
    const rows = lines.map(line => 
      line.split(/\t|\s{2,}/).filter(cell => cell.trim())
    );

    if (rows.length === 0) return null;

    return {
      headers: rows[0],
      data: rows.slice(1),
    };
  }

  private extractTablesFromHtml(html: string): any[] {
    // HTMLからテーブル抽出（簡易版）
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const tables: any[] = [];
    let match;

    while ((match = tableRegex.exec(html)) !== null) {
      const tableHtml = match[1];
      const rows = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
      
      const tableData = rows.map(row => {
        const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
        return cells.map(cell => cell.replace(/<[^>]+>/g, '').trim());
      });

      if (tableData.length > 0) {
        tables.push({
          headers: tableData[0],
          data: tableData.slice(1),
        });
      }
    }

    return tables;
  }
}
```

## React フロントエンド実装例

### メインアプリケーション

```typescript
// app/requisition-generator/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import ScopeSelector from '@/components/ScopeSelector';
import DocumentEditor from '@/components/DocumentEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, FileText, Download } from 'lucide-react';

type Step = 'upload' | 'scope' | 'analysis' | 'edit' | 'complete';

export default function RequisitionGeneratorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [workflowId, setWorkflowId] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [contextAnalysis, setContextAnalysis] = useState<any>(null);
  const [scopeDefinition, setScopeDefinition] = useState<any>(null);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);
  const [documents, setDocuments] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const stepProgress = {
    upload: 0,
    scope: 25,
    analysis: 50,
    edit: 75,
    complete: 100,
  };

  const handleFileUpload = async (files: File[]) => {
    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('/api/n8n/purchase-request-start', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('File upload failed');

      const data = await response.json();
      setWorkflowId(data.workflowId);
      setContextAnalysis(data.contextAnalysis);
      setUploadedFiles(files);
      setCurrentStep('scope');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScopeSubmit = async (scope: any) => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch(`/api/n8n/scope-selection/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scope),
      });

      if (!response.ok) throw new Error('Scope submission failed');

      const data = await response.json();
      setGapAnalysis(data.gapAnalysis);
      setScopeDefinition(scope);
      
      if (data.gapAnalysis.completeness >= 75) {
        setCurrentStep('analysis');
        await generateDocuments();
      } else {
        setError('情報が不足しています。追加情報を入力してください。');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDocuments = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/n8n/generate-documents/${workflowId}`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Document generation failed');

      const data = await response.json();
      setDocuments(data.documents);
      setCurrentStep('edit');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDocumentSave = async (editedDocs: any) => {
    setIsProcessing(true);

    try {
      const response = await fetch(`/api/n8n/finalize/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedDocs),
      });

      if (!response.ok) throw new Error('Finalization failed');

      const data = await response.json();
      setCurrentStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    const response = await fetch(`/api/n8n/download/${workflowId}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `購入要求書_${new Date().toISOString().split('T')[0]}.zip`;
    a.click();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">購入要求書自動生成システム</h1>
        <p className="text-gray-600">
          資料をアップロードして、AIが自動的に購入要求書を作成します
        </p>
      </div>

      <Progress value={stepProgress[currentStep]} className="mb-8" />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {currentStep === 'upload' && (
            <FileUploader
              onUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'scope' && contextAnalysis && (
            <ScopeSelector
              contextAnalysis={contextAnalysis}
              onSubmit={handleScopeSubmit}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'analysis' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">ドキュメントを生成中...</p>
              <p className="text-sm text-gray-500 mt-2">
                購入要求書、技術仕様書、見積明細を作成しています
              </p>
            </div>
          )}

          {currentStep === 'edit' && documents && (
            <DocumentEditor
              documents={documents}
              gapAnalysis={gapAnalysis}
              onSave={handleDocumentSave}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">完成しました！</h2>
              <p className="text-gray-600 mb-8">
                購入要求書パッケージの準備が整いました
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleDownload} size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  ダウンロード
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/requisition-generator/new')}
                >
                  新規作成
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ステップインジケーター */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center space-x-4">
          {(['upload', 'scope', 'analysis', 'edit', 'complete'] as Step[]).map(
            (step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    stepProgress[currentStep] >= stepProgress[step]
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 4 && (
                  <div
                    className={`w-16 h-0.5 ${
                      stepProgress[currentStep] > stepProgress[step]
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
```

### コンポーネント: ファイルアップローダー

```typescript
// components/FileUploader.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
}

export default function FileUploader({ onUpload, isProcessing }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'message/rfc822': ['.eml'],
      'text/plain': ['.txt'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'ここにドロップ' : 'ファイルをドラッグ＆ドロップ'}
        </p>
        <p className="text-sm text-gray-500">
          または クリックしてファイルを選択
        </p>
        <p className="text-xs text-gray-400 mt-4">
          対応形式: PDF, DOCX, XLSX, EML, TXT (最大50MB)
        </p>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">アップロード予定のファイル ({files.length})</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={files.length === 0 || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? '処理中...' : 'アップロードして分析開始'}
      </Button>
    </div>
  );
}
```

### コンポーネント: 見積範囲選択

```typescript
// components/ScopeSelector.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {