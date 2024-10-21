// 定义缓存键名
const CACHE_NAME = "v1.7.1";

// 需要缓存的文件列表
const urlsToCache = [
    "/",
    "/img/ic_public_error.svg",
];

// 需要排除的关键词
const EXCLUDED_KEYWORDS = [
    "api.fanstudio.tech",
    "api.rainviewer.com",
    "mobile-new.chinaeew.cn"
];

// 监听安装事件
self.addEventListener("install", event => {
    console.log("[SW] 安装服务工作线程");
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .catch(error => console.error(`[SW] 缓存静态资源失败 => ${error}`))
    );
});

// 监听激活事件
self.addEventListener("activate", event => {
    console.log("[SW] 激活中");
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                .map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            console.log("[SW] 旧缓存已清理");
        })
    );
});

// 接收消息事件
self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
        console.log("[SW] 更新成功");
    }
});

// 通知点击事件
self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: "window"
        }).then(clientList => {
            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});

// Fetch 事件
self.addEventListener("fetch", event => {
    event.respondWith(handleFetchRequest(event.request));
});

// 处理网络请求
async function handleFetchRequest(request) {
    const url = new URL(request.url);

    if (shouldExclude(url)) {
        console.log(`[SW] 这个不缓存 => ${url.href}`);
        return fetch(request).catch(() => caches.match("/index.html"));
    }

    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        updateCache(request);
        return responseFromCache;
    }

    try {
        const fetchResponse = await fetch(request);
        if (fetchResponse.ok && fetchResponse.status === 200 && request.method === "GET") {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, fetchResponse.clone());
            console.log(`[SW] 资源已缓存 => ${request.url}`);
        }
        return fetchResponse;
    } catch (error) {
        console.error(`[SW] 请求失败 => ${error}`);
        return caches.match("/index.html");
    }
}

// 检查 URL 是否应排除缓存
function shouldExclude(url) {
    return EXCLUDED_KEYWORDS.some(keyword => url.href.includes(keyword));
}

// 更新缓存
async function updateCache(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response);
        }
    } catch (error) {
        console.error(`[SW] 更新缓存失败 => ${error}`);
    }
}