// -*- coding: utf-8 -*-
/**
 * Balatro 种子分享模块
 * 使用 Supabase 作为后端存储
 */

class SeedManager {
    constructor() {
        // Supabase 配置
        this.SUPABASE_URL = 'https://sjobjwbggfeqjqtdfdjn.supabase.co';
        this.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqb2Jqd2JnZ2ZlcWpxdGRmZGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTk1MzUsImV4cCI6MjA4OTQ3NTUzNX0.P0d-rYXcWud51FFl6_8XrvDJQqF9Iq9yaSoxVT4yq34';
        
        // 状态
        this.seeds = [];
        this.currentSort = 'hot';   // 'hot' | 'new'
        this.searchQuery = '';
        this.currentPage = 1;
        this.pageSize = 12;
        this.totalCount = 0;
        this.isLoading = false;
        
        // 访客 ID（防重复点赞）
        this.visitorId = this.getOrCreateVisitorId();
        
        // 已点赞的种子 ID 缓存
        this.likedSeeds = this.loadLikedSeeds();
    }
    
    // 获取或创建访客 ID
    getOrCreateVisitorId() {
        let id = localStorage.getItem('balatro_visitor_id');
        if (!id) {
            id = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('balatro_visitor_id', id);
        }
        return id;
    }
    
    // 从 localStorage 加载已点赞记录
    loadLikedSeeds() {
        try {
            return new Set(JSON.parse(localStorage.getItem('balatro_liked_seeds') || '[]'));
        } catch {
            return new Set();
        }
    }
    
    // 保存已点赞记录到 localStorage
    saveLikedSeeds() {
        localStorage.setItem('balatro_liked_seeds', JSON.stringify([...this.likedSeeds]));
    }
    
    // Supabase REST API 请求封装
    async supaFetch(path, options = {}) {
        const url = `${this.SUPABASE_URL}/rest/v1/${path}`;
        const headers = {
            'apikey': this.SUPABASE_KEY,
            'Authorization': `Bearer ${this.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': options.prefer || 'return=representation',
            ...options.headers
        };
        
        const res = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        
        // 处理 count 响应头
        const contentRange = res.headers.get('content-range');
        if (contentRange) {
            const match = contentRange.match(/\/(\d+)/);
            if (match) this.totalCount = parseInt(match[1]);
        }
        
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Supabase 请求失败: ${res.status} ${errText}`);
        }
        
