import { useState, useCallback } from "react";
import { MeowButton, BarkButton } from "./UseCallbackTest.components.tsx";

function UseCallbackTest() {
    const [meowCount, setMeowCount] = useState(0);
    const [barkedCount, setBarkedCount] = useState(0);

    //컴포넌트 첫 mount시 1회만 생성
    const handleMewCnt = useCallback(() => {
        setMeowCount((n) => n + 1);
    }, []);

    const handleBarkCnt = useCallback(() => {
        setBarkedCount((n) => n + 1);
    }, []);

    return (
        <div>
            <p data-testid="cat">meowCount {meowCount}</p>
            <p data-testid="dog">barkedCount {barkedCount}</p>
            <MeowButton onClick={handleMewCnt} />
            <BarkButton onClick={handleBarkCnt} />
        </div>
    );
}

export default UseCallbackTest;
