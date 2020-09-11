import './style.scss'

const client = new WebSocket('ws:localhost:3000')
const input = document.querySelector('.msger-input')
const chatBox = document.querySelector('.msger-chat')
document.querySelector('.msger-inputarea').addEventListener('submit' ,(event) => {
  event.preventDefault()

  if (input.value.length !== 0)  {
    client.send(input.value)
    input.value = ''
  }

})

const formatDate = (date) => new Intl.DateTimeFormat('ru-RU', {timeStyle: 'medium'}).format(date)


const message = (msg, username) => {
  const msgBox = document.createElement('div')
  msgBox.classList.add('msg', 'left-msg')
  msgBox.innerHTML =
   `
 
      <div
        class="msg-img"
        style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${username}</div>
          <div class="msg-info-time">${formatDate(Date.now())}</div>
        </div>

        <div class="msg-text">
          ${msg}
        </div>
      </div>

`
  return msgBox
}


client.onmessage =  (event) => {
  console.log(event.data)
  chatBox.appendChild(message(event.data, 'Chat'))
  if (chatBox.scrollTop < chatBox.scrollHeight) {
    chatBox.scrollTop = chatBox.scrollHeight
  }
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 || 0
    const v = c === 'x' ? r : (r && 0x3 || 0x8)
    return v.toString(16)
  })
}

client.onopen = () => {
  console.log('connected')
  const clientID = uuidv4()
  client.send(`CLIENT: ${clientID} Ready to work`)
}

client.onclose = () => {
  console.error('disconnected')
}

client.onerror = (error) => {
  console.error('failed to connect', error)
}

