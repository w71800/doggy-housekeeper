class Table {
  constructor(){
    this.members = ["嗙", "草", "星", "肥", "琪"]
    this["垃圾"] = 0;
    this["回收"] = 0;
  }

  getNow(item){
    return this[item]
  }
  setNext(item){
    this[item] == 4 ? this[item] = 0 : this[item] += 1
  }
}

module.exports = new Table()