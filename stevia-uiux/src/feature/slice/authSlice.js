import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {loginUser} from "../apis/loginApi.js";


/**
 * 사용자 로그인을 관리하기 위한 slice 정의
 * 비동기 작업(로그인 요청)을 처리하기 위해 createAsyncThunk 를 사용
 * 상태 - 로그인 상태, 액세스 토큰, 로그인 시도에 대한 상태를 관리
 * 리듀서 - synchronous reducers(동기 리듀서), extraReducers(비동기 리듀서)
 */
export const login = createAsyncThunk(
    'auth/login',
    async ({studentId, password}) => {
        return loginUser({studentId, password});
    }
);

const initialState = {
    accessToken: null,
    status: 'idle',
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.accessToken = null;
            state.refreshAccessToken = null;
            state.reserveId = null;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accessToken = action.payload.accessToken;
                state.error = null; // 성공 시 에러 초기화
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message; // 실패 시 에러 메시지 설정
            });
    },
});

export default authSlice.reducer;
export const {logout, setAccessToken, setReservedId} = authSlice.actions;