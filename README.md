# xtuapi

> “把湘大办得又大又好。” —— 毛爷爷

## 前言

集成目前所有已知的、与湘大相关的数据接口供开发者调用。方便校友借鉴或直接使用，以此为计算机系，或感兴趣的同学能够方便地获取到简洁的官方数据，并自行封装和完善，编写更丰富、精致的应用，造福其他湘大学子，共勉。

免责声明: 原则上只对学校数据进行查询，不会进行任何的增删改操作，即获取的数据，是可在正常渠道下，在相应的网页上查看的。并不对学校的数据库或其他敏感数据进行爬取，同时限制了并发量和使用了本地缓存，不会因爬取数据而对学校服务器进行过多地请求。

## 功能介绍（TODO）

- [x] 模拟登录（已在云服务器中集成针对教务系统验证码的语言库）
- [x] 抓取并返回个人数据（不存入数据库）
- [x] 获取湘大官网的新闻资讯（存入数据库）以及「免登录」获取空闲教室数据

### 门户信息

新闻、公告、讲座

- [x] 湘大本部
- [x] 商学院
- [x] 信工院
- [x] 化学院
- [x] 化工院
- [x] 土木院
- [x] 法学院
- [x] 数学院
- [x] 材料院
- [x] 外院

### 教务系统

- [x] 登录
- [x] 成绩
- [x] 绩点
- [x] 排名
- [x] 课程表
- [x] 考试信息
- [ ] 教师评价

### 教室信息

- [x] 空闲教室

### 图书馆

- [ ] 登录
- [ ] 已借书籍信息、缓借
- [ ] 书本信息查询

### 一卡通

- [ ] 登录
- [ ] 消费记录

## 建议 异常 疑问

若有有何见解或需要，欢迎提 [issue](https://github.com/xtuJSer/xtuapi/issues/new) 联系我。
