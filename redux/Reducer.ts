import tokenReducer from './auth-token'
import storiesReducer from './stories'
import reply from './reply-comment'
import refresh from './refresh'

const combineReducers = {
    tokenReducer,
    storiesReducer,
    reply,
    refresh,
}

export default combineReducers