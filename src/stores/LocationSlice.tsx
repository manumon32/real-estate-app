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
  resetLocationHistory: () => Promise<void>;
  locationForAdpost: any;
  location: any;
  locationHistory: [];
  setLocation: (updates: Partial<any>) => void;
  setLocatioForAdPost: (updates: Partial<any>) => void;
  resetLocation: () => void;
}

const defaultLocation: any = {
  name: 'India',
  lat: 20.593684,
  lng: 78.96288,
  city: null,
  district: null,
  state: null,
  country: 'India',
  default:true,
};
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
    if (!get().adPostModal) {
      let serchers = [{...updates}, ...get().locationHistory];
      const result = uniqueObjects(serchers);
      set(() => ({
        location: updates,
        locationHistory: result,
        adPostModal: false,
      }));
    } else {
      set(() => ({
        locationForAdpost: updates,
        adPostModal: false,
      }));
    }
  },
  setLocatioForAdPost: updates => {
    set(() => ({
      locationForAdpost: updates,
      adPostModal: false,
    }));
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
  resetLocationHistory: () => set({locationHistory: []}),
  setadPostModal: () => set({adPostModal: true}),
});
