import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/api";

export const registerUser=createAsyncThunk(
    "api/auth/register",
    async (formData,thunkAPI)=>{
        try{
            const response=await API.post("/auth/register",formData);
            return response.data.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
    }

)

export const loginUser=createAsyncThunk(
    "api/auth/login",
    async (formData,thunkAPI)=>{
        try{
            const response =await API.post("/auth/login",formData);

            return response.data.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
    }
)

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        token:localStorage.getItem("token"),
        loading:false,
        error:null,
    },
    reducers:{
      setToken: (state, action) => {

        state.token = action.payload;

        localStorage.setItem(
            "token",
            action.payload
        );
    },
  
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }, 
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        const { user, token } = action.payload;

        state.user = user || null;
        state.token = token || null;
        if (token) {
          localStorage.setItem("token", token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const { user, token } = action.payload;
        state.user = user || null;
        state.token = token || null;
        if (token) {
          localStorage.setItem("token", token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    }

})


export const { logoutUser,setToken} = authSlice.actions;
export default authSlice.reducer;