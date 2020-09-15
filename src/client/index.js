import './style.scss'

import Client from './Client'
import Broadcast from './Broadcast'
import { parseData } from './utils'

const client = new Client()

client.start('ws:localhost:3000')

const broadcast = new Broadcast({
  service: client,
  fps: 3,
  videoBoxSelector: '#webcam',
  streamBoxSelector: '.stream',
})
broadcast.start()

const textChat = document.querySelector('#textChat')
const input = document.querySelector('.msger-input')
const chatBox = document.querySelector('.msger-chat')

// close chat
// document.querySelectorAll('.close').forEach((node) => {
//   node.addEventListener('click', () => {
//     textChat.classList.toggle('hide')
//   })
// })

// submit handler
// document
//   .querySelector('.msger-inputarea')
//   .addEventListener('submit', async (event) => {
//     event.preventDefault()
//     if (input.value.length !== 0) {
//       const response = await mailer.fetchWS({
//         type: 'text',
//         message: input.value,
//       })
//       console.log('RESPONSE FROM MAILER:', response)
//       if (response.type === 'ok') {
//         input.value = ''
//       }
//     }
//   })

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
