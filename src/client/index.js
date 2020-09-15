import './style.scss'

import Client from './Client'
import Broadcast from './Broadcast'
import Chat from './Chat'

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
//   switch (data.type) {
//     case 'text': {
//       chatBox.appendChild(
//         message(data.message, data.owner, mailer.itMyMessage(data.messageId))
//       )
//       if (chatBox.scrollTop < chatBox.scrollHeight) {
//         chatBox.scrollTop = chatBox.scrollHeight
//       }
//       if (data.canCast) {
//         canCast = true
//       }
//       break
//     }
//     case 'stream': {
//       if (broadcast.img !== null) {
//         broadcast.setSnapshot(data.message)
//       }
//       break
//     }
//     case 'ok': {
//       const localResolve = mailer.messeges[data.messageId]
//       localResolve(data)
//       break
//     }
//     case 'startCast': {
//       canCast = true
//       console.log('startCast')
//       broadcast.start()
//     }
//   }
// }

// window.addEventListener('beforeunload', () => {
//   if (canCast) {
//     client.send(
//       prepareData({
//         type: 'casterLeaves',
//       })
//     )
//   }
//   broadcast.stop()
// })
//
