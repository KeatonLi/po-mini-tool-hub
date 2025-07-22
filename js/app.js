// 应用主控制器
class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.initializeTools();
        this.showPage('home');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
                this.setActiveNav(link);
                this.closeMobileMenu();
            });
        });

        // 处理品牌/logo点击回到首页
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand) {
            navBrand.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('home');
                // 设置首页导航为激活状态
                const homeNavLink = document.querySelector('.nav-link[data-page="home"]');
                if (homeNavLink) {
                    this.setActiveNav(homeNavLink);
                }
                this.closeMobileMenu();
            });
        }

        // 处理特性卡片点击
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const page = card.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.setActiveNavByPage(page);
                }
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }

    showPage(pageId) {
        // 隐藏所有页面
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }

    setActiveNav(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setActiveNavByPage(pageId) {
        const navLink = document.querySelector(`[data-page="${pageId}"]`);
        if (navLink) {
            this.setActiveNav(navLink);
        }
    }

    initializeTools() {
        // 初始化各个工具
        new JSONFormatter();
        new TimestampConverter();
        new StringComparator();
    }
}

// 工具函数
class Utils {
    static showResult(elementId, message, type = '') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = message;
            element.className = `result ${type}`;
        }
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static formatDate(date) {
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    static copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('已复制到剪贴板');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    static fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('已复制到剪贴板');
        } catch (err) {
            this.showToast('复制失败，请手动复制');
        }
        
        document.body.removeChild(textArea);
    }

    static showToast(message, duration = 2000) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(30, 144, 255, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 隐藏动画
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});