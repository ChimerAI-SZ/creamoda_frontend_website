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
  resetFormData: () => void;
}

const initialFormData = {
  imageUrl: '',
  maskUrl: '',
  description: '',
  colorSelection: '',
  referenceImageUrl: '',
  fabricImageUrl: ''
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

  resetFormData: () =>
    set(state => ({
      ...state,
      formData: initialFormData
    }))
}));
