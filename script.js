function adjustHeight() {
    const textarea = document.getElementById('userInput');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function checkEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        submitInput();
    }
}

function submitInput() {
    const userInput = document.getElementById('userInput');
    const conversation = document.getElementById('conversation');
    
    if (userInput.value.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        
        const userIcon = document.createElement('img');
        userIcon.src = 'user-icon.png'; // 替换为实际的用户图标路径
        userIcon.className = 'user-icon';
        
        const userText = document.createElement('span');
        userText.textContent = userInput.value;
        
        userMessage.appendChild(userText);
        userMessage.appendChild(userIcon);
        
        conversation.appendChild(userMessage);
        const message = userInput.value;
        userInput.value = '';
        adjustHeight();
        
        // 发送消息到服务器（ChatGPT）进行处理
        sendRequestToChatGPT(message);
    }
}

function sendRequestToChatGPT(message) {
    // 构建请求对象
    const request = {
        "model": "gpt-3.5-turbo",
        "messages": [{
            "role": "user",
            "content": message
        }]
    };

    // 发送请求到服务器（这里使用示例的URL，根据实际情况修改）
    fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'sk-SmwGRrvyfNq8Qx073Sg6bWO2UB2ogIXzyU9IRu8XxywCPVhk',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const reply = data.choices[0].message.content;

        // 调试信息
        console.log('服务器返回的消息:', reply);
        console.log('解析后的HTML:', marked.parse(reply));

        // 将服务器返回的回复添加到聊天记录中
        const botMessage = document.createElement('div');
        botMessage.className = 'message reply-message';
        
        const botIcon = document.createElement('img');
        botIcon.src = 'robot-icon.png'; // 替换为实际的机器人图标路径
        botIcon.className = 'robot-icon';
        
        const botText = document.createElement('span');
        botText.innerHTML = marked.parse(reply); // 使用 marked 解析 Markdown 内容
        
        botMessage.appendChild(botIcon);
        botMessage.appendChild(botText);
        
        conversation.appendChild(botMessage);

        // 代码高亮
        document.querySelectorAll('pre code').forEach((block) => {
            block.classList.add('code-block'); // 添加代码块样式
            hljs.highlightBlock(block);

            // 添加复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = '复制代码';
            block.parentNode.appendChild(copyButton);

            // 初始化 Clipboard.js
            const clipboard = new ClipboardJS(copyButton, {
                target: () => block
            });

            clipboard.on('success', (e) => {
                copyButton.textContent = '已复制';
                setTimeout(() => {
                    copyButton.textContent = '复制代码';
                }, 2000);
                e.clearSelection();
            });

            clipboard.on('error', (e) => {
                copyButton.textContent = '复制失败';
                setTimeout(() => {
                    copyButton.textContent = '复制代码';
                }, 2000);
            });
        });
    })
    .catch(error => {
        console.error('请求ChatGPT时出错:', error);
    });
}

function addMessageToChatLog(message, className) {
    const conversation = document.getElementById('conversation');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', className);
    conversation.appendChild(messageElement);
    conversation.scrollTop = conversation.scrollHeight;
}



