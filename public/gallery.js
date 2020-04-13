const url = window.location.hostname === 'localhost' ? 'ws://localhost:2627' : 'wss://cnrd.computer/gallery-ws'
const socket = new WebSocket(url)
const id = `CURSOR${ Date.now() }`

function platform () {
  if (navigator.platform) {
    if (navigator.platform === 'MacIntel') {
      return 'mac'
    } else if (navigator.platform === 'Win32') {
      return 'win'
    } else {
      return 'mac'
    }
  } else {
    return 'platform'
  }
}

function remove (cursor) {
  const element = document.querySelector(`#${ cursor.id }`)
  element.remove()
}

function create (id, platform) {
  const element = document.createElement('div')
  element.setAttribute('id', id)
  element.setAttribute('class', `cursor ${ platform }`)
  document.body.appendChild(element)

  return element
}

function move (cursor) {
  const element = document.querySelector(`#${ cursor.id }`) ? document.querySelector(`#${ cursor.id }`) : create(cursor.id, cursor.platform)

  element.style.top = `${ cursor.xy.y }px`
  element.style.left = `${ cursor.xy.x }px`
}

function send (type, payload) {
  const msg = {
    type: type,
    id: id
  }

  switch (type) {
    case 'move':
      msg.xy = payload
      msg.platform = platform()
  }

  socket.send(JSON.stringify(msg))
}

socket.addEventListener('message', (message) => {
  const msg = JSON.parse(message.data)

  switch (msg.type) {
    case 'move':
      move(msg)
      break
    case 'close':
      remove(msg)
      break
  }
})

window.onunload = () => {
  send('close')
}

document.addEventListener('mousemove', (event) => {
  const xy = {
    x: event.pageX,
    y: event.pageY
  }

  send('move', xy)
})

