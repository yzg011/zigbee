
// 留言板JavaScript逻辑
class MessageBoard {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('messages')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderMessages();
    }

    bindEvents() {
        // 表单提交事件
        document.getElementById('messageForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMessage();
        });

        // 刷新按钮事件
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.renderMessages();
        });

        // 模态框关闭事件
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        document.getElementById('messageModal').addEventListener('click', (e) => {
            if (e.target.id === 'messageModal') {
                this.closeModal();
            }
        });
    }

    addMessage() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const timestamp = new Date().toLocaleString();

        const newMessage = {
            id: Date.now(),
            name: name,
            email: email,
            content: message,
            timestamp: timestamp
        };

        this.messages.unshift(newMessage);
        localStorage.setItem('messages', JSON.stringify(this.messages));

        // 重置表单
        document.getElementById('messageForm').reset();

        // 重新渲染留言列表
        this.renderMessages();

        // 显示成功提示
        this.showMessage('留言发布成功！', 'success');
    }

    renderMessages() {
        const messageList = document.getElementById('messageList');
        
        if (this.messages.length === 0) {
            messageList.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-comment-slash text-4xl mb-2"></i>
                    <p>暂无留言，快来发表第一条留言吧！</p>
                </div>
            `;
            return;
        }

        messageList.innerHTML = this.messages.map(message => `
            <div class="message-card bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-semibold text-gray-800">${message.name}</h3>
                        <p class="text-sm text-gray-500">${message.timestamp}</p>
                    </div>
                    <button onclick="messageBoard.deleteMessage(${message.id})" class="text-red-500 hover:text-red-700 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="text-gray-700 mb-3">${message.content}</p>
                <button onclick="messageBoard.showDetail(${message.id})" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
                    <i class="fas fa-eye mr-1"></i>查看详情
                </button>
            </div>
        `).join('');
    }

    showDetail(id) {
        const message = this.messages.find(msg => msg.id === id);
        if (message) {
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <div class="space-y-3">
                    <div>
                        <label class="font-medium text-gray-700">姓名:</label>
                        <p class="text-gray-900">${message.name}</p>
                    </div>
                    <div>
                        <label class="font-medium text-gray-700">邮箱:</label>
                        <p class="text-gray-900">${message.email}</p>
                    </div>
                    <div>
                        <label class="font-medium text-gray-700">时间:</label>
                        <p class="text-gray-900">${message.timestamp}</p>
                    </div>
                    <div>
                        <label class="font-medium text-gray-700">留言内容:</label>
                        <p class="text-gray-900">${message.content}</p>
                    </div>
                </div>
            `;
            document.getElementById('messageModal').classList.remove('hidden');
            document.getElementById('messageModal').classList.add('flex');
        }
    }

    closeModal() {
        document.getElementById('messageModal').classList.add('hidden');
        document.getElementById('messageModal').classList.remove('flex');
    }

    deleteMessage(id) {
        if (confirm('确定要删除这条留言吗？')) {
            this.messages = this.messages.filter(message => message.id !== id);
            localStorage.setItem('messages', JSON.stringify(this.messages));
            this.renderMessages();
            this.showMessage('留言删除成功！', 'success');
        }
    }

    showMessage(text, type) {
        // 创建提示消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        messageEl.textContent = text;
        messageEl.style.transform = 'translateX(100%)';

        document.body.appendChild(messageEl);

        // 动画显示
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // 3秒后自动消失
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
}

// 初始化留言板
const messageBoard = new MessageBoard();
