const table = require("./routineTable")
const { getTime } = require("./utils")

const getResponse = (text, userInfo) => {
  let response = {
    type: "flex",
    altText: "來自管家狗狗的訊息",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: "管家狗狗說",
            align: "center",
            weight: "bold",
            size: "18px",
            // emojis: [
            //   {
            //     index: 0,
            //     // productId: "6124aa4ae72c607c18108562",
            //     // emojiId: "038"
            //     productId: "5ac1de17040ab15980c9b438",
            //     emojiId: "001"
            //   }
            // ]
          }
        ],
        backgroundColor: "#f6dc93"
      },
      body: {
        type: "box",
        layout: 'vertical',
        contents: [],
      }
    }
  }
  let contents = response.contents.body.contents
  let content
  let keyword, regex = undefined

  // 判斷是否存在關鍵字，並生成對應的 regex 規則
  for(let r of Object.keys(table.routines)){
    if(text.includes(r)){
      keyword = r
      regex = text.length > 7 ? new RegExp(`^狗狗我.*${keyword}.*了$`) : new RegExp(`狗狗${keyword}是誰`)
      break
    }
  }

  
  // 模糊比對區域
  if(regex && regex.test(text)) {
    
    if(text.length > 7) {
      table.setNext(keyword)
      let { [keyword]: now } = table.getNow(keyword)
      let verb = keyword != "回收" && keyword != "垃圾" ? "掃" : "倒"
      content = {
        type: "text",
        text: `收到！\n${table.members[now]} 下一次換你${verb + keyword}囉，汪汪！` ,
        wrap: true,
      }
    } else {
      let { [keyword]: now } = table.getNow(keyword)
      let verb = keyword != "回收" && keyword != "垃圾" ? "掃" : "倒"
      content = {
        type: "text",
        text: `${keyword} 是 ${table.members[now]} 要${verb}的，汪汪！` ,
        wrap: true,
      }
    }
  }
  
  if(text == "狗狗垃圾名單"){
    // TODO: 如果有該項目有 pending 的話，顯示為 垃圾：嗙（跟 pending 交換）
    let result = Object.entries(table.getNow("垃圾處理"))
                .reduce((temp, [routine, now]) => temp + `${routine}：${table.members[now]}\n`, "")

    content = {
      type: "text",
      text: result,
      wrap: true
    }
  } else if(text == "狗狗打掃名單"){
    // TODO: 如果有該項目有 pending 的話，顯示為 廁所：嗙（跟 pending 交換）
    let result = Object.entries(table.getNow("公區打掃"))
                .reduce((temp, [routine, now]) => temp + `${routine}：${table.members[now]}\n`, "")  // TODO: 這邊不要一直換行，或許可以使用 flex

    content = {
      type: "text",
      text: result,
      wrap: true
    }
  } else if(text == "指令"){
    content = {
      type: "text",
      text: `可以怎麼使喚我，可以在「狗狗」後面加上：
      打掃名單：告訴你目前打掃的各區名單
      垃圾名單：告訴你目前垃圾或回收的名單
      我垃圾倒完了：輪替給下一個人倒垃圾
      我回收倒完了：輪替給下一個人倒回收
      區域是誰：搜尋該區域的的負責人

      例如「狗狗我垃圾倒完了」、「狗狗廁所是誰」
      
      汪汪！
      `,
      wrap: true,
      size: "11px",
      align: "start"
    }
  } else if(text == "打招呼"){
    content = {
      type: "text",
      text: `${getTime()}，汪汪！` ,
      wrap: true,
      // emojis: [
      //   {
      //     index: 0,
      //     // productId: "6124aa4ae72c607c18108562",
      //     // emojiId: "038"
      //     productId: "5ac1de17040ab15980c9b438",
      //     emojiId: "001"
      //   }
      // ]
    }
  } else if(text == "調換") {
    table.setTo("廚房", 4)
  }
  
  content ? contents.push(content) : response = null

  return response
}

module.exports = getResponse