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
        username : '',
        is_driver: false,
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
    },
})


export const { setUser, setLoggedIn } = userSlice.actions

export default userSlice.reducer