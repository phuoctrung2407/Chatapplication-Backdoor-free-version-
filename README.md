# Overview

This is a simple chat system implemented using Websockets, Express and Node.js. The project support private as well as public messaging with presence update, secure communication using encryption, point-to-point file transfer. In addition, this website is support with extra security measures.

## Table of Contents

_ Features

_ Technologies Used

_ Prerequisites

_ Installation

_ Usage

_ Configuration

_ Security and Encryption

_ License

_ Contact

## Features
- Real-time messaging: Users can send and receive messages in real time.
  
- Multiple chat rooms: There will be different option of chat room for user to use and experiences.
  
- Private messaging: The system can support private one-on-one chat via client with client.
  
- Secure client-to-client encrytion

- JWT-based authentication

- Presence updates to show online user

- Rate limiting

## Technologies Used
- **Express.js**
- **Node.js**
- **WebSocket**
- **JSON Web Tokens (JWT)**
- **Bootstrap**
- **OpenSSL**
- **Git**
- **express-rate-limit**
- **sanitize-html**
- **cryto**


## Prerequisites

_ Node.js (v14 or later)

_ npm (Node Package Manager)

_ Web brower (Any web browser will work)

_ SSL certificate for HTTPS

## Installation
To run the chat system locally, follow these steps:

1. Clone the repository
2. Install the dependencies: `npm install express-rate-limit sanitize-html`
3. Generating SSL certificates: `openssl req -nodes -new -x509 -keyout certs/private-key.pem -out certs/certificate.pem -days 365`
4. Start the server: `npm run start`
5. Optional: If you dont know your IP address, put `ifconfig` for Terminal in Mac, or `ipconfig` for Command Prompt in Window.
6. Access the chat system in your web browser: `https://<YOUR_IP_ADDRESS>:5555` 
7. Enter Username and Chatroom number
8. Start chatting

## Usage
chatapplication/
├── certs/
│   ├── private-key.pem
│   └── certificate.pem
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── chat.js
│   ├── chat.html
│   └── index.html
├── app.js
├── package.json
└── README.md

### Logging in

_ Open the chat application on your browser

_ Enter your name to join the chat room

_ The server will broadcast your presence to other users.

### Sending Messages

_Private message: Select a user that you want to have a private chat on the tab, The message will be encrypted and sent directly to the selected user.

_Public message: Just simply type your message in the input box then click "Send". The message will be broadcast to all users in the chat room.

### File Transfer

_ Pick a file to send to another user. It will be encrypted and transferred directly to the recipient.

## Configuration 
### Server
The server using Websockets for communication and listening on port `5555`. The `PORT` can be modified on `app.js`. However, in this assignment, the chosen `PORT` is fixed at `5555`
### Client
The client connects to the Websocket server using the port `5555` and the curretn hostname

## Security and Encryption 
### JWT-based Authentication
1. Generate a secret key:
`const crypto = require('crypto');`
`const secret = crypto.randomBytes(64).toString('hex');`
`console.log(secret); `
2. Using the generated secret key in `app.js` for the JWT authentication
### Input Validation and Sanitisation
_ The server sanitises user inputs by using the `sanitize-html` library to prevent XSS attacks
### Secure WebSocket Connection (WSS)
_ `wss://` was used in the application for encrypted WebSocket connections. In addition, the SSL certificates need to be appropriate set up
### Rate Limiting
_ In order to proven DoS attack, `express-rate-limit` library was used to limiting the rate

## Peer Review
 If you have any suggestions for improvements, or bug fixes, feel free to open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). 

## Contact
Group 13 
For any feedback or inquiries, please feel free to contact a1878870@adelaide.edu.eu

