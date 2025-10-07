import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name as never, params as never);
  }
}

export function navigateandReset() {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.reset({
      index: 0,
      routes: [
        {
          // @ts-ignore
          name: 'Main',
          state: {
            index: 0, // 'MyAds' is the 4th tab (0-based index)
            routes: [
              {name: 'Home'},
              {name: 'Chat'},
              {name: 'AddPost'},
              {name: 'MyAds'},
              {name: 'filter'},
            ],
          },
        },
      ],
    });
  }
}

export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return null;
}
