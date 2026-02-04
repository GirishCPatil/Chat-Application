const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const emailInput = document.getElementById('emailInput');
const joinBtn = document.getElementById('joinBtn');
const groupNameInput = document.getElementById('groupchatInput');
const groupJoinBtn = document.getElementById('joinGroupBtn');
const fileInput = document.getElementById("fileInput");
const sendFileBtn = document.getElementById("sendFileBtn");


sendFileBtn.addEventListener("click", () => fileInput.click());

// 🔑 Identity from login (Option 3)
const myEmail = localStorage.getItem('email');
console.log("Logged in as:", myEmail);
const token = localStorage.getItem('token');

const socket = io("http://localhost:4000", {
  auth: { token: token }
});

let roomId = null;
let groupchatId = null;

groupJoinBtn.addEventListener('click', () => {
  const groupName = groupNameInput.value.trim();
  if (!groupName) {
    alert("Please enter group name");
    return;
  }
  groupchatId = groupName;
  socket.emit("groupmsg", { groupId :groupchatId });
  chatMessages.innerHTML = '';
  alert(`Joined group chat: ${groupName}`);
});

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


  roomId = [myEmail, otherUserEmail].sort().join("_");

  socket.emit("join_room", { roomId });

  chatMessages.innerHTML = '';
  alert(`Chat started with ${otherUserEmail}`);
});


function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  socket.emit("new_message", { roomId, text });
  socket.emit("new_message", { groupId: groupchatId, text });
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});


socket.on("receive_message", (msg) => {
  const type = myEmail == msg.email? "sent" : "received";
  appendMessage(`${msg.user} : ${msg.text}`, type);
});

sendFileBtn.addEventListener("click", async () => {
  if (!roomId) {
    alert("Join chat first");
    return;
  }

  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "http://localhost:4000/media/upload",
    formData
  );

  socket.emit("media_message", {
    roomId,
    fileUrl: res.data.fileUrl,
    fileType: file.type
  });

  fileInput.value = "";
});



function appendMessage(text, type) {
  const msgElem = document.createElement('div');
  msgElem.classList.add('message', type);
  msgElem.innerHTML = `
    ${text}
    <div class="timestamp">${new Date().toLocaleTimeString()}</div> `;
  chatMessages.appendChild(msgElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on("receive_media_message", (msg) => {
  const type = msg.user === myEmail ? "sent" : "received";

  if (msg.fileUrl) {
    if (msg.fileType.startsWith("image")) {
      appendMessage(`<img src="${msg.fileUrl}" width="200">`, type);
    } else {
      appendMessage(
        `<a href="${msg.fileUrl}" target="_blank">Download file</a>`,
        type
      );
    }
  } else {
    appendMessage(`${msg.user}: ${msg.text}`, type);
  }
});
