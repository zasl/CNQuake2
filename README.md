# CNQuake2
基于[`HTML`](https://developer.mozilla.org/zh-CN/docs/Web/HTML)+[`JavaScript`](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript)+[`css`](https://developer.mozilla.org/zh-CN/docs/Web/CSS)的一个中国地震信息可视化[`PWA`](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)软件
如果此软件侵犯了您的权益，请发[`Issue`](https://github.com/thefirsttime2021/CNQuake2/issues/new)或 联系我 liujh5913@petalmail.com
将会尽快处理

## 注意
需要在一个`https`环境里运行，且需要[`SSL`](https://info.support.huawei.com/info-finder/encyclopedia/zh/SSL.html)证书，不能以`file`打开，因为有以下几点：
1. 腾讯地图不允许，因为[`CORS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)跨域问题，否则地图上的所有图标都为默认`Marker`。
2. 只有安全的连接才能使用`PWA`和[`Service worker`](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)，才能发送通知。

### 准备开发的功能
1. 设置-本地烈度触发阀值
2. 多震适配
3. 用[`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)画地震波，而不是用官方的[`MultiCircle`](https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocVector#13)，要贴合地球。
4. **以上还是你们来写吧**

### 存在的一些问题
1. 腾讯地图的圆是标准的圆，并没有贴和地球，到了北边的地方没有畸变，不符合地震波传播的路径。
2. 由于腾讯地图的圆不是贴和地球的圆，而且圆没有`getCircleBounds()`，所以`getWaveBounds()`是自行写的，地图越缩小视角的中心就越靠北。

### 部分连接需要自己去补充
例如[ICL API](http://www.365icl.com/index.asp)、繁转简API

## 免责声明
请勿完全依赖此软件，由于依赖此软件造成的问题作者概不负责。
由于此软件造成的任何人力物力财力等损失与作者无关

## API 源 使用
[Wolfx 防灾API](https://wolfx.jp/apidoc)
