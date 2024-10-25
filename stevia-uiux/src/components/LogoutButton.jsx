import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logout } from '../feature/slice/authSlice.js';

/**
 * 사용자 로그아웃 컴포넌트
 * Redux의 logout 액션을 디스패치하고 refreshToken 쿠키를 삭제하는 기능
 */
const LogoutButton = () => {
    const dispatch = useDispatch();
    const [, , removeCookie] = useCookies(['refreshToken']);

    const handleLogout = () => {
        dispatch(logout());
        removeCookie('refreshToken', { path: '/' });
    };

    return (
        <p onClick={handleLogout}>Logout</p>
    );
};

export default LogoutButton;