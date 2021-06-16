import {configureStore} from '@reduxjs/toolkit'
import combineReducers from './redux/Reducer'

export const store = configureStore({reducer : combineReducers, devTools: process.env.NODE_ENV !== "production",})

export type Tstore = ReturnType<typeof store.getState>;