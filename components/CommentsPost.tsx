import * as React from 'react'
import {View, StyleSheet, Text, Image} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {StoryScreenNavigationProp} from '../types'

interface props {
    navigation : StoryScreenNavigationProp,
    post : string,
    color : string,
    username : string,
    avatar : string
}
  



export default function CommentPost({navigation, post, color, username, avatar} : props){


    return(

            <View style={[styles.postContainer, {backgroundColor : `#${color}94`}]}>
               <Image 
                 source={{uri : post}}
                 style={styles.postImage}
               />
                <View style={styles.header}>
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                          <Ionicons name="chevron-back" color={`#${(Number(`0x1${color}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`} size={30} />
                      </TouchableOpacity>
                     <Text style={{...styles.comment, color: `#${(Number(`0x1${color}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`}}>Comments</Text>
                </View>
               <View style={styles.userDetailsContainer}>
                     <Image 
                        source={{uri: avatar}}
                        style={styles.avatar}
                     /> 
                     <Text style={{...styles.username, color: `#${(Number(`0x1${color}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`}}>{username}</Text> 
               </View>
            </View>
            
    )
}


const styles = StyleSheet.create({
    postContainer : {
       height: 400,
       borderRadius : 30,
    },
    postImage : {
        width: "100%",
        height : 300,
        resizeMode : "cover",
        borderRadius : 10,
        borderBottomLeftRadius : 30,
        borderBottomRightRadius : 30,
        position: "relative",
    },
    header : {
       flexDirection : "row",
       position: 'absolute',
       top: 30,
       left : 20,
       alignItems : "center",
    },
    comment : {
       color: "#fff",
       fontWeight : "bold",
       fontSize : 30,
       marginStart : 10,
    },
    userDetailsContainer : {
        margin : 30,
        flexDirection : "row",
        alignItems : "center",
    },
    avatar : {
         height: 30,
         width : 30,
         borderRadius : 50,
         marginEnd : 10,
    },
    username : {
         fontWeight : "bold",
    }

})