import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface Istories {
    avatar : string,
    id : number,
    story_url : string,
    username : string,
}

interface IinitialState {
    userStory : {
        isAvailable : boolean,
        story : Istories | null,
    },
    followingUsersStory : Istories[]
}

const initialState : IinitialState = {
    userStory : {
        isAvailable : false,
        story : null,
    },  
    followingUsersStory : []
}


const stories = createSlice({
    name : "StorySlice",
    initialState : initialState,
    reducers : {
        setUserStory : (state : IinitialState, {payload} : PayloadAction<any>)=>{
            state.userStory.isAvailable = payload.isAvailable
            state.userStory.story = payload.story
        },
        setFollowingUsersStory : (state : IinitialState, {payload} : PayloadAction<any>)=>{
            state.followingUsersStory = payload.data
        },
    }

})


export default stories.reducer;
export const {setUserStory} = stories.actions;
export const {setFollowingUsersStory} = stories.actions;