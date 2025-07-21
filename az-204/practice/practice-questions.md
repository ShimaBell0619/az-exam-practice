# AZ-204 練習問題：リレーショナル データ用にデータ ストレージ ソリューションを設計する

## 🎯 試験対策練習問題

この練習問題集は、AZ-204試験の「リレーショナル データ用にデータ ストレージ ソリューションを設計する」セクションの理解度を確認するためのものです。

---

## 問題 1: Azure SQL Database 購入モデル

**問題**: 
新しいWebアプリケーション用のデータベースを設計しています。このアプリケーションは以下の要件があります：
- 月末に大量のレポート処理が発生する
- 通常時は軽い負荷
- コスト最適化が重要
- 予測可能な料金体系を希望

どの購入モデルとコンピューティングレベルの組み合わせが最も適切ですか？

A) vCore ベース + プロビジョニング済みコンピューティング
B) vCore ベース + サーバーレス コンピューティング  
C) DTU ベース + プロビジョニング済みコンピューティング
D) DTU ベースのみ利用可能

<details>
<summary>回答を見る</summary>

**正解: B) vCore ベース + サーバーレス コンピューティング**

**解説:**
- **サーバーレス コンピューティング**は、ワークロードに基づいて自動スケーリングし、使用量に応じた課金となるため、変動する負荷パターンに最適
- 非アクティブ期間中は自動一時停止してコストを削減
- 月末の大量処理時は自動的にスケールアップ
- vCoreベースでサーバーレスが利用可能（DTUベースでは利用不可）

**ポイント:**
- 変動するワークロード → サーバーレス
- 予測可能な負荷 → プロビジョニング済み
- コスト最適化 → サーバーレス + 自動一時停止
</details>

---

## 問題 2: Azure SQL Managed Instance の適用場面

**問題**: 
オンプレミスのSQL Serverを Azure に移行することを検討しています。現在のシステムには以下の特徴があります：
- SQL Server Agent のジョブを多数使用
- CLR アセンブリを使用したカスタム関数
- 複数データベース間でのクロスデータベースクエリ
- Service Broker を使用したメッセージング

どのAzureサービスが最も適切ですか？

A) Azure SQL Database (単一データベース)
B) Azure SQL Database (エラスティックプール)
C) Azure SQL Managed Instance
D) SQL Server on Azure VMs

<details>
<summary>回答を見る</summary>

**正解: C) Azure SQL Managed Instance**

**解説:**
Azure SQL Managed Instance は、SQL Server との高い互換性を提供し、以下の機能をサポートしています：
- **SQL Server Agent**: ジョブ、アラート、オペレーターをサポート
- **CLR**: Common Language Runtime アセンブリをサポート
- **クロスデータベースクエリ**: 同一インスタンス内でサポート
- **Service Broker**: メッセージングサービスをサポート

**他のオプションが適さない理由:**
- Azure SQL Database: CLR、SQL Server Agent、Service Brokerが制限される
- SQL Server on Azure VMs: 管理オーバーヘッドが大きい
</details>

---

## 問題 3: データベース スケーラビリティ

**問題**: 
SaaSアプリケーションで100以上のテナント（顧客）を持ち、各テナントが独自のデータベースを持っています。各データベースの使用パターンは大きく異なり、一部のテナントは非常にアクティブですが、多くは軽い負荷です。コスト効率を改善したいと考えています。

最適なソリューションは何ですか？

A) 各データベースを個別のAzure SQL Database インスタンスでホスト
B) エラスティックプールを使用してデータベースをグループ化
C) すべてのテナントデータを単一のデータベースに統合
D) Azure SQL Managed Instance でホスト

<details>
<summary>回答を見る</summary>

**正解: B) エラスティックプールを使用してデータベースをグループ化**

**解説:**
**エラスティックプール**は、このシナリオに最適です：
- **変動するワークロード**: 複数のデータベース間でリソースを共有
- **コスト効率**: 個別に各データベースにリソースを割り当てるより効率的
- **独立性**: 各テナントは独自のデータベースを維持
- **自動管理**: リソースの自動分散

**設定例:**
```json
{
  "elasticPool": {
    "edition": "Standard",
    "dtu": 400,
    "databaseDtuMin": 10,
    "databaseDtuMax": 50,
    "storageMB": 750000
  }
}
```
</details>

---

## 問題 4: 高可用性設計

**問題**: 
ミッションクリティカルなアプリケーション用のデータベースを設計しています。以下の要件があります：
- RTO (Recovery Time Objective): 1分以内
- RPO (Recovery Point Objective): 5秒以内
- 複数リージョンでの冗長性
- 読み取りワークロードの分散

どの設計が最も適切ですか？

