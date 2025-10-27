import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Location Slice', () => {
  const defaultLocation = {
    name: 'India',
    lat: 20.593684,
    lng: 78.96288,
    city: null,
    district: null,
    state: null,
    country: 'India',
    default: true,
  };

  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        location: defaultLocation,
        locationForAdpost: defaultLocation,
        locationModalvisible: false,
        globalModalvisible: false,
        locationHistory: [],
        adPostModal: false,
      });
    });
  });

  it('should toggle location modal visibility', () => {
    act(() => {
      useBoundStore.getState().setlocationModalVisible();
    });
    expect(useBoundStore.getState().locationModalvisible).toBe(true);

    act(() => {
      useBoundStore.getState().setlocationModalVisible();
    });
    expect(useBoundStore.getState().locationModalvisible).toBe(false);
  });

  it('should toggle global modal visibility', () => {
    act(() => {
      useBoundStore.getState().setGlobalModalVisible();
    });
    expect(useBoundStore.getState().globalModalvisible).toBe(true);

    act(() => {
      useBoundStore.getState().setGlobalModalVisible();
    });
    expect(useBoundStore.getState().globalModalvisible).toBe(false);
  });

  it('should set location and update history when adPostModal is false', () => {
    const newLocation = { name: 'Mumbai', lat: 19.07, lng: 72.87 };
    act(() => {
      useBoundStore.getState().setLocation(newLocation);
    });

    const state = useBoundStore.getState();
    expect(state.location).toEqual(newLocation);
    expect(state.locationHistory).toEqual([newLocation]);
    expect(state.adPostModal).toBe(false);
  });

  it('should set locationForAdpost when adPostModal is true', () => {
    act(() => {
      useBoundStore.getState().setadPostModal();
    });

    const newLocation = { name: 'Delhi', lat: 28.61, lng: 77.23 };
    act(() => {
      useBoundStore.getState().setLocation(newLocation);
    });

    const state = useBoundStore.getState();
    expect(state.locationForAdpost).toEqual(newLocation);
    expect(state.adPostModal).toBe(false);
  });

  it('should set locationForAdpost directly', () => {
    const newLocation = { name: 'Chennai', lat: 13.08, lng: 80.27 };
    act(() => {
      useBoundStore.getState().setLocatioForAdPost(newLocation);
    });

    expect(useBoundStore.getState().locationForAdpost).toEqual(newLocation);
    expect(useBoundStore.getState().adPostModal).toBe(false);
  });

  it('should reset location to default', () => {
    act(() => {
      useBoundStore.getState().setLocation({ name: 'Test' });
      useBoundStore.getState().resetLocation();
    });

    expect(useBoundStore.getState().location).toEqual(defaultLocation);
  });

  it('should reset location history', () => {
    act(() => {
      useBoundStore.getState().setLocation({ name: 'Test' });
      useBoundStore.getState().resetLocationHistory();
    });

    expect(useBoundStore.getState().locationHistory).toEqual([]);
  });

  it('should set adPostModal to true', () => {
    act(() => {
      useBoundStore.getState().setadPostModal();
    });
    expect(useBoundStore.getState().adPostModal).toBe(true);
  });
});
