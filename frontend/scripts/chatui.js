const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const socket = io("http://localhost:4000",{auth:{token:localStorage.getItem('token')}});

let token = localStorage.getItem('token')
let BaseURL = "http://localhost:4000";



// async function getMessage() {
//   let data = await axios.get(`${BaseURL}/chat/messages`, {
//     headers: { 'Authorization': token }
//   })
//   console.log(data.data);
//   chatMessages.innerHTML = '';
//   data.data.forEach(msg => {
//     const msgElem = document.createElement('div');
//     msgElem.id = 'sent';
//     msgElem.textContent = `sent by:${msg.UserId} ${msg.message}`;
//     chatMessages.appendChild(msgElem);
//   });

// }
// getMessage();


async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
 
  messageInput.value = '';
  try{
    socket.emit("sendMessage", {message: text});
    appendMessage(text, "sent");
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
sendBtn.addEventListener('click', sendMessage);



messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});


socket.on("receiveMessage", (msg) => {
  console.log(msg.message.message);
  appendMessage(`${msg.user} : ${msg.message.message}`, "received");
});


function appendMessage(text, type) {
  const msgElem = document.createElement('div');
  msgElem.classList.add('message', type);
  msgElem.innerHTML = `
    ${text} 
    <div class="timestamp">${type} ${new Date().toLocaleTimeString()}</div>
  `;
  chatMessages.appendChild(msgElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
