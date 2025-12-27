
// 页面加载完成后初始化数据
document.addEventListener('DOMContentLoaded', () => {
  let links = JSON.parse(localStorage.getItem('externalLinks')) || [];
  const linkContainer = document.getElementById('linkContainer');
  const modal = document.getElementById('modal');
  const linkForm = document.getElementById('linkForm');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const modalTitle = document.getElementById('modalTitle');
  const editIndexInput = document.getElementById('editIndex');

  // 渲染链接列表
  function renderLinks() {
    linkContainer.innerHTML = '';
    if (links.length === 0) {
      linkContainer.innerHTML = '<p class="text-gray-500 text-center">暂无链接，请添加一个</p>';
      return;
    }

    links.forEach((link, index) => {
      const card = document.createElement('div');
      card.className = 'border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex justify-between items-center fade-in';
      card.innerHTML = `
        <div>
          <h3 class="font-medium text-gray-800">${link.title}</h3>
          <a href="${link.url}" target="_blank" class="text-indigo-600 text-sm hover:underline truncate block w-64">${link.url}</a>
        </div>
        <div class="flex space-x-2">
          <button onclick="editLink(${index})" class="text-blue-500 hover:text-blue-700">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteLink(${index})" class="text-red-500 hover:text-red-700">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      linkContainer.appendChild(card);
    });
  }

  // 打开模态框
  function openModal(isEdit = false, index = null) {
    modal.classList.remove('hidden');
    if (isEdit) {
      modalTitle.textContent = '编辑链接';
      const link = links[index];
      document.getElementById('title').value = link.title;
      document.getElementById('url').value = link.url;
      editIndexInput.value = index;
    } else {
      modalTitle.textContent = '添加新链接';
      linkForm.reset();
      editIndexInput.value = '';
    }
  }

  // 关闭模态框
  function closeAndReset() {
    modal.classList.add('hidden');
    linkForm.reset();
  }

  // 保存链接
  linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const url = document.getElementById('url').value.trim();
    const editIndex = editIndexInput.value;

    if (editIndex !== '') {
      links[editIndex] = { title, url };
    } else {
      links.push({ title, url });
    }

    localStorage.setItem('externalLinks', JSON.stringify(links));
    renderLinks();
    closeAndReset();
  });

  // 编辑链接
  window.editLink = function(index) {
    openModal(true, index);
  };

  // 删除链接
  window.deleteLink = function(index) {
    if (confirm('确定要删除这个链接吗？')) {
      links.splice(index, 1);
      localStorage.setItem('externalLinks', JSON.stringify(links));
      renderLinks();
    }
  };

  // 添加按钮事件
  addLinkBtn.addEventListener('click', () => openModal());

  // 取消按钮事件
  cancelBtn.addEventListener('click', closeAndReset);

  // 初始化显示
  renderLinks();
});
