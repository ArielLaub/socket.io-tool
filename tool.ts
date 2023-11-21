import { io, Socket } from "socket.io-client";
import readline from 'readline';

const [, , url] = process.argv;

if (!url) {
  console.error('Usage: node tool.ts <url>');
  process.exit(1);
}

const socket: Socket = io(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle connection event
socket.on('connect', () => {
  console.log('Connected to the server');
  printHelp();

  // Start reading user input
  rl.prompt();
});

// Handle disconnection event
socket.on('disconnect', () => {
  console.log('Disconnected from the server');
  process.exit(0);
});

// Handle custom 'message' event from the server
socket.on('message', (data: any) => {
  console.log(`Received message from the server: ${data}`);
});

// Handle user input
rl.on('line', (input: string) => {
  const [command, ...args] = input.split(' ');

  switch (command) {
    case 'emit':
      const eventName = args[0];
      const eventData = args.slice(1).join(' ');

      let parsedData;
      try {
        parsedData = JSON.parse(eventData);
      } catch (error) {
        parsedData = eventData;
      }
      socket.emit(eventName, parsedData);
      console.log(`Emitted '${eventName}' event with data: ${eventData}`)
    break;

    case 'subscribe':
      const subscribeEventName = args[0];

      // Subscribe to the specified event
      socket.on(subscribeEventName, (data: any) => {
        if (typeof data === 'object') {
          data = JSON.stringify(data, null, 4);
        }
        console.log(`received '${subscribeEventName}' event: ${data}`);
      });

      console.log(`subscribed to '${subscribeEventName}' event`);
      break;

    case 'help':
      printHelp();
      break;

    default:
      console.log('Invalid command. Use "emit <event> <data>", "subscribe <event>", or "help"');
      break;
  }

  // Prompt for the next input
  rl.prompt();
});

// Handle SIGINT (Ctrl+C) to gracefully disconnect
process.on('SIGINT', () => {
  socket.disconnect();
  rl.close();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason, 'promise:', promise);
  process.exit(1);
});

function printHelp() {
  console.log('Available commands:');
  console.log('  emit <event> <data>: Emit an event to the server');
  console.log('  subscribe <event>: Subscribe to an event from the server');
  console.log('  help: Show this help message');
}
