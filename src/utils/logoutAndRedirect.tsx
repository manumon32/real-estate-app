
import {navigate} from '@navigation/RootNavigation';
import { resetAllSlices } from '@stores/resetAllStores';

export const logoutAndRedirect = () => {
  resetAllSlices();
  navigate('Main'); // or your actual login route
};
