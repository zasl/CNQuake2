const iclOA = "";
// 格式要求
// {
    // "code": 0,
    // "message": "",
    // "data": [
        // {
            // "eventId": 86634748,
            // "updates": 3,
            // "latitude": 28.798416,
            // "longitude": 87.623375,
            // "depth": 8,
            // "epicenter": "西藏拉孜",
            // "startAt": 1736279572050,
            // "updateAt": 1736279588953,
            // "magnitude": 4.000001,
            // "insideNet": 0,
            // "sations": 5,
            // "sourceType": "meihuan",
            // "epiIntensity": 0,
            // "counties": […]
        // }
        // {…}
        // {…}*N个
    // ]
// }
const iclOL = "";
// 格式要求 
// {
    // "Data": {
        // "eventId": 86634748,
        // "updates": 3,
        // "latitude": 28.798416,
        // "longitude": 87.623375,
        // "depth": 8,
        // "epicenter": "西藏拉孜",
        // "startAt": 1736279572050,
        // "updateAt": 1736279588953,
        // "magnitude": 4,
        // "insideNet": 0,
        // "sations": 5,
        // "sourceType": "meihuan",
        // "epiIntensity": 0
    // },
    // "md5": "57907c595c933179309e5deaebf5ce0d"
// }
const ceaOL = "";
// 格式要求
// {
  // "Data": {
    // "id": "bwnsjeog75oyy",
    // "eventId": "20250107153655.0001",
    // "shockTime": "2025-01-07 15:36:57",
    // "updateTime": "2025-01-07 15:37:10",
    // "longitude": 102.017,
    // "latitude": 29.626,
    // "placeName": "四川甘孜州泸定县",
    // "magnitude": "3.2",
    // "epiIntensity": 5,
    // "depth": 8,
    // "updates": 3
  // }
// }
let postjson;

async function getICLData() {
    try {
        const response = await fetch(iclOL);
        if (response.ok) {
            const icljson = await response.json();
            console.log("[轮询ICL] wind =>", icljson);
            postjson = {
                type: "icl-bot",
                data: icljson
            };
            self.postMessage(postjson);
        } else {
            throw new Error(`[轮询ICL] wind => 网络响应不正常 (${ response.status } ${ response.statusText })`);
        }
    } catch (error) {
        console.error(error);
        try {
            const response = await fetch(iclOA);
            if (response.ok) {
                const icljson = await response.json();
                console.log("[轮询ICL] 访问官方 =>", icljson);
                postjson = {
                    type: "icl-official",
                    data: icljson
                };
                self.postMessage(postjson);
            } else {
                throw new Error(`[轮询ICL] 访问官方 => 网络响应不正常 (${ response.status } ${ response.statusText })`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function getCeaData() {
    try {
        const response = await fetch(ceaOL);
        if (response.ok) {
            const ceajson = await response.json();
            console.log("[轮询CEA]", ceajson);
            postjson = {
                type: "cea-bot",
                data: ceajson
            };
            self.postMessage(postjson);
        } else {
            throw new Error(`[轮询CEA] 网络响应不正常 (${ response.status } ${ response.statusText })`);
        }
    } catch (error) {
        postjson = {
            type: "cea-error",
            data: error
        };
        self.postMessage(postjson);
    }
}

setInterval(() => {
    getCeaData();
    getICLData();
}, 5000);