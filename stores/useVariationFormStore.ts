import { create } from 'zustand';

export interface VariationFormState {
  // Map of variation type to form data
  variationData: {
    [variationType: string]: {
      image: File | null;
      imageUrl: string;
      description: string;
      referLevel: number;
      referenceImage: File | null;
      referenceImageUrl: string;
      fabricPicUrl: string;
      maskPicUrl: string;
    };
  };
  // Current selected variation type
  currentVariationType: string;
}

interface VariationFormActions {
  setCurrentVariationType: (variationType: string) => void;
  updateImage: (image: File | null) => void;
  updateImageUrl: (imageUrl: string) => void;
  updateDescription: (description: string) => void;
  updateReferLevel: (referLevel: number) => void;
  updateReferenceImage: (image: File | null) => void;
  updateReferenceImageUrl: (imageUrl: string) => void;
  updateFabricPicUrl: (fabricPicUrl: string) => void;
  updateMaskPicUrl: (maskPicUrl: string) => void;
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
      description: '',
      referLevel: 2,
      referenceImage: null,
      referenceImageUrl: '',
      fabricPicUrl: '',
      maskPicUrl: ''
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

  updateReferLevel: (referLevel: number) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        referLevel
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

  updateFabricPicUrl: (fabricPicUrl: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        fabricPicUrl: fabricPicUrl
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

  updateMaskPicUrl: (maskPicUrl: string) =>
    set(state => {
      const { currentVariationType, variationData } = state;
      if (!currentVariationType) return state;

      const newVariationData = { ...variationData };
      ensureVariationTypeExists(newVariationData, currentVariationType);

      newVariationData[currentVariationType] = {
        ...newVariationData[currentVariationType],
        maskPicUrl: maskPicUrl
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
        description: '',
        referLevel: 2,
        referenceImage: null,
        referenceImageUrl: '',
        fabricPicUrl: '',
        maskPicUrl: ''
      };

      return {
        ...state,
        variationData: newVariationData
      };
    })
}));
