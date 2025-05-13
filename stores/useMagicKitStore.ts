import { create } from 'zustand';

export interface VariationFormState {
  // Map of variation type to form data
  variationData: {
    [variationType: string]: {
      image: File | null;
      imageUrl: string;
      imageUrlMask: string; // Mask for the main image
      description: string;
      colorSelection: string;
      referenceImage: File | null;
      referenceImageUrl: string;
      referenceImageUrlMask: string; // Mask for the reference image
    };
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
  resetFormData: (variationType: string) => void;
}

const initialState: VariationFormState = {
  variationData: {},
  currentVariationType: ''
};

// Helper to ensure variation type data is initialized
const ensureVariationTypeExists = (variationData: VariationFormState['variationData'], variationType: string): void => {
  if (!variationData[variationType]) {
    variationData[variationType] = {
      image: null,
      imageUrl: '',
      imageUrlMask: '',
      description: '',
      colorSelection: '',
      referenceImage: null,
      referenceImageUrl: '',
      referenceImageUrlMask: ''
    };
  }
};

export const useVariationFormStore = create<VariationFormState & VariationFormActions>(set => ({
  ...initialState,

  setCurrentVariationType: (variationType: string) =>
    set(state => {
      const newVariationData = { ...state.variationData };
      ensureVariationTypeExists(newVariationData, variationType);

      return {
        ...state,
        currentVariationType: variationType,
        variationData: newVariationData
      };
    }),

  updateImage: (image: File | null) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        image
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateImageUrl: (imageUrl: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        imageUrl
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateImageUrlMask: (imageUrlMask: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        imageUrlMask
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateDescription: (description: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        description
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateColorSelection: (colorSelection: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        colorSelection
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateReferenceImage: (image: File | null) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        referenceImage: image
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateReferenceImageUrl: (imageUrl: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        referenceImageUrl: imageUrl
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  updateReferenceImageUrlMask: (imageUrlMask: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        referenceImageUrlMask: imageUrlMask
      };

      return {
        ...state,
        variationData: newVariationData
      };
    }),

  resetFormData: (variationType: string) =>
    set(state => {
      const newVariationData = { ...state.variationData };

      newVariationData[variationType] = {
        image: null,
        imageUrl: '',
        imageUrlMask: '',
        description: '',
        colorSelection: '',
        referenceImage: null,
        referenceImageUrl: '',
        referenceImageUrlMask: ''
      };

      return {
        ...state,
        variationData: newVariationData
      };
    })
}));
