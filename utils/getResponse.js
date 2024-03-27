const table = require("./routineTable")

const getResponse = (text, userInfo) => {
  if(text.includes("垃圾倒完了") || text.includes("倒完垃圾了")) {
    table.setNext("垃圾")
    return `收到，汪汪！${table.members[table.getNow("垃圾")]}下一次換你倒垃圾囉，汪汪！` 
  }

  if(text.includes("回收倒完了") || text.includes("倒完回收了")) {
    table.setNext("回收")
    return `收到，汪汪！${table.members[table.getNow("回收")]}下一次換你倒回收囉，汪汪！` 
  }

  if(text == "垃圾名單"){
    return `
      回收：${table.members[table.getNow("回收")]}
      垃圾：${table.members[table.getNow("垃圾")]}
    `
  }

  if(text == "打掃名單"){

  }
  
  else return
  
}

module.exports = getResponse