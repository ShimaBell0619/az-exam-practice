# Azure多リージョン ハブスポーク構成 システム方式設計書

## 1. 概要

本設計書は、EastJapanとWestJapanの2つのリージョンにリソースを配置し、Azure Front Doorを通じて全世界からの低レイテンシーアクセスを実現するハブスポーク構成について記述します。すべてのリソースは閉域で接続され、プライベートエンドポイントとVNet統合を活用したセキュアなアーキテクチャを採用しています。

## 2. アーキテクチャ概要

### 2.1 全体構成図

```text
[Global]
  │
  ├─ Azure Front Door (Global)
  │   ├─ Custom Domain (SSL Certificate from Key Vault)
  │   └─ Web Application Firewall (WAF)
  │
  ├─ [East Japan Region - Hub]
  │   └─ Hub VNet (10.0.0.0/16)
  │       ├─ Azure Firewall Subnet (10.0.1.0/24)
  │       ├─ Private DNS Resolver Subnet (10.0.2.0/24)
  │       ├─ Management Subnet (10.0.3.0/24)
  │       └─ Shared Services Subnet (10.0.4.0/24)
  │           └─ Azure Key Vault (Private Endpoint)
  │
  ├─ [East Japan Region - Spokes]
  │   ├─ Spoke VNet 1 - Web Tier East (10.1.0.0/16)
  │   │   ├─ App Service (Private Endpoint) (10.1.1.0/24)
  │   │   └─ VNet Integration Subnet (10.1.2.0/24)
  │   │
  │   ├─ Spoke VNet 2 - API Tier East (10.1.10.0/16)
  │   │   ├─ Azure API Management (Private Endpoint) (10.1.11.0/24)
  │   │   └─ VNet Integration Subnet (10.1.12.0/24)
  │   │
  │   └─ Spoke VNet 3 - Function Tier East (10.1.20.0/16)
  │       ├─ Azure Functions (Private Endpoint) (10.1.21.0/24)
  │       └─ VNet Integration Subnet (10.1.22.0/24)
  │
  └─ [West Japan Region - Spokes]
      ├─ Spoke VNet 4 - Web Tier West (10.2.0.0/16)
      │   ├─ App Service (Private Endpoint) (10.2.1.0/24)
      │   └─ VNet Integration Subnet (10.2.2.0/24)
      │
      ├─ Spoke VNet 5 - API Tier West (10.2.10.0/16)
      │   ├─ Azure API Management (Private Endpoint) (10.2.11.0/24)
      │   └─ VNet Integration Subnet (10.2.12.0/24)
      │
      └─ Spoke VNet 6 - Function Tier West (10.2.20.0/16)
          ├─ Azure Functions (Private Endpoint) (10.2.21.0/24)
          └─ VNet Integration Subnet (10.2.22.0/24)
```

## 3. ネットワーク設計

### 3.1 VNet構成

#### 3.1.1 Hub VNet (East Japan Region)

- **Hub VNet**: 10.0.0.0/16
  - Azure Firewall Subnet: 10.0.1.0/24
  - Private DNS Resolver Subnet: 10.0.2.0/24
  - Management Subnet: 10.0.3.0/24
  - Shared Services Subnet: 10.0.4.0/24 (Key Vault Private Endpoint)

#### 3.1.2 East Japan Region Spokes

- **Spoke VNet 1 (Web Tier East)**: 10.1.0.0/16
  - App Service Private Endpoint Subnet: 10.1.1.0/24
  - VNet Integration Subnet: 10.1.2.0/24

- **Spoke VNet 2 (API Tier East)**: 10.1.10.0/16
  - API Management Private Endpoint Subnet: 10.1.11.0/24
  - VNet Integration Subnet: 10.1.12.0/24

- **Spoke VNet 3 (Function Tier East)**: 10.1.20.0/16
  - Functions Private Endpoint Subnet: 10.1.21.0/24
  - VNet Integration Subnet: 10.1.22.0/24

#### 3.1.3 West Japan Region Spokes

