/**
 * 安全性测试
 */

const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('安全性检查', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('XSS 防护检查', () => {
    // 检查是否有潜在的 XSS 风险
    const scriptTags = document.querySelectorAll('script');
    
    scriptTags.forEach(script => {
      const content = script.textContent;
      
      if (content) {
        // 检查是否有 eval() 使用
        if (content.includes('eval(')) {
          console.warn('发现 eval() 使用，存在 XSS 风险');
        }
        
        // 检查是否有 innerHTML 直接赋值
        if (content.includes('.innerHTML') && !content.includes('textContent')) {
          console.warn('发现 innerHTML 使用，注意 XSS 防护');
        }
        
        // 检查是否有 document.write
        if (content.includes('document.write')) {
          console.warn('发现 document.write 使用，存在安全风险');
        }
      }
    });
  });

  test('外部链接安全检查', () => {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');
      const rel = link.getAttribute('rel');
      
      // 检查外部链接是否有适当的 rel 属性
      if (target === '_blank') {
        if (!rel || !rel.includes('noopener')) {
          console.warn(`外部链接缺少 rel="noopener": ${href}`);
        }
        
        if (!rel || !rel.includes('noreferrer')) {
          console.warn(`外部链接建议添加 rel="noreferrer": ${href}`);
        }
      }
      
      // 检查是否链接到不安全的协议
      if (href.startsWith('http://')) {
        console.warn(`使用不安全的 HTTP 协议: ${href}`);
      }
    });
  });

  test('表单安全检查', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const action = form.getAttribute('action');
      const method = form.getAttribute('method');
      
      // 检查表单提交方法
      if (method && method.toUpperCase() === 'GET') {
        const passwordInputs = form.querySelectorAll('input[type="password"]');
        
        if (passwordInputs.length > 0) {
          console.warn('密码表单不应使用 GET 方法');
        }
      }
      
      // 检查表单 action 是否使用 HTTPS
      if (action && action.startsWith('http://')) {
        console.warn(`表单提交使用不安全的 HTTP 协议: ${action}`);
      }
      
      // 检查是否有 CSRF 保护
      const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
      
      if (!csrfToken && method && method.toUpperCase() === 'POST') {
        console.warn('POST 表单建议添加 CSRF 保护');
      }
    });
  });

  test('内容安全策略检查', () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (!cspMeta) {
      console.warn('建议添加 Content Security Policy (CSP) 头部');
    } else {
      const cspContent = cspMeta.getAttribute('content');
      
      // 检查 CSP 配置
      if (cspContent.includes("'unsafe-inline'")) {
        console.warn('CSP 中使用 unsafe-inline 存在安全风险');
      }
      
      if (cspContent.includes("'unsafe-eval'")) {
        console.warn('CSP 中使用 unsafe-eval 存在安全风险');
      }
    }
  });

  test('敏感信息泄露检查', () => {
    const htmlContent = html.toLowerCase();
    
    // 检查是否有敏感信息
    const sensitivePatterns = [
      /password\s*[:=]\s*['"][^'"]+['"]/i,
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
      /secret\s*[:=]\s*['"][^'"]+['"]/i,
      /token\s*[:=]\s*['"][^'"]+['"]/i
    ];
    
    sensitivePatterns.forEach(pattern => {
      if (pattern.test(htmlContent)) {
        console.warn('发现可能的敏感信息泄露');
      }
    });
    
    // 检查注释中的敏感信息
    const comments = html.match(/<!--[\s\S]*?-->/g) || [];
    
    comments.forEach(comment => {
      const commentLower = comment.toLowerCase();
      
      if (commentLower.includes('password') || 
          commentLower.includes('secret') || 
          commentLower.includes('key')) {
        console.warn('注释中可能包含敏感信息');
      }
    });
  });

  test('第三方资源安全检查', () => {
    const externalResources = [
      ...document.querySelectorAll('script[src^="http"]'),
      ...document.querySelectorAll('link[href^="http"]'),
      ...document.querySelectorAll('img[src^="http"]')
    ];

    externalResources.forEach(resource => {
      const url = resource.getAttribute('src') || resource.getAttribute('href');
      
      // 检查是否使用 HTTPS
      if (url.startsWith('http://')) {
        console.warn(`第三方资源使用不安全的 HTTP: ${url}`);
      }
      
      // 检查是否有 integrity 属性（对于关键资源）
      if (resource.tagName === 'SCRIPT' || 
          (resource.tagName === 'LINK' && resource.getAttribute('rel') === 'stylesheet')) {
        
        if (!resource.hasAttribute('integrity')) {
          console.warn(`关键资源建议添加 integrity 属性: ${url}`);
        }
      }
    });
  });

  test('点击劫持防护检查', () => {
    const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    
    if (!frameOptions) {
      console.warn('建议添加 X-Frame-Options 头部防止点击劫持');
    }
  });

  test('输入验证检查', () => {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      const type = input.getAttribute('type');
      const pattern = input.getAttribute('pattern');
      const maxlength = input.getAttribute('maxlength');
      
      // 检查邮箱输入验证
      if (type === 'email' && !pattern) {
        console.log('邮箱输入使用了 HTML5 验证');
      }
      
      // 检查文本输入长度限制
      if ((type === 'text' || input.tagName === 'TEXTAREA') && !maxlength) {
        console.warn('文本输入建议设置最大长度限制');
      }
      
      // 检查数字输入范围
      if (type === 'number') {
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');
        
        if (!min || !max) {
          console.warn('数字输入建议设置范围限制');
        }
      }
    });
  });

  test('Cookie 安全检查', () => {
    // 检查是否有设置 Cookie 的脚本
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      const content = script.textContent;
      
      if (content && content.includes('document.cookie')) {
        // 检查 Cookie 设置是否包含安全属性
        if (!content.includes('Secure')) {
          console.warn('Cookie 设置建议添加 Secure 属性');
        }
        
        if (!content.includes('HttpOnly')) {
          console.warn('Cookie 设置建议添加 HttpOnly 属性');
        }
        
        if (!content.includes('SameSite')) {
          console.warn('Cookie 设置建议添加 SameSite 属性');
        }
      }
    });
  });
});

describe('隐私保护检查', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('第三方跟踪检查', () => {
    const externalScripts = document.querySelectorAll('script[src^="http"]');
    
    // 常见的跟踪服务域名
    const trackingDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.net',
      'doubleclick.net',
      'googlesyndication.com'
    ];

    externalScripts.forEach(script => {
      const src = script.getAttribute('src');
      
      trackingDomains.forEach(domain => {
        if (src.includes(domain)) {
          console.log(`发现第三方跟踪服务: ${domain}`);
        }
      });
    });
  });

  test('隐私政策链接检查', () => {
    const privacyLinks = document.querySelectorAll('a[href*="privacy"], a[href*="隐私"]');
    
    if (privacyLinks.length === 0) {
      console.warn('建议添加隐私政策链接');
    }
  });

  test('数据收集表单检查', () => {
    const personalDataInputs = document.querySelectorAll(
      'input[type="email"], input[name*="email"], input[name*="phone"], input[name*="name"]'
    );

    if (personalDataInputs.length > 0) {
      console.log(`发现 ${personalDataInputs.length} 个个人数据收集字段`);
      
      // 检查是否有隐私声明
      const privacyNotice = document.querySelector('*[class*="privacy"], *[id*="privacy"]');
      
      if (!privacyNotice) {
        console.warn('收集个人数据时建议显示隐私声明');
      }
    }
  });
});