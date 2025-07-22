# 个人工具小网站

一个轻量级的在线工具集合，提供常用的开发和办公工具，采用纯前端技术实现，可直接部署到 GitHub Pages。

## 🚀 功能特性

### 📋 JSON 格式化
- JSON 数据格式化和美化
- JSON 数据压缩
- 语法错误检测和提示
- 支持复制和清空操作

### ⏰ 时间戳转换
- 时间戳转日期时间（支持秒和毫秒）
- 日期时间转时间戳
- 获取当前时间戳
- 多种时间格式显示（本地时间、ISO格式、UTC时间）

### 🔍 字符串对比
- 逐行字符串差异对比
- 相似度百分比计算
- 可视化差异显示（增加/删除/不变）
- 支持多行文本对比

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计（Flexbox/Grid布局，响应式设计）
- **JavaScript (ES6+)** - 功能实现
- **无依赖** - 纯原生实现，无需额外库

## 📱 特性

- ✅ 响应式设计，支持移动端
- ✅ 现代化 UI 设计
- ✅ 无需服务器，纯静态页面
- ✅ 快速加载，轻量级
- ✅ 支持暗色主题适配

## 🚀 快速开始

### 本地运行

1. 克隆项目到本地
```bash
git clone <your-repo-url>
cd po-mini-tool-hub
```

2. 直接在浏览器中打开 `index.html` 文件

或者使用本地服务器：
```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve .

# 使用 PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

### GitHub Pages 部署

1. 将代码推送到 GitHub 仓库
2. 进入仓库设置页面
3. 找到 "Pages" 选项
4. 选择 "Deploy from a branch"
5. 选择 "main" 分支和 "/ (root)" 目录
6. 点击 "Save"
7. 等待几分钟后，访问 `https://your-username.github.io/po-mini-tool-hub`

## 📁 项目结构

```
po-mini-tool-hub/
├── index.html          # 主页面文件
├── README.md          # 项目说明文档
└── 项目介绍           # 技术栈和需求说明
```

## 🎨 界面预览

- 采用现代化卡片式设计
- 渐变背景和阴影效果
- 响应式网格布局
- 友好的交互反馈

## 🔧 自定义和扩展

### 添加新工具

1. 在 `index.html` 中的 `.tools-grid` 容器内添加新的 `.tool-card`
2. 实现对应的 JavaScript 功能函数
3. 添加必要的 CSS 样式

### 样式定制

- 修改 CSS 变量来改变主题色彩
- 调整 `.tool-card` 样式来改变卡片外观
- 修改 `.header` 样式来自定义页面头部

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系。