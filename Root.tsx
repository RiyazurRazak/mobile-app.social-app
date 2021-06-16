import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {useSelector} from 'react-redux'
import { Tstore } from './store';
import LoginPage from './screens/LoginPage';



export default function App() {


  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const {isTokenAvailable }  = useSelector((state : Tstore)=> state.tokenReducer)

  if (!isLoadingComplete) {
    return null;
  }
  else if (!isTokenAvailable) {
      return(
          <LoginPage />
      )
  }
  else {
    return (

        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
    );
  }
}
