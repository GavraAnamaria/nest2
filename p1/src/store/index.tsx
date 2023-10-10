import {createSlice, configureStore} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root', // numele cheii pentru stocarea locală
    storage: storage, // stocarea pe care doriți să o utilizați
};

const MessageSlice = createSlice({
    name:'message',
    initialState: {message:"", messageType:"info"},
    reducers:{
        setMessage(state,action){
            state.message = action.payload.message;
            state.messageType = action.payload.messageType;
        },
        deleteMessage(state) {
            state.message = "";
            state.messageType = "info";
        }
    }
})

const UserSlice = createSlice({
    name:'user',
    initialState:{role:'', name:''},
        // , isLoggedIn:false,
    reducers:{
        login(state,action){
            // state.isLoggedIn = true;
            state.role = action.payload.role;
            state.name = action.payload.firstName;
        },
        logout(state) {
            // state.isLoggedIn = false;
            state.role = "";
            state.name = ""
        }
    }
})


const persistedUserReducer = persistReducer(persistConfig, UserSlice.reducer);



const store = configureStore({
    reducer:{message: MessageSlice.reducer, user: persistedUserReducer},
})

export const messageActions = MessageSlice.actions
export const userActions = UserSlice.actions
export default store

export const persistor =persistStore(store)