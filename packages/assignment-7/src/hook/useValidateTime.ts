import {useState} from "react";

const useValidateTime = () => {
    const [startTimeError, setStartTimeError] = useState<string | null>(null);
    const [endTimeError, setEndTimeError] = useState<string | null>(null);

    const validateTime = (start: string, end: string) => {
        if (!start || !end) return;

        const startDate = new Date(`2000-01-01T${start}`);
        const endDate = new Date(`2000-01-01T${end}`);

        if (startDate >= endDate) {
            setStartTimeError("시작 시간은 종료 시간보다 빨라야 합니다.");
            setEndTimeError("종료 시간은 시작 시간보다 늦어야 합니다.");
        } else {
            setStartTimeError(null);
            setEndTimeError(null);
        }
    };

    return {
        startTimeError,
        setStartTimeError,
        endTimeError,
        setEndTimeError,
        validateTime
    }
}

export default useValidateTime