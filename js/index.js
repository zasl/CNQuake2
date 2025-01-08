const ohcil = false;
const isGit = ohcil ? "v2.0.25" : "v2.0.git";
const version = isGit + "0108";

document.addEventListener("keydown", function (event) {
    // 禁用/放宽F12和Ctrl+Shift+I以及其他常见的调试快捷键
    if (
        event.key === "F12" ||
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "C" || event.key === "J"))
    ) {
        // event.preventDefault();
        toastr.warning("开发者模式已打开，请自重");
    }
});

async function isMobile() {
    const loadScript = async (src) => {
        return new Promise((resolve, reject) => {
            let script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.append(script);
        });
    }
    const isMobile1 = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile1) {
        try {
            await loadScript("https://cdn.jsdelivr.net/npm/eruda");
            eruda.init();
        } catch (error) {
            try {
                await loadScript("https://eruda.liriliri.io/eruda.js");
                eruda.init();
            } catch (fallbackError) {
                console.error("[添加eruda控制台] 脚本加载错误 =>", error, fallbackError);
            }
        }
    }
    return isMobile1;
}

isMobile().then(isMobile1 => {
    if (!isMobile1) document.addEventListener("contextmenu", event => event.preventDefault());
});
$("#vsiontext").text(version);
let homeLat = localStorage.getItem("latitude");
let homeLon = localStorage.getItem("longitude");
let homeLocte = localStorage.getItem("location");

if (!homeLat || !homeLon || !homeLocte) {
    homeLat = "31.08";
    homeLon = "104.38";
    homeLocte = "德阳市旌阳区";
    console.warn("[经纬度判定] 未设置设置,已默认");
    toastr.info("请到设置中填写您所在地地名及经纬度信息，否则默认为德阳市旌阳区")
}

// 检查浏览器是否支持serviceWorker
if ("serviceWorker" in navigator) {
    // 当窗口加载完毕时，注册serviceWorker并追踪安装中的worker
    window.addEventListener("load", () => {
        registerServiceWorker();
        trackInstallingWorker();
    });
}

// 显示自定义通知
function showCustomNotification(title, message) {
    // 检查浏览器是否支持serviceWorker和Notification API
    if ("serviceWorker" in navigator && "Notification" in window) {
        // 请求通知权限
        Notification.requestPermission().then(permission => {
            // 如果用户授予了权限
            if (permission === "granted") {
                // 等待serviceWorker就绪
                navigator.serviceWorker.ready.then(registration => {
                    // 显示通知
                    registration.showNotification(title, {
                        body: message,
                        icon: "./img/icon512.png",
                        data: {
                            url: "./"
                        }
                    });
                });
            } else {
                console.log("[通知显示] 用户拒绝了通知权限。");
            }
        }).catch(error => {
            console.error("[通知显示] 请求通知权限时发生错误：", error);
        });
    }
}

// 注册serviceWorker
function registerServiceWorker() {
    // 获取当前注册的serviceWorker
    navigator.serviceWorker.getRegistration().then(registration => {
        // 如果已经注册
        if (registration) {
            console.log("[注册SW] ServiceWorker已注册");
            // 如果有新的版本等待激活
            if (registration.waiting) {
                console.log("[注册SW] 有新的ServiceWorker");
                toastr.info("单击 更新 按钮以更新", "有更新可用");
                promptUpdate(registration.waiting);
            }
        } else {
            // 如果没有注册，注册serviceWorker
            navigator.serviceWorker.register("./sw.js").then(registration => {
                console.log("[注册SW] ServiceWorker 注册成功，作用域 =>", registration.scope);
            }).catch(error => {
                // 如果注册失败，记录错误
                console.error("[注册SW] ServiceWorker 注册失败 =>", error);
            });
        }
    });
}

// 追踪安装中的worker
function trackInstallingWorker() {
    // 当检测到更新时
    navigator.serviceWorker.addEventListener("updatefound", () => {
        // 获取注册信息
        navigator.serviceWorker.getRegistration().then(registration => {
            // 获取安装中的worker
            const installingWorker = registration.installing;
            // 监听worker状态变化
            installingWorker.addEventListener("statechange", () => {
                // 如果安装完成且没有控制该页面的worker
                if (installingWorker.state === "installed" && !navigator.serviceWorker.controller) {
                    promptUpdate(installingWorker);
                }
            });
        });
    });
}

// 提示更新
function promptUpdate(worker) {
    // 如果没有更新按钮
    if (!document.getElementById("updateButton")) {
        // 创建更新按钮
        const updateButton = document.createElement("button");
        updateButton.id = "updateButton";
        updateButton.textContent = "更新";
        // 点击按钮时，发送消息给worker以激活更新
        updateButton.addEventListener("click", () => {
            worker.postMessage({
                action: "skipWaiting"
            });
        });

        // 获取容器元素
        const container = document.getElementById("container");
        if (container) {
            // 将按钮添加到容器
            container.appendChild(updateButton);
        } else {
            // 如果找不到容器，记录错误
            console.error("[提示更新] 找不到ID为\"container\"的元素！");
        }
    }
}

// 监听controllerchange事件以处理更新
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        toastr.info("更新将在 手动刷新/重启应用程序 后生效", "发生Controllerchange事件");
    });
}

const intColor = {
    "1": {
        color: "white",
        backgroundColor: "#9e9e9e",
        oright: "#cecece",
    },
    "2": {
        color: "black",
        backgroundColor: "#9dc3e6",
        oright: "#5299db",
    },
    "3": {
        color: "white",
        backgroundColor: "#009cf4",
        oright: "#026fae",
    },
    "4": {
        color: "white",
        backgroundColor: "#115ff1",
        oright: "#0344bb",
    },
    "5": {
        color: "white",
        backgroundColor: "#46bc67",
        oright: "#308c4a"
    },
    "6": {
        color: "black",
        backgroundColor: "#ffc33f",
        oright: "#ca8f0f"
    },
    "7": {
        color: "white",
        backgroundColor: "#ff8400",
        oright: "#b05d05",
    },
    "8": {
        color: "white",
        backgroundColor: "#fa5151",
        oright: "#d64a4a",
    },
    "9": {
        color: "white",
        backgroundColor: "#ff5b27",
        oright: "#c2370d",
    },
    "10": {
        color: "white",
        backgroundColor: "#fe0007",
        oright: "#b50309"
    },
    "11": {
        color: "white",
        backgroundColor: "#c10004",
        oright: "#f70007"
    },
    "12": {
        color: "black",
        backgroundColor: "#fd00bd",
        oright: "#ab0281"
    }
};

//初始化地图
const map = new TMap.Map("map", {
    center: new TMap.LatLng(37.093496518166944, 107.79942839007867), //设置中心点坐标
    zoom: 4,
    mapStyleId: "style2"
});

// 卫星图
const imageTileLayer = new TMap.ImageTileLayer({
    getTileUrl: function (x, y, z) {
        return "https://bgn1.gpstool.com/maps/vt?lyrs=s&v=982&gl=cn&x=" + x + "&y=" + y + "&z=" + z;
    },
    tileSize: 256,
    minZoom: 10,
    maxZoom: 20,
    visible: true,
    zIndex: 0,
    opacity: 0.95,
    map: map,
});

// 获取数据的函数
async function fetchWeatherData() {
    try {
        const response = await fetch("https://api.rainviewer.com/public/weather-maps.json");
        const data = await response.json();

        // 从 satellite.infrared 中获取最新的时间戳数据
        const latestSatelliteData = data.satellite.infrared.reduce((latest, current) => {
            return (current.time > latest.time) ? current : latest;
        });

        // 返回最新的时间戳
        return latestSatelliteData ? latestSatelliteData.time : null;
    } catch (error) {
        console.error("[rainviewer] 获取天气数据时出错 =>", error);
        return null;
    }
}

let rainviewerLayer;
// 创建图层的函数
async function createImageTileLayer() {
    const latestTimestamp = await fetchWeatherData();

    if (latestTimestamp) {
        if (rainviewerLayer) {
            rainviewerLayer.destroy();
            rainviewerLayer = null;
        }
        // 创建新的图层
        rainviewerLayer = new TMap.ImageTileLayer({
            getTileUrl: function (x, y, z) {
                let url = "https://tilecache.rainviewer.com/v2/radar/" + latestTimestamp + "/512/" + z + "/" + x + "/" + y + "/4/1_1.png";
                return url;
            },
            tileSize: 256,
            minZoom: 0,
            maxZoom: 17,
            visible: true,
            zIndex: 0,
            opacity: 0.35,
            map: map,
        });
    } else {
        console.error("[创建天气图层] 无法获取最新的时间戳。");
    }
}

// 调用函数以创建图层
createImageTileLayer();
// 每 2 分钟更新一次图层
setInterval(createImageTileLayer, 120000); // 2分钟