A) Azure SQL Database General Purpose + geo レプリケーション
B) Azure SQL Database Business Critical + 自動フェールオーバーグループ  
C) Azure SQL Database Hyperscale + ゾーン冗長
D) Azure SQL Managed Instance + ログ配布

<details>
<summary>回答を見る</summary>

**正解: B) Azure SQL Database Business Critical + 自動フェールオーバーグループ**

**解説:**
**Business Critical + 自動フェールオーバーグループ**の組み合わせが要件を満たします：

- **RTO 1分以内**: 自動フェールオーバーグループによる迅速なフェールオーバー
- **RPO 5秒以内**: Business Criticalの同期レプリケーション
- **複数リージョン冗長性**: フェールオーバーグループで異なるリージョンにセカンダリ
- **読み取り分散**: 読み取り専用セカンダリレプリカの活用

**構成例:**
```json
{
  "failoverGroup": {
    "readWriteEndpoint": {
      "failoverPolicy": "Automatic",
      "failoverWithDataLossGracePeriodMinutes": 1
    },
    "readOnlyEndpoint": {
      "failoverPolicy": "Enabled"
    }
  }
}
```
</details>

---

## 問題 5: データ暗号化

**問題**: 
医療データを扱うアプリケーションを開発しています。以下のセキュリティ要件があります：
- 個人識別情報（PII）は、データベース管理者からも見えないようにする
- データは保存時と転送時に暗号化する
- 暗号化キーは顧客が管理したい
- アプリケーションから透過的にアクセスしたい

適切な暗号化戦略は何ですか？

A) Transparent Data Encryption (TDE) のみ
B) Always Encrypted + カスタマー マネージド キー
C) TDE + Always Encrypted + カスタマー マネージド キー  
D) SSL/TLS + 列レベル暗号化

<details>
<summary>回答を見る</summary>

**正解: C) TDE + Always Encrypted + カスタマー マネージド キー**

**解説:**
包括的なセキュリティには、複数の暗号化レイヤーが必要です：

**Transparent Data Encryption (TDE):**
- 保存時の暗号化（データファイル、ログファイル、バックアップ）
- カスタマー マネージド キーで顧客がキー管理

**Always Encrypted:**
- 使用時の暗号化（データベース管理者からも保護）
- 特定の列（PII）を暗号化
- クライアント側で透過的に復号化

**実装例:**
```sql
-- Always Encrypted カラム
CREATE TABLE Patients (
    PatientID int IDENTITY PRIMARY KEY,
    Name nvarchar(100),
    SSN nvarchar(11) ENCRYPTED WITH (
        ENCRYPTION_TYPE = DETERMINISTIC,
        ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256',
        COLUMN_ENCRYPTION_KEY = CEK_SSN
    )
);
```

**転送時の暗号化**は TLS で自動的に処理されます。
</details>

---

## 問題 6: Azure SQL Edge

**問題**: 
製造業でIoTソリューションを構築しています。工場の各生産ラインにエッジデバイスを配置し、以下の機能が必要です：
- センサーデータのリアルタイム処理
- オフライン時のローカルデータ保存
- 機械学習による異常検出
- 軽量なデータベースエンジン

どのソリューションが最適ですか？

A) Azure SQL Database
B) Azure SQL Edge
C) SQLite
D) Azure Cosmos DB

<details>
<summary>回答を見る</summary>

**正解: B) Azure SQL Edge**

**解説:**
**Azure SQL Edge**はIoTとエッジコンピューティングに最適化されています：

**主な特徴:**
- **軽量**: 小さなメモリフットプリント
- **オフライン対応**: インターネット接続なしで動作
- **ストリーミング**: T-SQLでリアルタイムデータ処理
- **ML統合**: ONNX機械学習モデルのサポート
- **ARM64/x64**: 様々なハードウェアアーキテクチャをサポート

**実装例:**
```sql
-- ストリーミングジョブの作成
CREATE EXTERNAL STREAM SensorInput (
    timestamp datetime2,
    temperature float,
    pressure float
) WITH (
    DATA_SOURCE = EdgeHub,
    LOCATION = N'input'
);

-- 異常検出
SELECT 
    timestamp,
    temperature,
    ANOMALY_DETECTION_CHANGEPOINT(temperature) OVER (
        LIMIT DURATION(minute, 5)
    ) as anomaly_score
FROM SensorInput;
```
</details>

---

## 問題 7: パフォーマンス最適化

**問題**: 
Azure SQL Database で動作するeコマースアプリケーションのパフォーマンスが低下しています。以下の症状があります：
- 顧客検索クエリが遅い
- 注文履歴の表示に時間がかかる
- DTUの使用率が常に90%以上

