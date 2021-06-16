import {createSlice, PayloadAction} from '@reduxjs/toolkit'


interface IinitialState {
   isRefetchStories : boolean,
   isRefetchPosts : boolean,
}

interface props{
    isRefetch : boolean
}

const initialState : IinitialState = {
    isRefetchPosts : false,
    isRefetchStories : false,
}


const refresh = createSlice({
    name : "RefreshSlice",
    initialState : initialState,
    reducers : {
        setIsRefetchStories : (state : IinitialState, {payload} : PayloadAction<props>)=>{
                state.isRefetchStories = payload.isRefetch
        },
        setIsRefetchPosts : (state : IinitialState, {payload} : PayloadAction<props>)=>{
              state.isRefetchPosts = payload.isRefetch
        },
    }

})


export default refresh.reducer;
export const {setIsRefetchPosts} = refresh.actions
export const {setIsRefetchStories} = refresh.actions