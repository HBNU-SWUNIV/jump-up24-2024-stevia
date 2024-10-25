import Axios from 'axios';
import store from "../../app/store.js";
import {refreshAccessToken} from "./loginApi.js";

// Axios 인스턴스 생성
const apiClient = Axios.create({
    baseURL: 'http://task-api.wisoft.io/stevia/api',
});

/**
 * 요청 인터셉터 설정
 * 요청 보내기 전에 엑세스 토큰을 확인하고 설정하는 인터셉터
 */
apiClient.interceptors.request.use(
    async (config) => {
        let accessToken = store.getState().auth.accessToken;

        if (!accessToken) {
            accessToken = await refreshAccessToken();  // 액세스 토큰을 갱신
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // console.log('Request Headers:', config.headers); // Authorization 헤더 출력
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
