import React from 'react';
import logo from '../assets/logo.jpg';
import background from '../assets/background.svg';
import '../styles/Login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../feature/slice/authSlice.js";

const Login = () => {
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [cookies, setCookies] = useCookies(['refreshToken']);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const authError = useSelector((state) => state.auth.error);

    const handleOnclick = async () => {
        try {
            const { payload } = await dispatch(login({ studentId, password }));
            setCookies('refreshToken', payload.refreshToken, { path: '/' });
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="background-img" style={{ backgroundImage: `url(${background})` }}>
            <div className="login-container">
                <img className="logo-img" src={logo} alt="logo" />
                <div className="student_id">
                    <input
                        type="text"
                        id="student_id"
                        name="student_id"
                        placeholder="Student ID"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)} />
                </div>
                <div className="password">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="find-password">
                    <p>Forgot Password?</p>
                </div>
                <button type="button" onClick={handleOnclick} disabled={authStatus === 'loading'}> {authStatus === 'loading' ? 'Logging in...' : 'Login'} </button>
            </div>
        </div>
    );
};

export default Login;