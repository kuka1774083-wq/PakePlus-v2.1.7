// 全局变量
let tasks = [];
let currentTaskId = 0;
let clearConfirmCount = 0;
let deleteConfirmCount = 0;
let currentDeleteTaskId = null;
let currentKeyValuePairs = [];

// DOM元素
const addTaskBtn = document.getElementById('add-task');
const runAllBtn = document.getElementById('run-all');
const clearListBtn = document.getElementById('clear-list');
const importListBtn = document.getElementById('import-list');
const exportListBtn = document.getElementById('export-list');
const taskTableBody = document.getElementById('task-table-body');
const settingsModal = document.getElementById('settings-modal');
const confirmModal = document.getElementById('confirm-modal');
const importOptionsModal = document.getElementById('import-options-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');
const settingsForm = document.getElementById('settings-form');
const closeModalBtn = document.querySelector('.close');
const cancelSettingsBtn = document.querySelector('.cancel');
const importOverwriteBtn = document.getElementById('import-overwrite');
const importMergeBtn = document.getElementById('import-merge');
const importCancelBtn = document.getElementById('import-cancel');
const addKeyValueBtn = document.getElementById('add-key-value');
const keyValueTableBody = document.getElementById('key-value-table-body');

// 配置文件对话框元素
const configModal = document.getElementById('config-modal');
const configTextarea = document.getElementById('config-textarea');
const copyConfigBtn = document.getElementById('copy-config');
const saveConfigBtn = document.getElementById('save-config');
const configCancelBtn = document.getElementById('config-cancel');
const configCloseBtn = configModal.querySelector('.close');

// 确认对话框关闭按钮
const confirmCloseBtn = confirmModal.querySelector('.close');

// 导入选项对话框关闭按钮
const importOptionsCloseBtn = importOptionsModal.querySelector('.close');

// 剪贴板导入对话框元素
const clipboardImportModal = document.getElementById('clipboard-import-modal');
const clipboardImportTextarea = document.getElementById('clipboard-import-textarea');
const pasteClipboardBtn = document.getElementById('paste-clipboard');
const importFromFileBtn = document.getElementById('import-from-file');
const importClipboardBtn = document.getElementById('import-clipboard');
const clipboardImportCancelBtn = document.getElementById('clipboard-import-cancel');
const clipboardImportCloseBtn = clipboardImportModal.querySelector('.close');

// 初始化
function init() {
    loadTasksFromLocalStorage();
    renderTasks();
    setupEventListeners();
}

// 从LocalStorage加载任务
function loadTasksFromLocalStorage() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        // 确保每个任务都有status属性，并且刷新时状态设置为"就绪"
        tasks = tasks.map(task => ({
            ...task,
            status: '就绪'
        }));
        if (tasks.length > 0) {
            currentTaskId = Math.max(...tasks.map(task => task.id)) + 1;
        }
    }
}