        const text = await res.text();
        return text ? JSON.parse(text) : null;
    }
    
    // 初始化绑定事件
    init() {
        // 表单提交
        const form = document.getElementById('seed-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitSeed();
            });
        }
        
        // 搜索
        const searchInput = document.getElementById('seed-search');
        if (searchInput) {
            let debounce;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    this.searchQuery = searchInput.value.trim();
                    this.currentPage = 1;
                    this.loadSeeds();
                }, 400);
            });
        }
        
        // 排序按钮
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSort = btn.dataset.sort;
                this.currentPage = 1;
                this.loadSeeds();
            });
        });
        
        // 首次加载
        this.loadSeeds();
    }
    
    // 加载种子列表
    async loadSeeds() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const grid = document.getElementById('seeds-grid');
        if (grid) grid.innerHTML = `<div class="seeds-loading">${i18n.t('seeds.loadingSeeds')}</div>`;
        
        try {
            // 构建查询参数
            const offset = (this.currentPage - 1) * this.pageSize;
            const orderCol = this.currentSort === 'hot' ? 'likes' : 'created_at';
            
            let query = `seeds?approved=eq.true&order=${orderCol}.desc&offset=${offset}&limit=${this.pageSize}`;
            
            // 搜索过滤
            if (this.searchQuery) {
                // 搜索种子代码或标题
                query += `&or=(seed_code.ilike.*${encodeURIComponent(this.searchQuery)}*,title.ilike.*${encodeURIComponent(this.searchQuery)}*,description.ilike.*${encodeURIComponent(this.searchQuery)}*,recommended_build.ilike.*${encodeURIComponent(this.searchQuery)}*)`;
            }
            
            const seeds = await this.supaFetch(query, {
                prefer: 'return=representation,count=exact',
                headers: { 'Range-Unit': 'items', 'Range': `${offset}-${offset + this.pageSize - 1}` }
            });
            
            this.seeds = seeds || [];
            this.renderSeeds();
            this.renderPagination();
        } catch (err) {
            console.error('加载种子失败:', err);
            if (grid) {
                grid.innerHTML = `<div class="seeds-empty">${i18n.t('seeds.loadError')}</div>`;
            }
        } finally {
            this.isLoading = false;
        }
    }
    
    // 渲染种子列表
    renderSeeds() {
        const grid = document.getElementById('seeds-grid');
        if (!grid) return;
        
        if (this.seeds.length === 0) {
            grid.innerHTML = `
                <div class="seeds-empty">
                    <span class="empty-icon">🌱</span>
                    <p>${this.searchQuery ? i18n.t('seeds.noMatch') : i18n.t('seeds.beFirst')}</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.seeds.map(seed => {
            const isLiked = this.likedSeeds.has(seed.id);
            const timeAgo = this.formatTimeAgo(seed.created_at);
            const difficultyMap = { '简单': '⭐', '中等': '⭐⭐', '困难': '⭐⭐⭐' };
            const diffStars = difficultyMap[seed.difficulty] || '⭐⭐';
            
            return `
                <div class="seed-card">
                    <div class="seed-card-header">
                        <span class="seed-code-badge">${this.escapeHtml(seed.seed_code)}</span>
                        <span class="seed-difficulty">${diffStars}</span>
                    </div>
                    <h4 class="seed-title">${this.escapeHtml(seed.title)}</h4>
                    ${seed.description ? `<p class="seed-desc">${this.escapeHtml(seed.description)}</p>` : ''}
                    ${seed.recommended_build ? `<span class="seed-build-tag">${this.escapeHtml(seed.recommended_build)}</span>` : ''}
                    <div class="seed-card-footer">
                        <div class="seed-meta">
                            <span class="seed-author">👤 ${this.escapeHtml(seed.author || i18n.t('seeds.anonymous'))}</span>
                            <span class="seed-time">${timeAgo}</span>
                        </div>
                        <button class="seed-like-btn ${isLiked ? 'liked' : ''}" 
                                onclick="seedManager.toggleLike('${seed.id}')"
                                ${isLiked ? `title="${i18n.t('seeds.liked')}"` : `title="${i18n.t('seeds.like')}"`}>
                            <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
                            <span class="like-count">${seed.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 渲染分页
    renderPagination() {
        const container = document.getElementById('seeds-pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // 上一页
        if (this.currentPage > 1) {
            html += `<button class="page-btn" onclick="seedManager.goToPage(${this.currentPage - 1})">‹</button>`;
        }
        
        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<button class="page-btn active">${i}</button>`;
            } else if (i === 1 || i === totalPages || Math.abs(i - this.currentPage) <= 1) {
                html += `<button class="page-btn" onclick="seedManager.goToPage(${i})">${i}</button>`;
            } else if (Math.abs(i - this.currentPage) === 2) {
                html += `<span class="page-dots">...</span>`;
            }
        }
        
        // 下一页
        if (this.currentPage < totalPages) {
            html += `<button class="page-btn" onclick="seedManager.goToPage(${this.currentPage + 1})">›</button>`;
        }
        
        container.innerHTML = html;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.loadSeeds();
        // 滚动到列表顶部
        document.querySelector('.seeds-list-panel')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 提交种子
    async submitSeed() {
        const btn = document.getElementById('seed-submit-btn');
        const msgEl = document.getElementById('seed-submit-msg');
        
        const seedCode = document.getElementById('seed-code').value.trim();
        const title = document.getElementById('seed-title').value.trim();
        const description = document.getElementById('seed-desc').value.trim();
        const author = document.getElementById('seed-author').value.trim() || i18n.t('seeds.anonymous');
        const recommendedBuild = document.getElementById('seed-build').value;
        const difficulty = document.getElementById('seed-difficulty').value;
        
        if (!seedCode || !title) {
            this.showMessage(msgEl, i18n.t('seeds.validateError'), 'error');
            return;
        }
        
        btn.disabled = true;
        btn.textContent = i18n.t('seeds.submitting');
        
        try {
            await this.supaFetch('seeds', {
                method: 'POST',
                body: {
                    seed_code: seedCode,
                    title: title,
                    description: description || null,
                    author: author,
                    recommended_build: recommendedBuild || null,
                    difficulty: difficulty,
                    approved: false
                }
            });
            
            this.showMessage(msgEl, i18n.t('seeds.submitSuccess'), 'success');
            document.getElementById('seed-form').reset();
        } catch (err) {
            console.error('投稿失败:', err);
            this.showMessage(msgEl, i18n.t('seeds.submitError'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = i18n.t('seeds.submitBtn');
        }
    }
    
    // 点赞/取消点赞
    async toggleLike(seedId) {
        if (this.likedSeeds.has(seedId)) {
            // 已点赞，不支持取消（简化逻辑）
            return;
        }
        
        try {
            // 插入点赞记录
            await this.supaFetch('seed_likes', {
                method: 'POST',
                body: {
                    seed_id: seedId,
                    visitor_id: this.visitorId
                }
            });
            
            // 更新本地状态
            this.likedSeeds.add(seedId);
            this.saveLikedSeeds();
            
            // 更新 UI 中的点赞数
            const seed = this.seeds.find(s => s.id === seedId);
            if (seed) {
                seed.likes = (seed.likes || 0) + 1;
            }
            
            this.renderSeeds();
        } catch (err) {
            console.error('点赞失败:', err);
            // 可能是重复点赞（UNIQUE 约束），也标记为已赞
            if (err.message && err.message.includes('409')) {
                this.likedSeeds.add(seedId);
                this.saveLikedSeeds();
            }
        }
    }
    
    // 显示提示消息
    showMessage(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = `seed-submit-msg ${type}`;
        el.style.display = 'block';
        
        setTimeout(() => {
            el.style.display = 'none';
        }, 5000);
    }
    
    // 格式化时间
    formatTimeAgo(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return i18n.t('seeds.justNow');
        if (diff < 3600) return i18n.t('seeds.minutesAgo', {n: Math.floor(diff / 60)});
        if (diff < 86400) return i18n.t('seeds.hoursAgo', {n: Math.floor(diff / 3600)});
        if (diff < 604800) return i18n.t('seeds.daysAgo', {n: Math.floor(diff / 86400)});
        
        const locale = i18n.currentLang === 'ja' ? 'ja-JP' : i18n.currentLang === 'en' ? 'en-US' : 'zh-CN';
        return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    }
    
    // XSS 防护
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

// 全局实例
let seedManager;
