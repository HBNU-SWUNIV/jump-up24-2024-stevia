import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    reserveId: null,
}

/**
 * reserveId 상태 관리하기 위한 slice 정의
 * 상태와 액션 함수(리듀서)를 함께 정의함
 * 상태 - reserveId
 * 리듀서 - setReserveId, clearReserveId
 */
const reserveIdSlice = createSlice({
    name: 'reserveId',
    initialState,
    reducers: {
        setReserveId: (state, action) => {
            state.reserveId = action.payload;
        },
        clearReserveId(state) {
            state.reserveId = null;
        },
    },
});

export const {setReserveId, clearReserveId} = reserveIdSlice.actions;
export default reserveIdSlice.reducer;