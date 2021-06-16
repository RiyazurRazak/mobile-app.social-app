import axios from 'axios'
import * as React from 'react'
import {Button, Image, StyleSheet, View} from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../components/Header'
import {Text} from '../components/Themed'
import { baseUrl } from '../config'
import window from '../constants/Layout'
import { Tstore } from '../store'
import { StoryScreenNavigationProp } from '../types';
import {Ionicons} from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store';
import { setToken } from '../redux/auth-token'


interface props {
    navigation : StoryScreenNavigationProp
    userId : number
 }


export default function ProfileScreen({navigation, userId} : props){


    const dispatch = useDispatch()
    const {token, id} = useSelector((state : Tstore)=> state.tokenReducer)
    const [data, setData] = React.useState<any>({})
    const [isFollowing, setIsFollowing] = React.useState<boolean>(false)


    const renderPost = React.useCallback((navigation : any, item : any)=>{

      
        return(
            <TouchableOpacity style={{margin : 2}} onPress={() => navigation.navigate("SinglePost", {post: item})}>
                 <Image 
                   source={{uri: item.post_url}}
                   style={styles.post}
               />
            </TouchableOpacity>
           
        )
    },[data])

   
    React.useEffect(()=>{
        fetchProfileData()
    },[])


    const fetchProfileData = async()=>{
        await axios.get(`${baseUrl}/api/account/profile?id=${userId === undefined ? id : userId}`, {
            headers : {
                "Authorization" : `Token ${token}`
            }
        }).then((res)=>{
            if(res.status === 200){
               setData(res.data)
            }
        })
    }

    React.useEffect(()=>{
        data.followers && data.followers.some((user : any)=>{
            if(user.user_data.id === id){
                setIsFollowing(true)
            }
        })
    },[data])


    const addFollowHandller = async()=>{
        const body = {
            "following_id" : userId
        }
        await axios.post(`${baseUrl}/api/account/add-following`, body, {
            headers : {
               "Authorization" : `Token ${token}`
            }
        }).then((res)=>{
            if(res.status === 201){
               fetchProfileData()
            }
        })
    }

    const logoutHandller = async()=>{
        await SecureStore.deleteItemAsync("authUser")
        dispatch(setToken({isTokenAvailable : false, token : null, username  : null, avatar : null, id : null}))
    }
    

    return (
        <SafeAreaView style={styles.rootContainer}>
              <Header title={data.username} />
            <View style={{margin : 20,}}>
              <View style={styles.detailsContainer}>
                   <Image
                       source={{uri: data.avatar}}
                       style={styles.avatar}
                   />
                   <View style={styles.userDetails}>
                       <View style={styles.count}>
                          <Text style={styles.boldText}>Followers</Text>
                          <Text style={styles.boldCount}>{ data.followers ? data.followers.length : "0"}</Text>
                       </View>
                       <View style={styles.count}>
                          <Text style={styles.boldText}>Following</Text>
                          <Text style={styles.boldCount}>{data.following ? data.following.length : "0"}</Text>
                       </View>
                   </View>
                   </View>  
                  { userId && <Button title={isFollowing ? "Following" : "Follow"} onPress={isFollowing ?()=> null : addFollowHandller} /> }
              </View>
              <View style={styles.aboutContainer}>
                   <Text style={styles.fullname}>{data.fullname}</Text>
                   <Text>Total Posts : {data.posts ? data.posts.length : 0}</Text>
                   {userId === undefined &&  <View style={{paddingVertical: 15}}>
                      <Ionicons.Button name="log-out" onPress={logoutHandller}>Logout</Ionicons.Button>
                   </View>}
                
              </View>
              <View style={styles.postContainer}>
                  <FlatList 
                    data={data.posts}
                    renderItem={({item}: any)=> renderPost(navigation, item)}
                    numColumns ={3}
                    showsVerticalScrollIndicator={false}
                  
                  />
              </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer : {
        width: window.window.width,
        flex: 1,
    },
    detailsContainer : {
        flexDirection : 'row',
        alignItems : "center",
        margin:20,
        paddingBottom : 20,
        borderBottomColor : "#808080",
        borderBottomWidth : 1,
    },
    avatar : {
        width : 100,
        height : 100,
        borderRadius : 100,
    },
    userDetails : {
        flexDirection : "row",
        width : window.window.width - 120,
        justifyContent :"space-evenly"
    },
    count : {
        marginHorizontal : 10,
    },
    boldText : {
        fontWeight : "bold",
        fontSize : 14,
    },
    boldCount : {
       fontWeight : "bold",
       fontSize : 20,
       textAlign : "center"
     },
    aboutContainer : {
        marginHorizontal: 20,
        borderBottomWidth : 1,
        paddingBottom : 15,
        borderBottomColor : "#808080",
    },
    fullname : {
        fontWeight : "bold",
        fontSize : 19,
        marginBottom : 10,
    },
    postContainer : {
         margin: 20,
         marginBottom : 100,
    },
    post : {
        width : (window.window.width - 44) / 3,
        height :  (window.window.width - 4) / 3,
        resizeMode :"cover",
    }
})