import './style.scss'
import Broadcast from './Broadcast'
import Service from './Service'
import Mailer from './Mailer'
import { message, parseData, prepareData, uuidv4 } from './utils'


const CLIENT_ID = uuidv4()


const client = new WebSocket('ws:localhost:3000')
const mailer = new Mailer(client, CLIENT_ID)

const serviceType = 'ws'

const textChat = document.querySelector('#textChat')
const input = document.querySelector('.msger-input')
const chatBox = document.querySelector('.msger-chat')

const video = document.querySelector('#webcam')
const streamBox = document.querySelector('.stream')


const ws = new Service(client, serviceType)

const broadcast = new Broadcast({
  service: ws,
  fps: '3',
  webcamSrc: video,
  broadcastBox: streamBox,
})


let canCast = false

video.addEventListener('loadeddata', () => {

  broadcast.init().then(() => {
    if (canCast) {
      broadcast.start()
    }
  })
})

// close chat
document.querySelectorAll('.close').forEach(node => {
  node.addEventListener('click', () => {
    textChat.classList.toggle('hide')
  })
})

// get webcam
const constraints = {
  video: {
    width: { max: 300 },
    height: { max: 300 },
  },
}

function hasGetUserMedia () {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

if (hasGetUserMedia()) {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream
    })
    .catch((error) => console.log(error))
} else {
  console.error('getUserMedia() is not supported by your browser')
}







// submit handler
document
  .querySelector('.msger-inputarea')
  .addEventListener('submit', async (event) => {
    event.preventDefault()
    if (input.value.length !== 0) {
      const response = await mailer.fetchWS(
        {
          type: 'text',
          message: input.value,
        })
      console.log('RESPONSE FROM MAILER:',response.payload)
      if (response.type === 'ok') {
        input.value = ''
      }
    }
  })





// message handler
client.onmessage = (event) => {
  const data = parseData(event.data)
  switch (data.type) {
    case 'text': {
      chatBox.appendChild(
        message(data.message, data.owner, mailer.itMyMessage(data.messageId) ),
      )
      if (chatBox.scrollTop < chatBox.scrollHeight) {
        chatBox.scrollTop = chatBox.scrollHeight
      }
      if (data.canCast) {
        canCast = true
      }
      break
    }
    case 'stream': {
      if (broadcast.img !== null) {
        broadcast.setSnapshot(data.message)
      }
      break
    }
    case 'ok': {
      const localResolve = mailer.messeges[data.messageId]
      localResolve(data)
      break
    }
    case 'startCast' : {
      canCast = true
      console.log('startCast')
      broadcast.start()
    }
  }
}






// say hi and start stream
client.onopen = () => {
  const msg = {
    type: 'hello',
    clientID: CLIENT_ID,
  }
  client.send(prepareData(msg))


  // test
  const promises = []
  for(let i = 0; i < 10; i += 1) {
   const prom = mailer.fetchWS({
      type: 'test',
    })
    promises.push(prom)


  }
  Promise.all(promises).then(data => console.log(data))


}




// disconnect
client.onclose = () => {}
window.addEventListener('beforeunload', () => {
  const msg = {
    type: 'goodbye',
    message: `CLIENT: ${CLIENT_ID} disconnected`,
    clientID: CLIENT_ID,
  }
  client.send(prepareData(msg))
  if (canCast) {
    client.send(prepareData({
      type: 'casterLeaves',
    }))
  }
  broadcast.stop()
  client.close()
})

// error
client.onerror = (error) => {
  console.error('failed to connect', error)
  client.close()
}