// 保存任务到LocalStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 设置事件监听器
function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    runAllBtn.addEventListener('click', runAllTasks);
    clearListBtn.addEventListener('click', showClearConfirm);
    importListBtn.addEventListener('click', importList);
    exportListBtn.addEventListener('click', exportList);
    closeModalBtn.addEventListener('click', closeSettingsModal);
    cancelSettingsBtn.addEventListener('click', closeSettingsModal);
    addKeyValueBtn.addEventListener('click', addKeyValue);
    confirmYesBtn.addEventListener('click', handleConfirmYes);
    confirmNoBtn.addEventListener('click', closeConfirmModal);
    confirmCloseBtn.addEventListener('click', closeConfirmModal);
    settingsForm.addEventListener('submit', saveTaskSettings);
    importOverwriteBtn.addEventListener('click', () => handleImport('overwrite'));
    importMergeBtn.addEventListener('click', () => handleImport('merge'));
    importCancelBtn.addEventListener('click', closeImportOptionsModal);
    importOptionsCloseBtn.addEventListener('click', closeImportOptionsModal);
    
    // 配置文件对话框事件
    copyConfigBtn.addEventListener('click', copyConfigToClipboard);
    saveConfigBtn.addEventListener('click', saveConfigToFile);
    configCancelBtn.addEventListener('click', closeConfigModal);
    configCloseBtn.addEventListener('click', closeConfigModal);
    
    // 剪贴板导入对话框事件
    pasteClipboardBtn.addEventListener('click', pasteFromClipboard);
    importFromFileBtn.addEventListener('click', importFromFile);
    importClipboardBtn.addEventListener('click', importFromClipboard);
    clipboardImportCancelBtn.addEventListener('click', closeClipboardImportModal);
    clipboardImportCloseBtn.addEventListener('click', closeClipboardImportModal);
    
    // 点击弹窗外部不关闭弹窗，但触发按钮和窗口动画
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            // 触发设置窗口按钮动画
            const closeBtn = settingsModal.querySelector('.close');
            const cancelBtn = settingsModal.querySelector('.cancel');
            const saveBtn = settingsModal.querySelector('button[type="submit"]');
            animateButtons([closeBtn, cancelBtn, saveBtn]);
            // 触发窗口缩放动画
            animateWindow(settingsModal);
        }
        if (e.target === confirmModal) {
            // 触发确认窗口按钮动画
            const closeBtn = confirmModal.querySelector('.close');
            const yesBtn = confirmModal.querySelector('#confirm-yes');
            const noBtn = confirmModal.querySelector('#confirm-no');
            animateButtons([closeBtn, yesBtn, noBtn]);
            // 触发窗口缩放动画
            animateWindow(confirmModal);
        }
        if (e.target === importOptionsModal) {
            // 触发导入选项窗口按钮动画
            const closeBtn = importOptionsModal.querySelector('.close');
            const overwriteBtn = importOptionsModal.querySelector('#import-overwrite');
            const mergeBtn = importOptionsModal.querySelector('#import-merge');
            const cancelBtn = importOptionsModal.querySelector('#import-cancel');
            animateButtons([closeBtn, overwriteBtn, mergeBtn, cancelBtn]);
            // 触发窗口缩放动画
            animateWindow(importOptionsModal);
        }
        if (e.target === configModal) {
            // 触发配置窗口按钮动画
            const closeBtn = configModal.querySelector('.close');
            const copyBtn = configModal.querySelector('#copy-config');
            const saveBtn = configModal.querySelector('#save-config');
            const cancelBtn = configModal.querySelector('#config-cancel');
            animateButtons([closeBtn, copyBtn, saveBtn, cancelBtn]);
            // 触发窗口缩放动画
            animateWindow(configModal);
        }
        if (e.target === clipboardImportModal) {
            // 触发剪贴板导入窗口按钮动画
            const closeBtn = clipboardImportModal.querySelector('.close');
            const pasteBtn = clipboardImportModal.querySelector('#paste-clipboard');
            const fileBtn = clipboardImportModal.querySelector('#import-from-file');
            const importBtn = clipboardImportModal.querySelector('#import-clipboard');
            const cancelBtn = clipboardImportModal.querySelector('#clipboard-import-cancel');
            animateButtons([closeBtn, pasteBtn, fileBtn, importBtn, cancelBtn]);
            // 触发窗口缩放动画
            animateWindow(clipboardImportModal);
        }
    });

    // 按钮动画函数
    function animateButtons(buttons) {
        buttons.forEach(button => {
            if (button) {
                button.classList.add('pulse-shake');
                setTimeout(() => {
                    button.classList.remove('pulse-shake');
                }, 500);
            }
        });
    }

    // 窗口缩放动画函数
    function animateWindow(modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('window-pulse');
            setTimeout(() => {
                modalContent.classList.remove('window-pulse');
            }, 500);
        }
    }
}

// 添加任务
function addTask() {
    const newTask = {
        id: currentTaskId++,
        name: `任务${currentTaskId}`,
        ip: '',
        port: 1880,
        timeout: 5,
        url: '/startblock',
        method: 'get',
        keyValuePairs: [],
        status: '就绪'
    };
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
}

