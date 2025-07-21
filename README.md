# Azure 試験対策リポジトリ

このリポジトリは Azure 認定試験の学習資料をまとめたものです。GitHub Pages で自動公開され、新しいファイルが追加されると自動的にインデックスページが更新されます。

## 🌐 GitHub Pages

このリポジトリは GitHub Pages で公開されています：

**<https://shimabell0619.github.io/az-exam-practice/>**

## 📁 ディレクトリ構造

```text
├── index.md                    # トップページ（自動生成）
├── az-204/                     # AZ-204 試験関連資料
│   ├── study/                  # 学習ガイド
│   └── practice/               # 練習問題
├── az-400/                     # AZ-400 試験関連資料
│   └── devops-security/        # DevOps セキュリティ関連
├── _prompt-samples/            # プロンプトサンプル
├── .github/
│   ├── workflows/              # GitHub Actions ワークフロー
│   │   ├── update-index.yml    # index.md 自動更新
│   │   └── pages.yml           # GitHub Pages デプロイ
│   └── scripts/
│       └── update-index.js     # index.md 生成スクリプト
└── _config.yml                 # Jekyll 設定
```

## 🚀 セットアップ手順

### 1. GitHub Pages の有効化

1. GitHubリポジトリの **Settings** タブに移動
2. 左側メニューの **Pages** をクリック
3. **Source** で "GitHub Actions" を選択
4. 設定を保存

### 2. 自動更新の仕組み

新しいファイルを `az-xxx/` ディレクトリに追加すると：

1. **push** 時に GitHub Actions が自動実行
2. `.github/scripts/update-index.js` が実行される
3. `index.md` が自動更新される
4. GitHub Pages が再デプロイされる

### 3. ファイル分類ルール

自動生成スクリプトは以下のルールでファイルを分類します：

- **学習ガイド**: `study/` または `devops-security/` ディレクトリ内のファイル
- **練習問題**: `practice/` ディレクトリ内のファイル、または名前に "practice" を含むファイル
- **その他**: 上記に該当しないファイル

## 📝 新しいファイルの追加方法

### AZ-204 学習ガイドを追加する場合

```bash
# ファイルを追加
echo "# 新しい学習ガイド" > az-204/study/new-study-guide.md

# コミット・プッシュ
git add .
git commit -m "Add new AZ-204 study guide"
git push
```

### AZ-400 練習問題を追加する場合

```bash
# ファイルを追加  
echo "# 新しい練習問題" > az-400/practice/new-practice-questions.md

# コミット・プッシュ
git add .
git commit -m "Add new AZ-400 practice questions"
git push
```

### 新しい試験コード（例：AZ-104）を追加する場合

```bash
# ディレクトリ作成
mkdir -p az-104/study az-104/practice

# ファイル追加
echo "# AZ-104 学習ガイド" > az-104/study/administration-guide.md
echo "# AZ-104 練習問題" > az-104/practice/admin-practice.md

# コミット・プッシュ
git add .
git commit -m "Add AZ-104 certification materials"
git push
```

## 🔧 カスタマイズ

### ファイル分類の変更

`.github/scripts/update-index.js` の分類ロジックを編集することで、ファイルの分類方法をカスタマイズできます。

### デザインの変更

`_config.yml` でJekyllテーマや設定を変更できます。

### 除外ファイルの設定

`_config.yml` の `exclude` セクションで、GitHub Pages から除外するファイル・ディレクトリを指定できます。

## 🎯 使用技術

- **GitHub Pages**: 静的サイトホスティング
- **Jekyll**: 静的サイト生成
- **GitHub Actions**: CI/CD パイプライン
- **Node.js**: index.md 自動生成スクリプト

## 🤝 コントリビューション

1. 新しい学習資料を適切なディレクトリに追加
2. ファイル名は説明的で、ハイフンで単語を区切る
3. コミットメッセージは明確で具体的に記述
4. プッシュ後、GitHub Actions が正常に実行されることを確認

---

*自動更新: GitHub Actions により `index.md` は自動的に更新されます*
