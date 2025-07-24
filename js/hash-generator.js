class HashGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.hashInput = document.getElementById('hashInput');
        this.hashResult = document.getElementById('hashResult');
        
        this.md5Btn = document.getElementById('md5Btn');
        this.sha1Btn = document.getElementById('sha1Btn');
        this.sha256Btn = document.getElementById('sha256Btn');
        this.copyHashBtn = document.getElementById('copyHashBtn');
        this.clearHashBtn = document.getElementById('clearHashBtn');
    }

    bindEvents() {
        if (!this.hashInput) return;

        this.md5Btn?.addEventListener('click', () => this.generateMD5());
        this.sha1Btn?.addEventListener('click', () => this.generateSHA1());
        this.sha256Btn?.addEventListener('click', () => this.generateSHA256());
        this.copyHashBtn?.addEventListener('click', () => this.copyResult());
        this.clearHashBtn?.addEventListener('click', () => this.clearAll());
    }

    async generateMD5() {
        const input = this.hashInput.value;
        if (!input.trim()) {
            Utils.showResult(this.hashResult, '请输入要生成哈希的文本', 'error');
            return;
        }

        try {
            const hash = await this.md5(input);
            Utils.showResult(this.hashResult, `<div class="hash-result">
                <h4>🔐 MD5哈希值：</h4>
                <div class="result-content hash-value">${hash}</div>
                <div class="hash-info">
                    <small>长度：32位 | 算法：MD5 | 输入长度：${input.length}字符</small>
                </div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.hashResult, `生成MD5失败：${error.message}`, 'error');
        }
    }

    async generateSHA1() {
        const input = this.hashInput.value;
        if (!input.trim()) {
            Utils.showResult(this.hashResult, '请输入要生成哈希的文本', 'error');
            return;
        }

        try {
            const hash = await this.sha1(input);
            Utils.showResult(this.hashResult, `<div class="hash-result">
                <h4>🔒 SHA1哈希值：</h4>
                <div class="result-content hash-value">${hash}</div>
                <div class="hash-info">
                    <small>长度：40位 | 算法：SHA-1 | 输入长度：${input.length}字符</small>
                </div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.hashResult, `生成SHA1失败：${error.message}`, 'error');
        }
    }

    async generateSHA256() {
        const input = this.hashInput.value;
        if (!input.trim()) {
            Utils.showResult(this.hashResult, '请输入要生成哈希的文本', 'error');
            return;
        }

        try {
            const hash = await this.sha256(input);
            Utils.showResult(this.hashResult, `<div class="hash-result">
                <h4>🛡️ SHA256哈希值：</h4>
                <div class="result-content hash-value">${hash}</div>
                <div class="hash-info">
                    <small>长度：64位 | 算法：SHA-256 | 输入长度：${input.length}字符</small>
                </div>
            </div>`, 'success');
        } catch (error) {
            Utils.showResult(this.hashResult, `生成SHA256失败：${error.message}`, 'error');
        }
    }

    // MD5哈希算法实现
    async md5(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        
        // 使用简化的MD5实现
        return this.simpleMD5(str);
    }

    // SHA1哈希算法实现
    async sha1(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // SHA256哈希算法实现
    async sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 简化的MD5实现（用于兼容性）
    simpleMD5(str) {
        function rotateLeft(value, amount) {
            return (value << amount) | (value >>> (32 - amount));
        }

        function addUnsigned(x, y) {
            const x4 = (x & 0x40000000);
            const y4 = (y & 0x40000000);
            const x8 = (x & 0x80000000);
            const y8 = (y & 0x80000000);
            const result = (x & 0x3FFFFFFF) + (y & 0x3FFFFFFF);
            if (x4 & y4) {
                return (result ^ 0x80000000 ^ x8 ^ y8);
            }
            if (x4 | y4) {
                if (result & 0x40000000) {
                    return (result ^ 0xC0000000 ^ x8 ^ y8);
                } else {
                    return (result ^ 0x40000000 ^ x8 ^ y8);
                }
            } else {
                return (result ^ x8 ^ y8);
            }
        }

        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }

        function FF(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function GG(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function HH(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function II(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function convertToWordArray(str) {
            let wordArray = [];
            let wordCount = (((str.length + 8) - ((str.length + 8) % 64)) / 64 + 1) * 16;
            for (let i = 0; i < wordCount; i++) {
                wordArray[i] = 0;
            }
            for (let i = 0; i < str.length; i++) {
                wordArray[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
            }
            wordArray[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
            wordArray[wordCount - 2] = str.length << 3;
            wordArray[wordCount - 1] = str.length >>> 29;
            return wordArray;
        }

        function wordToHex(value) {
            let hex = "";
            for (let i = 0; i <= 3; i++) {
                const byte = (value >>> (i * 8)) & 255;
                hex += ((byte < 16) ? "0" : "") + byte.toString(16);
            }
            return hex;
        }

        const x = convertToWordArray(str);
        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        for (let k = 0; k < x.length; k += 16) {
            const AA = a, BB = b, CC = c, DD = d;
            a = FF(a, b, c, d, x[k], 7, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], 12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], 17, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], 7, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], 12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], 17, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], 22, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], 7, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], 12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], 22, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], 7, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], 12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], 17, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], 22, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], 5, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], 9, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], 14, 0x265E5A51);
            b = GG(b, c, d, a, x[k], 20, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], 5, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], 9, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], 14, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], 20, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], 5, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], 9, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], 14, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], 20, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], 5, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], 9, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], 14, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], 20, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], 4, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], 11, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], 16, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], 23, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], 4, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], 11, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], 16, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], 23, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], 4, 0x289B7EC6);
            d = HH(d, a, b, c, x[k], 11, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], 16, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], 23, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], 4, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], 11, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], 16, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], 23, 0xC4AC5665);
            a = II(a, b, c, d, x[k], 6, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], 10, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], 15, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], 21, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], 6, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], 10, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], 15, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], 21, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], 6, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], 10, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], 15, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], 21, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], 6, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], 10, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], 15, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], 21, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }

        return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
    }

    copyResult() {
        const resultContent = this.hashResult.querySelector('.result-content');
        if (!resultContent) {
            Utils.showResult(this.hashResult, '没有可复制的结果', 'error');
            return;
        }

        Utils.copyToClipboard(resultContent.textContent);
    }

    clearAll() {
        this.hashInput.value = '';
        this.hashResult.innerHTML = '';
        this.hashInput.focus();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HashGenerator;
}