// 渲染任务列表
function renderTasks() {
    taskTableBody.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.dataset.id = task.id;
        
        // 任务名
        const nameCell = document.createElement('td');
        nameCell.textContent = task.name;
        
        // 状态
        const statusCell = document.createElement('td');
        const taskStatus = task.status || '就绪';
        statusCell.textContent = taskStatus;
        // 设置状态样式
        if (taskStatus.includes('就绪')) {
            statusCell.className = 'status-waiting';
        } else if (taskStatus.includes('运行中')) {
            statusCell.className = 'status-running';
        } else if (taskStatus.includes('已丢失连接') || taskStatus.includes('超时')) {
            statusCell.className = 'status-error';
        } else if (taskStatus.includes('运行完成')) {
            statusCell.className = 'status-success';
        }
        
        // 操作按钮
        const actionCell = document.createElement('td');
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        // 运行按钮
        const runBtn = document.createElement('button');
        runBtn.textContent = '运行';
        runBtn.addEventListener('click', () => runTask(task.id));
        
        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '设置';
        settingsBtn.addEventListener('click', () => showSettingsModal(task.id));
        
        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => showDeleteConfirm(task.id));
        
        actionButtons.appendChild(runBtn);
        actionButtons.appendChild(settingsBtn);
        actionButtons.appendChild(deleteBtn);
        actionCell.appendChild(actionButtons);
        
        row.appendChild(nameCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);
        taskTableBody.appendChild(row);
    });
}

// 显示设置弹窗
function showSettingsModal(taskId) {
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (!task) return;
    
    document.getElementById('task-id').value = task.id;
    document.getElementById('service-name').value = task.name;
    document.getElementById('service-ip').value = task.ip;
    document.getElementById('service-port').value = task.port;
    document.getElementById('timeout').value = task.timeout;
    document.getElementById('service-url').value = task.url;
    document.getElementById('request-method').value = task.method;
    
    // 加载键值对
    currentKeyValuePairs = task.keyValuePairs || [];
    renderKeyValueTable();
    
    settingsModal.style.display = 'block';
}

// 关闭设置弹窗
function closeSettingsModal() {
    settingsModal.style.display = 'none';
    currentKeyValuePairs = [];
    keyValueTableBody.innerHTML = '';
}

// 添加键值对
function addKeyValue() {
    currentKeyValuePairs.push({ key: '', value: '' });
    renderKeyValueTable();
}

// 删除键值对
function deleteKeyValue(index) {
    currentKeyValuePairs.splice(index, 1);
    renderKeyValueTable();
}

// 渲染键值对表格
function renderKeyValueTable() {
    keyValueTableBody.innerHTML = '';
    currentKeyValuePairs.forEach((pair, index) => {
        const row = document.createElement('tr');
        
        const keyCell = document.createElement('td');
        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.value = pair.key;
        keyInput.className = 'table-input';
        keyInput.addEventListener('input', (e) => {
            currentKeyValuePairs[index].key = e.target.value;
        });
        keyCell.appendChild(keyInput);
        
        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.value = pair.value;
        valueInput.className = 'table-input';
        valueInput.addEventListener('input', (e) => {
            currentKeyValuePairs[index].value = e.target.value;
        });
        valueCell.appendChild(valueInput);
        
        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => deleteKeyValue(index));
        actionCell.appendChild(deleteBtn);
        
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        row.appendChild(actionCell);
        keyValueTableBody.appendChild(row);
    });
}

// 保存任务设置
function saveTaskSettings(e) {
    e.preventDefault();
    
    const taskId = parseInt(document.getElementById('task-id').value);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 验证键值对
    const validatedPairs = [];
    const keySet = new Set();
    
    for (let i = 0; i < currentKeyValuePairs.length; i++) {
        const pair = currentKeyValuePairs[i];
        const key = pair.key.trim();
        const value = pair.value.trim();
        
        // 检查命令是否为空
        if (!key) {
            alert(`第${i + 1}行的命令不能为空`);
            return;
        }
        
        // 检查命令是否重复
        if (keySet.has(key)) {
            alert(`命令"${key}"重复，请修改`);
            return;
        }
        
        keySet.add(key);
        validatedPairs.push({ key, value });
    }
    
    task.name = document.getElementById('service-name').value;
    task.ip = document.getElementById('service-ip').value;
    task.port = parseInt(document.getElementById('service-port').value);
    task.timeout = parseInt(document.getElementById('timeout').value);
    task.url = document.getElementById('service-url').value;
    task.method = document.getElementById('request-method').value;
    task.keyValuePairs = validatedPairs;
    
    saveTasksToLocalStorage();
    renderTasks();
    closeSettingsModal();
}

