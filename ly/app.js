
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('messageForm');
  const messageList = document.getElementById('messageList');
  const noMessages = document.getElementById('noMessages');

  // 从 localStorage 加载留言
  loadMessages();

  // 提交留言
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const content = document.getElementById('content').value.trim();

    if (username && content) {
      const message = {
        id: Date.now(),
        username,
        content,
        timestamp: new Date().toLocaleString()
      };

      saveMessage(message);
      renderMessage(message);
      form.reset();
      noMessages.classList.add('hidden');
    }
  });

  // 加载所有留言
  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    if (messages.length === 0) {
      noMessages.classList.remove('hidden');
    } else {
      messages.forEach(renderMessage);
    }
  }

  // 保存留言到 localStorage
  function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
  }

  // 渲染单条留言
  function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'bg-white rounded-xl shadow p-5 fade-in';
    messageElement.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-semibold text-indigo-600">${escapeHtml(message.username)}</h3>
          <p class="text-gray-700 mt-2">${escapeHtml(message.content)}</p>
        </div>
        <button onclick="deleteMessage(${message.id})" class="text-gray-400 hover:text-red-500 transition">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="text-xs text-gray-500 mt-3">${message.timestamp}</div>
    `;
    messageList.prepend(messageElement);
  }

  // 删除留言
  window.deleteMessage = function(id) {
    if (confirm('确定要删除这条留言吗？')) {
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      const updatedMessages = messages.filter(m => m.id !== id);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      location.reload();
    }
  };

  // 防止 XSS
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
});
