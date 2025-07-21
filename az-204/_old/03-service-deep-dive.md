# Azure Functions - サービス詳細解説

## 概要

Azure Functionsは、Microsoft Azureが提供するサーバーレスコンピューティングサービスです。イベント駆動型のコードを実行でき、インフラストラクチャの管理を気にすることなく、小さなコード（関数）を実行できます。

## 主要概念

### 1. サーバーレスコンピューティング

- **イベント駆動**: 特定のイベントやトリガーに応答してコードが実行される
- **自動スケーリング**: 需要に応じて自動的にスケールアップ・ダウン
- **従量課金**: 実行時間とリソース使用量に基づく課金

### 2. Functions App

- 関数のコンテナとして機能
- 同じアプリケーション設定、デプロイ構成、ランタイムバージョンを共有
- リソースグループ内で管理される

### 3. 関数の構成要素

- **トリガー**: 関数を実行するイベント（HTTPリクエスト、タイマー、Blobの変更など）
- **バインディング**: 入力および出力データの接続方法
- **ランタイム**: 関数の実行環境（Node.js、Python、C#、Java、PowerShellなど）

## サポートされる言語とランタイム

### プログラミング言語

- **C#** (.NET 6, .NET 8)
- **JavaScript/TypeScript** (Node.js 18, 20)
- **Python** (3.8, 3.9, 3.10, 3.11)
- **Java** (8, 11, 17, 21)
- **PowerShell** (7.0, 7.2, 7.4)

### プログラミングモデル

- **JavaScript v4プログラミングモデル** (推奨)
- **Python v2プログラミングモデル** (推奨)
- **.NET分離プロセスモデル** (推奨)

## トリガーの種類

### 1. HTTPトリガー

```javascript
// JavaScript v4プログラミングモデル例
const { app } = require('@azure/functions');

app.http('HttpExample', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        return { body: `Hello, ${request.query.get('name') || 'World'}!` };
    }
});
```

### 2. タイマートリガー

```python
# Python v2プログラミングモデル例
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="TimerTrigger")
@app.timer_trigger(schedule="0 */5 * * * *", arg_name="myTimer", run_on_startup=True)
def timer_trigger(myTimer: func.TimerRequest) -> None:
    logging.info('Timer trigger function executed.')
```

### 3. Blobトリガー

```csharp
// C# 分離プロセスモデル例
[Function("BlobTrigger")]
public void Run([BlobTrigger("samples-workitems/{name}", Source = BlobTriggerSource.EventGrid)] Stream blob, string name)
{
    _logger.LogInformation($"Blob trigger function processed: {name}");
}
```

### 4. その他のトリガー

- **Queue Storage**: Azure Storage Queueのメッセージ処理
- **Service Bus**: Service Busキューやトピックからのメッセージ処理
- **Event Grid**: Event Gridイベントの処理
- **Cosmos DB**: Cosmos DBの変更フィードの処理
- **Event Hubs**: Event Hubsからのストリーミングデータ処理

## バインディング

### 入力バインディング

データソースから関数にデータを渡す仕組み

### 出力バインディング

関数から外部サービスにデータを送信する仕組み

### バインディング例

```javascript
// JavaScript v4プログラミングモデル - Cosmos DB出力バインディング
const { app, output } = require('@azure/functions');

const cosmosDBOutput = output.cosmosDB({
    databaseName: 'MyDatabase',
    containerName: 'MyContainer',
    connection: 'CosmosDBConnection'
});

app.http('CosmosDBOutput', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosDBOutput],
    handler: async (request, context) => {
        const newItem = await request.json();
        context.extraOutputs.set(cosmosDBOutput, newItem);
        return { body: 'Item saved to Cosmos DB' };
    }
});
```

## ホスティングプラン

### 1. 従量課金プラン (Consumption Plan)

- **特徴**: 真のサーバーレス、自動スケーリング
- **制限**: 最大実行時間5分（デフォルト）、最大10分まで設定可能
- **課金**: 実行時間とメモリ使用量に基づく

### 2. Premium プラン

- **特徴**:
  - ウォームアップされたインスタンス（コールドスタート回避）
  - より長い実行時間（無制限）
  - より多くのCPUとメモリ
  - VNet接続
- **課金**: インスタンスサイズと実行時間に基づく

### 3. App Service プラン

- **特徴**:
  - 既存のApp Serviceリソースで実行
  - 予測可能な課金
  - 長時間実行が可能
- **課金**: App Serviceプランに基づく固定費用

### 4. Container Apps環境

- **特徴**: コンテナベースの実行環境
- **利点**: Kubernetes環境での実行、より柔軟な設定

## 開発ツールとベストプラクティス

### Azure Functions Core Tools

```bash
# インストール
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# 新しいFunction Appの作成
func init MyFunctionApp --typescript

# 新しい関数の作成
func new --name HttpExample --template "HTTP trigger"

# ローカルでの実行
func start
```

### local.settings.json

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing"
  },
  "Host": {
    "CORS": "*"
  }
}
```

### host.json設定

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "functionTimeout": "00:05:00",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true
      }
    }
  }
}
```

## セキュリティ

### 認証レベル

- **Anonymous**: 認証不要
- **Function**: 関数キーが必要
- **Admin**: マスターキーが必要

### アクセスキー

- **Function Key**: 特定の関数へのアクセス
- **Host Key**: Function App内のすべての関数へのアクセス
- **Master Key**: 管理操作用

