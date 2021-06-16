import { useRoute } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, Image, View , Text,} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import window from '../constants/Layout'
import { StoryScreenNavigationProp } from '../types';
import {useSelector} from 'react-redux'
import { Tstore } from '../store';



interface props {
  navigation : StoryScreenNavigationProp
}



export default function StoryModel({navigation}: props ) {
  

  const route = useRoute<any>()
  const [progress, setProgress] = React.useState<number>(0)
  let scrollAxis = 0;
  let count = 1;
  const [isScrollEnabled, setIsScrollEnabled] = React.useState(true)
  const scrollViewRef = React.useRef<ScrollView>(null)
  const {isAvailable, story} = useSelector((state : Tstore)=> state.storiesReducer.userStory)
  const {followingUsersStory} = useSelector((state : Tstore)=> state.storiesReducer)

  React.useEffect(()=>{
     
     if(scrollViewRef && scrollViewRef.current){
       scrollViewRef.current.scrollTo({x:window.window.width * route['params']['index'] ,y:0})
     }
      const intreval = setInterval(progressHandller,1000)

      return ()=>{
         clearInterval(intreval)
      }

  },[route])

  const updateAxisHandller = (event : any)=>{
    if(event.nativeEvent.layoutMeasurement.width + event.nativeEvent.contentOffset.x >= event.nativeEvent.contentSize.width){
      setIsScrollEnabled(false)
        setTimeout(()=>{
          navigation.goBack()
        },10000)
    }else{
      scrollAxis = event.nativeEvent.contentOffset.x
      setProgress(0)
      count = 0;
    }
  }


  const progressHandller = ()=>{
    if( count <= 10){
      setProgress((prev)=> Math.round(prev+10))
      count++;
    }else{
       scrollAxis += window.window.width
       setProgress(0);
       scrollViewRef.current?.scrollTo({x: scrollAxis , y:0, animated: true})
       
       count = 0;
    }
  }

  return (
    <ScrollView 
      style={styles.scrollView} 
      horizontal 
      pagingEnabled 
      ref={scrollViewRef} 
      onScroll={event => updateAxisHandller(event)} 
      scrollEnabled={isScrollEnabled}
      showsHorizontalScrollIndicator={false}
      >
    
      {
        isAvailable 

        &&

        <SafeAreaView style={styles.container} key={story?.id}>
          <Image 
            source={{uri: story?.story_url}}
            style={styles.story} 
          />
          <View style={styles.detailsContainer}>
             <View style={styles.progreeContainer}>
                <View style={{...styles.progress, width: `${progress.toString()}%`}}></View>
             </View>
             <View style={styles.userDetails}>
                <Image 
                  source={{uri: story?.avatar}}
                  style={styles.avatar}
                />
                <Text style={styles.username}>{story?.username}</Text>
             </View>
          </View>
       </SafeAreaView>

      }

      {
         followingUsersStory.map((story, index)=> {
              return (
                   
                <SafeAreaView style={styles.container} key={story.id}>
                <Image 
                  source={{uri: story.story_url}}
                  style={styles.story} 
                />
                <View style={styles.detailsContainer}>
                   <View style={styles.progreeContainer}>
                      <View style={{...styles.progress, width: `${progress.toString()}%`}}></View>
                   </View>
                   <View style={styles.userDetails}>
                      <Image 
                        source={{uri: story.avatar}}
                        style={styles.avatar}
                      />
                      <Text style={styles.username}>{story.username}</Text>
                   </View>
                </View>
             </SafeAreaView>
              )
         })
      }
    
     </ScrollView>
  );
}

const styles = StyleSheet.create({
   container : {
       width: window.window.width,
       height: window.window.height,
       position: "relative",
   },
   scrollView : {
     flex: 1,
   },
   story : {
    width: window.window.width,
    height: window.window.height,
     resizeMode : "cover",
   },
   detailsContainer : {
       position: "absolute",
       top: 50,
       left: 20,
       right: 20,
   },
   userDetails : {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
   },
   progreeContainer : {
      marginBottom : 15,
      backgroundColor : "#808080",
      height: 3,
      position: 'relative',
   },
   progress : {
     position: "relative",
     height: 3,
     backgroundColor : "#fff",
     borderRadius : 100,
   },
   avatar : {
       width: 40,
       height: 40,
       borderRadius: 100,
       marginEnd: 15,
   },
   username : {
     fontWeight : 'bold',
     color: "#fff",
   }
});