const cencstyle = {
    "cencStyle1": new TMap.MarkerStyle({
        "width": 40,
        "height": 40,
        "anchor": {
            x: 20,
            y: 20
        },
        "src": "./img/history0.png"
    }),
    "cencStyle2": new TMap.MarkerStyle({
        "width": 35,
        "height": 35,
        "anchor": {
            x: 17.5,
            y: 17.5
        },
        "src": "./img/history1.png"
    }),
    "cencStyle3": new TMap.MarkerStyle({
        "width": 30,
        "height": 30,
        "anchor": {
            x: 15,
            y: 15
        },
        "src": "./img/historyF.png"
    }),
    "cencStyle": new TMap.MarkerStyle({
        "width": 25,
        "height": 25,
        "anchor": {
            x: 12.5,
            y: 12.5
        },
        "src": "./img/historyT.png"
    }),
}

const psWaveStyles = {
    ["pWave"]: new TMap.CircleStyle({
        "color": "rgba(41,91,255,0.16)",
        "showBorder": true,
        "borderColor": "rgba(41,91,255,1)",
        "borderWidth": 3,
    }),
    ["sWave"]: new TMap.CircleStyle({
        "color": "rgba(255, 165, 0, 0.16)",
        "showBorder": true,
        "borderColor": "rgba(255, 165, 0, 1)",
        "borderWidth": 3,
    }),
    ["sWaveX"]: new TMap.CircleStyle({
        "color": "rgba(255,0,0,0.16)",
        "showBorder": true,
        "borderColor": "rgba(255,0,0,1)",
        "borderWidth": 3,
    }),
}

const converter = OpenCC.Converter({
    from: "tw",
    to: "cn"
});
let delta, cencmd51, S波倒计时, oneAudio = false,
    CurrentTime, 更新秒数, cencMarkers = null,
    maxIntmarker = null,
    dingWern = false,
    eewBounds = false,
    scSta = false,
    twSta = false,
    seeScDepICL = false,
    marker = null,
    epicenteral = null,
    homeMarker = null,
    psWaveCircle = null,
    currentClickHandler = null,
    cencPopups = [],
    audioCENC = new Audio("./audio/CENC update.wav"),
    timeCs = true,
    currentTimestamp;
const warnJPcenters = ["台湾付近", "与那国島近海", "石垣島北西沖", "石垣島南方沖", "西表島付近", "石垣島近海", "宮古島近海"];

class HEQC {
    static SLOPE = [0.23335281, 0.23347212, 0.23335606, 0.23335613, 0.23335539, 0.23335367, 0.23335291];
    static INTERCEPT = [8.567052, 7.5333714, 6.667651, 8.562906, 7.877903, 7.191011, 6.5055184];
    static ARRAY = [
        [
            0.0, 22.264, 44.527, 66.79, 89.053, 111.314, 133.573, 155.832, 178.088, 200.342, 222.594,
            244.842, 267.088, 289.331, 311.57, 333.806, 356.037, 378.264, 400.486, 422.704, 444.916, 467.123,
            489.324, 511.519, 533.708, 555.891, 578.066, 600.235, 622.396, 644.55, 666.696, 688.834, 710.963,
            733.084, 755.196, 777.299, 799.392, 821.475, 843.548, 865.612, 887.664, 909.706, 931.737,
            953.756, 975.764, 997.759, 1019.743, 1041.714, 1063.673, 1085.618, 1107.551, 1129.469, 1151.375,
            1173.266, 1195.142, 1217.005, 1238.852, 1260.684, 1282.501, 1304.302, 1326.088, 1347.857, 1369.61,
            1391.346, 1413.065, 1434.767, 1456.452, 1478.118, 1499.767, 1521.397, 1543.009, 1564.602,
            1586.176, 1607.731, 1629.266, 1650.782, 1672.277, 1693.751, 1715.206, 1736.639, 1758.051,
            1779.442, 1800.811, 1822.158, 1843.482, 1864.785, 1886.064, 1907.321, 1928.554, 1949.764,
            1970.951, 1992.113, 2013.251, 2034.364, 2055.452, 2076.516, 2097.554, 2118.567, 2139.554,
            2160.514, 2181.449
        ],
        [
            0.0, 6.619, 13.238, 19.857, 26.476, 33.095, 39.714, 46.333, 51.444, 56.545, 61.646, 66.747,
            71.848, 76.949, 82.05, 87.15, 92.251, 97.352, 102.453, 107.554, 112.655, 117.756, 122.857,
            127.957, 133.058, 138.159, 143.26, 148.361, 153.462, 158.563, 163.663, 168.764, 173.865, 178.966,
            184.067, 189.168, 194.269, 199.37, 204.47, 209.571, 214.672, 219.773, 224.874, 229.975, 235.076,
            240.176, 245.277, 250.378, 255.479, 260.58, 265.681, 270.782, 275.882, 280.983, 286.084, 291.185,
            296.286, 301.387, 306.488, 311.589, 316.689, 321.79, 326.891, 331.992, 337.093, 342.194, 347.295,
            352.396, 357.496, 362.597, 367.698, 372.799, 377.9, 383.001, 388.102, 393.202, 398.303, 403.404,
            408.505, 413.606, 418.707, 423.808, 428.909, 434.009, 439.11, 444.211, 449.312, 454.413, 459.514,
            464.615, 469.716, 474.816, 479.917, 485.018, 490.119, 495.22, 500.321, 505.422, 510.523, 515.624,
            520.725
        ],
        [
            1.488, 6.807, 13.346, 19.911, 26.515, 33.11, 39.745, 45.417, 50.488, 55.613, 60.684, 65.8,
            70.917, 76.021, 81.095, 86.182, 91.322, 96.399, 101.49, 106.582, 111.681, 116.818, 121.929,
            126.99, 132.1, 137.192, 142.301, 147.404, 152.503, 157.606, 162.737, 167.834, 172.9, 178.001,
            183.117, 188.208, 193.3, 198.412, 203.502, 208.624, 213.713, 218.84, 223.942, 229.021, 234.134,
            239.244, 244.333, 249.427, 254.511, 259.628, 264.712, 269.821, 274.944, 280.043, 285.113,
            290.226, 295.319, 300.438, 305.562, 310.665, 315.765, 320.832, 325.938, 331.029, 336.156,
            341.256, 346.37, 351.454, 356.525, 361.647, 366.738, 371.866, 376.964, 382.067, 387.136, 392.269,
            397.362, 402.467, 407.557, 412.675, 417.757, 422.883, 427.936, 433.063, 438.138, 443.259, 448.36,
            453.482, 458.554, 463.648, 468.78, 473.872, 478.945, 484.079, 489.15, 494.257, 500.321, 505.422,
            510.523, 515.624, 520.725
        ],
        [
            2.976, 7.259, 13.567, 20.069, 26.647, 33.213, 39.344, 44.424, 49.543, 54.634, 59.775, 64.86,
            69.955, 75.037, 80.128, 85.261, 90.342, 95.439, 100.544, 105.649, 110.746, 115.884, 120.963,
            126.043, 131.172, 136.266, 141.386, 146.47, 151.554, 156.656, 161.748, 166.873, 171.985, 177.062,
            182.191, 187.259, 192.364, 197.497, 202.568, 207.661, 212.771, 217.892, 222.952, 228.06, 233.166,
            238.263, 243.393, 248.495, 253.575, 258.688, 263.798, 268.864, 273.986, 279.094, 284.164,
            289.287, 294.388, 299.51, 304.603, 309.694, 314.779, 319.886, 325.016, 330.118, 335.206, 340.312,
            345.408, 350.504, 355.625, 360.721, 365.82, 370.915, 376.025, 381.111, 386.203, 391.311, 396.402,
            401.523, 406.604, 411.716, 416.814, 421.893, 427.016, 432.121, 437.217, 442.3, 447.421, 452.517,
            457.61, 462.705, 467.796, 472.935, 478.007, 483.127, 488.235, 493.307, 498.446, 503.519, 508.616,
            513.739, 518.848
        ],
        [
            4.464, 7.978, 13.939, 20.351, 26.823, 33.387, 39.971, 46.348, 51.456, 56.542, 61.646, 66.762,
            71.841, 76.933, 82.047, 87.147, 92.235, 97.359, 102.459, 107.537, 112.663, 117.759, 122.861,
            127.945, 133.04, 138.142, 143.259, 148.341, 153.47, 158.54, 163.654, 168.788, 173.86, 178.971,
            184.047, 189.159, 194.289, 199.348, 204.467, 209.595, 214.678, 219.796, 224.858, 229.963,
            235.055, 240.158, 245.26, 250.393, 255.494, 260.602, 265.697, 270.77, 275.865, 280.979, 286.091,
            291.196, 296.281, 301.402, 306.487, 311.594, 316.679, 321.807, 326.899, 331.974, 337.077,
            342.209, 347.299, 352.403, 357.497, 362.59, 367.694, 372.785, 377.919, 382.976, 388.104, 393.188,
            398.307, 403.425, 408.527, 413.611, 418.688, 423.805, 428.92, 434.001, 439.118, 444.203, 449.331,
            454.404, 459.512, 464.596, 469.716, 474.804, 479.921, 485.044, 490.136, 495.232, 500.339,
            505.444, 510.501, 515.627, 520.723
        ],
        [
            5.801, 8.719, 14.355, 20.592, 27.027, 33.577, 40.088, 45.633, 50.735, 55.874, 60.958, 66.056,
            71.175, 76.238, 81.356, 86.451, 91.545, 96.677, 101.776, 106.861, 111.959, 117.053, 122.182,
            127.277, 132.358, 137.465, 142.576, 147.671, 152.797, 157.879, 162.983, 168.072, 173.199,
            178.289, 183.402, 188.458, 193.593, 198.668, 203.778, 208.906, 213.961, 219.093, 224.179,
            229.275, 234.363, 239.47, 244.581, 249.679, 254.802, 259.878, 265.009, 270.093, 275.203, 280.304,
            285.409, 290.513, 295.596, 300.688, 305.817, 310.901, 315.995, 321.105, 326.216, 331.322,
            336.409, 341.53, 346.613, 351.706, 356.801, 361.914, 367.015, 372.132, 377.223, 382.335, 387.417,
            392.51, 397.608, 402.718, 407.824, 412.931, 418.029, 423.111, 428.244, 433.316, 438.437, 443.516,
            448.631, 453.748, 458.812, 463.938, 469.022, 474.119, 479.24, 484.321, 489.419, 494.531, 499.638,
            504.737, 509.822, 514.944, 520.047
        ],
        [
            7.138, 9.589, 14.811, 20.862, 27.254, 33.734, 39.859, 44.984, 50.063, 55.148, 60.277, 65.397,
            70.479, 75.593, 80.666, 85.772, 90.857, 95.98, 101.062, 106.197, 111.292, 116.378, 121.482,
            126.578, 131.684, 136.789, 141.889, 146.99, 152.107, 157.194, 162.278, 167.404, 172.494, 177.603,
            182.698, 187.8, 192.879, 197.994, 203.095, 208.187, 213.277, 218.388, 223.494, 228.579, 233.704,
            238.813, 243.884, 248.998, 254.086, 259.189, 264.295, 269.385, 274.508, 279.594, 284.694,
            289.786, 294.935, 299.997, 305.096, 310.226, 315.296, 320.427, 325.512, 330.6, 335.72, 340.821,
            345.939, 351.023, 356.113, 361.199, 366.33, 371.445, 376.536, 381.624, 386.74, 391.85, 396.929,
            402.02, 407.151, 412.231, 417.325, 422.422, 427.513, 432.653, 437.76, 442.832, 447.955, 453.027,
            458.129, 463.224, 468.338, 473.436, 478.559, 483.661, 488.749, 493.868, 498.952, 504.027,
            509.167, 514.241, 519.359
        ],
        [
            8.475, 10.59, 15.353, 21.238, 27.517, 33.895, 39.203, 44.303, 49.377, 54.485, 59.586, 64.68,
            69.77, 74.896, 79.985, 85.081, 90.177, 95.275, 100.376, 105.489, 110.597, 115.697, 120.81,
            125.899, 131.022, 136.118, 141.173, 146.301, 151.4, 156.487, 161.586, 166.699, 171.792, 176.914,
            181.987, 187.127, 192.205, 197.301, 202.388, 207.502, 212.632, 217.719, 222.807, 227.919,
            232.995, 238.098, 243.221, 248.296, 253.402, 258.528, 263.606, 268.735, 273.841, 278.913,
            283.999, 289.118, 294.237, 299.331, 304.438, 309.539, 314.621, 319.727, 324.834, 329.95, 335.052,
            340.137, 345.242, 350.317, 355.446, 360.53, 365.656, 370.721, 375.816, 380.937, 386.029, 391.14,
            396.238, 401.34, 406.453, 411.565, 416.633, 421.769, 426.872, 431.96, 437.038, 442.14, 447.249,
            452.349, 457.469, 462.556, 467.64, 472.739, 477.865, 482.954, 488.063, 493.141, 498.281, 503.366,
            508.466, 513.553, 518.649
        ]
    ];

