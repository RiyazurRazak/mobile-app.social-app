import * as React from 'react'
import {StyleSheet, View,} from 'react-native'
import {Text} from '../components/Themed'
import { SafeAreaView } from 'react-native-safe-area-context';
import {BarCodeScanner} from 'expo-barcode-scanner'
import window from '../constants/Layout'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import axios from 'axios';
import { baseUrl } from '../config';
import { Alert } from 'react-native';
import { Tstore } from '../store';
import { useSelector } from 'react-redux';



export default function BarCodeSacnnerScreen (){
    
    const {token} = useSelector((state : Tstore)=> state.tokenReducer)
    const [scaned, setSacaned] = React.useState<boolean>(false)
    const [permission, setPermission] = React.useState<boolean | null>(null)
    const [UUID, setUUID] = React.useState<string>("Not Generated Try Again")

    const colorScheme = useColorScheme()


    React.useEffect(()=>{
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setPermission(status === 'granted');
          })();
    },[])


    const barCodeScannedHandller = async ({type, data}: any)=>{
        if(data === "fd2d79ab-3000-41c7-8666-98103e3ccec6"){
            setSacaned(true)
            setUUID("Generating Please Wait")
            await axios.get(`${baseUrl}/api/web-connect/get-uuid`, {
                headers: {
                    "Authorization" : `Token ${token}`
                }
            }).then((res)=>{
                 if(res.status === 201){
                     setUUID(res.data.uuid)
                 }
             })
        }else{
            setSacaned(true)
            Alert.alert("Invalid Credentials")
        }
    }

    if (permission === null){
        return(
            <View></View>
        )
    }

    if (permission === false){
        return(
            <Text>Not Permission</Text>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                scaned ?
                <View style={styles.codeContainer}>
                     <Text style={styles.codeContainerText}>Enter The Code In The Web App</Text>
                     <Text style={[styles.codeContainerText, {fontSize : 30, marginVertical: 20,}]}>{UUID}</Text>
                     <Text style={styles.codeContainerText}>Valid For Only 2 Minutes</Text>
                     <View style={{marginTop : 30}}>
                         <TouchableOpacity onPress={()=> setSacaned(false)}>
                             <Ionicons name="refresh-circle" color={colors[colorScheme].text} size={60} />
                         </TouchableOpacity>
                     </View>
                </View>

                :

                <View style={{flex: 1}}>
                    <BarCodeScanner 
                       onBarCodeScanned = {scaned ? undefined : barCodeScannedHandller}
                       style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.innerConatainer}>
                         <View style={styles.corner}>
                            <View style={[styles.top, styles.left]}></View>
                            <View style={[styles.top, styles.right]}></View>
                            <View style={[styles.bottom, styles.left]}></View>
                            <View style={[styles.bottom, styles.right]}></View>
                        </View>
                    </View>
                </View>
            
        
            }
       </SafeAreaView>
    )
    

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        position: "relative",
    },
    innerConatainer : {
        top : window.window.height/2 -125, 
        left : window.window.width/2 - 125,
        right : window.window.width/2 - 125,
        bottom : window.window.height/2 - 125, 
    },
    corner : {
        width : 250,
        height : 250,
        position : 'relative',
    },
    top : {
       position:"absolute",
       top: 0,
       width : 50,
       height : 50,
       borderTopWidth : 10,
       borderTopColor : "#fff",
       borderRadius : 10,
    },
    bottom : {
       position:"absolute",
       bottom: 0,
       width : 50,
       height : 50,
       borderBottomColor : "#fff",
       borderBottomWidth : 10,
       borderRadius : 10,
    },
    left : {
       left: 0,
       borderLeftWidth : 10,
       borderLeftColor : '#fff',
    },
    right : {
       right : 0,
       borderRightWidth : 10,
       borderRightColor : "#fff"
    },
    codeContainer : {
        flex: 1,
        justifyContent : "center",
        alignItems : "center",
    },
    codeContainerText : {
        fontWeight : "bold",
    },
})