import * as React from 'react'
import {Image, StyleSheet, View, Text} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {useDispatch} from 'react-redux'
import { setReplyData } from '../redux/reply-comment'
import {StoryScreenNavigationProp} from '../types'



interface props {
    comment : {
        id: number,
        comment_body: string,
        comment_user: {
            id: number,
            username: string,
            avatar: string,
        },
        commented_at: string
        reply: any[],
    },
    navigation : StoryScreenNavigationProp
}

function CommentList({comment, navigation}: props){


    const dispatch = useDispatch()

    const [isShowReplies, setIsShowReplies] = React.useState<boolean>(false)


    const showRepliesHandller = ()=>{
         setIsShowReplies(!isShowReplies)
    }

    const replyClickedHandller = (id : number , username : string)=>{
       dispatch(setReplyData({isReplyClicked : true, replyToUsername : username, commentId : id}))
    }

 


    return(
     
     <View style={styles.root}>

         {

                  <View key={comment.id}>   
                    <View style={styles.container}>
                    <Image 
                      source={{uri : comment.comment_user.avatar}}
                      style={styles.avatar}
                    />
                    <View style={styles.commentContainer}>
                        <TouchableOpacity onPress={()=> navigation.navigate("ProfileModel", {userId : comment.comment_user.id})}>
                            <Text style={styles.username}>{comment.comment_user.username}</Text>
                        </TouchableOpacity>
                         <Text style={styles.comment}>{comment.comment_body}</Text>
                         <View style={styles.actionContainer}>
                            <TouchableOpacity onPress={()=> replyClickedHandller(comment.id, comment.comment_user.username)}>
                                <Text style={styles.replyBtn}>Reply</Text>
                            </TouchableOpacity>
                            {
                                comment.reply.length > 0 &&
                               <TouchableOpacity  onPress={showRepliesHandller}>
                                  <Text style={styles.replyBtn}>{isShowReplies ? "Hide" : "View"} Replies</Text>
                               </TouchableOpacity>
                            }
                           
                         </View>  
                    </View>
               </View> 
       
               {
                  isShowReplies 
                  &&

                  comment.reply.map((reply, index)=>{
                      return (
                        <View style={styles.replies} key={index}>
                          <View style={styles.replyContainer}>
                              <Image 
                                  source={{uri : reply.comment_user.avatar}}
                                  style={styles.avatar}
                              />
                              <View style={styles.replyCommentContainer}>
                                  <TouchableOpacity onPress={()=> navigation.navigate("ProfileModel", {userId : reply.comment_user.id})}>
                                     <Text style={styles.username}>{reply.comment_user.username}</Text>
                                  </TouchableOpacity>
                                 <Text style={styles.comment}>{reply.comment_body}</Text> 
                              </View>
                        </View>          
                     </View>    
                      )
                  })
               }
               </View>
                 
         }
      
    </View> 
    )
}

const styles= StyleSheet.create({
    root : {
        marginTop : 30,
    },
    container : {
        flexDirection : "row",
        alignItems : "center",
        margin: 20,
    },
    avatar : {
        width: 50,
        height : 50,
        borderRadius : 100,
        marginEnd : 15,
    },
    commentContainer : {
        flexWrap: "wrap"
    },
    username : {
        color : "#fff",
        fontWeight : "bold",
        textTransform : "uppercase",
    },
    comment : {
        width : "70%",
        marginTop : 10,
        color : "#fff"
    },
    actionContainer : {
        flexDirection : "row",
        paddingTop : 10,
    },
    replyBtn : {
        color : "#fff",
        marginHorizontal : 10,
    },
    replies : {
        backgroundColor : "#121212",
        padding: 20,
    },
    replyContainer : {
         marginLeft :60,
         flexDirection : 'row',
         alignItems : 'center',
    },
    replyCommentContainer : {
        width : '100%',
    }
})

export default React.memo(CommentList)