const Server = require('./server')

const server = new Server()
const config = {
  host: '0.0.0.0',
  port: 3000,
  clientTracking: true,
}

server.start(config)

process.on('SIGINT', async () => {
  console.log(`Caught interrupt signal. Exit`)
  await server.exit()
  process.exit(0)
})
