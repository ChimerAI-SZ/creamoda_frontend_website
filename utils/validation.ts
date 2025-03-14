/**
 * 验证字符串是否是有效的图片URL
 */
export const isValidImageUrl = (url: string): boolean => {
  // 基本URL格式验证
  try {
    const parsedUrl = new URL(url);

    // 检查协议
    if (!['http:', 'https:', 'data:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // 检查是否是常见图片扩展名或包含图片相关关键词
    if (url.startsWith('data:image/')) {
      return true;
    }

    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const path = parsedUrl.pathname.toLowerCase();

    return extensions.some(ext => path.endsWith(ext)) || url.toLowerCase().includes('image') || path.includes('photo');
  } catch (e) {
    return false;
  }
};
