// -*- coding: utf-8 -*-
/**
 * Balatro 新手助手 - 应用逻辑
 * 包含标签筛选和智能匹配算法
 */

class BalatroApp {
    constructor() {
        // 合并所有卡牌数据
        this.allCards = [
            ...CARD_DATA.jokers.map(c => ({...c, cardType: 'joker'})),
            ...CARD_DATA.tarots.map(c => ({...c, cardType: 'tarot'})),
            ...CARD_DATA.planets.map(c => ({...c, cardType: 'planet'})),
            ...CARD_DATA.spectrals.map(c => ({...c, cardType: 'spectral'}))
        ];
        
        // 当前筛选条件
        this.filters = {
            types: ['joker', 'tarot', 'planet', 'spectral'],
            rarities: ['common', 'uncommon', 'rare', 'legendary'],
            effects: [],
            hands: [],
            search: '',
            unlockOnly: false
        };
        
        // 用户的卡组
        this.selectedCards = [];
        
        // 初始化
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initMobileFilters();
        this.updateCounts();
        this.renderCards();
        this.renderPicker();
        this.renderRecommended();
    }
    
    // 初始化手机端筛选面板
    initMobileFilters() {
        const toggle = document.getElementById('mobile-filter-toggle');
        const sidebar = document.getElementById('sidebar-filters');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                sidebar.classList.toggle('mobile-open');
            });
        }
        
        // 手机端默认折叠所有筛选组
        if (window.innerWidth <= 900) {
            document.querySelectorAll('.filter-section.collapsible').forEach(section => {
                section.classList.add('collapsed');
            });
        }
    }
    
    // 切换筛选组折叠状态
    toggleFilter(header) {
        const section = header.closest('.filter-section');
        if (section) {
            section.classList.toggle('collapsed');
        }
    }
    
    // 更新筛选徽标（显示激活的筛选数量）
    updateFilterBadge() {
        const badge = document.getElementById('filter-badge');
        if (!badge) return;
        
        let activeFilters = 0;
        if (this.filters.effects.length > 0) activeFilters += this.filters.effects.length;
        if (this.filters.hands.length > 0) activeFilters += this.filters.hands.length;
        if (this.filters.search) activeFilters++;
        if (this.filters.unlockOnly) activeFilters++;
        // 类型和稀有度如果不是全选也算
        if (this.filters.types.length < 4) activeFilters += (4 - this.filters.types.length);
        if (this.filters.rarities.length < 3) activeFilters += (3 - this.filters.rarities.length);
        
        if (activeFilters > 0) {
            badge.textContent = activeFilters;
            badge.classList.add('has-filters');
        } else {
            badge.classList.remove('has-filters');
        }
    }
    
    bindEvents() {
        // Tab 切换
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        // 类型筛选
        document.querySelectorAll('.filter-section:first-child .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.types = Array.from(document.querySelectorAll('.filter-section:first-child .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
            });
        });
        
        // 稀有度筛选
        document.querySelectorAll('.filter-section:nth-child(2) .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.rarities = Array.from(document.querySelectorAll('.filter-section:nth-child(2) .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
            });
        });
        
        // 效果类型筛选
        document.querySelectorAll('.filter-section:nth-child(4) .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.effects = Array.from(document.querySelectorAll('.filter-section:nth-child(4) .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
                // 成长小丑引导提示
                const tip = document.getElementById('scaling-tip');
                if (tip) tip.style.display = this.filters.effects.includes('scaling') ? 'flex' : 'none';
            });
        });
        
        // 牌型筛选
        document.querySelectorAll('.filter-section:nth-child(5) .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.hands = Array.from(document.querySelectorAll('.filter-section:nth-child(5) .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
            });
        });
        
        // 解锁条件筛选
        const unlockCheckbox = document.getElementById('filter-unlock-only');
        if (unlockCheckbox) {
            unlockCheckbox.addEventListener('change', () => {
                this.filters.unlockOnly = unlockCheckbox.checked;
                this.renderCards();
            });
        }
        
        // 搜索 - 实时搜索 + 按钮点击
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        let searchTimeout;
        
        // 按钮点击搜索
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filters.search = searchInput.value.toLowerCase();
                this.renderCards();
            });
        }
        
        // 实时搜索
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderCards();
            }, 200);
        });
        
        // 清除筛选
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());
        
        // 清空卡组
        document.getElementById('clear-deck').addEventListener('click', () => this.clearDeck());
        
        // 卡牌选择器 - 下拉切换
        document.getElementById('picker-toggle').addEventListener('click', () => this.togglePicker());
        
        // 卡牌选择器搜索
        document.getElementById('picker-search').addEventListener('input', (e) => {
            this.renderPicker(e.target.value.toLowerCase());
        });
        
        // 匹配偏好
        document.getElementById('prefer-chips').addEventListener('change', () => this.updateRecommendations());
        document.getElementById('prefer-mult').addEventListener('change', () => this.updateRecommendations());
    }
    
    switchTab(tabId) {
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
        document.getElementById(tabId).classList.add('active');
        
        // 切换 Tab 后回到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 种子分享 Tab 延迟初始化
        if (tabId === 'seeds' && !seedManager) {
            seedManager = new SeedManager();
            seedManager.init();
        }
    }
    
    updateCounts() {
        const counts = {
            joker: this.allCards.filter(c => c.cardType === 'joker').length,
            tarot: this.allCards.filter(c => c.cardType === 'tarot').length,
            planet: this.allCards.filter(c => c.cardType === 'planet').length,
            spectral: this.allCards.filter(c => c.cardType === 'spectral').length
        };
        
        document.getElementById('count-joker').textContent = counts.joker;
        document.getElementById('count-tarot').textContent = counts.tarot;
        document.getElementById('count-planet').textContent = counts.planet;
        document.getElementById('count-spectral').textContent = counts.spectral;
    }
    
    filterCards() {
        return this.allCards.filter(card => {
            // 类型筛选
            if (!this.filters.types.includes(card.cardType)) return false;
            
            // 稀有度筛选（消耗牌没有 rarity 字段，跳过此筛选）
            if (card.rarity && !this.filters.rarities.includes(card.rarity)) return false;
            
            // 效果类型筛选
            if (this.filters.effects.length > 0) {
                const cardTags = card.tags || [];
                if (!this.filters.effects.some(e => cardTags.includes(e))) return false;
            }
            
            // 牌型筛选
            if (this.filters.hands.length > 0) {
                const cardHands = card.best_with || [];
                if (!this.filters.hands.some(h => cardHands.includes(h))) return false;
            }
            
            // 解锁条件筛选
            if (this.filters.unlockOnly) {
                if (!card.unlock) return false;
            }
            
            // 搜索筛选 - 支持名称和描述搜索
            if (this.filters.search) {
                const searchText = (card.name + ' ' + card.description).toLowerCase();
                // 支持搜索协同卡牌名称
                let synergyNames = '';
                if (card.synergies && card.synergies.length > 0) {
                    const synergyCards = card.synergies.map(id => {
                        const c = this.allCards.find(c => c.id === id);
                        return c ? c.name : '';
                    }).filter(Boolean);
                    synergyNames = synergyCards.join(' ');
                }
                if (!searchText.includes(this.filters.search) && !synergyNames.toLowerCase().includes(this.filters.search)) return false;
            }
            
            return true;
        });
    }
    
    renderCards() {
        const filtered = this.filterCards();
        const grid = document.getElementById('cards-grid');
        
        // 搜索时按匹配优先级排序：名称完全匹配 > 名称开头匹配 > 名称包含 > 描述/协同匹配
        if (this.filters.search) {
            const search = this.filters.search;
            filtered.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const aExact = aName === search;
                const bExact = bName === search;
                if (aExact !== bExact) return aExact ? -1 : 1;
                const aStart = aName.startsWith(search);
                const bStart = bName.startsWith(search);
                if (aStart !== bStart) return aStart ? -1 : 1;
                const aContain = aName.includes(search);
                const bContain = bName.includes(search);
                if (aContain !== bContain) return aContain ? -1 : 1;
                return 0;
            });
        }
        
        const resultCountEl = document.getElementById('result-count-text');
        if (resultCountEl) {
            resultCountEl.textContent = i18n.t('gallery.resultCount', { count: filtered.length });
        }
        this.updateFilterBadge();
        
        if (filtered.length === 0) {
            grid.innerHTML = `<p class="empty-state">${i18n.t('ui.noResults')}</p>`;
            return;
        }
        
        grid.innerHTML = filtered.map(card => this.createCardHTML(card)).join('');
    }
    
    createCardHTML(card) {
        const rarityClass = `rarity-${card.rarity || 'common'}`;
        
        // 获取标签
        let tags = [];
        if (card.tags) {
            tags = card.tags.slice(0, 4).map(tag => {
                const tagInfo = TAGS[tag];
                return tagInfo ? `<span class="card-tag">${tagInfo.name || tag}</span>` : '';
            }).join('');
        }
        
        // 获取适合牌型
        let handTag = '';
        if (card.best_with && card.best_with.length > 0 && card.best_with[0] !== 'all') {
            const handName = i18n.t(`gallery.hands.${card.best_with[0]}`) || card.best_with[0];
            handTag = `<span class="card-hand">${handName}</span>`;
        }
        
        const typeNames = {
            joker: i18n.t('gallery.typeShort.joker'),
            tarot: i18n.t('gallery.typeShort.tarot'),
            planet: i18n.t('gallery.typeShort.planet'),
            spectral: i18n.t('gallery.typeShort.spectral')
        };
        
        // 卡牌图片
        const imageHTML = card.image 
            ? `<div class="card-image"><img src="${card.image}" alt="${card.name}" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` 
            : '';
        
        // i18n 翻译卡牌名和描述
        const cardName = i18n.cardT(card.id, 'name') || card.name;
        const cardDesc = i18n.cardT(card.id, 'description') || card.description;
        
        // 解锁条件
        let unlockHTML = '';
        if (card.unlock) {
            const unlockText = i18n.cardT(card.id, 'unlock') || card.unlock;
            unlockHTML = `<div class="card-unlock"><span class="unlock-icon">🔒</span> ${unlockText}</div>`;
        }
        
        return `
            <div class="card ${rarityClass} ${card.image ? 'has-image' : ''} ${card.unlock ? 'has-unlock' : ''}" onclick="app.selectCard('${card.id}')">
                <div class="card-header">
                    <span class="card-name">${cardName}</span>
                    <span class="card-type ${card.cardType}">${typeNames[card.cardType]}</span>
                </div>
                ${imageHTML}
                <p class="card-description">${cardDesc}</p>
                ${unlockHTML}
                <div class="card-tags">
                    ${tags}
                    ${handTag}
                </div>
            </div>
        `;
    }
    
    clearFilters() {
        document.querySelectorAll('.checkbox-label input').forEach(input => {
            // 解锁筛选默认不勾选，其他默认勾选
            if (input.id === 'filter-unlock-only') {
                input.checked = false;
            } else {
                input.checked = true;
            }
        });
        
        this.filters = {
            types: ['joker', 'tarot', 'planet', 'spectral'],
            rarities: ['common', 'uncommon', 'rare', 'legendary'],
            effects: [],
            hands: [],
            search: '',
            unlockOnly: false
        };
        
        document.getElementById('search-input').value = '';
        this.renderCards();
    }
    
    // ============ 牌组匹配功能 ============
    
    // 推荐卡牌点击确认加入
    confirmAddRec(cardId) {
        const card = this.allCards.find(c => c.id === cardId);
        if (!card) return;
        if (this.selectedCards.find(c => c.id === cardId)) {
            showShareToast('⚠️ ' + card.name + ' 已在卡组中', 1500);
            return;
        }
        if (confirm('确定将「' + card.name + '」加入卡组吗？')) {
            this.selectedCards.push(card);
            this.renderSelectedCards();
            this.updateRecommendations();
            showShareToast('✅ 已加入 ' + card.name, 1500);
        }
    }
    
    selectCard(cardId) {
        // 在匹配页面添加卡牌
        if (!this.selectedCards.find(c => c.id === cardId)) {
            const card = this.allCards.find(c => c.id === cardId);
            if (card) {
                this.selectedCards.push(card);
                this.renderSelectedCards();
                this.updateRecommendations();
                this.switchTab('matcher');
                // 滚动到牌组匹配页面顶端
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
    
    renderSelectedCards() {
        const container = document.getElementById('selected-cards');
        document.getElementById('selected-count').textContent = this.selectedCards.length;
        
        if (this.selectedCards.length === 0) {
            container.innerHTML = `<p class="empty-state">${i18n.t('matcher.emptyDeck')}</p>`;
            return;
        }
        
        const rarityLabels = {
            common: i18n.t('gallery.rarity.common'),
            uncommon: i18n.t('gallery.rarity.uncommon') || '罕见',
            rare: i18n.t('gallery.rarity.rare'),
            legendary: i18n.t('gallery.rarity.legendary'),
            secret: i18n.t('gallery.rarity.secret')
        };
        
        container.innerHTML = this.selectedCards.map(card => {
            const cardName = i18n.cardT(card.id, 'name') || card.name;
            const cardDesc = i18n.cardT(card.id, 'description') || card.description;
            const thumbHTML = card.image 
                ? `<img class="selected-card-thumb" src="${card.image}" alt="${cardName}" loading="lazy" onerror="this.style.display='none'">` 
                : '';
            return `
            <div class="selected-card">
                <div class="selected-card-body">
                    ${thumbHTML}
                    <div class="selected-card-info">
                        <div class="selected-card-header">
                            <span class="selected-card-name">${cardName}</span>
                            <span class="selected-card-rarity">${rarityLabels[card.rarity] || ''}</span>
                            <span class="remove" onclick="event.stopPropagation(); app.removeCard('${card.id}')">&times;</span>
                        </div>
                        <div class="selected-card-desc">${cardDesc || ''}</div>
                    </div>
                </div>
            </div>
        `}).join('');
    }
    
    removeCard(cardId) {
        this.selectedCards = this.selectedCards.filter(c => c.id !== cardId);
        this.renderSelectedCards();
        this.updateRecommendations();
    }
    
    clearDeck() {
        this.selectedCards = [];
        this.renderSelectedCards();
        document.getElementById('recommendations').innerHTML = `<p class="empty-state">${i18n.t('matcher.emptyRec')}</p>`;
    }
    
    // 卡牌选择器下拉展开/收起
    togglePicker() {
        const toggle = document.getElementById('picker-toggle');
        const dropdown = document.getElementById('picker-dropdown');
        const isOpen = dropdown.classList.contains('open');
        
        if (isOpen) {
            dropdown.classList.remove('open');
            toggle.classList.remove('active');
        } else {
            dropdown.classList.add('open');
            toggle.classList.add('active');
            // 展开时聚焦搜索框
            setTimeout(() => {
                document.getElementById('picker-search').focus();
            }, 100);
        }
    }
    
    closePicker() {
        const toggle = document.getElementById('picker-toggle');
        const dropdown = document.getElementById('picker-dropdown');
        dropdown.classList.remove('open');
        toggle.classList.remove('active');
    }
    
    renderPicker(search = '') {
        const container = document.getElementById('picker-list');
        
        // 排除已选择的卡牌
        const availableCards = this.allCards.filter(c => 
            !this.selectedCards.find(s => s.id === c.id) &&
            (search === '' || c.name.toLowerCase().includes(search) || (i18n.cardT(c.id, 'name') || '').toLowerCase().includes(search))
        );
        
        const typeNames = {
            joker: i18n.t('gallery.typeShort.joker'),
            tarot: i18n.t('gallery.typeShort.tarot'),
            planet: i18n.t('gallery.typeShort.planet'),
            spectral: i18n.t('gallery.typeShort.spectral')
        };
        
        container.innerHTML = availableCards.slice(0, 50).map(card => {
            const cardName = i18n.cardT(card.id, 'name') || card.name;
            const cardDesc = i18n.cardT(card.id, 'description') || card.description;
            const thumbHTML = card.image 
                ? `<img class="picker-item-thumb" src="${card.image}" alt="${cardName}" loading="lazy" onerror="this.style.display='none'">` 
                : '';
            return `
            <label class="picker-item">
                <div class="picker-item-header">
                    <input type="checkbox" value="${card.id}" onchange="app.togglePickerCard('${card.id}', this.checked)">
                    ${thumbHTML}
                    <span class="name">${cardName}</span>
                    <span class="type">${typeNames[card.cardType] || 'Joker'}</span>
                </div>
                <div class="picker-item-desc">${cardDesc || ''}</div>
            </label>
        `}).join('');
    }
    
    togglePickerCard(cardId, checked) {
        if (checked) {
            this.selectCard(cardId);
        } else {
            this.removeCard(cardId);
        }
        // 重新渲染 picker（保持当前搜索词）
        const searchVal = document.getElementById('picker-search').value.toLowerCase();
        this.renderPicker(searchVal);
    }
    
    updateRecommendations() {
        const container = document.getElementById('recommendations');
        
        if (this.selectedCards.length === 0) {
            container.innerHTML = `<p class="empty-state">${i18n.t('matcher.emptyRec')}</p>`;
            return;
        }
        
        const preferChips = document.getElementById('prefer-chips').checked;
        const preferMult = document.getElementById('prefer-mult').checked;
        
        // 分析用户卡牌的效果
        const analysis = this.analyzeDeck(this.selectedCards);
        
        // 匹配构筑思路
        const matchedBuilds = this.matchBuildStrategies();
        
        // 计算推荐
        const recommendations = this.calculateRecommendations(analysis, preferChips, preferMult);
        
        let html = '';
        
        // 展示匹配到的构筑思路
        if (matchedBuilds.length > 0) {
            html += '<div class="matched-builds">';
            html += `<h3 class="matched-title">${i18n.t('matcher.matchedBuilds')}</h3>`;
            html += matchedBuilds.map(mb => {
                const strategyName = i18n.strategyT(mb.strategy.id, 'name') || mb.strategy.name;
                const strategyDesc = i18n.strategyT(mb.strategy.id, 'desc') || mb.strategy.desc;
                const missingNames = mb.missingCore.map(id => {
                    const c = this.allCards.find(c => c.id === id);
                    return c ? (i18n.cardT(c.id, 'name') || c.name) : '';
                }).filter(Boolean);
                const missingHtml = missingNames.length > 0 
                    ? `<span class="missing-cards">${i18n.t('matcher.missingCards', {cards: missingNames.join('、')})}</span>` 
                    : `<span class="build-complete">${i18n.t('matcher.coreComplete')}</span>`;
                // 获取兼容流派简要提示
                const strategies = this.getBuildStrategies();
                let compatBrief = '';
                if (mb.strategy.compatibleWith && mb.strategy.compatibleWith.length > 0) {
                    const compatNames = mb.strategy.compatibleWith.map(comp => {
                        const target = strategies.find(st => st.id === comp.id);
                        return target ? (i18n.strategyT(target.id, 'name') || target.name) : '';
                    }).filter(Boolean);
                    if (compatNames.length > 0) {
                        compatBrief = `<span class="compat-brief">${i18n.t('matcher.compatBrief', {names: compatNames.join('、')})}</span>`;
                    }
                }
                return `
                    <div class="matched-build ${mb.matchRate >= 0.7 ? 'high-match' : mb.matchRate >= 0.4 ? 'mid-match' : 'low-match'}">
                        <div class="build-match-header">
                            <span class="build-name">${strategyName}</span>
                            <span class="match-rate">${i18n.t('matcher.matchRate', {rate: Math.round(mb.matchRate * 100)})}</span>
                        </div>
                        <p class="build-desc">${strategyDesc}</p>
                        ${missingHtml}
                        ${compatBrief}
                    </div>
                `;
            }).join('');
            html += '</div>';
        }
        
        if (recommendations.length === 0) {
            html += `<p class="empty-state">${i18n.t('matcher.noRec')}</p>`;
            container.innerHTML = html;
            return;
        }
        
        // 分离 Joker 推荐和消耗品推荐
        const jokerRecs = recommendations.filter(r => r.card.cardType === 'joker');
        const tarotRecs = recommendations.filter(r => r.card.cardType === 'tarot');
        const planetRecs = recommendations.filter(r => r.card.cardType === 'planet');
        const spectralRecs = recommendations.filter(r => r.card.cardType === 'spectral');
        
        // 补充：基于选中 Joker 的牌型，智能推荐匹配的行星牌
        const enhancedPlanetRecs = this.getMatchedPlanets(planetRecs);
        // 补充：基于选中 Joker 的特性，智能推荐匹配的塔罗牌
        const enhancedTarotRecs = this.getMatchedTarots(tarotRecs);
        // 补充：基于选中 Joker 的特性，智能推荐匹配的灵魂牌
        const enhancedSpectralRecs = this.getMatchedSpectrals(spectralRecs);
        
        const renderRecCard = (rec) => {
            const scoreClass = rec.score >= 70 ? 'high' : rec.score >= 40 ? 'medium' : 'low';
            const rarityLabel = i18n.t(`gallery.rarity.${rec.card.rarity}`) || rec.card.rarity;
            const typeLabel = i18n.t(`gallery.typeShort.${rec.card.cardType}`) || rec.card.cardType;
            const recCardName = i18n.cardT(rec.card.id, 'name') || rec.card.name;
            const recCardDesc = i18n.cardT(rec.card.id, 'description') || rec.card.description;
            const buildTag = rec.buildTag ? `<span class="card-tag build-tag">${rec.buildTag}</span>` : '';
            const recThumbHTML = rec.card.image 
                ? `<img class="rec-thumb" src="${rec.card.image}" alt="${recCardName}" loading="lazy" onerror="this.style.display='none'">` 
                : '';
            return `
                <div class="recommendation-card ${rec.card.image ? 'has-thumb' : ''}" onclick="app.confirmAddRec('${rec.card.id}')" style="cursor:pointer;" title="点击加入卡组">
                    <div class="rec-header">
                        ${recThumbHTML}
                        <div class="rec-header-text">
                            <span class="rec-name">${recCardName}</span>
                            <span class="rec-score ${scoreClass}">${i18n.t('matcher.score', {score: rec.score})}</span>
                        </div>
                    </div>
                    <p class="rec-desc">${recCardDesc || ''}</p>
                    <p class="rec-reason">${rec.reason}</p>
                    ${rec.synergy ? `<p class="rec-synergy">✨ ${rec.synergy}</p>` : ''}
                    <div class="rec-tags">
                        <span class="card-tag">${rarityLabel}</span>
                        <span class="card-tag">${typeLabel}</span>
                        ${buildTag}
                        <span class="card-tag rec-add-tag">➕ 点击加入</span>
                    </div>
                </div>
            `;
        };
        
        // Joker 推荐
        if (jokerRecs.length > 0) {
            html += `<h3 class="rec-title">${i18n.t('matcher.recJoker')}</h3>`;
            html += '<div class="rec-section">';
            html += jokerRecs.slice(0, 8).map(renderRecCard).join('');
            html += '</div>';
        }
        
        // 塔罗牌推荐
        if (enhancedTarotRecs.length > 0) {
            html += `<h3 class="rec-title rec-title-tarot">${i18n.t('matcher.recTarot')}</h3>`;
            html += '<div class="rec-section rec-section-tarot">';
            html += enhancedTarotRecs.slice(0, 6).map(renderRecCard).join('');
            html += '</div>';
        }
        
        // 行星牌推荐
        if (enhancedPlanetRecs.length > 0) {
            html += `<h3 class="rec-title rec-title-planet">${i18n.t('matcher.recPlanet')}</h3>`;
            html += '<div class="rec-section rec-section-planet">';
            html += enhancedPlanetRecs.slice(0, 6).map(renderRecCard).join('');
            html += '</div>';
        }
        
        // 灵魂牌推荐
        if (enhancedSpectralRecs.length > 0) {
            html += `<h3 class="rec-title rec-title-spectral">${i18n.t('matcher.recSpectral')}</h3>`;
            html += '<div class="rec-section rec-section-spectral">';
            html += enhancedSpectralRecs.slice(0, 6).map(renderRecCard).join('');
            html += '</div>';
        }
        
        // 如果没有任何推荐
        if (jokerRecs.length === 0 && enhancedTarotRecs.length === 0 && enhancedPlanetRecs.length === 0 && enhancedSpectralRecs.length === 0) {
            html += `<p class="empty-state">${i18n.t('matcher.noRec')}</p>`;
        }
        
        container.innerHTML = html;
    }
    
    // 匹配构筑思路
    matchBuildStrategies() {
        const strategies = this.getBuildStrategies();
        const selectedIds = this.selectedCards.map(c => c.id);
        
        const matches = strategies.map(strategy => {
            const allCards = [...strategy.coreCards, ...strategy.supportCards];
            const matchedCards = allCards.filter(id => selectedIds.includes(id));
            const matchedCore = strategy.coreCards.filter(id => selectedIds.includes(id));
            const missingCore = strategy.coreCards.filter(id => !selectedIds.includes(id));
            
            // 匹配率：核心卡权重更高
            const coreWeight = 0.7;
            const supportWeight = 0.3;
            const coreRate = strategy.coreCards.length > 0 ? matchedCore.length / strategy.coreCards.length : 0;
            const supportRate = strategy.supportCards.length > 0 ? (matchedCards.length - matchedCore.length) / strategy.supportCards.length : 0;
            const matchRate = coreRate * coreWeight + supportRate * supportWeight;
            
            return {
                strategy,
                matchRate,
                matchedCards,
                matchedCore,
                missingCore
            };
        }).filter(m => m.matchRate > 0.15) // 至少15%匹配
          .sort((a, b) => b.matchRate - a.matchRate)
          .slice(0, 3); // 最多显示3个
        
        return matches;
    }
    
    analyzeDeck(cards) {
        const analysis = {
            hasMult: false,
            hasXmult: false,
            hasChips: false,
            hasDraw: false,
            hasDiscard: false,
            hasEconomy: false,
            hasHandSize: false,
            handTypes: [],
            suitFocus: null,
            rankEffects: [],
            synergies: []
        };
        
        cards.forEach(card => {
            const effects = card.effects || {};
            
            if (effects.mult && effects.mult > 0) analysis.hasMult = true;
            if (effects.xmult) analysis.hasXmult = true;
            if (effects.chips && effects.chips > 0) analysis.hasChips = true;
            if (effects.draw) analysis.hasDraw = true;
            if (effects.discard) analysis.hasDiscard = true;
            if (effects.economy || effects.economy === 0) analysis.hasEconomy = true;
            if (effects.hand_size) analysis.hasHandSize = true;
            
            // 记录点数效果
            if (effects.rank) {
                const ranks = Array.isArray(effects.rank) ? effects.rank : [effects.rank];
                analysis.rankEffects.push(...ranks);
            }
            
            // 记录协同卡牌
            if (card.synergies) {
                analysis.synergies.push(...card.synergies);
            }
            
            if (card.best_with) {
                card.best_with.forEach(h => {
                    if (!analysis.handTypes.includes(h) && h !== 'all') {
                        analysis.handTypes.push(h);
                    }
                });
            }
            
            if (effects.suit && !Array.isArray(effects.suit)) {
                analysis.suitFocus = effects.suit;
            }
        });
        
        return analysis;
    }
    
    calculateRecommendations(analysis, preferChips, preferMult) {
        const availableCards = this.allCards.filter(c => 
            !this.selectedCards.find(s => s.id === c.id)
        );
        
        const selectedIds = this.selectedCards.map(c => c.id);
        
        // 获取匹配到的构筑思路
        const matchedBuilds = this.matchBuildStrategies();
        
        return availableCards.map(card => {
            let score = 0;
            let reasons = [];
            let synergy = null;
            let buildTag = null;
            const effects = card.effects || {};
            const tags = card.tags || [];
            
            // 0. 构筑思路匹配加分 - 推荐构筑缺失的核心卡
            for (const mb of matchedBuilds) {
                if (mb.strategy.coreCards.includes(card.id) && !selectedIds.includes(card.id)) {
                    score += 50;
                    buildTag = mb.strategy.name;
                    reasons.push(`${mb.strategy.name} 缺失的核心卡`);
                    break;
                }
                if (mb.strategy.supportCards.includes(card.id) && !selectedIds.includes(card.id)) {
                    score += 25;
                    if (!buildTag) buildTag = mb.strategy.name;
                    reasons.push(`${mb.strategy.name} 的辅助卡`);
                    break;
                }
            }
            
            // 互斥卡牌检测（如大麦克香蕉和卡文迪什不能同时存在）
            if (card.exclusive_with && selectedIds.includes(card.exclusive_with)) {
                score = -100;
                reasons = ['⚠️ 与已选卡牌互斥（不能同时出现）'];
            }
            
            // 1. 协同效果检测 - 核心改进！
            if (card.synergies) {
                const matchedSynergies = card.synergies.filter(id => selectedIds.includes(id));
                if (matchedSynergies.length > 0) {
                    score += 60;
                    const matchedCards = matchedSynergies.map(id => {
                        const c = this.allCards.find(c => c.id === id);
                        return c ? c.name : '';
                    }).filter(Boolean);
                    reasons.push(`与 ${matchedCards.join(', ')} 有协同效果`);
                    synergy = `配合 ${matchedCards.join(', ')}`;
                }
            }
            
            // 2. 点数协同检测 (斐波那契/偶数/奇数/单卡牌效果)
            if (card.effects && card.effects.rank) {
                const cardRanks = Array.isArray(card.effects.rank) ? card.effects.rank : [card.effects.rank];
                
                // 斐波那契协同
                if (selectedIds.includes('j_fibonacci')) {
                    // 斐波那契 + 偶数史蒂文 (2, 8)
                    if (cardRanks.filter(r => [2, 8].includes(r)).length > 0) {
                        score += 40;
                        synergy = synergy || '斐波那契+偶数史蒂文双重效果';
                    }
                    // 斐波那契 + 奇数托德 (A, 3, 5)
                    if (selectedIds.includes('j_odd_todd') && cardRanks.filter(r => [1, 3, 5].includes(r)).length > 0) {
                        score += 40;
                        synergy = synergy || '斐波那契+奇数托德双重效果';
                    }
                    // 斐波那契 + 小小丑 (2)
                    if (cardRanks.includes(2)) {
                        score += 35;
                        synergy = synergy || '斐波那契2+小小丑双重效果';
                    }
                    // 斐波那契 + 学者 (A)
                    if (cardRanks.includes(1) && selectedIds.includes('j_scholar')) {
                        score += 35;
                        synergy = synergy || '斐波那契A+学者双重效果';
                    }
                }
                
                // 偶数史蒂文协同
                if (selectedIds.includes('j_even_steven')) {
                    // 偶数史蒂文 + 对讲机 (10, 4都是偶数)
                    if (card.id === 'j_walkie') {
                        score += 50;
                        synergy = '对讲机10和4都是偶数，完美触发偶数史蒂文';
                    }
                    // 偶数史蒂文 + 小小丑 (2)
                    if (cardRanks.includes(2) && selectedIds.includes('j_wee')) {
                        score += 45;
                        synergy = synergy || '偶数史蒂文2+小小丑双重效果';
                    }
                    // 已选对讲机，当前卡牌有偶数点数
                    if (selectedIds.includes('j_walkie') && cardRanks.filter(r => [10, 8, 6, 4, 2].includes(r)).length > 0) {
                        score += 40;
                        synergy = synergy || '偶数点数触发偶数史蒂文和对讲机';
                    }
                }
                
                // 对讲机协同
                if (selectedIds.includes('j_walkie')) {
                    // 对讲机 + 烂脱口秀演员 (4在重置范围2,3,4,5)
                    if (card.id === 'j_hack') {
                        score += 45;
                        synergy = '对讲机4在重置范围(2,3,4,5)，反复触发';
                    }
                    // 烂脱口秀演员 + 对讲机
                    if (card.id === 'j_even_steven') {
                        score += 50;
                        synergy = '对讲机10和4都是偶数，完美触发偶数史蒂文';
                    }
                }
                
                // 烂脱口秀演员协同
                if (selectedIds.includes('j_hack')) {
                    // 烂脱口秀演员 + 小小丑 (2在重置范围)
                    if (cardRanks.includes(2) && card.id === 'j_wee') {
                        score += 45;
                        synergy = '烂脱口秀演员2反复触发小小丑';
                    }
                    // 烂脱口秀演员 + 斐波那契 (2,3,5在重置范围)
                    if (selectedIds.includes('j_fibonacci') && cardRanks.filter(r => [2, 3, 5].includes(r)).length > 0) {
                        score += 40;
                        synergy = synergy || '烂脱口秀演员2,3,5反复触发斐波那契';
                    }
                }
                
                // 奇数托德协同
                if (selectedIds.includes('j_odd_todd') && selectedIds.includes('j_fibonacci')) {
                    // 奇数托德 + 斐波那契 (A, 3, 5)
                    if (cardRanks.filter(r => [1, 3, 5].includes(r)).length > 0) {
                        score += 40;
                        synergy = synergy || '斐波那契+奇数托德双重效果';
                    }
                }
                
                // 学者协同
                if (selectedIds.includes('j_scholar')) {
                    // 学者 + 斐波那契 (A)
                    if (cardRanks.includes(1) && selectedIds.includes('j_fibonacci')) {
                        score += 35;
                        synergy = synergy || '斐波那契A+学者双重效果';
                    }
                }
            }
            
            // 3. 效果互补评分
            if (preferChips && !analysis.hasChips && effects.chips && effects.chips > 0) {
                score += 30;
                reasons.push('补充筹码加成');
            }
            
            if (preferMult && !analysis.hasMult && effects.mult && effects.mult > 0) {
                score += 30;
                reasons.push('补充倍数加成');
            }
            
            if (!analysis.hasXmult && effects.xmult) {
                score += 40;
                reasons.push('增加倍率');
            }
            
            if (!analysis.hasDraw && (tags.includes('draw') || effects.draw)) {
                score += 25;
                reasons.push('增加抽牌能力');
            }
            
            if (!analysis.hasDiscard && (tags.includes('discard') || effects.discard)) {
                score += 20;
                reasons.push('增加弃牌能力');
            }
            
            if (!analysis.hasEconomy && (tags.includes('economy') || effects.economy !== undefined)) {
                score += 25;
                reasons.push('增加经济能力');
            }
            
            // 4. 牌型匹配
            if (card.best_with) {
                const matchingHands = card.best_with.filter(h => 
                    analysis.handTypes.includes(h)
                );
                if (matchingHands.length > 0) {
                    score += 30;
                    reasons.push(`适合你的${matchingHands.length}种牌型`);
                }
            }
            
            // 5. 人头牌协同 (包括未断选票)
            if (tags.includes('face')) {
                // 幻视让人头牌协同更强大
                if (selectedIds.includes('j_pareidolia')) {
                    score += 30;
                    synergy = synergy || '幻视使所有牌变人头牌';
                }
                // 未断选票 + 人头牌卡牌高协同
                if (selectedIds.includes('j_hanging_chad')) {
                    // 未断选票 + 照片(第一张人头牌)
                    if (card.id === 'j_photograph') {
                        score += 50;
                        synergy = synergy || '未断选票重复触发照片X2';
                    }
                    // 未断选票 + 恐怖面孔
                    if (card.id === 'j_scary_face') {
                        score += 45;
                        synergy = synergy || '未断选票重复触发恐怖面孔+30筹码';
                    }
                    // 未断选票 + 微笑表情
                    if (card.id === 'j_smiley') {
                        score += 45;
                        synergy = synergy || '未断选票重复触发微笑脸+5倍率';
                    }
                    // 未断选票 + 男爵
                    if (card.id === 'j_baron') {
                        score += 50;
                        synergy = synergy || '未断选票重复触发男爵K×1.5';
                    }
                    // 未断选票 + 特里布莱
                    if (card.id === 'j_triboulet') {
                        score += 50;
                        synergy = synergy || '未断选票重复触发特里布莱K/Q×2';
                    }
                    // 未断选票 + 小小丑
                    if (card.id === 'j_wee') {
                        score += 55;
                        synergy = synergy || '未断选票重复触发小小丑+8筹码';
                    }
                    // 未断选票 + 黄昏
                    if (card.id === 'j_dusk') {
                        score += 50;
                        synergy = synergy || '未断选票+黄昏最大化重复触发';
                    }
                    // 未断选票 + 老千小丑(重复牌型)
                    if (card.id === 'j_card_sharp') {
                        score += 40;
                        synergy = synergy || '未断选票+老千小丑重复触发X3';
                    }
                    // 未断选票 + 大麦克香蕉(更多自毁机会)
                    if (card.id === 'j_gros_michel') {
                        score += 35;
                        synergy = synergy || '未断选票重复计分增加大麦克自毁机会';
                    }
                    // 未断选票 + 卡文迪什(更多自毁机会)
                    if (card.id === 'j_cavendish') {
                        score += 35;
                        synergy = synergy || '未断选票重复计分增加卡文迪什自毁机会';
                    }
                    // 未断选票 + 点数效果卡（斐波那契/偶数/奇数/学者/对讲机）
                    if (card.id === 'j_fibonacci') {
                        score += 55;
                        synergy = synergy || '未断选票让第1张A/2/3/5/8触发3次，+8倍率变+24倍率';
                    }
                    if (card.id === 'j_even_steven') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张偶数牌触发3次，+4倍率变+12倍率';
                    }
                    if (card.id === 'j_odd_todd') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张奇数牌触发3次，+31筹码变+93筹码';
                    }
                    if (card.id === 'j_scholar') {
                        score += 55;
                        synergy = synergy || '未断选票让A触发3次，学者+12倍率+60筹码';
                    }
                    if (card.id === 'j_walkie') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张10/4触发3次，+30筹码+12倍率';
                    }
                    // 未断选票 + 烂脱口秀演员（双重重复触发）
                    if (card.id === 'j_hack') {
                        score += 55;
                        synergy = synergy || '双重重复触发！第1张2/3/4/5计分多达4次';
                    }
                    // 未断选票 + 花色效果卡
                    if (['j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous'].includes(card.id)) {
                        score += 45;
                        synergy = synergy || '未断选票让第1张对应花色牌的+3倍率触发3次，变+9倍率';
                    }
                    if (card.id === 'j_arrowhead') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张黑桃的+50筹码触发3次，变+150筹码';
                    }
                    if (card.id === 'j_onyx') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张梅花的+7倍率触发3次，变+21倍率';
                    }
                    if (card.id === 'j_bloodstone') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张红桃多2次X1.5概率触发';
                    }
                    // 未断选票 + 徒步者
                    if (card.id === 'j_hiker') {
                        score += 50;
                        synergy = synergy || '未断选票让第1张牌永久+15筹码(触发3次)';
                    }
                    // 未断选票 + 喜与悲
                    if (card.id === 'j_sock') {
                        score += 50;
                        synergy = synergy || '未断选票+喜与悲双重重复触发人头牌';
                    }
                }
                // 已选未断选票，当前是人头牌卡牌
                const hasHangingChad = selectedIds.includes('j_hanging_chad');
                if (hasHangingChad) {
                    // 第一张人头牌X倍率卡
                    if (['j_photograph', 'j_scary_face', 'j_smiley'].includes(card.id)) {
                        score += 40;
                        synergy = synergy || '未断选票让人头牌卡牌重复触发';
                    }
                    // K/Q相关卡牌
                    if (['j_baron', 'j_triboulet', 'j_shoot_moon'].includes(card.id)) {
                        score += 45;
                        synergy = synergy || '未断选票让K/Q卡牌重复触发';
                    }
                    // 点数效果卡（偶数/奇数/斐波那契等，与未断选票最配）
                    if (['j_fibonacci', 'j_even_steven', 'j_odd_todd', 'j_scholar', 'j_walkie', 'j_hack'].includes(card.id)) {
                        score += 50;
                        synergy = synergy || '未断选票让单牌点数效果触发3次';
                    }
                    // 花色效果卡
                    if (['j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_arrowhead', 'j_onyx', 'j_bloodstone'].includes(card.id)) {
                        score += 40;
                        synergy = synergy || '未断选票让花色单牌效果触发3次';
                    }
                    // 徒步者
                    if (card.id === 'j_hiker') {
                        score += 45;
                        synergy = synergy || '未断选票让徒步者永久+5筹码触发3次';
                    }
                    // 喜与悲
                    if (card.id === 'j_sock') {
                        score += 45;
                        synergy = synergy || '未断选票+喜与悲双重重复触发';
                    }
                }
                // 喜与悲 + 人头牌卡牌高协同
                if (selectedIds.includes('j_sock')) {
                    if (card.id === 'j_scary_face' || card.id === 'j_photograph' || card.id === 'j_smiley' || card.id === 'j_baron' || card.id === 'j_pareidolia' || card.id === 'j_triboulet') {
                        score += 45;
                        synergy = synergy || '喜与悲让人头牌卡牌反复触发';
                    }
                }
                // 特里布莱 + 人头牌相关卡牌协同（K和Q是人头牌）
                if (selectedIds.includes('j_triboulet')) {
                    if (card.id === 'j_scary_face') {
                        score += 50;
                        synergy = synergy || '特里布莱K/Q×2 + 恐怖面孔人头牌+30筹码';
                    }
                    if (card.id === 'j_photograph') {
                        score += 55;
                        synergy = synergy || '特里布莱K/Q×2 + 照片第1张人头牌×2，双重X倍率';
                    }
                    if (card.id === 'j_smiley') {
                        score += 50;
                        synergy = synergy || '特里布莱K/Q×2 + 微笑表情人头牌+5倍率';
                    }
                    if (card.id === 'j_sock') {
                        score += 55;
                        synergy = synergy || '特里布莱K/Q×2 + 喜与悲人头牌额外触发1次';
                    }
                    if (card.id === 'j_pareidolia') {
                        score += 60;
                        synergy = synergy || '特里布莱K/Q×2 + 幻视让所有牌变人头牌，全牌触发';
                    }
                }
                // 反向：已选人头牌相关卡牌，推荐特里布莱
                if (card.id === 'j_triboulet') {
                    if (selectedIds.includes('j_scary_face') || selectedIds.includes('j_photograph') || selectedIds.includes('j_smiley')) {
                        score += 50;
                        synergy = synergy || '特里布莱K/Q×2叠加人头牌加成';
                    }
                    if (selectedIds.includes('j_sock')) {
                        score += 55;
                        synergy = synergy || '喜与悲让特里布莱K/Q×2额外触发1次';
                    }
                    if (selectedIds.includes('j_pareidolia')) {
                        score += 60;
                        synergy = synergy || '幻视让所有牌变人头牌，特里布莱全牌×2';
                    }
                }
                // （哑剧演员/钢铁协同已移至 face 块外，避免 tags 门槛问题）
                // 照片 + 恐怖面孔
                if (selectedIds.includes('j_photograph') && card.id === 'j_scary_face') {
                    score += 40;
                    synergy = synergy || '照片X2 + 恐怖面孔+30筹码';
                }
                // 照片 + 微笑脸
                if (selectedIds.includes('j_photograph') && card.id === 'j_smiley') {
                    score += 40;
                    synergy = synergy || '照片X2 + 微笑脸+5倍率';
                }
                // 烂脱口秀 + 偶数史蒂文/奇数托德
                if (selectedIds.includes('j_hack')) {
                    if (card.id === 'j_even_steven') {
                        score += 45;
                        synergy = synergy || '烂脱口秀让2和4额外触发，偶数史蒂文+4倍率双重触发';
                    }
                    if (card.id === 'j_odd_todd') {
                        score += 45;
                        synergy = synergy || '烂脱口秀让3和5额外触发，奇数托德+31筹码双重触发';
                    }
                }
                if (card.id === 'j_hack') {
                    if (selectedIds.includes('j_even_steven')) {
                        score += 40;
                        synergy = synergy || '烂脱口秀让2和4双重触发偶数史蒂文';
                    }
                    if (selectedIds.includes('j_odd_todd')) {
                        score += 40;
                        synergy = synergy || '烂脱口秀让3和5双重触发奇数托德';
                    }
                }
                // 飞溅扩展协同
                if (selectedIds.includes('j_splash')) {
                    if (card.id === 'j_smiley') {
                        score += 40;
                        synergy = synergy || '飞溅让所有牌计分，微笑表情人头牌+5倍率全触发';
                    }
                    if (card.id === 'j_triboulet') {
                        score += 45;
                        synergy = synergy || '飞溅让所有牌计分，特里布莱K/Q×2全触发';
                    }
                    if (card.id === 'j_sock') {
                        score += 40;
                        synergy = synergy || '飞溅让所有牌计分，喜与悲人头牌额外触发';
                    }
                }
                // 六六大顺扩展协同
                if (selectedIds.includes('j_oops_6')) {
                    if (card.id === 'j_8ball') {
                        score += 45;
                        synergy = synergy || '六六大顺将8号球1/4概率翻倍为1/2';
                    }
                    if (card.id === 'j_business_card') {
                        score += 40;
                        synergy = synergy || '六六大顺将名片1/2概率翻倍为1/1，必定$2';
                    }
                }
                if (card.id === 'j_oops_6') {
                    if (selectedIds.includes('j_8ball')) {
                        score += 40;
                        synergy = synergy || '六六大顺翻倍8号球概率';
                    }
                    if (selectedIds.includes('j_business_card')) {
                        score += 35;
                        synergy = synergy || '六六大顺翻倍名片概率';
                    }
                }
                // 幻视扩展协同（名片/迈达斯）
                if (selectedIds.includes('j_pareidolia')) {
                    if (card.id === 'j_business_card') {
                        score += 45;
                        synergy = synergy || '幻视所有牌变人头牌，名片每张牌1/2概率$2';
                    }
                    if (card.id === 'j_midas') {
                        score += 50;
                        synergy = synergy || '幻视所有牌变人头牌，迈达斯将所有牌变金卡';
                    }
                }
                // 喜与悲 + 名片/迈达斯
                if (selectedIds.includes('j_sock')) {
                    if (card.id === 'j_business_card') {
                        score += 35;
                        synergy = synergy || '喜与悲人头牌额外触发，名片多一次$2机会';
                    }
                    if (card.id === 'j_midas') {
                        score += 40;
                        synergy = synergy || '喜与悲人头牌额外触发，迈达斯更多变金机会';
                    }
                }
            }
            
            // 5.5 手牌效果协同（哑剧演员/钢铁/男爵/射月/证书 —— 不依赖 face 标签）
            // 哑剧演员 + 手牌效果协同（男爵/射月/钢铁牌）
            if (selectedIds.includes('j_mime')) {
                if (card.id === 'j_baron') {
                    score += 55;
                    synergy = synergy || '哑剧演员让手牌K的男爵×1.5额外触发1次';
                }
                if (card.id === 'j_shoot_moon') {
                    score += 50;
                    synergy = synergy || '哑剧演员让手牌Q的射月+13倍率额外触发1次';
                }
                if (card.id === 'j_steel') {
                    score += 50;
                    synergy = synergy || '哑剧演员让手牌中钢铁牌×1.5额外触发1次';
                }
            }
            // 反向：已选男爵/射月/钢铁小丑，推荐哑剧演员
            if (card.id === 'j_mime') {
                if (selectedIds.includes('j_baron')) {
                    score += 50;
                    synergy = synergy || '哑剧演员让手牌K的男爵×1.5额外触发';
                }
                if (selectedIds.includes('j_shoot_moon')) {
                    score += 45;
                    synergy = synergy || '哑剧演员让手牌Q的射月+13倍率额外触发';
                }
                if (selectedIds.includes('j_steel')) {
                    score += 45;
                    synergy = synergy || '哑剧演员让手牌中钢铁牌效果额外触发';
                }
            }
            // 钢铁小丑 + 男爵/射月
            if (selectedIds.includes('j_steel')) {
                if (card.id === 'j_baron') {
                    score += 50;
                    synergy = synergy || '钢铁牌K同时触发钢铁×1.5和男爵×1.5双重叠乘';
                }
                if (card.id === 'j_shoot_moon') {
                    score += 45;
                    synergy = synergy || '钢铁牌Q同时触发钢铁×1.5和射月+13';
                }
            }
            // 反向：已选男爵/射月/证书，推荐钢铁小丑
            if (card.id === 'j_steel') {
                if (selectedIds.includes('j_baron')) {
                    score += 50;
                    synergy = synergy || '手牌K同时触发男爵×1.5和钢铁×1.5双重叠乘';
                }
                if (selectedIds.includes('j_shoot_moon')) {
                    score += 45;
                    synergy = synergy || '手牌Q同时触发射月+13和钢铁×1.5';
                }
                if (selectedIds.includes('j_certificate')) {
                    score += 40;
                    synergy = synergy || '证书每回合加牌扩大牌组，配合战车变钢铁牌';
                }
            }
            // 钢铁小丑 + 证书
            if (selectedIds.includes('j_steel')) {
                if (card.id === 'j_certificate') {
                    score += 40;
                    synergy = synergy || '证书加牌后用战车变钢铁牌，钢铁小丑每张+×0.2';
                }
            }
            
            // 6. 花色协同
            if (tags.includes('suit')) {
                const suitCards = ['j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_flower_pot'];
                const suitMatches = suitCards.filter(id => selectedIds.includes(id));
                if (suitMatches.length >= 2) {
                    score += 25;
                    synergy = synergy || '多花色加成卡牌组合';
                }
                
                // 模糊小丑让花色卡牌协同翻倍
                if (selectedIds.includes('j_smeared') && suitMatches.length >= 1) {
                    score += 20;
                    synergy = synergy || '模糊小丑扩大花色触发范围';
                }
                
                // 璞玉 + 部落 (方块牌收益)
                if ((selectedIds.includes('j_rough_gem') && card.id === 'j_tribe') ||
                    (selectedIds.includes('j_tribe') && card.id === 'j_rough_gem')) {
                    score += 40;
                    synergy = synergy || '璞玉方块牌+$1与部落同花X2协同';
                }
                
                // 血石 + 滑稽/精明
                if ((selectedIds.includes('j_bloodstone') && (card.id === 'j_droll' || card.id === 'j_crafty')) ||
                    ((selectedIds.includes('j_droll') || selectedIds.includes('j_crafty')) && card.id === 'j_bloodstone')) {
                    score += 40;
                    synergy = synergy || '血石1/2概率X1.5与红桃同花协同';
                }
            }
            
            // 7. 经济类协同
            if (tags.includes('economy') || effects.economy) {
                const economyCards = ['j_golden', 'j_rocket', 'j_to_moon', 'j_credit_card', 'j_cash_card', 'j_trash'];
                const economyMatches = economyCards.filter(id => selectedIds.includes(id));
                if (economyMatches.length >= 1) {
                    score += 20;
                    synergy = synergy || '经济类卡牌组合，增加收入';
                }
            }
            
            // 7.5 出售体系协同（礼品卡/鸡蛋/侠盗/仪式匕首/篝火）
            if (selectedIds.includes('j_gift_card')) {
                if (card.id === 'j_swashbuckler') {
                    score += 50;
                    synergy = synergy || '礼品卡每回合给所有小丑售价+$1，侠盗将总售价转化为倍率';
                }
                if (card.id === 'j_ceremonial') {
                    score += 45;
                    synergy = synergy || '礼品卡抬高小丑售价，仪式匕首摧毁时获得更高永久倍率';
                }
            }
            if (card.id === 'j_gift_card') {
                if (selectedIds.includes('j_swashbuckler')) {
                    score += 50;
                    synergy = synergy || '侠盗将小丑总售价转倍率，礼品卡每回合+$1售价直接涨倍率';
                }
                if (selectedIds.includes('j_ceremonial')) {
                    score += 45;
                    synergy = synergy || '仪式匕首摧毁小丑获售价2倍倍率，礼品卡抬高售价加大收益';
                }
            }
            // 鸡蛋 ↔ 侠盗/仪式匕首
            if (selectedIds.includes('j_egg')) {
                if (card.id === 'j_swashbuckler') {
                    score += 55;
                    synergy = synergy || '鸡蛋每回合售价+$3，侠盗将所有小丑总售价转化为倍率，持续涨倍';
                }
                if (card.id === 'j_ceremonial') {
                    score += 50;
                    synergy = synergy || '鸡蛋售价快速膨胀，被仪式匕首摧毁时获得超高永久倍率';
                }
            }
            if (card.id === 'j_egg') {
                if (selectedIds.includes('j_swashbuckler')) {
                    score += 55;
                    synergy = synergy || '侠盗将总售价转倍率，鸡蛋每回合+$3售价为侠盗持续涨倍';
                }
                if (selectedIds.includes('j_ceremonial')) {
                    score += 50;
                    synergy = synergy || '仪式匕首摧毁高售价小丑获2倍永久倍率，鸡蛋售价增长最快';
                }
            }
            // 篝火 ↔ 乌合之众/卡牌术士（产出卡牌出售喂篝火）
            if (selectedIds.includes('j_campfire')) {
                if (card.id === 'j_riff_raff') {
                    score += 50;
                    synergy = synergy || '乌合之众每盲注生成2张小丑，出售喂篝火+×0.5倍率';
                }
                if (card.id === 'j_cartomancer') {
                    score += 45;
                    synergy = synergy || '卡牌术士每盲注生成塔罗牌，出售喂篝火+×0.25倍率';
                }
            }
            if (card.id === 'j_campfire') {
                if (selectedIds.includes('j_riff_raff')) {
                    score += 50;
                    synergy = synergy || '篝火每出售+×0.25，乌合之众每盲注生成2张小丑可出售喂火';
                }
                if (selectedIds.includes('j_cartomancer')) {
                    score += 45;
                    synergy = synergy || '篝火每出售+×0.25，卡牌术士每盲注生成塔罗牌可出售喂火';
                }
            }
            
            // 7.6 搭乘巴士数字牌体系（只打数字牌叠倍率）
            if (selectedIds.includes('j_ride_bus')) {
                if (card.id === 'j_even_steven') {
                    score += 45;
                    synergy = synergy || '搭乘巴士只打数字牌，偶数史蒂文给偶数牌+4倍率完美配合';
                }
                if (card.id === 'j_odd_todd') {
                    score += 45;
                    synergy = synergy || '搭乘巴士只打数字牌，奇数托德给奇数牌+31筹码完美配合';
                }
                if (card.id === 'j_fibonacci') {
                    score += 40;
                    synergy = synergy || '搭乘巴士只打数字牌，斐波那契给2/3/5/8+8倍率';
                }
                if (card.id === 'j_walkie') {
                    score += 35;
                    synergy = synergy || '搭乘巴士只打数字牌，对讲机给10和4加成';
                }
                if (card.id === 'j_hack') {
                    score += 40;
                    synergy = synergy || '搭乘巴士只打数字牌，烂脱口秀演员让2/3/4/5额外触发1次';
                }
                if (card.id === 'j_wee') {
                    score += 35;
                    synergy = synergy || '搭乘巴士只打数字牌，小小丑打2永久+8筹码';
                }
                if (card.id === 'j_scholar') {
                    score += 40;
                    synergy = synergy || '搭乘巴士只打数字牌，学者给A+4倍率+20筹码，A是数字牌不破连续';
                }
            }
            if (card.id === 'j_ride_bus') {
                const numberJokers = ['j_even_steven', 'j_odd_todd', 'j_fibonacci', 'j_walkie', 'j_hack', 'j_wee', 'j_scholar'];
                const matched = numberJokers.filter(id => selectedIds.includes(id));
                if (matched.length > 0) {
                    score += 40 * matched.length;
                    synergy = synergy || '搭乘巴士鼓励只打数字牌，已选的数字牌加成小丑完美配合';
                }
            }
            
            // 8. 摧毁类协同
            if (tags.includes('destroy') || effects.destroy) {
                const destroySynergies = [
                    { cards: ['j_glass', 't_justice'], name: '玻璃正义循环' },
                    { cards: ['j_glass', 't_fool'], name: '玻璃愚者循环' },
                    { cards: ['j_canio', 'j_pareidolia'], name: '人头牌销毁流' },
                    { cards: ['j_flower_pot', 't_high_priestess'], name: '卖花女组合' },
                    { cards: ['t_hanged', 'j_abstract'], name: '倒吊抽象流' },
                    { cards: ['j_madness', 'j_abstract'], name: '疯狂销毁流' },
                    { cards: ['j_erosion', 't_hanged'], name: '侵蚀倒吊人' },
                    { cards: ['j_erosion', 's_immolate'], name: '侵蚀火祭' }
                ];
                
                for (const syn of destroySynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 1 && (card.id === syn.cards[0] || card.id === syn.cards[1])) {
                        score += 25;
                        synergy = synergy || `摧毁类协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 9. 塔罗牌协同
            if (tags.includes('tarot') || card.cardType === 'tarot') {
                const tarotSynergies = [
                    { cards: ['j_fortune_teller', 'j_cartomancer'], name: '塔罗大师' },
                    { cards: ['j_abstract', 'j_cartomancer'], name: '抽象塔罗流' },
                    { cards: ['j_8ball', 'j_fortune_teller'], name: '8号算命' },
                    { cards: ['j_superposition', 'j_fortune_teller'], name: '叠加塔罗' },
                    { cards: ['j_vagabond', 'j_fortune_teller'], name: '流浪塔罗' },
                    { cards: ['t_strength', 'j_abstract'], name: '力量抽象' },
                    { cards: ['t_wheel', 'j_showman'], name: '轮盘马戏团长' }
                ];
                
                for (const syn of tarotSynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 1 && (card.id === syn.cards[0] || card.id === syn.cards[1])) {
                        score += 25;
                        synergy = synergy || `塔罗牌协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 9.5 流浪者 + 信用卡协同（信用卡允许负债，更容易保持≤$4触发流浪者）
            if (selectedIds.includes('j_vagabond')) {
                if (card.id === 'j_credit_card') {
                    score += 35;
                    synergy = synergy || '信用卡允许负债到-$20，更容易保持≤$4触发流浪者产出塔罗牌';
                }
            }
            if (selectedIds.includes('j_credit_card')) {
                if (card.id === 'j_vagabond') {
                    score += 35;
                    synergy = synergy || '流浪者在≤$4时生成塔罗牌，信用卡负债让条件更容易达成';
                }
            }
            
            // 9.6 零弃牌体系（窃贼核心）
            if (selectedIds.includes('j_burglar')) {
                if (card.id === 'j_mystic_summit') { score += 55; synergy = synergy || '窃贼移除弃牌，神秘之峰始终+15倍率'; }
                if (card.id === 'j_ramen') { score += 50; synergy = synergy || '窃贼移除弃牌，拉面×2倍率永不衰减'; }
                if (card.id === 'j_obelisk') { score += 50; synergy = synergy || '窃贼强制打非常用牌型，方尖石塔快速叠×倍率'; }
                if (card.id === 'j_green') { score += 40; synergy = synergy || '窃贼移除弃牌，绿色小丑只涨不跌'; }
                if (card.id === 'j_delayed') { score += 40; synergy = synergy || '窃贼移除弃牌，延迟满足始终获最高收益'; }
            }
            if (card.id === 'j_burglar') {
                if (selectedIds.includes('j_mystic_summit')) { score += 55; synergy = synergy || '窃贼让神秘之峰始终+15倍率'; }
                if (selectedIds.includes('j_ramen')) { score += 50; synergy = synergy || '窃贼让拉面×2永不衰减'; }
                if (selectedIds.includes('j_obelisk')) { score += 50; synergy = synergy || '窃贼+方尖石塔快速叠×倍率'; }
                if (selectedIds.includes('j_green')) { score += 40; synergy = synergy || '窃贼让绿色小丑只涨不跌'; }
                if (selectedIds.includes('j_delayed')) { score += 40; synergy = synergy || '窃贼让延迟满足始终生效'; }
            }
            
            // 9.7 六六大顺概率翻倍体系
            if (selectedIds.includes('j_oops_6')) {
                if (card.id === 'j_bloodstone') { score += 55; synergy = synergy || '🔥 六六大顺让血石1/2→必定触发×1.5'; }
                if (card.id === 'j_space') { score += 45; synergy = synergy || '六六大顺让太空1/4→1/2升级牌型'; }
                if (card.id === 'j_lucky_cat') { score += 45; synergy = synergy || '六六大顺让招财猫翻倍触发'; }
                if (card.id === 'j_8ball') { score += 40; synergy = synergy || '六六大顺让8号球1/4→1/2生成塔罗'; }
                if (card.id === 'j_business_card') { score += 40; synergy = synergy || '六六大顺让名片1/2→必定给$2'; }
            }
            if (card.id === 'j_oops_6') {
                if (selectedIds.includes('j_bloodstone')) { score += 55; synergy = synergy || '🔥 六六大顺让血石必定×1.5'; }
                if (selectedIds.includes('j_space')) { score += 45; synergy = synergy || '六六大顺让太空1/2升级'; }
                if (selectedIds.includes('j_lucky_cat')) { score += 45; synergy = synergy || '六六大顺翻倍招财猫触发'; }
                if (selectedIds.includes('j_8ball')) { score += 40; synergy = synergy || '六六大顺让8号球1/2触发'; }
                if (selectedIds.includes('j_business_card')) { score += 40; synergy = synergy || '六六大顺让名片必定给$2'; }
            }
            
            // 9.8 加牌体系（DNA+全息/徒步者，全息+证书/大理石）
            if (card.id === 'j_hologram' && selectedIds.includes('j_dna')) { score += 55; synergy = synergy || '🔥 DNA每回合复制加牌→全息每次+×0.25永久倍率'; }
            if (card.id === 'j_dna' && selectedIds.includes('j_hologram')) { score += 55; synergy = synergy || '🔥 DNA复制→全息+×0.25永久滚雪球'; }
            if (card.id === 'j_hiker' && selectedIds.includes('j_dna')) { score += 45; synergy = synergy || 'DNA反复出单牌，徒步者永久筹码滚雪球'; }
            if (card.id === 'j_dna' && selectedIds.includes('j_hiker')) { score += 45; synergy = synergy || 'DNA+徒步者永久+5筹码'; }
            if (card.id === 'j_hologram' && (selectedIds.includes('j_certificate') || selectedIds.includes('j_marble'))) { score += 45; synergy = synergy || '证书/大理石每回合加牌→全息+×0.25永久'; }
            if ((card.id === 'j_certificate' || card.id === 'j_marble') && selectedIds.includes('j_hologram')) { score += 45; synergy = synergy || '每回合加牌触发全息+×0.25'; }
            
            // 9.81 手牌K/Q钢铁体系
            if (card.id === 'j_steel' && selectedIds.includes('j_baron')) { score += 50; synergy = synergy || '🔥 钢铁牌K双重×1.5叠乘=×2.25'; }
            if (card.id === 'j_baron' && selectedIds.includes('j_steel')) { score += 50; synergy = synergy || '🔥 男爵+钢铁K=×2.25/张'; }
            if (card.id === 'j_steel' && selectedIds.includes('j_shoot_moon')) { score += 45; synergy = synergy || '钢铁Q: 射月+13+钢铁×1.5'; }
            if (card.id === 'j_shoot_moon' && selectedIds.includes('j_steel')) { score += 45; synergy = synergy || '钢铁Q双重收益'; }
            if (card.id === 'j_baron' && selectedIds.includes('j_shoot_moon')) { score += 40; synergy = synergy || 'K/Q手牌体系双核'; }
            if (card.id === 'j_shoot_moon' && selectedIds.includes('j_baron')) { score += 40; synergy = synergy || 'K/Q手牌体系双核'; }
            
            // 9.82 幻视扩展（卡尼奥/迈达斯/名片）
            if (card.id === 'j_canio' && selectedIds.includes('j_pareidolia')) { score += 55; synergy = synergy || '🔥 幻视+卡尼奥：摧毁任何牌都叠×1倍率'; }
            if (card.id === 'j_pareidolia' && selectedIds.includes('j_canio')) { score += 55; synergy = synergy || '🔥 幻视让所有牌变人头牌→卡尼奥无限叠'; }
            if (card.id === 'j_midas' && selectedIds.includes('j_pareidolia')) { score += 40; synergy = synergy || '幻视让所有牌变人头牌→迈达斯全变金卡'; }
            if (card.id === 'j_pareidolia' && selectedIds.includes('j_midas')) { score += 40; synergy = synergy || '幻视+迈达斯全变金卡'; }
            if (card.id === 'j_business_card' && selectedIds.includes('j_pareidolia')) { score += 35; synergy = synergy || '幻视让所有牌都触发名片给$2'; }
            
            // 9.83 模具小丑+疯狂
            if (card.id === 'j_stencil' && selectedIds.includes('j_madness')) { score += 45; synergy = synergy || '疯狂摧毁→模具空位×1叠加'; }
            if (card.id === 'j_madness' && selectedIds.includes('j_stencil')) { score += 45; synergy = synergy || '疯狂+模具：摧毁=涨×倍率'; }
            
            // 9.84 仪式匕首+乌合之众
            if (card.id === 'j_ceremonial' && selectedIds.includes('j_riff_raff')) { score += 45; synergy = synergy || '乌合之众补位→匕首循环摧毁获永久倍率'; }
            if (card.id === 'j_riff_raff' && selectedIds.includes('j_ceremonial')) { score += 45; synergy = synergy || '乌合之众持续补位让匕首循环'; }
            
            // 9.85 迈达斯+吸血鬼
            if (card.id === 'j_vampire' && selectedIds.includes('j_midas')) { score += 45; synergy = synergy || '🔥 迈达斯持续产金卡→吸血鬼无限叠×倍率'; }
            if (card.id === 'j_midas' && selectedIds.includes('j_vampire')) { score += 45; synergy = synergy || '🔥 迈达斯+吸血鬼无限供应增强牌'; }
            
            // 9.86 天文学家+星座/卫星（Joker之间，非行星牌）
            if (card.id === 'j_constellation' && selectedIds.includes('j_astronomer')) { score += 55; synergy = synergy || '🔥 天文学家免费行星→星座无限叠+×0.1倍率'; }
            if (card.id === 'j_astronomer' && selectedIds.includes('j_constellation')) { score += 55; synergy = synergy || '🔥 天文学家+星座免费无限叠倍率'; }
            if (card.id === 'j_satellite' && selectedIds.includes('j_astronomer')) { score += 40; synergy = synergy || '天文学家免费行星→卫星+$1加速收入'; }
            if (card.id === 'j_astronomer' && selectedIds.includes('j_satellite')) { score += 40; synergy = synergy || '天文学家+卫星免费叠收入'; }
            
            // 9.87 弃牌流（约里克/上路吧杰克+弃牌加速器）
            if (card.id === 'j_yorick' && (selectedIds.includes('j_drunkard') || selectedIds.includes('j_merry_andy'))) { score += 40; synergy = synergy || '额外弃牌加速约里克达到23张叠×倍率'; }
            if (card.id === 'j_hit_road' && (selectedIds.includes('j_drunkard') || selectedIds.includes('j_merry_andy'))) { score += 40; synergy = synergy || '额外弃牌→弃更多J→上路吧杰克×倍率更高'; }
            if ((card.id === 'j_drunkard' || card.id === 'j_merry_andy') && selectedIds.includes('j_yorick')) { score += 40; synergy = synergy || '弃牌加速器帮约里克快速叠×倍率'; }
            if ((card.id === 'j_drunkard' || card.id === 'j_merry_andy') && selectedIds.includes('j_hit_road')) { score += 40; synergy = synergy || '弃牌加速器帮上路吧杰克多弃J'; }
            
            // 10. 行星牌协同
            if (tags.includes('planet') || card.cardType === 'planet') {
                const planetSynergies = [
                    { cards: ['j_constellation', 'j_astronomer'], name: '星座天文学' },
                    { cards: ['j_satellite', 'j_constellation'], name: '卫星星座' },
                    { cards: ['j_satellite', 'j_astronomer'], name: '卫星天文学' },
                    { cards: ['t_priestess', 'j_constellation'], name: '女祭司星座' },
                    { cards: ['j_showman', 'j_constellation'], name: '马戏团长行星' },
                    { cards: ['j_crazy', 'p_saturn'], name: '顺子行星' },
                    { cards: ['j_tribe', 'p_jupiter'], name: '同花行星' }
                ];
                
                for (const syn of planetSynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 1 && (card.id === syn.cards[0] || card.id === syn.cards[1])) {
                        score += 25;
                        synergy = synergy || `行星牌协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 11. 灵魂牌协同
            if (tags.includes('spectral') || card.cardType === 'spectral') {
                const spectralSynergies = [
                    { cards: ['j_seance', 'j_fortune_teller'], name: '降灵魂师' },
                    { cards: ['j_sixth_sense', 'j_abstract'], name: '第六感抽象' },
                    { cards: ['s_familiar', 'j_pareidolia'], name: '使魔人头' },
                    { cards: ['s_grim', 'j_scholar'], name: '严峻学者' },
                    { cards: ['s_incantation', 'j_abstract'], name: '咒语抽象' },
                    { cards: ['s_immolate', 'j_to_moon'], name: '火祭冲向月球' },
                    { cards: ['s_hex', 'j_showman'], name: '妖法主持' }
                ];
                
                for (const syn of spectralSynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 1 && (card.id === syn.cards[0] || card.id === syn.cards[1])) {
                        score += 25;
                        synergy = synergy || `灵魂牌协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 12. 重置/重复打出协同
            if (tags.includes('rescore') || card.id === 'j_dusk') {
                const rescoreSynergies = [
                    { cards: ['j_hanging_chad', 'j_dusk'], name: '查德黄昏' },
                    { cards: ['j_hanging_chad', 'j_wee'], name: '未断选票小小丑' },
                    { cards: ['j_hanging_chad', 'j_cavendish'], name: '查德卡文迪什' },
                    { cards: ['j_hanging_chad', 'j_gros_michel'], name: '未断选票大麦克香蕉' },
                    { cards: ['j_hanging_chad', 'j_fibonacci'], name: '未断选票斐波那契' },
                    { cards: ['j_hanging_chad', 'j_even_steven'], name: '未断选票偶数史蒂文' },
                    { cards: ['j_hanging_chad', 'j_odd_todd'], name: '未断选票奇数托德' },
                    { cards: ['j_hanging_chad', 'j_scholar'], name: '未断选票学者' },
                    { cards: ['j_hanging_chad', 'j_walkie'], name: '未断选票对讲机' },
                    { cards: ['j_hanging_chad', 'j_hack'], name: '未断选票烂脱口秀' },
                    { cards: ['j_hanging_chad', 'j_hiker'], name: '未断选票徒步者' },
                    { cards: ['j_hanging_chad', 'j_sock'], name: '未断选票喜与悲' },
                    { cards: ['j_dusk', 'j_abstract'], name: '黄昏抽象' },
                    { cards: ['j_throwback', 'j_hanging_chad'], name: '回溯未断选票' }
                ];
                
                for (const syn of rescoreSynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 1 && (card.id === syn.cards[0] || card.id === syn.cards[1])) {
                        score += 25;
                        synergy = synergy || `重复打出协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 13. 风险/几率协同
            if (tags.includes('risky') || card.id === 'j_gros_michel' || card.id === 'j_cavendish' || card.id === 'j_bloodstone') {
                const riskySynergies = [
                    // 注意：大麦克香蕉和卡文迪什互斥，大麦克香蕉灭绝后才出现卡文迪什
                    { cards: ['j_gros_michel', 'j_bloodstone'], name: '风险血石' },
                    { cards: ['j_madness', 'j_abstract'], name: '疯狂抽象' }
                ];
                
                for (const syn of riskySynergies) {
                    const matchCount = syn.cards.filter(id => selectedIds.includes(id)).length;
                    if (matchCount >= 2 && syn.cards.includes(card.id)) {
                        score += 25;
                        synergy = synergy || `风险几率协同：${syn.name}`;
                        break;
                    }
                }
            }
            
            // 14. 稀有度加权
            if (card.rarity === 'legendary') score += 5;
            else if (card.rarity === 'rare') score += 3;
            
            // 13. 添加协同说明
            if (card.synergy_note && !synergy) {
                synergy = card.synergy_note;
            }
            
            return {
                card,
                score,
                reason: reasons.length > 0 ? reasons.join('，') : '泛用型卡牌',
                synergy: synergy,
                buildTag: buildTag
            };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);
    }
    
    // ============ 匹配消耗品推荐 ============
    
    // 智能推荐匹配的塔罗牌
    getMatchedTarots(existingRecs) {
        const selectedIds = this.selectedCards.map(c => c.id);
        const selectedJokers = this.selectedCards.filter(c => c.cardType === 'joker');
        if (selectedJokers.length === 0) return existingRecs;
        
        const allTarots = this.allCards.filter(c => c.cardType === 'tarot' && !selectedIds.includes(c.id));
        const recMap = new Map(existingRecs.map(r => [r.card.id, r]));
        
        // 定义 Joker → 塔罗牌 的匹配关系
        const jokerTarotMap = {
            'j_hanging_chad': { tarots: ['t_justice'], reason: '正义创造玻璃牌，第1张计分的玻璃牌触发3次×2倍率效果极其恐怖' },
            'j_steel': { tarots: ['t_chariot'], reason: '战车创造钢铁牌，钢铁小丑每张钢卡+0.2倍率' },
            'j_glass': { tarots: ['t_justice', 't_fool'], reason: '正义创造玻璃牌供摧毁叠加倍率，愚者可复制正义' },
            'j_vampire': { tarots: ['t_empress', 't_emperor', 't_devil'], reason: '持续给牌附增强供吸血鬼吸收叠加X倍率' },
            'j_driver_license': { tarots: ['t_empress', 't_emperor', 't_devil', 't_chariot'], reason: '强化牌凑齐16张增强牌激活X3倍率' },
            'j_lucky_cat': { tarots: ['t_magician'], reason: '魔术师创造幸运牌，招财猫触发幸运卡+0.25倍率' },
            'j_stone': { tarots: ['t_tower'], reason: '塔创造石头牌，石头小丑每张石头牌+25筹码' },
            'j_marble': { tarots: ['t_tower'], reason: '塔创造石头牌，配合大理石小丑增加石头牌数量' },
            'j_midas': { tarots: ['t_devil'], reason: '恶魔创造黄金牌，配合迈达斯面具增强金卡效果' },
            'j_golden_ticket': { tarots: ['t_devil'], reason: '恶魔创造黄金牌，黄金门票每张金卡+$4' },
            'j_fortune_teller': { tarots: ['t_fool'], reason: '愚者复制上张塔罗牌，增加算命先生使用次数' },
            'j_greedy': { tarots: ['t_star'], reason: '星星将牌转为方块，贪婪小丑方块+3倍率' },
            'j_lusty': { tarots: ['t_sun'], reason: '太阳将牌转为红桃，色欲小丑红桃+3倍率' },
            'j_wrathful': { tarots: ['t_world'], reason: '世界将牌转为黑桃，愤怒小丑黑桃+3倍率' },
            'j_gluttonous': { tarots: ['t_moon'], reason: '月亮将牌转为梅花，暴食小丑梅花+3倍率' },
            'j_bloodstone': { tarots: ['t_sun'], reason: '太阳将牌转为红桃，血石红桃1/2几率X1.5' },
            'j_arrowhead': { tarots: ['t_world'], reason: '世界将牌转为黑桃，箭头黑桃+50筹码' },
            'j_onyx': { tarots: ['t_moon'], reason: '月亮将牌转为梅花，缟玛瑙梅花+7倍率' },
            'j_rough_gem': { tarots: ['t_star'], reason: '星星将牌转为方块，璞玉方块牌+$1' },
            'j_blackboard': { tarots: ['t_world', 't_moon'], reason: '世界/月亮将牌转为黑桃/梅花，黑板全黑X3更容易' },
            'j_flower_pot': { tarots: ['t_lovers'], reason: '恋人创造万能牌，花盆四花色更容易凑齐' },
            'j_constellation': { tarots: ['t_priestess'], reason: '女教皇生成2张行星牌，星座每张行星牌+0.1倍率' },
            'j_abstract': { tarots: ['t_strength', 't_hanged'], reason: '力量/倒吊人调整牌组，抽象小丑获得额外倍率' },
            'j_pareidolia': { tarots: ['t_empress', 't_emperor'], reason: '幻视让所有牌变人头牌，增强牌效果范围翻倍' },
            'j_canio': { tarots: ['t_hanged'], reason: '倒吊人移除牌给卡尼奥提供人头牌摧毁机会' },
            'j_hologram': { tarots: ['t_strength', 't_death'], reason: '全息影像每加入牌组+0.25倍率，塔罗牌可以改牌加入' },
            'j_showman': { tarots: ['t_wheel'], reason: '命运之轮概率强化Joker，马戏团长让强化效果可重复' },
            'j_cartomancer': { tarots: ['t_fool'], reason: '卡牌术士创造塔罗牌，愚者可复制上张塔罗效果' },
        };
        
        const results = new Map();
        
        for (const joker of selectedJokers) {
            const mapping = jokerTarotMap[joker.id];
            if (!mapping) continue;
            
            for (const tarotId of mapping.tarots) {
                if (selectedIds.includes(tarotId)) continue;
                const tarot = allTarots.find(t => t.id === tarotId);
                if (!tarot) continue;
                
                if (results.has(tarotId)) {
                    const existing = results.get(tarotId);
                    existing.score += 30;
                    existing.reason += `；${mapping.reason}`;
                } else {
                    // 合并已有的推荐分数
                    const existingRec = recMap.get(tarotId);
                    const baseScore = existingRec ? existingRec.score : 0;
                    results.set(tarotId, {
                        card: tarot,
                        score: baseScore + 40,
                        reason: mapping.reason,
                        synergy: `配合 ${joker.name}`,
                        buildTag: null
                    });
                }
            }
        }
        
        // 合并已有推荐中未被新逻辑覆盖的塔罗牌
        for (const rec of existingRecs) {
            if (!results.has(rec.card.id)) {
                results.set(rec.card.id, rec);
            }
        }
        
        return Array.from(results.values()).sort((a, b) => b.score - a.score);
    }
    
    // 智能推荐匹配的行星牌
    getMatchedPlanets(existingRecs) {
        const selectedIds = this.selectedCards.map(c => c.id);
        const selectedJokers = this.selectedCards.filter(c => c.cardType === 'joker');
        if (selectedJokers.length === 0) return existingRecs;
        
        const allPlanets = this.allCards.filter(c => c.cardType === 'planet' && !selectedIds.includes(c.id));
        const recMap = new Map(existingRecs.map(r => [r.card.id, r]));
        
        // 定义 牌型 → 行星牌 的映射
        const handToPlanet = {
            'high_card': 'p_pluto', 'one_pair': 'p_mercury', 'pair': 'p_mercury',
            'two_pair': 'p_uranus', 'three_of_a_kind': 'p_venus',
            'straight': 'p_saturn', 'flush': 'p_jupiter',
            'full_house': 'p_earth', 'four_of_a_kind': 'p_mars',
            'straight_flush': 'p_neptune', 'five_of_a_kind': 'p_planet_x',
            'flush_five': 'p_eris', 'flush_house': 'p_ceres'
        };
        
        // 定义 Joker → 行星牌 的直接匹配
        const jokerPlanetMap = {
            'j_jolly': { planets: ['p_mercury'], reason: '水星升级对子牌型，开心小丑对子+8倍率' },
            'j_sly': { planets: ['p_mercury'], reason: '水星升级对子牌型，奸诈小丑对子+50筹码' },
            'j_duo': { planets: ['p_mercury'], reason: '水星升级对子牌型，二重奏对子X2' },
            'j_zany': { planets: ['p_venus'], reason: '金星升级三条牌型，疯狂小丑三条+12倍率' },
            'j_wily': { planets: ['p_venus'], reason: '金星升级三条牌型，狡猾小丑三条+100筹码' },
            'j_trio': { planets: ['p_venus'], reason: '金星升级三条牌型，三重奏三条X3' },
            'j_mad': { planets: ['p_uranus'], reason: '天王星升级两对牌型，疯小丑两对+10倍率' },
            'j_clever': { planets: ['p_uranus'], reason: '天王星升级两对牌型，聪明小丑两对+80筹码' },
            'j_spare_trousers': { planets: ['p_uranus'], reason: '天王星升级两对牌型，备用裤子两对+2倍率' },
            'j_crazy': { planets: ['p_saturn'], reason: '土星升级顺子牌型，疯狂小丑顺子+12倍率' },
            'j_devious': { planets: ['p_saturn'], reason: '土星升级顺子牌型，阴险小丑顺子+100筹码' },
            'j_order': { planets: ['p_saturn'], reason: '土星升级顺子牌型，秩序顺子X3' },
            'j_runner': { planets: ['p_saturn'], reason: '土星升级顺子牌型，跑步选手顺子+15筹码' },
            'j_droll': { planets: ['p_jupiter'], reason: '木星升级同花牌型，滑稽小丑同花+10倍率' },
            'j_crafty': { planets: ['p_jupiter'], reason: '木星升级同花牌型，精明小丑同花+80筹码' },
            'j_tribe': { planets: ['p_jupiter'], reason: '木星升级同花牌型，部落同花X2' },
            'j_family': { planets: ['p_mars'], reason: '火星升级四条牌型，一家人四条X4' },
            'j_constellation': { planets: ['p_pluto', 'p_mercury', 'p_venus', 'p_saturn', 'p_jupiter'], reason: '使用任何行星牌都能增加星座的X倍率' },
            'j_astronomer': { planets: ['p_pluto', 'p_mercury', 'p_venus', 'p_saturn', 'p_jupiter'], reason: '天文学家让商店行星牌免费，多买多升级' },
            'j_satellite': { planets: ['p_pluto', 'p_mercury', 'p_venus', 'p_saturn', 'p_jupiter', 'p_uranus', 'p_earth', 'p_mars', 'p_neptune'], reason: '卫星每使用独特行星+$1，尽量多用不同行星' },
            'j_supernova': { planets: ['p_mercury', 'p_saturn', 'p_jupiter'], reason: '超新星按牌型使用次数+倍率，行星牌升级常用牌型' },
            'j_shortcut': { planets: ['p_saturn'], reason: '土星升级顺子，捷径允许1点空隙降低门槛' },
            'j_four_fingers': { planets: ['p_saturn', 'p_jupiter', 'p_neptune'], reason: '四指只需4张组顺子/同花，行星牌升级这些牌型收益更大' },
            'j_seance': { planets: ['p_neptune'], reason: '海王星升级同花顺牌型，通灵同花顺时产生灵魂牌' },
            'j_smeared': { planets: ['p_jupiter', 'p_neptune'], reason: '模糊小丑合并花色，同花/同花顺更容易凑成，值得升级' },
        };
        
        const results = new Map();
        
        for (const joker of selectedJokers) {
            const mapping = jokerPlanetMap[joker.id];
            if (!mapping) continue;
            
            for (const planetId of mapping.planets) {
                if (selectedIds.includes(planetId)) continue;
                const planet = allPlanets.find(p => p.id === planetId);
                if (!planet) continue;
                
                if (results.has(planetId)) {
                    const existing = results.get(planetId);
                    existing.score += 20;
                    if (!existing.reason.includes(joker.name)) {
                        existing.synergy += `、${joker.name}`;
                    }
                } else {
                    const existingRec = recMap.get(planetId);
                    const baseScore = existingRec ? existingRec.score : 0;
                    results.set(planetId, {
                        card: planet,
                        score: baseScore + 35,
                        reason: mapping.reason,
                        synergy: `配合 ${joker.name}`,
                        buildTag: null
                    });
                }
            }
        }
        
        // 合并已有推荐
        for (const rec of existingRecs) {
            if (!results.has(rec.card.id)) {
                results.set(rec.card.id, rec);
            }
        }
        
        return Array.from(results.values()).sort((a, b) => b.score - a.score);
    }
    
    // 智能推荐匹配的灵魂牌
    getMatchedSpectrals(existingRecs) {
        const selectedIds = this.selectedCards.map(c => c.id);
        const selectedJokers = this.selectedCards.filter(c => c.cardType === 'joker');
        if (selectedJokers.length === 0) return existingRecs;
        
        const allSpectrals = this.allCards.filter(c => c.cardType === 'spectral' && !selectedIds.includes(c.id));
        const recMap = new Map(existingRecs.map(r => [r.card.id, r]));
        
        // 定义 Joker → 灵魂牌 的匹配关系
        const jokerSpectralMap = {
            'j_photograph': { spectrals: ['s_familiar'], reason: '使魔摧毁牌获得3张强化人头牌，照片第一张人头牌X2' },
            'j_scary_face': { spectrals: ['s_familiar'], reason: '使魔获得强化人头牌，恐怖面容人头牌+30筹码' },
            'j_smiley': { spectrals: ['s_familiar'], reason: '使魔获得强化人头牌，微笑表情人头牌+5倍率' },
            'j_pareidolia': { spectrals: ['s_familiar', 's_cryptid'], reason: '使魔配合幻视，所有强化牌都触发人头牌加成；神秘生物复制牌组' },
            'j_scholar': { spectrals: ['s_grim'], reason: '严峻摧毁牌获得2张强化A，学者A+20筹码+4倍率' },
            'j_fibonacci': { spectrals: ['s_grim', 's_incantation'], reason: '严峻获得强化A配合斐波那契，咒语获得数字牌也可触发' },
            'j_abstract': { spectrals: ['s_incantation', 's_hex'], reason: '咒语增加牌组配合抽象小丑，妖法强化Joker多彩效果' },
            'j_to_moon': { spectrals: ['s_immolate'], reason: '火祭摧毁5张牌获$20，冲向月球增加利息收益最大化' },
            'j_golden': { spectrals: ['s_immolate', 's_talisman'], reason: '火祭$20配合经济体系，护身符金封印增加金卡收益' },
            'j_bull': { spectrals: ['s_immolate'], reason: '火祭$20增加现金，公牛每$1+2筹码' },
            'j_bootstraps': { spectrals: ['s_immolate'], reason: '火祭$20增加现金，乌合之众每$5+2倍率' },
            'j_showman': { spectrals: ['s_hex', 's_aura'], reason: '妖法/光环强化Joker，马戏团长让效果可重复' },
            'j_blueprint': { spectrals: ['s_soul', 's_ankh'], reason: '灵魂获得传说Joker，安卡复制Joker配合蓝图' },
            'j_brainstorm': { spectrals: ['s_soul', 's_ankh'], reason: '灵魂获得传说Joker，安卡复制Joker配合头脑风暴' },
            'j_seance': { spectrals: ['s_soul'], reason: '通灵产灵魂牌，灵魂创造传说Joker' },
            'j_sixth_sense': { spectrals: ['s_soul'], reason: '第六感产灵魂牌，灵魂创造传说Joker' },
            'j_hologram': { spectrals: ['s_cryptid', 's_familiar', 's_grim', 's_incantation'], reason: '这些灵魂牌创造新牌加入牌组，全息影像每加入+0.25倍率' },
            'j_midas': { spectrals: ['s_talisman'], reason: '护身符添加金封印，配合迈达斯面具的金卡体系' },
            'j_golden_ticket': { spectrals: ['s_talisman'], reason: '护身符添加金封印，黄金门票每张金卡+$4' },
            'j_glass': { spectrals: ['s_hex'], reason: '妖法赋予多彩效果，配合玻璃小丑的摧毁叠加体系' },
            'j_driver_license': { spectrals: ['s_aura', 's_familiar', 's_grim', 's_incantation'], reason: '灵魂牌创造强化牌，帮助凑齐16张增强牌激活驾驶执照X3' },
            'j_perkeo': { spectrals: ['s_soul', 's_black_hole', 's_wraith'], reason: '帕奇欧创造消耗卡负面复制，灵魂/黑洞/幽灵都是顶级灵魂牌' },
            'j_campfire': { spectrals: ['s_ankh'], reason: '安卡复制Joker可以出售，篝火每出售+X0.25' },
            'j_space': { spectrals: ['s_black_hole'], reason: '黑洞所有牌型升1级，配合太空小丑的牌型升级体系' },
            'j_supernova': { spectrals: ['s_black_hole'], reason: '黑洞升级所有牌型，超新星按使用次数+倍率' },
            'j_constellation': { spectrals: ['s_black_hole'], reason: '黑洞升级所有牌型如同使用多张行星牌，星座获得大量倍率' },
        };
        
        const results = new Map();
        
        for (const joker of selectedJokers) {
            const mapping = jokerSpectralMap[joker.id];
            if (!mapping) continue;
            
            for (const spectralId of mapping.spectrals) {
                if (selectedIds.includes(spectralId)) continue;
                const spectral = allSpectrals.find(s => s.id === spectralId);
                if (!spectral) continue;
                
                if (results.has(spectralId)) {
                    const existing = results.get(spectralId);
                    existing.score += 25;
                    if (!existing.synergy.includes(joker.name)) {
                        existing.synergy += `、${joker.name}`;
                    }
                } else {
                    const existingRec = recMap.get(spectralId);
                    const baseScore = existingRec ? existingRec.score : 0;
                    results.set(spectralId, {
                        card: spectral,
                        score: baseScore + 35,
                        reason: mapping.reason,
                        synergy: `配合 ${joker.name}`,
                        buildTag: null
                    });
                }
            }
        }
        
        // 合并已有推荐
        for (const rec of existingRecs) {
            if (!results.has(rec.card.id)) {
                results.set(rec.card.id, rec);
            }
        }
        
        return Array.from(results.values()).sort((a, b) => b.score - a.score);
    }
    
    // ============ 攻略推荐 ============
    
    // 构筑流派定义
    getBuildStrategies() {
        return [
            {
                id: 'pair_build',
                name: '🃏 对子流',
                difficulty: '⭐ 简单',
                desc: '围绕对子牌型构筑，容易凑成，倍率稳定增长',
                detail: '对子是最容易凑成的牌型，核心是通过对子相关Joker叠加倍率和筹码。配合牌库压缩提高拿到对子的概率。',
                coreCards: ['j_jolly', 'j_sly', 'j_duo'],
                supportCards: ['j_spare_trousers', 'j_hanging_chad', 'j_splash', 'p_mercury'],
                tips: '优先升级对子的行星牌（水星），后期寻找二重奏(X2)作为终极倍率',
                counters: '眼(The Eye)每手不能重复牌型，频繁打对子会被限制 | 嘴(The Mouth)只能打一种牌型，对子流反而适配',
                compatibleWith: [
                    { id: 'double_pair_build', note: '对子流自然升级为双对流，所有对子加成在两对中触发两次' },
                    { id: 'economy_build', note: '经济流可以作为前期过渡，攒钱后转对子体系' }
                ]
            },
            {
                id: 'double_pair_build',
                name: '👯 双对流',
                difficulty: '⭐⭐ 中等',
                desc: '两对牌型组合卡牌，双倍触发对子加成，伤害爆炸',
                detail: '两对包含两个对子，因此开心小丑(+8倍率)、奸诈小丑(+50筹码)会双倍触发。再叠加疯狂小丑(+10倍率)、聪敏小丑(+80筹码)、备用裤子(+2倍率永久叠加)，五卡齐聚时对子效果全部触发两次，伤害倍增。方形小丑打出恰好4张牌+4筹码永久叠加，两对恰好是4张牌完美适配。',
                coreCards: ['j_mad', 'j_clever', 'j_spare_trousers', 'j_jolly', 'j_sly'],
                supportCards: ['j_duo', 'j_square', 'p_uranus'],
                tips: '两对是双倍快乐——对子系加成（开心/奸诈）会触发两次！备用裤子每打出两对+2倍率永久叠加，稳定成长。方形小丑和两对完美配合：两对恰好4张牌，每次+4筹码永久叠加',
                counters: '眼(The Eye)每手不能重复牌型 | 灵媒(The Psychic)必须打5张，两对只需4张会浪费1张',
                compatibleWith: [
                    { id: 'pair_build', note: '双对流是对子流的升级版，核心卡牌完全兼容' },
                    { id: 'economy_build', note: '经济流提供前期过渡资金，后期切换到双对输出' }
                ]
            },
            {
                id: 'straight_build',
                name: '📏 顺子流',
                difficulty: '⭐⭐ 中等',
                desc: '顺子体系，配合捷径降低门槛，秩序提供X3倍率',
                detail: '顺子需要5张连续牌，难度较高但回报丰厚。捷径允许1点间隔大幅降低组成难度，四指可以只用4张。',
                coreCards: ['j_crazy', 'j_devious', 'j_order', 'j_shortcut', 'j_four_fingers'],
                supportCards: ['j_runner', 'j_superposition', 'p_saturn'],
                tips: '捷径是顺子流的核心辅助，让2-4-5-6-7也算顺子。四指进一步降低到4张即可',
                counters: '眼(The Eye)每手不能重复牌型 | 针(The Needle)只能出1手，顺子凑不齐就没机会 | 手臂(The Arm)打出牌型等级-1',
                compatibleWith: [
                    { id: 'flush_build', note: '顺子+同花=同花顺！四指让两者只需4张，是终极组合' },
                    { id: 'fibonacci_build', note: 'A-2-3-5中3和5间隔2用捷径相邻，4张斐波那契牌可融入顺子' }
                ]
            },
            {
                id: 'flush_build',
                name: '🎨 同花流',
                difficulty: '⭐⭐ 中等',
                desc: '同花体系，配合花色Joker和模糊小丑提高触发率',
                detail: '同花需要5张同花色牌，模糊小丑合并红方/黑梅大幅提高概率。四指可以降低到4张。',
                coreCards: ['j_droll', 'j_crafty', 'j_tribe', 'j_smeared'],
                supportCards: ['j_four_fingers', 'j_blackboard', 'p_jupiter'],
                tips: '模糊小丑是同花流最重要的辅助——红桃方块合并、黑桃梅花合并，等于只有2种花色',
                counters: '花色Boss(梅花/黑桃/方块/红桃)对应花色牌被削弱 | 眼(The Eye)每手不能重复牌型',
                compatibleWith: [
                    { id: 'straight_build', note: '同花+顺子=同花顺！用四指降低门槛，是最强牌型组合' },
                    { id: 'chance_build', note: '血石(红桃X1.5)与同花配合，打红桃同花每张牌都可能触发' },
                    { id: 'steel_build', note: '钢铁牌留手牌不影响同花凑牌，两者互不冲突' }
                ]
            },
            {
                id: 'face_build',
                name: '👑 人头牌流',
                difficulty: '⭐⭐ 中等',
                desc: '围绕J/Q/K人头牌构筑，多个Joker提供叠加加成',
                detail: '人头牌(J/Q/K)有大量专属加成Joker，幻视可以让所有牌都变成人头牌，是人头牌流的终极辅助。',
                coreCards: ['j_photograph', 'j_scary_face', 'j_smiley', 'j_pareidolia'],
                supportCards: ['j_sock', 'j_baron', 'j_triboulet', 'j_business_card', 'j_midas'],
                tips: '幻视(所有牌变人头牌)是核心中的核心，拿到后所有人头牌加成都能触发',
                counters: '植物(The Plant)人头牌被削弱(计分为0) | 标记(The Mark)人头牌暗置看不到牌面',
                compatibleWith: [
                    { id: 'kq_build', note: '人头牌流自然兼容K/Q皇室流，K/Q本身就是人头牌' },
                    { id: 'steel_build', note: '钢铁牌+男爵/射月，手牌中的K/Q既触发钢铁×1.5又触发皇室加成' },
                    { id: 'augment_build', note: '迈达斯面具将人头牌变金卡(增强牌)，吸血鬼可以吸收叠倍率' },
                    { id: 'remove_card_build', note: '卡尼奥+幻视让所有被摧毁的牌都算人头牌，每次摧毁都叠×倍率+侵蚀+4' }
                ]
            },
            {
                id: 'kq_build',
                name: '♔ K/Q皇室流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '围绕K和Q打造超高倍率，特里布莱K/Q各X2',
                detail: '特里布莱让K和Q各提供X2倍率，男爵让每张K提供X1.5，射月让每张Q+13倍率。配合幻视让所有牌变人头牌后效果更强。',
                coreCards: ['j_triboulet', 'j_baron', 'j_shoot_moon'],
                supportCards: ['j_pareidolia', 'j_sock', 'j_photograph', 'j_hanging_chad'],
                tips: '传说Joker特里布莱是核心，每张K和Q都X2，手牌全是K/Q时倍率爆炸',
                counters: '植物(The Plant)人头牌被削弱 | 标记(The Mark)人头牌暗置 | 钩子(The Hook)每手弃2张，可能弃掉留手的K/Q',
                compatibleWith: [
                    { id: 'face_build', note: 'K/Q都是人头牌，所有人头牌加成(恐怖面孔/微笑表情/照片)全部叠加' },
                    { id: 'steel_build', note: '手牌中的K/Q变钢铁牌后，钢铁×1.5+男爵×1.5+射月+13多重触发' },
                    { id: 'copy_build', note: '蓝图/头脑风暴复制特里布莱的K/Q×2效果，倍率直接翻倍' }
                ]
            },
            {
                id: 'fibonacci_build',
                name: '🐚 斐波那契流',
                difficulty: '⭐⭐ 中等',
                desc: '利用斐波那契数列(A,2,3,5,8)的双重触发效果',
                detail: '斐波那契小丑对A/2/3/5/8加+8倍率，偶数史蒂文对2/4/6/8/10加+4倍率，奇数托德对A/3/5/7/9加+31筹码。2和8可同时触发斐波那契+偶数，A/3/5可触发斐波那契+奇数。烂脱口秀演员让2/3/4/5额外触发1次，其中2/3/5与斐波那契重叠，+8倍率变+16！',
                coreCards: ['j_fibonacci', 'j_even_steven', 'j_odd_todd'],
                supportCards: ['j_hack', 'j_scholar', 'j_walkie', 'j_8ball'],
                tips: '2是三重触发王者(斐波那契+偶数+脱口秀演员)，3和5可双重触发(斐波那契+脱口秀演员+奇数)。烂脱口秀演员让2/3/5的+8倍率再触发一次，性价比极高',
                counters: '燧石(The Flint)基础筹码和倍数减半 | 柱子(The Pillar)之前打过的牌被削弱',
                compatibleWith: [
                    { id: 'straight_build', note: 'A-2-3-5中3和5用捷径相邻，可融入顺子体系（但8距5差3不适配）' },
                    { id: 'tarot_build', note: '8号球打出8时1/4概率给塔罗牌，与塔罗流占卜师配合' }
                ]
            },
            {
                id: 'economy_build',
                name: '💰 经济流',
                difficulty: '⭐ 简单',
                desc: '快速积累金钱，利用金钱转化为筹码/倍率',
                detail: '先通过经济Joker快速积累资金，再用公牛(每$1+2筹码)和提靴带(每$5+2倍率)将金钱转化为战斗力。冲向月球让利息收益最大化。',
                coreCards: ['j_golden', 'j_to_moon', 'j_bull', 'j_bootstraps'],
                supportCards: ['j_rocket', 'j_egg', 'j_cloud9', 'j_credit_card'],
                tips: '保持$25以上获得最大利息($5)，公牛和乌合之众让你的钱包就是你的武器',
                counters: '高墙(The Wall)盲注4倍分数，经济流前期伤害低容易过不了 | 牙齿(The Tooth)每打1张牌-$1',
                compatibleWith: [
                    { id: 'pair_build', note: '经济流是最佳前期过渡，攒够钱后可以转任何后期流派' },
                    { id: 'double_pair_build', note: '经济流提供前期资金，后期靠双对输出' },
                    { id: 'straight_build', note: '经济流可以过渡到顺子流，攒钱期间搜集顺子组件' },
                    { id: 'flush_build', note: '经济流前期攒钱，后期转同花体系输出' },
                    { id: 'skip_build', note: '跳过盲注省下的回合用来攒钱，经济+跳过双重收益' },
                    { id: 'remove_card_build', note: '火祭摧毁5张牌获$20，减牌赚钱两不误，喂给公牛/提靴带' }
                ]
            },
            {
                id: 'discard_build',
                name: '🗑️ 弃牌流',
                difficulty: '⭐⭐ 中等',
                desc: '利用弃牌触发各种效果，弃牌也能赚钱和加倍率',
                detail: '醉汉和快乐安迪增加弃牌次数（快乐安迪+3弃牌但手牌上限-1），旗帜将剩余弃牌转化为筹码，约里克弃23张后获得X倍率，上路吧杰克弃J获得倍率。弃牌经济卡则把弃牌变成收入。',
                coreCards: ['j_yorick', 'j_burnt', 'j_drunkard', 'j_merry_andy', 'j_banner'],
                supportCards: ['j_hit_road', 'j_trading', 'j_mail_in', 'j_castle', 'j_faceless'],
                tips: '快乐安迪+3弃牌但手牌上限-1，是核心引擎。配合旗帜每剩余弃牌+30筹码非常可观',
                counters: '针(The Needle)只能出1手没有弃牌机会 | 水(The Water)弃牌数归0',
                compatibleWith: [
                    { id: 'economy_build', note: '弃牌经济卡(交易卡/邮寄回扣)赚的钱可以喂给公牛/提靴带' },
                    { id: 'face_build', note: '无脸小丑弃3张人头牌+$5，配合幻视(所有牌变人头牌)收益爆炸' }
                ]
            },
            {
                id: 'burglar_build',
                name: '🔇 窃贼流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '窃贼移除所有弃牌，让多个Joker保持最佳状态',
                detail: '窃贼移除所有弃牌次数但+3出牌次数。这让拉面始终保持X2倍率、神秘峰顶始终+15倍率、延迟满足获得最高$收益（整回合未弃牌时每个剩余弃牌+$2）、绿色小丑不会扣倍率。',
                coreCards: ['j_burglar', 'j_ramen', 'j_mystic_summit'],
                supportCards: ['j_delayed', 'j_green', 'j_acrobat', 'j_obelisk'],
                tips: '窃贼是整个流派的基石——没有弃牌=拉面不衰减+神秘峰顶满触发+延迟满足满收益（整回合未弃牌时每个剩余弃牌+$2，窃贼直接满足条件）',
                counters: '高墙(The Wall)盲注4倍分数，窃贼流虽然多出牌但单手伤害可能不够 | 猩红之心(Crimson Heart)每手随机禁用1个Joker',
                compatibleWith: [
                    { id: 'economy_build', note: '延迟满足每剩余弃牌+$2，窃贼让收益最大化，赚的钱转给公牛/提靴带' },
                    { id: 'swashbuckler_build', note: '窃贼+3出牌次数更快累积侠盗倍率，延迟满足赚钱买更多小丑抬售价' }
                ]
            },
            {
                id: 'swashbuckler_build',
                name: '🦝 侠盗流',
                difficulty: '⭐⭐ 中等',
                desc: '侠盗将所有小丑总售价转化为倍率，礼品卡和鸡蛋持续抬售价',
                detail: '侠盗把其他小丑的总售价变成自己的+倍率。礼品卡每回合给所有小丑和消耗品售价+$1，鸡蛋每回合自身售价+$3，两者都能持续抬高侠盗的倍率。仪式匕首摧毁高售价小丑时获售价×2的永久倍率，与侠盗互补。',
                coreCards: ['j_swashbuckler', 'j_gift_card', 'j_egg'],
                supportCards: ['j_ceremonial', 'j_campfire', 'j_riff_raff'],
                tips: '礼品卡+鸡蛋是侠盗流的双引擎——礼品卡每回合给全队涨售价，鸡蛋单卡每回合+$3售价。5张小丑+礼品卡=每回合侠盗+5倍率，加上鸡蛋更猛。后期侠盗倍率轻松30+',
                counters: '高墙(The Wall)盲注4倍分数，侠盗流+倍率成长需要时间 | 绿叶(Verdant Leaf)所有牌被削弱直到卖1个Joker，卖掉侠盗很伤',
                compatibleWith: [
                    { id: 'sell_build', note: '篝火每出售+×0.25，乌合之众每盲注补2张小丑可出售，与侠盗售价体系双重收益' },
                    { id: 'burglar_build', note: '窃贼+3出牌次数加速出牌，延迟满足赚钱买更多小丑抬高侠盗售价倍率' },
                    { id: 'destroy_build', note: '仪式匕首摧毁右侧高售价小丑=巨额永久倍率，礼品卡抬高售价让匕首收益更大' }
                ]
            },
            {
                id: 'tarot_build',
                name: '🔮 塔罗流',
                difficulty: '⭐⭐ 中等',
                desc: '大量产出塔罗牌，算命先生将每张塔罗牌转化为倍率',
                detail: '卡牌术士每盲注创造塔罗牌，幻觉开包1/2概率获得塔罗牌，流浪者低价时产生塔罗牌。算命先生每张使用过的塔罗牌+1倍率，后期倍率非常可观。',
                coreCards: ['j_cartomancer', 'j_fortune_teller', 'j_vagabond'],
                supportCards: ['j_hallucination', 'j_8ball', 'j_superposition', 'j_perkeo'],
                tips: '算命先生的倍率随游戏进行不断累积，是塔罗流的核心产出卡',
                counters: '高墙(The Wall)盲注4倍分数，塔罗流前期积累慢 | 猩红之心(Crimson Heart)每手随机禁用1个Joker',
                compatibleWith: [
                    { id: 'planet_build', note: '塔罗牌和行星牌都是消耗品体系，帕奇欧可以同时为两者产出' },
                    { id: 'augment_build', note: '塔罗牌(皇后/皇帝)给牌加增强，供吸血鬼吸收，双重收益' },
                    { id: 'fibonacci_build', note: '8号球打出8时给塔罗牌，与占卜师+8倍率双触发' },
                    { id: 'add_card_build', note: '占卜师配合全息影像，使用塔罗牌的同时全息间接获益' }
                ]
            },
            {
                id: 'planet_build',
                name: '🪐 行星流',
                difficulty: '⭐⭐ 中等',
                desc: '利用行星牌升级牌型，星座将行星转化为倍率',
                detail: '天文学家让商店行星牌免费，星座每使用行星牌+0.1X倍率。配合卫星获取独特行星收入。太空小丑有1/4概率自动升级牌型。',
                coreCards: ['j_astronomer', 'j_constellation', 'j_satellite'],
                supportCards: ['j_space', 'j_supernova', 'j_showman'],
                tips: '天文学家是行星流的引擎——免费行星意味着每次商店都能升级牌型+增加星座倍率',
                counters: '高墙(The Wall)盲注4倍分数 | 手臂(The Arm)打出牌型等级-1，行星牌升的级会被扣回',
                compatibleWith: [
                    { id: 'tarot_build', note: '塔罗和行星都是消耗品体系，帕奇欧可以同时复制两者' },
                    { id: 'economy_build', note: '卫星赚的钱可以喂给公牛/提靴带，天文学家省下的钱用于其他购买' },
                    { id: 'add_card_build', note: '星座配合全息影像，使用行星牌+X0.1的同时全息也在叠加' }
                ]
            },
            {
                id: 'destroy_build',
                name: '💥 摧毁流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '通过摧毁卡牌/Joker获得永久加成',
                detail: '玻璃小丑每摧毁玻璃卡+X0.75，正义塔罗创造玻璃牌供摧毁，愚者可复制正义形成循环。仪式匕首击败Boss时摧毁右侧Joker获得永久倍率。疯狂+抽象也是经典摧毁组合。注意：吸血鬼的"移除增强"不等于摧毁，不会触发玻璃小丑。',
                coreCards: ['j_glass', 'j_ceremonial', 'j_madness', 'j_canio'],
                supportCards: ['j_abstract', 'j_pareidolia', 't_justice', 't_fool'],
                tips: '玻璃卡+正义塔罗牌是核心循环——正义创造玻璃卡，玻璃卡摧毁时玻璃小丑增加倍率，愚者可复制上次使用的正义',
                counters: '高墙(The Wall)盲注4倍分数 | 针(The Needle)只能出1手，摧毁触发机会少',
                compatibleWith: [
                    { id: 'face_build', note: '卡尼奥摧毁人头牌+X1，配合幻视(所有牌变人头牌)持续叠倍率' },
                    { id: 'tarot_build', note: '正义/愚者都是塔罗牌，占卜师可以从中获得额外倍率' },
                    { id: 'remove_card_build', note: '摧毁牌的同时减少牌组，侵蚀每少1张+4倍率，双重收益' }
                ]
            },
            {
                id: 'copy_build',
                name: '📋 复制流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '蓝图和头脑风暴复制最强Joker效果',
                detail: '蓝图复制右侧Joker效果，头脑风暴复制最左侧Joker效果。将它们放在关键位置可以让核心Joker效果翻倍甚至三倍。',
                coreCards: ['j_blueprint', 'j_brainstorm'],
                supportCards: ['j_showman', 'j_invisible', 'j_dna'],
                tips: '蓝图复制右侧、头脑风暴复制最左——合理安排Joker顺序让最强效果被复制',
                counters: '琥珀橡果(Amber Acorn)Joker翻转并随机排列，蓝图/头脑风暴位置错乱 | 猩红之心(Crimson Heart)每手随机禁用1个Joker',
                compatibleWith: [
                    { id: 'kq_build', note: '复制特里布莱的K/Q×2，让倍率直接翻倍甚至三倍' },
                    { id: 'steel_build', note: '复制钢铁小丑的X倍率效果，钢铁牌越多收益越恐怖' },
                    { id: 'chance_build', note: '复制六六大顺的概率翻倍？不，概率不叠加，但可以复制血石/招财猫的效果' }
                ]
            },
            {
                id: 'sell_build',
                name: '🔥 出售流',
                difficulty: '⭐⭐ 中等',
                desc: '通过出售卡牌获得增益，篝火每出售+X0.25',
                detail: '篝火每出售一张卡+X0.25倍率(Boss重置)，礼品卡增加出售值，零糖可乐出售创造免费双倍标签。每回合买卖循环快速累积倍率。金柱凭证"租赁"让小丑$1买入$1卖出，相当于免费喂篝火+×0.25！',
                coreCards: ['j_campfire', 'j_gift_card', 'j_diet_cola'],
                supportCards: ['j_swashbuckler', 'j_riff_raff', 'j_ceremonial'],
                tips: '篝火在Boss重置前要尽量多出售卡牌累积倍率，乌合之众每盲注创造2个普通Joker可以出售。进阶：拿到金柱"租赁"后，商店小丑$1买$1卖，相当于每张免费+×0.25倍率，疯狂循环',
                counters: '篝火Boss后重置是内置克制——每次Boss后倍率清零，必须在Boss前最大化 | 绿叶(Verdant Leaf)要卖1个Joker才能解除',
                compatibleWith: [
                    { id: 'economy_build', note: '出售赚的钱可以喂给公牛/提靴带，买卖循环=倍率+经济双收' },
                    { id: 'destroy_build', note: '仪式匕首摧毁Joker获得倍率，与出售流的"牺牲换收益"理念一致' }
                ]
            },
            {
                id: 'chance_build',
                name: '🎲 概率流',
                difficulty: '⭐⭐ 中等',
                desc: '六六大顺翻倍所有概率，让概率型卡牌更稳定',
                detail: '六六大顺让所有概率翻倍：血石1/2→1/1(必触发)、太空1/4→1/2、招财猫触发率翻倍。配合幸运牌和概率型Joker效果极佳。',
                coreCards: ['j_oops_6', 'j_bloodstone', 'j_lucky_cat'],
                supportCards: ['j_space', 'j_gros_michel', 'j_ancient', 't_magician'],
                tips: '六六大顺是概率流的基石——血石从50%变100%触发，太空从25%变50%，简直是作弊。注意大麦克香蕉灭绝后会变成卡文迪什(X3)更强',
                counters: '燧石(The Flint)基础值减半让概率流收益打折 | 猩红之心(Crimson Heart)每手随机禁用Joker可能禁到六六大顺',
                compatibleWith: [
                    { id: 'flush_build', note: '血石对红桃牌触发X1.5，打同花多红桃牌每张都可能触发' },
                    { id: 'planet_build', note: '太空小丑概率翻倍后1/2升级牌型，与星座的X倍率叠加更快' },
                    { id: 'tarot_build', note: '8号球概率翻倍后1/2给塔罗牌，名片翻倍后必给$2' }
                ]
            },
            {
                id: 'augment_build',
                name: '🧛 增强吸收流',
                difficulty: '⭐⭐ 中等',
                desc: '吸血鬼吸收增强牌效果叠加X倍率，迈达斯面具源源不断供给增强牌',
                detail: '吸血鬼打出增强牌时移除增强效果+X0.1倍率。迈达斯面具将打出的人头牌变为金卡（增强牌），源源不断供吸血鬼吸收叠X倍率。通过塔罗牌（皇后/皇帝等）不断给牌附增强效果进一步提高效率。',
                coreCards: ['j_vampire', 'j_midas'],
                supportCards: ['t_empress', 't_emperor', 'j_hallucination', 'j_cartomancer', 'j_driver_license'],
                tips: '迈达斯面具是增强吸收流的最佳搭档——每次打出人头牌都会变金卡，吸血鬼自动吸收叠X倍率。注意驾驶执照需要16张增强牌才X3，与吸血鬼路线冲突，选一条路走到底。塔罗牌产出越多，增强供应越稳定',
                counters: '植物(The Plant)人头牌被削弱，面具产金卡依赖人头牌 | 绿叶(Verdant Leaf)所有牌被削弱直到卖Joker',
                compatibleWith: [
                    { id: 'face_build', note: '迈达斯面具将人头牌变金卡(增强牌)，源源不断供吸血鬼吸收' },
                    { id: 'tarot_build', note: '塔罗牌(皇后/皇帝)给牌加增强，占卜师同时获得倍率，一举两得' }
                ]
            },
            {
                id: 'skip_build',
                name: '⏭️ 跳过流',
                difficulty: '⭐⭐ 中等',
                desc: '跳过体系积累倍率，回溯跳盲注+X倍率，红牌跳补充包+倍率（两者触发条件不同）',
                detail: '回溯每跳过盲注+X0.25倍率，红牌每在补充包中跳过+3倍率。注意：两者触发条件不同——回溯要跳盲注，红牌要在补充包里按跳过，正常情况下无法同时触发。跳过小盲/大盲只打Boss快速积累回溯倍率；商店补充包点跳过给红牌叠倍率。',
                coreCards: ['j_throwback', 'j_red'],
                supportCards: ['j_mr_bones', 'j_acrobat', 'j_stencil'],
                tips: '跳过小盲和大盲，只打Boss。骷髅先生防止意外死亡，杂技演员最后一手X3保底',
                counters: '高墙(The Wall)盲注4倍分数，跳过流只打Boss但Boss分数更高 | 紫瓶(Violet Vessel)6倍巨大盲注',
                compatibleWith: [
                    { id: 'economy_build', note: '跳过盲注少打回合但省时间，经济流帮你在少量回合中攒够钱' }
                ]
            },
            {
                id: 'steel_build',
                name: '🛡️ 钢铁牌流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '用战车塔罗创造钢铁牌，手牌中钢铁牌提供持续X1.5倍率',
                detail: '钢铁牌留在手牌中时每张提供×1.5倍率，不需要打出即可生效。钢铁小丑每有1张钢铁牌+×0.2倍率。哑剧演员让手牌中钢铁牌的×1.5额外触发1次（变为×2.25）。配合男爵(K×1.5)和射月(Q+13)，手牌中的K/Q既触发钢铁又触发皇室加成，倍率叠乘极其恐怖。',
                coreCards: ['j_steel', 'j_mime', 't_chariot'],
                supportCards: ['j_baron', 'j_shoot_moon', 'j_certificate', 'j_hanging_chad', 'j_pareidolia'],
                tips: '钢铁牌的核心优势是"不打出就能加倍率"——用战车把手牌中不需要打出的牌变钢铁牌，配合哑剧演员让每张钢铁牌的×1.5额外触发1次。手牌全钢铁时倍率指数级增长',
                counters: '钩子(The Hook)每手弃2张手牌，可能弃掉手中钢铁牌 | 枷锁(The Manacle)手牌-1减少钢铁牌留手数',
                compatibleWith: [
                    { id: 'kq_build', note: '手牌中的K/Q变钢铁牌后，钢铁×1.5+男爵×1.5+射月+13多重叠加' },
                    { id: 'face_build', note: '钢铁牌留手牌触发倍率，人头牌加成在打出时触发，两者互补' },
                    { id: 'flush_build', note: '钢铁牌留手牌不占出牌位，同花凑牌不受影响' },
                    { id: 'copy_build', note: '蓝图/头脑风暴复制钢铁小丑的X倍率，钢铁牌越多收益越恐怖' },
                    { id: 'add_card_build', note: '大理石小丑加入的石头牌可变钢铁牌，加牌+钢铁双重收益' }
                ]
            },
            {
                id: 'add_card_build',
                name: '➕ 加牌流',
                difficulty: '⭐⭐ 中等',
                desc: '持续往牌组添加卡牌，全息影像每加1张+×0.25倍率',
                detail: '全息影像每往牌组添加1张牌就+×0.25倍率，是加牌流的核心产出。DNA每回合首次出单牌复制加入牌组，证书每选盲注加1张蜡封牌，大理石小丑每选盲注加1张石头牌。配合占卜师/星座，使用塔罗牌/行星牌也能间接触发加牌效果。后期全息倍率滚雪球极其恐怖。',
                coreCards: ['j_hologram', 'j_dna', 'j_certificate', 'j_marble'],
                supportCards: ['j_fortune_teller', 'j_constellation', 'j_stone', 'j_half'],
                tips: '全息影像是核心引擎，DNA是最佳搭档——每回合出单牌就+×0.25。证书和大理石提供被动稳定加牌。注意牌组膨胀后抽牌稳定性会下降',
                counters: '高墙(The Wall)盲注4倍分数，加牌流需要时间积累 | 紫瓶(Violet Vessel)6倍巨大盲注',
                compatibleWith: [
                    { id: 'tarot_build', note: '塔罗牌使用后触发占卜师+倍率，部分塔罗牌还能间接加牌' },
                    { id: 'planet_build', note: '行星牌使用后触发星座+X倍率，与全息的X倍率双重叠乘' },
                    { id: 'steel_build', note: '大理石加入的石头牌可以变钢铁牌，手牌中钢铁×1.5与全息叠乘' }
                ]
            },
            {
                id: 'remove_card_build',
                name: '➖ 减牌流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '通过摧毁/移除卡牌缩减牌组，侵蚀每少1张+4倍率',
                detail: '侵蚀的核心机制是牌组每比初始少1张就+4倍率。倒吊人每次移除2张牌=+8倍率，火祭一次摧毁5张=+20倍率且获$20。第六感摧毁6获得幻灵牌同时减少牌组。卡尼奥在人头牌被摧毁时叠×倍率，与侵蚀的+倍率形成双重收益。牌组越精简，抽牌越稳定，倍率越高。',
                coreCards: ['j_erosion', 'j_canio', 'j_sixth_sense'],
                supportCards: ['j_glass', 'j_trading', 'j_pareidolia'],
                tips: '侵蚀+火祭是爆发组合——一次火祭=+20倍率+$20。倒吊人则是稳定的每回合减牌手段。牌组压缩到极限后抽牌极其稳定，配合卡尼奥倍率叠乘恐怖',
                counters: '灵媒(The Psychic)必须打5张，减牌后牌组太少可能凑不够5张 | 柱子(The Pillar)打过的牌被削弱，减牌后选择更少',
                compatibleWith: [
                    { id: 'destroy_build', note: '摧毁流的玻璃小丑/仪式匕首在摧毁牌的同时也减少牌组，与侵蚀双重收益' },
                    { id: 'economy_build', note: '火祭摧毁5张牌获$20，减牌的同时赚大钱，喂给公牛/提靴带' },
                    { id: 'face_build', note: '卡尼奥+幻视让所有被摧毁的牌都算人头牌，每次摧毁都叠×倍率' }
                ]
            }
        ];
    }
    
    renderRecommended() {
        // 渲染构筑思路
        this.renderBuildStrategies();
        // 渲染推荐卡牌分类Tab和卡牌
        this.renderRecommendedTabs();
        // 渲染 Tier List
        this.renderTierList();
        // 重新初始化滚动入场动画（动态内容）
        if (typeof scrollObserver !== 'undefined') {
            document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => scrollObserver.observe(el));
        }
    }
    
    renderBuildStrategies() {
        const container = document.getElementById('build-strategies');
        const strategies = this.getBuildStrategies();
        
        container.innerHTML = strategies.map(s => {
            const sName = i18n.strategyT(s.id, 'name') || s.name;
            const sDifficulty = i18n.strategyT(s.id, 'difficulty') || s.difficulty;
            const sDesc = i18n.strategyT(s.id, 'desc') || s.desc;
            const sDetail = i18n.strategyT(s.id, 'detail') || s.detail;
            const sTips = i18n.strategyT(s.id, 'tips') || s.tips;
            
            const coreNames = s.coreCards.map(id => {
                const c = this.allCards.find(c => c.id === id);
                return c ? (i18n.cardT(c.id, 'name') || c.name) : '';
            }).filter(Boolean);
            
            // 渲染兼容性提示
            let compatHtml = '';
            if (s.compatibleWith && s.compatibleWith.length > 0) {
                const compatItems = s.compatibleWith.map(comp => {
                    const target = strategies.find(st => st.id === comp.id);
                    const targetName = target ? (i18n.strategyT(target.id, 'name') || target.name) : comp.id;
                    return `<div class="compat-item"><span class="compat-target">${targetName}</span><span class="compat-note">${comp.note}</span></div>`;
                }).join('');
                compatHtml = `
                    <div class="strategy-compat">
                        <span class="compat-label">${i18n.t('guide.compatLabel')}</span>
                        <div class="compat-list">${compatItems}</div>
                    </div>
                `;
            }
            
            return `
                <div class="guide-card strategy-card scroll-reveal" data-strategy="${s.id}">
                    <div class="strategy-header">
                        <h4>${sName}</h4>
                        <span class="strategy-difficulty">${sDifficulty}</span>
                    </div>
                    <p>${sDesc}</p>
                    <p class="strategy-detail">${sDetail}</p>
                    <div class="strategy-core">
                        <span class="core-label">${i18n.t('guide.coreCards')}</span>
                        <span class="core-cards">${coreNames.join('、')}</span>
                    </div>
                    ${compatHtml}
                    <p class="strategy-tip">💡 ${sTips}</p>
                    ${s.counters ? '<p class="strategy-counter">⚠️ <strong>Boss克制：</strong>' + s.counters + '</p>' : ''}
                    <button class="btn btn-small btn-try" onclick="app.tryBuild('${s.id}')">${i18n.t('guide.tryBuild')}</button>
                </div>
            `;
        }).join('');
    }
    
    renderRecommendedTabs() {
        const tabsContainer = document.getElementById('recommended-tabs');
        const cardsContainer = document.getElementById('recommended-cards');
        
        const categories = [
            { id: 'all_star', name: i18n.t('guide.recCategories.all_star'), cards: ['j_blueprint', 'j_brainstorm', 'j_triboulet', 'j_perkeo', 'j_hologram', 'j_baron', 'j_yorick', 'j_hanging_chad', 'j_cavendish', 'j_canio'] },
            { id: 'early_game', name: i18n.t('guide.recCategories.early_game'), cards: ['j_joker', 'j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_jolly', 'j_sly', 'j_crazy', 'j_golden', 'j_ice_cream', 'j_popcorn'] },
            { id: 'scaling', name: i18n.t('guide.recCategories.scaling'), cards: ['j_ride_bus', 'j_runner', 'j_green', 'j_square', 'j_castle', 'j_flash', 'j_red', 'j_throwback', 'j_hiker', 'j_constellation', 'j_supernova', 'j_campfire'] },
            { id: 'xmult', name: i18n.t('guide.recCategories.xmult'), cards: ['j_baron', 'j_cavendish', 'j_loyalty', 'j_ramen', 'j_acrobat', 'j_card_sharp', 'j_ancient', 'j_obelisk', 'j_stencil', 'j_driver_license', 'j_seeing_double'] },
            { id: 'economy_picks', name: i18n.t('guide.recCategories.economy_picks'), cards: ['j_golden', 'j_to_moon', 'j_rocket', 'j_egg', 'j_cloud9', 'j_bull', 'j_bootstraps', 'j_delayed', 'j_trading', 'j_matador'] },
            { id: 'utility', name: i18n.t('guide.recCategories.utility'), cards: ['j_four_fingers', 'j_shortcut', 'j_smeared', 'j_pareidolia', 'j_oops_6', 'j_showman', 'j_chaos', 'j_mr_bones', 'j_burglar', 'j_splash'] }
        ];
        
        // 渲染 Tab 按钮
        tabsContainer.innerHTML = categories.map((cat, i) => 
            `<button class="rec-tab ${i === 0 ? 'active' : ''}" data-rec-cat="${cat.id}" onclick="app.switchRecTab('${cat.id}')">${cat.name}</button>`
        ).join('');
        
        // 默认展示第一个分类
        this.currentRecCategory = categories[0].id;
        this.recCategories = categories;
        this.renderRecCards(categories[0].id);
    }
    
    switchRecTab(catId) {
        document.querySelectorAll('.rec-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-rec-cat="${catId}"]`).classList.add('active');
        this.currentRecCategory = catId;
        this.renderRecCards(catId);
    }
    
    renderRecCards(catId) {
        const container = document.getElementById('recommended-cards');
        const category = this.recCategories.find(c => c.id === catId);
        if (!category) return;
        
        const cards = category.cards.map(id => this.allCards.find(c => c.id === id)).filter(Boolean);
        container.innerHTML = cards.map(card => this.createCardHTML(card)).join('');
    }
    
    // 试试构筑 - 将核心卡牌加入牌组匹配
    tryBuild(strategyId) {
        const strategies = this.getBuildStrategies();
        const strategy = strategies.find(s => s.id === strategyId);
        if (!strategy) return;
        
        // 清空当前卡组
        this.selectedCards = [];
        
        // 添加核心卡牌
        const allCoreCards = [...strategy.coreCards, ...strategy.supportCards];
        allCoreCards.forEach(cardId => {
            const card = this.allCards.find(c => c.id === cardId);
            if (card && !this.selectedCards.find(s => s.id === card.id)) {
                this.selectedCards.push(card);
            }
        });
        
        this.renderSelectedCards();
        this.renderPicker();
        this.updateRecommendations();
        this.switchTab('matcher');
        // 滚动到牌组匹配页面顶端
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============ Tier List ============
    getTierListData(mode) {
        const tierMeta = {
            '夯': { label: '夯', color: '#ff4757', desc: '版本之子，无脑拿' },
            '顶级': { label: '顶级', color: '#ffa502', desc: '极强，核心构筑基石' },
            '人上人': { label: '人上人', color: '#ffd700', desc: '强力，大部分构筑里表现优秀' },
            'NPC': { label: 'NPC', color: '#2ed573', desc: '可用，有合适的构筑能发挥' },
            '拉': { label: '拉', color: '#70a1ff', desc: '偏弱/场景局限' },
            '拉完了': { label: '拉完了', color: '#a0a0a0', desc: '实在没牌了才会选' }
        };
        const cardsByMode = {
            early: {
                '夯': ['j_blueprint', 'j_brainstorm', 'j_triboulet', 'j_hologram', 'j_hanging_chad', 'j_cavendish', 'j_canio'],
                '顶级': ['j_perkeo', 'j_yorick', 'j_duo', 'j_tribe', 'j_blackboard', 'j_driver_license', 'j_obelisk', 'j_vampire', 'j_card_sharp', 'j_seeing_double', 'j_invisible', 'j_burnt', 'j_hack', 'j_cartomancer', 'j_stuntman', 'j_shoot_moon', 'j_swashbuckler', 'j_riff_raff', 'j_constellation', 'j_mime', 'j_throwback', 'j_fortune_teller', 'j_fibonacci', 'j_chicot', 'j_wee', 'j_photograph', 'j_baseball', 'j_misprint', 'j_bootstraps', 'j_spare_trousers', 'j_gros_michel', 'j_abstract', 'j_castle'],
                '人上人': ['j_baron', 'j_dna', 'j_ancient', 'j_steel', 'j_dusk', 'j_acrobat', 'j_madness', 'j_ramen', 'j_certificate', 'j_erosion', 'j_delayed', 'j_rocket', 'j_to_moon', 'j_bull', 'j_sock', 'j_ceremonial', 'j_flower_pot', 'j_stencil', 'j_trio', 'j_family', 'j_order', 'j_smeared', 'j_mr_bones', 'j_mad', 'j_jolly', 'j_droll', 'j_four_fingers', 'j_shortcut', 'j_golden', 'j_half'],
                'NPC': ['j_hit_road', 'j_merry_andy', 'j_midas', 'j_astronomer', 'j_loyalty', 'j_campfire', 'j_clever', 'j_sly', 'j_bloodstone', 'j_arrowhead', 'j_onyx', 'j_pareidolia', 'j_egg', 'j_cloud9', 'j_splash', 'j_burglar', 'j_runner', 'j_flash', 'j_ride_bus', 'j_hallucination', 'j_marble', 'j_mystic_summit', 'j_raised_fist', 'j_even_steven', 'j_green', 'j_red', 'j_vagabond', 'j_square', 'j_supernova', 'j_scary_face', 'j_smiley', 'j_mail_in'],
                '拉': ['j_glass', 'j_crazy', 'j_rough_gem', 'j_showman', 'j_chaos', 'j_turtle_bean', 'j_drunkard', 'j_gift_card', 'j_satellite', 'j_seltzer', 'j_walkie', 'j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_zany', 'j_devious', 'j_crafty', 'j_banner', 'j_odd_todd', 'j_scholar', 'j_hiker', 'j_space', 'j_stone', 'j_blue', 'j_credit_card', 'j_popcorn', 'j_ice_cream', 'j_juggler', 'j_troubadour', 'j_todo', 'j_golden_ticket', 'j_diet_cola'],
                '拉完了': ['j_lucky_cat', 'j_joker', 'j_trading', 'j_matador', 'j_oops_6', 'j_luchador', 'j_business_card', 'j_faceless', 'j_idol', 'j_wily', 'j_superposition', 'j_sixth_sense', 'j_seance', 'j_8ball', 'j_reserved']
            },
            endless: {
                '夯': ['j_blueprint', 'j_brainstorm', 'j_triboulet', 'j_perkeo', 'j_hologram', 'j_baron', 'j_hanging_chad', 'j_cavendish', 'j_mime', 'j_wee'],
                '顶级': ['j_canio', 'j_blackboard', 'j_driver_license', 'j_vampire', 'j_dna', 'j_card_sharp', 'j_invisible', 'j_swashbuckler', 'j_constellation', 'j_throwback', 'j_fortune_teller', 'j_fibonacci', 'j_photograph', 'j_baseball', 'j_spare_trousers', 'j_trio', 'j_family'],
                '人上人': ['j_yorick', 'j_duo', 'j_tribe', 'j_obelisk', 'j_seeing_double', 'j_steel', 'j_burnt', 'j_hack', 'j_stuntman', 'j_shoot_moon', 'j_chicot', 'j_madness', 'j_rocket', 'j_to_moon', 'j_misprint', 'j_bootstraps', 'j_sock', 'j_flower_pot', 'j_stencil', 'j_order', 'j_gros_michel', 'j_smeared', 'j_abstract', 'j_castle', 'j_droll', 'j_four_fingers', 'j_shortcut'],
                'NPC': ['j_ancient', 'j_dusk', 'j_cartomancer', 'j_riff_raff', 'j_acrobat', 'j_ramen', 'j_certificate', 'j_erosion', 'j_delayed', 'j_bull', 'j_hit_road', 'j_merry_andy', 'j_midas', 'j_ceremonial', 'j_astronomer', 'j_loyalty', 'j_campfire', 'j_mr_bones', 'j_mad', 'j_jolly', 'j_bloodstone', 'j_arrowhead', 'j_onyx', 'j_pareidolia', 'j_egg', 'j_splash', 'j_burglar', 'j_runner', 'j_flash', 'j_ride_bus', 'j_hallucination', 'j_half', 'j_marble', 'j_mystic_summit', 'j_raised_fist', 'j_even_steven', 'j_green', 'j_red', 'j_vagabond', 'j_square', 'j_supernova', 'j_scary_face', 'j_smiley', 'j_mail_in'],
                '拉': ['j_clever', 'j_sly', 'j_crazy', 'j_rough_gem', 'j_showman', 'j_golden', 'j_cloud9', 'j_chaos', 'j_turtle_bean', 'j_drunkard', 'j_gift_card', 'j_satellite', 'j_seltzer', 'j_walkie', 'j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_zany', 'j_devious', 'j_crafty', 'j_banner', 'j_odd_todd', 'j_scholar', 'j_hiker', 'j_space', 'j_stone', 'j_blue', 'j_credit_card', 'j_popcorn', 'j_ice_cream', 'j_juggler', 'j_troubadour', 'j_todo', 'j_golden_ticket', 'j_diet_cola'],
                '拉完了': ['j_lucky_cat', 'j_glass', 'j_joker', 'j_trading', 'j_matador', 'j_oops_6', 'j_luchador', 'j_business_card', 'j_faceless', 'j_idol', 'j_wily', 'j_superposition', 'j_sixth_sense', 'j_seance', 'j_8ball', 'j_reserved']
            }
        };
        const m = mode || this.currentTierMode || 'early';
        const modeCards = cardsByMode[m];
        const result = {};
        for (const tier of ['夯', '顶级', '人上人', 'NPC', '拉', '拉完了']) {
            result[tier] = { ...tierMeta[tier], cards: modeCards[tier] };
        }
        return result;
    }

    switchTierMode(mode) {
        this.currentTierMode = mode;
        this.renderTierList(this.currentTierFilter || 'all');
    }

    renderTierList(filter) {
        const container = document.getElementById('tierlist-container');
        const filtersContainer = document.getElementById('tierlist-filters');
        if (!container) return;

        if (!this.currentTierMode) this.currentTierMode = 'early';
        const currentMode = this.currentTierMode;
        const tiers = this.getTierListData(currentMode);
        const filters = [
            { id: 'all', name: '全部' },
            { id: '夯', name: '夯' },
            { id: '顶级', name: '顶级' },
            { id: '人上人', name: '人上人' },
            { id: 'NPC', name: 'NPC' },
            { id: '拉', name: '拉' },
            { id: '拉完了', name: '拉完了' }
        ];
        const activeFilter = filter || 'all';
        this.currentTierFilter = activeFilter;

        // 渲染模式切换 Tab + 筛选按钮
        const modeTabsHtml = `
            <div class="tier-mode-tabs">
                <button class="tier-mode-btn ${currentMode === 'early' ? 'active' : ''}" onclick="app.switchTierMode('early')">
                    🎯 前八轮 (Ante 1-8)
                </button>
                <button class="tier-mode-btn ${currentMode === 'endless' ? 'active' : ''}" onclick="app.switchTierMode('endless')">
                    ♾️ 无限轮 (Endless)
                </button>
            </div>
        `;
        const filterBtnsHtml = filters.map(f =>
            `<button class="tier-filter-btn ${f.id === activeFilter ? 'active' : ''}" 
                     style="${f.id !== 'all' && tiers[f.id] ? 'border-color:'+tiers[f.id].color+';' : ''}"
                     onclick="app.renderTierList('${f.id}')">${f.name}</button>`
        ).join('');
        filtersContainer.innerHTML = modeTabsHtml + `<div class="tier-filter-row">${filterBtnsHtml}</div>`;

        // 渲染 Tier 行
        const tiersToShow = activeFilter === 'all' ? Object.keys(tiers) : [activeFilter];
        
        container.innerHTML = tiersToShow.map(tierKey => {
            const tier = tiers[tierKey];
            if (!tier) return '';
            const cards = tier.cards.map(id => this.allCards.find(c => c.id === id)).filter(Boolean);
            
            return `
                <div class="tier-row">
                    <div class="tier-label" style="background: ${tier.color}">
                        <span class="tier-letter">${tier.label}</span>
                        <span class="tier-desc">${tier.desc}</span>
                    </div>
                    <div class="tier-cards">
                        ${cards.map(card => {
                            const desc = (card.description || '').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
                            const rarity = card.rarity || '';
                            const effectParts = [];
                            if (card.effects) {
                                if (card.effects.xmult) effectParts.push('×' + (typeof card.effects.xmult === 'number' ? card.effects.xmult : card.effects.xmult) + ' 倍率');
                                if (card.effects.mult) effectParts.push('+' + card.effects.mult + ' 倍率');
                                if (card.effects.chips) effectParts.push('+' + card.effects.chips + ' 筹码');
                            }
                            const effectStr = effectParts.join(' | ');
                            return `
                            <div class="tier-card" 
                                 onclick="app.tierCardClick('${card.id}')"
                                 onmouseenter="app.showTierTooltip(event, '${card.id}')"
                                 onmouseleave="app.hideTierTooltip()">
                                <img src="${card.image}" alt="${card.name}" loading="lazy" width="60" height="84">
                                <span class="tier-card-name">${card.name}</span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Tier List 卡牌悬停浮窗
    showTierTooltip(event, cardId) {
        const card = this.allCards.find(c => c.id === cardId);
        if (!card) return;

        let tooltip = document.getElementById('tier-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tier-tooltip';
            tooltip.className = 'tier-tooltip';
            document.body.appendChild(tooltip);
        }

        // 稀有度中文映射和颜色
        const rarityMap = {
            common: { name: '普通', color: '#2ed573' },
            uncommon: { name: '罕见', color: '#1e90ff' },
            rare: { name: '稀有', color: '#ffa502' },
            legendary: { name: '传说', color: '#ff4757' }
        };
        const rInfo = rarityMap[card.rarity] || { name: card.rarity, color: '#999' };

        // 效果标签 — 值翻译映射
        const effectValueMap = {
            // 花色
            hearts: '红心', spades: '黑桃', clubs: '梅花', diamonds: '方块',
            // 牌面
            king: 'K', queen: 'Q', jack: 'J', king_queen: 'K/Q', face: '人头牌',
            // 触发条件
            slot: '空槽位', planet: '行星牌', tarot: '塔罗牌', steel: '钢铁牌',
            stone: '石头牌', glass: '玻璃牌', gold: '金牌', lucky: '幸运',
            rare_joker: '稀有小丑', changing: '随机变化',
            // 行为
            discard_j: '弃掉J', destroy_face: '销毁人头牌', destroy_right: '销毁右侧',
            card_added: '添加卡牌', augment: '消耗增强', sell: '出售', selling: '出售',
            skip: '跳过商店', discard: '弃牌', play: '出牌', reroll: '重掷商店',
            hand_used: '已出牌型', consecutive: '连续', discard_count: '弃牌计数',
            // 经济
            interest: '利息', nine: '含9', money: '持有金币',
            face_discard: '弃人头牌', face_hand: '打人头牌',
            rank_discard: '弃指定点数', single_discard: '首次弃牌',
            boss_trigger: '触发Boss', unique_planet: '不同行星牌',
            suit_discard: '弃指定花色', sell_value: '出售价值',
            // 位置
            first: '首张', last: '末张', lowest: '最低点数',
            // 其他
            deck_remaining: '牌堆剩余', permanent_5: '永久+5',
            lower_cards: '牌堆不满', uncommon_hand: '未打牌型',
            random_23: '随机', random: '随机', two_pair: '两对',
            // special 值
            copy: '复制', copy_left: '复制左侧', copy_right: '复制右侧',
            negative_copy: '负片复制', delayed_copy: '延迟复制',
            create_joker: '生成小丑', create_tarot: '生成塔罗',
            disable_boss: '禁用Boss', disable_boss_all: '禁用全部Boss',
            double: '翻倍', double_chance: '双倍概率',
            duplicates: '允许重复', dusk: '黄昏触发',
            first_card: '首张牌增强', four_fingers: '四指', free_planet: '免费行星牌',
            hack: '连续触发', mime: '模仿',
            reset: '重置', reset_face: '重置人头牌',
            seal: '封印', soul: '灵魂',
            spectral: '幽灵牌', splash: '全牌计分',
            straight_gap: '顺子跳牌', suit_combine: '花色混合', survive: '存活',
            tarot_chance: '塔罗概率', upgrade: '升级', upgrade_discard: '弃牌升级',
            credit: '赊账'
        };
        const tv = (v) => typeof v === 'string' ? (effectValueMap[v] || v) : v;

        const effectTags = [];
        if (card.effects) {
            if (card.effects.xmult) {
                const v = card.effects.xmult;
                if (typeof v === 'number') {
                    effectTags.push(`<span class="tt-tag tt-xmult">×${v} 倍率</span>`);
                } else {
                    effectTags.push(`<span class="tt-tag tt-xmult">×倍率(${tv(v)})</span>`);
                }
            }
            if (card.effects.mult) {
                const v = card.effects.mult;
                if (typeof v === 'number') {
                    effectTags.push(`<span class="tt-tag tt-mult">+${v} 倍率</span>`);
                } else {
                    effectTags.push(`<span class="tt-tag tt-mult">+倍率(${tv(v)})</span>`);
                }
            }
            if (card.effects.chips) {
                const v = card.effects.chips;
                if (typeof v === 'number') {
                    effectTags.push(`<span class="tt-tag tt-chips">+${v} 筹码</span>`);
                } else {
                    effectTags.push(`<span class="tt-tag tt-chips">+筹码(${tv(v)})</span>`);
                }
            }
            if (card.effects.money) effectTags.push(`<span class="tt-tag tt-money">+$${card.effects.money}</span>`);
            if (card.effects.special) {
                effectTags.push(`<span class="tt-tag tt-special">${tv(card.effects.special)}</span>`);
            }
        }

        // 协同提示
        const synergyCount = (card.synergies || []).length;
        const synergyLine = synergyCount > 0
            ? `<div class="tt-synergy">🔗 ${synergyCount} 个协同组合</div>`
            : '';
        const synergyNote = card.synergy_note
            ? `<div class="tt-synergy-note">${card.synergy_note}</div>`
            : '';

        tooltip.innerHTML = `
            <div class="tt-header">
                <img src="${card.image}" alt="${card.name}" class="tt-img">
                <div class="tt-info">
                    <div class="tt-name">${card.name}</div>
                    <span class="tt-rarity" style="color:${rInfo.color}">${rInfo.name}</span>
                </div>
            </div>
            <div class="tt-desc">${card.description || ''}</div>
            ${effectTags.length ? '<div class="tt-effects">' + effectTags.join('') + '</div>' : ''}
            ${synergyLine}
            ${synergyNote}
            <div class="tt-action">👆 点击加入牌组匹配</div>
        `;

        tooltip.classList.add('show');

        // 定位：跟随鼠标附近
        const rect = event.currentTarget.getBoundingClientRect();
        const ttWidth = 280;
        const ttHeight = tooltip.offsetHeight || 200;
        
        let left = rect.left + rect.width / 2 - ttWidth / 2;
        let top = rect.top - ttHeight - 8;

        // 边界检测
        if (left < 8) left = 8;
        if (left + ttWidth > window.innerWidth - 8) left = window.innerWidth - ttWidth - 8;
        if (top < 8) {
            top = rect.bottom + 8; // 放到下面
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + window.scrollY + 'px';
    }

    hideTierTooltip() {
        const tooltip = document.getElementById('tier-tooltip');
        if (tooltip) tooltip.classList.remove('show');
    }

    // Tier List 卡牌点击 → 加入牌组匹配
    tierCardClick(cardId) {
        this.hideTierTooltip();
        // 如果已在牌组中，直接跳转
        if (!this.selectedCards.find(c => c.id === cardId)) {
            const card = this.allCards.find(c => c.id === cardId);
            if (card) {
                this.selectedCards.push(card);
            }
        }
        this.renderSelectedCards();
        this.renderPicker();
        this.updateRecommendations();
        this.switchTab('matcher');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BalatroApp();
});
