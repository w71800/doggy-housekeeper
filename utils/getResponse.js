const table = require("./routineTable")

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
            text: "管家狗狗說："
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
  let obj

  if(text.includes("垃圾倒完了") || text.includes("倒完垃圾了")) {
    table.setNext("垃圾")
    obj = {
      type: "text",
      text: `收到，汪汪！\n${table.members[table.getNow("垃圾")]} 下一次換你倒垃圾囉，汪汪！`,
      wrap: true,
    }
  }

  else if(text.includes("回收倒完了") || text.includes("倒完回收了")) {
    table.setNext("回收")
    obj = {
      type: "text",
      text: `收到，汪汪！\n${table.members[table.getNow("回收")]} 下一次換你倒回收囉，汪汪！` ,
      wrap: true,
    }
  }

  else if(text == "垃圾名單"){
    response = `
      回收：${table.members[table.getNow("回收")]}
      垃圾：${table.members[table.getNow("垃圾")]}
    `
  }

  else if(text == "打掃名單"){
    response = ""
  }

  else if(text == "指令"){
    obj = {
      type: "text",
      text: `可以怎麼使喚我
        打掃名單：可以告訴你目前要打掃的各區名單\n
        垃圾名單：可以告訴你目前要倒垃圾或回收的名單\n
        垃圾倒完了：輪替給下一個人倒垃圾\n
        回收倒完了：輪替給下一個人倒回收\n
      `,
      wrap: true,
      size: "12px",
      align: "start"
    }
    
  }

  obj ? contents.push(obj) : response = null

  return response
  
}

module.exports = getResponse