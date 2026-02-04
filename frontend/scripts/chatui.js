const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const emailInput = document.getElementById('emailInput');
const joinBtn = document.getElementById('joinBtn');

// 🔑 Identity from login (Option 3)
const myEmail = localStorage.getItem('email');
console.log("Logged in as:", myEmail);
const token = localStorage.getItem('token');

const socket = io("http://localhost:4000", {
  auth: { token: token }
});

let roomId = null;

/* ===============================
   JOIN ROOM (PERSONAL CHAT)
================================ */
joinBtn.addEventListener('click', () => {
  const otherUserEmail = emailInput.value.trim();

  if (!otherUserEmail) {
    alert("Please enter user email");
    return;
  }

  if (!myEmail) {
    alert("User not logged in");
    return;
  }

  if (otherUserEmail === myEmail) {
    alert("You cannot chat with yourself");
    return;
  }

  // ✅ Deterministic room ID
  roomId = [myEmail, otherUserEmail].sort().join("_");

  socket.emit("join_room", { roomId });

  chatMessages.innerHTML = '';
  alert(`Chat started with ${otherUserEmail}`);
});

/* ===============================
   SEND MESSAGE (ROOM BASED)
================================ */
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  if (!roomId) {
    alert("Join a chat first");
    return;
  }

  socket.emit("new_message", { roomId, text });
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

/* ===============================
   RECEIVE MESSAGE
================================ */
socket.on("receive_message", (msg) => {
  const type = myEmail == msg.email? "sent" : "received";
  appendMessage(`${msg.user} : ${msg.text}`, type);
});

/* ===============================
   APPEND MESSAGE
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
