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
        // 尝试访问第一个URL
        let response = await fetch(iclOL);
        if (response.ok) {
            let icljson = await response.json();
            console.log("[轮询ICL] wind =>", icljson);
            postjson = {
                type: "icl-bot",
                data: icljson
            }
            self.postMessage(postjson);

        } else {
            // 如果第一个URL失败，则抛出错误
            throw new Error("咦？第一不行，推动完整");
        }
    } catch (error) {
        // 捕获错误，尝试访问第二个URL;
        try {
            let response = await fetch(iclOA);
            if (response.ok) {
                let icljson = await response.json();
                console.log("[轮询ICL] 访问官方 =>", icljson);
                postjson = {
                    type: "icl-official",
                    data: icljson
                }
                self.postMessage(icljson, "icl");
            } else {
                // 如果第二个URL也失败，则处理错误或抛出异常
                console.error("[轮询ICL] 1 -> 不是网络问题就是官方出事了");
            }
        } catch (error) {
            // 如果第二个请求也失败，则处理错误
            console.error("[轮询ICL] 2 -> 那就是不是网络问题就是官方出事了 =>", error);
        }
    }
}

async function getCeaData() {
    try {
        let response = await fetch(ceaOL);
        if (response.ok) {
            let ceajson = await response.json();
            console.log("[轮询CEA] ", ceajson);
            postjson = {
                type: "cea-bot",
                data: ceajson
            }
            self.postMessage(postjson);

        } else {
            throw new Error("server cea_error");
        }
    } catch (error) {
        postjson = {
            type: "cea-error",
            data: "server cea_error"
        }
        self.postMessage(postjson);
    }
}

setInterval(() => {
    getCeaData();
    getICLData();
}, 5000);