/**
 * 音乐播放器专项单元测试
 */

const fs = require('fs');
const path = require('path');

// 读取 HTML 文件内容
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('音乐播放器功能测试', () => {
  beforeEach(() => {
    // 设置 DOM 环境
    document.documentElement.innerHTML = html;
    
    // 模拟 Audio API
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      currentTime: 0,
      duration: 0,
      paused: true,
      ended: false,
      src: '',
      preload: 'metadata'
    }));
  });

  afterEach(() => {
    // 清理 DOM
    document.documentElement.innerHTML = '';
    jest.clearAllMocks();
  });

  test('音频元素存在且配置正确', () => {
    const audio = document.getElementById('audio');
    
    expect(audio).toBeTruthy();
    expect(audio.tagName.toLowerCase()).toBe('audio');
    expect(audio.hasAttribute('preload')).toBe(true);
    expect(audio.getAttribute('preload')).toBe('metadata');
  });

  test('播放控制按钮存在且配置正确', () => {
    const playButton = document.getElementById('toggleButton');
    
    expect(playButton).toBeTruthy();
    expect(playButton.tagName.toLowerCase()).toBe('button');
    expect(playButton.getAttribute('type')).toBe('button');
    expect(playButton.hasAttribute('aria-pressed')).toBe(true);
    
    // 检查按钮内容结构
    const icon = playButton.querySelector('.icon');
    const label = playButton.querySelector('.label');
    
    expect(icon).toBeTruthy();
    expect(label).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  test('进度条元素存在且配置正确', () => {
    const progressWrapper = document.getElementById('progressWrapper');
    const progressBar = document.getElementById('progressBar');
    
    expect(progressWrapper).toBeTruthy();
    expect(progressBar).toBeTruthy();
    
    // 检查 ARIA 属性
    expect(progressWrapper.getAttribute('role')).toBe('slider');
    expect(progressWrapper.hasAttribute('aria-valuemin')).toBe(true);
    expect(progressWrapper.hasAttribute('aria-valuemax')).toBe(true);
    expect(progressWrapper.hasAttribute('aria-valuenow')).toBe(true);
    expect(progressWrapper.hasAttribute('tabindex')).toBe(true);
  });

  test('时间显示元素存在', () => {
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    
    expect(currentTime).toBeTruthy();
    expect(duration).toBeTruthy();
    
    // 检查初始值
    expect(currentTime.textContent).toBe('0:00');
    expect(duration.textContent).toBe('0:00');
  });

  test('曲目列表元素存在且配置正确', () => {
    const trackList = document.getElementById('trackList');
    const trackPlaceholder = document.getElementById('trackPlaceholder');
    
    expect(trackList).toBeTruthy();
    expect(trackPlaceholder).toBeTruthy();
    
    // 检查 ARIA 属性
    expect(trackList.getAttribute('role')).toBe('listbox');
    expect(trackList.hasAttribute('aria-labelledby')).toBe(true);
    expect(trackList.hasAttribute('aria-disabled')).toBe(true);
    
    // 检查占位符
    expect(trackPlaceholder.getAttribute('role')).toBe('status');
    expect(trackPlaceholder.getAttribute('aria-live')).toBe('polite');
  });

  test('CSS 类和样式正确应用', () => {
    const player = document.querySelector('main.player');
    const playButton = document.getElementById('toggleButton');
    const trackList = document.getElementById('trackList');
    
    expect(player).toBeTruthy();
    expect(player.classList.contains('player')).toBe(true);
    
    expect(playButton.classList.contains('play-toggle')).toBe(true);
    expect(trackList.classList.contains('track-list')).toBe(true);
  });

  test('JavaScript 变量和函数定义检查', () => {
    // 检查脚本标签存在
    const scripts = document.querySelectorAll('script');
    const mainScript = Array.from(scripts).find(script => 
      script.textContent && script.textContent.includes('const audio')
    );
    
    expect(mainScript).toBeTruthy();
    
    // 检查关键变量定义
    const scriptContent = mainScript.textContent;
    expect(scriptContent).toContain('const audio');
    expect(scriptContent).toContain('const playButton');
    expect(scriptContent).toContain('const trackList');
    expect(scriptContent).toContain('let tracks = []');
    
    // 检查关键函数定义
    expect(scriptContent).toContain('function formatTime');
    expect(scriptContent).toContain('function updateProgress');
    expect(scriptContent).toContain('function loadTracksFromFile');
    expect(scriptContent).toContain('function updateTrackSelection');
  });

  test('事件监听器设置检查', () => {
    const scripts = document.querySelectorAll('script');
    const mainScript = Array.from(scripts).find(script => 
      script.textContent && script.textContent.includes('addEventListener')
    );
    
    expect(mainScript).toBeTruthy();
    
    const scriptContent = mainScript.textContent;
    
    // 检查音频事件监听器
    expect(scriptContent).toContain('audio.addEventListener("timeupdate"');
    expect(scriptContent).toContain('audio.addEventListener("loadedmetadata"');
    expect(scriptContent).toContain('audio.addEventListener("play"');
    expect(scriptContent).toContain('audio.addEventListener("pause"');
    expect(scriptContent).toContain('audio.addEventListener("ended"');
    
    // 检查用户交互事件监听器
    expect(scriptContent).toContain('playButton.addEventListener("click"');
    expect(scriptContent).toContain('trackList.addEventListener("click"');
    expect(scriptContent).toContain('trackList.addEventListener("keydown"');
    expect(scriptContent).toContain('progressWrapper.addEventListener("mousedown"');
  });

  test('可访问性属性正确设置', () => {
    const player = document.querySelector('main.player');
    const progressWrapper = document.getElementById('progressWrapper');
    const trackList = document.getElementById('trackList');
    
    // 检查主容器的可访问性
    expect(player.getAttribute('role')).toBe('region');
    expect(player.hasAttribute('aria-label')).toBe(true);
    
    // 检查进度条的可访问性
    expect(progressWrapper.getAttribute('role')).toBe('slider');
    expect(progressWrapper.hasAttribute('aria-valuemin')).toBe(true);
    expect(progressWrapper.hasAttribute('aria-valuemax')).toBe(true);
    
    // 检查曲目列表的可访问性
    expect(trackList.getAttribute('role')).toBe('listbox');
    expect(trackList.hasAttribute('aria-labelledby')).toBe(true);
  });

  test('响应式设计媒体查询存在', () => {
    const styles = document.querySelectorAll('style');
    const mainStyle = Array.from(styles).find(style => 
      style.textContent && style.textContent.includes('@media')
    );
    
    expect(mainStyle).toBeTruthy();
    
    const styleContent = mainStyle.textContent;
    expect(styleContent).toContain('@media (max-width: 480px)');
  });

  test('CSS 自定义属性使用', () => {
    const styles = document.querySelectorAll('style');
    const mainStyle = Array.from(styles).find(style => 
      style.textContent && style.textContent.includes(':root')
    );
    
    expect(mainStyle).toBeTruthy();
    
    const styleContent = mainStyle.textContent;
    expect(styleContent).toContain(':root');
    expect(styleContent).toContain('color-scheme');
    expect(styleContent).toContain('--track-item-height');
  });
});