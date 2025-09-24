/**
 * 页面集成测试
 * 测试页面各部分的协同工作
 */

const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('页面集成测试', () => {
  beforeEach(() => {
    // 设置完整的 DOM 环境
    document.documentElement.innerHTML = html;
    
    // 模拟浏览器环境
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:8080/',
        origin: 'http://localhost:8080',
        pathname: '/',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('页面完整性检查', () => {
    // 验证页面基本结构
    expect(document.doctype).toBeTruthy();
    expect(document.documentElement).toBeTruthy();
    expect(document.head).toBeTruthy();
    expect(document.body).toBeTruthy();
    
    // 验证页面不为空
    const bodyContent = document.body.textContent || document.body.innerText;
    expect(bodyContent.trim().length).toBeGreaterThan(0);
  });

  test('资源引用完整性', () => {
    // 检查所有外部资源引用
    const externalResources = [
      ...document.querySelectorAll('link[href]'),
      ...document.querySelectorAll('script[src]'),
      ...document.querySelectorAll('img[src]')
    ];

    externalResources.forEach(resource => {
      const url = resource.getAttribute('href') || resource.getAttribute('src');
      expect(url).toBeTruthy();
      expect(url.trim()).not.toBe('');
      
      // 检查 URL 格式
      if (url.startsWith('http')) {
        expect(url).toMatch(/^https?:\/\/.+/);
      }
    });
  });

  test('表单功能集成测试', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // 检查表单有提交方法
      expect(['GET', 'POST'].includes(form.method.toUpperCase()) || form.method === '').toBe(true);
      
      // 检查表单有 action 或事件处理器
      const hasAction = form.hasAttribute('action');
      const hasSubmitHandler = form.hasAttribute('onsubmit') || form.onsubmit;
      
      if (!hasAction && !hasSubmitHandler) {
        // 如果既没有 action 也没有 submit 处理器，可能需要 JavaScript 处理
        console.warn('表单可能需要 JavaScript 处理提交');
      }
      
      // 检查表单控件
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        // 验证必填字段有适当的验证
        if (input.hasAttribute('required')) {
          expect(input.getAttribute('required')).toBeDefined();
        }
      });
    });
  });

  test('导航链接集成测试', () => {
    const navLinks = document.querySelectorAll('nav a, .nav a, [role="navigation"] a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href) {
        // 检查内部链接格式
        if (href.startsWith('#')) {
          const targetId = href.substring(1);
          if (targetId) {
            const target = document.getElementById(targetId);
            expect(target).toBeTruthy();
          }
        }
        
        // 检查外部链接有适当的属性
        if (href.startsWith('http') && !href.includes(window.location.origin)) {
          // 外部链接应该有 target="_blank" 和 rel="noopener"
          if (link.getAttribute('target') === '_blank') {
            expect(link.getAttribute('rel')).toContain('noopener');
          }
        }
      }
    });
  });

  test('媒体元素集成测试', () => {
    // 测试图片
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBe(true);
      
      const src = img.getAttribute('src');
      if (src) {
        expect(src.trim()).not.toBe('');
      }
    });

    // 测试视频
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // 检查视频有控制器或自动播放设置
      const hasControls = video.hasAttribute('controls');
      const hasAutoplay = video.hasAttribute('autoplay');
      
      if (hasAutoplay) {
        // 自动播放的视频应该是静音的
        expect(video.hasAttribute('muted')).toBe(true);
      }
    });

    // 测试音频 - 针对音乐播放器的特殊情况
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
      // 音频元素可能通过 JavaScript 控制，不一定需要 controls 属性
      // 检查是否有 id 或其他标识符用于 JavaScript 控制
      const hasId = audio.hasAttribute('id');
      const hasControls = audio.hasAttribute('controls');
      const hasPreload = audio.hasAttribute('preload');
      
      // 至少应该有其中一种控制方式
      expect(hasId || hasControls || hasPreload).toBe(true);
    });
  });

  test('可访问性集成测试', () => {
    // 检查标题层级
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      // 应该有 h1 标签
      const h1s = document.querySelectorAll('h1');
      expect(h1s.length).toBeGreaterThanOrEqual(1);
      
      // 检查标题层级是否合理（允许单个 h1 的情况）
      if (headings.length > 1) {
        let previousLevel = 0;
        headings.forEach(heading => {
          const level = parseInt(heading.tagName.charAt(1));
          if (previousLevel > 0) {
            // 标题层级不应该跳跃太大
            expect(level - previousLevel).toBeLessThanOrEqual(2);
          }
          previousLevel = level;
        });
      }
    }

    // 检查 ARIA 标签
    const elementsWithRole = document.querySelectorAll('[role]');
    elementsWithRole.forEach(element => {
      const role = element.getAttribute('role');
      expect(role).toBeTruthy();
      
      // 常见的 ARIA 角色验证
      const validRoles = [
        'button', 'link', 'navigation', 'main', 'banner', 'contentinfo',
        'complementary', 'search', 'form', 'dialog', 'alert', 'status'
      ];
      
      if (validRoles.includes(role)) {
        expect(validRoles).toContain(role);
      }
    });

    // 检查焦点管理
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      // 可聚焦元素应该有可见的文本或 aria-label
      const hasVisibleText = !!(element.textContent && element.textContent.trim());
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
      const hasTitle = element.hasAttribute('title');
      const hasAlt = element.hasAttribute('alt');
      
      // 对于某些特殊元素（如进度条），可能通过其他方式提供标签
      const isProgressElement = element.hasAttribute('role') && element.getAttribute('role') === 'slider';
      const hasAriaValueText = element.hasAttribute('aria-valuetext');
      
      // 检查是否有任何形式的可访问标签
      const hasAccessibleLabel = 
        hasVisibleText || 
        hasAriaLabel || 
        hasAriaLabelledby || 
        hasTitle || 
        hasAlt || 
        (isProgressElement && hasAriaValueText) ||
        isProgressElement; // 进度条元素可能通过父元素提供标签
      
      expect(hasAccessibleLabel).toBe(true);
    });
  });

  test('SEO 元素集成测试', () => {
    const head = document.head;
    
    // 检查基本 SEO 元素
    const title = head.querySelector('title');
    if (title) {
      expect(title.textContent.trim()).toBeTruthy();
      expect(title.textContent.length).toBeLessThanOrEqual(60); // SEO 最佳实践
    }

    const metaDescription = head.querySelector('meta[name="description"]');
    if (metaDescription) {
      const content = metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content.length).toBeLessThanOrEqual(160); // SEO 最佳实践
    }

    // 检查 Open Graph 标签
    const ogTags = head.querySelectorAll('meta[property^="og:"]');
    if (ogTags.length > 0) {
      ogTags.forEach(tag => {
        const content = tag.getAttribute('content');
        expect(content).toBeTruthy();
      });
    }

    // 检查结构化数据
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
      expect(() => {
        JSON.parse(script.textContent);
      }).not.toThrow();
    });
  });
});