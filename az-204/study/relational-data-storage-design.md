# AZ-204 試験対策：リレーショナル データ用にデータ ストレージ ソリューションを設計する

## 概要

このドキュメントは、AZ-204（Microsoft Azure Developer Associate）試験の「リレーショナル データ用にデータ ストレージ ソリューションを設計する」トピックの学習資料です。

## 📚 学習目標

この章を学習することで、以下の能力を身につけることができます：

- Azure SQL Database の設計と選択
- Azure SQL Managed Instance の適切な使用場面
- SQL Server on Azure VMs の設計
- データベースのスケーラビリティソリューション
- データベースの可用性ソリューション
- データセキュリティの設計（保存時、転送時、使用時）
- Azure SQL Edge の設計
- Azure Cosmos DB と Table Storage の設計

---

## 1. Azure SQL Database

### 1.1 概要

**Azure SQL Database** は、SQL Server データベース エンジンに基づく、完全に管理されたクラウド データベース サービスです。

#### 主な特徴

- **99.99%** の可用性 SLA
- 自動的なパッチ適用とアップデート
- 組み込みの高可用性
- インテリジェントなパフォーマンス チューニング
- 組み込みのセキュリティ機能

### 1.2 購入モデル

Azure SQL Database では、2つの購入モデルが利用可能です：

#### 🔧 DTU vs vCore の詳細比較

**DTU（Database Transaction Unit）とは？**

- CPU、メモリ、I/Oを組み合わせた**統合測定単位**
- 「お弁当セット」のような事前パッケージ化されたリソース
- シンプルで理解しやすいが、個別リソースの調整は不可

**vCore（仮想コア）とは？**

- CPU、メモリ、ストレージを**独立して選択**できるモデル
- 「アラカルトメニュー」のような柔軟なリソース選択
- より細かい制御が可能だが、設定が複雑

| 比較項目                 | DTU ベース       | vCore ベース                |
| ------------------------ | ---------------- | --------------------------- |
| **リソース制御**         | 事前パッケージ化 | 個別に選択可能              |
| **価格体系**             | シンプル         | 複雑だが柔軟                |
| **スケーリング**         | DTU数のみ        | CPU、メモリ、ストレージ独立 |
| **Azure Hybrid Benefit** | ❌ 利用不可       | ✅ 利用可能                  |
| **Reserved Capacity**    | ❌ 利用不可       | ✅ 利用可能                  |
| **適用場面**             | 簡単な管理を重視 | コスト最適化・詳細制御      |

#### 🏗️ DTU ベース購入モデル

##### 特徴：シンプルさ重視

- CPU、メモリ、I/O をバンドルした事前構成パッケージ
- 初心者にとって理解しやすい
- 設定が簡単で迅速なデプロイが可能

**DTU計算の例：**

```text
DTU = CPU使用率 + メモリ使用率 + I/O使用率
例：CPU 80% + メモリ 70% + I/O 60% = 約210 DTU必要
```

| サービス レベル | DTU範囲      | 用途                 | 最大データベースサイズ |
| --------------- | ------------ | -------------------- | ---------------------- |
| **Basic**       | 5 DTU        | 軽いワークロード     | 2 GB                   |
| **Standard**    | 10-3000 DTU  | 一般的なワークロード | 1 TB                   |
| **Premium**     | 125-4000 DTU | 高パフォーマンス要求 | 4 TB                   |

#### ⚙️ vCore ベース購入モデル（推奨）

##### 特徴：柔軟性と制御

- vCore 数、メモリ量、ストレージを独立して選択可能
- Azure Hybrid Benefit でコスト削減可能（最大55%割引）
- Reserved Capacity で追加割引可能

**vCore構成例：**

```text
選択例1：開発環境
- vCore: 2個
- メモリ: 10.4 GB
- ストレージ: 32 GB

選択例2：本番環境
- vCore: 8個
- メモリ: 41.6 GB  
- ストレージ: 1 TB
```

#### 🎯 DTU vs vCore 使い分けの指針

**DTUベースを選ぶべき場合：**

- 🆕 **Azure SQL Database初心者**：設定が簡単
- ⏰ **迅速なデプロイが必要**：すぐに始められる
- 🔧 **管理の複雑さを避けたい**：シンプルな価格体系
- 💼 **小〜中規模のアプリケーション**：Standard/Premium DTUで十分

**vCoreベースを選ぶべき場合：**

