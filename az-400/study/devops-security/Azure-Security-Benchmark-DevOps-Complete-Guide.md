# Azure Security Benchmark - DevOps セキュリティ 完全ガイド

## 目次- [Azure Security Benchmark - DevOps セキュリティ 完全ガイド](#azure-security-benchmark---devopsセキュリティ-完全ガイド)

- [Azure Security Benchmark - DevOps セキュリティ 完全ガイド](#azure-security-benchmark---devops-セキュリティ-完全ガイド)
  - [目次- Azure Security Benchmark - DevOps セキュリティ 完全ガイド](#目次--azure-security-benchmark---devops-セキュリティ-完全ガイド)
  - [概要](#概要)
  - [📋 DevOps セキュリティコントロール一覧](#-devops-セキュリティコントロール一覧)
- [DS-1: 脅威モデリングの実施](#ds-1-脅威モデリングの実施)
  - [📋 基本情報](#-基本情報)
  - [🎯 セキュリティ原則](#-セキュリティ原則)
  - [🔍 脅威モデリングの要素](#-脅威モデリングの要素)
    - [必須要素](#必須要素)
  - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス)
    - [Microsoft 脅威モデリングツールの使用](#microsoft-脅威モデリングツールの使用)
    - [代替手法](#代替手法)
  - [📚 実装リソース](#-実装リソース)
- [DS-2: ソフトウェアサプライチェーンセキュリティの確保](#ds-2-ソフトウェアサプライチェーンセキュリティの確保)
  - [📋 基本情報](#-基本情報-1)
  - [🎯 セキュリティ原則](#-セキュリティ原則-1)
  - [🔍 サプライチェーンセキュリティの要素](#-サプライチェーンセキュリティの要素)
    - [1. SBOM（Software Bill of Materials）の管理](#1-sbomsoftware-bill-of-materialsの管理)
    - [2. コンポーネントの追跡と管理](#2-コンポーネントの追跡と管理)
    - [3. 脆弱性とマルウェアの評価](#3-脆弱性とマルウェアの評価)
    - [4. 脆弱性の軽減](#4-脆弱性の軽減)
  - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-1)
    - [GitHub Advanced Security](#github-advanced-security)
    - [Azure DevOps](#azure-devops)
  - [📚 実装リソース](#-実装リソース-1)
- [DS-3: DevOps インフラストラクチャの保護](#ds-3-devops-インフラストラクチャの保護)
  - [📋 基本情報](#-基本情報-2)
  - [🎯 セキュリティ原則](#-セキュリティ原則-2)
  - [🔍 対象範囲](#-対象範囲)
    - [1. アーティファクトリポジトリ](#1-アーティファクトリポジトリ)
    - [2. CI/CD パイプラインのサーバーとサービス](#2-cicd-パイプラインのサーバーとサービス)
    - [3. CI/CD パイプライン設定](#3-cicd-パイプライン設定)
  - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-2)
    - [優先すべきコントロール](#優先すべきコントロール)
  - [📚 実装リソース](#-実装リソース-2)
- [DS-4: 静的アプリケーションセキュリティテスト（SAST）の統合](#ds-4-静的アプリケーションセキュリティテストsastの統合)
  - [📋 基本情報](#-基本情報-3)
  - [🎯 セキュリティ原則](#-セキュリティ原則-3)
  - [🔍 SAST とは？](#-sast-とは)
    - [SAST の特徴](#sast-の特徴)
  - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-3)
    - [統合可能なツール](#統合可能なツール)
    - [パイプライン統合例](#パイプライン統合例)
  - [📚 実装リソース](#-実装リソース-3)
- [DS-5: 動的アプリケーションセキュリティテスト（DAST）の統合](#ds-5-動的アプリケーションセキュリティテストdastの統合)
  - [🔍 DAST とは？](#-dast-とは)
    - [DAST の特徴](#dast-の特徴)
    - [DAST と SAST の違い](#dast-と-sast-の違い)
  - [🏗️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-4)
    - [1. Azure DevOps での DAST 統合](#1-azure-devops-での-dast-統合)
      - [主要ポイント](#主要ポイント)
    - [2. 実装手順](#2-実装手順)
      - [ステップ 1: DAST ツールの選択](#ステップ-1-dast-ツールの選択)
      - [ステップ 2: パイプライン設定](#ステップ-2-パイプライン設定)
      - [ステップ 3: ゲート制御の設定](#ステップ-3-ゲート制御の設定)
    - [3. ベストプラクティス](#3-ベストプラクティス)
      - [セキュリティゲートの実装](#セキュリティゲートの実装)
      - [チーム連携](#チーム連携)
  - [🔧 実装例](#-実装例)
    - [GitHub Actions での実装](#github-actions-での実装)
    - [Azure DevOps での実装](#azure-devops-での実装)
  - [🎯 検出可能な脆弱性](#-検出可能な脆弱性)
  - [📊 効果測定](#-効果測定)
    - [KPI（重要業績評価指標）](#kpi重要業績評価指標)
    - [レポート項目](#レポート項目)
  - [🛠️ 関連ツール](#️-関連ツール)
    - [商用ツール](#商用ツール)
    - [オープンソースツール](#オープンソースツール)
  - [📚 参考リソース](#-参考リソース)
  - [👥 関係者](#-関係者)
    - [主要な関係者](#主要な関係者)
    - [役割と責任](#役割と責任)
  - [⚠️ 注意事項](#️-注意事項)
  - [DS-6: DevOps ライフサイクル全体でのワークロードセキュリティの実施](#ds-6-devops-ライフサイクル全体でのワークロードセキュリティの実施)
    - [📋 基本情報](#-基本情報-4)
    - [🎯 セキュリティ原則](#-セキュリティ原則-4)
    - [🔍 実装要素](#-実装要素)
      - [必須コントロール](#必須コントロール)
    - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-5)
      - [Azure VMs 向けガイダンス](#azure-vms-向けガイダンス)
      - [Azure コンテナサービス向けガイダンス](#azure-コンテナサービス向けガイダンス)
  - [DS-7: DevOps でのロギングと監視の有効化](#ds-7-devops-でのロギングと監視の有効化)
    - [📋 基本情報](#-基本情報-5)
    - [🎯 セキュリティ原則](#-セキュリティ原則-5)
    - [🔍 監視対象](#-監視対象)
      - [必須要素](#必須要素-1)
    - [🛠️ Azure 実装ガイダンス](#️-azure-実装ガイダンス-6)
      - [実装手順](#実装手順)
      - [実装リソース](#実装リソース)
    - [関係者](#関係者)
  - [🎯 まとめ](#-まとめ)
    - [実装の優先順位](#実装の優先順位)
    - [継続的改善](#継続的改善)

## 概要

Azure Security Benchmark の DevOps セキュリティ（DS）コントロールは、DevOps プロセス全体を通じてセキュリティを確保するための包括的なガイドラインです。このドキュメントでは、DS-1 から DS-7 までの全ての項目について詳しく解説します。

## 📋 DevOps セキュリティコントロール一覧

| 項目       | 名称                                | 目的                     |
| -------- | --------------------------------- | ---------------------- |
| **DS-1** | 脅威モデリングの実施                        | 潜在的な脅威を特定し、軽減策を定義      |
| **DS-2** | ソフトウェアサプライチェーンセキュリティの確保           | 依存関係とサードパーティコンポーネントの管理 |
| **DS-3** | DevOps インフラストラクチャの保護              | CI/CD パイプラインとツールの安全性確保 |
| **DS-4** | 静的アプリケーションセキュリティテスト（SAST）の統合      | ソースコードの脆弱性スキャン         |
| **DS-5** | 動的アプリケーションセキュリティテスト（DAST）の統合      | 実行時アプリケーションの脆弱性テスト     |
| **DS-6** | DevOps ライフサイクル全体でのワークロードセキュリティの実施 | 開発から本番まで一貫したセキュリティ     |
| **DS-7** | DevOps でのロギングと監視の有効化              | セキュリティイベントの可視化と分析      |


---

# DS-1: 脅威モデリングの実施

## 📋 基本情報

| 項目                     | 値           |
| ------------------------ | ------------ |
| **CIS Controls v8 ID**   | 16.10, 16.14 |
| **NIST SP 800-53 r4 ID** | SA-15        |
| **PCI-DSS ID v3.2.1**    | 6.5, 12.2    |

## 🎯 セキュリティ原則

潜在的な脅威を特定し、軽減コントロールを列挙するための脅威モデリングを実施します。脅威モデリングは以下の目的を果たす必要があります：

1. **本番運用段階**でのアプリケーションとサービスの保護
2. **ビルド、テスト、デプロイ**で使用されるアーティファクト、CI/CD パイプライン、その他のツール環境の保護

## 🔍 脅威モデリングの要素

### 必須要素

1. **セキュリティ要件の定義**: アプリケーションのセキュリティ要件を明確化
2. **コンポーネント分析**: アプリケーションコンポーネント、データ接続、相互関係の分析
3. **脅威の列挙**: 潜在的な脅威と攻撃ベクトルの特定
4. **コントロールの特定**: 脅威を軽減するセキュリティコントロールの識別
5. **軽減策の設計**: 特定された脆弱性を軽減するコントロールの設計

## 🛠️ Azure 実装ガイダンス

### Microsoft 脅威モデリングツールの使用

- **Azure 脅威モデルテンプレート**が組み込まれた Microsoft 脅威モデリングツールを使用
- **STRIDE モデル**を使用して内部・外部の脅威を列挙
- DevOps プロセスでの脅威シナリオを含める（例：不正なアーティファクトリポジトリからの悪意のあるコード注入）

### 代替手法

脅威モデリングツールが適用できない場合は、最低限、質問票ベースの脅威モデリングプロセスを使用して脅威を特定します。

## 📚 実装リソース

1. [Threat Modeling Overview](https://www.microsoft.com/securityengineering/sdl/threatmodeling)
2. [Application threat analysis](https://learn.microsoft.com/ja-jp/azure/architecture/framework/security/design-threat-model)
3. [Azure Template - Microsoft Security Threat Model Stencil](https://github.com/AzureArchitecture/threat-model-templates)

---

# DS-2: ソフトウェアサプライチェーンセキュリティの確保

## 📋 基本情報

| 項目                     | 値                |
| ------------------------ | ----------------- |
| **CIS Controls v8 ID**   | 16.4, 16.6, 16.11 |
| **NIST SP 800-53 r4 ID** | SA-12, SA-15      |
| **PCI-DSS ID v3.2.1**    | 6.3, 6.5          |

## 🎯 セキュリティ原則

SDLC（ソフトウェア開発ライフサイクル）に、社内およびサードパーティのソフトウェアコンポーネントを管理するセキュリティコントロールを含めます。

## 🔍 サプライチェーンセキュリティの要素

### 1. SBOM（Software Bill of Materials）の管理

- 開発、ビルド、統合、デプロイフェーズで必要な上流依存関係を特定
- 依存関係の完全なインベントリを維持

### 2. コンポーネントの追跡と管理

- 社内およびサードパーティソフトウェアコンポーネントの既知の脆弱性を追跡
- 上流で修正が利用可能な場合の対応プロセス

### 3. 脆弱性とマルウェアの評価

- 静的・動的アプリケーションテストを使用した未知の脆弱性の評価
- コンポーネントの包括的なセキュリティ分析

### 4. 脆弱性の軽減

- ソースコードの修正（ローカルまたは上流）
- 機能の除外
- 代替コントロールの適用

## 🛠️ Azure 実装ガイダンス

### GitHub Advanced Security

1. **Dependency Graph**: プロジェクトの依存関係と関連する脆弱性をスキャン
2. **Dependabot**: 脆弱な依存関係の追跡と修復を自動化
3. **コードスキャン**: 外部ソースからのコードをスキャン
4. **Microsoft Defender for Cloud**: CI/CD ワークフローでのコンテナイメージ脆弱性評価

### Azure DevOps

サードパーティ拡張機能を使用して、サードパーティソフトウェアコンポーネントの分析と修復を実装。

## 📚 実装リソース

1. [GitHub Dependency Graph](https://docs.github.com/ja/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph)
2. [GitHub Dependabot](https://docs.github.com/ja/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates)
3. [Azure DevOps Marketplace - supply chain security](https://marketplace.visualstudio.com/search?term=tag%3ASupply%20Chain%20Security&target=VSTS)

---

# DS-3: DevOps インフラストラクチャの保護

## 📋 基本情報

| 項目                     | 値                           |
| ------------------------ | ---------------------------- |
| **CIS Controls v8 ID**   | 16.7                         |
| **NIST SP 800-53 r4 ID** | CM-2, CM-6, AC-2, AC-3, AC-6 |
| **PCI-DSS ID v3.2.1**    | 2.2, 6.3, 7.1                |

## 🎯 セキュリティ原則

DevOps インフラストラクチャとパイプラインが、ビルド、テスト、本番の各段階でセキュリティベストプラクティスに従うことを確保します。

## 🔍 対象範囲

### 1. アーティファクトリポジトリ

- ソースコード、ビルド済みパッケージ、イメージの保存
- プロジェクトアーティファクトとビジネスデータの管理

### 2. CI/CD パイプラインのサーバーとサービス

- パイプラインをホストするサーバーとサービス
- ビルド・デプロイエージェントの管理

### 3. CI/CD パイプライン設定

- パイプライン設定の安全性
- アクセス制御と認証の管理

## 🛠️ Azure 実装ガイダンス

### 優先すべきコントロール

1. **アーティファクトと環境の保護**

   - CI/CD パイプラインが悪意のあるコード挿入の経路にならないよう保護
   - Azure DevOps の組織、プロジェクト、ユーザー、パイプラインの設定見直し

2. **一貫したデプロイメント**

   - Microsoft Defender for Cloud を使用した大規模なコンプライアンス追跡
   - Azure Policy による設定管理

3. **ID・ロール権限の設定**

   - Azure AD、ネイティブサービス、CI/CD ツールでの権限管理
   - パイプライン変更の認可確保

4. **特権アクセス管理**

   - 開発者やテスターへの永続的な特権アクセス回避
   - Azure Managed Identities と Just-in-Time アクセスの活用

5. **機密情報の管理**

   - CI/CD ワークフローからキー、認証情報、シークレットを除去
   - Azure Key Vault での安全な保存

6. **セルフホストエージェントの保護**
   - ネットワークセキュリティ、脆弱性管理、エンドポイントセキュリティの適用

## 📚 実装リソース

1. [DevSecOps controls overview](https://learn.microsoft.com/ja-jp/azure/cloud-adoption-framework/secure/devsecops-controls)
2. [Secure your GitHub organization](https://docs.github.com/ja/code-security/getting-started/securing-your-organization)
3. [Azure DevOps pipeline security considerations](https://learn.microsoft.com/ja-jp/azure/devops/pipelines/agents/hosted?tabs=yaml#security)

---

# DS-4: 静的アプリケーションセキュリティテスト（SAST）の統合

## 📋 基本情報

| 項目                     | 値       |
| ------------------------ | -------- |
| **CIS Controls v8 ID**   | 16.12    |
| **NIST SP 800-53 r4 ID** | SA-11    |
| **PCI-DSS ID v3.2.1**    | 6.3, 6.5 |

## 🎯 セキュリティ原則

静的アプリケーションセキュリティテスト（SAST）を CI/CD ワークフローのゲート制御の一部として確実に実装します。

## 🔍 SAST とは？

**静的アプリケーションセキュリティテスト（SAST）**は、アプリケーションが実行されていない状態でソースコードまたはコンパイル済みバージョンを分析し、セキュリティ欠陥を発見するプロセスです。

### SAST の特徴

- **ソースコード分析**: コードが実行される前の静的分析
- **ホワイトボックステスト**: 内部構造を知った状態でのテスト
- **開発段階での発見**: コーディング段階での脆弱性検出

## 🛠️ Azure 実装ガイダンス

### 統合可能なツール

1. **GitHub CodeQL**: ソースコード分析
2. **Microsoft BinSkim Binary Analyzer**: Windows および Linux バイナリ分析
3. **Azure DevOps Credential Scanner**: ソースコード内の認証情報スキャン
4. **GitHub secret scanning**: ネイティブシークレットスキャン

### パイプライン統合例

```yaml
# Azure DevOps Pipeline例
trigger:
  - main

stages:
  - stage: SecurityAnalysis
    jobs:
      - job: StaticAnalysis
        steps:
          - task: CodeQL@0
            inputs:
              sourceLanguage: "csharp"

          - task: BinSkim@0
            inputs:
              inputType: "folder"

          - task: CredScan@0
            inputs:
              toolVersion: "latest"
```

## 📚 実装リソース

1. [GitHub CodeQL](https://codeql.github.com/docs/)
2. [BinSkim Binary Analyzer](https://github.com/microsoft/binskim)
3. [Azure DevOps Credential Scan](https://secdevtools.azurewebsites.net/helpcredscan.html)
4. [GitHub secret scanning](https://docs.github.com/ja/code-security/secret-security/about-secret-scanning)

---

# DS-5: 動的アプリケーションセキュリティテスト（DAST）の統合

## 🔍 DAST とは？

**動的アプリケーションセキュリティテスト（DAST）**は、アプリケーションが実行中の状態でセキュリティ脆弱性を発見するためのプロセスです。

### DAST の特徴

- **実行時テスト**: アプリケーションが動作している状態でテストを実行
- **ブラックボックステスト**: 内部構造を知らない状態でテスト
- **実際の攻撃を模倣**: 実際の攻撃者の視点からセキュリティを評価

### DAST と SAST の違い

| DAST                     | SAST                             |
| ------------------------ | -------------------------------- |
| 実行時にテスト           | ソースコードを静的に分析         |
| ブラックボックステスト   | ホワイトボックステスト           |
| 実行環境での脆弱性を発見 | コーディング段階での脆弱性を発見 |

## 🏗️ Azure 実装ガイダンス

### 1. Azure DevOps での DAST 統合

Azure DevOps パイプラインまたは GitHub に DAST を統合し、CI/CD ワークフローで実行時アプリケーションを自動的にテストできるようにします。

#### 主要ポイント

- **自動化された侵入テスト**: 手動による検証支援付きの自動化された侵入テストも DAST の一部として含める
- **サードパーティツール統合**: Azure DevOps パイプラインや GitHub はサードパーティ DAS トツールとの統合をサポート

### 2. 実装手順

#### ステップ 1: DAST ツールの選択

1. [Azure DevOps Marketplace](https://marketplace.visualstudio.com/search?term=DAST&target=AzureDevOps&category=All%20categories)から DAS トツールを選択
2. 組織の要件に適したツールを評価

#### ステップ 2: パイプライン設定

```yaml
# Azure DevOps Pipeline例
trigger:
  - main

stages:
  - stage: Build
    jobs:
      - job: BuildApp
        # ビルド処理

  - stage: SecurityTest
    jobs:
      - job: DynamicSecurityTest
        steps:
          - task: DASトool@1
            inputs:
              targetUrl: "$(deployedAppUrl)"
              scanType: "full"
              # その他のDAST設定
```

#### ステップ 3: ゲート制御の設定

1. **脆弱性レベルに基づく制御**: 重大度に応じてパイプラインを停止
2. **レポート生成**: テスト結果の詳細レポートを生成
3. **自動通知**: セキュリティチームへの自動アラート

### 3. ベストプラクティス

#### セキュリティゲートの実装

- **重要度に基づく停止**: High/Critical な脆弱性が発見された場合はデプロイを停止
- **継続的監視**: 本番環境でも定期的な DAS トスキャンを実行
- **結果の追跡**: 脆弱性の修正状況を追跡

#### チーム連携

- **開発チーム**: DAS トツールの使用方法を理解し、結果に基づいて修正
- **セキュリティチーム**: DAST 設定の監督と結果のレビュー
- **運用チーム**: 本番環境での DAST スキャンの調整

## 🔧 実装例

### GitHub Actions での実装

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  dast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Staging
        # アプリケーションをステージング環境にデプロイ

      - name: OWASP ZAP DAST Scan
        uses: zaproxy/action-baseline@v0.4.0
        with:
          target: "https://staging.example.com"
          rules_file_name: ".zap/rules.tsv"
          cmd_options: "-a"
```

### Azure DevOps での実装

```yaml
- task: owaspzap@1
  displayName: "OWASP ZAP DAST Scan"
  inputs:
    aggressivemode: false
    threshold: 100
    scantype: "targetedScan"
    url: "$(stagingUrl)"
```

## 🎯 検出可能な脆弱性

DAST で検出できる主な脆弱性：

- **SQL インジェクション**
- **クロスサイトスクリプティング（XSS）**
- **認証・認可の問題**
- **セッション管理の脆弱性**
- **設定ミス**
- **入力検証の不備**

## 📊 効果測定

### KPI（重要業績評価指標）

- **スキャンカバレッジ**: テスト対象アプリケーションの割合
- **脆弱性発見率**: DAST で発見された脆弱性の数
- **修正時間**: 脆弱性発見から修正までの時間
- **誤検出率**: 誤って報告された脆弱性の割合

### レポート項目

- **スキャン結果サマリー**
- **発見された脆弱性の詳細**
- **推奨修正方法**
- **リスクレベル評価**

## 🛠️ 関連ツール

### 商用ツール

- **Veracode DAST**
- **Checkmarx DAST**
- **Rapid7 AppSpider**
- **WhiteHat Security**

### オープンソースツール

- **OWASP ZAP**
- **w3af**
- **Arachni**
- **Nuclei**

## 📚 参考リソース

1. [Azure DevOps Marketplace の DAS トツール](https://marketplace.visualstudio.com/search?term=DAST&target=AzureDevOps&category=All%20categories)
2. [OWASP DAST Guide](https://owasp.org/www-community/Vulnerability_Scanning_Tools)
3. [Microsoft DevSecOps](https://www.microsoft.com/securityengineering/devsecops)
4. [Azure Cloud Adoption Framework - DevSecOps Controls](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/secure/devsecops-controls)

## 👥 関係者

### 主要な関係者

1. **アプリケーションセキュリティと DevSecOps** - DAST 実装と運用の責任者
2. **セキュリティ態勢管理** - 全体的なセキュリティ戦略との整合性確保

### 役割と責任

- **開発チーム**: DAST ツールの使用とスキャン結果への対応
- **セキュリティチーム**: DAST 設定の管理とポリシー策定
- **DevOps チーム**: パイプラインへの DAST 統合と自動化
- **QA チーム**: セキュリティテストとしての DAST の活用

## ⚠️ 注意事項

1. **本番環境での実行**: 本番環境での DAST は慎重に計画し、影響を最小限に抑える
2. **パフォーマンス影響**: DAST スキャンがアプリケーションのパフォーマンスに与える影響を考慮
3. **誤検出対応**: 誤検出を適切に管理し、有効な脆弱性に集中
4. **継続的改善**: DAST 設定とプロセスを継続的に改善

---

## DS-6: DevOps ライフサイクル全体でのワークロードセキュリティの実施

### 📋 基本情報

| 項目                     | 値                           |
| ------------------------ | ---------------------------- |
| **CIS Controls v8 ID**   | 7.5, 7.6, 7.7, 16.1, 16.7    |
| **NIST SP 800-53 r4 ID** | CM-2, CM-6, AC-2, AC-3, AC-6 |
| **PCI-DSS ID v3.2.1**    | 6.1, 6.2, 6.3                |

### 🎯 セキュリティ原則

開発、テスト、デプロイ段階でワークロードが全体のライフサイクルを通じて保護されることを確保します。

### 🔍 実装要素

#### 必須コントロール

1. **自動化されたデプロイメント**: CI/CD ワークフロー、IaC、テストの自動化により人的エラーと攻撃面を削減
2. **アーティファクトセキュリティ**: VM、コンテナイメージ、その他のアーティファクトを悪意のある操作から保護
3. **事前スキャン**: CI/CD ワークフローでデプロイ前にアーティファクトをスキャン（コンテナイメージ、依存関係、SAST、DAST）
4. **実行時保護**: 本番環境に脆弱性評価と脅威検出機能を展開し、継続的に使用

### 🛠️ Azure 実装ガイダンス

#### Azure VMs 向けガイダンス

1. **Azure Shared Image Gallery**: イメージへのアクセス制御
2. **セキュリティベースライン**: カスタムイメージ、ARM テンプレート、Azure Policy Guest Configuration による設定基準の展開

#### Azure コンテナサービス向けガイダンス

1. **Azure Container Registry (ACR)**: プライベートコンテナレジストリの作成
2. **Microsoft Defender for Containers**: ACR 内のイメージの脆弱性評価
3. **CI/CD 統合**: Microsoft Defender for Cloud のコンテナイメージスキャンを CI/CD ワークフローに統合

---

## DS-7: DevOps でのロギングと監視の有効化

### 📋 基本情報

| 項目                     | 値                      |
| ------------------------ | ----------------------- |
| **CIS Controls v8 ID**   | 8.2, 8.5, 8.9, 8.11     |
| **NIST SP 800-53 r4 ID** | AU-3, AU-6, AU-12, SI-4 |
| **PCI-DSS ID v3.2.1**    | 10.1, 10.2, 10.3, 10.6  |

### 🎯 セキュリティ原則

ロギングと監視の範囲に、DevOps で使用される非本番環境と CI/CD ワークフロー要素を含めます。これらの環境を標的とする脆弱性と脅威は、適切に監視されない場合、本番環境に重大なリスクをもたらす可能性があります。

### 🔍 監視対象

#### 必須要素

1. **非本番環境**: 開発、テスト、ステージング環境の監視
2. **CI/CD ツール**: Azure DevOps、GitHub などの監査ログ
3. **ワークフローイベント**: ビルド、テスト、デプロイジョブのイベント監視
4. **異常検出**: CI/CD ジョブでの例外結果の特定

### 🛠️ Azure 実装ガイダンス

#### 実装手順

1. **監査ログの有効化**: Azure DevOps と GitHub で監査ログ機能を設定
2. **イベント監視**: CI/CD ワークフローからのイベントを監視し、異常な結果を特定
3. **SIEM 統合**: ログとイベントを Microsoft Sentinel またはその他の SIEM ツールに取り込み
4. **インシデント対応**: セキュリティインシデントの適切な監視とトリアージ

#### 実装リソース

1. [Azure DevOps - audit streaming](https://learn.microsoft.com/ja-jp/azure/devops/organizations/audit/auditing-streaming)
2. [GitHub logging](https://docs.github.com/ja/organizations/keeping-your-organization-secure/reviewing-the-audit-log-for-your-organization)

### 関係者

- **セキュリティ運用**: SOC チームとセキュリティアナリスト
- **アプリケーションセキュリティと DevSecOps**: DevSecOps エンジニア
- **インシデント準備**: インシデント対応チーム

---

## 🎯 まとめ

Azure Security Benchmark の DevOps セキュリティコントロール（DS-1 から DS-7）は、DevOps プロセス全体を通じて包括的なセキュリティを確保するための重要なガイドラインです。

### 実装の優先順位

1. **DS-1（脅威モデリング）**: セキュリティの基盤として最初に実施
2. **DS-3（インフラストラクチャ保護）**: DevOps 環境の基本的なセキュリティ確保
3. **DS-4（SAST）と DS-5（DAST）**: コード品質とセキュリティの自動化
4. **DS-2（サプライチェーン）**: 依存関係とサードパーティコンポーネントの管理
5. **DS-6（ライフサイクル全体）**: 統合されたセキュリティアプローチ
6. **DS-7（ログと監視）**: 継続的な可視性と検出

### 継続的改善

- **定期的なレビュー**: 脅威ランドスケープの変化に応じた更新
- **自動化の促進**: 可能な限りセキュリティチェックを自動化
- **チーム間連携**: 開発、セキュリティ、運用チーム間の協力強化
- **教育とトレーニング**: チームメンバーのスキル向上

---

このドキュメントは、Azure Security Benchmark の DevOps セキュリティコントロール全体の実装ガイドとして作成されました。組織の具体的な要件に応じて調整してご利用ください。
