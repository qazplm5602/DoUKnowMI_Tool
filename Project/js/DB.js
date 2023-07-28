const domiDB = {
    projectName: "domi",
    size: 4,
    player: [0,0],
    data: {},
}

let SaveFilePath;
let SaveDiff = false;

const Enemy_List = {
    sinchamgisa: [
        "신참 기사",
        "test.gif",
        []
    ],
    archer: [
        "궁병",
        "test.gif",
        [
            [0,-1]
        ]
    ],
    shield: [
        "방패병",
        "test.gif",
        [
            [0,-1],
            [-1,-1],
            [1,-1]
        ]
    ],
    spearman: [
        "창술사",
        "test.gif",
        [
            [0,1],
            [0,-1]
        ]
    ]
}