    // 静态方法计算倒计时秒数
    static getCountDownSeconds(depth, distance) {
        // 如果深度或距离小于0，则返回0
        if (depth < 0.0 || distance < 0.0) {
            return 0.0;
        }
        // 根据深度计算索引i，如果i大于6，则i设为6
        let i = Math.floor(depth / 5.0); // 假设深度为10 10/5=2 i=2
        if (i > 6) i = 6;
        // 获取数组ARRAY，并根据i获取对应的两个数组fArr2和fArr3
        let fArr = this.ARRAY;
        let i2 = 0;
        let fArr2 = fArr[0];
        let fArr3 = fArr[i + 1]; // 假设为2+1=3
        let length = fArr2.length - 1; // 总数？
        // 如果距离大于fArr2的最后一个元素，则使用斜率和截距计算倒计时
        if (distance > fArr2[length]) return (this.SLOPE[i] * distance) + this.INTERCEPT[i];
        // 如果距离与fArr2的最后一个元素之差小于0，则返回fArr3的最后一个元素
        if (Math.abs(distance - fArr2[length]) < 0.0) return fArr3[length];
        // 循环查找距离在fArr2中的位置
        while (i2 < length && distance >= fArr2[i2]) i2++;
        let i3 = i2 - 1;
        let i4 = i3 + 1;
        // 使用线性插值计算倒计时
        return fArr3[i3] + ((fArr3[i4] - fArr3[i3]) * ((distance - fArr2[i3]) / (fArr2[i4] - fArr2[i3])));
    }
}

async function getAllData() {
    const socket = new WebSocket("wss://ws-api.wolfx.jp/all_eew");

    socket.addEventListener("open", (allOpen) => {
        clearInterval(CurrentTime);
        CurrentTime = setInterval(getCurrentTime, 1000);

        console.log("[WebSocket消息] 已连接到 WebSocket.");
        toastr.success("已连接到 WebSocket.");

        setTimeout(() => {
            socket.send("query_cenceqlist");
            socket.send("query_jmaeew");
            socket.send("query_cwaeew");
            socket.send("query_fjeew");
            socket.send("query_sceew");
        }, 2000)

    });

    socket.addEventListener("message", (allMessage) => {
        let json = JSON.parse(allMessage.data);

        console.log("[WebSocket消息] wolfx =>", json);

        if (json.type == "heartbeat") {
            const sTimestamp = json.timestamp;
            delta = Date.now() - sTimestamp;
        }
        if (json.type == "sc_eew") {
            let time = json.OriginTime,
                center = json.HypoCenter,
                lat = json.Latitude,
                lon = json.Longitude,
                zhenji = json.Magunitude,
                whatbao = json.ReportNum,
                maxInt = json.MaxIntensity;
            eew(json.type, time, center, lat, lon, zhenji, whatbao, maxInt)
        }

        if (json.type == "fj_eew") {
            let timeFujian = json.OriginTime,
                centerFujian = json.HypoCenter,
                latFujian = json.Latitude,
                lonFujian = json.Longitude,
                zhenjiFujian = json.Magunitude,
                whatbaoFujian = json.ReportNum,
                isFinalFujian = json.isFinal;
            eew(json.type, timeFujian, centerFujian, latFujian, lonFujian, zhenjiFujian, whatbaoFujian, null, null, isFinalFujian)
        }

        if (json.type == "cwa_eew") {
            let timeTaiwan = json.OriginTime,
                centerTaiwan = json.HypoCenter,
                latTaiwan = json.Latitude,
                lonTaiwan = json.Longitude,
                zhenjiTaiwan = json.Magunitude,
                whatbaoTaiwan = json.ReportNum,
                depTaiwan = json.Depth,
                isCancelTaiwan = json.isCancel;
            eew(json.type, timeTaiwan, centerTaiwan, latTaiwan, lonTaiwan, zhenjiTaiwan, whatbaoTaiwan, null, depTaiwan);
            if (isCancelTaiwan) {
                toastr.info("中央气象署已取消发布的地震预警", "地震预警取消");
                eewCancel();
            }
        }

        if (json.type == "jma_eqlist") {
            toastr.info(`
                ${json.No1.Title}<br>
                发震时间: ${json.No1.time}(UTC+9)<br>
                震中: ${json.No1.location || "调查中"}（${json.No1.latitude || "?"}, ${json.No1.longitude || "?"}）<br>
                震级: ${json.No1.magnitude || "?"}<br>
                深度: ${json.No1.depth}<br>
                最大震度: ${json.No1.shindo}<br>
            `, "日本气象厅情报");
        }

        if (json.type == "jma_eew") {
            let timeJP = json.OriginTime,
                centerJP = json.Hypocenter,
                latJP = json.Latitude,
                lonJP = json.Longitude,
                zhenjiJP = json.Magunitude,
                whatbaoJP = json.Serial,
                depJP = json.Depth,
                maxIntJP = json.MaxIntensity,
                biaotiJP = json.Title,
                isCancelJP = json.isCancel,
                isFinalJP = json.isFinal,
                isWarnJP = json.isWarn;

            if (scSta || twSta) {
                eewToastr(false, timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, depJP, maxIntJP, biaotiJP, isCancelJP, isFinalJP);
            } else if (isWarnJP) {
                eew("jma_eew", timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, maxIntJP, depJP, isFinalJP);
                eewToastr(true, null, centerJP, null, null, null, null, depJP, null, null, null, null);
                if (isCancelJP) {
                    eewToastr(false, timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, depJP, maxIntJP, biaotiJP, isCancelJP, isFinalJP);
                    eewCancel();
                }
            } else if (warnJPcenters.includes(centerJP)) {
                centerJP = centerJP == "宮古島近海" ? "琉球群岛附近" : "中国台湾附近";
                eew("jma_tw_eew", timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, maxIntJP, depJP, isFinalJP);
                eewToastr(true, timeJP, centerJP, null, null, null, null, depJP, null, null, null, null);
                if (isCancelJP) {
                    eewToastr(false, timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, depJP, maxIntJP, biaotiJP, isCancelJP, isFinalJP);
                    eewCancel();
                }
            } else {
                eewToastr(false, timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, depJP, maxIntJP, biaotiJP, isCancelJP, isFinalJP);
            }
        }

        if (json.type == "cenc_eqlist") cencRun(json);
    });

    socket.addEventListener("error", (allError) => {
        console.error(`[WebSocket消息] 未能连接到 WebSocket. Code => ${allError.code}`);
        toastr.error("Code => " + allError.code, "未能连接到 WebSocket.");
    });

    socket.addEventListener("close", (allClose) => {
        console.error(`[WebSocket消息] 正在尝试重新连接到 WebSocket... Code => ${allClose.code}`);
        toastr.info("Code => " + allClose.code, "正在尝试重新连接到 WebSocket...");
        setTimeout(getAllData, 5000);
    });
}

