/**
 *  
 *  1. 一旦有更新狀態，就要發出一份備份訊息到群組，以防伺服器掛掉資料被刷新
 *  2.
 * 
 * */ 

const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv')
const table = require('./utils/routineTable')
const getResponse = require('./utils/getResponse')
const PORT = process.env.PORT || 3000;


const envFile = `.env.${process.env.NODE_ENV}` || '.env';

dotenv.config({ path: envFile });
console.log(process.env.NODE_ENV);

// Line Bot 的設定
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

console.log(lineConfig);

// 初始化 Line Bot
const lineClient = new line.Client(lineConfig);

const app = express();

table.init()

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

  
  let { text } = event.message // 取得訊息
  let response = getResponse(text)
  
  if(!response) return

  // return lineClient.replyMessage(event.replyToken, {
  //   type: 'text',
  //   text: response
  // })
  return lineClient.replyMessage(event.replyToken, response)

  
}

app.listen(PORT, () => {
  console.log(`伺服器已啟動，正在監聽埠號 ${PORT}`);
});
