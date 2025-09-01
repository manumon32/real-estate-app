import {fetchAppointMentsAPI, saveAppointMent} from '@api/services';

interface Appointments {
  myAppointments: [];
  requestedAppointments: [];
}

export interface AppointmentsSlice {
  appointmentsLoading: Boolean;
  appointments: Appointments;
  fetchAppointments: () => void;
  resetAppointments: () => void;
  updateAppointments: (payload: any) => void;
}

export const createAppointmentsSlice = (
  set: any,
  get: any,
): AppointmentsSlice => ({
  appointments: {myAppointments: [], requestedAppointments: []},
  appointmentsLoading: false,
  fetchAppointments: async () => {
    set({appointmentsLoading: true});
    try {
      const res = await fetchAppointMentsAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      console.log(res);
      res &&
        set(() => ({
          appointments: res,
          appointmentsLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({appointmentsLoading: false});
    }
  },
  updateAppointments: async (payload: any) => {
    set({appointmentsLoading: true});
    try {
      const res = await saveAppointMent(
        payload,
        {
          token: get().token,
          clientId: get().clientId,
          bearerToken: get().bearerToken,
        },
        'put',
      );
      res &&
        set(() => ({
          appointmentsLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({appointmentsLoading: false});
    }
  },
  resetAppointments: () => set({appointments: []}),
});
