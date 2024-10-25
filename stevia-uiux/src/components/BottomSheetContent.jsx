import React, {useEffect, useState} from 'react';
import '../styles/BottomSheetContent.css';
import character1 from '../assets/character1.png';
import character2 from '../assets/character2.png';
import locationIcon from '../assets/location.png';
import ThrowKey from '../assets/ThrowKey.png';
import initialReservation from '../../src/utils/ReservationTime.js';
import {useDispatch, useSelector} from "react-redux";
import {deleteKey, fetchKey, updateKey} from "../feature/apis/keyApi.js";
import {clearReserveId} from "../feature/slice/reserveIdSlice.js";

const BottomSheetContent = ({closeSheet, reservationInfo}) => {
    const reserveId = useSelector((state) => state.reserveId.reserveId);
    const [keyStatus, setKeyStatus] = useState(true);
    const dispatch = useDispatch();

    /**
     * 키 상태 조회 api 요청
     */
    useEffect(() => {
        const fetchData = async () => {
            if (!reserveId) {
                console.warn("reserveId is null or undefined");
                return; // fetchData를 수행하지 않음
            }
            try {
                const res = await fetchKey(reserveId);
                setKeyStatus(res.image_status);
            } catch (error) {
                console.error("fetchData key error", error);
            }
        };
        fetchData();
    }, []);

    /**
     * 키 상태 업데이트 api 요청
     * 키 true일 경우 updateApi
     * 키 false일 경우 deleteApi
     */
    const onChangeKeyStatus = async () => {
        if (!reserveId) {
            console.warn("reserveId is null or undefined");
            return;
        }
        try {
            if (keyStatus) {
                const res = await updateKey(reserveId);
                setKeyStatus(res.image_status);
                alert(`대여를 완료했습니다.`);
                setKeyStatus(false);
            } else {
                const res = await deleteKey(reserveId);
                setKeyStatus(res);
                alert(`반납을 완료했습니다.`);
                dispatch(clearReserveId());
                closeSheet();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const splitTimes = reservationInfo.usageTime.split(',').map(Number);
    const selectedTimes = initialReservation
        .filter(reservation => splitTimes.includes(reservation.id))
        .map(reservation => reservation.time);


    return (
        <div className="bottom-sheet">
            <div className="arrow-container">
                <button onClick={closeSheet}>▼</button>
            </div>
            <div className="content-container">
                <div className="character">
                    <img className="keyImg" src={keyStatus ? null : ThrowKey}/>
                    <img className="characterImg" alt="character" onClick={onChangeKeyStatus}
                         src={keyStatus ? character1 : character2}/>
                    <p>{reservationInfo.name} 예약 현황</p>
                </div>
                <div className="reservation-info1">
                    <div className="location1">
                        <img src={locationIcon} alt="Location" className="location-icon"/>
                        <p>{reservationInfo.buildingLocation} - {reservationInfo.roomNo}</p>
                    </div>
                    <div className="reservation-time1">
                        <p>{new Date().getFullYear()}.{new Date().getMonth() + 1}.{new Date().getDate()}</p>
                        <div style={{color: '#466384'}}> {selectedTimes.map((i, index) => (
                            <div key={index}>{i}</div>
                        ))
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomSheetContent;
