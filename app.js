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
            rarities: ['common', 'rare', 'legendary', 'secret'],
            effects: [],
            hands: [],
            search: ''
        };
        
        // 用户的卡组
        this.selectedCards = [];
        
        // 初始化
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCounts();
        this.renderCards();
        this.renderPicker();
        this.renderRecommended();
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
        document.querySelectorAll('.filter-section:nth-child(3) .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.effects = Array.from(document.querySelectorAll('.filter-section:nth-child(3) .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
            });
        });
        
        // 牌型筛选
        document.querySelectorAll('.filter-section:nth-child(4) .checkbox-label input').forEach(input => {
            input.addEventListener('change', () => {
                this.filters.hands = Array.from(document.querySelectorAll('.filter-section:nth-child(4) .checkbox-label input:checked')).map(i => i.value);
                this.renderCards();
            });
        });
        
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
        
        // 卡牌选择器搜索
        document.getElementById('picker-search').addEventListener('input', (e) => {
            this.renderPicker(e.target.value.toLowerCase());
        });
        
        // 匹配偏好
        document.getElementById('prefer-chips').addEventListener('change', () => this.updateRecommendations());
        document.getElementById('prefer-mult').addEventListener('change', () => this.updateRecommendations());
    }
    
    switchTab(tabId) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
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
            
            // 稀有度筛选
            if (!this.filters.rarities.includes(card.rarity)) return false;
            
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
        
        document.getElementById('total-count').textContent = filtered.length;
        
        if (filtered.length === 0) {
            grid.innerHTML = '<p class="empty-state">没有找到匹配的卡牌</p>';
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
            const handNames = {
                'high_card': '高牌', 'one_pair': '对子', 'two_pair': '两对',
                'three_of_a_kind': '三条', 'straight': '顺子', 'flush': '同花',
                'full_house': '葫芦', 'four_of_a_kind': '四条', 'straight_flush': '同花顺'
            };
            const handName = handNames[card.best_with[0]] || card.best_with[0];
            handTag = `<span class="card-hand">${handName}</span>`;
        }
        
        const typeNames = { joker: 'Joker', tarot: '塔罗', planet: '行星', spectral: '灵魂' };
        
        return `
            <div class="card ${rarityClass}" onclick="app.selectCard('${card.id}')">
                <div class="card-header">
                    <span class="card-name">${card.name}</span>
                    <span class="card-type ${card.cardType}">${typeNames[card.cardType]}</span>
                </div>
                <p class="card-description">${card.description}</p>
                <div class="card-tags">
                    ${tags}
                    ${handTag}
                </div>
            </div>
        `;
    }
    
    clearFilters() {
        document.querySelectorAll('.checkbox-label input').forEach(input => {
            input.checked = true;
        });
        
        this.filters = {
            types: ['joker', 'tarot', 'planet', 'spectral'],
            rarities: ['common', 'rare', 'legendary', 'secret'],
            effects: [],
            hands: [],
            search: ''
        };
        
        document.getElementById('search-input').value = '';
        this.renderCards();
    }
    
    // ============ 牌组匹配功能 ============
    
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
            container.innerHTML = '<p class="empty-state">点击卡牌添加到你的卡组</p>';
            return;
        }
        
        const rarityLabels = { common: '普通', rare: '稀有', legendary: '传奇', secret: '隐藏' };
        
        container.innerHTML = this.selectedCards.map(card => `
            <div class="selected-card">
                <div class="selected-card-header">
                    <span class="selected-card-name">${card.name}</span>
                    <span class="selected-card-rarity">${rarityLabels[card.rarity] || ''}</span>
                    <span class="remove" onclick="event.stopPropagation(); app.removeCard('${card.id}')">&times;</span>
                </div>
                <div class="selected-card-desc">${card.description || ''}</div>
            </div>
        `).join('');
    }
    
    removeCard(cardId) {
        this.selectedCards = this.selectedCards.filter(c => c.id !== cardId);
        this.renderSelectedCards();
        this.updateRecommendations();
    }
    
    clearDeck() {
        this.selectedCards = [];
        this.renderSelectedCards();
        document.getElementById('recommendations').innerHTML = '<p class="empty-state">选择卡牌后，系统将为你推荐最佳搭配</p>';
    }
    
    renderPicker(search = '') {
        const container = document.getElementById('picker-list');
        
        // 排除已选择的卡牌
        const availableCards = this.allCards.filter(c => 
            !this.selectedCards.find(s => s.id === c.id) &&
            (search === '' || c.name.toLowerCase().includes(search))
        );
        
        const typeNames = { joker: 'Joker', tarot: '塔罗', planet: '行星', spectral: '灵魂' };
        
        container.innerHTML = availableCards.slice(0, 50).map(card => `
            <label class="picker-item">
                <div class="picker-item-header">
                    <input type="checkbox" value="${card.id}" onchange="app.togglePickerCard('${card.id}', this.checked)">
                    <span class="name">${card.name}</span>
                    <span class="type">${typeNames[card.cardType] || 'Joker'}</span>
                </div>
                <div class="picker-item-desc">${card.description || ''}</div>
            </label>
        `).join('');
    }
    
    togglePickerCard(cardId, checked) {
        if (checked) {
            this.selectCard(cardId);
        } else {
            this.removeCard(cardId);
        }
    }
    
    updateRecommendations() {
        const container = document.getElementById('recommendations');
        
        if (this.selectedCards.length === 0) {
            container.innerHTML = '<p class="empty-state">选择卡牌后，系统将为你推荐最佳搭配</p>';
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
            html += '<h3 class="matched-title">🧭 匹配到的构筑方向</h3>';
            html += matchedBuilds.map(mb => {
                const missingNames = mb.missingCore.map(id => {
                    const c = this.allCards.find(c => c.id === id);
                    return c ? c.name : '';
                }).filter(Boolean);
                const missingHtml = missingNames.length > 0 
                    ? `<span class="missing-cards">还缺: ${missingNames.join('、')}</span>` 
                    : '<span class="build-complete">✅ 核心已齐全！</span>';
                return `
                    <div class="matched-build ${mb.matchRate >= 0.7 ? 'high-match' : mb.matchRate >= 0.4 ? 'mid-match' : 'low-match'}">
                        <div class="build-match-header">
                            <span class="build-name">${mb.strategy.name}</span>
                            <span class="match-rate">${Math.round(mb.matchRate * 100)}% 匹配</span>
                        </div>
                        <p class="build-desc">${mb.strategy.desc}</p>
                        ${missingHtml}
                    </div>
                `;
            }).join('');
            html += '</div>';
        }
        
        if (recommendations.length === 0) {
            html += '<p class="empty-state">没有找到推荐卡牌</p>';
            container.innerHTML = html;
            return;
        }
        
        html += '<h3 class="rec-title">🎯 推荐卡牌</h3>';
        html += recommendations.slice(0, 12).map(rec => {
            const scoreClass = rec.score >= 70 ? 'high' : rec.score >= 40 ? 'medium' : 'low';
            const rarityLabel = rec.card.rarity === 'legendary' ? '传奇' : rec.card.rarity === 'rare' ? '稀有' : rec.card.rarity === 'secret' ? '隐藏' : '普通';
            const typeLabel = rec.card.cardType === 'joker' ? 'Joker' : rec.card.cardType === 'tarot' ? '塔罗' : rec.card.cardType === 'planet' ? '行星' : '灵魂';
            const buildTag = rec.buildTag ? `<span class="card-tag build-tag">${rec.buildTag}</span>` : '';
            return `
                <div class="recommendation-card">
                    <div class="rec-header">
                        <span class="rec-name">${rec.card.name}</span>
                        <span class="rec-score ${scoreClass}">${rec.score}分</span>
                    </div>
                    <p class="rec-desc">${rec.card.description || ''}</p>
                    <p class="rec-reason">${rec.reason}</p>
                    ${rec.synergy ? `<p class="rec-synergy">✨ ${rec.synergy}</p>` : ''}
                    <div class="rec-tags">
                        <span class="card-tag">${rarityLabel}</span>
                        <span class="card-tag">${typeLabel}</span>
                        ${buildTag}
                    </div>
                </div>
            `;
        }).join('');
        
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
            
            // 互斥卡牌检测（如大麦克和卡文迪什不能同时存在）
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
            
            // 2. 点数协同检测 (斐波那契/偶数/奇数)
            if (card.effects && card.effects.rank) {
                const cardRanks = Array.isArray(card.effects.rank) ? card.effects.rank : [card.effects.rank];
                
                // 检测斐波那契+偶数
                if (selectedIds.includes('j_fibonacci') && cardRanks.includes(8)) {
                    score += 40;
                    if (!synergy) synergy = '斐波那契+偶数史蒂文：8可触发双重效果';
                }
                // 检测斐波那契+奇数托德
                if (selectedIds.includes('j_fibonacci') && selectedIds.includes('j_odd_todd')) {
                    const overlapping = cardRanks.filter(r => [3, 5].includes(r));
                    if (overlapping.length > 0) {
                        score += 35;
                        if (!synergy) synergy = '3,5可触发斐波那契+奇数托德双重效果';
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
            
            // 5. 人头牌协同
            if (tags.includes('face') && selectedIds.includes('j_pareidolia')) {
                score += 30;
                synergy = synergy || '空想性错觉使所有牌变人头牌';
            }
            
            // 6. 花色协同
            if (tags.includes('suit')) {
                const suitCards = ['j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_flower_pot'];
                const suitMatches = suitCards.filter(id => selectedIds.includes(id));
                if (suitMatches.length >= 2) {
                    score += 25;
                    synergy = synergy || '多花色加成卡牌组合';
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
            
            // 8. 摧毁类协同
            if (tags.includes('destroy') || effects.destroy) {
                const destroySynergies = [
                    { cards: ['j_glass', 'j_vampire'], name: '玻璃吸血鬼组合' },
                    { cards: ['j_canio', 'j_pareidolia'], name: '人头牌销毁流' },
                    { cards: ['j_glass', 't_fool'], name: '玻璃销毁流' },
                    { cards: ['j_flower_pot', 't_high_priestess'], name: '卖花女组合' },
                    { cards: ['t_hanged', 'j_abstract'], name: '倒吊抽象流' },
                    { cards: ['j_madness', 'j_abstract'], name: '疯狂销毁流' }
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
                    { cards: ['t_wheel', 'j_showman'], name: '轮盘主持人' }
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
            
            // 10. 行星牌协同
            if (tags.includes('planet') || card.cardType === 'planet') {
                const planetSynergies = [
                    { cards: ['j_constellation', 'j_astronomer'], name: '星座天文学' },
                    { cards: ['j_satellite', 'j_constellation'], name: '卫星星座' },
                    { cards: ['t_priestess', 'j_constellation'], name: '女祭司星座' },
                    { cards: ['j_showman', 'j_constellation'], name: '主持人行星' },
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
                    { cards: ['s_immolate', 'j_to_moon'], name: '火祭登月' },
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
                    { cards: ['j_hanging_chad', 'j_wee'], name: '查德小不点' },
                    { cards: ['j_hanging_chad', 'j_cavendish'], name: '查德卡文迪什' },
                    { cards: ['j_hanging_chad', 'j_gros_michel'], name: '查德大麦克' },
                    { cards: ['j_dusk', 'j_abstract'], name: '黄昏抽象' },
                    { cards: ['j_throwback', 'j_hanging_chad'], name: '怀旧查德' }
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
                    // 注意：大麦克和卡文迪什互斥，大麦克灭绝后才出现卡文迪什
                    { cards: ['j_gros_michel', 'j_bloodstone'], name: '风险血石' },
                    { cards: ['j_cavendish', 'j_oops_6'], name: '卡文迪什全6' },
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
                tips: '优先升级对子的行星牌（水星），后期寻找二重奏(X2)作为终极倍率'
            },
            {
                id: 'straight_build',
                name: '📏 顺子流',
                difficulty: '⭐⭐ 中等',
                desc: '顺子体系，配合捷径降低门槛，秩序提供X3倍率',
                detail: '顺子需要5张连续牌，难度较高但回报丰厚。捷径允许1点间隔大幅降低组成难度，四指可以只用4张。',
                coreCards: ['j_crazy', 'j_devious', 'j_order', 'j_shortcut'],
                supportCards: ['j_runner', 'j_superposition', 'j_four_fingers', 'p_saturn'],
                tips: '捷径是顺子流的核心辅助，让2-4-5-6-7也算顺子。四指进一步降低到4张即可'
            },
            {
                id: 'flush_build',
                name: '🎨 同花流',
                difficulty: '⭐⭐ 中等',
                desc: '同花体系，配合花色Joker和涂抹小丑提高触发率',
                detail: '同花需要5张同花色牌，涂抹小丑合并红方/黑梅大幅提高概率。四指可以降低到4张。',
                coreCards: ['j_droll', 'j_crafty', 'j_tribe'],
                supportCards: ['j_smeared', 'j_four_fingers', 'j_blackboard', 'p_jupiter'],
                tips: '涂抹小丑是同花流最重要的辅助——红桃方块合并、黑桃梅花合并，等于只有2种花色'
            },
            {
                id: 'face_build',
                name: '👑 人头牌流',
                difficulty: '⭐⭐ 中等',
                desc: '围绕J/Q/K人头牌构筑，多个Joker提供叠加加成',
                detail: '人头牌(J/Q/K)有大量专属加成Joker，空想性错觉可以让所有牌都变成人头牌，是人头牌流的终极辅助。',
                coreCards: ['j_photograph', 'j_scary_face', 'j_smiley', 'j_pareidolia'],
                supportCards: ['j_sock', 'j_baron', 'j_triboulet', 'j_business_card', 'j_midas'],
                tips: '空想性错觉(所有牌变人头牌)是核心中的核心，拿到后所有人头牌加成都能触发'
            },
            {
                id: 'kq_build',
                name: '♔ K/Q皇室流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '围绕K和Q打造超高倍率，特里布莱K/Q各X2',
                detail: '特里布莱让K和Q各提供X2倍率，男爵让每张K提供X1.5，射月让每张Q+13倍率。配合空想性错觉让所有牌变人头牌后效果更强。',
                coreCards: ['j_triboulet', 'j_baron', 'j_shoot_moon'],
                supportCards: ['j_pareidolia', 'j_sock', 'j_photograph', 'j_hanging_chad'],
                tips: '传说Joker特里布莱是核心，每张K和Q都X2，手牌全是K/Q时倍率爆炸'
            },
            {
                id: 'fibonacci_build',
                name: '🐚 斐波那契流',
                difficulty: '⭐⭐ 中等',
                desc: '利用斐波那契数列(A,2,3,5,8)的双重触发效果',
                detail: '斐波那契小丑对A/2/3/5/8加倍率，偶数史蒂文对2/4/6/8/10加倍率，奇数托德对A/3/5/7/9加筹码。2和8可同时触发斐波那契+偶数，A/3/5可触发斐波那契+奇数。',
                coreCards: ['j_fibonacci', 'j_even_steven', 'j_odd_todd'],
                supportCards: ['j_scholar', 'j_hack', 'j_walkie', 'j_8ball'],
                tips: '2和8是双重触发王者(斐波那契+偶数)，尽量多拿这两个点数'
            },
            {
                id: 'economy_build',
                name: '💰 经济流',
                difficulty: '⭐ 简单',
                desc: '快速积累金钱，利用金钱转化为筹码/倍率',
                detail: '先通过经济Joker快速积累资金，再用公牛(每$1+2筹码)和靴带(每$5+2倍率)将金钱转化为战斗力。登月让利息收益最大化。',
                coreCards: ['j_golden', 'j_to_moon', 'j_bull', 'j_bootstraps'],
                supportCards: ['j_rocket', 'j_egg', 'j_cloud9', 'j_credit_card'],
                tips: '保持$25以上获得最大利息($5)，公牛和靴带让你的钱包就是你的武器'
            },
            {
                id: 'discard_build',
                name: '🗑️ 弃牌流',
                difficulty: '⭐⭐ 中等',
                desc: '利用弃牌触发各种效果，弃牌也能赚钱和加倍率',
                detail: '醉汉和快乐安迪增加弃牌次数，旗帜将剩余弃牌转化为筹码，尤里克弃23张后获得X倍率，赶路弃J获得倍率。弃牌经济卡则把弃牌变成收入。',
                coreCards: ['j_drunkard', 'j_merry_andy', 'j_banner', 'j_yorick'],
                supportCards: ['j_hit_road', 'j_trading', 'j_mail_in', 'j_castle', 'j_burnt', 'j_faceless'],
                tips: '快乐安迪+3弃牌是核心引擎，配合旗帜每剩余弃牌+30筹码非常可观'
            },
            {
                id: 'burglar_build',
                name: '🦝 窃贼流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '窃贼移除所有弃牌，让多个Joker保持最佳状态',
                detail: '窃贼移除所有弃牌次数但+3手牌。这让拉面始终保持X2倍率、神秘山峰始终+15倍率、延迟满足获得最高$收益、绿色小丑不会扣倍率。',
                coreCards: ['j_burglar', 'j_ramen', 'j_mystic_summit'],
                supportCards: ['j_delayed', 'j_green', 'j_acrobat'],
                tips: '窃贼是整个流派的基石——没有弃牌=拉面不衰减+神秘山峰满触发+延迟满足满收益'
            },
            {
                id: 'tarot_build',
                name: '🔮 塔罗流',
                difficulty: '⭐⭐ 中等',
                desc: '大量产出塔罗牌，算命师将每张塔罗牌转化为倍率',
                detail: '占卜师每盲注创造塔罗牌，幻觉开包1/2概率获得塔罗牌，流浪者低价时产生塔罗牌。算命师每张使用过的塔罗牌+1倍率，后期倍率非常可观。',
                coreCards: ['j_cartomancer', 'j_fortune_teller', 'j_vagabond'],
                supportCards: ['j_hallucination', 'j_8ball', 'j_superposition', 'j_perkeo'],
                tips: '算命师的倍率随游戏进行不断累积，是塔罗流的核心产出卡'
            },
            {
                id: 'planet_build',
                name: '🪐 行星流',
                difficulty: '⭐⭐ 中等',
                desc: '利用行星牌升级牌型，星座将行星转化为倍率',
                detail: '天文学家让商店行星牌免费，星座每使用行星牌+0.1X倍率。配合卫星获取独特行星收入。太空小丑有1/4概率自动升级牌型。',
                coreCards: ['j_astronomer', 'j_constellation', 'j_satellite'],
                supportCards: ['j_space', 'j_supernova', 'j_showman'],
                tips: '天文学家是行星流的引擎——免费行星意味着每次商店都能升级牌型+增加星座倍率'
            },
            {
                id: 'destroy_build',
                name: '💥 摧毁流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '通过摧毁卡牌/Joker获得永久加成',
                detail: '玻璃小丑每摧毁玻璃卡+X0.75，吸血鬼吸收增强牌+X0.1，祭祀匕首击败Boss时摧毁右侧Joker获得永久倍率。疯狂+抽象也是经典摧毁组合。',
                coreCards: ['j_glass', 'j_vampire', 'j_ceremonial', 'j_madness'],
                supportCards: ['j_abstract', 'j_canio', 'j_pareidolia', 't_justice'],
                tips: '玻璃卡+正义塔罗牌是核心循环——正义创造玻璃卡，玻璃卡摧毁时玻璃小丑增加倍率'
            },
            {
                id: 'copy_build',
                name: '📋 复制流',
                difficulty: '⭐⭐⭐ 高级',
                desc: '蓝图和头脑风暴复制最强Joker效果',
                detail: '蓝图复制右侧Joker效果，头脑风暴复制最左侧Joker效果。将它们放在关键位置可以让核心Joker效果翻倍甚至三倍。',
                coreCards: ['j_blueprint', 'j_brainstorm'],
                supportCards: ['j_showman', 'j_invisible', 'j_dna'],
                tips: '蓝图复制右侧、头脑风暴复制最左——合理安排Joker顺序让最强效果被复制'
            },
            {
                id: 'sell_build',
                name: '🔥 出售流',
                difficulty: '⭐⭐ 中等',
                desc: '通过出售卡牌获得增益，篝火每出售+X0.25',
                detail: '篝火每出售一张卡+X0.25倍率(Boss重置)，礼品卡增加出售值，健怡可乐出售创造免费双倍标签。每回合买卖循环快速累积倍率。',
                coreCards: ['j_campfire', 'j_gift_card', 'j_diet_cola'],
                supportCards: ['j_swashbuckler', 'j_riff_raff', 'j_ceremonial'],
                tips: '篝火在Boss重置前要尽量多出售卡牌累积倍率，流浪汉每盲注创造2个普通Joker可以出售'
            },
            {
                id: 'chance_build',
                name: '🎲 概率流',
                difficulty: '⭐⭐ 中等',
                desc: '全是6翻倍所有概率，让概率型卡牌更稳定',
                detail: '全是6让所有概率翻倍：血石1/2→1/1(必触发)、太空1/4→1/2、幸运猫触发率翻倍。配合幸运牌和概率型Joker效果极佳。',
                coreCards: ['j_oops_6', 'j_bloodstone', 'j_lucky_cat'],
                supportCards: ['j_space', 'j_gros_michel', 'j_ancient', 't_magician'],
                tips: '全是6是概率流的基石——血石从50%变100%触发，太空从25%变50%，简直是作弊。注意大麦克灭绝后会变成卡文迪什(X3)更强'
            },
            {
                id: 'skip_build',
                name: '⏭️ 跳过流',
                difficulty: '⭐⭐ 中等',
                desc: '跳过盲注获得倍率积累，怀旧+红小丑双重收益',
                detail: '怀旧每跳过盲注+X0.25倍率，红小丑每跳过增强包+3倍率。跳过小盲注和大盲注（只打Boss）可以快速积累倍率。',
                coreCards: ['j_throwback', 'j_red'],
                supportCards: ['j_mr_bones', 'j_acrobat', 'j_stencil'],
                tips: '跳过小盲和大盲，只打Boss。骨头先生防止意外死亡，杂技演员最后一手X3保底'
            }
        ];
    }
    
    renderRecommended() {
        // 渲染构筑思路
        this.renderBuildStrategies();
        // 渲染推荐卡牌分类Tab和卡牌
        this.renderRecommendedTabs();
    }
    
    renderBuildStrategies() {
        const container = document.getElementById('build-strategies');
        const strategies = this.getBuildStrategies();
        
        container.innerHTML = strategies.map(s => {
            const coreNames = s.coreCards.map(id => {
                const c = this.allCards.find(c => c.id === id);
                return c ? c.name : '';
            }).filter(Boolean);
            
            return `
                <div class="guide-card strategy-card" data-strategy="${s.id}">
                    <div class="strategy-header">
                        <h4>${s.name}</h4>
                        <span class="strategy-difficulty">${s.difficulty}</span>
                    </div>
                    <p>${s.desc}</p>
                    <p class="strategy-detail">${s.detail}</p>
                    <div class="strategy-core">
                        <span class="core-label">核心卡牌：</span>
                        <span class="core-cards">${coreNames.join('、')}</span>
                    </div>
                    <p class="strategy-tip">💡 ${s.tips}</p>
                    <button class="btn btn-small btn-try" onclick="app.tryBuild('${s.id}')">试试这个构筑 →</button>
                </div>
            `;
        }).join('');
    }
    
    renderRecommendedTabs() {
        const tabsContainer = document.getElementById('recommended-tabs');
        const cardsContainer = document.getElementById('recommended-cards');
        
        const categories = [
            { id: 'all_star', name: '🌟 全明星', cards: ['j_blueprint', 'j_brainstorm', 'j_perkeo', 'j_chicot', 'j_triboulet', 'j_baron', 'j_order', 'j_tribe', 'j_family', 'j_duo'] },
            { id: 'early_game', name: '🌱 前期好用', cards: ['j_joker', 'j_greedy', 'j_lusty', 'j_wrathful', 'j_gluttonous', 'j_jolly', 'j_sly', 'j_crazy', 'j_golden', 'j_egg', 'j_ice_cream', 'j_popcorn'] },
            { id: 'scaling', name: '📈 成长型', cards: ['j_ride_bus', 'j_runner', 'j_green', 'j_square', 'j_castle', 'j_flash', 'j_red', 'j_throwback', 'j_hiker', 'j_constellation', 'j_supernova', 'j_campfire'] },
            { id: 'xmult', name: '🔥 倍率炸弹', cards: ['j_cavendish', 'j_loyalty', 'j_ramen', 'j_acrobat', 'j_card_sharp', 'j_ancient', 'j_obelisk', 'j_stencil', 'j_driver_license', 'j_seeing_double'] },
            { id: 'economy_picks', name: '💰 经济好牌', cards: ['j_golden', 'j_to_moon', 'j_rocket', 'j_egg', 'j_cloud9', 'j_bull', 'j_bootstraps', 'j_delayed', 'j_trading', 'j_matador'] },
            { id: 'utility', name: '🔧 万能辅助', cards: ['j_four_fingers', 'j_shortcut', 'j_smeared', 'j_pareidolia', 'j_oops_6', 'j_showman', 'j_chaos', 'j_mr_bones', 'j_burglar', 'j_splash'] }
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
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BalatroApp();
});
