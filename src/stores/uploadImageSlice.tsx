import {uploadImages} from '@api/services';

export interface UploadImagesSlice {
  imageUploadLoading: boolean;
  uploadError: boolean;
  imageUrls: [];
  uploadImages: (updates: Partial<any>) => void;
}

export const createUploadImagesSlice = (
  set: any,
  get: any,
): UploadImagesSlice => ({
  imageUploadLoading: false,
  imageUrls: [],
  uploadError: false,
  uploadImages: async payload => {
    set(() => ({
      imageUploadLoading: true,
      uploadError: false,
    }));
    try {
      const resp = await uploadImages(payload, {
        token: get().token,
        clientId: get().clientId,
      });
      if (resp.rows) {
        set({
          imageUrls: resp.rows,
          imageUploadLoading: false,
        });
      } else {
        set({uploadError: true, imageUploadLoading: false});
      }
    } catch (error) {
      set({uploadError: true});
    }
  },
});
