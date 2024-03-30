class Table {
  constructor(){
    this.members = ["嗙", "草", "肥", "星", "琪"]
    this.routines = {
      "垃圾": { type: "垃圾處理", pending: null, now: 0 },
      "回收": { type: "垃圾處理", pending: null, now: 0 },
      "廁所": { type: "公區打掃", pending: null, now: 2 },
      "客廳": { type: "公區打掃", pending: null, now: 0 },
      "餐廳": { type: "公區打掃", pending: null, now: 0 },
      "廚房": { type: "公區打掃", pending: null, now: 0 },
      "陽台": { type: "公區打掃", pending: null, now: 0 },
    }
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

  setNext(routine){
    let { [routine]: value } = this.routines
    if(routine == "廁所" && (value.now == 0 || value.now == 1)){
      value.now = 2  
    } else {
      value.now == this.members.length - 1 ? value.now = 0 : value.now += 1
    }
  }

  setTo(routine, index){
    let { [routine]: value } = this.routines
    if(routine == "廁所" && (value.now == 0 || value.now == 1)){
      return "failed"
    } else {
      value.now = index
    }
  }
}

let table = new Table()
// console.log(table.getNow("公區打掃"));

module.exports = table