- 💰 **コスト最適化が重要**：Azure Hybrid Benefitで大幅節約
- 🎛️ **詳細なリソース制御が必要**：CPU、メモリ、ストレージを個別調整
- 📈 **スケーラビリティが重要**：ワークロードの変化に柔軟対応
- 🏢 **エンタープライズ環境**：長期運用でコスト効率を重視
- 🖥️ **既存のSQL Serverライセンス**：Hybrid Benefitでライセンス活用

#### 💡 実際の選択シナリオ

| シナリオ                   | 推奨モデル              | 理由                       |
| -------------------------- | ----------------------- | -------------------------- |
| **スタートアップのMVP**    | DTU (Standard S2)       | シンプル、低コスト         |
| **既存システムの移行**     | vCore + Hybrid Benefit  | ライセンス活用でコスト削減 |
| **予測困難なワークロード** | vCore サーバーレス      | 使用量ベース課金           |
| **高パフォーマンス要求**   | vCore Business Critical | 詳細制御可能               |
| **開発・テスト環境**       | DTU Basic/Standard      | シンプル管理               |

#### 📊 コスト比較例（東日本リージョン）

```text
シナリオ：中規模Webアプリ（月間100万PV）

DTUベース（Standard S4: 200 DTU）
- 月額費用：約¥15,000
- 設定：簡単
- 拡張性：DTU単位のみ

vCoreベース（General Purpose 2vCore）
- 月額費用：約¥18,000（通常価格）
- 月額費用：約¥8,100（Hybrid Benefit適用時）
- 設定：複雑
- 拡張性：柔軟
```

#### 🔄 移行のタイミング

**DTU → vCore 移行を検討すべき時：**

1. **コスト削減の必要性**：Hybrid Benefitで大幅削減可能
2. **パフォーマンス要件の変化**：個別リソース調整が必要
3. **長期運用の決定**：Reserved Capacityでさらに割引
4. **複数データベースの管理**：エラスティックプールの活用

**移行手順：**

```sql
-- 1. 現在のDTU使用状況を確認
SELECT 
    start_time,
    avg_cpu_percent,
    avg_memory_usage_percent,
    avg_log_write_percent
FROM sys.dm_db_resource_stats
ORDER BY start_time DESC;

-- 2. 推奨vCore数を算出
-- 100 DTU ≒ 1 vCore（目安）
```

### 1.3 コンピューティング レベル

#### プロビジョニング済みコンピューティング

- 継続的にプロビジョニングされる固定量のコンピューティング リソース
- 時間単位の固定料金

#### サーバーレス コンピューティング

- ワークロード アクティビティに基づく自動スケーリング
- 使用したコンピューティング量に基づく秒単位の課金
- 非アクティブ期間中の自動一時停止

### 1.4 設計時の考慮事項

#### パフォーマンス最適化

```sql
-- インデックス作成例
CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);

-- パフォーマンス監視
SELECT * FROM sys.dm_db_index_usage_stats;
```

#### 接続プール設定

```csharp
// C# での接続プール設定例
var connectionString = "Server=tcp:myserver.database.windows.net,1433;" +
                      "Database=mydatabase;" +
                      "User ID=myuser@myserver;" +
                      "Password=mypassword;" +
                      "Trusted_Connection=False;" +
                      "Encrypt=True;" +
                      "Connection Timeout=30;" +
                      "Max Pool Size=100;";
```

---

## 2. Azure SQL Managed Instance

### 2.1 概要

**Azure SQL Managed Instance** は、SQL Server との高い互換性を持つ完全管理型サービスです。

#### 適用場面

- SQL Server からのリフト アンド シフト移行
- SQL Server Agent が必要
- CLR（Common Language Runtime）の使用
- Service Broker の使用
- 複数データベース間の参照

### 2.2 主な機能

#### ネイティブ仮想ネットワーク

- 専用の仮想ネットワーク内にデプロイ
- プライベート IP アドレス
- オンプレミスとの安全な接続

#### 自動バックアップと復元

```sql
-- ポイント イン タイム リストア例
RESTORE DATABASE [MyDB_Restored] 
FROM BACKUP_DATABASE '[MyDB]' 
WITH REPLACE, 
MOVE_TO_TIME = '2024-06-15 10:00:00';
```

---

## 3. SQL Server on Azure VMs

### 3.1 適用場面

以下の場合に SQL Server on Azure VMs を選択：

- **完全な OS 制御** が必要
- **カスタム ソフトウェア** のインストールが必要
- **レガシー アプリケーション** との互換性
- **特定の SQL Server バージョン** が必要

