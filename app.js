/**
 *  
 *  1. 一旦有更新狀態，就要發出一份備份訊息到群組，以防伺服器掛掉資料被刷新
 *  2.
 * 
 * */ 

const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config()
const table = require('./utils/routineTable')
const getResponse = require('./utils/getResponse')
let listIndex = 0



// Line Bot 的設定
const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

// 初始化 Line Bot
const lineClient = new line.Client(lineConfig);

const app = express();


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

// 開始監聽伺服器
app.listen(3000, () => {
  console.log(`伺服器已啟動，正在監聽埠號 3000`);
});
