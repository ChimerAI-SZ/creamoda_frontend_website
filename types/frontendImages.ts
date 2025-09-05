// 前端图片列表相关的类型定义

export interface FrontendImageItem {
  id: number;
  record_id: string;
  slug: string;
  image_url: string;
  clothing_description: string;
  complete_prompt: string;
  type: string;
  gender: string;
  feature: string;
  create_time: string;
}

// 相似图片项（包含相似度分数）
export interface SimilarImageItem extends FrontendImageItem {
  similarity_score: number;
}

// 图片详情项（包含相似图片列表）
export interface FrontendImageDetailItem extends FrontendImageItem {
  choose_img?: string;
  update_time?: string;
  similar_images: SimilarImageItem[];
}

export interface FrontendImagesResponse {
  code: number;
  msg: string;
  data: {
    total: number;
    page: number;
    page_size: number;
    has_more: boolean;
    list: FrontendImageItem[];
  };
}

export interface FrontendImagesParams {
  page: number;
  page_size: number;
  type?: string;
  gender?: string;
}

export interface FrontendImageDetailResponse {
  code: number;
  msg: string;
  data: FrontendImageDetailItem;
}