- **Spoke VNet 4 (Web Tier West)**: 10.2.0.0/16
  - App Service Private Endpoint Subnet: 10.2.1.0/24
  - VNet Integration Subnet: 10.2.2.0/24

- **Spoke VNet 5 (API Tier West)**: 10.2.10.0/16
  - API Management Private Endpoint Subnet: 10.2.11.0/24
  - VNet Integration Subnet: 10.2.12.0/24

- **Spoke VNet 6 (Function Tier West)**: 10.2.20.0/16
  - Functions Private Endpoint Subnet: 10.2.21.0/24
  - VNet Integration Subnet: 10.2.22.0/24

### 3.2 VNet Peering構成

#### 3.2.1 Hub-Spoke ピアリング

- Hub VNet (East Japan) ↔ Spoke VNet 1 (Web Tier East) (双方向)
- Hub VNet (East Japan) ↔ Spoke VNet 2 (API Tier East) (双方向)
- Hub VNet (East Japan) ↔ Spoke VNet 3 (Function Tier East) (双方向)
- Hub VNet (East Japan) ↔ Spoke VNet 4 (Web Tier West) (双方向)
- Hub VNet (East Japan) ↔ Spoke VNet 5 (API Tier West) (双方向)
- Hub VNet (East Japan) ↔ Spoke VNet 6 (Function Tier West) (双方向)

#### 3.2.2 グローバルピアリング設定

- **Gateway Transit**: Hub VNetでゲートウェイ転送を有効化
- **Remote Gateway**: 全Spokeでリモートゲートウェイ使用を有効化
- **Virtual Network Access**: 全ピアリングで仮想ネットワークアクセスを有効化

### 3.3 ルーティング設計

#### 3.3.1 User Defined Routes (UDR)

- **Spoke VNet → Hub VNet**: 0.0.0.0/0 → Azure Firewall (10.0.1.4)
- **Hub VNet → Spoke VNet**: 各Spoke VNet CIDR → VNet Peering
- **リージョン間通信**: West Japan Spoke CIDR → VNet Peering
- **インターネット通信**: 0.0.0.0/0 → Azure Firewall

#### 3.3.2 Azure Firewall Rules

- **ネットワークルール**: 必要な通信のみ許可
- **アプリケーションルール**: FQDN ベースの制御
- **NATルール**: 必要に応じて設定
- **位置**: East Japan Hub VNet (10.0.1.4)

## 4. リソース設計

### 4.1 Azure Front Door設計

#### 4.1.1 基本構成

- **SKU**: Standard または Premium
- **Origin Groups**:
  - East Japan: App Service (East Japan)
  - West Japan: App Service (West Japan)
- **Routing Rules**:
  - Default: 地理的に最も近いOriginへルーティング
  - Health Probe: 各Originの健全性監視

#### 4.1.2 セキュリティ設定

- **Web Application Firewall (WAF)**:
  - OWASPルールセット有効化
  - カスタムルール設定
  - Bot Protection有効化
- **カスタムドメイン**:
  - 独自ドメイン設定
  - SSL証明書はKey Vaultから取得
  - 自動証明書更新有効化

### 4.2 App Service設計

#### 4.2.1 基本構成

- **App Service Plan**: Premium V3 (各リージョン)
- **Scaling**: Auto Scale有効化
- **Deployment**: Blue-Green deployment対応

#### 4.2.2 ネットワーク設定

- **Private Endpoint**: 各Spoke VNetに配置
- **VNet Integration**: アウトバウンド通信制御
- **Access Restriction**: Front Doorからのアクセスのみ許可

### 4.3 Azure Functions設計

#### 4.3.1 基本構成

- **Hosting Plan**: Premium Plan
- **Runtime**: .NET 6+, Node.js 18+, Python 3.9+
- **Storage**: 専用ストレージアカウント（Private Endpoint）

#### 4.3.2 ネットワーク設定