// 显示删除确认对话框
function showDeleteConfirm(taskId) {
    currentDeleteTaskId = taskId;
    deleteConfirmCount = 0;
    showDeleteConfirmStep();
}

// 显示删除确认步骤
function showDeleteConfirmStep() {
    deleteConfirmCount++;
    if (deleteConfirmCount <= 2) {
        confirmMessage.textContent = `确定要删除此任务吗？（${deleteConfirmCount}/2）`;
        confirmModal.style.display = 'block';
    } else {
        deleteTask(currentDeleteTaskId);
        closeConfirmModal();
        deleteConfirmCount = 0;
        currentDeleteTaskId = null;
    }
}

// 显示清空列表确认对话框
function showClearConfirm() {
    clearConfirmCount = 0;
    showClearConfirmStep();
}

// 显示清空确认步骤
function showClearConfirmStep() {
    clearConfirmCount++;
    if (clearConfirmCount <= 3) {
        confirmMessage.textContent = `确定要清空所有任务吗？（${clearConfirmCount}/3）`;
        confirmModal.style.display = 'block';
    } else {
        clearTasks();
        closeConfirmModal();
        clearConfirmCount = 0;
    }
}

// 关闭确认对话框
function closeConfirmModal() {
    confirmModal.style.display = 'none';
}

// 处理确认按钮点击
function handleConfirmYes() {
    if (currentDeleteTaskId !== null) {
        showDeleteConfirmStep();
    } else {
        showClearConfirmStep();
    }
}

// 删除任务
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== parseInt(taskId));
    saveTasksToLocalStorage();
    renderTasks();
}

// 清空任务
function clearTasks() {
    tasks = [];
    currentTaskId = 0;
    saveTasksToLocalStorage();
    renderTasks();
}

// 运行任务
function runTask(taskId) {
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (!task) return;
    
    // 更新状态为运行中
    task.status = '运行中……';
    renderTasks();
    
    // 构建URL
    let url = `http://${task.ip}:${task.port}${task.url}`;
    
    // 设置超时时间（毫秒）
    const timeout = task.timeout * 60 * 1000;
    
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
        task.status = '已丢失连接或超时';
        renderTasks();
    }, timeout);
    
    // 准备请求配置
    const fetchOptions = {
        method: task.method.toUpperCase(),
        signal: controller.signal
    };
    
    // 处理键值对数据
    if (task.keyValuePairs && task.keyValuePairs.length > 0) {
        if (task.method.toUpperCase() === 'GET') {
            // GET请求：将键值对作为查询参数添加到URL中
            const params = new URLSearchParams();
            task.keyValuePairs.forEach(pair => {
                if (pair.key) {
                    params.append(pair.key, pair.value);
                }
            });
            const queryString = params.toString();
            if (queryString) {
                url += (url.includes('?') ? '&' : '?') + queryString;
            }
        } else {
            // POST、PUT、DELETE请求：将键值对作为请求体发送
            const body = {};
            task.keyValuePairs.forEach(pair => {
                if (pair.key) {
                    // 检查value是否为纯数字，如果是则转换为数字类型
                    const value = pair.value;
                    if (!isNaN(value) && value.trim() !== '' && !isNaN(parseFloat(value))) {
                        body[pair.key] = parseFloat(value);
                    } else {
                        body[pair.key] = value;
                    }
                }
            });
            fetchOptions.headers = {
                'Content-Type': 'application/json'
            };
            fetchOptions.body = JSON.stringify(body);
        }
    }
    
    // 发送fetch请求
    fetch(url, fetchOptions)
    .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
            throw new Error('服务器返回错误');
        }
        return response.text();
    })
    .then(data => {
        task.status = `运行完成：${data}`;
        renderTasks();
    })
    .catch(error => {
        clearTimeout(timeoutId);
        if (error.name !== 'AbortError') {
            task.status = `已丢失连接或超时`;
            renderTasks();
        }
    });
}

// 运行所有任务
function runAllTasks() {
    tasks.forEach(task => {
        runTask(task.id);
    });
}

// 导出列表
function exportList() {
    showConfigModal();
}

