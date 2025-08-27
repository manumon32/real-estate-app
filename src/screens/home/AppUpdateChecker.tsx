import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import VersionCheck from 'react-native-version-check';

const AppUpdateChecker = () => {
  useEffect(() => {
    (async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = VersionCheck.getCurrentVersion();
        const needUpdate = await VersionCheck.needUpdate();

        if (needUpdate?.isNeeded) {
          Alert.alert(
            'Update Available',
            `A new version (${latestVersion}) is available. Please update from ${currentVersion}.`,
            [
              { text: 'Update', onPress: () => Linking.openURL(needUpdate.storeUrl) },
              { text: 'Later', style: 'cancel' },
            ]
          );
        }
      } catch (e) {
        console.log('Update check failed', e);
      }
    })();
  }, []);

  return null; // this just checks in background
};

export default AppUpdateChecker;