const justTimeColor = () => $("#serverTime").css("color", timeCs ? "white" : "#f51c15");

let lastUpdateAt, lastUpdates, lastUpdateAtCea, lastUpdatesCea; // 用于存储上次更新的时间戳，以便比较是否有新的更新

function startCEEWNDataFetching() {
    const ciworker = new Worker("./js/ceewn.js");
    ciworker.onerror = (event) => {
        console.error("Worker error:", event);
    };
    ciworker.onmessage = (event) => {
        const eewData = event.data;
        if (eewData.type == "cea-bot") {
            ceaRun(eewData.data);
        } else if (eewData.type == "icl-bot" || eewData.type == "icl-official") {
            iclRun(eewData.data, eewData.type);
        } else if (eewData.type == "cea-error") {
            if (timeCs) {
                timeCs = false;
                justTimeColor();
            }
            console.error(eewData.data);
        }
    };
    const ceaRun = (eewData) => {
        let {
            shockTime: timeCEA,
            placeName: centerCEA,
            latitude: latCEA,
            longitude: lonCEA,
            magnitude: zhenjiCEA,
            depth: depCEA,
            updateAt: currentUpdateAt,
            updates: whatbaoCEA
        } = eewData.Data;
        if (lastUpdateAtCea !== currentUpdateAt || whatbaoCEA !== lastUpdatesCea) {
            console.log("[执行CEA] 调用eew"); // 打印调用信息
            lastUpdateAtCea = currentUpdateAt;
            lastUpdatesCea = whatbaoCEA;
            depCEA = depCEA ?? 0;
            eew("cea", timeCEA, centerCEA, latCEA, lonCEA, Number(zhenjiCEA), whatbaoCEA, null, depCEA);
        }
        if (!timeCs) {
            timeCs = true;
            justTimeColor();
        }
    };
}

function iclRun(json, type) {
    // 检查输入参数是否有效
    if (!json || typeof type !== "string") {
        console.error("[执行ICL] 参数无效"); // 如果参数无效，打印错误信息
        return; // 结束函数执行
    }

    // 定义一个内部函数来处理ICL数据
    const processData = (data) => {
        // 从数据中解构出需要的属性
        const {
            startAt: timeICL, // 地震发生时间
            epicenter: centerICL, // 震中
            latitude: latICL, // 纬度
            longitude: lonICL, // 经度
            magnitude: zhenjiICL, // 震级
            updates: whatbaoICL, // 更新信息
            depth: depICL, // 震源深度
            updateAt: currentUpdateAt // 数据更新时间
        } = data;

        // 如果当前更新时间与上次更新时间不同，说明有新数据
        if (currentUpdateAt !== lastUpdateAt || whatbaoICL !== lastUpdates) {
            console.log(`[执行ICL] ${type == "bot" ? "auto" : "official"}调用eew`); // 打印调用信息
            lastUpdateAt = currentUpdateAt; // 更新上次更新的时间戳
            lastUpdates = whatbaoICL;
            eew("icl", timeICL, centerICL, latICL, lonICL, zhenjiICL, whatbaoICL, null, depICL); // 调用eew函数
        }
        if (!timeCs) {
            timeCs = true;
            justTimeColor();
        }
    };

    // 根据类型处理不同的数据
    if (type == "icl-bot") processData(json.Data);
    else if (type == "icl-official") processData(json.data[0]);
    else console.error("[执行ICL] 类型不对？不可能吧？");
}

$(document).ready(() => {
    getAllData();
    if (ohcil) startCEEWNDataFetching();
    else console.warn("这是开源版本，不包含中国地震预警网信息源。");
});

const clickHandlers = {};
function cencRun(json) {
    const cencmd5 = json.No1.ReportTime;
    if (cencmd5 !== cencmd51) {
        cencmd51 = cencmd5;

        // 清除旧的标记和弹窗
        if (cencMarkers) {
            cencMarkers.setMap(null);
            cencMarkers = null;
            cencPopups.forEach(popup => popup.destroy());
            cencPopups = [];
        }

        const cencGeometries = [];

        for (let i = 1; i <= 50; i++) {
            const data = json[`No${i}`];
            const {
                type,
                depth,
                location,
                magnitude,
                latitude,
                longitude,
                time
            } = data;
            const listMaxInt = calcMaxInt(magnitude, depth, location);
            const listMaxInt2 = Math.floor(listMaxInt);
            const listDistance = Math.floor(getDistance(latitude, longitude, homeLat, homeLon));
            const listType = type === "automatic" ? "自动测定" : "正式测定";

            calclistEpicenterTopSize(location, i);
            $(`#listDistance${i}`).text(`${listDistance}km`);
            $(`#listDepth${i}`).text(`深度:${depth}km`);
            $(`#listEpicenter${i}`).text(location);
            const magColor = getMagnitudeColor(magnitude);
            $(`#listMagnitude${i}`).text(`M${magnitude}`).css("color", magColor);
            const thisbggcolor = intColor[listMaxInt2].oright;
            $(`#listMaxInt${i}`).text(listMaxInt2).css({
                "background-color": intColor[listMaxInt2].backgroundColor,
                "color": intColor[listMaxInt2].color,
                "border": `3px solid ${thisbggcolor}`
            });
            const listTimeDisply = cencTimeDisply(time);
            $(`#listTime${i}`).text(listTimeDisply);
            const listBar = document.getElementById(`list_Bar${i}`);

            listBar.style.border = (i === 1 ? "2px solid " : "1px solid ") + thisbggcolor;
            if (clickHandlers[`No${i}`]) listBar.removeEventListener("click", clickHandlers[`No${i}`]);
            clickHandlers[`No${i}`] = createClickHandler(new TMap.LatLng(latitude, longitude));
            listBar.addEventListener("click", clickHandlers[`No${i}`]);

            if (i === 1) handleFirstItem(listType, time, listTimeDisply, location, latitude, longitude, magnitude, depth, listMaxInt);
            else $(`#listType${i}`).text(`No.${i}`);

            const popup = createPopup(i, thisbggcolor, listType, time, location, latitude, longitude, magnitude, depth, listMaxInt);
            cencPopups.push(popup);

            const cencGeo = {
                "id": `cencMarker_${i}`,
                "styleId": `cencStyle${i <= 3 ? i : ""}`,
                "position": new TMap.LatLng(latitude, longitude),
                "properties": {
                    "title": "cencMarker"
                }
            };
            cencGeometries.push(cencGeo);

            if (i === 50) {
                cencMarkers = new TMap.MultiMarker({
                    map: map,
                    styles: cencstyle,
                    geometries: cencGeometries
                }).on("click", function (e) {
                    const index = cencGeometries.findIndex(g => g.id === e.geometry.id);
                    if (index !== -1) cencPopups[index].open();
                });
            }
        }
    }
}

