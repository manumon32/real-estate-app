import {fetchDetailsAPI} from '@api/services';

// Types

export interface Detail {
  _id: string;
  location: GeoLocation;
  propertyTypeId: NamedEntity;
  listingTypeId: NamedEntity;
  priceUnitId: NamedEntity;
  areaUnitId: NamedEntity;
  carpetAreaUnitId: any;
  builtUpAreaUnitId: any;
  superBuiltAreaUnitId: any | null;
  furnishingStatusId: any;
  facingDirectionId: NamedEntity;
  ownershipTypeId: NamedEntity;
  availabilityStatusId: NamedEntity;
  amenityIds: Amenity[];
  featureIds: Feature[];
  imageUrls: string[];
  floorPlanUrl: string[];
  nearbyLandmarks: string[];
  chatEnabled: boolean;
  isNegotiable: boolean;
  isVerified: boolean;
  isBankVerified: boolean;
  isVerifiedContact: boolean;
  isFeatured: boolean;
  isEnabled: boolean;
  isDeleted: boolean;
  loanEligible: boolean;
  reraApproved: boolean;
  brokerageApplicable: boolean;
  customerId: any;
  title: string;
  description: string;
  propertyAge: number;
  contactName: string;
  contactNumber: string;
  alternateNumber: string;
  email: string;
  whatsappNumber: string;
  reraId: string;
  price: number;
  address: string;
  pincode: string;
  landmark: string;
  carParking: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfBalconies: number;
  locationMapUrl: string;
  videoUrl: string;
  virtualTourUrl: string;
  brokerageAmount: number | null;
  latitude: number | null;
  longitude: number | null;
  areaSize: number;
  carpetArea: number;
  builtUpArea: number;
  superBuiltUpArea: number;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

interface NamedEntity {
  isEnabled: boolean;
  isDeleted: boolean;
  _id: string;
  name: string;
  __v: number;
}

interface Amenity {
  isDeleted: boolean;
  isEnabled: boolean;
  _id: string;
  iconName: string;
  name: string;
  __v: number;
}

interface Feature {
  isDeleted?: boolean;
  isEnabled: boolean;
  _id: string;
  name: string;
  __v: number;
}

export interface DetailSlice {
  details: Detail | null;
  detailsBackUp: Detail | null;
  detailLoading: boolean;
  detailsError: string | null;
  fetchDetails: (id: string, apiConfig?: number) => Promise<void>;
  clearDetails: () => Promise<void>;
  setChatRoomId: (payload: any) => Promise<void>;
  chatRoomId: {};
}

export const createDetailSlice = (set: any, get: any): DetailSlice => ({
  details: null,
  detailsBackUp: null,
  detailLoading: false,
  detailsError: null,
  chatRoomId: {},
  clearDetails: async () => {
    set(() => ({
      details: null,
      detailLoading: false,
    }));
  },
  fetchDetails: async id => {
    set({detailLoading: true});
    try {
      const res = await fetchDetailsAPI(id, {
        token: get().token,
        clientId: get().clientId,
      });
      res &&
        set(() => ({
          details: res,
          detailsBackUp: res,
          detailLoading: false,
        }));
    } catch (err: any) {
      set({detailsError: err.message, detailLoading: false});
    }
  },
  setChatRoomId: async (payload: any) => {
    set((state: any) => ({
      chatRoomId: {
        ...state.chatRoomId,
        ...payload,
      },
    }));
  },
});
