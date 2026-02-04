const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
let token= localStorage.getItem('token');

const socket = io("http://localhost:4000", {
  auth: { token: token }
});

let BaseURL = "http://localhost:4000";

/* ===============================
   SEND MESSAGE (NO CHANGE)
================================ */
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  messageInput.value = '';
  try {
    socket.emit("sendMessage", text);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

/* ===============================
   RECEIVE MESSAGE (FIXED)
================================ */
socket.on("receiveMessage", (msg) => {
  appendMessage(`${msg.user} : ${msg.text}`, "received");
});

/* ===============================
   APPEND MESSAGE (NO CHANGE)
================================ */
function appendMessage(text, type) {
  const msgElem = document.createElement('div');
  msgElem.classList.add('message', type);
  msgElem.innerHTML = `
    ${text} 
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
  `;
  chatMessages.appendChild(msgElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