- **Private Endpoint**: 各Spoke VNetに配置
- **VNet Integration**: アウトバウンド通信制御
- **Trigger Sources**: Service Bus, Event Grid (Private Endpoint)

### 4.4 Azure API Management設計

#### 4.4.1 基本構成

- **SKU**: Standard V2 または Premium V2
- **Deployment**: Internal VNet Mode
- **APIs**: RESTful API群の管理

#### 4.4.2 ネットワーク設定

- **Private Endpoint**: 各Spoke VNetに配置
- **VNet Integration**: Backend サービスへの接続
- **Developer Portal**: Private Endpoint経由でアクセス

### 4.5 Azure Key Vault設計

#### 4.5.1 基本構成

- **SKU**: Standard または Premium
- **Access Policy**: Managed Identity ベース
- **Certificates**: Front Door用SSL証明書格納

#### 4.5.2 ネットワーク設定

- **Private Endpoint**: Hub VNet内のShared Servicesサブネットに配置
- **Network Access**: Private Endpoint経由のみ許可
- **Firewall Rules**: 信頼されたMicrosoftサービスのみ許可
- **DNS Integration**: Private DNS Zone統合

## 5. セキュリティ設計

### 5.1 ネットワークセキュリティ

#### 5.1.1 Azure Firewall

- **位置**: East Japan Hub VNet (10.0.1.4)
- **機能**:
  - East-West トラフィック制御（リージョン間含む）
  - North-South トラフィック制御
  - 脅威インテリジェンス有効化
  - DNS Proxy有効化
- **冗長性**: 可用性ゾーン対応
- **管理**: 集中管理による運用効率化

#### 5.1.2 Network Security Groups (NSG)

- **Subnet レベル**: 各サブネットに適用
- **ルール**: 最小権限の原則
- **ログ**: フローログ有効化

#### 5.1.3 Private Endpoint

- **配置**: 全PaaSサービス
- **DNS解決**: Private DNS Zone統合
- **アクセス制御**: 特定VNetからのみ

### 5.2 アプリケーションセキュリティ

#### 5.2.1 Managed Identity

- **System Assigned**: 各サービスで有効化
- **User Assigned**: 共有リソースアクセス用
- **権限**: 最小権限の原則

#### 5.2.2 Key Vault統合

- **証明書管理**: 自動更新
- **シークレット管理**: 接続文字列等
- **キー管理**: 暗号化キー

### 5.3 データ保護

#### 5.3.1 暗号化

- **転送時**: TLS 1.2以上
- **保存時**: Azure Storage Encryption
- **処理時**: Confidential Computing (必要に応じて)

#### 5.3.2 データ分類

- **Public**: 一般向け情報
- **Internal**: 社内限定情報
- **Confidential**: 機密情報
- **Restricted**: 最高機密情報

## 6. 運用・監視設計

### 6.1 ログ・監視

#### 6.1.1 Azure Monitor

- **Log Analytics Workspace**: Hub VNet（East Japan）に配置
- **収集対象**:
  - Application Insights (App Service, Functions)
  - Azure Firewall Logs
  - NSG Flow Logs
  - Private Endpoint Logs
- **リージョン間**: West Japanのリソースログも集約

#### 6.1.2 アラート設定

- **可用性**: サービス死活監視
- **パフォーマンス**: レスポンス時間監視
- **セキュリティ**: 異常なアクセスパターン
- **リソース**: CPU/メモリ使用率

### 6.2 バックアップ・災害復旧

#### 6.2.1 バックアップ戦略

- **App Service**: 定期的なバックアップ
- **Functions**: ソースコード管理
- **API Management**: 設定のエクスポート
- **Key Vault**: 証明書とシークレットの複製

#### 6.2.2 災害復旧

- **RTO**: 4時間以内
- **RPO**: 1時間以内
- **Failover**: 手動または自動切り替え
- **リージョン間**: データ同期

## 7. コスト最適化

### 7.1 リソース最適化

#### 7.1.1 Auto Scaling

- **App Service**: CPU/メモリベース
- **Functions**: 消費量ベース
- **API Management**: 負荷ベース

