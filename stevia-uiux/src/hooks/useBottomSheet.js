import { useState } from "react";

/**
 * 바텀시트의 상태를 관리하는 커스텀 훅
 *
 * @returns {Object} 바텀시트의 상태와 제어 함수들을 포함하는 객체입니다.
 * @returns {boolean} isSheetOpen - 바텀시트가 열려 있는지 여부를 나타내는 상태 값
 * @returns {Function} openSheet - 바텀시트를 여는 함수
 * @returns {Function} closeSheet - 바텀시트를 닫는 함수
 */
const useBottomSheet = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openSheet = () => {
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return {
    isSheetOpen,
    openSheet,
    closeSheet,
  };
};

export default useBottomSheet;
