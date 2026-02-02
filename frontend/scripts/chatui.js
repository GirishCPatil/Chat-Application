const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
let token = localStorage.getItem('token')
let BaseURL = "http://localhost:4000";



function getMessage() {
  let data = axios.get(`${BaseURL}/chat/messages`, {
    headers: { 'Authorization': token }
  })
  data.data.forEach(msg => {
    const msgElem = document.createElement('div');
    msgElem.textContent = msg.message;
    chatMessages.appendChild(msgElem);
  });

}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  getMessage();
  messageInput.value = '';
    try {
    const response = await axios.post(`${BaseURL}/chat/send`, { message: text }, {
      headers: { 'Authorization': token }
    });

    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});