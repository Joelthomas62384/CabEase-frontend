import { UserType } from "@/types"
import { createSlice } from "@reduxjs/toolkit"



type InitialStateType = {
    user : UserType,
    isLoggedIn : boolean
}



export const initialState: InitialStateType = {
    user : {
        id: '',
        mobile : '',
        full_name : '',
        is_driver: false,
        is_superuser: false,
    },
    isLoggedIn : false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload
        },
        setDriver : (state, action)=>{
            state.user = {...state.user , is_driver: action.payload}
        }
    },
})


export const { setUser, setLoggedIn , setDriver} = userSlice.actions

export default userSlice.reducer