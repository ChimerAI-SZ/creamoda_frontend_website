import { useState, useCallback } from 'react';
import { uploadImage } from '@/lib/api/common';

/**
 * 处理外部URL图片的hook
 * 检测外部图片URL并自动重新上传到后端OSS
 */
export function useExternalImageHandler() {
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // 检查是否为外部URL（需要重新上传的URL）
  const isExternalUrl = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      // 检查是否为外部域名（非后端OSS域名）
      const hostname = urlObj.hostname;
      
      // 如果包含以下域名，认为是外部URL
      const externalDomains = [
        'vercel.app',
        'creamoda-loadingpage',
        'netlify.app',
        'github.io',
        'amazonaws.com', // 如果不是我们的AWS
        'cloudfront.net' // 如果不是我们的CloudFront
      ];
      
      // 如果包含OSS相关域名，认为是内部URL
      const internalDomains = [
        'aliyuncs.com',
        'oss-',
        'cos.ap-', // 腾讯云
        'imgproxy.creamoda.ai' // 我们的图片代理
      ];
      
      // 先检查是否为内部域名
      if (internalDomains.some(domain => hostname.includes(domain))) {
        return false;
      }
      
      // 再检查是否为外部域名
      if (externalDomains.some(domain => hostname.includes(domain))) {
        return true;
      }
      
      // 如果是localhost或IP地址，认为是内部
      if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return false;
      }
      
      // 其他情况默认认为是外部URL
      return true;
    } catch (error) {
      console.error('Invalid URL:', url);
      return false;
    }
  }, []);

  // 下载图片并重新上传到后端OSS
  const downloadAndReuploadImage = useCallback(async (imageUrl: string): Promise<string> => {
    try {
      setIsProcessingImage(true);
      console.log('外部图片检测到，正在下载并重新上传:', imageUrl);

      // 下载图片
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`下载图片失败: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // 从URL中提取文件名，如果没有则使用默认名称
      const urlParts = imageUrl.split('/');
      let fileName = urlParts[urlParts.length - 1];
      
      // 如果文件名没有扩展名，根据blob类型添加
      if (!fileName.includes('.')) {
        const ext = blob.type.split('/')[1] || 'png';
        fileName = `landing-page-image.${ext}`;
      }
      
      // 创建File对象
      const file = new File([blob], fileName, { type: blob.type });

      // 上传到后端OSS
      const uploadedUrl = await uploadImage(file);
      console.log('图片重新上传成功:', uploadedUrl);

      return uploadedUrl;
    } catch (error) {
      console.error('下载并重新上传图片失败:', error);
      // 如果重新上传失败，仍然使用原URL，但提示用户
      alert('图片处理失败，可能会影响生成效果。建议重新上传图片。');
      return imageUrl;
    } finally {
      setIsProcessingImage(false);
    }
  }, []);

  // 处理图片URL，如果是外部URL则重新上传
  const processImageUrl = useCallback(async (imageUrl: string): Promise<string> => {
    if (isExternalUrl(imageUrl)) {
      console.log('检测到外部URL，正在处理...');
      return await downloadAndReuploadImage(imageUrl);
    } else {
      return imageUrl;
    }
  }, [isExternalUrl, downloadAndReuploadImage]);

  return {
    isProcessingImage,
    isExternalUrl,
    processImageUrl,
    downloadAndReuploadImage
  };
}