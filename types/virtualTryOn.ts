export interface TryOnFormData {
  originalPicUrl: string; // 模特图片
  clothingPhoto: string; // 服饰图片
  clothType: 'tops' | 'bottoms' | 'one-pieces'; // 服饰类型
}

export interface ChangePoseFormData {
  originalPicUrl: string; // 模特图片
  referPicUrl: string; // 参考图片
}
