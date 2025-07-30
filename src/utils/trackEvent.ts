export const trackPromotionEvent = (event: string, properties: Record<string, string>) => {
  // 只在 Vercel 环境中使用 Vercel Analytics
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_DEPLOY_ENV === 'vercel') {
    try {
      // 动态导入，避免在非 Vercel 环境中加载
      import('@vercel/analytics')
        .then(({ track }) => {
          track(event, properties)
        })
        .catch(() => {
          // 忽略错误，在非 Vercel 环境中不加载
        })
    } catch (error) {
      // 忽略错误
    }
  }

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any)?.gtag) {
    try {
      ;(window as any).gtag('event', event, { ...properties })
      if (properties.action_detail) {
        ;(window as any).gtag('event', properties.action_detail)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
