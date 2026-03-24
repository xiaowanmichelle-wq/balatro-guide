/**
 * 自定义 Tier List 生成器
 * 支持 PC 拖拽 + 移动端点击选档
 * 本地存储 + 一键生成分享图
 */
class CustomTierList {
    constructor() {
        this.tiers = ['夯', '顶级', '人上人', 'NPC', '拉', '拉完了'];
        this.tierColors = {
            '夯': '#ff4757', '顶级': '#ffa502', '人上人': '#ffd700',
            'NPC': '#2ed573', '拉': '#70a1ff', '拉完了': '#a0a0a0'
        };
        this.tierDescs = {
            '夯': '版本之子', '顶级': '极强', '人上人': '强力',
            'NPC': '可用', '拉': '偏弱', '拉完了': '不推荐'
        };
        // 旧版 S/A/B/C/D/E → 新版映射（存档兼容）
        this._legacyMap = { S: '夯', A: '顶级', B: '人上人', C: 'NPC', D: '拉', E: '拉完了' };
        // cardAssignments: { cardId: '夯' | '顶级' | ... | null }
        this.cardAssignments = {};
        this.allJokers = [];
        this.isOpen = false;
        this.dragCard = null;
        this.searchText = '';
        this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        // 点击选档弹窗状态
        this.pendingCardId = null;
        // 筛选器状态
        this.filterRarity = 'all';  // 'all' | 'common' | 'rare' | 'legendary'
        this.filterCategory = 'all'; // 'all' | 各个功能分类
        // === 非排他分类（允许重叠）===
        // 倍率和筹码是大部分小丑牌都会有的通用属性，单独展示全量
        this.nonExclusiveCategories = {
            '倍率': ['mult', 'xmult'],
            '筹码': ['chips']
        };
        // === 排他分类：优先级链（每张卡牌只归属一个排他分类）===
        // 越靠前优先级越高，一旦匹配就不再往后检测
        this.categoryPriority = [
            { name: '消耗', tags: ['decay', 'risky'] },
            { name: '重复打出', tags: ['rescore', 'hand_trigger'] },
            { name: '成长', tags: ['scaling', 'upgrade', 'consecutive'] },
            { name: '生成牌', tags: ['tarot', 'planet', 'spectral', 'consumable'] },
            { name: '经济', tags: ['economy', 'interest', 'sell', 'gold', 'debt'] },
            { name: '花色', tags: ['suit'] },
            { name: '牌型', tags: ['hand', 'straight', 'flush', 'straight_flush'] },
            { name: '特殊', tags: ['special', 'destroy', 'create', 'copy', 'double', 'augment', 'stone', 'steel', 'glass', 'lucky', 'seal'] },
            { name: '其他', tags: ['basic', 'chips', 'mult', 'xmult', 'hand_size', 'draw', 'boss', 'discard', 'shop', 'chance', 'random', 'timing', 'deck', 'joker_count', 'play', 'skip', 'position', 'soul', 'permanent', 'survive', 'reset', 'changing', 'scoring', 'rank', 'face', 'ace', 'fibonacci', 'even', 'odd', 'rare'] },
        ];
        // 特殊卡牌分类覆盖（优先于优先级链匹配）
        this.categoryOverrides = {
            'j_constellation': '成长',    // 星座：虽有 planet tag 但核心是 ×mult 成长
            'j_satellite': '经济',        // 卫星：虽有 planet tag 但核心是赚钱
            'j_fortune_teller': '成长',   // 占卜师：虽有 tarot tag 但核心是 mult 累积成长
            'j_turtle_bean': '消耗',      // 黑龟豆：+5手牌上限但每回合-1，逐渐消耗殆尽
            'j_ramen': '消耗',            // 拉面：×2倍率但每弃牌-0.01，会被消耗掉
            'j_sock': '重复打出',         // 喜与悲：人头牌额外触发1次
            'j_mime': '重复打出',         // 哑剧演员：手牌中的牌额外触发1次
            'j_dusk': '重复打出',         // 黄昏：最后1次出牌额外触发1次
            'j_hack': '重复打出',         // 烂脱口秀演员：2/3/4/5额外触发1次
            'j_seltzer': '重复打出',      // 苏打水：10次出牌额外触发1次
            'j_hanging_chad': '重复打出', // 未断选票：第1张计分牌额外触发2次
            'j_wee': '其他'               // 小小丑：虽有 rescore tag 但自身不提供额外触发，是受益方
        };
        // 稀有度标签
        this.rarityLabels = {
            'all': '全部', 'common': '普通', 'rare': '稀有', 'legendary': '传说'
        };
    }

