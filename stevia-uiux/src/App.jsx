import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import {useSelector} from "react-redux";


const PrivateRoute = ({element}) => {
    const accessToken = useSelector((state) => state.auth.accessToken);
    return accessToken ? element : <Navigate to="/login"/>;
};

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<PrivateRoute element={<Home/>}/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/reservation/:roomId" element={<PrivateRoute element={<Reservation/>}/>}/>
            </Routes>
        </div>
    );
}

export default App;