function createClickHandler(listCoor) {
    return function () {
        map.easeTo({
            center: listCoor,
            zoom: 7
        });
    };
}

function getMagnitudeColor(magnitude) {
    if (magnitude < 3.5) return "#B2D4F2";
    if (magnitude < 4) return "#4fa6f3";
    if (magnitude < 5) return "#fec118";
    if (magnitude < 6) return "#fb8a23";
    return "#f7455c";
}

function handleFirstItem(listType, listTime, listTimeDisply, location, latitude, longitude, magnitude, depth, listMaxInt) {
    $("#listType1").text(listType);
    if (!oneAudio) {
        oneAudio = true;
        showCustomNotification("📩 通知已开启", "如果看到此信息，表明预警信息推送已开启。");
    } else {
        audioCENC.play();
        const cencType = `中国地震台网 ${listType}`;
        const cencShow = `${listTimeDisply} 在 ${location} 发生${magnitude}级地震，震源深度${depth}km，预估最大烈度${listMaxInt}度`;
        showCustomNotification(`${listType == "正式测定" ? "🔔" : "📨"} ${cencType}`, cencShow);
        tts(null, null, null, `${cencType}：${cencShow}`);
    }
    eew("cenc", listTime, location, parseFloat(latitude), parseFloat(longitude), parseFloat(magnitude), listType, null, parseFloat(depth), null, !oneAudio);
}

function createPopup(i, thisbggcolor, listType, time, location, latitude, longitude, magnitude, depth, listMaxInt) {
    const popup = new TMap.InfoWindow({
        map: map,
        enableCustom: true,
        position: new TMap.LatLng(latitude, longitude),
        offset: {
            x: 0,
            y: -15
        },
        content: `
            <div class="popup-content" style="border: 2px solid ${thisbggcolor}">
                <div style="text-align: center; font-size: 18px; padding-top: 16px;">中国地震台网 ${listType}${i > 1 ? "#" + i : "⚡"}</div>
                <p>时间：${time}</p>
                <p>震中：${location}</p>
                <p>纬度：${latitude}</p>
                <p>经度：${longitude}</p>
                <p>震级：${magnitude} 级</p>
                <p>深度：${depth} km</p>
                <p>预估最大烈度：${listMaxInt}</p>
            </div>
        `
    });
    popup.close();
    return popup;
}

function calcMaxInt(Magnitude, Depth, Location = null) {
    Magnitude = Number(Magnitude);
    Depth = Number(Depth);

    // 定义默认常量
    let a = 3.944,
        b = 1.071,
        c = 1.2355678010148,
        d = 7;

    // 特定位置的处理
    if (Location) {
        if (Location.includes("四川") || Location.includes("西藏") || Location.includes("青海")) {
            a = 3.6113;
            b = 1.4347;
            c = 1.6710348780191;
            d = 13;
        } else if (Location.includes("新疆")) {
            a = 3.3682;
            b = 1.2746;
            c = 1.4383398946154;
            d = 9;
        }

        // 针对特定城市的额外调整
        if (Location.includes("内江市") || Location.includes("宜宾市")) {
            a = 3.6588;
            b = 1.3626;
            c = 1.5376630426267;
            d = 13;
        }
    }

    // 计算最大烈度
    const logTerm = Math.log(d * (Depth + 25) / 40),
        maxInt = (a + b * Magnitude - c * logTerm + 0.2).toFixed(1);

    // Math.floor();
    return maxInt;
}

function Rad(d) {
    return d * Math.PI / 180;
}

function getDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = Rad(lat1);
    let radLat2 = Rad(lat2);
    let a = radLat1 - radLat2;
    let b = Rad(lng1) - Rad(lng2);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math
        .sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s;
}

function formatDateTime(dateObj, format) {
    const padZero = (num) => (num < 10 ? "0" + num : String(num));

    const year = dateObj.getFullYear();
    const month = padZero(dateObj.getMonth() + 1);
    const day = padZero(dateObj.getDate());
    const hours = padZero(dateObj.getHours());
    const minutes = padZero(dateObj.getMinutes());
    const seconds = padZero(dateObj.getSeconds());

    return format
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day)
        .replace("hh", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);
}

function timeaddz(time, z) {
    // 仅匹配一个特定的wolfx时间格式 YYYY/MM/DD HH:MM:SS
    return time.replace(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/, `\$1-\$2-\$3T\$4+0${z}:00`);
}

function cencTimeDisply(cenctime) {
    let dateObj = new Date(timeaddz(cenctime, 8));
    return formatDateTime(dateObj, "MM月DD日 hh:mm");
}

function eewTimeDisplay(type, eewTime, epucenter = null) {
    if (epucenter && epucenter.length >= 9) type = "bf_eew";
    let dateObj = new Date(eewTime);
    switch (type) {
        case "cn_eew":
            return formatDateTime(dateObj, "hh时mm分ss秒");
        case "bf_eew":
            return formatDateTime(dateObj, "hh:mm:ss");
        case "inform":
            return formatDateTime(dateObj, "hh:mm");
        default:
            console.log(`[格式化eew时间] 无效的时间 => ${type}, ${eewTime}`);
            return null;
    }
}

function currentTimeDisplay(timestamp) {
    let dateObj = new Date(timestamp);
    return formatDateTime(dateObj, "YYYY/MM/DD hh:mm:ss");
}

function getCurrentTime() {
    currentTimestamp = Date.now() - delta + 1000;
    let date_str = currentTimeDisplay(currentTimestamp);
    document.getElementById("serverTime").innerText = date_str;
}

function calclistEpicenterTopSize(epicenter, locate) {
    epicenter.length >= 12 ? $("#listEpicenter" + locate).css("top", "23px") : $("#listEpicenter" + locate).css("top", "26px");
}

function easeTo() {
    if (!eewBounds) {
        map.easeTo({
            center: new TMap.LatLng(37.093496518166944, 107.79942839007867),
            zoom: 4
        })
    } else {
        fitWaveBounds()
    }
}

const closeCencPopups = () => {
    for (i = 0; i < 50; i++) cencPopups[i].close();
};

function eewToastr(warn, timeJP, centerJP, latJP, lonJP, zhenjiJP, whatbaoJP, depJP, maxIntJP, biaotiJP, isCancelJP, isFinalJP) {
    timeJP = new Date(timeaddz(timeJP, 9)).getTime();
    if (currentTimestamp - timeJP > 300000) return;
    timeJP = eewTimeDisplay("bf_eew", timeJP);

    if (!warn) {
        const reportType = isFinalJP ? `最终第${whatbaoJP}报` : isCancelJP ? `取消第${whatbaoJP}报` : `第${whatbaoJP}报`;
        const message = `
            ${biaotiJP} ${reportType}<br>
            ${timeJP} 发生<br>
            震中: ${centerJP}（${latJP}, ${lonJP}）<br>
            震级: M${zhenjiJP}<br>
            深度: ${depJP}km<br>
            最大震度: ${maxIntJP}
        `;
        toastr.info(message, "日本气象厅预警");
    } else {
        const message = `${centerJP} 深度${depJP}km`;
        toastr.info(message, "深度");
    }

}

// 凌晨 Sep 9, 2024 本来想class EpicenterMarker extends TMap.DOMOverlay但是最终效果还是不如官方的
function EpicenterMarker(options) {
    let epicenterDom;
    TMap.DOMOverlay.call(this, options);
}
EpicenterMarker.prototype = new TMap.DOMOverlay();

// 初始化
EpicenterMarker.prototype.onInit = function (options) {
    this.position = options.position;
}

// 创建
EpicenterMarker.prototype.createDOM = function () {
    epicenterDom = document.createElement("img"); // 新建一个img的dom
    epicenterDom.src = "./img/Source-Copy.png";
    epicenterDom.style.cssText = `
            position: absolute;
            width: 70px;
            height: 70px;
    `; // 这里改了改
    epicenterDom.classList.add("fade"); // 这里也改了改
    return epicenterDom;
}

// 更新DOM元素，在地图移动/缩放后执行
EpicenterMarker.prototype.updateDOM = function () {
    if (!this.map) return; // 我缩写成了一行
    let pixel = this.map.projectToContainer(this.position); // 经纬度坐标转容器像素坐标
    let left = pixel.getX() - this.dom.clientWidth / 2 + "px";
    let top = pixel.getY() - this.dom.clientHeight / 2 + "px";
    // 使用top/left将DOM元素定位到指定位置
    this.dom.style.top = top;
    this.dom.style.left = left;
}

let hasExecuted = false;
let visibilityChangeHandlerAdded = false; // 标志变量
let eventHandler = null; // 用于存储事件处理函数

function vceewcd(distance, depth, cd) {
    if (document.visibilityState === "visible" && eewBounds) {
        if (!hasExecuted) {
            console.log("[预警是否在前台] 回到了前台，重新计算倒计时");
            S波倒计时 = countdown(distance, depth, cd);
            hasExecuted = true; // 设置标志变量为 true
        } else {
            console.log("[预警是否在前台] 在前台(忽略了)")
        }
    } else {
        console.log("[预警是否在前台] 不在前台(在后台)");
        hasExecuted = false; // 当页面不可见时，重置标志变量
    }
}

