# 村花杨老师

使用微信扫码即可体验
![ycy](https://github.com/hengzi/ycy-taro/blob/master/src/assert//ycy.jpeg)

## 声明

【村花杨老师】小程序所有素材资源均来源于互联网，仅供学习交流，不用于商业用途。如有侵权，可联系作者删除。

## 动机

今年 3 月初，在知乎和 github(github.com/ccyyycy/ycy) 上看到了 **"Hello YCY"** 编程比赛，因为对小程序开发比较熟悉，而且一直想学习一下小程序的云开发，加上在之前公司做过很多基于人脸识别相关的项目，很快构思了一个小程序的雏形，并着手开发。

遗憾的是报名表没有通过审核，原因是可能存在侵权风险，于是就放弃参赛，但还是把这个想法做了出来。

## 设计

在小程序交互设计上参考了抖音 APP，首页可以浏览已经上传的杨超越的照片，通过上拉和下拉操作进行切换。用户还可以自己上传杨超越的图片，上传之后进行人脸验证，只有验证是杨超越的照片才能被其他用户看到。

除了上述核心功能，原来还计划加入点赞、评论、转发分享、排行榜、个人中心等功能，但由于审核问题和个人精力等原因，未继续开发。

## 开发

### 框架

目前有很多成熟的小程序开发框架，相比小程序原生开发，可以提升不少开发效率。
在本项目中选用了 **Taro + Taro-UI**：一方面是因为 Taro 可以同时支持微信、支付宝、百度等多个小程序端，生态也比较完善；另一方面是因为还没用过这个框架，这也是主要原因。

### 云开发

小程序·云开发是微信与腾讯云联合开发的原生 **Serverless** 云服务，具备简化运维、高效鉴权等优势，其官方描述如下：

> 开发者可以使用云开发开发微信小程序、小游戏，无需搭建服务器，即可使用云端能力。
>
> 云开发为开发者提供完整的云端支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代，同时这一能力，同开发者已经使用的云服务相互兼容，并不互斥。
>
> 目前提供三大基础能力支持：
>
> - 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写自身业务逻辑代码
> - 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 数据库
> - 存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理

从去年下半年云开发开始公测时便一直关注，甚至还注册了一个名为【云开发】的小程序，也正是【村花杨老师】的前身。今年 3 月初，【云开发】这个名称被以“涉嫌与平台内已有帐号存在混淆或误认”原因回收了，可以在菜单-关于-更多资料中看到记录。

### 人脸验证

在小程序中用到了对照片的人脸验证功能，采用了腾讯 AI 开放平台提供的 API。除了人脸和人体识别外，腾讯 AI 开放平台还提供了 OCR、图片特效、语言识别和合成、机器翻译等诸多功能，对于个人开发者或小公司接入 AI 相关服务足够了。

### 交互实现

小程序主页采用类似抖音上拉、下拉切换的效果，小程序提供了 swiper 和 swiper-item 组件，仅使用这两个组件即可实现这种效果，但当 swiper-item 数量足够多时，必然导致卡顿，用户体验较差。于是想到用有限的几个（0~5) swiper-item 实现任意数量滚动列表，基本原理如下：

- 当列表数量 n < 6 时，使用 n 个 swiper-item，即常规用法；
- 当列表数量 n >= 6 时，根据 n%3 的值进行分类，即 3m、3m+1、3m+2 这三种情况：
  1. 当 n=3m 时，使用 3 个 swiper-item 循环 m 次即可实现；
  2. 当 n=3m+1 时，前 3\*(m-1)使用 3 个 swiper-item 循环，后 4 个使用 4 个 swiper-item；
  3. 当 n=3m+2 时，前 3\*(m-1)使用 3 个 swiper-item 循环，后 5 个使用 5 个 swiper-item；
- 在首次进入或完成切换后计算所有 swiper-item 应该显示的内容，以及判断当前位置是否采用衔接滑动（circular）；
- 注意：用户连续快速上拉或下拉时，bindanimationfinish 事件可能无法触发，因此需要添加一个 mask，用于确保 bindchange 之后、bindanimationfinish 之前无法继续滑动；

为什么使用 3 个 swiper-item 作为循环基础？在切换到一个 item 时，一般情况下会有上拉切换到下一个 item、下拉切换到上一个 item 这两种情况，为了保证前一个 item 和后一个 item 已经提前加载，最少需要 3 个 swiper-item。

使用 3 个 swiper-item 作为循环基础的缺陷：在网络情况比较差或快速切换的情况下，可能会出现当前 swiper-item 上显示之前的图片，需要等待当前图片加载完成之后才切换到正确的图片。可以尝试增加 swiper-item 循环基础的数量，以增加非当前 item 的图片的预加载时长。

## 审核

### 没通过

在公司经手过二三十个小程序的审核与发布，遇到过多种审核不通过的情况，因此对微信小程序的审核规则和应对策略比较了解。【村花杨老师】小程序的审核过程同样遇到了麻烦，首次审核就被打了回来，原因如下：

> 你的小程序涉及用户自行生成内容（文字、图片、音/视频）的记录、分享，属社交-笔记范畴，为个人主体小程序未开放类目，建议申请企业主体小程序

通常遇到这种情况就是无解的，只能去掉上传功能或者申请企业主体小程序。

### 应对策略

如果某个小程序的功能比较敏感，可能导致审核不通过，可用一个后端接口或云函数来控制是否显示该功能，在审核期间关闭，审核通过之后再开启。这种方式一定程度上可以规避敏感功能的审核问题，但对于已经上线的小程序后续审核时采用这种方式的话，会对线上正常用户也产生影响。因此，这种应对策略对于企业级的小程序并不可取，尽量按照小程序的规范进行设计开发。

具体到【村花杨老师】，采用了云开发而没有后端接口，只能通过云函数来控制功能的开关。可以在云数据库中添加一个配置表，用来保存功能的开关配置，也可以指云函数的函数配置页面添加环境变量的方式，我采用了后面这种方式，更加简便，修改起来也很方便。

按照这种思路对小程序进行修改，审核终于通过了，但原计划开发更多功能的积极性也没了。

## 关于我

现居杭州，从事 WEB 前端开发工作，4 年工作经验，目前求职中，欢迎内推引荐。

提示：可通过点击屏幕右上方的问号图标与我取得联系。

## 更多作品

以下是我在之前工作中主导开发的几个小程序项目，感兴趣的话可以通过点击预览小程序二维码，然后长按识别小程序码进入对应的小程序查看。

![dczj](https://github.com/hengzi/ycy-taro/blob/master/src/assert//dczj.jpeg)
![jxb](https://github.com/hengzi/ycy-taro/blob/master/src/assert//jxb.jpeg)
![dzz](https://github.com/hengzi/ycy-taro/blob/master/src/assert//dzz.jpeg)
![czc](https://github.com/hengzi/ycy-taro/blob/master/src/assert//czc.jpeg)
