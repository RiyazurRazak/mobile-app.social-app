import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import {useDispatch} from 'react-redux'
import {setToken} from '../redux/auth-token'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  const dispatch = useDispatch()

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });

        const authCredential = await SecureStore.getItemAsync("authUser")
        if (authCredential){
          const data = JSON.parse(authCredential)
          dispatch(setToken({isTokenAvailable : true, token : data.token, username  : data.username, avatar : data.avatar, id : data.id}))
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
