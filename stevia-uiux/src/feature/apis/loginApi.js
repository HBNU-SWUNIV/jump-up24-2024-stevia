import {useCookies} from 'react-cookie';
import Axios from "axios";


const apiClient = Axios.create({
    baseURL: 'http://task-api.wisoft.io/stevia/api',
});

// 사용자 로그인
export const loginUser = async ({studentId, password}) => {
    try {
        const response = await apiClient.post('/users/signin', {studentId, password});
        return response.data;
    } catch (error) {
        throw new Error('Failed to login');
    }
};

// access Token 재발급
export const refreshAccessToken = async dispatch => {
    try {
        const [cookies] = useCookies(['refreshToken']);
        const refreshToken = cookies.refreshToken;
        const response = await apiClient.post('/auth/token/access', {token: refreshToken});
        const {accessToken} = response.data;

        return accessToken; // 액세스 토큰 반환
    } catch (error) {
        console.log('Failed to refresh access token', error);
        throw error;
    }
};
