/**
 * 性能测试 - 模拟 Lighthouse 检查
 */

const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('性能优化检查', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('HTML 文件大小检查', () => {
    const htmlSize = Buffer.byteLength(html, 'utf8');
    
    // HTML 文件大小应该合理（小于 100KB）
    expect(htmlSize).toBeLessThan(100 * 1024);
    
    console.log(`HTML 文件大小: ${(htmlSize / 1024).toFixed(2)} KB`);
  });

  test('外部资源数量检查', () => {
    const externalCSS = document.querySelectorAll('link[rel="stylesheet"]');
    const externalJS = document.querySelectorAll('script[src]');
    const images = document.querySelectorAll('img[src]');
    
    // 建议限制外部资源数量以提高性能
    expect(externalCSS.length).toBeLessThan(10);
    expect(externalJS.length).toBeLessThan(10);
    
    console.log(`外部 CSS: ${externalCSS.length}, 外部 JS: ${externalJS.length}, 图片: ${images.length}`);
  });

  test('图片优化检查', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      
      if (src) {
        // 检查是否使用了现代图片格式
        const modernFormats = ['.webp', '.avif'];
        const hasModernFormat = modernFormats.some(format => src.includes(format));
        
        if (!hasModernFormat && (src.includes('.jpg') || src.includes('.png'))) {
          console.warn(`建议使用现代图片格式: ${src}`);
        }
        
        // 检查是否有 loading="lazy" 属性
        if (!img.hasAttribute('loading')) {
          console.warn(`建议添加 loading="lazy" 属性: ${src}`);
        }
      }
    });
  });

  test('CSS 优化检查', () => {
    const inlineStyles = document.querySelectorAll('[style]');
    const styleTags = document.querySelectorAll('style');
    
    // 检查内联样式数量
    if (inlineStyles.length > 10) {
      console.warn(`内联样式过多 (${inlineStyles.length})，建议使用外部 CSS`);
    }
    
    // 检查 style 标签中的 CSS
    styleTags.forEach(styleTag => {
      const cssContent = styleTag.textContent;
      
      if (cssContent) {
        // 检查是否有未使用的 CSS（简单检查）
        const cssRules = cssContent.split('}').filter(rule => rule.trim());
        
        if (cssRules.length > 100) {
          console.warn('CSS 规则较多，建议检查是否有未使用的样式');
        }
      }
    });
  });

  test('JavaScript 优化检查', () => {
    const scriptTags = document.querySelectorAll('script');
    
    scriptTags.forEach(script => {
      const src = script.getAttribute('src');
      
      if (src) {
        // 检查是否使用了 async 或 defer
        const hasAsync = script.hasAttribute('async');
        const hasDefer = script.hasAttribute('defer');
        
        if (!hasAsync && !hasDefer) {
          console.warn(`建议为脚本添加 async 或 defer 属性: ${src}`);
        }
      }
      
      // 检查内联脚本大小
      if (!src && script.textContent) {
        const scriptSize = script.textContent.length;
        
        if (scriptSize > 1000) {
          console.warn(`内联脚本较大 (${scriptSize} 字符)，建议移至外部文件`);
        }
      }
    });
  });

  test('缓存策略检查', () => {
    const externalResources = [
      ...document.querySelectorAll('link[href]'),
      ...document.querySelectorAll('script[src]'),
      ...document.querySelectorAll('img[src]')
    ];

    externalResources.forEach(resource => {
      const url = resource.getAttribute('href') || resource.getAttribute('src');
      
      if (url && url.startsWith('http')) {
        // 检查是否使用了 CDN
        const cdnPatterns = ['cdn.', 'cloudflare', 'jsdelivr', 'unpkg'];
        const usesCDN = cdnPatterns.some(pattern => url.includes(pattern));
        
        if (usesCDN) {
          console.log(`使用 CDN 资源: ${url}`);
        }
      }
    });
  });

  test('可访问性性能检查', () => {
    // 检查是否有过多的 DOM 节点
    const allElements = document.querySelectorAll('*');
    
    if (allElements.length > 1500) {
      console.warn(`DOM 节点过多 (${allElements.length})，可能影响性能`);
    }
    
    // 检查嵌套深度
    let maxDepth = 0;
    
    function getDepth(element, depth = 0) {
      maxDepth = Math.max(maxDepth, depth);
      
      for (const child of element.children) {
        getDepth(child, depth + 1);
      }
    }
    
    getDepth(document.body);
    
    if (maxDepth > 32) {
      console.warn(`DOM 嵌套过深 (${maxDepth} 层)，可能影响性能`);
    }
    
    console.log(`DOM 统计: ${allElements.length} 个节点, 最大嵌套深度: ${maxDepth}`);
  });

  test('字体优化检查', () => {
    const fontLinks = document.querySelectorAll('link[href*="font"]');
    const fontFaces = document.querySelectorAll('style');
    
    fontLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // 检查是否使用了 font-display
      if (href && href.includes('google')) {
        console.log(`Google Fonts 链接: ${href}`);
        
        if (!href.includes('display=')) {
          console.warn('建议为 Google Fonts 添加 display 参数');
        }
      }
    });
    
    // 检查 @font-face 规则
    fontFaces.forEach(style => {
      const content = style.textContent;
      
      if (content && content.includes('@font-face')) {
        if (!content.includes('font-display')) {
          console.warn('建议为 @font-face 添加 font-display 属性');
        }
      }
    });
  });
});

describe('Web Vitals 模拟检查', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
  });

  afterEach(() => {
    document.documentElement.innerHTML = '';
  });

  test('Largest Contentful Paint (LCP) 优化检查', () => {
    // 查找可能的 LCP 元素
    const lcpCandidates = [
      ...document.querySelectorAll('img'),
      ...document.querySelectorAll('video'),
      ...document.querySelectorAll('h1, h2'),
      ...document.querySelectorAll('p')
    ];

    lcpCandidates.forEach(element => {
      if (element.tagName === 'IMG') {
        const src = element.getAttribute('src');
        
        if (src && !element.hasAttribute('loading')) {
          console.log('LCP 图片建议: 不要对首屏图片使用 lazy loading');
        }
      }
    });
  });

  test('First Input Delay (FID) 优化检查', () => {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, a[href], [onclick], [tabindex]'
    );

    if (interactiveElements.length > 50) {
      console.warn(`交互元素较多 (${interactiveElements.length})，注意 JavaScript 执行时间`);
    }
  });

  test('Cumulative Layout Shift (CLS) 优化检查', () => {
    // 检查可能导致布局偏移的元素
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    
    [...images, ...videos].forEach(media => {
      const hasWidth = media.hasAttribute('width');
      const hasHeight = media.hasAttribute('height');
      
      if (!hasWidth || !hasHeight) {
        const src = media.getAttribute('src') || '未知';
        console.warn(`建议为媒体元素设置尺寸以避免布局偏移: ${src}`);
      }
    });
    
    // 检查动态内容容器
    const dynamicContainers = document.querySelectorAll('[id*="dynamic"], [class*="dynamic"]');
    
    if (dynamicContainers.length > 0) {
      console.log(`发现 ${dynamicContainers.length} 个可能的动态内容容器，注意预留空间`);
    }
  });
});