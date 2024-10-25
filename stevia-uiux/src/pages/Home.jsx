import '../styles/Home.css';
import {BottomSheet} from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import useBottomSheet from '../hooks/useBottomSheet';
import keyImage from "../assets/key.png"
import {useNavigate} from "react-router-dom";
import BottomSheetContent from "../components/BottomSheetContent.jsx";
import {useEffect, useState} from "react";
import LogoutButton from "../components/LogoutButton.jsx";
import {fetchBoardData, updateBoardData} from "../feature/apis/homeApi.js";


const Home = () => {
    const {isSheetOpen, openSheet, closeSheet} = useBottomSheet();
    const [currentPage, setCurrentPage] = useState(0);
    const buildingsPerPage = 4;
    const navigate = useNavigate();
    const [data, setData] = useState({
        buildingLocation: "",
        roomList: [],
        otherBuildingList: [],
        reservationInfo: {},
        reservationStatus: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchBoardData();
                const {buildingAndRoomList, otherBuildingList, reservationInfo} = res;
                const roomList = buildingAndRoomList.roomList;
                const buildingLocation = buildingAndRoomList.buildingLocation;
                const reservationStatus = reservationInfo.reservationStatus;
                setData({
                    buildingLocation,
                    roomList,
                    otherBuildingList,
                    reservationInfo,
                    reservationStatus
                });
            } catch (error) {
                console.error('Error fetching the data:', error);
            }
        };
        fetchData();
    }, []);

    /* select-box-items 클릭시 roomId param에 넣어 navigate */
    const useHandleMove = (roomId) => {
        navigate(`/reservation/${roomId}`);
    }


    const handleBuildingClick = async (buildingLocation) => {
        try {
            const updatedData = await updateBoardData(buildingLocation);

            setData(data => ({
                ...data,
                roomList: updatedData.roomList,
            }));
        } catch (error) {
            console.error('Error updating building data:', error);
        }
    }


    /* buildingLocation 4개씩 렌더링하기 */
    const renderBuildingList = () => {
        const start = currentPage * buildingsPerPage;
        const end = start + buildingsPerPage;
        let currentBuildingList = data.otherBuildingList.slice(start, end);

        return currentBuildingList.map((building, index) => (
            <button key={index} className="menu-items" onClick={() => handleBuildingClick(building)}>
                {building}
            </button>
        ));
    }

    /* 상단바 왼쪽 화살표 이벤트 */
    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0))
    }

    /* 상단바 오른쪽 화살표 이벤트 */
    const handleNextPage = () => {
        setCurrentPage(prevPage => {
            const nextPage = prevPage + 1;
            const totalPages = Math.ceil(data.otherBuildingList.length / buildingsPerPage);
            return nextPage >= totalPages ? 0 : nextPage;
        })
    }


    const renderRoomList = () => {
        return data.roomList.map((room) => {
            let bgColor;
            let barColor;
            if (0 < room.reservationRate && room.reservationRate <= 20) {
                bgColor = "#C1C7F3FF";
                barColor = "#848cda";
            } else if (room.reservationRate < 50) {
                bgColor = '#8b97f6';
                barColor = '#4e5fc1';
            } else if (room.reservationRate < 80) {
                bgColor = '#4e5fc1';
                barColor = '#2c3878';
            } else {
                bgColor = '#2c3878';
                barColor = '#161d42';
            }

            return (
                <div key={room.roomId} className="select-box-items" style={{backgroundColor: bgColor}}
                     onClick={() => useHandleMove(room.roomId)}>
                    <p className="bar" style={{backgroundColor: barColor}}></p>
                    <div style={{fontSize: '27px', color: "#393947"}}>{room.roomNo} </div>
                    <div style={{fontSize: '20px'}}>예약률<br/>
                        {room.reservationRate}%
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="Home">
            <div className="logout">
                <LogoutButton/>
            </div>
            <div className="s">
                <b>Please choose a place!!</b>

            </div>
            <div className="menu">
                <div className="arrow1"
                     onClick={handlePrevPage}>
                </div>
                <div id="buildingList" className="menu-items">
                    {renderBuildingList()}
                </div>
                <div className="arrow2" onClick={handleNextPage}>
                </div>
            </div>
            <div className="select-box">
                {renderRoomList()}
            </div>
            <div className="key" onClick={openSheet}>
                <p className='key1' style={{backgroundColor: data.reservationStatus ? '#6185E2' : '#C86661'}}></p>
                <img src={keyImage} alt="key" className="key_image"/>
            </div>
            {data.reservationStatus &&
                <BottomSheet open={isSheetOpen} onDismiss={closeSheet}>
                    <div style={{padding: '16px'}}>
                        <BottomSheetContent closeSheet={closeSheet} reservationInfo={data.reservationInfo}/>
                    </div>
                </BottomSheet>}
        </div>
    );
}

export default Home;