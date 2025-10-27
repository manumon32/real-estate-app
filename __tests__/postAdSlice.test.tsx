import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { postAdAPI } from '@api/services';

jest.mock('@api/services', () => ({
  postAdAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('PostAd Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.getState().resetPostAd(); // reset before each test
      useBoundStore.setState({
        images: [],
        floorPlans: [],
        loadingStates: {},
        loadingStatesfloor: {},
        postAdloading: false,
        postAdError: false,
        imageUploadLoading: false,
        imageSelectLoading: false,
        isProcessingImages: false,
        isProcessingFloorPlan: false,
        isUploadingImages: false,
        isUploadingFloorPlans: false,
      });
    });
  });

  it('should set post ad data', () => {
    act(() => {
      useBoundStore.getState().setPostAd({ title: 'New Property' });
    });
    expect(useBoundStore.getState().postAd).toEqual(
      expect.objectContaining({ title: 'New Property' }),
    );
  });

  it('should set and get images correctly', () => {
    const mockImages = [{ id: '1', uri: 'img1.jpg' }];
    act(() => {
      useBoundStore.getState().setImages(mockImages);
    });
    expect(useBoundStore.getState().images).toEqual(mockImages);
  });

  it('should set and get floor plans correctly', () => {
    const mockPlans = [{ id: 'floor1', uri: 'plan1.jpg' }];
    act(() => {
      useBoundStore.getState().setFloorPlans(mockPlans);
    });
    expect(useBoundStore.getState().floorPlans).toEqual(mockPlans);
  });

  it('should update image upload status', () => {
    act(() => {
      useBoundStore.setState({
        images: [{ id: '1', status: 'pending' }],
      });
      useBoundStore.getState().updateImageStatus('1', 'uploaded', 'url.jpg');
    });

    expect(useBoundStore.getState().images[0]).toEqual(
      expect.objectContaining({ status: 'uploaded', uploadedUrl: 'url.jpg' }),
    );
  });

  it('should update floor plan upload status', () => {
    act(() => {
      useBoundStore.setState({
        floorPlans: [{ id: 'f1', status: 'pending' }],
      });
      useBoundStore.getState().updateFloorPlanStatus('f1', 'done', 'plan.jpg');
    });

    expect(useBoundStore.getState().floorPlans[0]).toEqual(
      expect.objectContaining({ status: 'done', uploadedUrl: 'plan.jpg' }),
    );
  });

  it('should handle loading state updates correctly', () => {
    act(() => {
      useBoundStore.getState().setLoadingState('123', true);
    });
    expect(useBoundStore.getState().loadingStates['123']).toBe(true);

    act(() => {
      useBoundStore.getState().removeLoadingState('123');
    });
    expect(useBoundStore.getState().loadingStates['123']).toBeUndefined();
  });

  it('should clear all loading states', () => {
    act(() => {
      useBoundStore.setState({ loadingStates: { a: true, b: true } });
      useBoundStore.getState().clearAllLoadingStates();
    });
    expect(useBoundStore.getState().loadingStates).toEqual({});
  });

  it('should toggle upload & processing flags correctly', () => {
    act(() => {
      useBoundStore.getState().setIsProcessingImages(true);
      useBoundStore.getState().setIsUploadingImages(true);
      useBoundStore.getState().setIsProcessingFloorPlan(true);
      useBoundStore.getState().setIsUploadingFloorPlans(true);
    });

    const state = useBoundStore.getState();
    expect(state.isProcessingImages).toBe(true);
    expect(state.isUploadingImages).toBe(true);
    expect(state.isProcessingFloorPlan).toBe(true);
    expect(state.isUploadingFloorPlans).toBe(true);
  });

  it('should submit post ad successfully', async () => {
    (postAdAPI as jest.Mock).mockResolvedValueOnce({ rows: ['img1', 'img2'] });

    await act(async () => {
      await useBoundStore
        .getState()
        .submitPostAd({ title: 'My Ad', price: 1000 });
    });

    expect(postAdAPI).toHaveBeenCalled();
    expect(useBoundStore.getState().postAdloading).toBe(false);
    expect(useBoundStore.getState().postAdError).toBe(false);
  });

  it('should handle post ad submission failure', async () => {
    (postAdAPI as jest.Mock).mockResolvedValueOnce({}); // no rows returned

    await act(async () => {
      await useBoundStore
        .getState()
        .submitPostAd({ title: 'Failing Ad', price: 500 });
    });

    expect(useBoundStore.getState().postAdError).toBe(true);
    expect(useBoundStore.getState().postAdloading).toBe(false);
  });

  it('should handle post ad API rejection', async () => {
    (postAdAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore
        .getState()
        .submitPostAd({ title: 'Error Ad', price: 200 });
    });

    expect(useBoundStore.getState().postAdError).toBe(true);
  });

  it('should reset post ad to default', () => {
    act(() => {
      useBoundStore.getState().setPostAd({ title: 'Reset this' });
      useBoundStore.getState().resetPostAd();
    });

    expect(useBoundStore.getState().postAd).toEqual({});
  });
});
