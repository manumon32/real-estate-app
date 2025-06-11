export type ListingType = 'rent' | 'sale' | 'lease';

export interface Location {
  location?: {};
}

export interface LocationSlice {
  locationModalvisible: boolean;
  setlocationModalVisible: () => Promise<void>;
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
  locationModalvisible: false,
  locationHistory: [],
  setLocation: updates => {
    let serchers = [{...updates}, ...get().locationHistory];
    const result = uniqueObjects(serchers);
    set(() => ({
      location: updates,
      locationHistory: result,
    }));
  },
  setlocationModalVisible: () =>
    set((state: any) => ({
      locationModalvisible: !state.locationModalvisible,
    })),
  resetLocation: () => set({location: defaultLocation}),
});
