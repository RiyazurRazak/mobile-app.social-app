import * as React from 'react'
import {StyleSheet,} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/core';
import CommentPost from '../components/CommentsPost';
import CommentList from '../components/CommentList';
import {StoryScreenNavigationProp} from '../types'
import TextField from '../components/TextField';
import { FlatList } from 'react-native-gesture-handler';

interface props {
    navigation : StoryScreenNavigationProp
}


  

export default function Explore({navigation}: props){

    const route = useRoute<any>()

    const data = route["params"]["data"]
        

    return(

        <SafeAreaView style={styles.container}>
            
           <FlatList 
             style={{marginBottom: 60}}
             data={data.post_comments}
             renderItem={({item}) => <CommentList comment={item} navigation={navigation} />}
             keyExtractor={item => item.id.toString()}
             ListHeaderComponent ={
             <CommentPost 
                navigation={navigation}
                post={data.post_url}
                color={data.bg_color}
                avatar={data.posted_user.avatar}
                username={data.posted_user.username}
                />}
           />
           <TextField postId={data.id} />
            
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
   container : {
       backgroundColor : "#212121",
       flex : 1, 
   }
})