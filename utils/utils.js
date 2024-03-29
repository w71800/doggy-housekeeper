const getTime = () => {
  let nowHour = new Date().getHours()

  if(nowHour < 12) return "早安"
  else if(nowHour > 12 && nowHour < 18) return "午安"
  else return "晚安"
}

module.exports = { getTime }