### 3.2 設計考慮事項

#### ストレージ設定

```powershell
# Premium SSD の推奨設定
New-AzDisk -DiskName "SQLData" `
           -ResourceGroupName "myRG" `
           -Location "East US" `
           -DiskSizeGB 1024 `
           -AccountType "Premium_LRS" `
           -CreationData @{createOption='Empty'}
```

#### 高可用性設定

- **Always On 可用性グループ**
- **フェールオーバー クラスター インスタンス**
- **ログ配布**

---

## 4. データベース スケーラビリティ

### 4.1 読み取りスケールアウト

#### 読み取り専用レプリカ

```csharp
// 読み取り専用接続の例
var readOnlyConnectionString = originalConnectionString + 
                              ";ApplicationIntent=ReadOnly;";
```

### 4.2 エラスティック プール

#### 適用場面

- **複数のデータベース** を持つ SaaS アプリケーション
- **変動するワークロード** パターン
- **コスト最適化** が必要

```csharp
// エラスティック プール作成例（ARM テンプレート）
{
  "type": "Microsoft.Sql/servers/elasticPools",
  "apiVersion": "2020-11-01-preview",
  "name": "[concat(parameters('serverName'), '/', parameters('poolName'))]",
  "properties": {
    "edition": "Standard",
    "dtu": 100,
    "databaseDtuMin": 10,
    "databaseDtuMax": 20
  }
}
```

### 4.3 シャーディング

```csharp
// シャード マップ マネージャーの例
ShardMapManager smm = ShardMapManagerFactory.GetSqlShardMapManager(
    connectionString, ShardMapManagerLoadPolicy.Lazy);

ListShardMap<int> customerShardMap = smm.GetListShardMap<int>("customerMap");
```

---

## 5. データベース可用性

### 5.1 組み込み高可用性

#### Azure SQL Database

- **ローカル冗長性**: 同一データセンター内の複数ノード
- **ゾーン冗長性**: 複数の可用性ゾーン
- **geo レプリケーション**: 複数リージョン

### 5.2 自動フェールオーバー グループ

```csharp
// フェールオーバー グループ作成例
{
  "type": "Microsoft.Sql/servers/failoverGroups",
  "apiVersion": "2020-11-01-preview",
  "properties": {
    "readWriteEndpoint": {
      "failoverPolicy": "Automatic",
      "failoverWithDataLossGracePeriodMinutes": 60
    },
    "partnerServers": [
      {
        "id": "/subscriptions/.../resourceGroups/.../providers/Microsoft.Sql/servers/secondary-server"
      }
    ],
    "databases": [
      "/subscriptions/.../resourceGroups/.../providers/Microsoft.Sql/servers/primary-server/databases/mydb"
    ]
  }
}
```

### 5.3 バックアップと復元

#### 自動バックアップ

- **完全バックアップ**: 週次
- **差分バックアップ**: 12時間間隔
- **ログ バックアップ**: 5-10分間隔

#### 復元オプション

```sql
-- ポイント イン タイム リストア
RESTORE DATABASE MyDatabase_Restored 
FROM BACKUP_DATABASE 'MyDatabase' 
WITH MOVE_TO_TIME = '2024-06-15 14:30:00';

-- Geo リストア
RESTORE DATABASE MyDatabase_GeoRestored 
FROM GEO_BACKUP 'MyDatabase';
```

---

## 6. データ セキュリティ

### 6.1 保存時の暗号化

#### Transparent Data Encryption (TDE)

- **デフォルトで有効**
- **AES 256 暗号化**
- **証明書またはキー管理**

```sql
-- TDE ステータス確認
SELECT 
    name,
    encryption_state,
    encryption_state_desc
FROM sys.dm_database_encryption_keys;
```

#### カスタマー マネージド キー (BYOK)

```json
{
  "type": "Microsoft.Sql/servers/encryptionProtector",
  "apiVersion": "2020-11-01-preview",
  "properties": {
    "serverKeyType": "AzureKeyVault",
    "serverKeyName": "myKeyVaultKey"
  }
}
```

### 6.2 転送時の暗号化

#### TLS 1.2 強制

```csharp
// 安全な接続文字列
var connectionString = "Server=tcp:myserver.database.windows.net,1433;" +
                      "Database=mydatabase;" +
                      "User ID=myuser;" +
                      "Password=mypassword;" +
                      "Encrypt=True;" +
                      "TrustServerCertificate=False;";
