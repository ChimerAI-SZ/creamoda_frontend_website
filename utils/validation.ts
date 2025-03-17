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

    // 如果是HTTP或HTTPS URL，放宽验证条件
    // 更新：对于没有常见图片扩展名的URL，也允许其通过初步验证
    // 实际的图片有效性将在后续fetchImage时通过content-type来验证

    // 常见图片扩展名检查
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const path = parsedUrl.pathname.toLowerCase();
    const hasExtension = extensions.some(ext => path.endsWith(ext));

    // 图片相关关键词检查
    const hasImageKeyword = url.toLowerCase().includes('image') || path.includes('photo') || path.includes('img');

    // 如果是http或https URL，即使没有明显标识为图片的特征，也尝试加载
    // 真正的验证会在获取内容后通过MIME类型进行
    return hasExtension || hasImageKeyword || parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};
