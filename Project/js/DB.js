const domiDB = {
    projectName: "domi",
    size: 4,
    player: [0,0],
    data: {
        "2,2": {
            character: "empty"
        },
        "1,2": {
            character: "domi"
        },
    },
}

let SaveFilePath;
let SaveDiff = true;

const Enemy_List = {
    empty: [
        "테스트 이재용",
        "test.gif",
        [
            [0,-1],
        ]
    ],
    domi: [
        "도미인뎅",
        "test.gif",
        [
            [-1,0]
        ]
    ]
}