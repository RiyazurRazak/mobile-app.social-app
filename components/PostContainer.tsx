import * as React  from 'react'
import {Image, StyleSheet, View} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from './Themed'
import { Ionicons } from '@expo/vector-icons';
import {StoryScreenNavigationProp} from '../types'
import colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import {useSelector} from 'react-redux'
import { Tstore } from '../store';
import axios from 'axios';
import { baseUrl } from '../config';

interface props {
    data : any
    navigation : StoryScreenNavigationProp
 }
 


function PostCard({data, navigation} : props){



    const {id, token} = useSelector((state : Tstore)=> state.tokenReducer)
    const [isLiked, setIsLiked] = React.useState<boolean>(false)

    React.useEffect(()=>{
        const liked = data.post_likes.some((user : any)=>{
            if(user.id === id){
                return true
            }
        })
        setIsLiked(liked)
    },[])
   
 
    

     const colorScheme = useColorScheme()

    const pressHandller = (userId : number)=>{
        navigation.navigate("ProfileModel",{userId})
    }

    const likeHandller = async()=>{
        await axios.put(`${baseUrl}/api/posts/like/${data.id}`,null ,{
            headers : {
                "Authorization" : `Token ${token}`
            }
        }).then((res)=>{
            if(res.status === 200){
               setIsLiked(true)
            }
        })
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={ () => pressHandller(data.posted_user.id)}>
                <View style={styles.userDetails}>
                   <Image 
                     source={{uri: data.posted_user.avatar}}
                     style={styles.avatar}
                   />
                   <Text style={styles.username}>{data.posted_user.username}</Text>
                </View>
            </TouchableOpacity>
           
            <Image 
              source={{uri : data.post_url}}
              style={styles.postImage}
            />
            
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.like} onPress={likeHandller} disabled={isLiked}>
                   <Ionicons name={isLiked ? "md-heart" : "md-heart-outline"} color={isLiked ? "#c51104" : colors[colorScheme].text} size={28}  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.comment} onPress={()=> navigation.navigate("CommentModel", {data: data})} >
                   <Ionicons name="chatbubble-outline" color={colors[colorScheme].text} size={28}  />
                </TouchableOpacity>

            </View>
            
            <View style={styles.detailsContainer}>
               <Text>Liked By {data.post_likes.length} members</Text>
               {   
                   data.post_comments.length > 0 &&
                   <View style={styles.commentContainer}>
                     <Image 
                       source={{uri: data.post_comments[0].comment_user.avatar}}
                       style={styles.commentAvatar}
                     /> 
                      <Text style={styles.author}>{data.post_comments[0].comment_user.username}</Text> 
                       <Text>{data.post_comments[0].comment_body.slice(0,15)+"..."}</Text>
                   </View>
               }

            </View>
               
            
           
            

        </View>
    )
}


const styles = StyleSheet.create({
    container : {
       marginVertical : 20, 
       elevation: 23,
       margin: 20,
    },
    userDetails : {
       marginStart : 10,
       flexDirection : "row",
       alignItems : 'center',
    },
    avatar : {
       width : 30,
       height : 30,
       borderRadius : 50,
       marginRight : 10,
    },
    username : {
       fontWeight : 'bold',
    },
    postImage : {
        height: 250,
        borderRadius : 20,
        marginVertical : 10,
        resizeMode : "contain"
    },
    actionContainer : {
        marginStart : 10,
        flexDirection : "row",
    },
    like : {
        marginHorizontal : 10,
    },
    comment : {
        marginHorizontal : 10,
    },
    detailsContainer : {
        margin : 20,
    },
    commentContainer : {
        marginTop : 10,
        flexDirection : "row",
        alignItems : "center",
        width: '60%',
       
    },
    commentAvatar : {
       width: 20,
       height : 20,
       marginTop : 5,
       borderRadius : 100,
       marginEnd : 5,
    },
    author : {
        fontWeight : "bold",
        marginRight : 5,
    },

})


export default React.memo(PostCard)