### マネージドID

```csharp
// マネージドIDを使用したKey Vaultアクセス例
[Function("KeyVaultExample")]
public async Task<HttpResponseData> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
{
    var credential = new DefaultAzureCredential();
    var client = new SecretClient(new Uri("https://myvault.vault.azure.net/"), credential);
    var secret = await client.GetSecretAsync("MySecret");
    
    var response = req.CreateResponse(HttpStatusCode.OK);
    await response.WriteStringAsync($"Secret value: {secret.Value.Value}");
    return response;
}
```

## 監視とログ

### Application Insights統合

```javascript
// カスタムテレメトリの送信
const { app } = require('@azure/functions');

app.http('TelemetryExample', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        // カスタムイベントの記録
        context.log('Custom log message');
        
        // メトリクスの送信
        context.log.metric('CustomMetric', 42);
        
        return { body: 'Telemetry sent' };
    }
});
```

### ログ分析クエリ例

```kusto
// 過去24時間のエラーログ
traces
| where timestamp > ago(24h)
| where severityLevel >= 3
| project timestamp, message, severityLevel
| order by timestamp desc

// 関数の実行時間分析
requests
| where timestamp > ago(1h)
| summarize avg(duration), count() by operation_Name
| order by avg_duration desc
```

## パフォーマンス最適化

### コールドスタート対策

1. **Premium プランの使用**
2. **接続プールの利用**
3. **静的初期化の活用**
4. **ウォームアップ関数の実装**

### メモリ使用量最適化

```python
# 効率的なメモリ使用例
import azure.functions as func
import json
from typing import List

# グローバルに重い初期化処理を配置
heavy_resource = initialize_heavy_resource()

@app.function_name(name="OptimizedFunction")
@app.http_trigger(methods=["POST"], auth_level=func.AuthLevel.FUNCTION)
def optimized_function(req: func.HttpRequest) -> func.HttpResponse:
    # ストリーミング処理でメモリ効率を向上
    data = req.get_json()
    result = process_data_efficiently(data, heavy_resource)
    
    return func.HttpResponse(
        json.dumps(result),
        mimetype="application/json"
    )
```

## Durable Functions

### オーケストレーション関数

```csharp
[Function(nameof(ChainingOrchestrator))]
public async Task<string> ChainingOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var result1 = await context.CallActivityAsync<string>("Step1", "input1");
    var result2 = await context.CallActivityAsync<string>("Step2", result1);
    var result3 = await context.CallActivityAsync<string>("Step3", result2);
    
    return result3;
}

[Function("Step1")]
public string Step1([ActivityTrigger] string input)
{
    return $"Step1: {input}";
}
```

## エラーハンドリングと再試行

### 再試行ポリシー

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "retry": {
    "strategy": "exponentialBackoff",
    "maxRetryCount": 3,
    "minimumInterval": "00:00:02",
    "maximumInterval": "00:00:10"
  }
}
```

### 例外処理

```javascript
const { app } = require('@azure/functions');

app.http('ErrorHandlingExample', {
    methods: ['POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        try {
            const data = await request.json();
            const result = await processData(data);
            return { 
                status: 200,
                body: JSON.stringify(result)
            };
        } catch (error) {
            context.log.error('Processing failed:', error);
            
            if (error.name === 'ValidationError') {
                return {
                    status: 400,
                    body: JSON.stringify({ error: 'Invalid input data' })
                };
            }
            
            return {
                status: 500,
                body: JSON.stringify({ error: 'Internal server error' })
            };
        }
    }
});
```

## デプロイメント

### Azure CLI

```bash
# リソースグループの作成
az group create --name myResourceGroup --location japaneast

# Function Appの作成
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location japaneast \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name myFunctionApp \
  --storage-account mystorageaccount

# デプロイ
func azure functionapp publish myFunctionApp
```

### GitHub Actions

```yaml
name: Deploy Azure Functions

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Deploy to Azure Functions
      uses: Azure/functions-action@v1
      with:
        app-name: myFunctionApp
        slot-name: production
        package: .
        publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

## よくある問題と解決策

### 1. コールドスタート

**問題**: 初回実行時の遅延

**解決策**:

- Premium プランの使用
- ウォームアップ関数の実装
- 接続プールの利用

### 2. タイムアウト

**問題**: 関数の実行時間制限

**解決策**:

- host.jsonでtimeout設定を調整
- 長時間処理はDurable Functionsを使用
- Premium プランへの移行

### 3. メモリ不足

**問題**: メモリ使用量の超過

**解決策**:

- ストリーミング処理の実装
- 不要なライブラリの削除
- Premium プランでのメモリ増強

## まとめ

Azure Functionsは、モダンなサーバーレスアプリケーション開発において強力なツールです。適切なプログラミングモデルの選択、効率的なトリガーとバインディングの活用、そしてパフォーマンス最適化により、スケーラブルで費用対効果の高いソリューションを構築できます。

### キーポイント

- **最新のプログラミングモデル**を使用する（v4 for JavaScript, v2 for Python）
- **適切なホスティングプラン**を選択する
- **Extension Bundles**を使用してバインディングを管理する
- **Application Insights**で監視とログ分析を行う
- **Durable Functions**で複雑なワークフローを実装する

この学習資料を参考に、Azure Functionsの理解を深め、実際の開発に活かしてください。
