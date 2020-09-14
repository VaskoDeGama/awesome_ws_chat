const uuidv4 = () => {
  let uuid = ''
  let random = 0
  for (let i = 0; i < 32; i += 1) {
    random = Math.floor(Math.random() * 16)
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    if (i === 12) {
      uuid += 4
    } else {
      uuid += i === 16 ? (random && 3 || 8) : random.toString(16)
    }
  }
  return uuid.slice(0,8)
}

const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {timeStyle: 'medium'}).format(date)


const parseData = (data) => {
  return JSON.parse(data)
}

const prepareData = (data) => {
  return JSON.stringify(data)
}


const message = (msg, username = 'server', isMY) => {
  const msgBox = document.createElement('div')
  msgBox.classList.add('msg', `${isMY ? 'right-msg' : 'left-msg'}`)
  msgBox.innerHTML = `
      <div
        class='msg-img'
        style='background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)'
      ></div>

      <div class='msg-bubble'>
        <div class='msg-info'>
          <div class='msg-info-name'>${username}</div>
          <div class='msg-info-time'>${formatDate(Date.now())}</div>
        </div>

        <div class='msg-text'>
          ${msg}
        </div>
      </div>
`
  return msgBox
}


module.exports = {
  uuidv4,
  formatDate,
  parseData,
  prepareData,
  message
}