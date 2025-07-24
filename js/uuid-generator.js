class UUIDGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.uuidCount = document.getElementById('uuidCount');
        this.uuidResult = document.getElementById('uuidResult');
        
        this.generateUuidV4Btn = document.getElementById('generateUuidV4Btn');
        this.generateUuidV1Btn = document.getElementById('generateUuidV1Btn');
        this.copyUuidBtn = document.getElementById('copyUuidBtn');
        this.clearUuidBtn = document.getElementById('clearUuidBtn');
    }

    bindEvents() {
        if (!this.uuidCount) return;

        this.generateUuidV4Btn?.addEventListener('click', () => this.generateUUIDv4());
        this.generateUuidV1Btn?.addEventListener('click', () => this.generateUUIDv1());
        this.copyUuidBtn?.addEventListener('click', () => this.copyResult());
        this.clearUuidBtn?.addEventListener('click', () => this.clearAll());
    }

    generateUUIDv4() {
        const count = parseInt(this.uuidCount.value) || 1;
        if (count < 1 || count > 100) {
            Utils.showResult(this.uuidResult, '生成数量必须在1-100之间', 'error');
            return;
        }

        try {
            const uuids = [];
            for (let i = 0; i < count; i++) {
                uuids.push(this.generateV4());
            }

            const resultHtml = `<div class="uuid-result">
                <h4>🆔 UUID v4 生成结果（${count}个）：</h4>
                <div class="result-content uuid-list">
                    ${uuids.map((uuid, index) => `<div class="uuid-item">
                        <span class="uuid-index">${index + 1}.</span>
                        <span class="uuid-value">${uuid}</span>
                    </div>`).join('')}
                </div>
                <div class="uuid-info">
                    <small>版本：UUID v4 | 类型：随机生成 | 长度：36字符（含连字符）</small>
                </div>
            </div>`;

            Utils.showResult(this.uuidResult, resultHtml, 'success');
        } catch (error) {
            Utils.showResult(this.uuidResult, `生成UUID失败：${error.message}`, 'error');
        }
    }

    generateUUIDv1() {
        const count = parseInt(this.uuidCount.value) || 1;
        if (count < 1 || count > 100) {
            Utils.showResult(this.uuidResult, '生成数量必须在1-100之间', 'error');
            return;
        }

        try {
            const uuids = [];
            for (let i = 0; i < count; i++) {
                uuids.push(this.generateV1());
            }

            const resultHtml = `<div class="uuid-result">
                <h4>⏰ UUID v1 生成结果（${count}个）：</h4>
                <div class="result-content uuid-list">
                    ${uuids.map((uuid, index) => `<div class="uuid-item">
                        <span class="uuid-index">${index + 1}.</span>
                        <span class="uuid-value">${uuid}</span>
                    </div>`).join('')}
                </div>
                <div class="uuid-info">
                    <small>版本：UUID v1 | 类型：基于时间戳 | 长度：36字符（含连字符）</small>
                </div>
            </div>`;

            Utils.showResult(this.uuidResult, resultHtml, 'success');
        } catch (error) {
            Utils.showResult(this.uuidResult, `生成UUID失败：${error.message}`, 'error');
        }
    }

    // 生成UUID v4（随机）
    generateV4() {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        
        // 兼容性实现
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 生成UUID v1（基于时间戳）
    generateV1() {
        // 获取当前时间戳（100纳秒为单位，从1582年10月15日开始）
        const now = new Date().getTime();
        const timestamp = (now * 10000) + 0x01B21DD213814000;
        
        // 时间戳的低32位
        const timeLow = (timestamp & 0xFFFFFFFF).toString(16).padStart(8, '0');
        
        // 时间戳的中16位
        const timeMid = ((timestamp >> 32) & 0xFFFF).toString(16).padStart(4, '0');
        
        // 时间戳的高12位 + 版本号(1)
        const timeHiAndVersion = (((timestamp >> 48) & 0x0FFF) | 0x1000).toString(16).padStart(4, '0');
        
        // 时钟序列（随机）
        const clockSeq = (Math.random() * 0x3FFF | 0x8000).toString(16).padStart(4, '0');
        
        // 节点标识符（随机，但第一位设置为1表示随机生成）
        const node = Array.from({length: 6}, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join('');
        
        // 设置节点的第一位为1（表示随机生成的MAC地址）
        const nodeWithFlag = (parseInt(node.substring(0, 2), 16) | 0x01).toString(16).padStart(2, '0') + node.substring(2);
        
        return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}-${nodeWithFlag}`;
    }

    copyResult() {
        const uuidItems = this.uuidResult.querySelectorAll('.uuid-value');
        if (uuidItems.length === 0) {
            Utils.showResult(this.uuidResult, '没有可复制的结果', 'error');
            return;
        }

        const uuids = Array.from(uuidItems).map(item => item.textContent).join('\n');
        Utils.copyToClipboard(uuids);
    }

    clearAll() {
        this.uuidCount.value = '1';
        this.uuidResult.innerHTML = '';
        this.uuidCount.focus();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UUIDGenerator;
}