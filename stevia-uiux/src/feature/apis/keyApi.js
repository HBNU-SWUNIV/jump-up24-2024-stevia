import apiClient from "./apiClient.js";

/**
 * 예약 ID로 키 데이터를 가져오는 함수
 * @GET /keys/{reserveId}
 * @param {String} reserveId - 예약 ID
 * @return image_status
 */
export const fetchKey = async (reserveId) => {
    try {
        const response = await apiClient.get(`keys/${reserveId}`);
        return response.data;
    } catch (err) {
        console.error("key fetch error" + err);
    }
}

/**
 * 예약 ID로 키 데이터를 업데이트하는 함수
 * @POST /keys/{reserveId}
 * @param {string} reserveId - 예약 ID
 * @return image_status
 */
export const updateKey = async (reserveId) => {
    try {
        const response = await apiClient.post(`keys/${reserveId}`);
        return response.data;
    } catch (err) {
        console.error("key update error" + err);
    }
}

/**
 * 예약 ID로 키 데이터를 삭제하는 함수
 * @DELETE /keys/{reserveId}
 * @param {string} reserveId - 예약 ID
 */
export const deleteKey = async (reserveId) => {
    try {
        const response = await apiClient.delete(`keys/${reserveId}`);
        return response.data;
    } catch (err) {
        console.error("key delete error" + err);
    }
}