// 显示配置文件对话框
function showConfigModal() {
    const tasksToExport = tasks.map(task => ({
        id: task.id,
        name: task.name,
        ip: task.ip,
        port: task.port,
        timeout: task.timeout,
        url: task.url,
        method: task.method,
        keyValuePairs: task.keyValuePairs
    }));
    
    const dataStr = JSON.stringify(tasksToExport, null, 2);
    configTextarea.value = dataStr;
    configModal.style.display = 'block';
}

// 关闭配置文件对话框
function closeConfigModal() {
    configModal.style.display = 'none';
    configTextarea.value = '';
}

// 复制配置到剪贴板
function copyConfigToClipboard() {
    const configText = configTextarea.value;
    navigator.clipboard.writeText(configText)
        .then(() => {
            alert('配置已复制到剪贴板');
        })
        .catch(err => {
            alert('复制失败，请手动复制');
            console.error('复制失败:', err);
        });
}

// 保存配置到文件
function saveConfigToFile() {
    const dataStr = configTextarea.value;
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();
    URL.revokeObjectURL(url);
}

// 导入列表
function importList() {
    // 直接打开剪贴板导入对话框
    showClipboardImportModal();
}

// 从文件导入
function importFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    // 检查是否有现有数据
                    if (tasks.length > 0) {
                        // 显示导入选项对话框
                        window.importedTasksData = importedTasks;
                        importOptionsModal.style.display = 'block';
                    } else {
                        // 直接覆盖
                        importTasks(importedTasks, 'overwrite');
                    }
                }
            } catch (error) {
                alert('导入失败：无效的JSON文件');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// 显示剪贴板导入对话框
function showClipboardImportModal() {
    clipboardImportTextarea.value = '';
    clipboardImportModal.style.display = 'block';
}

// 关闭剪贴板导入对话框
function closeClipboardImportModal() {
    clipboardImportModal.style.display = 'none';
    clipboardImportTextarea.value = '';
}

// 从剪贴板粘贴
function pasteFromClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            clipboardImportTextarea.value = text;
        })
        .catch(err => {
            alert('粘贴失败，请手动粘贴');
            console.error('粘贴失败:', err);
        });
}

// 从剪贴板导入
function importFromClipboard() {
    const clipboardText = clipboardImportTextarea.value.trim();
    if (!clipboardText) {
        alert('请粘贴配置文件内容');
        return;
    }
    
    try {
        const importedTasks = JSON.parse(clipboardText);
        if (Array.isArray(importedTasks)) {
            // 检查是否有现有数据
            if (tasks.length > 0) {
                // 显示导入选项对话框
                window.importedTasksData = importedTasks;
                closeClipboardImportModal();
                importOptionsModal.style.display = 'block';
            } else {
                // 直接覆盖
                importTasks(importedTasks, 'overwrite');
                closeClipboardImportModal();
            }
        } else {
            alert('导入失败：无效的配置格式');
        }
    } catch (error) {
        alert('导入失败：无效的JSON格式');
        console.error('导入失败:', error);
    }
}

// 处理导入
function handleImport(type) {
    if (window.importedTasksData) {
        importTasks(window.importedTasksData, type);
        window.importedTasksData = null;
        closeImportOptionsModal();
    }
}

// 关闭导入选项对话框
function closeImportOptionsModal() {
    importOptionsModal.style.display = 'none';
}

// 导入任务
function importTasks(importedTasks, type) {
    if (type === 'overwrite') {
        // 覆盖现有任务
        tasks = importedTasks.map(task => ({
            ...task,
            keyValuePairs: task.keyValuePairs || [],
            status: '就绪'
        }));
        if (tasks.length > 0) {
            currentTaskId = Math.max(...tasks.map(task => task.id)) + 1;
        }
    } else if (type === 'merge') {
        // 合并任务，去重
        importedTasks.forEach(importedTask => {
            // 检查是否已存在相同IP、端口、URL的任务
            const existingTaskIndex = tasks.findIndex(task => 
                task.ip === importedTask.ip &&
                task.port === importedTask.port &&
                task.url === importedTask.url
            );
            
            if (existingTaskIndex === -1) {
                // 不存在，添加新任务
                tasks.push({
                    ...importedTask,
                    id: currentTaskId++,
                    keyValuePairs: importedTask.keyValuePairs || [],
                    status: '就绪'
                });
            }
            // 存在，保留本地任务
        });
    }
    
    saveTasksToLocalStorage();
    renderTasks();
}

// 初始化应用
init();