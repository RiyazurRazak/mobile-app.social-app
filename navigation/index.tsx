/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import StoryModel from '../screens/StoryModel';
import CommentModel from '../screens/CommentModel'
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import AddStoryModel from '../screens/AddStoryModel';
import SinglePost from '../screens/SinglePostModel';
import ProfileMode from '../screens/ProfileMode';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {


 
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}


const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled:false, detachPreviousScreen : false,}}>
      <Stack.Screen name="Root" component={BottomTabNavigator}  />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!'}} />
      <Stack.Screen name="StoryModel" component={StoryModel} />
      <Stack.Screen name="CommentModel" component={CommentModel} />
      <Stack.Screen name="AddStoryModel" component={AddStoryModel} />
      <Stack.Screen name="ProfileModel" component={ProfileMode} />
      <Stack.Screen name="SinglePost" component={SinglePost} />
    </Stack.Navigator>
  );
}
