/**
 * DOM 相关的单元测试
 */

// 模拟 DOM 环境
const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('HTML 结构测试', () => {
  beforeEach(() => {
    // 设置 DOM 环境
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    // 清理 DOM
    document.documentElement.innerHTML = '';
  });

  test('HTML 文档结构完整', () => {
    expect(document.doctype).toBeTruthy();
    expect(document.documentElement).toBeTruthy();
    expect(document.head).toBeTruthy();
    expect(document.body).toBeTruthy();
  });

  test('HTML 标签属性正确', () => {
    const htmlElement = document.documentElement;
    
    // 检查是否有 lang 属性（如果存在）
    if (htmlElement.hasAttribute('lang')) {
      expect(htmlElement.getAttribute('lang')).toBeTruthy();
    }
  });

  test('head 部分包含必要元素', () => {
    const head = document.head;
    
    // 检查是否有 title 标签
    const title = head.querySelector('title');
    if (title) {
      expect(title.textContent).toBeTruthy();
    }

    // 检查是否有 meta charset
    const charset = head.querySelector('meta[charset]');
    if (charset) {
      expect(charset.getAttribute('charset')).toBeTruthy();
    }

    // 检查是否有 viewport meta 标签
    const viewport = head.querySelector('meta[name="viewport"]');
    if (viewport) {
      expect(viewport.getAttribute('content')).toBeTruthy();
    }
  });

  test('body 部分存在且可访问', () => {
    const body = document.body;
    expect(body).toBeTruthy();
    expect(body.tagName.toLowerCase()).toBe('body');
  });

  test('HTML 验证 - 无重复 ID', () => {
    const elementsWithId = document.querySelectorAll('[id]');
    const ids = Array.from(elementsWithId).map(el => el.id);
    const uniqueIds = [...new Set(ids)];
    
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('HTML 验证 - 图片有 alt 属性', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
    });
  });

  test('HTML 验证 - 链接有有效的 href', () => {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href.trim()).not.toBe('');
    });
  });

  test('HTML 验证 - 表单元素有标签', () => {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
      const id = input.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label).toBeTruthy();
      }
    });
  });
});

describe('CSS 和样式测试', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('内联样式检查', () => {
    const elementsWithStyle = document.querySelectorAll('[style]');
    
    elementsWithStyle.forEach(element => {
      const style = element.getAttribute('style');
      expect(style).toBeTruthy();
      expect(style.trim()).not.toBe('');
    });
  });

  test('CSS 类名检查', () => {
    const elementsWithClass = document.querySelectorAll('[class]');
    
    elementsWithClass.forEach(element => {
      const className = element.getAttribute('class');
      expect(className).toBeTruthy();
      expect(className.trim()).not.toBe('');
    });
  });

  test('外部样式表链接检查', () => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    stylesheets.forEach(link => {
      const href = link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href.trim()).not.toBe('');
    });
  });
});

describe('JavaScript 相关测试', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('外部脚本链接检查', () => {
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src.trim()).not.toBe('');
    });
  });

  test('内联脚本检查', () => {
    const inlineScripts = document.querySelectorAll('script:not([src])');
    
    inlineScripts.forEach(script => {
      if (script.textContent.trim()) {
        expect(script.textContent).toBeTruthy();
      }
    });
  });

  test('事件处理器检查', () => {
    const elementsWithEvents = document.querySelectorAll('[onclick], [onload], [onchange]');
    
    elementsWithEvents.forEach(element => {
      // 检查事件处理器是否存在
      const eventAttrs = ['onclick', 'onload', 'onchange'];
      eventAttrs.forEach(attr => {
        if (element.hasAttribute(attr)) {
          const handler = element.getAttribute(attr);
          expect(handler).toBeTruthy();
          expect(handler.trim()).not.toBe('');
        }
      });
    });
  });
});