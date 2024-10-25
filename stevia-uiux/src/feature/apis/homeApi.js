import apiClient from "./apiClient.js";

// 현황판 조회
export const fetchBoardData = async () => {
    try {
        const response = await apiClient.get("/boards");
        return response.data;
    } catch {
        console.error('Failed to fetch boards');
        throw error;
    }
}

// 현황판 상세 조회
export const updateBoardData = async (buildingLocation) => {
    try {
        const response = await apiClient.get(`/boards/${buildingLocation}`);

        return response.data
    } catch (error) {
        console.error('Error updating board', error);
        throw error;
    }
}