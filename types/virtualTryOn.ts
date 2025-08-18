export interface TryOnFormData {
  originalPicUrl: string; // 模特图片
  clothingPhoto: string; // 服饰图片
  clothType: 'tops' | 'bottoms' | 'one-pieces'; // 服饰类型
}

export interface ChangePoseFormData {
  originalPicUrl: string; // 模特图片
  referPicUrl: string; // 参考图片
}

export interface VirtualTryOnManualFormData {
  modelPicUrl: string; // 模特图片链接
  modelMaskUrl: string; // 模特遮罩链接
  garmentPicUrl: string; // 服装图片链接  
  garmentMaskUrl: string; // 服装遮罩链接
  modelMargin: number; // 模特边距
  garmentMargin: number; // 服装边距
  seed?: number; // 随机种子，可选
}
