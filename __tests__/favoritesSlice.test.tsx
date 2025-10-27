import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchFavoritessAPI, UpdateFavouritesAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchFavoritessAPI: jest.fn(),
  UpdateFavouritesAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Favorites Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        favorites: [],
        favoritesLoading: false,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useBoundStore.getState();
    expect(state.favorites).toEqual([]);
    expect(state.favoritesLoading).toBe(false);
  });

  it('should add a favorite when not existing', async () => {
    const item = { _id: '1', name: 'Property 1' };
    (UpdateFavouritesAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    await act(async () => {
      await useBoundStore.getState().toggleFavorite(item);
    });

    const state = useBoundStore.getState();
    expect(state.favorites).toContainEqual(item);
    expect(UpdateFavouritesAPI).toHaveBeenCalledWith(
      { propertyId: '1', note: '' },
      expect.any(Object),
      'post',
    );
  });

  it('should remove a favorite when already existing', async () => {
    const item = { _id: '2', name: 'Property 2' };
    act(() => {
      useBoundStore.setState({ favorites: [item] });
    });

    (UpdateFavouritesAPI as jest.Mock).mockResolvedValueOnce({ success: true });

    await act(async () => {
      await useBoundStore.getState().toggleFavorite(item);
    });

    const state = useBoundStore.getState();
    expect(state.favorites).not.toContainEqual(item);
    expect(UpdateFavouritesAPI).toHaveBeenCalledWith(
      { propertyId: '2', note: '' },
      expect.any(Object),
      'delete',
    );
  });

  it('should rollback if API fails while adding', async () => {
    const item = { _id: '3', name: 'Rollback Add' };
    (UpdateFavouritesAPI as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    await act(async () => {
      await useBoundStore.getState().toggleFavorite(item);
    });

    const state = useBoundStore.getState();
    // It should rollback to empty because API failed
    expect(state.favorites).toEqual([]);
  });

  it('should rollback if API fails while removing', async () => {
    const item = { _id: '4', name: 'Rollback Remove' };
    act(() => {
      useBoundStore.setState({ favorites: [item] });
    });
    (UpdateFavouritesAPI as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    await act(async () => {
      await useBoundStore.getState().toggleFavorite(item);
    });

    const state = useBoundStore.getState();
    // It should rollback and keep the original favorite
    expect(state.favorites).toContainEqual(item);
  });

  it('should fetch favourite ads successfully', async () => {
    const mockRows = [{ _id: 'p1', name: 'Fav 1' }, { _id: 'p2', name: 'Fav 2' }];
    (fetchFavoritessAPI as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

    await act(async () => {
      await useBoundStore.getState().fetchFavouriteAds();
    });

    const state = useBoundStore.getState();
    expect(state.favorites).toEqual(mockRows);
    expect(state.favoritesLoading).toBe(false);
  });

  it('should handle fetch API failure gracefully', async () => {
    (fetchFavoritessAPI as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await act(async () => {
      await useBoundStore.getState().fetchFavouriteAds();
    });

    const state = useBoundStore.getState();
    // Should not crash or change favorites
    expect(state.favorites).toEqual([]);
  });

  it('should check if an item is favorite correctly', () => {
    act(() => {
      useBoundStore.setState({
        favorites: [{ _id: 'a1' }, { _id: 'a2' }],
      });
    });

    const isFav = useBoundStore.getState().isFavorite;
    expect(isFav('a1')).toBe(true);
    expect(isFav('x9')).toBe(false);
  });

  it('should reset favourites correctly', () => {
    act(() => {
      useBoundStore.setState({
        favorites: [{ _id: 'z1' }],
      });
      useBoundStore.getState().resetFavourites();
    });

    expect(useBoundStore.getState().favorites).toEqual([]);
  });
});
