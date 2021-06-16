import * as React from 'react'
import ProfileScreen from './ProfileScreen'
import { StoryScreenNavigationProp } from '../types';
import { useRoute } from '@react-navigation/core';

interface props {
    navigation : StoryScreenNavigationProp
 }




export default function ProfileMode({navigation} : props){

    const route = useRoute<any>()
    const userId = route["params"]["userId"]


    return(
        <ProfileScreen navigation={navigation} userId={userId} />
    )
}