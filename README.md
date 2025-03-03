## 簡介
<div style="margin-bottom: 20px; display: flex; justify-content: center">
  <img src="https://imgur.com/qMlB1SM.png" style="border-radius: 50%;">
</div>
「狗狗管家」是一個 LineBot，用以管理先前家中的打掃輪值表。

可以透過輸入一些簡單的指令來更動家中打掃區域的輪值名單，例如『狗狗我垃圾倒完了』，系統就會將要處理垃圾的人員交替給下一個人。

另外，在更動輪值時，也會將更動的紀錄寫入至串接好的 Notion，作為紀錄留存與回滾查詢之用。

整個應用程式是透過 Express.js 後端框架撰寫 Line Messaging API 的 POST Request 路由處理。伺服器架設於 Zeabur。


### 可以透過 Line 來掃描此 QRCode 加入狗狗管家好友
![](https://imgur.com/uNXSq6J.png)