    init(allCards) {
        this.allJokers = allCards.filter(c => c.id && c.id.startsWith('j_'));
        this.loadFromStorage();
    }

    // ===== 存储 =====
    saveToStorage() {
        try {
            localStorage.setItem('custom_tierlist', JSON.stringify(this.cardAssignments));
        } catch (e) { /* ignore */ }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('custom_tierlist');
            if (saved) {
                const data = JSON.parse(saved);
                // 自动迁移旧版 S/A/B/C/D/E 到新版
                for (const [cardId, tier] of Object.entries(data)) {
                    if (this._legacyMap[tier]) {
                        data[cardId] = this._legacyMap[tier];
                    }
                }
                this.cardAssignments = data;
            }
        } catch (e) { /* ignore */ }
    }

    clearAll() {
        this.cardAssignments = {};
        this.saveToStorage();
        this.render();
    }

    // ===== 打开/关闭 =====
    open() {
        this.isOpen = true;
        this.searchText = '';
        this.filterRarity = 'all';
        this.filterCategory = 'all';
        const overlay = document.getElementById('custom-tierlist-overlay');
        if (overlay) {
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            // 点击遮罩关闭（但不关闭弹窗内部点击）
            overlay.onclick = (e) => {
                if (e.target === overlay) this.close();
            };
            this.render();
        }
    }

    close() {
        this.isOpen = false;
        const overlay = document.getElementById('custom-tierlist-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
        this.closeTierPicker();
    }

    // ===== 卡牌分配 =====
    assignCard(cardId, tier) {
        if (tier && this.tiers.includes(tier)) {
            this.cardAssignments[cardId] = tier;
        } else {
            delete this.cardAssignments[cardId];
        }
        this.saveToStorage();
        this.render();
    }

    removeCard(cardId) {
        delete this.cardAssignments[cardId];
        this.saveToStorage();
        this.render();
    }

    getUnassignedCards() {
        return this.allJokers.filter(c => !this.cardAssignments[c.id]);
    }

    getCardsForTier(tier) {
        return this.allJokers.filter(c => this.cardAssignments[c.id] === tier);
    }

    // ===== 点击选档弹窗（移动端+PC备用） =====
    showTierPicker(cardId, evt) {
        if (evt) evt.stopPropagation();
        this.pendingCardId = cardId;
        const card = this.allJokers.find(c => c.id === cardId);
        const picker = document.getElementById('ctl-tier-picker');
        if (!picker || !card) return;

        picker.querySelector('.ctl-picker-name').textContent = card.name;
        const img = picker.querySelector('.ctl-picker-img');
        if (img) { img.src = card.image; img.alt = card.name; }

        // 高亮当前所在档位
        const currentTier = this.cardAssignments[cardId] || null;
        picker.querySelectorAll('.ctl-picker-tier-btn').forEach(btn => {
            btn.classList.toggle('current', btn.dataset.tier === currentTier);
        });
        // 显示移除按钮（如果已分配）
        const removeBtn = picker.querySelector('.ctl-picker-remove');
        if (removeBtn) removeBtn.style.display = currentTier ? '' : 'none';

        picker.classList.add('show');
        // 点击背景关闭
        picker.onclick = (e) => {
            if (e.target === picker) this.closeTierPicker();
        };
    }

    closeTierPicker() {
        this.pendingCardId = null;
        const picker = document.getElementById('ctl-tier-picker');
        if (picker) picker.classList.remove('show');
    }

    confirmTierPick(tier) {
        if (this.pendingCardId) {
            this.assignCard(this.pendingCardId, tier);
        }
        this.closeTierPicker();
    }

    confirmRemoveFromPicker() {
        if (this.pendingCardId) {
            this.removeCard(this.pendingCardId);
        }
        this.closeTierPicker();
    }

    // ===== 搜索 & 筛选 =====
    onSearch(value) {
        this.searchText = (value || '').trim().toLowerCase();
        this.renderCardPool();
    }

    setFilterRarity(rarity) {
        this.filterRarity = rarity;
        // 更新按钮高亮
        document.querySelectorAll('.ctl-filter-rarity-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.rarity === rarity);
        });
        this.renderCardPool();
    }

    setFilterCategory(category) {
        this.filterCategory = category;
        // 更新按钮高亮
        document.querySelectorAll('.ctl-filter-cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        this.renderCardPool();
    }

    // 获取卡牌唯一所属分类
    getCardCategory(card) {
        // 优先检查手动覆盖
        if (this.categoryOverrides[card.id]) return this.categoryOverrides[card.id];
        // 按优先级链匹配，命中即返回
        for (const cat of this.categoryPriority) {
            if (card.tags && card.tags.some(t => cat.tags.includes(t))) return cat.name;
        }
        return '其他';
    }

    matchesCategory(card, category) {
        if (category === 'all') return true;
        // 非排他分类（倍率/筹码）：只看 tag 是否包含
        if (this.nonExclusiveCategories[category]) {
            const matchTags = this.nonExclusiveCategories[category];
            return card.tags && card.tags.some(t => matchTags.includes(t));
        }
        // 排他分类：走唯一归属逻辑
        return this.getCardCategory(card) === category;
    }

    resetFilters() {
        this.filterRarity = 'all';
        this.filterCategory = 'all';
        this.searchText = '';
        const searchInput = document.querySelector('.ctl-search');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.ctl-filter-rarity-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.rarity === 'all');
        });
        document.querySelectorAll('.ctl-filter-cat-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        this.renderCardPool();
    }

    // ===== 拖拽 (PC) =====
    onDragStart(e, cardId) {
        this.dragCard = cardId;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', cardId);
        e.target.closest('.ctl-pool-card, .ctl-tier-card')?.classList.add('dragging');
    }

    onDragEnd(e) {
        this.dragCard = null;
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.ctl-tier-drop.drag-over').forEach(el => el.classList.remove('drag-over'));
        document.querySelectorAll('.ctl-pool-zone.drag-over').forEach(el => el.classList.remove('drag-over'));
    }

    onTierDragOver(e, tier) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    onTierDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    onTierDrop(e, tier) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain') || this.dragCard;
        if (cardId) {
            this.assignCard(cardId, tier);
        }
    }

    onPoolDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }

    onPoolDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    onPoolDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const cardId = e.dataTransfer.getData('text/plain') || this.dragCard;
        if (cardId) {
            this.removeCard(cardId);
        }
    }

    // ===== 渲染 =====
    render() {
        this.renderTierRows();
        this.renderCardPool();
        this.renderStats();
    }

    renderTierRows() {
        const container = document.getElementById('ctl-tiers');
        if (!container) return;

        container.innerHTML = this.tiers.map(tier => {
            const cards = this.getCardsForTier(tier);
            const cardsHtml = cards.map(card => `
                <div class="ctl-tier-card" 
                     draggable="true" 
                     data-id="${card.id}"
                     ondragstart="customTierList.onDragStart(event, '${card.id}')"
                     ondragend="customTierList.onDragEnd(event)"
                     onclick="customTierList.showTierPicker('${card.id}', event)">
                    <img src="${card.image}" alt="${card.name}" loading="lazy">
                    <span class="ctl-card-name">${card.name}</span>
                </div>
            `).join('');

            return `
                <div class="ctl-tier-row">
                    <div class="ctl-tier-label" style="background:${this.tierColors[tier]}">
                        <span class="ctl-tier-letter">${tier}</span>
                        <span class="ctl-tier-desc">${this.tierDescs[tier]}</span>
                    </div>
                    <div class="ctl-tier-drop" 
                         data-tier="${tier}"
                         ondragover="customTierList.onTierDragOver(event, '${tier}')"
                         ondragleave="customTierList.onTierDragLeave(event)"
                         ondrop="customTierList.onTierDrop(event, '${tier}')">
                        ${cardsHtml || '<span class="ctl-tier-empty">拖入或点击卡牌添加到此档位</span>'}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCardPool() {
        const container = document.getElementById('ctl-card-pool');
        if (!container) return;

        let unassigned = this.getUnassignedCards();

        // 稀有度筛选
        if (this.filterRarity !== 'all') {
            unassigned = unassigned.filter(c => c.rarity === this.filterRarity);
        }

        // 功能分类筛选
        if (this.filterCategory !== 'all') {
            unassigned = unassigned.filter(c => this.matchesCategory(c, this.filterCategory));
        }

        // 搜索筛选
        if (this.searchText) {
            unassigned = unassigned.filter(c =>
                c.name.toLowerCase().includes(this.searchText) ||
                c.id.toLowerCase().includes(this.searchText)
            );
        }

        // 更新筛选计数
        const totalUnassigned = this.getUnassignedCards().length;
        const countEl = document.getElementById('ctl-filter-count');
        if (countEl) {
            const hasFilter = this.filterRarity !== 'all' || this.filterCategory !== 'all' || this.searchText;
            countEl.textContent = hasFilter ? `${unassigned.length}/${totalUnassigned} 张` : `${totalUnassigned} 张`;
            countEl.style.display = '';
        }

        if (unassigned.length === 0) {
            const reason = this.searchText ? '没有匹配的卡牌'
                : (this.filterRarity !== 'all' || this.filterCategory !== 'all') ? '当前筛选条件下没有卡牌'
                : '所有卡牌已分配完毕 🎉';
            container.innerHTML = `<div class="ctl-pool-empty">${reason}</div>`;
            return;
        }

        container.innerHTML = unassigned.map(card => `
            <div class="ctl-pool-card" 
                 draggable="true" 
                 data-id="${card.id}"
                 ondragstart="customTierList.onDragStart(event, '${card.id}')"
                 ondragend="customTierList.onDragEnd(event)"
                 onclick="customTierList.showTierPicker('${card.id}', event)">
                <img src="${card.image}" alt="${card.name}" loading="lazy">
                <span class="ctl-card-name">${card.name}</span>
            </div>
        `).join('');
    }

    renderStats() {
        const el = document.getElementById('ctl-stats');
        if (!el) return;
        const total = this.allJokers.length;
        const assigned = Object.keys(this.cardAssignments).length;
        const tierCounts = this.tiers.map(t =>
            `<span class="ctl-stat-tier" style="color:${this.tierColors[t]}">${t}:${this.getCardsForTier(t).length}</span>`
        ).join(' ');
        el.innerHTML = `已分配 <strong>${assigned}</strong>/${total} ${tierCounts}`;
    }

    // ===== 生成分享图 =====
    async generateShareImage() {
        const assignedCount = Object.keys(this.cardAssignments).length;
        if (assignedCount === 0) {
            alert('还没有分配任何卡牌，先把卡牌拖入档位吧！');
            return;
        }

        // 创建隐藏的 canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 计算布局
        const padding = 40;
        const headerH = 100;
        const tierLabelW = 120;
        const cardW = 52;
        const cardH = 72;
        const cardGap = 6;
        const cardNameH = 16;
        const tierPadding = 12;
        const rowGap = 4;

        // 只渲染有卡牌的档位
        const activeTiers = this.tiers.filter(t => this.getCardsForTier(t).length > 0);

        // 计算每行高度
        const maxCardsPerRow = 12;
        const rowHeights = activeTiers.map(tier => {
            const cards = this.getCardsForTier(tier);
            const rows = Math.ceil(cards.length / maxCardsPerRow) || 1;
            return tierPadding * 2 + rows * (cardH + cardNameH + cardGap);
        });

        const contentW = tierLabelW + maxCardsPerRow * (cardW + cardGap) + padding;
        const canvasW = Math.max(contentW + padding * 2, 800);
        const canvasH = headerH + rowHeights.reduce((s, h) => s + h + rowGap, 0) + padding * 2 + 50;

        canvas.width = canvasW;
        canvas.height = canvasH;

        // 背景
        ctx.fillStyle = '#0d0d14';
        ctx.fillRect(0, 0, canvasW, canvasH);

        // 标题
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px PingFang SC, Microsoft YaHei, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('我的 Balatro 小丑 Tier List', canvasW / 2, padding + 36);

        ctx.fillStyle = '#8888a0';
        ctx.font = '14px PingFang SC, Microsoft YaHei, sans-serif';
        ctx.fillText(`共 ${assignedCount} 张卡牌 · 来自 Balatro 新手助手`, canvasW / 2, padding + 62);

        // 预加载所有图片
        const imageCache = {};
        const loadImage = (src) => new Promise(resolve => {
            if (imageCache[src]) { resolve(imageCache[src]); return; }
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { imageCache[src] = img; resolve(img); };
            img.onerror = () => resolve(null);
            img.src = src;
        });

        // 收集所有需要的图片
        const allImgSrcs = [];
        activeTiers.forEach(tier => {
            this.getCardsForTier(tier).forEach(card => {
                if (card.image) allImgSrcs.push(card.image);
            });
        });
        await Promise.all(allImgSrcs.map(src => loadImage(src)));

        // 绘制每个档位行
        let y = headerH + padding;
        ctx.textAlign = 'left';

        for (let i = 0; i < activeTiers.length; i++) {
            const tier = activeTiers[i];
            const cards = this.getCardsForTier(tier);
            const rowH = rowHeights[i];

            // 档位标签背景
            ctx.fillStyle = this.tierColors[tier];
            ctx.fillRect(padding, y, tierLabelW, rowH);

            // 档位名称
            ctx.fillStyle = '#fff';
            // 根据字符长度动态调整字号
            const tierFontSize = tier.length <= 2 ? 30 : tier.length === 3 ? 24 : 20;
            ctx.font = `bold ${tierFontSize}px PingFang SC, Microsoft YaHei, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(tier, padding + tierLabelW / 2, y + rowH / 2 + 4);
            ctx.font = '11px PingFang SC, sans-serif';
            ctx.fillText(this.tierDescs[tier], padding + tierLabelW / 2, y + rowH / 2 + 24);
            ctx.textAlign = 'left';

            // 卡牌区域背景
            ctx.fillStyle = '#1a1a28';
            ctx.fillRect(padding + tierLabelW, y, canvasW - padding * 2 - tierLabelW, rowH);

            // 绘制卡牌
            let cx = padding + tierLabelW + tierPadding;
            let cy = y + tierPadding;
            let colCount = 0;
            for (const card of cards) {
                if (colCount >= maxCardsPerRow) {
                    cx = padding + tierLabelW + tierPadding;
                    cy += cardH + cardNameH + cardGap;
                    colCount = 0;
                }
                const img = imageCache[card.image];
                if (img) {
                    ctx.drawImage(img, cx, cy, cardW, cardH);
                } else {
                    ctx.fillStyle = '#333';
                    ctx.fillRect(cx, cy, cardW, cardH);
                }
                // 卡牌名
                ctx.fillStyle = '#8888a0';
                ctx.font = '9px PingFang SC, sans-serif';
                ctx.textAlign = 'center';
                const displayName = card.name.length > 5 ? card.name.substring(0, 5) + '..' : card.name;
                ctx.fillText(displayName, cx + cardW / 2, cy + cardH + 12);
                ctx.textAlign = 'left';

                cx += cardW + cardGap;
                colCount++;
            }

            y += rowH + rowGap;
        }

        // 底部水印 — 完整网址
        ctx.fillStyle = '#555566';
        ctx.font = '12px PingFang SC, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🃏 Balatro 新手助手  ·  https://xiaowanmichelle-wq.github.io/balatro-guide/', canvasW / 2, canvasH - 16);

        // 生成图片数据并展示分享结果页
        try {
            const dataUrl = canvas.toDataURL('image/png');
            this.showShareResult(dataUrl, assignedCount);
        } catch (err) {
            console.warn('Canvas toDataURL failed, trying blob:', err);
            canvas.toBlob(blob => {
                if (blob) {
                    const blobUrl = URL.createObjectURL(blob);
                    this.showShareResult(blobUrl, assignedCount);
                }
            }, 'image/png');
        }
    }

    // ===== 分享结果页 =====
    showShareResult(imageUrl, cardCount) {
        this.shareImageUrl = imageUrl;
        const overlay = document.getElementById('ctl-share-result');
        if (!overlay) return;

        // 设置图片
        const img = overlay.querySelector('.ctl-share-img');
        if (img) img.src = imageUrl;

        // 设置文案
        const countEl = overlay.querySelector('.ctl-share-count');
        if (countEl) countEl.textContent = cardCount;

        overlay.classList.add('show');

        // 检测系统分享能力
        const sysShareBtn = overlay.querySelector('.ctl-share-sys-btn');
        if (sysShareBtn) {
            // navigator.share 在支持的浏览器中可用（移动端为主）
            sysShareBtn.style.display = (navigator.share && navigator.canShare) ? '' : 'none';
        }

        // 点击背景关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) this.closeShareResult();
        };
    }

    closeShareResult() {
        const overlay = document.getElementById('ctl-share-result');
        if (overlay) overlay.classList.remove('show');
        // 释放 blob URL（如果是 blob 的话）
        if (this.shareImageUrl && this.shareImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.shareImageUrl);
        }
        this.shareImageUrl = null;
    }

    // 下载分享图
    downloadShareImage() {
        if (!this.shareImageUrl) return;
        const link = document.createElement('a');
        link.download = 'my-balatro-tierlist.png';
        link.href = this.shareImageUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 系统分享（Web Share API）
    async systemShare() {
        if (!this.shareImageUrl) return;
        try {
            // 将 dataUrl/blobUrl 转为 File 对象
            const response = await fetch(this.shareImageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'my-balatro-tierlist.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: '我的 Balatro 小丑 Tier List',
                    text: '来看看我的 Balatro 小丑排名！🃏 快来 https://xiaowanmichelle-wq.github.io/balatro-guide/ 创建你自己的 Tier List 吧～',
                    files: [file]
                });
            } else if (navigator.share) {
                // 不支持文件分享但支持文本分享
                await navigator.share({
                    title: '我的 Balatro 小丑 Tier List',
                    text: '来看看我的 Balatro 小丑排名！🃏',
                    url: 'https://xiaowanmichelle-wq.github.io/balatro-guide/'
                });
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.warn('System share failed:', err);
            }
        }
    }

    // 复制分享文案
    copyShareText() {
        const text = `🃏 我的 Balatro 小丑 Tier List\n\n快来创建你自己的排名吧！\n🔗 https://xiaowanmichelle-wq.github.io/balatro-guide/\n\n#Balatro #TierList #小丑牌 #游戏攻略`;
        navigator.clipboard.writeText(text).then(() => {
            this.showShareToast('✅ 分享文案已复制！');
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            this.showShareToast('✅ 分享文案已复制！');
        });
    }

    showShareToast(msg) {
        const toast = document.getElementById('ctl-share-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

// 全局实例
const customTierList = new CustomTierList();
