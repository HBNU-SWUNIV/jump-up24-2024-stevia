import apiClient from "./apiClient.js";

// 강의실 시간표 조회
export const fetchReserveData = async (roomId) => {
    try {
        const response = await apiClient.get(`/boards/timetable/${roomId}`);
        return response.data;
    } catch (err) {
        console.error('Failed to fetch reserve data', err);
    }
}

// 강의실 예약
export const postReserveData = async (roomId, usageTime) => {
    try {
        const response = await apiClient.post(`/boards/reservation/${roomId}`, {
                usageTime: usageTime
            }, {
                headers: {
                    "Content-Type": "application/json",  // Content-Type 명시
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Failed to post reservation', err);
    }
}