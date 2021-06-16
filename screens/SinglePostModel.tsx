import * as React from 'react'
import {StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PostContainer from '../components/PostContainer'
import { StoryScreenNavigationProp } from '../types';
import { useRoute } from '@react-navigation/core';

interface props {
    navigation : StoryScreenNavigationProp
 }


export default function SinglePost({navigation} : props){


    const route = useRoute<any>()
    const post = route["params"]["post"]

  return(
     <SafeAreaView style={styles.container}>
          <PostContainer  data={post} navigation={navigation} />
     </SafeAreaView>
  )

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center'
    }

})