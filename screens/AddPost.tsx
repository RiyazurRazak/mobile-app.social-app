import * as React from "react"
import CameraPicker from "../components/CameraPicker"
import { StoryScreenNavigationProp } from '../types';

interface props {
    navigation : StoryScreenNavigationProp
}


export default function AddPost ({navigation}: props){

    return(
        <CameraPicker upload_type="Post" navigation={navigation} />
    )
}