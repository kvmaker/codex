# 自动化测试套件

这是一个为 HTML 项目设计的完整自动化测试套件，包含多种类型的测试以确保代码质量、性能和安全性。

## 📋 测试类型

### 🔧 单元测试 (Unit Tests)
- **DOM 结构测试**: 验证 HTML 结构的完整性和正确性
- **CSS 样式测试**: 检查样式表和内联样式
- **JavaScript 功能测试**: 测试脚本功能和事件处理

### 🔗 集成测试 (Integration Tests)
- **页面完整性测试**: 验证页面各部分协同工作
- **资源引用测试**: 检查外部资源的完整性
- **表单功能测试**: 测试表单提交和验证
- **导航链接测试**: 验证内部和外部链接
- **可访问性集成测试**: 检查 ARIA 标签和焦点管理
- **SEO 元素测试**: 验证 SEO 相关标签

### 🌐 端到端测试 (E2E Tests)
- **基础页面测试**: 页面加载、标题、内容渲染
- **跨浏览器测试**: Chrome、Firefox、Safari、移动端
- **响应式设计测试**: 不同屏幕尺寸适配
- **性能测试**: 页面加载时间和资源加载
- **可访问性测试**: 键盘导航和颜色对比度

### ⚡ 性能测试 (Performance Tests)
- **文件大小检查**: HTML、CSS、JS 文件大小优化
- **资源优化**: 图片格式、懒加载、CDN 使用
- **Web Vitals**: LCP、FID、CLS 优化建议
- **缓存策略**: 外部资源缓存检查

### 🔒 安全测试 (Security Tests)
- **XSS 防护**: 检查潜在的跨站脚本攻击风险
- **外部链接安全**: 验证 `rel="noopener"` 等安全属性
- **表单安全**: CSRF 保护、HTTPS 使用
- **内容安全策略**: CSP 头部检查
- **敏感信息泄露**: 检查代码中的敏感信息
- **隐私保护**: 第三方跟踪和数据收集检查

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装浏览器（用于 E2E 测试）

```bash
npm run install:browsers
```

### 3. 运行测试

```bash
# 运行所有测试
npm run test:all

# 只运行单元测试
npm test

# 只运行 E2E 测试
npm run test:e2e

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm test:watch
```

## 📁 项目结构

```
├── tests/
│   ├── unit/                 # 单元测试
│   │   └── dom.test.js
│   ├── integration/          # 集成测试
│   │   └── page-integration.test.js
│   ├── e2e/                  # 端到端测试
│   │   └── basic.spec.js
│   ├── performance/          # 性能测试
│   │   └── lighthouse.test.js
│   └── security/             # 安全测试
│       └── security.test.js
├── package.json              # 项目配置和依赖
├── playwright.config.js      # Playwright 配置
└── README.md                 # 项目文档
```

## 🔧 配置说明

### Jest 配置
- 测试环境: jsdom
- 覆盖率报告: text, lcov, html
- 自动收集覆盖率数据

### Playwright 配置
- 支持多浏览器: Chrome, Firefox, Safari
- 移动端测试: Pixel 5, iPhone 12
- 自动启动本地服务器
- 失败时自动截图和录制视频

## 📊 测试报告

### 覆盖率报告
运行 `npm run test:coverage` 后，覆盖率报告将生成在 `coverage/` 目录中。

### E2E 测试报告
Playwright 测试报告将生成在 `playwright-report/` 目录中，包含：
- HTML 报告
- JSON 结果文件
- JUnit XML 报告

## 🎯 测试最佳实践

### 1. 测试命名
- 使用描述性的测试名称
- 遵循 "应该做什么" 的格式

### 2. 测试组织
- 按功能模块组织测试
- 使用 `describe` 块分组相关测试

### 3. 测试数据
- 使用真实但匿名的测试数据
- 避免硬编码敏感信息

### 4. 断言
- 使用具体的断言而不是通用的
- 提供有意义的错误消息

## 🔍 常见问题

### Q: 如何添加新的测试用例？
A: 在相应的测试目录中创建新的测试文件，或在现有文件中添加新的测试用例。

### Q: 如何跳过某个测试？
A: 使用 `test.skip()` 或 `describe.skip()` 来跳过测试。

### Q: 如何只运行特定的测试？
A: 使用 `test.only()` 或 `describe.only()` 来只运行特定测试。

### Q: 测试失败了怎么办？
A: 查看测试输出和错误信息，检查 `playwright-report/` 中的详细报告。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 添加测试用例
4. 确保所有测试通过
5. 提交 Pull Request

## 📝 许可证

MIT License

## 📞 支持

如有问题或建议，请创建 Issue 或联系维护者。

---

**注意**: 这个测试套件是为通用 HTML 项目设计的。根据你的具体项目需求，可能需要调整某些测试用例。