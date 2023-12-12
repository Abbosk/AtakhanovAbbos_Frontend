import { configureStore } from "@reduxjs/toolkit";
import editData from "../slice/editData";


export default configureStore({
    reducer: {
        editData
    },
    devTools: process.env.NODE_ENV !== "production",
});