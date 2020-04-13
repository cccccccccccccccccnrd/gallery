const path = require('path')
const express = require('express')
const WebSocket = require('ws')

const app = express()

app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(2626)

const wss = new WebSocket.Server({ port: 2627 })

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  })
})