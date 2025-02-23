import { createSlice } from "@reduxjs/toolkit";


const RTNslice = createSlice({
    name : 'realTimeNotification',
    initialState : {
        likeNotification : []
    },
    reducers : {
        setLikeNotification : (state , action) => {
            if (action.payload.type === "like") {
                state.likeNotification.push(action.payload)
            } 
            else if (action.payload.type === "disLike") {
                state.likeNotification = state.likeNotification.filter( (item) => item.userId != action.payload.userId)
            } 
        }
    }
})

export const {setLikeNotification} = RTNslice.actions
export default RTNslice.reducer