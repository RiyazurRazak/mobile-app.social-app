 import { CompositeNavigationProp } from '@react-navigation/native';
 import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
 import { StackNavigationProp } from '@react-navigation/stack';
 
 export type StoryScreenNavigationProp = CompositeNavigationProp<
   BottomTabNavigationProp<BottomTabParamList, 'Home'>,
   StackNavigationProp<RootStackParamList>
 >;
 

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  StoryModel : {index : number};
  CommentModel : {data : object};
  AddStoryModel : undefined;
  SinglePost : {post : object};
  ProfileModel : {userId : number};
};


export type BottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  NewPost: undefined;
  Profile: undefined;
  Web : undefined;
};

export type TabOneParamList = {
  FeedsScreen: undefined;
};

export type TabTwoParamList = {
  ExploreScreen: undefined;
};


export type TabThreeParamList = {
  AddScreen: undefined;
};

export type TabFourParamList = {
  ProfileScreen: undefined;
};

export type TabFiveParamList = {
  WebScreen: undefined;
};