// 本预警函数特地典型使用中文变量名，清晰易懂awa
function eew(类型, 发震时间, 震中, lat, lon, 震级, 多少报, 最大烈度, 深度 = null, 最终 = null, isOneCENC = true) {
    if (类型 !== "icl" && 类型 !== "jma_eew" && 类型 !== "jma_tw_eew") 发震时间 = new Date(timeaddz(发震时间, 8)).getTime();
    else if (类型 == "jma_eew" || 类型 == "jma_tw_eew") 发震时间 = new Date(timeaddz(发震时间, 9)).getTime();
    let 时差 = currentTimestamp - 发震时间;
    console.log(`[eew] 时差 => ${时差}`);

    if (时差 <= 300000 || (eewBounds && 类型 == "cenc")) {
        if (类型 == "icl" && scSta || 类型 == "icl" && twSta) {
            console.log(`[eew] 省地震局正在预警，ICL无需插手 => ${类型} ${震中} ${深度}km`);
            if (scSta) {
                let 距离 = getDistance(lat, lon, homeLat, homeLon);
                S波倒计时 = countdown(距离, 深度, 时差 / 1000);
                toastr.info(`#${多少报} ${震中} M${震级} 深度 ${深度}km"`, "中国地震预警网");
                seeScDepICL = 深度;
            }
            return;
        }

        震级 = 震级.toFixed(1);
        if (类型 == "cwa_eew") {
            震中 = "台湾" + converter(震中);
            震级 -= 1;
        }
        if (类型 == "fj_eew" && 震中.length > 10) 震中 = 震中.replace("附近海域", "近海");
        let 距离 = getDistance(lat, lon, homeLat, homeLon),
            本地烈度 = calcHomeMaxInt(震级, 距离),
            格式化发震时间 = eewTimeDisplay("cn_eew", 发震时间, 震中),
            sourceText,
            通知时间 = eewTimeDisplay("inform", 发震时间),
            message = `${通知时间} ${震中} 附近发生${震级}级左右地震，震中距你${距离.toFixed(0)}km，本地预估烈度${本地烈度}`;

        switch (类型) {
            case "sc_eew":
                sourceText = `四川地震局预警 第${多少报}报`;
                playAudio(scSta ? "更新" : "alert");
                scSta = true;
                break;
            case "fj_eew":
            case "cwa_eew":
                sourceText = 类型 === "fj_eew" ? `福建地震局预警 ${最终 ? "最终第" : "第"}${多少报}报` : `台湾气象署预警 ${最终 ? "最终第" : "第"}${多少报}报`;
                playAudio(twSta ? "更新" : "alert");
                twSta = true;
                break;
            case "icl":
                sourceText = `中国地震预警网 第${多少报}报`;
                playAudio(eewBounds ? "更新" : "alert");
                break;
            case "cea":
                sourceText = `中国地震局预警 第${多少报}报`;
                playAudio(eewBounds ? "更新" : "alert");
                break;
            case "cenc":
                sourceText = `中国地震台网 ${多少报}`;
                break;
            case "jma_tw_eew":
                sourceText = `日本气象厅预警 ${最终 ? "最终第" : "第"}${多少报}报`;
                playAudio("更新");
                break;
            case "jma_eew":
                sourceText = `日本气象厅警报 ${最终 ? "最终第" : "第"}${多少报}报`;
                playAudio("更新");
                break;
            default:
                console.error(`[eew] 类型不对 => ${类型}`);
                break;
        }

        $("#eew_source").text(sourceText);
        if (isOneCENC) showCustomNotification(`${本地烈度 > 0 ? "🚨" : "⚠️"} ${sourceText}`, message);

        if (最大烈度 == null) 最大烈度 = "约" + calcMaxInt(震级, 10, 震中);

        const 信息2 = (类型 == "fj_eew" || 类型 == "sc_eew") ?
            "震中烈度" + 最大烈度 + "度" :
            (类型 == "jma_eew" || 类型 == "jma_tw_eew") ?
                "最大震度" + 最大烈度 :
                "震源深度" + 深度.toFixed(0) + "km",
            size = 震中.length >= 12 ? "p2" : "p1";

        // 填入预警框
        if (本地烈度 >= 3) {
            let textWarn, bgcolorRGB, warnLevel;
            if (本地烈度 < 5) {
                textWarn = "震感强烈";
                bgcolorRGB = "rgba(250, 211, 10, 0.77)";
                warnLevel = "黄色预警";
            } else if (本地烈度 < 7) {
                textWarn = "可能有破坏";
                bgcolorRGB = "rgb(254, 135, 30, 0.77)";
                warnLevel = "橙色预警";
            } else {
                textWarn = "强破坏";
                bgcolorRGB = "rgba(249, 70, 91, 0.77)";
                warnLevel = "红色预警";
            }
            $("#eew_Information").html(`<div style="display: flex; justify-content: space-between;"><${size}>${震中}</${size}>${格式化发震时间} </div>
		  	发生<b>${震级}级</b>地震, ${信息2} <br>
		  	<b>本地烈度${本地烈度}度, ${textWarn}</b>`);
            $("#eew_Bar").css("background", `linear-gradient(${bgcolorRGB}, #00000000)`);
            dingWern = warnLevel;
        } else {
            $("#eew_Information").html(`<div style="display: flex; justify-content: space-between;"><${size}>${震中}</${size}>${格式化发震时间} </div>
           发生<b>${震级}级</b>地震, ${信息2} <br>
           <b>本地烈度${本地烈度}度, ${本地烈度 == 0 ? "无震感" : (本地烈度 < 2 ? "可能有震感" : "震感轻微")}</b>`);
            $("#eew_Bar").css("background", `linear-gradient(rgba(82, 165, 243, ${本地烈度 == 0 ? 0.28 : 0.77}), #00000000)`);
            dingWern = false;
        }

        clearInterval(更新秒数);
        if (scSta && twSta) toastr.warning("四川和台湾同时预警，我们不知所措");
        // 难道就真的不允许地球同时在四川和台湾地震吗？就不能多震适配吗？
        if (epicenteral) {
            epicenteral.destroy();
            epicenteral = null
        }
        locteMaxint(lon, lat, 震级);
        const positions = new TMap.LatLng(lat, lon),
            S波的样式 = 震级 < 5 ? "sWave" : "sWaveX";
        if (!psWaveCircle) {
            psWaveCircle = new TMap.MultiCircle({
                map,
                styles: psWaveStyles,
                geometries: [{
                    styleId: "pWave",
                    center: positions,
                    radius: 7
                },
                {
                    styleId: S波的样式,
                    center: positions,
                    radius: 4
                }
                ],
            });
        }
        epicenteral = new EpicenterMarker({
            map,
            position: positions
        });

        S波倒计时 = null;
        eewBounds = true;
        // 在创建 setInterval 之前移除已有的监听器
        if (eventHandler) {
            document.removeEventListener("visibilitychange", eventHandler);
            visibilityChangeHandlerAdded = false; // 重置标志变量
        }
        更新秒数 = setInterval(() => {
            const 实时时差 = currentTimestamp - 发震时间,
                发震时间减去秒数 = 实时时差 / 1000;

            if (seeScDepICL) 深度 = seeScDepICL;
            // 添加事件监听器
            if (!visibilityChangeHandlerAdded) {
                eventHandler = vceewcd.bind(距离, 深度, 发震时间减去秒数);
                document.addEventListener("visibilitychange", eventHandler);
                visibilityChangeHandlerAdded = true; // 设置标志变量为 true
            }

            S波倒计时 = S波倒计时 ? S波倒计时 - 1 : countdown(距离, 深度, 发震时间减去秒数);
            const 计算好的P波半径 = calcWaveDistance(true, 深度, 发震时间减去秒数) * 1000,
                计算好的S波半径 = calcWaveDistance(false, 深度, 发震时间减去秒数) * 1000;

            setSmoothRadius(psWaveCircle, 计算好的P波半径, 计算好的S波半径, positions, S波的样式);

            if (S波倒计时 <= 0) {
                $("#eew_countdown").text("到达");
                $("#eew_wavedown").text(`地震横波已到达 ${homeLocte}`);
                $("#miaohou").css("visibility", "hidden");
            } else {
                $("#eew_countdown").text(S波倒计时);
                $("#eew_wavedown").text(`地震横波将到达 ${homeLocte}`);
                $("#miaohou").css("visibility", "visible");
            }

            if (本地烈度 > 0) {
                if (S波倒计时 > 0 && S波倒计时 < 100) {
                    playAudio(S波倒计时);
                } else if (Object.is(S波倒计时, 0)) {
                    playAudio("抵达");
                } else if (S波倒计时 >= -10 && S波倒计时 < 0) {
                    if (!dingWern) {
                        playAudio("ding")
                    } else if (S波倒计时 == -1 || S波倒计时 == -6) {
                        playAudio("wearing")
                    }
                }
            }

            if (S波倒计时 % 10 == 0) fitWaveBounds(本地烈度);
            if (实时时差 >= 300000 && S波倒计时 <= -10) eewCancel();
        }, 1000);

        $("#eew_Bar, #mapLegend").css("visibility", "visible");
        if (本地烈度 > 0) addHomeToMap();
        S波倒计时 = countdown(距离, 深度, 时差 / 1000);
        $("#eew_countdown").text(S波倒计时);
        if (isOneCENC && (本地烈度 == 0 || S波倒计时 > 35 || S波倒计时 < 0)) tts(sourceText, 震中, 震级);
        else if (isOneCENC && S波倒计时 > 0) toastr.warning("时间紧迫，请立即采取措施！", "请注意");
        S波倒计时 = null;
        setTimeout(() => fitWaveBounds(本地烈度), 1000);
    } else {
        类型 == "icl" ?
            console.log(`[eew] 预警发震时间超过5分钟，预警信息无效。${currentTimeDisplay(发震时间)}发生，调用请输入 => eew("${类型}", ${发震时间}, "${震中}", ${lat}, ${lon}, ${震级}, ${多少报}, ${最大烈度}, ${深度})`) :
            console.log(`[eew] 预警发震时间超过5分钟，预警信息无效。调用请输入 => eew("${类型}", "${currentTimeDisplay(发震时间)}", "${震中}", ${lat}, ${lon}, ${震级}, ${多少报}, ${最大烈度}, ${深度}, ${最终})`);
    }
}

