import * as React from 'react'
import {ActivityIndicator, Image, StyleSheet, View,} from 'react-native'
import  {Camera} from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { Text } from './Themed'
import window from '../constants/Layout'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import {SafeAreaView} from 'react-native-safe-area-context'
import * as FileSystem from 'expo-file-system';
import axios from 'axios'
import { baseUrl } from '../config'
import { useSelector, useDispatch } from 'react-redux'
import { Tstore } from '../store'
import { StoryScreenNavigationProp } from '../types';
import { setIsRefetchPosts, setIsRefetchStories } from '../redux/refresh'

interface props {
    upload_type : string,
    navigation : StoryScreenNavigationProp,
}

export default function CameraPicker({upload_type, navigation} : props){


    const [permission, setPermission] = React.useState<boolean | null>(null)
    const [type, setType] = React.useState(Camera.Constants.Type.back)
    const [isFlash, setIsFlash] = React.useState(0)
    const [isPreview, setIsPreview] = React.useState<boolean>(false)
    const [image, setImage] = React.useState<any>(null)
    const [isUpload, setIsUploading] = React.useState<boolean>(false)
    const {token} = useSelector((state:Tstore)=> state.tokenReducer)
    let camera : Camera | null;
    const dispatch = useDispatch()


    React.useEffect(()=>{

        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setPermission(status === 'granted');
          })();

    },[])


    const switchCameraHandller = ()=>{
        setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
    }


    const imagePickerHandller = async ()=>{

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64 : true,
          });

        if(!result.cancelled){
            setIsPreview(true)
             setImage(result.base64)
        }

    }  


    const takePictureHandller = async()=>{
        const result = await camera?.takePictureAsync({
            base64 : true,
            quality : 1,
        });
        
        if(result?.base64){
            setIsPreview(true)
            setImage(result.base64)
            FileSystem.copyAsync({
                from : result.uri,
                to : FileSystem.documentDirectory + `socialapp/social-app-story-${new Date()}`
            })
        }
    }

    const flashHandller = ()=>{
       
       setIsFlash(isFlash === 1 ? 0 : 1)    
    }

    const uploadStory = async()=>{

        setIsUploading(true)

        const formData = new FormData()
        formData.append("file", `data:image/jpeg;base64,${image}`)
        formData.append('upload_preset', 'cvobsami')
        formData.append("cloud_name", "ddjddflnh")
          await axios.post("https://api.cloudinary.com/v1_1/ddjddflnh/upload",formData).then(async(res)=>{
                 
             if(upload_type == "Post"){
                const body = {
                    "post_url" : res.data.secure_url,
                    "is_video" : false,
                }
                await axios.post(`${baseUrl}/api/posts/add-post`, body, {
                    headers : {
                        "Authorization" : `Token ${token}`
                    }
                }).then((res)=>{
                    if(res.status === 201){
                        setIsUploading(false)
                        navigation.goBack()
                        dispatch((setIsRefetchPosts({isRefetch : true})))
                        return 
                    }
                })
             }else {
                 const body = {
                     "story_url" : res.data.secure_url
                 }

                 await axios.post(`${baseUrl}/api/stories/upload-story`, body, {
                     headers : {
                        "Authorization" : `Token ${token}`
                     }
                 }).then((res)=>{
                     if(res.status === 201){
                         setIsUploading(false)
                         dispatch((setIsRefetchStories({isRefetch : true})))
                         navigation.goBack()
                         return
                     }
                 })
             }
              

          })
    }

    if (permission === null){
        return(
            <View />
        )
    }
    if(permission === false){
        return(
            <SafeAreaView>
                <Text>Permission Denied!. Try to Give Permission</Text>
            </SafeAreaView>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            {
            isPreview ?

               <View style={styles.previewContainer}>
                   <Text style={styles.previewText}>Preview</Text>
                   <Image 
                     source={{uri :`data:image/jpeg;base64,${image}`}}
                     style={styles.previewImage}
                     />
                     <View style={styles.actions}>
                        <TouchableOpacity style={styles.btn} onPress={uploadStory}>
                            <Ionicons name="cloud-upload" color="#fff" size={30} />
                            <Text style={{marginStart : 10}}>Upload {upload_type}</Text>
                        </TouchableOpacity>
                     </View>
                    {isUpload && <ActivityIndicator color="#fff"  size={28} /> }
                
               </View>

             :
              <Camera type={type} style={{flex : 1}}  ref={ref => {camera = ref}} flashMode={isFlash}>
                 <View style={styles.cameraContainer}>
                     <View style={styles.topControls}>
                         <TouchableOpacity onPress={flashHandller}>
                              <Ionicons name={ isFlash ? "flash-outline" : "flash-off-outline"} color="#fff" size={30} />
                           </TouchableOpacity>
                     </View>
                      <View style={styles.controls}>
                           <TouchableOpacity onPress={imagePickerHandller}>
                              <Ionicons name="images-outline" color="#fff" size={30} />
                           </TouchableOpacity>
                           <TouchableOpacity style={styles.pressBtn} onPress={takePictureHandller} />
                           <TouchableOpacity onPress={switchCameraHandller}>
                               <Ionicons name="sync-outline" color="#fff" size={30} />
                          </TouchableOpacity>
                      </View>
                  </View>
              </Camera>
           }
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container : {
        width : window.window.width,
        height : window.window.height,
        overflow:  "scroll",
    },
    cameraContainer : {
        flex: 1,
        width : '100%',
        flexDirection : "row",
        alignItems : "flex-end",
        marginBottom : 70,
    },
    topControls : {
        position: "absolute",
        flexDirection : "row",
        top : 30,
        left: 30,
    },
    controls : {
        width : "100%",
        alignItems : "center",
        flexDirection : "row",
        justifyContent : "space-evenly",
    },
    pressBtn : {
        width : 70,
        height : 70,
        borderWidth : 3,
        borderColor : "#fff",
        borderRadius : 100,
    },
    previewContainer : {
        margin: 20,
    },
    previewText : {
       fontWeight : "bold",
       fontSize : 24,
       margin: 20,
    },
    previewImage : {
        margin: 20,
        height:  window.window.height/2,
        resizeMode : "contain",
    },
    actions : {
        alignItems : "center",
        marginVertical : 10,
    },
    btn : {
        flexDirection : "row",
        alignItems : "center",
        backgroundColor : "#808080",
        padding : 10,
        borderRadius : 5,
        marginVertical : 10,
    }
})