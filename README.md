# Socket.IO power tool command line utility

A command line utility written in TypeScript for interacting with a server using Socket.IO.

## Installation

```bash
npm install -g socket.io-tool
```

## Run
socket.io-tool [url]
```bash
socket.io-tool http://localhost:3000
Connected to the server
Available commands:
  emit <event> <data>: Emit an event to the server
  subscribe <event>: Subscribe to an event from the server
  help: Show this help message
> emit myEvent { "myfield": "my value" } 
```
