const fs = require('fs');
const path = require('path');

// ファイルを再帰的に検索する関数
function findMarkdownFiles(dir, baseDir = dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // _old, .git, .github, .obsidian ディレクトリは除外
      if (!item.startsWith('_') && !item.startsWith('.')) {
        files = files.concat(findMarkdownFiles(fullPath, baseDir));
      }
    } else if (item.endsWith('.md') && item !== 'index.md' && item !== 'README.md') {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      files.push({
        path: relativePath,
        name: item.replace('.md', ''),
        fullPath: fullPath,
        directory: path.dirname(relativePath)
      });
    }
  }
  
  return files;
}

// ファイル名を読みやすい形式に変換
function formatFileName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// index.mdを生成
function generateIndex() {
  const baseDir = process.cwd();
  const files = findMarkdownFiles(baseDir);
  
  // az-xxx別にファイルをグループ化
  const examGroups = {};
  const otherFiles = [];
  
  files.forEach(file => {
    const match = file.directory.match(/^(az-\d+)/);
    if (match) {
      const examCode = match[1].toUpperCase();
      if (!examGroups[examCode]) {
        examGroups[examCode] = {
          study: [],
          practice: [],
          other: []
        };
      }
      
      if (file.directory.includes('study') || file.directory.includes('devops-security')) {
        examGroups[examCode].study.push(file);
      } else if (file.directory.includes('practice') || file.name.toLowerCase().includes('practice')) {
        examGroups[examCode].practice.push(file);
      } else {
        examGroups[examCode].other.push(file);
      }
    } else {
      otherFiles.push(file);
    }
  });
  
  // 試験コードの説明を取得
  const examDescriptions = {
    'AZ-204': 'Developing Solutions for Microsoft Azure',
    'AZ-400': 'Microsoft Azure DevOps Solutions',
    'AZ-104': 'Microsoft Azure Administrator',
    'AZ-305': 'Designing Microsoft Azure Infrastructure Solutions',
    'AZ-900': 'Microsoft Azure Fundamentals'
  };
  
  let content = `# Azure 試験対策リポジトリ

このリポジトリは Azure 認定試験の学習資料をまとめたものです。

## 📚 試験別学習資料

`;

  // 試験コード別にセクションを生成
  const sortedExamCodes = Object.keys(examGroups).sort();
  
  for (const examCode of sortedExamCodes) {
    const description = examDescriptions[examCode] || 'Azure Certification';
    content += `### ${examCode}: ${description}\n\n`;
    
    const group = examGroups[examCode];
    
    if (group.study.length > 0) {
      content += `- **学習ガイド**\n`;
      group.study.forEach(file => {
        const title = formatFileName(file.name);
        content += `  - [${title}](./${file.path})\n`;
      });
      content += `\n`;
    }
    
    if (group.practice.length > 0) {
      content += `- **練習問題**\n`;
      group.practice.forEach(file => {
        const title = formatFileName(file.name);
        content += `  - [${title}](./${file.path})\n`;
      });
      content += `\n`;
    }
    
    if (group.other.length > 0) {
      content += `- **その他**\n`;
      group.other.forEach(file => {
        const title = formatFileName(file.name);
        content += `  - [${title}](./${file.path})\n`;
      });
      content += `\n`;
    }
  }
  
  // その他のファイル
  if (otherFiles.length > 0) {
    content += `## 🛠️ その他のリソース\n\n`;
    otherFiles.forEach(file => {
      const title = formatFileName(file.name);
      content += `- [${title}](./${file.path})\n`;
    });
    content += `\n`;
  }
  
  // プロンプトサンプルへのリンクを追加
  if (fs.existsSync('./_prompt-samples/README.md')) {
    if (otherFiles.length === 0) {
      content += `## 🛠️ その他のリソース\n\n`;
    }
    content += `- [プロンプトサンプル](./_prompt-samples/README.md)\n\n`;
  }
  
  content += `---

## 最終更新: ${new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}

> このページは GitHub Actions により自動更新されます。`;

  return content;
}

// index.mdを更新
try {
  const newContent = generateIndex();
  fs.writeFileSync('index.md', newContent, 'utf8');
  console.log('index.md が正常に更新されました');
} catch (error) {
  console.error('index.md の更新に失敗しました:', error);
  process.exit(1);
}
