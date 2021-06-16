import * as React from 'react'
import {StyleSheet, RefreshControl, VirtualizedList, ActivityIndicator} from 'react-native';
import { StoryScreenNavigationProp } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Stories from '../components/Stories';
import PostCard from '../components/PostContainer';
import { Text } from '../components/Themed';
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import { Tstore } from '../store';
import { baseUrl } from '../config';
import { setIsRefetchPosts } from '../redux/refresh';


interface props {
   navigation : StoryScreenNavigationProp
}



export default function HomeScreen({navigation} :props ){


  const {token} = useSelector((state : Tstore)=> state.tokenReducer)
  const {isRefetchPosts} = useSelector((state : Tstore)=> state.refresh)
  const [posts, setPost] = React.useState<object[]>([])
  const [nextUrl, setNextUrl] = React.useState<string>(`${baseUrl}/api/posts/all-posts`)
  const [refreshing, setRefreshing] = React.useState<boolean>(false)
  const dispatch = useDispatch()



  React.useEffect(()=>{
    fetchPostHandller()
  },[])


  React.useEffect(()=>{
      isRefetchPosts && fetchPostHandller()
  },[isRefetchPosts])

  const getItem = (data : any, index : number)=>({
    id : index.toString(),
    data : data[index]

  })

  const getItemCount = (data:[]) => data.length;

  const fetchPostHandller = async()=>{

    await axios.get( `${baseUrl}/api/posts/all-posts` , {
      headers : {
        "Authorization" : `Token ${token}`
      }
    }).then((res)=>{
      if (res.status === 200){
         setPost(res.data.results)
         setNextUrl(res.data.next)
         isRefetchPosts && dispatch(setIsRefetchPosts({isRefetch : false}))
         return true
      }
    })
  }

  const reFetchPostHandller = async ()=>{
    setRefreshing(true)
    await fetchPostHandller()
    setRefreshing(false)
  }


  const addPostsHandller = async()=>{
      if(!nextUrl === null){
        await axios.get( nextUrl , {
          headers : {
            "Authorization" : `Token ${token}`
          }
        }).then((res)=>{
          if (res.status === 200){
             setPost((prev : any)=> [...prev, res.data.results])
             setNextUrl(res.data.next)
          }
        })
      }else {
        return null
      }
  }

  

    return(
        <SafeAreaView style={styles.container}>
           <Header title="My Feeds" />
           <VirtualizedList
            data={posts}
            ListFooterComponent={!nextUrl === null ? <ActivityIndicator color="#2378b3" /> : null}
            renderItem={({item}) : any => <PostCard data={item.data} navigation={navigation}  />}
            showsVerticalScrollIndicator={false}
            getItem={getItem}
            getItemCount={getItemCount}
            keyExtractor={ (item) : any => item.id}
            refreshControl ={<RefreshControl refreshing={refreshing} onRefresh={reFetchPostHandller} />}
            ListHeaderComponent ={ 
            <Stories 
              navigation={navigation} 
            />
            }
            ListEmptyComponent={<Text style={{textAlign: "center", margin :40}}>Make Some Friends In Explore page To See Their Posts & Stories</Text>}
            removeClippedSubviews
            onEndReached = {addPostsHandller}
           />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  
   container : {
      flex: 1,
      marginBottom : 60,
   },
   footer : {
     marginBottom : 20,
   }

})
