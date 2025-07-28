// JSON 格式化工具类
class JSONFormatter {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.searchMatches = [];
        this.currentSearchIndex = -1;
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
        
        // 全选按钮
        const selectAllBtn = document.getElementById('selectAllJsonBtn');
        if (selectAllBtn) selectAllBtn.addEventListener('click', () => this.selectAllInput());

        // 绑定搜索功能事件
        const searchInput = document.getElementById('jsonSearchInput');
        const searchPrevBtn = document.getElementById('jsonSearchPrevBtn');
        const searchNextBtn = document.getElementById('jsonSearchNextBtn');
        const searchCloseBtn = document.getElementById('jsonSearchCloseBtn');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.performSearch());
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.searchPrevious();
                    } else {
                        this.searchNext();
                    }
                } else if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        if (searchPrevBtn) searchPrevBtn.addEventListener('click', () => this.searchPrevious());
        if (searchNextBtn) searchNextBtn.addEventListener('click', () => this.searchNext());
        if (searchCloseBtn) searchCloseBtn.addEventListener('click', () => this.closeSearch());

        // 绑定快捷键
        const jsonInput = document.getElementById('jsonInput');
        if (jsonInput) {
            jsonInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    this.formatJSON();
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    this.showSearch();
                }
                // 确保Ctrl+A、Cmd+A等其他快捷键正常工作
                // 特别允许全选操作
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    // 不阻止默认的全选行为
                    return;
                }
            });
        }

        // 全局快捷键
        document.addEventListener('keydown', (e) => {
            // 只在JSON页面激活且焦点不在输入框时处理Ctrl+F
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && 
                document.querySelector('.page.active')?.id === 'json' &&
                !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.showSearch();
            }
        });
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
            const lines = formatted.split('\n');
            
            // 生成简化的JSON显示
            const jsonDisplay = this.generateJSONDisplay(formatted, lines, null);
            
            Utils.showResult('jsonResult', jsonDisplay, 'success');
            
            this.lastResult = formatted;
            this.lastFormatted = formatted;
            this.formattedLines = lines;
            
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

    selectAllInput() {
        const input = document.getElementById('jsonInput');
        if (input) {
            input.focus();
            input.select();
            // 确保在移动设备上也能正常工作
            if (input.setSelectionRange) {
                input.setSelectionRange(0, input.value.length);
            }
            Utils.showToast('已全选文本内容');
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

    generateJSONDisplay(formatted, lines, lineNumbers) {
        const totalLines = lines.length;
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="color: #28a745; font-weight: 600;">✓ JSON 格式化成功</span>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <small style="color: #6c757d;">字符数: ${formatted.length}</small>
                    <small style="color: #6c757d;">行数: ${totalLines}</small>
                </div>
            </div>
            <pre style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin: 0; overflow-x: auto; white-space: pre-wrap; word-break: break-word; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 14px; line-height: 1.5;" id="jsonCodeLines">${this.highlightJSON(formatted)}</pre>
        `;
    }

    showSearchContainer() {
        const container = document.getElementById('jsonSearchContainer');
        if (container) {
            container.style.display = 'block';
        }
    }

    hideSearchContainer() {
        const container = document.getElementById('jsonSearchContainer');
        if (container) {
            container.style.display = 'none';
        }
    }

    showSearch() {
        this.showSearchContainer();
        const searchInput = document.getElementById('jsonSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    closeSearch() {
        this.hideSearchContainer();
        this.clearSearchHighlights();
        const searchInput = document.getElementById('jsonSearchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.searchMatches = [];
        this.currentSearchIndex = -1;
        this.updateSearchCount();
    }

    performSearch() {
        const searchInput = document.getElementById('jsonSearchInput');
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        this.clearSearchHighlights();
        this.searchMatches = [];
        this.currentSearchIndex = -1;
        
        if (!searchTerm || !this.formattedLines) {
            this.updateSearchCount();
            return;
        }
        
        // 搜索匹配项
        this.formattedLines.forEach((line, lineIndex) => {
            let startIndex = 0;
            while (true) {
                const index = line.toLowerCase().indexOf(searchTerm.toLowerCase(), startIndex);
                if (index === -1) break;
                
                this.searchMatches.push({
                    lineIndex: lineIndex,
                    startIndex: index,
                    endIndex: index + searchTerm.length,
                    originalText: line.substring(index, index + searchTerm.length)
                });
                
                startIndex = index + 1;
            }
        });
        
        this.highlightSearchResults(searchTerm);
        this.updateSearchCount();
        
        if (this.searchMatches.length > 0) {
            this.currentSearchIndex = 0;
            this.highlightCurrentMatch();
        }
    }

    highlightSearchResults(searchTerm) {
        const codeLines = document.getElementById('jsonCodeLines');
        if (!codeLines || !this.formattedLines) return;
        
        let highlightedContent = '';
        
        this.formattedLines.forEach((line, lineIndex) => {
            let highlightedLine = this.highlightJSON(line);
            const lineMatches = this.searchMatches.filter(match => match.lineIndex === lineIndex);
            
            // 在已经高亮的HTML中搜索并替换
             lineMatches.forEach((match) => {
                 const searchRegex = new RegExp(Utils.escapeRegex(Utils.escapeHtml(match.originalText)), 'gi');
                 const globalMatchIndex = this.searchMatches.indexOf(match);
                 highlightedLine = highlightedLine.replace(searchRegex, 
                     `<span class="json-search-highlight" data-match-index="${globalMatchIndex}">${Utils.escapeHtml(match.originalText)}</span>`);
             });
            
            highlightedContent += highlightedLine + (lineIndex < this.formattedLines.length - 1 ? '\n' : '');
        });
        
        codeLines.innerHTML = highlightedContent;
    }

    highlightCurrentMatch() {
        // 清除之前的当前匹配高亮
        const prevCurrent = document.querySelector('.json-search-current');
        if (prevCurrent) {
            prevCurrent.className = 'json-search-highlight';
        }
        
        if (this.currentSearchIndex >= 0 && this.currentSearchIndex < this.searchMatches.length) {
            const currentMatch = document.querySelector(`[data-match-index="${this.currentSearchIndex}"]`);
            if (currentMatch) {
                currentMatch.className = 'json-search-current';
                currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        this.updateSearchCount();
    }

    searchNext() {
        if (this.searchMatches.length === 0) return;
        
        this.currentSearchIndex = (this.currentSearchIndex + 1) % this.searchMatches.length;
        this.highlightCurrentMatch();
    }

    searchPrevious() {
        if (this.searchMatches.length === 0) return;
        
        this.currentSearchIndex = this.currentSearchIndex <= 0 ? 
            this.searchMatches.length - 1 : this.currentSearchIndex - 1;
        this.highlightCurrentMatch();
    }

    clearSearchHighlights() {
        // 简化版本不需要搜索功能
    }

    highlightJSON(jsonString) {
        // JSON语法高亮 - 修复二进制字符串问题
        let highlighted = jsonString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // 使用更精确的正则表达式来避免匹配问题
        highlighted = highlighted
            // 匹配对象键
            .replace(/"([^"\\]*(\\.[^"\\]*)*)": /g, '<span class="json-key">"$1"</span>: ')
            // 匹配字符串值（包含转义字符）
            .replace(/: "([^"\\]*(\\.[^"\\]*)*)"/g, ': <span class="json-string">"$1"</span>')
            // 匹配数组中的字符串
            .replace(/\[\s*"([^"\\]*(\\.[^"\\]*)*)"/g, '[<span class="json-string">"$1"</span>')
            .replace(/,\s*"([^"\\]*(\\.[^"\\]*)*)"/g, ', <span class="json-string">"$1"</span>')
            // 匹配布尔值
            .replace(/: (true|false)(?=\s*[,}\]])/g, ': <span class="json-boolean">$1</span>')
            .replace(/\[\s*(true|false)(?=\s*[,\]])/g, '[<span class="json-boolean">$1</span>')
            .replace(/,\s*(true|false)(?=\s*[,\]])/g, ', <span class="json-boolean">$1</span>')
            // 匹配null值
            .replace(/: (null)(?=\s*[,}\]])/g, ': <span class="json-null">$1</span>')
            .replace(/\[\s*(null)(?=\s*[,\]])/g, '[<span class="json-null">$1</span>')
            .replace(/,\s*(null)(?=\s*[,\]])/g, ', <span class="json-null">$1</span>')
            // 匹配数字
            .replace(/: (-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?=\s*[,}\]])/g, ': <span class="json-number">$1</span>')
            .replace(/\[\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?=\s*[,\]])/g, '[<span class="json-number">$1</span>')
            .replace(/,\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?=\s*[,\]])/g, ', <span class="json-number">$1</span>')
            // 匹配括号和逗号
            .replace(/([{}\[\]])/g, '<span class="json-bracket">$1</span>')
            .replace(/(,)(?=\s*[^\s])/g, '<span class="json-comma">$1</span>');
        
        return highlighted;
    }

    updateSearchCount() {
        const countElement = document.getElementById('jsonSearchCount');
        if (countElement) {
            if (this.searchMatches.length === 0) {
                countElement.textContent = '0/0';
            } else {
                countElement.textContent = `${this.currentSearchIndex + 1}/${this.searchMatches.length}`;
            }
        }
    }
}

// 全局引用，供HTML中的按钮调用
let jsonFormatter;