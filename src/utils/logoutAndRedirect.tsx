
import {navigate} from '@navigation/RootNavigation';
import { resetAllZustandStores } from '@stores/resetAllStores';

export const logoutAndRedirect = () => {
  resetAllZustandStores();
  navigate('Main'); // or your actual login route
};
