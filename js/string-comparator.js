// 字符串对比工具类
class StringComparator {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定按钮事件
        const compareBtn = document.getElementById('compareStringsBtn');
        const clearStringsBtn = document.getElementById('clearStringsBtn');
        const copyCompareBtn = document.getElementById('copyCompareBtn');
        const swapBtn = document.getElementById('swapStringsBtn');

        if (compareBtn) compareBtn.addEventListener('click', () => this.compareStrings());
        if (clearStringsBtn) clearStringsBtn.addEventListener('click', () => this.clearStrings());
        if (copyCompareBtn) copyCompareBtn.addEventListener('click', () => this.copyResult());
        if (swapBtn) swapBtn.addEventListener('click', () => this.swapStrings());

        // 绑定输入框事件
        const string1 = document.getElementById('string1');
        const string2 = document.getElementById('string2');

        if (string1 && string2) {
            const autoCompare = () => {
                if (string1.value.trim() || string2.value.trim()) {
                    clearTimeout(this.compareTimeout);
                    this.compareTimeout = setTimeout(() => this.compareStrings(), 500);
                }
            };

            string1.addEventListener('input', autoCompare);
            string2.addEventListener('input', autoCompare);
        }
    }

    compareStrings() {
        const string1Input = document.getElementById('string1');
        const string2Input = document.getElementById('string2');
        const result = document.getElementById('compareResult');
        
        if (!string1Input || !string2Input || !result) return;
        
        const str1 = string1Input.value;
        const str2 = string2Input.value;
        
        if (!str1 && !str2) {
            Utils.showResult('compareResult', '请输入要对比的字符串', 'error');
            return;
        }
        
        // 计算相似度
        const similarity = this.calculateSimilarity(str1, str2);
        
        // 生成差异对比
        const diff = this.generateDiff(str1, str2);
        
        // 统计信息
        const stats = this.getComparisonStats(str1, str2);
        
        // 获取相似度颜色
        const similarityColor = this.getSimilarityColor(similarity);
        
        Utils.showResult('compareResult', 
            `<div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="color: ${similarityColor}; font-weight: 600; font-size: 1.1rem;">相似度: ${similarity.toFixed(2)}%</span>
                    <span style="color: #6c757d; font-size: 0.9rem;">${this.getSimilarityDescription(similarity)}</span>
                </div>
                
                <div style="background: rgba(30, 144, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 0.9rem;">
                        <div><strong>字符串1长度:</strong> ${stats.length1}</div>
                        <div><strong>字符串2长度:</strong> ${stats.length2}</div>
                        <div><strong>编辑距离:</strong> ${stats.editDistance}</div>
                        <div><strong>公共字符:</strong> ${stats.commonChars}</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="font-weight: 600; margin-bottom: 10px; color: #333;">📋 差异对比:</div>
                <div class="diff-container" style="max-height: 400px; overflow-y: auto; border: 1px solid #e1e5e9; border-radius: 8px; padding: 10px;">
                    ${diff}
                </div>
            </div>`, 
            'success'
        );
        
        this.lastResult = {
            similarity: similarity,
            stats: stats,
            str1: str1,
            str2: str2
        };
    }

    clearStrings() {
        const string1 = document.getElementById('string1');
        const string2 = document.getElementById('string2');
        const result = document.getElementById('compareResult');
        
        if (string1) string1.value = '';
        if (string2) string2.value = '';
        if (result) {
            result.innerHTML = '';
            result.className = 'result';
        }
        
        this.lastResult = null;
        
        if (string1) string1.focus();
    }

    swapStrings() {
        const string1 = document.getElementById('string1');
        const string2 = document.getElementById('string2');
        
        if (string1 && string2) {
            const temp = string1.value;
            string1.value = string2.value;
            string2.value = temp;
            
            // 重新对比
            if (string1.value.trim() || string2.value.trim()) {
                this.compareStrings();
            }
            
            Utils.showToast('字符串已交换');
        }
    }

    copyResult() {
        if (this.lastResult) {
            const textToCopy = `字符串对比结果\n` +
                `相似度: ${this.lastResult.similarity.toFixed(2)}%\n` +
                `字符串1长度: ${this.lastResult.stats.length1}\n` +
                `字符串2长度: ${this.lastResult.stats.length2}\n` +
                `编辑距离: ${this.lastResult.stats.editDistance}\n` +
                `公共字符数: ${this.lastResult.stats.commonChars}`;
            
            Utils.copyToClipboard(textToCopy);
        } else {
            Utils.showToast('没有可复制的内容');
        }
    }

    generateDiff(str1, str2) {
        if (str1 === str2) {
            return '<div class="diff-unchanged">✓ 字符串完全相同</div>';
        }
        
        // 按行分割
        const lines1 = str1.split('\n');
        const lines2 = str2.split('\n');
        
        // 使用LCS算法生成差异
        const lcs = this.longestCommonSubsequence(lines1, lines2);
        const diff = this.generateLineDiff(lines1, lines2, lcs);
        
        if (diff.length === 0) {
            return '<div class="diff-unchanged">无差异</div>';
        }
        
        return diff.map(item => {
            const escapedContent = Utils.escapeHtml(item.content);
            switch (item.type) {
                case 'added':
                    return `<div class="diff-added">+ ${escapedContent}</div>`;
                case 'removed':
                    return `<div class="diff-removed">- ${escapedContent}</div>`;
                case 'unchanged':
                    return `<div class="diff-unchanged">  ${escapedContent}</div>`;
                default:
                    return `<div>${escapedContent}</div>`;
            }
        }).join('');
    }

    longestCommonSubsequence(arr1, arr2) {
        const m = arr1.length;
        const n = arr2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (arr1[i - 1] === arr2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // 回溯构建LCS
        const lcs = [];
        let i = m, j = n;
        while (i > 0 && j > 0) {
            if (arr1[i - 1] === arr2[j - 1]) {
                lcs.unshift({ i: i - 1, j: j - 1, content: arr1[i - 1] });
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }

    generateLineDiff(lines1, lines2, lcs) {
        const diff = [];
        let i = 0, j = 0, lcsIndex = 0;
        
        while (i < lines1.length || j < lines2.length) {
            if (lcsIndex < lcs.length && i === lcs[lcsIndex].i && j === lcs[lcsIndex].j) {
                // 相同行
                diff.push({ type: 'unchanged', content: lines1[i] });
                i++;
                j++;
                lcsIndex++;
            } else if (lcsIndex < lcs.length && i === lcs[lcsIndex].i) {
                // 添加的行
                diff.push({ type: 'added', content: lines2[j] });
                j++;
            } else if (lcsIndex < lcs.length && j === lcs[lcsIndex].j) {
                // 删除的行
                diff.push({ type: 'removed', content: lines1[i] });
                i++;
            } else {
                // 判断哪个更接近下一个LCS点
                if (i < lines1.length) {
                    diff.push({ type: 'removed', content: lines1[i] });
                    i++;
                }
                if (j < lines2.length) {
                    diff.push({ type: 'added', content: lines2[j] });
                    j++;
                }
            }
        }
        
        return diff;
    }

    calculateSimilarity(str1, str2) {
        if (str1 === str2) return 100;
        if (!str1 || !str2) return 0;
        
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 100;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return ((longer.length - distance) / longer.length) * 100;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        // 初始化矩阵
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        // 填充矩阵
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // 替换
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j] + 1      // 删除
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    getComparisonStats(str1, str2) {
        const length1 = str1.length;
        const length2 = str2.length;
        const editDistance = this.levenshteinDistance(str1, str2);
        
        // 计算公共字符数
        const chars1 = new Set(str1);
        const chars2 = new Set(str2);
        const commonChars = [...chars1].filter(char => chars2.has(char)).length;
        
        return {
            length1,
            length2,
            editDistance,
            commonChars
        };
    }

    getSimilarityColor(similarity) {
        if (similarity >= 90) return '#28a745';
        if (similarity >= 70) return '#ffc107';
        if (similarity >= 50) return '#fd7e14';
        return '#dc3545';
    }

    getSimilarityDescription(similarity) {
        if (similarity >= 95) return '几乎相同';
        if (similarity >= 85) return '非常相似';
        if (similarity >= 70) return '比较相似';
        if (similarity >= 50) return '部分相似';
        if (similarity >= 25) return '略有相似';
        return '差异很大';
    }
}