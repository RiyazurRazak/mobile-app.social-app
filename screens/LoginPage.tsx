import * as React from 'react'
import { Alert, StyleSheet} from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Text, View} from '../components/Themed'
import window from '../constants/Layout'
import colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store';
import {useDispatch} from 'react-redux'
import {setToken} from '../redux/auth-token'
import axios from 'axios'
import {baseUrl} from '../config'


export default function LoginPage (){


    const colorSchema = useColorScheme()
    const dispatch = useDispatch()

    const [isLoginPage, setLoginPage] = React.useState<boolean>(true)
    const [username, setUsername] = React.useState<string | undefined>(undefined)
    const [email, setEmail] = React.useState<string | undefined>(undefined)
    const [password, setPassword] = React.useState<string | undefined>(undefined) 
    const [fullname, setFullname] = React.useState<string | undefined>(undefined)  
    const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined) 


    const loginHandller = async()=>{

        if(username && password){
           
            if(username?.includes(" ")){
                Alert.alert("Spaces Not Allowed")
            }else{
                const body = {
                    "username" : username,
                    "password" : password,
                }
                try {
                   await axios.post(`${baseUrl}/api/account/login`, body).then(async(res)=>{
                        if (res.status === 200){
                            const token = res.data.token
                             await axios.get(`${baseUrl}/api/account/current-user`,{
                                 headers : {
                                     "Authorization" : `Token ${token}`
                                 }
                             }).then(async(res)=>{
                                  if(res.status === 200){
                                    const data = {
                                        "token" : token,
                                        "username" : res.data.username,
                                        "avatar" : res.data.avatar,
                                        "id" : res.data.id,
                                    }
                                    await SecureStore.setItemAsync("authUser", JSON.stringify(data))
                                    dispatch(setToken({isTokenAvailable : true, token : token, username : res.data.username, avatar : res.data.avatar, id : res.data.id}))
                                  }
                             })
                            
                        }else{

                        }
                    }) 
                } catch (error) {
                    console.warn(error)
                }
               
                

            }

        }else {
            Alert.alert("All Fields Are Required", "Try To Fill All Fields")
        }

        

        
    }

    const signupHandller = async()=>{

        if(username && email && password && fullname && avatarUrl){
            if(username?.includes(" ")){
                Alert.alert("Spaces Not Allowed in Username")
            }else{
            const body = {
                "username" : username,
                "email"  : email,
                "password" : password,
                "avatar" : avatarUrl,
                "fullname" : fullname,
            }
            axios.post(`${baseUrl}/api/account/register`, body).then((res)=>{
                if(res.data === "UserName Already Exist"){
                    Alert.alert("Error", "Username Already Exist. Try To Login or try another name")
                }
                if(res.data === "Email Already Exist" ){
                    Alert.alert("Error","Email Address Already Exist. Try To Login or try another mail address" )
                }if(res.data.token){
                    loginHandller()
                }
            })
        }
    }
        else{
            Alert.alert("Error", "Some Fields are missing")
        }
        
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
            <StatusBar backgroundColor={ colorSchema === "dark" ? "#000" : "#fff"} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    isLoginPage ? 
                     
                    <View style={styles.innerContainer}>
                    <Text style={styles.heading}>Login</Text>
                    <View>
                        <TextInput 
                           placeholder="username"
                           placeholderTextColor="#808080"
                           style={[{color : colors[colorSchema].text,  backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                           value={username}
                           onChange={(e)=> setUsername(e.nativeEvent.text)}
                           
                        />
 
                        <TextInput 
                           placeholder="password"
                           placeholderTextColor="#808080"
                           style={[{color : colors[colorSchema].text, backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                           textContentType="password"
                           secureTextEntry={true}
                           value={password}
                           onChange={(e)=> setPassword(e.nativeEvent.text)}

                        />


                        <Ionicons.Button name="lock-open-outline" onPress={loginHandller}>Login</Ionicons.Button>
 
                        <TouchableOpacity style={styles.signup} onPress={()=> setLoginPage(!isLoginPage)}>
                          <Text style={{textAlign : "center"}}>Can't Have An Account? SignUp</Text>
                        </TouchableOpacity>
 
                    </View>
                    <View>
                    </View>
                 </View>
                 : 
                 
                 <View style={styles.innerContainer}>
                 <Text style={styles.heading}>SignUp</Text>
                 <View>
                     <TextInput 
                        placeholder="username"
                        placeholderTextColor="#808080"
                        style={[{color : colors[colorSchema].text,  backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                        textContentType="username"
                        value={username}
                        onChange={(e)=> setUsername(e.nativeEvent.text)}
                     />

                     <TextInput 
                        placeholder="fullname"
                        placeholderTextColor="#808080"
                        style={[{color : colors[colorSchema].text, backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                        value={fullname}
                        onChange={(e)=> setFullname(e.nativeEvent.text)}
                     />

                     <TextInput 
                        placeholder="email"
                        placeholderTextColor="#808080"
                        style={[{color : colors[colorSchema].text, backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                        value={email}
                        onChange={(e)=> setEmail(e.nativeEvent.text)}
                        textContentType="emailAddress"
                     />

                     <TextInput 
                        placeholder="password"
                        placeholderTextColor="#808080"
                        style={[{color : colors[colorSchema].text, backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                        textContentType="password"
                        secureTextEntry={true}
                        value={password}
                        onChange={(e)=> setPassword(e.nativeEvent.text)}
                     />

                      <TextInput 
                        placeholder="avatar url"
                        placeholderTextColor="#808080"
                        style={[{color : colors[colorSchema].text, backgroundColor : colorSchema === "dark" ? "#212121" : "#f5f7fa"}, styles.textInput]}
                        textContentType="URL"
                        value={avatarUrl}
                        onChange={(e)=> setAvatarUrl(e.nativeEvent.text)}
                     />

                     <Ionicons.Button  name="people-circle-outline" onPress={signupHandller}>SignUp</Ionicons.Button>

                     <TouchableOpacity style={styles.signup} onPress={()=> setLoginPage(!isLoginPage)}>
                       <Text style={{textAlign : "center"}}>Already Have Account? Login</Text>
                     </TouchableOpacity>

                 </View>
                 <View>
                 </View>
              </View>

                }
               
                </ScrollView>
             
            </View>
           
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    innerContainer : {
        marginTop : window.window.height / 6,
        marginHorizontal : (window.window.width / 2) - 125 ,
        width : 250,
    },
    heading : {
        fontSize : 26,
        fontWeight: "bold",
        marginBottom : 10,
    },
    textInput : {
       marginVertical : 15,
       paddingHorizontal : 20,
       paddingVertical : 10,
       borderRadius : 10,
    },
    signup : {
        marginTop : 15,
    }
})