import roomImg from "../assets/room1.png";
import location from "../assets/location.png";
import done from "../assets/done.png";
import "../styles/Reservation.css"
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import initialReservation from "../../src/utils/ReservationTime.js";
import {fetchReserveData, postReserveData} from "../feature/apis/reservationApi.js";
import {useDispatch} from "react-redux";
import {setReserveId} from "../feature/slice/reserveIdSlice.js";


const Reservation = () => {
    const navigate = useNavigate();
    const {roomId} = useParams();
    const [reservation, setReservation] = useState(initialReservation);
    const [splitTimes, setSplitTimes] = useState([]);
    const [selectId, setSelectId] = useState("");
    const MAX_SELECT_COUNT = 3;
    const [data, setData] = useState({
        roomNo: 0,
        reservedTimes: "",
        roomImageUrl: "",
        buildingLocation: "",
        buildingName: ""
    })
    const dispatch = useDispatch();

    const useHandleMove = () => {
        navigate("/");
    }

    const HandlePost = async () => {
        const usageTime = selectId.join(',');
        try {
            const response = await postReserveData(roomId, usageTime);
            const reserveId = response.reserveId;
            // reserveId 값 redux에 저장하기
            dispatch(setReserveId(reserveId));
            alert(`예약을 완료했습니다.`);

        } catch (error) {
            console.log('handlePost error', error);
        }
        navigate("/");
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!roomId) {
                console.error("roomId is not defined");
                return;
            }

            try {
                const res = await fetchReserveData(roomId);
                const {roomNo, reservedTimes, roomImageUrl, buildingLocation, buildingName} = res;
                setData({
                    roomNo,
                    reservedTimes,
                    roomImageUrl: roomImageUrl ? `http://task-api.wisoft.io/stevia/${roomImageUrl}` : "",
                    buildingLocation,
                    buildingName,
                });
                const splitTimes = reservedTimes.split(',').map(Number);
                const updatedReservations = reservation.map(reservation => {
                    if (splitTimes.includes(reservation.id)) {
                        return {...reservation, reserved: false};
                    } else {
                        return reservation;
                    }
                });

                setReservation(updatedReservations);
                setSplitTimes(splitTimes);

            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [roomId]);

    const onUpdate = async (targetId) => {
        console.log(targetId);
        if (splitTimes.includes(targetId)) {
            return; // splitTimes에 포함된 ID는 클릭할 수 없음
        }

        const updatedClick = reservation.map((slot) =>
            slot.id === targetId ? {...slot, click: !slot.click} : slot
        );

        setReservation(updatedClick);
        console.log(reservation);

        setSelectId(prev => {
            const currentCount = prev.length;
            if (currentCount >= MAX_SELECT_COUNT) {
                alert(`최대 ${MAX_SELECT_COUNT}시간까지만 선택할 수 있습니다.`);
                return prev;
            }

            if (prev.includes(targetId)) {
                return prev.filter(id => id !== targetId);
            } else {
                return [...prev, targetId];
            }
        });
    };


    return (
        <div className="reservation">
            <div className="roomImg" alt="room" style={{backgroundImage: `url(${data.roomImageUrl})`}}>
                <div className="arrow" onClick={useHandleMove}></div>
                <div className="reservation-board">
                    <div className="reservation-location">
                        <img className="locationImg" src={location} alt="location"/>
                        <p>한밭대학교 유성덕명캠퍼스 {data.buildingName}<br/>{data.buildingLocation} {data.roomNo}</p>
                    </div>

                    <div className="reservation-time">
                        <div className="reservation-info">
                            <div
                                className="date">Today<br/>{new Date().getFullYear()}.{new Date().getMonth() + 1}.{new Date().getDate()}
                            </div>
                            <img className="done-button" src={done} alt="done" onClick={HandlePost}/>
                        </div>
                        <div className="reservation-time-slot">
                            {reservation.map((slot, id) => (
                                <div key={id}
                                     className={`timeSlot ${slot.reserved ? 'no-reserved' : 'reserved'}  ${slot.click ? 'no-clicked' : 'clicked'} } `}
                                     onClick={() => onUpdate(slot.id)}>
                                    {slot.time}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Reservation;
