import * as React from 'react'
import {StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MasonryList from "react-native-masonry-list";
import Header from '../components/Header';
import { StoryScreenNavigationProp } from '../types';
import useColorScheme from '../hooks/useColorScheme'
import colors from '../constants/Colors'
import axios from 'axios';
import { baseUrl } from '../config';
import { useSelector } from 'react-redux';
import { Tstore } from '../store';

interface props {
    navigation : StoryScreenNavigationProp
 }


export default function Explore({navigation} : props){


    const [data, setData] = React.useState<any[]>([])
    const [nextUrl, setNextUrl] = React.useState<string | null>(null)

    const colorScheme = useColorScheme()
    const {token} = useSelector((state : Tstore)=> state.tokenReducer)
    const [refreshing, setRefreshing] = React.useState<boolean>(false)

    

    React.useEffect(()=>{
        fetchPosts()
    },[])


    const fetchPosts =async()=>{

        setRefreshing(true)

        await axios.get(`${baseUrl}/api/posts/explore`, {
            headers : {
                "Authorization" : `Token ${token}`
            }
        }).then((res)=>{
            if(res.status === 200){
             const posts = res.data.results.map(({post_url : url, ...rest}: any)=>({
                        url,
                        ...rest,
                }))
                setData(posts)
                setNextUrl(res.data.next)
                setRefreshing(false)
            }
        })
    }


    const navigateToSinglePostHandller = (data : any)=>{
        data["post_url"] = data.url
        navigation.navigate("SinglePost",{post : data})
    }

    const addPosts = ()=>{

       
        if (nextUrl != null){
            axios.get(nextUrl, {
                headers : {
                "Authorization" : `Token ${token}`
                }
            }).then((res)=>{
                 if(res.status === 200){
                    const posts = res.data.results.map(({post_url : url, ...rest}: any)=>({
                        url,
                        ...rest,
                    }))
                    setData((prev)=> [...prev, ...posts])
                    setNextUrl(res.data.next)

                 }
            })
        }else return
    }

    return(
        <SafeAreaView style={[styles.container, {backgroundColor : colors[colorScheme].background}]}>
            <Header title="Explore" />
              <MasonryList 
               images={data}
               columns={2}
               backgroundColor={colors[colorScheme].background}
               spacing={1}
               showsVerticalScrollIndicator={false}
               onPressImage={navigateToSinglePostHandller}
               refreshing={refreshing}
               onRefresh={()=> fetchPosts()}
               onEndReached={() => {
                   addPosts()
               }}
              /> 
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,  
        paddingBottom: 60,
    }
})