#### 7.1.2 Reserved Instances

- **App Service Plan**: 1年または3年予約
- **VM**: Azure Firewall用VM

### 7.2 コスト監視

#### 7.2.1 Azure Cost Management

- **予算設定**: 月次予算
- **アラート**: しきい値超過時
- **分析**: サービス別コスト分析

## 8. デプロイメント戦略

### 8.1 Infrastructure as Code

#### 8.1.1 ARM Templates / Bicep

- **モジュール化**: 再利用可能な構成
- **パラメータ化**: 環境別設定
- **検証**: デプロイ前検証

#### 8.1.2 Azure DevOps / GitHub Actions

- **CI/CD**: 自動デプロイ
- **Testing**: 自動テスト
- **Rollback**: 自動ロールバック

### 8.2 段階的デプロイ

#### 8.2.1 環境分離

- **Development**: 開発環境
- **Staging**: ステージング環境
- **Production**: 本番環境

#### 8.2.2 Blue-Green Deployment

- **Blue**: 現行環境
- **Green**: 新環境
- **Switch**: 瞬時切り替え

## 9. 準拠性・ガバナンス

### 9.1 Azure Policy

#### 9.1.1 必須ポリシー

- **Tagging**: 必須タグ
- **Location**: 許可リージョン
- **SKU**: 許可SKU
- **Encryption**: 暗号化必須

#### 9.1.2 Initiative

- **Security**: セキュリティ基準
- **Compliance**: 法規制対応
- **Cost**: コスト最適化

### 9.2 Role-Based Access Control (RBAC)

#### 9.2.1 Role Assignment

- **Owner**: 所有者権限
- **Contributor**: 共同作成者権限
- **Reader**: 閲覧者権限
- **Custom**: カスタム権限

## 10. 実装フェーズ

### 10.1 Phase 1: ネットワーク基盤

1. Resource Group作成
2. VNet / Subnet作成
3. VNet Peering設定
4. Azure Firewall配置
5. Private DNS Zone設定

### 10.2 Phase 2: PaaSサービス展開

1. App Service作成
2. Functions作成
3. API Management作成
4. Key Vault作成
5. Private Endpoint設定

### 10.3 Phase 3: Front Door設定

1. Front Door作成
2. Origin Group設定
3. Routing Rules設定
4. WAF設定
5. Custom Domain設定

### 10.4 Phase 4: セキュリティ強化

1. NSG設定
2. Firewall Rules設定
3. Managed Identity設定
4. RBAC設定
5. Security Center設定

### 10.5 Phase 5: 監視・運用

1. Log Analytics設定
2. Application Insights設定
3. Alert設定
4. Backup設定
5. Disaster Recovery設定

## 11. 想定されるリスクと対策

### 11.1 技術的リスク

- **Single Point of Failure**: 冗長化構成
- **Performance Bottleneck**: Auto Scaling設定
- **Security Breach**: Zero Trust原則
- **Data Loss**: バックアップ戦略

### 11.2 運用リスク

- **Human Error**: 自動化推進
- **Knowledge Gap**: ドキュメント整備
- **Vendor Lock-in**: Multi-Cloud戦略
- **Compliance Violation**: 継続的監査

## 12. まとめ

本設計書では、Azure上でのハブスポーク構成を採用した多リージョンアーキテクチャを提案しました。以下の特徴を持つセキュアで高可用性なシステムを実現します：

- **グローバル配信**: Azure Front Doorによる低レイテンシーアクセス
- **セキュア接続**: Private EndpointとVNet統合による閉域接続
- **高可用性**: 複数リージョン配置による冗長化
- **集中管理**: 単一HubによるFirewallとKey Vaultの集中管理
- **運用効率**: 自動化とモニタリングによる効率的な運用
- **コスト最適化**: 単一Hub構成によるコスト削減とAuto Scaling

このアーキテクチャにより、エンタープライズグレードの要件を満たしながら、拡張性と保守性を確保したシステムを構築できます。
