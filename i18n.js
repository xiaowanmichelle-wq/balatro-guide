// -*- coding: utf-8 -*-
/**
 * Balatro Guide - i18n 国际化模块
 * 支持中文/英文/日文切换
 */

class I18n {
    constructor() {
        // 可用语言
        this.languages = {
            'zh-CN': { name: '中文', flag: '🇨🇳' },
            'en':    { name: 'English', flag: '🇺🇸' },
            'ja':    { name: '日本語', flag: '🇯🇵' }
        };
        
        // 语言包存储
        this.translations = {};
        
        // 当前语言
        this.currentLang = this.detectLanguage();
        
        // 变更回调
        this.onChangeCallbacks = [];
    }
    
    /**
     * 检测用户语言偏好
     * 优先级：localStorage > 浏览器语言 > 默认中文
     */
    detectLanguage() {
        // 1. URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.languages[urlLang]) return urlLang;
        
        // 2. localStorage
        const saved = localStorage.getItem('balatro_lang');
        if (saved && this.languages[saved]) return saved;
        
        // 3. 浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            if (browserLang.startsWith('ja')) return 'ja';
            if (browserLang.startsWith('en')) return 'en';
            if (browserLang.startsWith('zh')) return 'zh-CN';
        }
        
        return 'zh-CN';
    }
    
    /**
     * 注册语言包
     * @param {string} lang - 语言代码
     * @param {object} translations - 翻译数据
     */
    register(lang, translations) {
        this.translations[lang] = translations;
    }
    
    /**
     * 获取翻译文本
     * @param {string} key - 翻译键，支持点号分隔 (如 'ui.tabs.gallery')
     * @param {object} params - 插值参数 (如 {count: 5})
     * @returns {string}
     */
    t(key, params = {}) {
        const lang = this.translations[this.currentLang];
        if (!lang) return key;
        
        // 支持点号路径
        let value = key.split('.').reduce((obj, k) => {
            return obj && obj[k] !== undefined ? obj[k] : undefined;
        }, lang);
        
        // 回退到中文
        if (value === undefined && this.currentLang !== 'zh-CN') {
            const fallback = this.translations['zh-CN'];
            if (fallback) {
                value = key.split('.').reduce((obj, k) => {
                    return obj && obj[k] !== undefined ? obj[k] : undefined;
                }, fallback);
            }
        }
        
        if (value === undefined) return key;
        if (typeof value !== 'string') return value;
        
        // 插值替换 {{param}}
        return value.replace(/\{\{(\w+)\}\}/g, (_, name) => {
            return params[name] !== undefined ? params[name] : `{{${name}}}`;
        });
    }
    
    /**
     * 获取卡牌翻译
     * @param {string} cardId - 卡牌 ID
     * @param {string} field - 字段名 (name/description/synergy_note)
     * @returns {string|undefined}
     */
    cardT(cardId, field) {
        const lang = this.translations[this.currentLang];
        if (lang && lang.cards && lang.cards[cardId] && lang.cards[cardId][field]) {
            return lang.cards[cardId][field];
        }
        // 回退到中文（卡牌数据原始就是中文，所以返回 undefined 让调用方用原始值）
        if (this.currentLang !== 'zh-CN') {
            const fallback = this.translations['zh-CN'];
            if (fallback && fallback.cards && fallback.cards[cardId] && fallback.cards[cardId][field]) {
                return fallback.cards[cardId][field];
            }
        }
        return undefined;
    }
    
    /**
     * 获取策略翻译
     * @param {string} strategyId - 策略 ID
     * @param {string} field - 字段名
     * @returns {string|undefined}
     */
    strategyT(strategyId, field) {
        const lang = this.translations[this.currentLang];
        if (lang && lang.strategies && lang.strategies[strategyId] && lang.strategies[strategyId][field]) {
            return lang.strategies[strategyId][field];
        }
        if (this.currentLang !== 'zh-CN') {
            const fallback = this.translations['zh-CN'];
            if (fallback && fallback.strategies && fallback.strategies[strategyId] && fallback.strategies[strategyId][field]) {
                return fallback.strategies[strategyId][field];
            }
        }
        return undefined;
    }
    
    /**
     * 切换语言
     * @param {string} lang - 目标语言代码
     */
    setLanguage(lang) {
        if (!this.languages[lang]) return;
        if (!this.translations[lang]) {
            console.warn(`Language pack "${lang}" not loaded yet`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('balatro_lang', lang);
        
        // 更新 HTML lang 属性
        document.documentElement.lang = lang;
        
        // 触发回调
        this.onChangeCallbacks.forEach(cb => cb(lang));
    }
    
    /**
     * 注册语言变更回调
     */
    onChange(callback) {
        this.onChangeCallbacks.push(callback);
    }
    
    /**
     * 获取当前语言信息
     */
    getCurrentLanguage() {
        return {
            code: this.currentLang,
            ...this.languages[this.currentLang]
        };
    }
    
    /**
     * 获取所有可用语言
     */
    getAvailableLanguages() {
        return Object.entries(this.languages).map(([code, info]) => ({
            code,
            ...info,
            active: code === this.currentLang
        }));
    }
}

// 全局 i18n 实例
const i18n = new I18n();