最初に実行すべき最適化は何ですか？

A) より高いサービスレベルにスケールアップ
B) Query Store でパフォーマンス問題を特定  
C) エラスティックプールに移行
D) 読み取り専用レプリカを追加

<details>
<summary>回答を見る</summary>

**正解: B) Query Store でパフォーマンス問題を特定**

**解説:**
**Query Store**を使用して、まず問題を特定することが重要です：

**Query Store の利点:**
- **問題クエリの特定**: 高コスト、長時間実行のクエリを発見
- **実行計画の履歴**: パフォーマンス低下の原因を追跡
- **推奨事項**: インデックスやクエリの最適化提案

**分析手順:**
```sql
-- Query Store 有効化
ALTER DATABASE MyECommerceDB SET QUERY_STORE = ON;

-- 高コストクエリの確認
SELECT TOP 10
    q.query_id,
    qt.query_sql_text,
    rs.avg_duration/1000 as avg_duration_ms,
    rs.avg_cpu_time/1000 as avg_cpu_ms
FROM sys.query_store_query_text qt
JOIN sys.query_store_query q ON qt.query_text_id = q.query_text_id
JOIN sys.query_store_runtime_stats rs ON q.query_id = rs.query_id
ORDER BY rs.avg_duration DESC;
```

スケールアップは問題特定後の対処法です。
</details>

---

## 問題 8: Cosmos DB vs Table Storage

**問題**: 
大量のログデータを保存するシステムを設計しています。以下の要件があります：
- 1日に数百万件のログエントリ
- ログデータの検索は稀
- 長期保存（7年間）
- 低コスト優先
- スキーマの変更頻度は低い

どのストレージソリューションが最適ですか？

A) Azure Cosmos DB (SQL API)
B) Azure Table Storage
C) Azure SQL Database
D) Azure Cosmos DB (Table API)

<details>
<summary>回答を見る</summary>

**正解: B) Azure Table Storage**

**解説:**
**Azure Table Storage**がこのシナリオに最適です：

**Table Storage の利点:**
- **低コスト**: ストレージコストが非常に安価
- **大容量**: ペタバイト規模のデータをサポート
- **NoSQLアクセス**: スキーマレスで柔軟性
- **高可用性**: 99.9%のSLA
- **アーカイブ**: 長期保存に適している

**コスト比較例:**
- Table Storage: ~$0.045/GB/月
- Cosmos DB: ~$0.25/GB/月（RU含む）
- SQL Database: さらに高額

**実装例:**
```csharp
public class LogEntity : TableEntity
{
    public LogEntity(string logDate, string logId)
    {
        PartitionKey = logDate;   // 日付でパーティション分割
        RowKey = logId;
    }
    
    public string LogLevel { get; set; }
    public string Message { get; set; }
    public string Source { get; set; }
}
```

**使い分け:**
- 高いクエリ性能が必要 → Cosmos DB
- 大量データ + 低コスト → Table Storage
</details>

---

## 問題 9: 認証と認可

**問題**: 
マルチテナントSaaSアプリケーションで、以下のセキュリティ要件があります：
- 各テナントは自身のデータのみアクセス可能
- データベースレベルでのアクセス制御
- Azure Active Directory との統合
- 詳細な監査ログ

適切なセキュリティ実装は何ですか？

A) アプリケーション層でのテナント分離のみ
B) Row-Level Security (RLS) + Microsoft Entra ID 認証 + 監査
C) 各テナント用の個別データベース
D) 暗号化による分離

<details>
<summary>回答を見る</summary>

**正解: B) Row-Level Security (RLS) + Microsoft Entra ID 認証 + 監査**

**解説:**
**Row-Level Security (RLS)**を中心とした包括的なセキュリティ実装：

**Row-Level Security (RLS):**
```sql
-- セキュリティ関数
CREATE FUNCTION Security.fn_tenantAccessPredicate(@TenantID int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS fn_securitypredicate_result 
WHERE @TenantID = CAST(SESSION_CONTEXT(N'TenantID') AS int);

-- セキュリティポリシー
CREATE SECURITY POLICY Security.TenantSecurityPolicy
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) 
ON dbo.CustomerData,
ADD BLOCK PREDICATE Security.fn_tenantAccessPredicate(TenantID) 
ON dbo.CustomerData;
```

**Microsoft Entra ID 認証:**
```csharp
// 接続時にテナントIDを設定
using var connection = new SqlConnection(connectionString);
await connection.OpenAsync();

using var command = new SqlCommand(
    "EXEC sp_set_session_context @key='TenantID', @value=@tenantId", 
    connection);
command.Parameters.AddWithValue("@tenantId", tenantId);
await command.ExecuteNonQueryAsync();
```

