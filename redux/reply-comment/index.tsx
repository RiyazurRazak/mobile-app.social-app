import {PayloadAction, createSlice} from '@reduxjs/toolkit'


interface IinitialState {
    isReplyClicked : boolean,
    replyToUsername : string | null,
    commentId : number | null,
}


const initialState : IinitialState = {
    isReplyClicked : false,
    replyToUsername : null,
    commentId : null,
}


const replySlice = createSlice({
    name : "replySlice",
    initialState : initialState,
    reducers : {
        setReplyData : (state : IinitialState, {payload} : PayloadAction<IinitialState>)=>{
            state.isReplyClicked = payload.isReplyClicked
            state.replyToUsername = payload.replyToUsername,
            state.commentId = payload.commentId
        }
    }
})


export default replySlice.reducer;
export const {setReplyData} = replySlice.actions