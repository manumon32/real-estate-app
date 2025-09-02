export type ListingType = 'rent' | 'sale' | 'lease';

export interface Location {
  location?: {};
}

export interface LocationSlice {
  locationModalvisible: boolean;
  globalModalvisible: boolean;
  setGlobalModalVisible: () => Promise<void>;
  adPostModal: boolean;
  setlocationModalVisible: () => Promise<void>;
  setadPostModal: () => Promise<void>;
  locationForAdpost: any;
  location: any;
  locationHistory: [];
  setLocation: (updates: Partial<any>) => void;
  resetLocation: () => void;
}

const defaultLocation: any = {};
const getKey = (obj: any) => JSON.stringify(obj);

const uniqueObjects = (arr: any[]) => {
  const seen = new Set();
  return arr.filter(obj => {
    const key = getKey(obj);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const createLocationSlice = (set: any, get: any): LocationSlice => ({
  location: defaultLocation,
  locationForAdpost: defaultLocation,
  locationModalvisible: false,
  globalModalvisible: false,
  locationHistory: [],
  adPostModal: false,
  setLocation: updates => {
    console.log('adPostModal', get().adPostModal);
    if (!get().adPostModal) {
      let serchers = [{...updates}, ...get().locationHistory];
      const result = uniqueObjects(serchers);
      set(() => ({
        location: updates,
        locationHistory: result,
        adPostModal: false,
      }));
    }else{
      set(() => ({
        locationForAdpost: updates,
        adPostModal: false,
      }));
    }
  },
  setlocationModalVisible: () =>
    set((state: any) => ({
      locationModalvisible: !state.locationModalvisible,
    })),
  setGlobalModalVisible: () =>
    set((state: any) => ({
      globalModalvisible: !state.globalModalvisible,
    })),
  resetLocation: () => set({location: defaultLocation}),
  setadPostModal: () => set({adPostModal: true}),
});
