import './style.scss'

import Client from './client'
import Broadcast from './broadcast'
import Chat from './chat'

const client = new Client()

client.start('ws:localhost:3000')

const broadcast = new Broadcast({
  service: client,
  fps: 3,
  videoBoxSelector: '#webcam',
  streamBoxSelector: '.stream',
})
broadcast.start()

const chat = new Chat({
  service: client,
  chatSelector: '#textChat',
  chatBoxSelector: '.msger-chat',
  inputSelector: '.msger-input',
  closeSelector: '.close',
  inputAreaSelector: '.msger-inputarea',
})

chat.init()

// message handler
// client.onmessage = (event) => {
//   const data = parseData(event.data)
//
//    switch(data.type) {
//     case 'ok': {
//       const localResolve = mailer.messeges[data.messageId]
//       localResolve(data)
//       break
//     }
//
//   }
// }
