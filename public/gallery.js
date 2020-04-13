const socket = new WebSocket('ws://localhost:2001')
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

function send (xy) {
  const msg = {
    id: id,
    xy: xy,
    platform: platform()
  }

  socket.send(JSON.stringify(msg))
}

socket.addEventListener('message', (message) => {
  const msg = JSON.parse(message.data)
  console.log(msg)
  move(msg)
})

document.addEventListener('mousemove', (event) => {
  send({
    x: event.pageX,
    y: event.pageY
  })
})

