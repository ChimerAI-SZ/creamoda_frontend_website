export interface ImageResponse {
  code: number;
  data: ImageData;
  msg: string;
  [property: string]: any;
}

export interface ImageData {
  creator: Creator;
  description: string;
  genImgId: number;
  genType: string[];
  isCollected: number;
  isLiked: number;
  likeCount: number;
  materials: string[];
  originalImgUrl: string;
  prompt: string;
  trendStyles: string[];
  [property: string]: any;
}

export interface Creator {
  email: string;
  headPic: string;
  name: string;
  uid: string;
  [property: string]: any;
}
