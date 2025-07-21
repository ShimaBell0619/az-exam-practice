# Azure Front Door 多環境・多リージョン構成設計

## 概要

本設計書では、Azure Front Door を使用して East Japan 地域で本番・テスト・開発環境を分離し、West Japan を災害対策リージョンとする多環境・多リージョン構成のベストプラクティスを記載する。

## 設計要件

### 機能要件

- **環境分離**: East Japan 地域で本番・テスト・開発環境を分けたトラフィック分断
- **災害復旧**: East Japan（プライマリ）と West Japan（セカンダリ）の災害対策構成
- **トラフィック制御**: 環境ごとの適切なルーティングとロードバランシング
- **高可用性**: 自動フェイルオーバーとヘルスチェック機能

### 非機能要件

- **可用性**: 99.95%以上の SLA
- **レイテンシ**: 低遅延での応答
- **スケーラビリティ**: トラフィック増加への自動対応
- **セキュリティ**: WAF、SSL/TLS 終端、DDoS 保護

## アーキテクチャ設計

### 全体構成図

```text
[ユーザー]
    ↓
[Azure Front Door Premium]
    ↓ (Rules Engine による環境判定)
    ├── 本番環境 (East Japan)
    │   ├── App Service (Primary)
    │   └── Azure SQL Database (Primary)
    │
    ├── テスト環境 (East Japan)
    │   ├── App Service (Test)
    │   └── Azure SQL Database (Test)
    │
    ├── 開発環境 (East Japan)
    │   ├── App Service (Dev)
    │   └── Azure SQL Database (Dev)
    │
    └── 災害復旧環境 (West Japan)
        ├── App Service (DR)
        └── Azure SQL Database (DR)
```

## 詳細設計

### 1. Azure Front Door 構成

#### 1.1 プロファイル設定

- **ティア**: Azure Front Door Premium
- **理由**: WAF、Rules Engine、プライベートリンク対応が必要

#### 1.2 エンドポイント設定

```yaml
エンドポイント:
  - 名前: main-endpoint
    ドメイン: app.contoso.com
    HTTP/HTTPS: HTTPS Only
    証明書: Azure管理証明書 (Let's Encrypt)
```

#### 1.3 オリジングループ設定

##### 本番環境オリジングループ

```yaml
オリジングループ名: production-origins
優先度: 1
ルーティング方式: Priority + Latency
オリジン:
  - 名前: prod-eastjapan-primary
    ホスト名: prod-app-ej.azurewebsites.net
    優先度: 1
    重み: 100
    有効: true
  - 名前: prod-westjapan-dr
    ホスト名: prod-app-wj.azurewebsites.net
    優先度: 2
    重み: 100
    有効: true
ヘルスプローブ:
  パス: /health
  プロトコル: HTTPS
  間隔: 30秒
  タイムアウト: 30秒
  正常しきい値: 3
  異常しきい値: 3
```

##### テスト環境オリジングループ

```yaml
オリジングループ名: test-origins
優先度: 1
ルーティング方式: Latency
オリジン:
  - 名前: test-eastjapan
    ホスト名: test-app-ej.azurewebsites.net
    優先度: 1
    重み: 100
    有効: true
ヘルスプローブ:
  パス: /health
  プロトコル: HTTPS
  間隔: 60秒
```

##### 開発環境オリジングループ

```yaml
オリジングループ名: dev-origins
優先度: 1
ルーティング方式: Latency
オリジン:
  - 名前: dev-eastjapan
    ホスト名: dev-app-ej.azurewebsites.net
    優先度: 1
    重み: 100
    有効: true
ヘルスプローブ:
  パス: /health
  プロトコル: HTTPS
  間隔: 120秒
```

### 2. Rules Engine 設定

#### 2.1 環境判定ルール

##### 本番環境ルール

```yaml
ルール名: ProductionRouting
優先度: 1
条件:
  - タイプ: Request Header
    ヘッダー名: X-Environment
    演算子: Equal
    値: production
  - または
  - タイプ: Query String
    パラメータ名: env
    演算子: Equal
    値: prod
  - または
  - タイプ: Request URI
    演算子: BeginsWith
    値: /prod
アクション:
  - タイプ: Route Configuration Override
    オリジングループ: production-origins
    キャッシュ: 有効
    TTL: 3600秒
```

##### テスト環境ルール

```yaml
ルール名: TestRouting
優先度: 2
条件:
  - タイプ: Request Header
    ヘッダー名: X-Environment
    演算子: Equal
    値: test
  - または
  - タイプ: Query String
    パラメータ名: env
    演算子: Equal
    値: test
  - または
  - タイプ: Request URI
    演算子: BeginsWith
    値: /test
アクション:
  - タイプ: Route Configuration Override
    オリジングループ: test-origins
    キャッシュ: 無効
```

##### 開発環境ルール

```yaml
ルール名: DevRouting
優先度: 3
条件:
  - タイプ: Request Header
    ヘッダー名: X-Environment
    演算子: Equal
    値: development
  - または
  - タイプ: Query String
    パラメータ名: env
    演算子: Equal
    値: dev
  - または
  - タイプ: Request URI
    演算子: BeginsWith
    値: /dev
アクション:
  - タイプ: Route Configuration Override
    オリジングループ: dev-origins
    キャッシュ: 無効
```

#### 2.2 URL 書き換えルール

##### 環境パス除去ルール

```yaml
ルール名: EnvironmentPathRewrite
優先度: 10
条件:
  - タイプ: Request URI
    演算子: MatchesRegex
    値: ^/(prod|test|dev)/(.*)$
アクション:
  - タイプ: URL Rewrite
    ソースパターン: /(prod|test|dev)/
    宛先: /
    未一致パス保持: true
```

