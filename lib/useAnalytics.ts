/**
 * Google Analytics事件跟踪钩子
 */
export const useAnalytics = () => {
  // 页面浏览事件已经由基本GA脚本自动跟踪

  /**
   * 跟踪自定义事件
   * @param eventName 事件名称
   * @param eventParams 事件参数
   */
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    // 确保gtag函数存在
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  };

  return { trackEvent };
};

// 添加gtag类型定义以避免TypeScript错误
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js', 
      eventName: string, 
      eventParams?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
} 