import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as React from 'react'
import {View, StyleSheet,TextInput, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux'
import { baseUrl } from '../config';
import { setIsRefetchPosts } from '../redux/refresh';
import { setReplyData } from '../redux/reply-comment';
import { Tstore } from '../store';

interface props {
    postId : number
}

export default function TextField({postId}: props){


    const dispatch = useDispatch()

   const [comment, setComment] = React.useState<string>('')
   const {isReplyClicked, commentId , replyToUsername} = useSelector((state : Tstore)=> state.reply)
   const {token} = useSelector((state : Tstore)=> state.tokenReducer)

   React.useEffect(()=>{
    setComment("")
    dispatch(setReplyData({isReplyClicked : false, replyToUsername : null, commentId : null})) 
   },[])

   React.useEffect(()=>{
       if(isReplyClicked)
      setComment(`@${replyToUsername} `)
      else{
          setComment("")
          dispatch(setReplyData({isReplyClicked : false, replyToUsername : null, commentId : null}))
      }
   },[isReplyClicked])


   const replyCommentHandller = async()=>{
       if(isReplyClicked){
        const body = {
            "comment_id" : commentId,
            "comment_body" : comment,
         }
         await axios.post(`${baseUrl}/api/posts/comment-reply`, body ,{
            headers : {
               "Authorization" : `Token ${token}`
            }
         }).then((res)=>{
            if(res.status === 201){
               Alert.alert("Comment Successfully")
               setComment("")
               dispatch(setReplyData({isReplyClicked : false, replyToUsername : null, commentId : null}))
               dispatch(setIsRefetchPosts({isRefetch : true}))
            }else{
                Alert.alert("Sorry Something error", "Please Try Again Later")
           }
        })
       }else{
           const body = {
                "post_id" : postId,
                "comment_body" : comment,
           }

           await axios.post(`${baseUrl}/api/posts/add-comment`, body, {
               headers : {
                   "Authorization" : `Token ${token}`
               }
           }).then((res)=>{
               if(res.status === 201){
                Alert.alert("Comment Successfully")
                setComment("")
                dispatch(setReplyData({isReplyClicked : false, replyToUsername : null, commentId : null}))
                dispatch(setIsRefetchPosts({isRefetch : true}))
               }else{
                 Alert.alert("Sorry Something error", "Please Try Again Later")
               }
           })
       }
      
   }



    return (

        <View style={styles.container}> 

             <TextInput 
              style={styles.input} 
              placeholder="Message.." 
              placeholderTextColor="#fff"
              multiline
              value={comment}
              onChange={(e)=> setComment(e.nativeEvent.text)}
              selectionColor ="#fff"
              />

              <TouchableOpacity onPress={replyCommentHandller}>
                  <Ionicons name="send" color="#fff" size={20}/>
              </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
   container : {
       display: "flex",
       position: "absolute",
       bottom : 2,
       width: '95%',
       flexDirection : "row",
       alignItems : 'center',
       backgroundColor : "#181818",
       paddingHorizontal: 20,
       borderRadius : 20,
       marginHorizontal : '2.5%',
   },
   input : {
       color: "#fff",
       padding:  10,
       alignItems : "center",
       height: 50,
       borderRadius : 20,
       width: "95%",
   },
})