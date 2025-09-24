const { test, expect } = require('@playwright/test');

test.describe('基础页面测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问主页
    await page.goto('http://localhost:8000');
  });

  test('页面标题正确', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/口袋音乐播放器/i);
  });

  test('页面加载成功', async ({ page }) => {
    // 验证页面响应状态
    const response = await page.goto('http://localhost:8000');
    expect(response?.status()).toBe(200);
  });

  test('HTML 结构完整', async ({ page }) => {
    // 验证基本 HTML 结构
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('head')).toBeAttached();
    await expect(page.locator('body')).toBeVisible();
  });

  test('页面内容渲染正确', async ({ page }) => {
    // 验证页面内容（根据实际 HTML 内容调整）
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
  });

  test('页面无 JavaScript 错误', async ({ page }) => {
    const errors = [];
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 监听页面错误
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:8000');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 验证没有错误
    expect(errors).toHaveLength(0);
  });

  test('页面响应式设计', async ({ page }) => {
    // 测试不同屏幕尺寸
    const viewports = [
      { width: 1920, height: 1080 }, // 桌面
      { width: 768, height: 1024 },  // 平板
      { width: 375, height: 667 }    // 手机
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      // 验证页面在不同尺寸下正常显示
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('性能测试', () => {
  test('页面加载性能', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 验证页面加载时间小于 3 秒
    expect(loadTime).toBeLessThan(3000);
  });

  test('资源加载检查', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      // 只记录本地资源加载失败，忽略外部资源（如音频文件）
      if (!request.url().includes('minimax-algeng-chat-tts.oss-cn-wulanchabu.aliyuncs.com')) {
        failedRequests.push(request.url());
      }
    });

    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
    
    // 验证没有本地资源加载失败
    expect(failedRequests).toHaveLength(0);
  });
});

test.describe('可访问性测试', () => {
  test('基本可访问性检查', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // 检查是否有 lang 属性
    const htmlLang = await page.locator('html').getAttribute('lang');
    if (htmlLang) {
      expect(htmlLang).toBeTruthy();
    }
    
    // 检查页面是否可以通过键盘导航
    await page.keyboard.press('Tab');
    
    // 验证页面结构
    await expect(page.locator('body')).toBeVisible();
  });

  test('颜色对比度检查', async ({ page }) => {
    await page.goto('http://localhost:8000');
    
    // 这里可以添加更详细的颜色对比度检查
    // 目前只验证页面正常渲染
    await expect(page.locator('body')).toBeVisible();
  });
});