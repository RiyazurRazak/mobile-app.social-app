import {PayloadAction, createSlice} from '@reduxjs/toolkit'


interface IinitialState {
    isTokenAvailable : boolean,
    token : string | null,
    username : string | null,
    avatar : string | null,
    id : number | null,
}



const initialState : IinitialState = {
    isTokenAvailable : false,
    token : null,
    username : null,
    avatar : null,
    id : null,
}


export const TokenSlice = createSlice({
    name : "TokenSlice",
    initialState : initialState,
    reducers : {
        setToken : (state : IinitialState, {payload} : PayloadAction<IinitialState>)=>{
            state.isTokenAvailable = payload.isTokenAvailable,
            state.token = payload.token
            state.username = payload.username
            state.id = payload.id
            state.avatar = payload.avatar
        }
    }
})


export default TokenSlice.reducer
export const {setToken} = TokenSlice.actions; 