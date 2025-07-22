// 时间戳转换工具类
class TimestampConverter {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setCurrentDateTime();
    }

    bindEvents() {
        // 绑定按钮事件
        const timestampToDateBtn = document.getElementById('timestampToDateBtn');
        const dateToTimestampBtn = document.getElementById('dateToTimestampBtn');
        const getCurrentBtn = document.getElementById('getCurrentTimestampBtn');
        const clearTimestampBtn = document.getElementById('clearTimestampBtn');
        const copyTimestampBtn = document.getElementById('copyTimestampBtn');

        if (timestampToDateBtn) timestampToDateBtn.addEventListener('click', () => this.timestampToDate());
        if (dateToTimestampBtn) dateToTimestampBtn.addEventListener('click', () => this.dateToTimestamp());
        if (getCurrentBtn) getCurrentBtn.addEventListener('click', () => this.getCurrentTimestamp());
        if (clearTimestampBtn) clearTimestampBtn.addEventListener('click', () => this.clearTimestamp());
        if (copyTimestampBtn) copyTimestampBtn.addEventListener('click', () => this.copyResult());

        // 绑定输入框事件
        const timestampInput = document.getElementById('timestampInput');
        const dateInput = document.getElementById('dateInput');

        if (timestampInput) {
            timestampInput.addEventListener('input', () => this.onTimestampInput());
            timestampInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.timestampToDate();
                }
            });
        }

        if (dateInput) {
            dateInput.addEventListener('change', () => this.onDateInput());
        }
    }

    setCurrentDateTime() {
        const dateInput = document.getElementById('dateInput');
        if (dateInput) {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            dateInput.value = localDateTime;
        }
    }

    onTimestampInput() {
        const input = document.getElementById('timestampInput');
        if (!input) return;

        const value = input.value.trim();
        if (value && /^\d+$/.test(value)) {
            // 自动转换
            setTimeout(() => this.timestampToDate(), 300);
        }
    }

    onDateInput() {
        // 自动转换
        setTimeout(() => this.dateToTimestamp(), 100);
    }

    timestampToDate() {
        const input = document.getElementById('timestampInput');
        const result = document.getElementById('timestampResult');
        
        if (!input || !result) return;
        
        const inputValue = input.value.trim();
        
        if (!inputValue) {
            Utils.showResult('timestampResult', '请输入时间戳', 'error');
            return;
        }
        
        let timestamp = parseInt(inputValue);
        if (isNaN(timestamp)) {
            Utils.showResult('timestampResult', '时间戳格式错误，请输入数字', 'error');
            return;
        }
        
        // 判断是秒还是毫秒
        const isSeconds = timestamp.toString().length === 10;
        const isMilliseconds = timestamp.toString().length === 13;
        
        if (!isSeconds && !isMilliseconds) {
            Utils.showResult('timestampResult', '时间戳长度不正确，应为10位（秒）或13位（毫秒）', 'error');
            return;
        }
        
        if (isSeconds) {
            timestamp *= 1000;
        }
        
        try {
            const date = new Date(timestamp);
            
            if (isNaN(date.getTime())) {
                Utils.showResult('timestampResult', '无效的时间戳', 'error');
                return;
            }
            
            const localTime = Utils.formatDate(date);
            const isoString = date.toISOString();
            const utcString = date.toUTCString();
            const relativeTime = this.getRelativeTime(date);
            
            // 获取时区信息
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneOffset = date.getTimezoneOffset();
            const timezoneString = `UTC${timezoneOffset <= 0 ? '+' : '-'}${Math.abs(Math.floor(timezoneOffset / 60)).toString().padStart(2, '0')}:${Math.abs(timezoneOffset % 60).toString().padStart(2, '0')}`;
            
            Utils.showResult('timestampResult', 
                `<div style="color: #28a745; font-weight: 600; margin-bottom: 15px;">✓ 时间戳转换成功</div>
                <div style="background: rgba(40, 167, 69, 0.1); padding: 15px; border-radius: 8px; line-height: 1.8;">
                    <div><strong>本地时间:</strong> ${localTime}</div>
                    <div><strong>ISO 格式:</strong> ${isoString}</div>
                    <div><strong>UTC 时间:</strong> ${utcString}</div>
                    <div><strong>相对时间:</strong> ${relativeTime}</div>
                    <div><strong>时区:</strong> ${timezone} (${timezoneString})</div>
                    <div><strong>输入格式:</strong> ${isSeconds ? '秒级时间戳' : '毫秒级时间戳'}</div>
                </div>`, 
                'success'
            );
            
            this.lastResult = {
                local: localTime,
                iso: isoString,
                utc: utcString,
                timestamp: inputValue
            };
        } catch (error) {
            Utils.showResult('timestampResult', '时间戳转换失败', 'error');
        }
    }

    dateToTimestamp() {
        const input = document.getElementById('dateInput');
        const result = document.getElementById('timestampResult');
        
        if (!input || !result) return;
        
        const inputValue = input.value;
        
        if (!inputValue) {
            Utils.showResult('timestampResult', '请选择日期时间', 'error');
            return;
        }
        
        try {
            const date = new Date(inputValue);
            
            if (isNaN(date.getTime())) {
                Utils.showResult('timestampResult', '无效的日期时间', 'error');
                return;
            }
            
            const timestampSeconds = Math.floor(date.getTime() / 1000);
            const timestampMilliseconds = date.getTime();
            const localTime = Utils.formatDate(date);
            const isoString = date.toISOString();
            const relativeTime = this.getRelativeTime(date);
            
            Utils.showResult('timestampResult', 
                `<div style="color: #28a745; font-weight: 600; margin-bottom: 15px;">✓ 日期转换成功</div>
                <div style="background: rgba(40, 167, 69, 0.1); padding: 15px; border-radius: 8px; line-height: 1.8;">
                    <div><strong>时间戳（秒）:</strong> ${timestampSeconds}</div>
                    <div><strong>时间戳（毫秒）:</strong> ${timestampMilliseconds}</div>
                    <div><strong>本地时间:</strong> ${localTime}</div>
                    <div><strong>ISO 格式:</strong> ${isoString}</div>
                    <div><strong>相对时间:</strong> ${relativeTime}</div>
                </div>`, 
                'success'
            );
            
            this.lastResult = {
                seconds: timestampSeconds,
                milliseconds: timestampMilliseconds,
                local: localTime,
                iso: isoString
            };
        } catch (error) {
            Utils.showResult('timestampResult', '日期转换失败', 'error');
        }
    }

    getCurrentTimestamp() {
        const timestampInput = document.getElementById('timestampInput');
        const dateInput = document.getElementById('dateInput');
        
        const now = new Date();
        const timestampSeconds = Math.floor(now.getTime() / 1000);
        const timestampMilliseconds = now.getTime();
        const localTime = Utils.formatDate(now);
        const isoString = now.toISOString();
        
        // 设置输入框值
        if (timestampInput) {
            timestampInput.value = timestampSeconds;
        }
        
        if (dateInput) {
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            dateInput.value = localDateTime;
        }
        
        Utils.showResult('timestampResult', 
            `<div style="color: #1E90FF; font-weight: 600; margin-bottom: 15px;">🕐 当前时间信息</div>
            <div style="background: rgba(30, 144, 255, 0.1); padding: 15px; border-radius: 8px; line-height: 1.8;">
                <div><strong>当前时间:</strong> ${localTime}</div>
                <div><strong>时间戳（秒）:</strong> ${timestampSeconds}</div>
                <div><strong>时间戳（毫秒）:</strong> ${timestampMilliseconds}</div>
                <div><strong>ISO 格式:</strong> ${isoString}</div>
                <div><strong>UTC 时间:</strong> ${now.toUTCString()}</div>
            </div>`, 
            'success'
        );
        
        this.lastResult = {
            seconds: timestampSeconds,
            milliseconds: timestampMilliseconds,
            local: localTime,
            iso: isoString
        };
    }

    clearTimestamp() {
        const timestampInput = document.getElementById('timestampInput');
        const dateInput = document.getElementById('dateInput');
        const result = document.getElementById('timestampResult');
        
        if (timestampInput) timestampInput.value = '';
        if (dateInput) dateInput.value = '';
        if (result) {
            result.innerHTML = '';
            result.className = 'result';
        }
        
        this.lastResult = null;
        
        // 重新设置当前时间
        this.setCurrentDateTime();
        
        if (timestampInput) timestampInput.focus();
    }

    copyResult() {
        if (this.lastResult) {
            let textToCopy = '';
            if (this.lastResult.seconds) {
                textToCopy = `时间戳（秒）: ${this.lastResult.seconds}\n时间戳（毫秒）: ${this.lastResult.milliseconds}\n本地时间: ${this.lastResult.local}`;
            } else {
                textToCopy = `本地时间: ${this.lastResult.local}\nISO格式: ${this.lastResult.iso}\n时间戳: ${this.lastResult.timestamp}`;
            }
            Utils.copyToClipboard(textToCopy);
        } else {
            Utils.showToast('没有可复制的内容');
        }
    }

    getRelativeTime(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);
        
        if (Math.abs(diffSeconds) < 60) {
            return diffSeconds === 0 ? '刚刚' : 
                   diffSeconds > 0 ? `${diffSeconds}秒前` : `${Math.abs(diffSeconds)}秒后`;
        } else if (Math.abs(diffMinutes) < 60) {
            return diffMinutes > 0 ? `${diffMinutes}分钟前` : `${Math.abs(diffMinutes)}分钟后`;
        } else if (Math.abs(diffHours) < 24) {
            return diffHours > 0 ? `${diffHours}小时前` : `${Math.abs(diffHours)}小时后`;
        } else if (Math.abs(diffDays) < 30) {
            return diffDays > 0 ? `${diffDays}天前` : `${Math.abs(diffDays)}天后`;
        } else if (Math.abs(diffMonths) < 12) {
            return diffMonths > 0 ? `${diffMonths}个月前` : `${Math.abs(diffMonths)}个月后`;
        } else {
            return diffYears > 0 ? `${diffYears}年前` : `${Math.abs(diffYears)}年后`;
        }
    }
}