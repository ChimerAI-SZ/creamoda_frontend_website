import { create } from 'zustand';

export interface VariationFormState {
  // Shared form data for all variation types (no longer separated by type)
  formData: {
    image: File | null;
    imageUrl: string;
    imageUrlMask: string; // Mask for the main image
    description: string;
    colorSelection: string;
    referenceImage: File | null;
    referenceImageUrl: string;
    referenceImageUrlMask: string; // Mask for the reference image
  };
  // Current selected variation type
  currentVariationType: string;
}

interface VariationFormActions {
  setCurrentVariationType: (variationType: string) => void;
  updateImage: (image: File | null) => void;
  updateImageUrl: (imageUrl: string) => void;
  updateImageUrlMask: (maskImageUrl: string) => void;
  updateDescription: (description: string) => void;
  updateColorSelection: (colorSelection: string) => void;
  updateReferenceImage: (image: File | null) => void;
  updateReferenceImageUrl: (imageUrl: string) => void;
  updateReferenceImageUrlMask: (maskImageUrl: string) => void;
  resetFormData: () => void;
}

const initialFormData = {
  image: null,
  imageUrl: '',
  imageUrlMask: '',
  description: '',
  colorSelection: '',
  referenceImage: null,
  referenceImageUrl: '',
  referenceImageUrlMask: ''
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

  updateImage: (image: File | null) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        image
      }
    })),

  updateImageUrl: (imageUrl: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        imageUrl
      }
    })),

  updateImageUrlMask: (imageUrlMask: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        imageUrlMask
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

  updateReferenceImage: (image: File | null) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        referenceImage: image
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

  updateReferenceImageUrlMask: (imageUrlMask: string) =>
    set(state => ({
      ...state,
      formData: {
        ...state.formData,
        referenceImageUrlMask: imageUrlMask
      }
    })),

  resetFormData: () =>
    set(state => ({
      ...state,
      formData: initialFormData
    }))
}));
