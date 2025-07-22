// JSON 格式化工具类
class JSONFormatter {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定按钮事件
        const formatBtn = document.getElementById('formatJsonBtn');
        const compressBtn = document.getElementById('compressJsonBtn');
        const validateBtn = document.getElementById('validateJsonBtn');
        const clearBtn = document.getElementById('clearJsonBtn');
        const copyBtn = document.getElementById('copyJsonBtn');

        if (formatBtn) formatBtn.addEventListener('click', () => this.formatJSON());
        if (compressBtn) compressBtn.addEventListener('click', () => this.compressJSON());
        if (validateBtn) validateBtn.addEventListener('click', () => this.validateJSON());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearJSON());
        if (copyBtn) copyBtn.addEventListener('click', () => this.copyResult());

        // 绑定快捷键
        const jsonInput = document.getElementById('jsonInput');
        if (jsonInput) {
            jsonInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.formatJSON();
                }
            });
        }
    }

    formatJSON() {
        const input = document.getElementById('jsonInput');
        const result = document.getElementById('jsonResult');
        
        if (!input || !result) return;
        
        const inputValue = input.value.trim();
        
        if (!inputValue) {
            Utils.showResult('jsonResult', '请输入 JSON 数据', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(inputValue);
            const formatted = JSON.stringify(parsed, null, 2);
            
            Utils.showResult('jsonResult', 
                `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #28a745; font-weight: 600;">✓ JSON 格式化成功</span>
                    <small style="color: #6c757d;">字符数: ${formatted.length}</small>
                </div>
                <pre style="margin: 0; white-space: pre-wrap; word-break: break-word;">${Utils.escapeHtml(formatted)}</pre>`, 
                'success'
            );
            
            this.lastResult = formatted;
        } catch (error) {
            const errorInfo = this.parseJSONError(error.message, inputValue);
            Utils.showResult('jsonResult', 
                `<div style="color: #dc3545; font-weight: 600; margin-bottom: 10px;">✗ JSON 格式错误</div>
                <div style="margin-bottom: 8px;"><strong>错误信息:</strong> ${errorInfo.message}</div>
                ${errorInfo.position ? `<div><strong>错误位置:</strong> ${errorInfo.position}</div>` : ''}`, 
                'error'
            );
        }
    }

    compressJSON() {
        const input = document.getElementById('jsonInput');
        const result = document.getElementById('jsonResult');
        
        if (!input || !result) return;
        
        const inputValue = input.value.trim();
        
        if (!inputValue) {
            Utils.showResult('jsonResult', '请输入 JSON 数据', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(inputValue);
            const compressed = JSON.stringify(parsed);
            
            const originalLength = inputValue.length;
            const compressedLength = compressed.length;
            const compressionRatio = ((originalLength - compressedLength) / originalLength * 100).toFixed(1);
            
            Utils.showResult('jsonResult', 
                `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #28a745; font-weight: 600;">✓ JSON 压缩成功</span>
                    <small style="color: #6c757d;">压缩率: ${compressionRatio}%</small>
                </div>
                <div style="margin-bottom: 10px;">
                    <small style="color: #6c757d;">原始: ${originalLength} 字符 → 压缩后: ${compressedLength} 字符</small>
                </div>
                <pre style="margin: 0; white-space: pre-wrap; word-break: break-all;">${Utils.escapeHtml(compressed)}</pre>`, 
                'success'
            );
            
            this.lastResult = compressed;
        } catch (error) {
            const errorInfo = this.parseJSONError(error.message, inputValue);
            Utils.showResult('jsonResult', 
                `<div style="color: #dc3545; font-weight: 600; margin-bottom: 10px;">✗ JSON 格式错误</div>
                <div style="margin-bottom: 8px;"><strong>错误信息:</strong> ${errorInfo.message}</div>
                ${errorInfo.position ? `<div><strong>错误位置:</strong> ${errorInfo.position}</div>` : ''}`, 
                'error'
            );
        }
    }

    validateJSON() {
        const input = document.getElementById('jsonInput');
        const result = document.getElementById('jsonResult');
        
        if (!input || !result) return;
        
        const inputValue = input.value.trim();
        
        if (!inputValue) {
            Utils.showResult('jsonResult', '请输入 JSON 数据', 'error');
            return;
        }
        
        try {
            const parsed = JSON.parse(inputValue);
            const stats = this.analyzeJSON(parsed);
            
            Utils.showResult('jsonResult', 
                `<div style="color: #28a745; font-weight: 600; margin-bottom: 15px;">✓ JSON 格式有效</div>
                <div style="background: rgba(40, 167, 69, 0.1); padding: 15px; border-radius: 8px;">
                    <div style="margin-bottom: 8px;"><strong>数据类型:</strong> ${stats.type}</div>
                    <div style="margin-bottom: 8px;"><strong>字符数:</strong> ${inputValue.length}</div>
                    ${stats.objectCount ? `<div style="margin-bottom: 8px;"><strong>对象数量:</strong> ${stats.objectCount}</div>` : ''}
                    ${stats.arrayCount ? `<div style="margin-bottom: 8px;"><strong>数组数量:</strong> ${stats.arrayCount}</div>` : ''}
                    ${stats.keyCount ? `<div style="margin-bottom: 8px;"><strong>键数量:</strong> ${stats.keyCount}</div>` : ''}
                    <div><strong>嵌套深度:</strong> ${stats.depth}</div>
                </div>`, 
                'success'
            );
        } catch (error) {
            const errorInfo = this.parseJSONError(error.message, inputValue);
            Utils.showResult('jsonResult', 
                `<div style="color: #dc3545; font-weight: 600; margin-bottom: 10px;">✗ JSON 格式无效</div>
                <div style="background: rgba(220, 53, 69, 0.1); padding: 15px; border-radius: 8px;">
                    <div style="margin-bottom: 8px;"><strong>错误信息:</strong> ${errorInfo.message}</div>
                    ${errorInfo.position ? `<div><strong>错误位置:</strong> ${errorInfo.position}</div>` : ''}
                </div>`, 
                'error'
            );
        }
    }

    clearJSON() {
        const input = document.getElementById('jsonInput');
        const result = document.getElementById('jsonResult');
        
        if (input) input.value = '';
        if (result) {
            result.innerHTML = '';
            result.className = 'result';
        }
        
        this.lastResult = null;
        
        if (input) input.focus();
    }

    copyResult() {
        if (this.lastResult) {
            Utils.copyToClipboard(this.lastResult);
        } else {
            Utils.showToast('没有可复制的内容');
        }
    }

    parseJSONError(errorMessage, input) {
        const positionMatch = errorMessage.match(/position (\d+)/);
        let position = null;
        
        if (positionMatch) {
            const pos = parseInt(positionMatch[1]);
            const lines = input.substring(0, pos).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            position = `第 ${line} 行，第 ${column} 列`;
        }
        
        // 简化错误信息
        let message = errorMessage;
        if (message.includes('Unexpected token')) {
            message = '意外的字符或符号';
        } else if (message.includes('Unexpected end')) {
            message = '意外的结束，可能缺少闭合符号';
        } else if (message.includes('Expected')) {
            message = '缺少必要的字符或符号';
        }
        
        return { message, position };
    }

    analyzeJSON(obj, depth = 0) {
        const stats = {
            type: Array.isArray(obj) ? 'Array' : typeof obj,
            depth: depth,
            objectCount: 0,
            arrayCount: 0,
            keyCount: 0
        };
        
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                stats.arrayCount = 1;
                obj.forEach(item => {
                    const subStats = this.analyzeJSON(item, depth + 1);
                    stats.objectCount += subStats.objectCount;
                    stats.arrayCount += subStats.arrayCount;
                    stats.keyCount += subStats.keyCount;
                    stats.depth = Math.max(stats.depth, subStats.depth);
                });
            } else {
                stats.objectCount = 1;
                stats.keyCount = Object.keys(obj).length;
                Object.values(obj).forEach(value => {
                    const subStats = this.analyzeJSON(value, depth + 1);
                    stats.objectCount += subStats.objectCount;
                    stats.arrayCount += subStats.arrayCount;
                    stats.keyCount += subStats.keyCount;
                    stats.depth = Math.max(stats.depth, subStats.depth);
                });
            }
        }
        
        return stats;
    }
}