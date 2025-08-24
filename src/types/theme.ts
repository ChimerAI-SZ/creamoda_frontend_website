export interface HeroMainConfig {
  title: string;
  subtitle: string;
  mainImage: string;
  uploadText: string;
  uploadSubText: string;
  demoImages: string[];
}

export interface FusionGuideConfig {
  title: string;
  cards: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface WhyChooseConfig {
  title: string;
  cards: {
    title: string;
    description: string;
  }[];
}

export interface OfferMoreConfig {
  title: string;
  cards: {
    image: string;
    title: string;
    description: string;
  }[];
}

export interface FAQConfig {
  items: {
    question: string;
    answer: string;
  }[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  heroMain: HeroMainConfig;
  fusionGuide: FusionGuideConfig;
  whyChoose: WhyChooseConfig;
  offerMore: OfferMoreConfig;
  faq?: FAQConfig;
}

export type ThemeId = 'background_remove' | 'background_change' | 'image_enhance' | 'color_change' | 'virtual_try' | 'outfit_generator' | 'sketch_convert' | 'partial_modify'; 