function eewCancel() {
    $("#eew_Bar, #mapLegend").css("visibility", "hidden");
    document.removeEventListener("visibilitychange", eventHandler);
    clearInterval(更新秒数);
    更新秒数 = null;
    eewBounds = false;
    twSta = false;
    scSta = false;
    seeScDepICL = false;
    S波倒计时 = null;
    setTimeout(() => {
        if (maxIntmarker) maxIntmarker.destroy();
        epicenteral.destroy();
        psWaveCircle.destroy();
        maxIntmarker = null;
        epicenteral = null;
        psWaveCircle = null;
    }, 1000);
    easeTo();
}

function countdown(distance, depth, ctime) {
    depth = depth ?? 10;
    const cds = HEQC.getCountDownSeconds(depth, distance),
        countdowns = cds - ctime;
    return Math.floor(countdowns);
    // parseInt((distance + depth) / 4 - ctime);
}

function calcWaveDistance(isPWave, depth, time) {
    depth = depth ?? 10;
    const {
        depths,
        distances
    } = travelTimes;
    const data = isPWave ? travelTimes.p_times : travelTimes.s_times;

    // 使用二分查找找到合适的深度索引
    let depthIndex = binarySearch(depths, depth);

    const times = data[depthIndex];
    const timesLength = times.length;

    // 如果时间小于等于第一个时间点，直接返回结果
    if (time <= times[0]) {
        const reach = times[0] - time;
        const waveType = isPWave ? "P" : "S";
        toastr.info(`距离该波到达地表还有 ${reach}s`, `${waveType}波还没到地表`);
        console.log(`[计算波的半径] ${waveType}波还没到地表 => 距离到达地表还有 ${reach}s`);
        return 0;
    }

    // 使用二分查找找到合适的时间索引
    let timeIndex = binarySearch(times, time);

    // 计算距离
    const k = (distances[timeIndex] - distances[timeIndex - 1]) / (times[timeIndex] - times[timeIndex - 1]);
    const b = distances[timeIndex] - k * times[timeIndex];
    const distance = k * time + b;

    return distance;
}

// 二分查找函数
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }

    // 返回最接近但不超过目标值的索引
    return left - 1;
}

const MAX_DIFF = 50000;
const STEPS = 60;

function setSmoothRadius(psWaveCircle, pWaveRadius, sWaveRadius, centers, sWaveStyle) {
    if (!psWaveCircle) {
        console.log(`[平滑震波] ${psWave} 不在了 =>`, circle);
        return;
    }

    const geometries = psWaveCircle.getGeometries();
    let pWaveNowRadius = geometries[0].radius,
        sWaveNowRadius = geometries[1].radius;

    const diffp = pWaveRadius - pWaveNowRadius;
    const diffs = sWaveRadius - sWaveNowRadius;

    // 如果差值太大，直接设置目标半径而不进行平滑过渡
    if (Math.abs(diffp) > MAX_DIFF || Math.abs(diffs) > MAX_DIFF) {
        psWaveCircle.setGeometries([{
            styleId: "pWave",
            center: centers,
            radius: pWaveRadius
        },
        {
            styleId: sWaveStyle,
            center: centers,
            radius: sWaveRadius
        }
        ]);
        return;
    }

    // 计算步长
    const stepp = diffp / STEPS;
    const steps = diffs / STEPS;

    const updateRadius = () => {
        pWaveNowRadius += stepp;
        sWaveNowRadius += steps;

        if (psWaveCircle) {
            psWaveCircle.setGeometries([{
                styleId: "pWave",
                center: centers,
                radius: pWaveNowRadius
            },
            {
                styleId: sWaveStyle,
                center: centers,
                radius: sWaveNowRadius
            }
            ]);
        }

        // 继续更新半径，直到达到目标半径
        if (Math.abs(pWaveNowRadius - pWaveRadius) > Math.abs(stepp) || Math.abs(sWaveNowRadius - sWaveRadius) > Math.abs(steps)) {
            requestAnimationFrame(updateRadius);
        }
    };

    requestAnimationFrame(updateRadius);
}

function calcHomeMaxInt(震级, 距离) {
    let 本地烈度 = ((震级 * 1.363) + 2.941) - (Math.log(距离 + 7.0) * 1.494);
    // 本地烈度可视化
    本地烈度 = 本地烈度 < 0 ? "0.0" : 本地烈度 >= 0 && 本地烈度 < 12 ? 本地烈度.toFixed(1) : 本地烈度 >= 12 ? "12" : null;
    return 本地烈度;
}

function locteMaxint(lon, lat, magnitude) {
    if (maxIntmarker) {
        maxIntmarker.destroy();
        maxIntmarker = null;
    }

    let distanceGround = Math.exp(((magnitude * 1.363) + 2.941) / 1.494) - 7.0; // 受灾区域
    let geometries = []; // 用于存储所有标记的几何信息

    for (let i = 0; i < locte.data.length; i++) {
        let Longround = locte.data[i].longitude;
        let Latground = locte.data[i].latitude;
        let groundDistance = getDistance(lat, lon, Latground, Longround); // 与震中的距离
        // 城市是否在受灾区域里?在的话就标记:不在的话我没标记啊哈哈哈哈
        if (groundDistance < distanceGround) {
            geometries.push(createGeometry(Longround, Latground, magnitude, groundDistance));
        }
    }

    if (geometries.length > 0) addIntToMap(geometries);
}

function createGeometry(Longround, Latground, magnitude, groundDistance) {
    let maxInt = calcHomeMaxInt(magnitude, groundDistance);
    return {
        "id": "markerInt_" + Longround + "_" + Latground,
        "styleId": "markerInt_" + parseInt(maxInt), // 根据 maxInt 生成不同的 styleId
        "position": new TMap.LatLng(Latground, Longround),
        "properties": {
            "title": "烈度" + parseInt(maxInt)
        }
    };
}

function addIntToMap(geometries) {
    let maxInt = Math.max(...geometries.map(geo => parseInt(geo.styleId.split("_")[1])));
    let styles = {};
    for (let i = 0; i <= maxInt; i++) {
        styles["markerInt_" + i] = new TMap.MarkerStyle({
            "width": 24,
            "height": 24,
            "anchor": {
                x: 12,
                y: 12
            },
            "src": `./img/${i}.png`
        });
    }

    maxIntmarker = new TMap.MultiMarker({
        map: map,
        styles: styles,
        geometries: geometries
    });
}

// 设置代码
let settingsIcon = document.getElementById("settings-icon");
let overlay = document.getElementById("overlay");
let settingsBox = document.getElementById("settings-box");
let saveButton = document.getElementById("save-settings");
let cancelButton = document.getElementById("cancel-settings");
let longitudeInput = document.getElementById("longitude");
let latitudeInput = document.getElementById("latitude");
let locationInput = document.getElementById("location");

// 点击设置图标
settingsIcon.addEventListener("click", function () {
    overlay.style.display = "block";
    settingsBox.style.display = "block";

    // 淡入效果
    overlay.style.opacity = "0";
    let fadeEffect = setInterval(function () {
        if (overlay.style.opacity < 1) overlay.style.opacity = parseFloat(overlay.style.opacity) + 0.1;
        else clearInterval(fadeEffect);
    }, 50);

    // 获取本地存储的设置值
    longitudeInput.value = localStorage.getItem("longitude");
    latitudeInput.value = localStorage.getItem("latitude");
    locationInput.value = localStorage.getItem("location");
});

