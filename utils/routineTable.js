const notion = require("./notion")

class Table {
  constructor(){
    this.members = ["嗙", "草", "肥", "星"]
    this.routines = {
      "垃圾": { type: "垃圾處理", pending: null, now: 2 },
      "回收": { type: "垃圾處理", pending: null, now: 3 },
      "廁所": { type: "公區打掃", pending: null, now: 3 },
      "客廳": { type: "公區打掃", pending: null, now: 3 },
      "餐廳": { type: "公區打掃", pending: null, now: 1 },
      "廚房": { type: "公區打掃", pending: null, now: 0 },
      "陽台": { type: "公區打掃", pending: null, now: 0 },
    }
    this.previous = null
    
    // 以遞迴的手法來幫整個物件加上 proxy
    function createProxyForObject(obj, handler) {
      if (typeof obj !== 'object' || obj === null) {
        return obj;
      }
    
      const proxy = new Proxy(obj, handler);
    
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = createProxyForObject(obj[key], handler);
        }
      }
    
      return proxy;
    }
    const handler = {
      set: (target, prop, value, receiver) => {
        if(prop == "now" || prop == "pending"){
          this.previous = JSON.parse(JSON.stringify(this.routines))

          // 並將 previous 的值寫入到 Google sheet 中
        }
        return Reflect.set(target, prop, value, receiver);
      }
    }
    this.routines = createProxyForObject(this.routines, handler);
  }
  /**
   * @param {string} routine
   * @returns {object} ```{ routine1: nowIndex, routine2: nowIndex }```
   */
  getNow(routine){
    if (routine !== "垃圾處理" && routine !== "公區打掃") {
      let { [routine]: { now } } = this.routines
      return { [routine]: now }
    } else {
      let target = Object.entries(this.routines).filter( item => item[1].type == routine )
      let entries = target.map(([key, value]) => [key, value.now])
      return Object.fromEntries(entries)
    }
  }

  async setNext(routine){
    let { [routine]: value } = this.routines
    /**
     * TODO: 這邊設置的條件有點問題，應該是要確認當下為最後一個或 0 的時候才跳到 2（待測試）
     * 
     */
    if(routine == "廁所" && (value.now == 0 || value.now == (this.members.length - 1))) {
      value.now = 2  
    } else {
      if(value.pending == null) {
        value.now == this.members.length - 1 ? value.now = 0 : value.now += 1
      } else {
        value.now = value.pending
        value.pending = null
      }
    }

    await notion.setRow(this)
  }

  setTo(routine, index){
    let { [routine]: value } = this.routines
    if(routine == "廁所" && (value.now == 0 || value.now == 1)){
      return "failed"
    } else {
      value.pending = value.now
      value.now = index
      
      return true
    }
  }

  async init(){
    let lastRow = await notion.getLastestRow()
    
    if(lastRow.length == 0) return 
    let { previous, result: routines } = lastRow.properties

    this.previous = JSON.parse(previous.rich_text[0].plain_text)
    this.routines = JSON.parse(routines.rich_text[0].plain_text)
  }
}

let table = new Table()
// console.log(table.getNow("公區打掃"));

module.exports = table