//숫자 3자리 단위마다 콤마(comma) 찍기
function numComma(x) {
    if (typeof x === "number") {
        if (x || x == 0) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return "";
        }
    } else {
        // 정규식을 사용하여 세 자리마다 쉼표 추가
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export { numComma };
