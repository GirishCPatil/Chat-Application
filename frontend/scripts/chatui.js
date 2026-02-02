const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
let token = localStorage.getItem('token')
let BaseURL = "http://localhost:4000";



async function getMessage() {
  let data = await axios.get(`${BaseURL}/chat/messages`, {
    headers: { 'Authorization': token }
  })
  console.log(data.data);
  chatMessages.innerHTML = '';
  data.data.forEach(msg => {
    const msgElem = document.createElement('div');
    msgElem.textContent = `sent by:${msg.UserId} ${msg.message}`;
    chatMessages.appendChild(msgElem);
  });

}
getMessage();
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