**監査の有効化:**
- Azure SQL Auditing でデータアクセスをログ記録
- Log Analytics で分析
</details>

---

## 問題 10: 災害復旧計画

**問題**: 
金融機関向けのアプリケーションで、以下の災害復旧要件があります：
- RTO: 30分以内
- RPO: 1分以内  
- 地理的に離れた場所での復旧
- 手動での復旧開始を希望
- コンプライアンス要件でデータは特定リージョンに保存

適切な構成は何ですか？

A) 自動フェールオーバーグループ
B) 手動フェールオーバーグループ + Business Critical
C) geo レプリケーション + 手動フェールオーバー
D) Azure Backup のみ

<details>
<summary>回答を見る</summary>

**正解: B) 手動フェールオーバーグループ + Business Critical**

**解説:**
金融機関の要件を満たす設計：

**手動フェールオーバーグループ:**
- **制御されたフェールオーバー**: 手動開始で予期しない自動切り替えを回避
- **RTO 30分以内**: 迅速な手動フェールオーバー
- **地理的分散**: 異なるリージョンへの配置
- **コンプライアンス**: データ所在地の制御

**Business Critical サービスレベル:**
- **RPO 1分以内**: 同期レプリケーションによる最小限のデータ損失
- **高可用性**: 99.995% SLA
- **読み取り専用レプリカ**: レポーティング用途

**構成例:**
```json
{
  "failoverGroup": {
    "readWriteEndpoint": {
      "failoverPolicy": "Manual"
    },
    "readOnlyEndpoint": {
      "failoverPolicy": "Enabled"
    },
    "databases": ["/subscriptions/.../databases/FinancialDB"],
    "partnerServers": [{
      "id": "/subscriptions/.../servers/dr-server",
      "location": "West Europe"
    }]
  }
}
```

**運用手順:**
1. 災害検知
2. ビジネス判断
3. 手動でフェールオーバー実行
4. アプリケーション接続文字列更新
5. 正常化後の復旧計画
</details>

---

## 📊 スコア評価

**点数計算:**
- 各問題 10点（合計100点）

**評価基準:**
- **90-100点**: 優秀 - 試験準備万全
- **70-89点**: 良好 - あと少しの復習で合格レベル  
- **50-69点**: 普通 - 重要ポイントの再学習が必要
- **50点未満**: 要改善 - 基礎から学習し直し

---

## 🎯 学習ポイント整理

### 覚えておくべき重要な数値
- **Azure SQL Database SLA**: 99.99%
- **Business Critical SLA**: 99.995%
- **自動バックアップ保持期間**: 1-35日（デフォルト7日）
- **長期保持**: 最大10年
- **フェールオーバーグループ RTO**: 1時間以内
- **geo レプリケーション RPO**: 5秒

### サービス選択の判断基準

| 要件 | 推奨サービス |
|------|-------------|
| SQL Server互換性が必要 | SQL Managed Instance |
| 完全なOS制御が必要 | SQL Server on Azure VMs |
| コスト最適化 + 変動負荷 | サーバーレス コンピューティング |
| 複数DB + 変動負荷 | エラスティック プール |
| IoT/エッジ | Azure SQL Edge |
| 大量ログ + 低コスト | Table Storage |
| グローバル分散NoSQL | Cosmos DB |

### セキュリティ実装パターン

| 保護対象 | 技術 |
|----------|------|
| 保存時データ | TDE (+ BYOK) |
| 転送時データ | TLS 1.2+ |
| 使用時データ | Always Encrypted |
| 行レベルアクセス | Row-Level Security |
| 列レベル保護 | Dynamic Data Masking |
| 監査 | Azure SQL Auditing |

---

## 📚 追加学習リソース

**Microsoft Learn パス:**
- [Azure SQL Database の実装](https://learn.microsoft.com/training/paths/azure-sql-database/)
- [Azure でのデータセキュリティ](https://learn.microsoft.com/training/paths/secure-your-cloud-data/)

**ハンズオン ラボ:**
- [Azure SQL Database クイックスタート](https://learn.microsoft.com/azure/azure-sql/database/single-database-create-quickstart)
- [Always Encrypted チュートリアル](https://learn.microsoft.com/azure/azure-sql/database/always-encrypted-certificate-store-configure)

**試験対策:**
- 各トピックで実際にAzureリソースを作成して動作確認
- Azure ポータルでの操作に慣れる  
- PowerShell/CLI コマンドも練習
- エラーメッセージと対処法を覚える

---

**次のステップ**: 間違えた問題について、関連するドキュメントを再確認し、実際にAzureで実装してみることをお勧めします。