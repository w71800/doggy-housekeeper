const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config()


// Line Bot 的設定
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

// 初始化 Line Bot
const lineClient = new line.Client(lineConfig);

// 建立 Express app
const app = express();

// 設定伺服器的埠號
const PORT = process.env.PORT || 3000;

// 設定路由
app.get('/', (req, res) => {
  res.send('歡迎來到我的伺服器！');
});

// 處理 Line Bot 的訊息事件
app.post('/webhook', line.middleware(lineConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 處理 Line Bot 的訊息事件
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // 回覆訊息
  return lineClient.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

// 開始監聽伺服器
app.listen(PORT, () => {
  console.log(`伺服器已啟動，正在監聽埠號 ${PORT}`);
});