```

### 6.3 使用時の暗号化

#### Always Encrypted

```sql
-- Always Encrypted カラム作成
CREATE TABLE Customers (
    CustomerID int IDENTITY(1,1) PRIMARY KEY,
    Name nvarchar(60),
    SSN nvarchar(11) ENCRYPTED WITH (
        ENCRYPTION_TYPE = DETERMINISTIC,
        ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256',
        COLUMN_ENCRYPTION_KEY = CEK_Auto1
    )
);
```

### 6.4 認証と認可

#### Microsoft Entra ID 認証

```csharp
// Microsoft Entra ID 認証例
var connectionString = "Server=tcp:myserver.database.windows.net,1433;" +
                      "Database=mydatabase;" +
                      "Authentication=Active Directory Integrated;";
```

#### Row-Level Security (RLS)

```sql
-- セキュリティ ポリシー作成
CREATE FUNCTION SecurityPredicate(@UserID int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS SecurityPredicate_Result 
WHERE @UserID = USER_ID();

CREATE SECURITY POLICY CustomerSecurityPolicy
ADD FILTER PREDICATE SecurityPredicate(CustomerID) ON Customers;
```

---

## 7. Azure SQL Edge

### 7.1 概要

**Azure SQL Edge** は、IoT および Edge コンピューティング向けに最適化された SQL Server データベース エンジンです。

#### 主な特徴

- **小さなフットプリント**
- **ARM64 および x64 アーキテクチャ** のサポート
- **ストリーミング機能** の組み込み
- **機械学習** のサポート

### 7.2 適用場面

- **IoT ゲートウェイ**
- **エッジ デバイス**
- **リアルタイム分析**
- **オフライン シナリオ**

### 7.3 デプロイメント例

```yaml
# Docker Compose 例
version: '3.4'
services:
  azure-sql-edge:
    image: mcr.microsoft.com/azure-sql-edge:latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=MyStrongPassword123
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqldata:/var/opt/mssql/data
volumes:
  sqldata:
```

---

## 8. Azure Cosmos DB と Table Storage

### 8.1 Azure Cosmos DB

#### マルチモデル データベース

- **SQL API**: ドキュメント データベース
- **Cassandra API**: ワイドカラム
- **MongoDB API**: ドキュメント
- **Gremlin API**: グラフ
- **Table API**: キー/値

#### グローバル分散

```csharp
// マルチリージョン設定例
CosmosClientBuilder clientBuilder = new CosmosClientBuilder("connectionString")
    .WithApplicationRegion(Regions.EastUS);
CosmosClient client = clientBuilder.Build();
```

### 8.2 Azure Table Storage

#### 特徴

- **NoSQL キー/値** ストア
- **スキーマレス** 設計
- **高いスケーラビリティ**
- **低コスト**

```csharp
// Table Storage 操作例
CloudTable table = tableClient.GetTableReference("customers");

CustomerEntity customer = new CustomerEntity("Smith", "John")
{
    Email = "john.smith@example.com",
    PhoneNumber = "425-555-0101"
};

TableOperation insertOperation = TableOperation.Insert(customer);
await table.ExecuteAsync(insertOperation);
```

---

## 9. パフォーマンス最適化のベスト プラクティス

### 9.1 インデックス戦略

```sql
-- カバリング インデックス
CREATE INDEX IX_Orders_CustomerID_Include 
ON Orders (CustomerID) 
INCLUDE (OrderDate, TotalAmount);

-- フィルター インデックス
CREATE INDEX IX_Orders_Active 
ON Orders (OrderDate) 
WHERE Status = 'Active';
```

### 9.2 クエリ最適化

```sql
-- パラメーター化クエリ
DECLARE @CustomerID int = 12345;
SELECT OrderID, OrderDate, TotalAmount 
FROM Orders 
WHERE CustomerID = @CustomerID
ORDER BY OrderDate DESC;

-- 実行計画の確認
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
```

### 9.3 接続管理

```csharp
// 接続プール最適化
public class DatabaseService
{
    private readonly string _connectionString;
    
    public DatabaseService(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public async Task<T> ExecuteQueryAsync<T>(string query, object parameters = null)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<T>(query, parameters);
    }
}
```

---

## 10. 監視とトラブルシューティング

### 10.1 Azure Monitor

```sql
-- 待機統計の確認
SELECT 
    wait_type,
    waiting_tasks_count,
    wait_time_ms,
    max_wait_time_ms,
    signal_wait_time_ms
FROM sys.dm_db_wait_stats
ORDER BY wait_time_ms DESC;
```

### 10.2 Query Store

```sql
-- Query Store の有効化
ALTER DATABASE MyDatabase 
SET QUERY_STORE = ON;

-- 高コストクエリの確認
SELECT TOP 10
    q.query_id,
    qt.query_sql_text,
    rs.avg_duration/1000 as avg_duration_ms
FROM sys.query_store_query_text qt
JOIN sys.query_store_query q ON qt.query_text_id = q.query_text_id
JOIN sys.query_store_runtime_stats rs ON q.query_id = rs.query_id
ORDER BY rs.avg_duration DESC;
```

---

## 📋 学習チェックリスト

- [ ] Azure SQL Database の購入モデルを理解している
- [ ] vCore と DTU の違いを説明できる
- [ ] サーバーレス コンピューティングの利点を理解している
- [ ] Azure SQL Managed Instance の適用場面を知っている
- [ ] SQL Server on Azure VMs の設計考慮事項を理解している
- [ ] エラスティック プールの概念を理解している
- [ ] 高可用性オプションを比較できる
- [ ] データ暗号化の3つのレベルを理解している
- [ ] Always Encrypted の制限事項を知っている
- [ ] Azure SQL Edge の特徴を理解している
- [ ] Cosmos DB のマルチモデル API を理解している

---

## 🔗 追加リソース

- [Azure SQL Database ドキュメント](https://learn.microsoft.com/ja-jp/azure/azure-sql/database/)
- [Azure SQL Managed Instance ドキュメント](https://learn.microsoft.com/ja-jp/azure/azure-sql/managed-instance/)
- [SQL Server on Azure VMs ドキュメント](https://learn.microsoft.com/ja-jp/azure/azure-sql/virtual-machines/)
- [Azure Cosmos DB ドキュメント](https://learn.microsoft.com/ja-jp/azure/cosmos-db/)
- [Azure Table Storage ドキュメント](https://learn.microsoft.com/ja-jp/azure/storage/tables/)

---

**次のステップ**: このドキュメントを読んだ後、練習問題に取り組んで理解度を確認してください。

#### 🧠 理解度チェック：DTU vs vCore

**問題1：** 以下のシナリオで最適な購入モデルを選択してください。

**シナリオA：** 新人開発者がプロトタイプWebアプリを作成。予算は限られており、設定は簡単にしたい。

<details>
<summary>解答を見る</summary>

**答え：DTUベース（Basic または Standard S0/S1）**

**理由：**
- 設定がシンプルで学習コストが低い
- プロトタイプレベルなら基本的なパフォーマンスで十分
- 予算重視ならBasic、少し余裕があればStandard S0

</details>

**シナリオB：** エンタープライズ企業が既存のSQL Server 2019のライセンスを持ち、3年間の長期運用を予定。

<details>
<summary>解答を見る</summary>

**答え：vCoreベース + Azure Hybrid Benefit + Reserved Capacity**

**理由：**
- 既存ライセンスでHybrid Benefit適用（最大55%割引）
- 3年確定ならReserved Capacityでさらに割引
- エンタープライズなら詳細な制御が必要
- 長期的にコスト効率が最高

</details>

**問題2：** 100 DTUのStandardデータベースを同等のvCoreに移行する場合、何vCoreが目安になるでしょうか？

<details>
<summary>解答を見る</summary>

**答え：約1 vCore（General Purpose）**

**目安：**
- 100 DTU ≒ 1 vCore
- ただし、ワークロードによって調整が必要
- 移行後はパフォーマンス監視で最適化

</details>

#### 🎓 AZ-204試験対策ポイント

**試験でよく出るポイント：**

1. **Hybrid Benefitの対象**
   - ✅ vCoreベースで利用可能
   - ❌ DTUベースでは利用不可

2. **Reserved Capacityの対象**
   - ✅ vCoreベースで利用可能
   - ❌ DTUベースでは利用不可

3. **サーバーレスコンピューティング**
   - ✅ vCoreベースでのみ利用可能
   - 自動スケーリングと自動一時停止

4. **Hyperscaleサービス層**
   - ✅ vCoreベースでのみ利用可能
   - 最大100TBまで拡張可能

**覚えるべき数値：**
- DTU Basic：最大2GB
- DTU Standard：最大1TB  
- DTU Premium：最大4TB
- vCore：最大4TBまたは100TB（Hyperscale）