// 点击保存按钮
saveButton.addEventListener("click", function () {
    // 获取输入框的值
    let longitudeValue = longitudeInput.value.trim();
    let latitudeValue = latitudeInput.value.trim();
    let locationValue = locationInput.value.trim();

    // 检查是否全部填写
    if (longitudeValue === "" || latitudeValue === "" || locationValue === "") {
        toastr.warning("请填写完整信息");
        return;
    }

    if (locationValue.length > 7) {
        toastr.warning("地名别太详细了，会超框的...XX市XX区/县 就够了");
        return;
    }

    // 检测经纬度是否符合常规
    let longitudeFloat = parseFloat(longitudeValue);
    let latitudeFloat = parseFloat(latitudeValue);
    if (isNaN(longitudeFloat) || isNaN(latitudeFloat) || longitudeFloat < -180 || longitudeFloat > 180 ||
        latitudeFloat < -90 || latitudeFloat > 90) {
        toastr.warning("请填写正确的经纬度");
        return;
    }

    // 存储设置值到localStorage
    localStorage.setItem("longitude", longitudeValue);
    localStorage.setItem("latitude", latitudeValue);
    localStorage.setItem("location", locationValue);
    homeLat = localStorage.getItem("latitude");
    homeLon = localStorage.getItem("longitude");
    homeLocte = localStorage.getItem("location");
    addHomeToMap();
    console.log(`[设置] 已设置新的家 => 纬度:${homeLat} 经度:${homeLon} 地名:${homeLocte}`);
    // 关闭设置界面
    overlay.style.display = "none";
    settingsBox.style.display = "none";
    if (eewBounds) location.reload();
});

// 点击取消按钮
cancelButton.addEventListener("click", function () {
    // 关闭设置界面
    overlay.style.display = "none";
    settingsBox.style.display = "none";
});

function addHomeToMap() {
    if (homeMarker !== null) {
        homeMarker.setMap(null);
        homeMarker = null;
    }

    homeMarker = new TMap.MultiMarker({
        map: map,
        styles: {
            "marker": new TMap.MarkerStyle({
                "width": 25,
                "height": 25,
                "anchor": {
                    x: 12.5,
                    y: 12.5
                }, // 描点位置
                "src": "./img/home_awa.svg"
            })
        },

        geometries: [{
            "id": "demo",
            "styleId": "marker",
            "position": new TMap.LatLng(homeLat, homeLon),
            "properties": {
                "title": "marker"
            }
        }]
    })
}

addHomeToMap();

function getWaveBounds(latitude, longitude, radius) {
    // 地球半径，单位为米
    const earthRadius = 6371e3;

    // 转换为弧度
    const lat = latitude * Math.PI / 180;
    const lon = longitude * Math.PI / 180;

    // 计算半径对应的角度（弧度）
    const angularDistance = radius / earthRadius;

    // 计算东北角坐标
    const northeastLat = Math.asin(Math.sin(lat) * Math.cos(angularDistance) +
        Math.cos(lat) * Math.sin(angularDistance) * Math.cos(0));
    const northeastLon = lon + Math.atan2(Math.sin(0) * Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(northeastLat));

    // 计算西南角坐标
    const southwestLat = Math.asin(Math.sin(lat) * Math.cos(angularDistance) +
        Math.cos(lat) * Math.sin(angularDistance) * Math.cos(Math.PI));
    const southwestLon = lon + Math.atan2(Math.sin(Math.PI) * Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(southwestLat));

    // 转换回角度
    const northeast = {
        latitude: northeastLat * 180 / Math.PI,
        longitude: northeastLon * 180 / Math.PI
    };

    const southwest = {
        latitude: southwestLat * 180 / Math.PI,
        longitude: southwestLon * 180 / Math.PI
    };

    // 处理超出范围的问题
    northeast.latitude = Math.min(90, Math.max(-90, northeast.latitude));
    northeast.longitude = ((northeast.longitude + 540) % 360) - 180;
    southwest.latitude = Math.min(90, Math.max(-90, southwest.latitude));
    southwest.longitude = ((southwest.longitude + 540) % 360) - 180;

    return {
        northeast,
        southwest
    };
}

function fitWaveBounds(localInt = null) {
    let pWavelat = psWaveCircle.geometries[0].center.lat,
        pWavelon = psWaveCircle.geometries[0].center.lng,
        pWaveradius = psWaveCircle.geometries[0].radius,
        Bounds = getWaveBounds(pWavelat, pWavelon, pWaveradius),
        easeop = localInt > 0 ? 0 : 5000;

    map.fitBounds(
        new TMap.LatLngBounds(
            new TMap.LatLng(Bounds.southwest.latitude - 1, Bounds.southwest.longitude - 1),
            new TMap.LatLng(Bounds.northeast.latitude + 1, Bounds.northeast.longitude + 1)
        ), {
        ease: {
            duration: easeop
        }
    }
    );
}

const audioFiles = {
    "alert": "./audio/alert.wav",
    "更新": "./audio/eew update.wav",
    "ding": "./audio/ding.ogg",
    "wearing": "./audio/wearing.wav",
    "抵达": "./audio/arrive.mp3",
    "didi": "./audio/didi.mp3",
    "di": "./audio/di.mp3"
};

const digitAudioFiles = {
    "0": "./audio/0.mp3",
    "1": "./audio/1.mp3",
    "2": "./audio/2.mp3",
    "3": "./audio/3.mp3",
    "4": "./audio/4.mp3",
    "5": "./audio/5.mp3",
    "6": "./audio/6.mp3",
    "7": "./audio/7.mp3",
    "8": "./audio/8.mp3",
    "9": "./audio/9.mp3",
    "10": "./audio/10.mp3",
    "12": "./audio/12.mp3",
    "14": "./audio/14.mp3",
    "16": "./audio/16.mp3",
    "18": "./audio/18.mp3",
    "20": "./audio/20.mp3",
    "22": "./audio/22.mp3",
    "24": "./audio/24.mp3",
    "26": "./audio/26.mp3",
    "28": "./audio/28.mp3",
    "30": "./audio/30.mp3",
    "40": "./audio/40.mp3",
    "50": "./audio/50.mp3",
    "60": "./audio/60.mp3",
    "70": "./audio/70.mp3",
    "80": "./audio/80.mp3",
    "90": "./audio/90.mp3",
    "100": "./audio/100.mp3"
};

let isSpeaking = false;

function playAudio(number) {
    if (typeof number === "string" && audioFiles[number]) {
        playAudioFile(audioFiles[number]);
        return;
    }

    if (isSpeaking && number % 10 !== 0) return; // 避免在tts时播报其他的

    if (typeof number !== "number" || isNaN(number)) {
        console.error(`[音频播放] 输入的数字无效 => ${number}`);
        return;
    }

    let numberStr = number.toString();

    if (numberStr.length === 1) playSingleDigit(numberStr);
    else if (numberStr.length === 2 || numberStr === "100") playTwoDigits(numberStr);
    else console.error(`[音频播放] 发生了不可能发生的错误 -> 怎么回事？`);
}

function playAudioFile(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
}

function playSingleDigit(digit) {
    if (digitAudioFiles[digit]) {
        playAudioFile(digitAudioFiles[digit]);
    } else {
        console.error(`[音频播放-单数字] 未找到数字 ${digit} 的音频文件。`);
    }
}

function playTwoDigits(numberStr) {
    const number = parseInt(numberStr, 10);

    if (number >= 10 && number < 30) {
        if (number % 2 === 0) playAudioFile(digitAudioFiles[numberStr]);
        else if (dingWern) playWarningAudio(dingWern);
    } else if (number >= 30) {
        if (number % 10 === 0) playAudioFile(digitAudioFiles[numberStr]);
        else if (dingWern) dingWernTts();
    } else {
        console.error(`[音频播放-双数字] 未找到数字 ${digit} 的音频文件。`);
    }
}

function playWarningAudio(warningType) {
    const warnAudio = warningType === "橙色预警" || warningType === "红色预警" ? "didi" : "di";
    playAudioFile(audioFiles[warnAudio]);
}

function dingWernTts() {
    const messages = {
        "黄色预警": "强有感地震，请注意防范",
        "橙色预警": "破坏性地震，请立即避险",
        "红色预警": "严重破坏性地震，请紧急避险"
    };

    if (messages[dingWern]) tts(null, null, null, messages[dingWern]);
}

function tts(biaoti, location, magnitude, cenc = null) {
    isSpeaking = true;
    let textToSpeak = (location !== null) ? (biaoti + "，" + location + magnitude + "级") : cenc;
    let utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = function () {
        isSpeaking = false;
    };
    window.speechSynthesis.speak(utterance);
}