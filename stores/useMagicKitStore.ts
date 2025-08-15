import { create } from 'zustand';

export interface VariationFormState {
  // Shared form data for all variation types
  formData: {
    imageUrl: string;
    maskUrl: string; // Uploaded mask URL
    description: string;
    colorSelection: string;
    referenceImageUrl: string;
    fabricImageUrl: string;
    // Extend image padding values
    topPadding: number;
    rightPadding: number;
    bottomPadding: number;
    leftPadding: number;
  };
  // Current selected variation type
  currentVariationType: string;
}

interface VariationFormActions {
  setCurrentVariationType: (variationType: string) => void;
  updateImageUrl: (imageUrl: string) => void;
  updateMaskUrl: (maskUrl: string) => void;
  updateDescription: (description: string) => void;
  updateColorSelection: (colorSelection: string) => void;
  updateReferenceImageUrl: (imageUrl: string) => void;
  updateFabricImageUrl: (fabricImageUrl: string) => void;
  updatePadding: (padding: { top?: number; right?: number; bottom?: number; left?: number }) => void;
  resetFormData: () => void;
}

const initialFormData = {
  imageUrl: '',
  maskUrl: '',
  description: '',
  colorSelection: '',
  referenceImageUrl: '',
  fabricImageUrl: '',
  topPadding: 0,
  rightPadding: 0,
  bottomPadding: 0,
  leftPadding: 0
};

const initialState: VariationFormState = {
  formData: initialFormData,
  currentVariationType: ''
};

export const useVariationFormStore = create<VariationFormState & VariationFormActions>(set => ({
  ...initialState,

  setCurrentVariationType: (variationType: string) =>
    set(state => ({
      ...state,
      currentVariationType: variationType
    })),

  updateImageUrl: (imageUrl: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        imageUrl
      }
    })),

  updateMaskUrl: (maskUrl: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        maskUrl
      }
    })),

  updateDescription: (description: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        description
      }
    })),

  updateColorSelection: (colorSelection: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        colorSelection
      }
    })),

  updateReferenceImageUrl: (imageUrl: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        referenceImageUrl: imageUrl
      }
    })),

  updateFabricImageUrl: (fabricImageUrl: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        fabricImageUrl
      }
    })),

  updatePadding: (padding: { top?: number; right?: number; bottom?: number; left?: number }) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        topPadding: padding.top ?? state.formData.topPadding,
        rightPadding: padding.right ?? state.formData.rightPadding,
        bottomPadding: padding.bottom ?? state.formData.bottomPadding,
        leftPadding: padding.left ?? state.formData.leftPadding
      }
    })),

  resetFormData: () =>
    set(state => ({
      ...state,
      formData: initialFormData
    }))
}));
