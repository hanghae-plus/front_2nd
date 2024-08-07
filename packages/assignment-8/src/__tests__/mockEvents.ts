export const mockEvents = [
    {
        "id": 6,
        "title": "FIRST TEST",
        "description": "알림 테스트1",
        "location": "알림 테스트1",
        "category": "개인",
        "repeat": {
            "type": "none",
            "interval": 1
        },
        "notificationTime": 10,
        "date": "2024-08-02",
        "startTime": "20:50",
        "endTime": "21:50"
    },
    {
        "id": 7,
        "title": "SECOND TEST",
        "description": "알림 테스트2",
        "location": "알림 테스트2",
        "category": "개인",
        "repeat": {
            "type": "none",
            "interval": 1
        },
        "notificationTime": 10,
        "date": "2024-08-03",
        "startTime": "20:50",
        "endTime": "21:50"
    }
]

// 테스트 케이스 에서 활용할 Mock데이터
export const testData = {
    "title": "테스트 일정",
    "description": "일정추가",
    "location": "테스트 지역",
    "category": "개인",
    "repeat": {
        "type": "none",
        "interval": 1
    },
    "notificationTime": 10,
    "date": "2024-08-04",
    "startTime": "20:40",
    "endTime": "21:40"
};
export const testData2 = {
    "title": "테스트 일정2",
    "description": "일정추가",
    "location": "테스트 지역",
    "category": "개인",
    "repeat": {
        "type": "none",
        "interval": 1
    },
    "notificationTime": 1,
};