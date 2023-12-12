import { createSlice } from "@reduxjs/toolkit";

const editData = createSlice({
    name: 'editData' ,
    initialState: {
        editId:""
    },
    reducers: {
        editAction: (state,{payload} ) =>{
            state.editId =payload

        }
    }
})



export const {editAction} = editData.actions
export default editData.reducer