### 3. セキュリティ設定

#### 3.1 WAF 設定

```yaml
WAFポリシー名: multi-env-waf-policy
モード: Prevention
ルールセット:
  - Microsoft_DefaultRuleSet_2.1
  - Microsoft_BotManagerRuleSet_1.0
カスタムルール:
  - 名前: RateLimitRule
    優先度: 100
    ルールタイプ: RateLimitRule
    閾値: 100 requests/minute
    アクション: Block
    期間: 1分
```

#### 3.2 オリジンセキュリティ

```yaml
アクセス制限:
  - Azure Front Doorからのトラフィックのみ許可
  - Service Tagを使用: AzureFrontDoor.Backend
  - プライベートエンドポイント使用（Premium環境）
```

### 4. 監視・ログ設定

#### 4.1 診断設定

```yaml
ログカテゴリ:
  - FrontDoorAccessLog: 有効
  - FrontDoorHealthProbeLog: 有効
  - FrontDoorWebApplicationFirewallLog: 有効
送信先:
  - Log Analytics Workspace
  - Storage Account（長期保存用）
保持期間: 90日
```

#### 4.2 メトリクス監視

```yaml
重要メトリクス:
  - RequestCount: リクエスト数
  - BackendRequestCount: バックエンドリクエスト数
  - ResponseSize: 応答サイズ
  - TotalLatency: 総レイテンシ
  - BackendHealthPercentage: バックエンド正常性
  - WebApplicationFirewallRequestCount: WAFリクエスト数
アラート設定:
  - バックエンド正常性 < 90%: 重大
  - レイテンシ > 1000ms: 警告
  - エラー率 > 5%: 重大
```

## ベストプラクティス

### 1. トラフィック分散戦略

#### 1.1 環境別アクセス制御

- **本番環境**: 最高優先度、自動 DR 対応
- **テスト環境**: 本番と同等の設定、手動制御
- **開発環境**: 基本設定、開発者のみアクセス

#### 1.2 段階的デプロイメント

```yaml
デプロイ戦略: 1. 開発環境での検証
  2. テスト環境での統合テスト
  3. 本番環境でのBlue-Greenデプロイ
  4. 重み付きルーティングでのカナリアデプロイ
```

### 2. 災害復旧戦略

#### 2.1 フェイルオーバー設定

```yaml
フェイルオーバー条件:
  - プライマリリージョン（East Japan）のヘルスチェック失敗
  - 3回連続の失敗でDRリージョン（West Japan）にフェイルオーバー
  - 自動フェイルバック: 無効（手動制御）
```

#### 2.2 データ同期

```yaml
データベース:
  - Azure SQL Database Auto-failover groups
  - 同期レプリケーション（本番）
  - 非同期レプリケーション（DR）
ストレージ:
  - Geo-redundant storage (GRS)
  - 読み取りアクセス geo 冗長ストレージ (RA-GRS)
```

### 3. パフォーマンス最適化

#### 3.1 キャッシュ戦略

```yaml
キャッシュ設定:
  本番環境:
    - 静的コンテンツ: 24時間
    - API応答: 5分
    - 動的コンテンツ: キャッシュ無効
  テスト・開発環境:
    - 全てキャッシュ無効（最新コンテンツ確認のため）
```

#### 3.2 圧縮設定

```yaml
圧縮:
  - 有効化: true
  - MIME Types:
      - application/json
      - application/javascript
      - text/css
      - text/html
      - text/plain
```

### 4. 運用管理

#### 4.1 Infrastructure as Code

```yaml
デプロイ方法:
  - Azure Resource Manager (ARM) Template
  - または Bicep Template
  - Azure DevOps Pipeline での自動デプロイ
  - Git ベースの構成管理
```

#### 4.2 証明書管理

```yaml
SSL証明書:
  - Azure管理証明書の使用
  - 自動更新有効化
  - カスタムドメイン証明書の場合はKey Vault統合
```

## 費用最適化

### 1. 階層選択

```yaml
推奨構成:
  - 本番環境: Azure Front Door Premium
  - テスト・開発環境: Azure Front Door Standard
  - 理由: WAF、Rules Engine、プライベートリンクは本番のみ必要
```

### 2. 帯域幅最適化

```yaml
最適化手法:
  - キャッシュ有効化による原点への要求削減
  - 圧縮によるデータ転送量削減
  - 不要なヘルスチェックの無効化（単一オリジンの場合）
```

## セキュリティ考慮事項

### 1. ネットワークセキュリティ

```yaml
セキュリティ設定:
  - オリジンアクセス制限
  - WAF有効化
  - DDoS Protection Standard
  - プライベートリンク（Premium）
```

### 2. 認証・認可

```yaml
アクセス制御:
  - Azure AD統合
  - IP制限（開発・テスト環境）
  - カスタムヘッダーによる環境識別
```

## まとめ

本設計により以下の利点を実現：

1. **環境分離**: Rules Engine による柔軟な環境判定とルーティング
2. **災害復旧**: 自動フェイルオーバーによる高可用性
3. **運用効率**: Infrastructure as Code による一貫した管理
4. **セキュリティ**: WAF、オリジンアクセス制限による多層防御
5. **パフォーマンス**: キャッシュ、圧縮、CDN による高速配信
6. **費用最適化**: 環境別の適切なティア選択

この構成により、East Japan 地域での多環境運用と West Japan での災害復旧を両立し、Azure Front Door の機能を最大限活用した堅牢なシステムを構築できる。
