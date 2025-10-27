import {act} from 'react-test-renderer';
import {cleanup} from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import {fetchAppointMentsAPI, saveAppointMent} from '@api/services';

jest.mock('@api/services', () => ({
  fetchAppointMentsAPI: jest.fn(),
  saveAppointMent: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Appointments Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        appointments: {myAppointments: [], requestedAppointments: []},
        appointmentsLoading: false,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useBoundStore.getState();
    expect(state.appointments).toEqual({
      myAppointments: [],
      requestedAppointments: [],
    });
    expect(state.appointmentsLoading).toBe(false);
  });

  it('should fetch appointments successfully', async () => {
    const mockResponse = {
      myAppointments: [{_id: '1', status: 'confirmed'}],
      requestedAppointments: [{_id: '2', status: 'pending'}],
    };
    (fetchAppointMentsAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useBoundStore.getState().fetchAppointments();
    });

    const state = useBoundStore.getState();
    expect(state.appointments.myAppointments).toHaveLength(1);
    expect(state.appointments.requestedAppointments).toHaveLength(1);
    expect(state.appointmentsLoading).toBe(false);
    expect(fetchAppointMentsAPI).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch appointments API failure gracefully', async () => {
    (fetchAppointMentsAPI as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    await act(async () => {
      await useBoundStore.getState().fetchAppointments();
    });

    const state = useBoundStore.getState();
    expect(state.appointmentsLoading).toBe(false);
    expect(state.appointments).toEqual({
      myAppointments: [],
      requestedAppointments: [],
    });
  });

  it('should update appointments successfully', async () => {
    const payload = {_id: '1', status: 'updated'};
    (saveAppointMent as jest.Mock).mockResolvedValueOnce({success: true});
    (fetchAppointMentsAPI as jest.Mock).mockResolvedValueOnce({
      myAppointments: [payload],
      requestedAppointments: [],
    });

    await act(async () => {
      await useBoundStore.getState().updateAppointments(payload);
    });

    const state = useBoundStore.getState();
    expect(saveAppointMent).toHaveBeenCalledTimes(1);
    expect(state.appointmentsLoading).toBe(false);
  });

  it('should handle updateAppointments API failure gracefully', async () => {
    const payload = {_id: '1', status: 'fail'};
    (saveAppointMent as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    await act(async () => {
      await useBoundStore.getState().updateAppointments(payload);
    });

    const state = useBoundStore.getState();
    expect(state.appointmentsLoading).toBe(false);
  });

  it('should reset appointments correctly', () => {
    act(() => {
      useBoundStore.setState({
        appointments: {
          // @ts-ignore
          myAppointments: [{_id: '1'}],
          // @ts-ignore
          requestedAppointments: [{_id: '2'}],
        },
      });
      useBoundStore.getState().resetAppointments();
    });

    const state = useBoundStore.getState();
    expect(state.appointments).toEqual({
      myAppointments: [],
      requestedAppointments: [],
    });
  });
});
