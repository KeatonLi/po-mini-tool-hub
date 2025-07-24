class EncodeConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.encodeInput = document.getElementById('encodeInput');
        this.encodeResult = document.getElementById('encodeResult');
        
        this.urlEncodeBtn = document.getElementById('urlEncodeBtn');
        this.urlDecodeBtn = document.getElementById('urlDecodeBtn');
        this.base64EncodeBtn = document.getElementById('base64EncodeBtn');
        this.base64DecodeBtn = document.getElementById('base64DecodeBtn');
        this.htmlEncodeBtn = document.getElementById('htmlEncodeBtn');
        this.htmlDecodeBtn = document.getElementById('htmlDecodeBtn');
        this.copyEncodeBtn = document.getElementById('copyEncodeBtn');
        this.clearEncodeBtn = document.getElementById('clearEncodeBtn');
    }

    bindEvents() {
        if (!this.encodeInput) return;

        this.urlEncodeBtn?.addEventListener('click', () => this.urlEncode());
        this.urlDecodeBtn?.addEventListener('click', () => this.urlDecode());
        this.base64EncodeBtn?.addEventListener('click', () => this.base64Encode());
        this.base64DecodeBtn?.addEventListener('click', () => this.base64Decode());
        this.htmlEncodeBtn?.addEventListener('click', () => this.htmlEncode());
        this.htmlDecodeBtn?.addEventListener('click', () => this.htmlDecode());
        this.copyEncodeBtn?.addEventListener('click', () => this.copyResult());
        this.clearEncodeBtn?.addEventListener('click', () => this.clearAll());
    }

    urlEncode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要编码的文本', 'error');
            return;
        }

        try {
            const encoded = encodeURIComponent(input);
            Utils.showResult(this.encodeResult, `<div class="encode-result">
                <h4>🔗 URL编码结果：</h4>
                <div class="result-content">${Utils.escapeHtml(encoded)}</div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.encodeResult, `编码失败：${error.message}`, 'error');
        }
    }

    urlDecode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要解码的文本', 'error');
            return;
        }

        try {
            const decoded = decodeURIComponent(input);
            Utils.showResult(this.encodeResult, `<div class="encode-result">
                <h4>🔓 URL解码结果：</h4>
                <div class="result-content">${Utils.escapeHtml(decoded)}</div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.encodeResult, `解码失败：${error.message}`, 'error');
        }
    }

    base64Encode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要编码的文本', 'error');
            return;
        }

        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            Utils.showResult(this.encodeResult, `<div class="encode-result">
                <h4>📦 Base64编码结果：</h4>
                <div class="result-content">${Utils.escapeHtml(encoded)}</div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.encodeResult, `编码失败：${error.message}`, 'error');
        }
    }

    base64Decode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要解码的文本', 'error');
            return;
        }

        try {
            const decoded = decodeURIComponent(escape(atob(input)));
            Utils.showResult(this.encodeResult, `<div class="encode-result">
                <h4>📂 Base64解码结果：</h4>
                <div class="result-content">${Utils.escapeHtml(decoded)}</div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.encodeResult, `解码失败：${error.message}`, 'error');
        }
    }

    htmlEncode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要编码的文本', 'error');
            return;
        }

        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;'
        };

        const encoded = input.replace(/[&<>"'\/]/g, (s) => htmlEntities[s]);
        Utils.showResult(this.encodeResult, `<div class="encode-result">
            <h4>🏷️ HTML编码结果：</h4>
            <div class="result-content">${Utils.escapeHtml(encoded)}</div>
        </div>`, 'success');
    }

    htmlDecode() {
        const input = this.encodeInput.value;
        if (!input.trim()) {
            Utils.showResult(this.encodeResult, '请输入要解码的文本', 'error');
            return;
        }

        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/'
        };

        let decoded = input;
        Object.keys(htmlEntities).forEach(entity => {
            decoded = decoded.replace(new RegExp(entity, 'g'), htmlEntities[entity]);
        });

        Utils.showResult(this.encodeResult, `<div class="encode-result">
            <h4>📄 HTML解码结果：</h4>
            <div class="result-content">${Utils.escapeHtml(decoded)}</div>
        </div>`, 'success');
    }

    copyResult() {
        const resultContent = this.encodeResult.querySelector('.result-content');
        if (!resultContent) {
            Utils.showResult(this.encodeResult, '没有可复制的结果', 'error');
            return;
        }

        Utils.copyToClipboard(resultContent.textContent);
    }

    clearAll() {
        this.encodeInput.value = '';
        this.encodeResult.innerHTML = '';
        this.encodeInput.focus();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EncodeConverter;
}