import { create } from 'zustand';

export interface BasicOptionItem {
  code: string;
  name: string;
  [key: string]: any;
}

// 统一的 VariationType 类型
export interface UnifiedVariationType {
  type: number; // 节点类型 1 文生图 2 图生图 3 虚拟试穿 4 magic kit
  variationType: number; // 节点下的类型
  name: string; // 类型名称
  tags?: string; // 关键词
  label: string; // 类型名称
  available: boolean; // 是否可用
}

// 统一的 variationTypes 列表
export const unifiedVariationTypes: UnifiedVariationType[] = [
  {
    type: 1,
    variationType: 0,
    label: 'Text to Image',
    name: '文本生成图像',
    tags: 'design,text to image',
    available: true
  },
  {
    type: 2,
    variationType: 11,
    label: 'Vary style',
    name: '迁移风格',
    tags: 'design, image to image, Vary style',
    available: true
  },
  {
    type: 2,
    variationType: 2,
    label: 'Change clothes',
    name: '衣服换装',
    tags: 'design, image to image, change clothes',
    available: true
  },
  {
    type: 2,
    variationType: 3,
    label: 'Fabric to Design',
    name: '面料转设计',
    tags: 'design, fabric to design',
    available: true
  },
  {
    type: 2,
    variationType: 4,
    label: 'Sketch to Design',
    name: '手绘转设计',
    tags: 'design, hand drawing to design',
    available: true
  },
  {
    type: 2,
    variationType: 5,
    label: 'Mix 2 Images',
    name: '图片混搭',
    tags: 'design, image to image, mix image',
    available: true
  },
  {
    type: 2,
    variationType: 7,
    label: 'Change Pattern',
    name: '改变版型',
    tags: 'design, image to image, change pattern',
    available: true
  },
  {
    type: 2,
    variationType: 8,
    label: 'Change Fabric',
    name: '面料替换',
    tags: 'design, image to image, change fabric',
    available: true
  },
  {
    type: 2,
    variationType: 9,
    label: 'Change Printing',
    name: '改变印花',
    tags: 'design, image to image, change printing',
    available: true
  },
  {
    type: 2,
    variationType: 10,
    label: 'Style Fusion',
    name: '风格融合',
    tags: 'design, image to image, style fusion',
    available: true
  },

  {
    type: 3,
    variationType: 1,
    label: 'Virtual Try On',
    name: '虚拟试穿',
    tags: 'design, virtual try on',
    available: true
  },
  {
    type: 3,
    variationType: 2,
    label: 'Change Model Pose',
    name: '模特换姿势',
    tags: 'design, virtual try on, change pose',
    available: true
  },
  {
    type: 3,
    variationType: 3,
    label: 'Virtual Try-on (Manual)',
    name: '虚拟试穿（手动）',
    tags: 'design, virtual try on, manual',
    available: true
  },

  {
    type: 4,
    variationType: 1,
    label: 'Change Color',
    name: '改变颜色',
    tags: 'design, magic kit, change color',
    available: true
  },
  {
    type: 4,
    variationType: 2,
    label: 'Change Background',
    name: '背景替换',
    tags: 'design, magic kit, change background',
    available: true
  },
  {
    type: 4,
    variationType: 3,
    label: 'Remove Background',
    name: '背景去除',
    tags: 'design, magic kit, remove background',
    available: true
  },
  {
    type: 4,
    variationType: 4,
    label: 'Partial Modification',
    name: '局部修改',
    tags: 'design, magic kit, partial modification',
    available: true
  },
  {
    type: 4,
    variationType: 5,
    label: 'Upscale',
    name: '超分辨率',
    tags: 'design, magic kit, upscale',
    available: true
  },
  {
    type: 4,
    variationType: 6,
    label: 'Pattern Extraction',
    name: '印花提取',
    tags: 'design, magic kit, pattern extraction',
    available: true
  },
  {
    type: 4,
    variationType: 7,
    label: 'Pattern Application',
    name: '印花上身',
    tags: 'design, magic kit, pattern application',
    available: true
  },
  {
    type: 4,
    variationType: 9,
    label: 'Extend image',
    name: '扩展图像',
    tags: 'design, magic kit, extend image',
    available: true
  }
  // {
  //   type: 4,
  //   variationType: 8,
  //   label: 'Pattern Placement',
  //   name: '印花摆放',
  //   tags: 'design, magic kit, pattern placement',
  //   available: true
  // }
];

interface ModelState {
  modelSizes: BasicOptionItem[];
  setModelSizes: (sizes: BasicOptionItem[]) => void;
  // 新增：获取所有variationTypes
  getUnifiedVariationTypes: () => UnifiedVariationType[];
  // 新增：根据type获取variationTypes
  getVariationTypesByType: (type: number) => UnifiedVariationType[];
}

export const useModelStore = create<ModelState>(set => ({
  modelSizes: [],
  setModelSizes: sizes => set({ modelSizes: sizes }),
  getUnifiedVariationTypes: () => unifiedVariationTypes,
  getVariationTypesByType: (type: number) => unifiedVariationTypes.filter(item => item.type === type)
}));

// 导出 store
export default useModelStore;
