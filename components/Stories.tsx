import * as React from 'react'
import {StyleSheet, Image, View} from 'react-native'
import { StoryScreenNavigationProp } from '../types';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler'
import {LinearGradient} from 'expo-linear-gradient'
import colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import {Text} from './Themed'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import { Tstore } from '../store';
import { baseUrl } from '../config';
import { setFollowingUsersStory, setUserStory } from '../redux/stories';


interface props {
    navigation : StoryScreenNavigationProp
 }
 


export default function Stories({navigation}:props){


    const colorScheme = useColorScheme()
    const dispatch = useDispatch()

    const {token, username, avatar} = useSelector((state : Tstore)=> state.tokenReducer)
    const {isAvailable,} = useSelector((state : Tstore)=> state.storiesReducer.userStory)
    const {followingUsersStory} = useSelector((state : Tstore)=> state.storiesReducer)
    const {isRefetchStories} = useSelector((state : Tstore)=> state.refresh)


    React.useEffect(()=>{
         ( async() => {
            await axios.get(`${baseUrl}/api/stories/get-user-story`, {
                headers : {
                    "Authorization" : `Token ${token}`
                }
            }).then((res)=>{
                if(res.status === 200)
                dispatch(setUserStory({isAvailable : res.data.isAvailable, story : res.data.result }))
                else{
                    console.warn("err")
                }
            })
         })()
    },[isRefetchStories])

    React.useEffect(()=>{
        (async ()=>{

            await axios.get(`${baseUrl}/api/stories/get-stories`, {
                headers : {
                    "Authorization" : `Token ${token}`
                }
            }).then((res)=>{
                if(res.status === 200)
                dispatch(setFollowingUsersStory({data : res.data.results}))
                else{
                    console.warn("err")
                }
            })
        })()
    },[isRefetchStories])

    const showModel = (index : number)=>{
        navigation.navigate("StoryModel", {index : index})
    }

    const addStory = (index : number)=>{
        if(!isAvailable){
            navigation.navigate("AddStoryModel")
        }else{
            navigation.navigate("StoryModel", {index : index})
        }
        
    }
    
    return(
        
        <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false}>

            <TouchableOpacity onPress={() => addStory(0)}>
            <View style={styles.avatarContainer}>
               
                   <View>
                     <Image 
                       style={[styles.userAvatar, styles.currentUser,  {borderColor : colors[colorScheme].background}]}
                       source={{uri : avatar ? avatar: ""}} 
                     />  
                     { !isAvailable && <View style={styles.badge}><Text style={{textAlign: "center", fontWeight: 'bold', color : "#000"}}>+</Text></View>}
                  </View>

                 <Text style={styles.username}>{ `${username?.slice(0,9)} ${String(username)?.length > 9 ? ".." : ''}`}</Text> 
            </View>
            </TouchableOpacity>
           
           {
               followingUsersStory.map((story, index)=>{
                   return(
                    <TouchableOpacity key={index} onPress={()=> showModel(index+1)}>
                      <View style={styles.avatarContainer}>
                          <LinearGradient  colors={['#2e78b7', "#00ff00", "#2378b3"]} style={styles.border} >
                             <Image 
                               style={[styles.userAvatar, {borderColor : colors[colorScheme].background}]}
                               source={{uri : story.avatar}} 
                             />
                           </LinearGradient>
                          <Text style={styles.username}>{ `${story.username.slice(0,9)} ${String(story.username).length > 9 ? ".." : ""}`}</Text>
                      </View>
                    </TouchableOpacity>
                   )
               })
           }

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container : {
      marginVertical : 10,
      color:  "#fff",
      marginLeft : 20,
    },
    avatarContainer : {
        padding: 2,
        marginEnd : 15,
    },
    border : {
       borderRadius: 100,
       padding: 2,
    },
    userAvatar : {
        height: 70,
        width: 70,
        borderRadius: 100,
        borderWidth : 4,
    },
    username : {
       textAlign: "center",
       width: 70,
       overflow: "hidden",
       fontSize: 12,
       marginTop: 5
    },
    currentUser : {
        position: "relative",
    },
    badge : {
        width: 20,
        height : 20,
        borderRadius: 50,
        backgroundColor : "#f8f9fa",
        position: "absolute",
        right: 3,
        bottom: 0,
    }
})