import './style.scss'

const {uuidv4, parseData, prepareData, message} = require('./utils')

const client = new WebSocket('ws:localhost:3000')

const textChat = document.querySelector('#textChat')
const input = document.querySelector('.msger-input')
const chatBox = document.querySelector('.msger-chat')

const video = document.querySelector('#webcam')
const streamBox = document.querySelector('.stream')

const screenshot = document.createElement('canvas')
const streamCanvas = document.createElement('canvas')
const img = new Image()

const clientID = uuidv4()
let srCtx = null
let streamCtx = null
let broadcasting = null
let canCast = false


// snapshot
const getSnapshot = () => {
  srCtx.drawImage(video, 0, 0)
  return screenshot.toDataURL('image/jpeg', 0.1).split(',')[1]
}

// video ready


const startCast = (fps) => {
  broadcasting = setInterval(() => {
    const data = {
      type: 'stream',
      message: getSnapshot(),
    }
    client.send(prepareData(data))
  }, 1000 / fps)
}

video.addEventListener('loadeddata', () => {

  const vidStyleData = video.getBoundingClientRect()
  streamCanvas.id = 'stream'
  screenshot.id = 'screenshot'
  streamCanvas.style.width =  `${vidStyleData.width} px`
  streamCanvas.style.height = `${vidStyleData.height} px`
  streamCanvas.width = vidStyleData.width
  streamCanvas.height = vidStyleData.height
  streamCanvas.style.left =  `${vidStyleData.left} px`
  streamCanvas.style.top =  `${vidStyleData.top} px`
  screenshot.style.width =  `${vidStyleData.width} px`
  screenshot.style.height = `${vidStyleData.height } px`
  screenshot.width = vidStyleData.width
  screenshot.height = vidStyleData.height
  screenshot.style.left =  `${vidStyleData.left} px`
  screenshot.style.top =   `${vidStyleData.top} px`
  streamBox.appendChild(streamCanvas)
  streamBox.appendChild(screenshot)
  srCtx = screenshot.getContext('2d')
  streamCtx = streamCanvas.getContext('2d')
  if (canCast) {
    console.log('Start Casting')
    startCast(3)
  }


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
    width: {ideal: 300},
    height: {ideal: 300}
  },
}

function hasGetUserMedia() {
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




// message handler
client.onmessage = (event) => {
  const data = parseData(event.data)

  switch (data.type) {
    case 'text': {
      chatBox.appendChild(message(data.message, 'Chat'))
      if (chatBox.scrollTop < chatBox.scrollHeight) {
        chatBox.scrollTop = chatBox.scrollHeight
      }
      if(data.canCast) {
        canCast = true
        console.log('Can Casting')
      }
      break
    }
    case 'startCast': {
      console.log('try start cast')
      canCast = true
      startCast(3)
      break
    }
    default: {
      img.onload = () => {
        streamCtx.drawImage(img, 0, 0)
      }
      img.src = `data:image/png;base64,${data.message}`
    }
  }
}


// say hi and start stream
client.onopen = () => {
  const msg = {
    type: 'hello',
    clientID,
  }
  client.send(prepareData(msg))
}



// text chat
document
    .querySelector('.msger-inputarea')
    .addEventListener('submit', (event) => {
      event.preventDefault()
      if (input.value.length !== 0) {
        client.send(
            prepareData({
              type: 'text',
              message: input.value,
            }),
        )
        input.value = ''
      }
    })


// disconnect
client.onclose = () => {
  const msg = {
    type: 'goodbye',
    message: `CLIENT: ${clientID} disconnected`,
    clientID,
  }
  client.send(prepareData(msg))
  clearInterval(broadcasting)
  client.close()
}
window.addEventListener('beforeunload', () => {
  const msg = {
    type: 'goodbye',
    message: `CLIENT: ${clientID} disconnected`,
    clientID,
  }
  client.send(prepareData(msg))
  if (canCast) {
    const castNext = {
      type: 'casterLeaves'
    }
    client.send(prepareData(castNext))
  }

  clearInterval(broadcasting)
  client.close()
})

// error
client.onerror = (error) => {
  console.error('failed to connect', error)
  client.close()
}
