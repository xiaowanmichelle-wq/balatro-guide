// -*- coding: utf-8 -*-
// Balatro 分数计算器
'use strict';

const calculator = (() => {
// ============ 常量 ============
const SUITS = ['spades','hearts','clubs','diamonds'];
const SUIT_SYMBOLS = {spades:'\u2660',hearts:'\u2665',clubs:'\u2663',diamonds:'\u2666'};
const SUIT_NAMES = {spades:'黑桃',hearts:'红桃',clubs:'梅花',diamonds:'方块'};
const SUIT_COLORS = {spades:'#e8e8f0',hearts:'#e74c3c',clubs:'#e8e8f0',diamonds:'#e74c3c'};
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RANK_VALUES = {A:11,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,J:10,Q:10,K:10};
const RANK_ORDER = {A:14,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10,J:11,Q:12,K:13};

const ENHANCEMENTS = [
  {id:'none',name:'无增强',chips:0,mult:0,xmult:0},
  {id:'bonus',name:'奖励 +30筹码',chips:30,mult:0,xmult:0},
  {id:'mult',name:'倍数 +4倍率',chips:0,mult:4,xmult:0},
  {id:'wild',name:'万用 任意花色',chips:0,mult:0,xmult:0,wild:true},
  {id:'glass',name:'玻璃 \u00d72倍率',chips:0,mult:0,xmult:2},
  {id:'steel',name:'钢铁 \u00d71.5倍率',chips:0,mult:0,xmult:1.5},
  {id:'stone',name:'石头 +50筹码',chips:50,mult:0,xmult:0,noRank:true},
  {id:'gold',name:'黄金 +$3',chips:0,mult:0,xmult:0,gold:true},
  {id:'lucky',name:'幸运 概率触发',chips:0,mult:0,xmult:0,lucky:true}
];
const EDITIONS = [
  {id:'none',name:'无版本',chips:0,mult:0,xmult:0},
  {id:'foil',name:'箔 +50筹码',chips:50,mult:0,xmult:0},
  {id:'holo',name:'全息 +10倍率',chips:0,mult:10,xmult:0},
  {id:'polychrome',name:'多色 \u00d71.5倍率',chips:0,mult:0,xmult:1.5}
];
const SEALS = [
  {id:'none',name:'无封印'},
  {id:'red',name:'红印 重触发1次',retrigger:1},
  {id:'blue',name:'蓝印 行星牌'},
  {id:'gold',name:'金印 +$3'},
  {id:'purple',name:'紫印 塔罗牌'}
];

// 牌型定义：基础值 + 每级增长
const HAND_TYPES = [
  {id:'high_card',name:'高牌',baseChips:5,baseMult:1,lvChips:10,lvMult:1,priority:0},
  {id:'one_pair',name:'对子',baseChips:10,baseMult:2,lvChips:15,lvMult:1,priority:1},
  {id:'two_pair',name:'两对',baseChips:20,baseMult:2,lvChips:20,lvMult:1,priority:2},
  {id:'three_of_a_kind',name:'三条',baseChips:30,baseMult:3,lvChips:20,lvMult:2,priority:3},
  {id:'straight',name:'顺子',baseChips:30,baseMult:4,lvChips:30,lvMult:3,priority:4},
  {id:'flush',name:'同花',baseChips:35,baseMult:4,lvChips:15,lvMult:2,priority:5},
  {id:'full_house',name:'葫芦',baseChips:40,baseMult:4,lvChips:25,lvMult:2,priority:6},
  {id:'four_of_a_kind',name:'四条',baseChips:60,baseMult:7,lvChips:30,lvMult:3,priority:7},
  {id:'straight_flush',name:'同花顺',baseChips:100,baseMult:8,lvChips:40,lvMult:4,priority:8},
  {id:'five_of_a_kind',name:'五条',baseChips:120,baseMult:12,lvChips:35,lvMult:3,priority:9},
  {id:'flush_house',name:'同花葫芦',baseChips:140,baseMult:14,lvChips:40,lvMult:4,priority:10},
  {id:'flush_five',name:'同花五条',baseChips:160,baseMult:16,lvChips:40,lvMult:4,priority:11}
];
const HAND_MAP = {};
HAND_TYPES.forEach(h => HAND_MAP[h.id] = h);

// ============ 状态 ============
let state = {
  selectedCards: [],   // [{suit,rank,enhancement,edition,seal}]
  jokers: [],          // [jokerDataObj]
  handLevels: {},      // {hand_id: level}
  handCards: [],       // 留在手牌中的卡牌
  allJokerData: [],
  breakdown: []
};
HAND_TYPES.forEach(h => state.handLevels[h.id] = 1);

// ============ 牌型识别 ============
function detectHand(cards) {
  if (!cards || cards.length === 0) return {type: HAND_MAP.high_card, scoringCards: []};
  const n = cards.length;
  // 统计点数和花色
  const rankCounts = {};
  const suitCounts = {};
  cards.forEach(c => {
    rankCounts[c.rank] = (rankCounts[c.rank]||0) + 1;
    const suits = getCardSuits(c);
    suits.forEach(s => suitCounts[s] = (suitCounts[s]||0) + 1);
  });
  const counts = Object.values(rankCounts).sort((a,b) => b-a);
  // 判断同花
  const isFlush = n >= 5 && Object.values(suitCounts).some(c => c >= 5);
  // 判断顺子
  const isStraight = checkStraight(cards);
  // 按优先级从高到低判断
  if (counts[0] === 5 && isFlush) return tag('flush_five', cards, rankCounts);
  if (counts[0] === 3 && counts[1] === 2 && isFlush) return tag('flush_house', cards, rankCounts);
  if (counts[0] === 5) return tag('five_of_a_kind', cards, rankCounts);
  if (isStraight && isFlush) return tag('straight_flush', cards, rankCounts, true);
  if (counts[0] === 4) return tag('four_of_a_kind', cards, rankCounts);
  if (counts[0] === 3 && counts[1] >= 2) return tag('full_house', cards, rankCounts);
  if (isFlush) return tag('flush', cards, rankCounts, false, true);
  if (isStraight) return tag('straight', cards, rankCounts, true);
  if (counts[0] === 3) return tag('three_of_a_kind', cards, rankCounts);
  if (counts[0] === 2 && counts[1] === 2) return tag('two_pair', cards, rankCounts);
  if (counts[0] === 2) return tag('one_pair', cards, rankCounts);
  return tag('high_card', cards, rankCounts);
}

function getCardSuits(card) {
  if (card.enhancement === 'wild') return [...SUITS];
  return [card.suit];
}

function checkStraight(cards) {
  if (cards.length < 5) return false;
  let orders = [...new Set(cards.map(c => RANK_ORDER[c.rank]))].sort((a,b) => a-b);
  // A 也可以当 1
  if (orders.includes(14)) orders = [...new Set([...orders, 1])].sort((a,b) => a-b);
  for (let i = 0; i <= orders.length - 5; i++) {
    if (orders[i+4] - orders[i] === 4) {
      const needed = new Set();
      for (let j = orders[i]; j <= orders[i+4]; j++) needed.add(j);
      if ([...needed].every(v => orders.includes(v))) return true;
    }
  }
  return false;
}

function tag(handId, cards, rankCounts, isStraightType, isFlushType) {
  const type = HAND_MAP[handId];
  let scoring = [];
  if (isStraightType || isFlushType) {
    scoring = [...cards]; // 顺子/同花所有牌都计分
  } else {
    // 按点数出现次数排序，多的优先计分
    const ranked = Object.entries(rankCounts).sort((a,b) => b[1]-a[1]);
    const scoringRanks = new Set();
    if (handId === 'high_card') {
      // 只有最高牌计分
      const highest = cards.reduce((a,b) => RANK_ORDER[a.rank] > RANK_ORDER[b.rank] ? a : b);
      scoring = [highest];
      return {type, scoringCards: scoring};
    }
    if (handId === 'one_pair') scoringRanks.add(ranked[0][0]);
    else if (handId === 'two_pair') { scoringRanks.add(ranked[0][0]); scoringRanks.add(ranked[1][0]); }
    else if (handId === 'three_of_a_kind') scoringRanks.add(ranked[0][0]);
    else if (handId === 'four_of_a_kind') scoringRanks.add(ranked[0][0]);
    else if (handId === 'full_house') { scoringRanks.add(ranked[0][0]); scoringRanks.add(ranked[1][0]); }
    else if (handId === 'five_of_a_kind' || handId === 'flush_five') scoringRanks.add(ranked[0][0]);
    else if (handId === 'flush_house') { scoringRanks.add(ranked[0][0]); scoringRanks.add(ranked[1][0]); }
    scoring = cards.filter(c => scoringRanks.has(c.rank));
  }
  return {type, scoringCards: scoring};
}

// ============ 计分引擎 ============
function calculate() {
  const cards = state.selectedCards;
  if (cards.length === 0) return {chips:0,mult:0,total:0,handName:'无',breakdown:[]};
  const {type, scoringCards} = detectHand(cards);
  const lv = state.handLevels[type.id] || 1;
  const breakdown = [];
  let chips = type.baseChips + (lv - 1) * type.lvChips;
  let mult = type.baseMult + (lv - 1) * type.lvMult;
  let xmultList = [];
  breakdown.push({label: type.name + ' Lv.' + lv, chips: chips, mult: mult, type:'base'});

  // 遍历计分牌
  scoringCards.forEach(card => {
    const enh = ENHANCEMENTS.find(e => e.id === card.enhancement) || ENHANCEMENTS[0];
    const edi = EDITIONS.find(e => e.id === card.edition) || EDITIONS[0];
    const seal = SEALS.find(s => s.id === card.seal) || SEALS[0];
    const retriggers = 1 + (seal.retrigger || 0);
    for (let t = 0; t < retriggers; t++) {
      // 卡牌点数
      if (!enh.noRank) {
        const rv = RANK_VALUES[card.rank] || 0;
        chips += rv;
        if (t === 0) breakdown.push({label: SUIT_SYMBOLS[card.suit]+card.rank, chips:rv, type:'card'});
      }
      // 增强 chips/mult
      if (enh.chips) { chips += enh.chips; breakdown.push({label: enh.name + ' +' + enh.chips + '筹码', chips:enh.chips, type:'enh'}); }
      if (enh.mult) { mult += enh.mult; breakdown.push({label: enh.name + ' +' + enh.mult + '倍率', mult:enh.mult, type:'enh'}); }
      if (enh.xmult && enh.xmult > 0) { xmultList.push({val:enh.xmult,label:enh.name+' \u00d7'+enh.xmult}); }
      // 版本
      if (edi.chips) { chips += edi.chips; breakdown.push({label:edi.name+' +'+edi.chips+'筹码', chips:edi.chips, type:'edi'}); }
      if (edi.mult) { mult += edi.mult; breakdown.push({label:edi.name+' +'+edi.mult+'倍率', mult:edi.mult, type:'edi'}); }
      if (edi.xmult && edi.xmult > 0) { xmultList.push({val:edi.xmult,label:edi.name+' \u00d7'+edi.xmult}); }
      // 重触发提示
      if (t > 0) breakdown.push({label: '\u21bb 红印重触发', type:'seal'});
    }
  });

  // 遍历 Joker（从左到右）
  state.jokers.forEach(joker => {
    const result = applyJoker(joker, {type, scoringCards, cards, handCards: state.handCards});
    if (result.chips) { chips += result.chips; breakdown.push({label:joker.name+' +'+result.chips+'筹码', chips:result.chips, type:'joker'}); }
    if (result.mult) { mult += result.mult; breakdown.push({label:joker.name+' +'+result.mult+'倍率', mult:result.mult, type:'joker'}); }
    if (result.xmult) { xmultList.push({val:result.xmult, label:joker.name+' \u00d7'+result.xmult}); }
  });

  // 应用所有 xmult
  let finalMult = mult;
  xmultList.forEach(x => {
    finalMult *= x.val;
    breakdown.push({label:x.label, xmult:x.val, type:'xmult'});
  });
  finalMult = Math.round(finalMult * 100) / 100;
  const total = Math.round(chips * finalMult);
  state.breakdown = breakdown;
  return {chips, mult: finalMult, total, handName: type.name + ' Lv.' + lv, breakdown};
}

// ============ Joker 效果计算 ============
function applyJoker(joker, ctx) {
  const e = joker.effects || {};
  const tags = joker.tags || [];
  let chips = 0, mult = 0, xmult = 0;

  // === 无条件效果 ===
  if (!joker.suit && !joker.hand && !e.hand && !e.rank && !e.suit && !(tags.includes('face')) && !(tags.includes('rank'))) {
    if (typeof e.mult === 'number' && !tags.includes('suit') && !tags.includes('hand') && !tags.includes('rank') && !tags.includes('face')) mult = e.mult;
    if (typeof e.chips === 'number' && !tags.includes('suit') && !tags.includes('hand') && !tags.includes('rank') && !tags.includes('face')) chips = e.chips;
    if (typeof e.xmult === 'number' && !tags.includes('suit') && !tags.includes('hand') && !tags.includes('rank') && !tags.includes('face')) xmult = e.xmult;
    if (mult || chips || xmult) return {chips, mult, xmult: xmult || 0};
  }

  // === 花色条件 ===
  if (joker.suit && typeof joker.suit === 'string' && joker.suit !== 'changing') {
    let count = 0;
    ctx.scoringCards.forEach(c => { if (getCardSuits(c).includes(joker.suit)) count++; });
    if (typeof e.mult === 'number') mult = e.mult * count;
    if (typeof e.chips === 'number') chips = e.chips * count;
    if (typeof e.xmult === 'number' && count > 0) xmult = e.xmult;
    return {chips, mult, xmult};
  }

  // === 牌型条件 ===
  const handCond = e.hand || joker.hand;
  if (handCond) {
    const handId = ctx.type.id;
    let match = false;
    if (handCond === 'pair') match = ['one_pair','two_pair','three_of_a_kind','full_house','four_of_a_kind','five_of_a_kind','flush_house','flush_five'].includes(handId);
    else if (handCond === 'three') match = ['three_of_a_kind','full_house','four_of_a_kind','five_of_a_kind','flush_house','flush_five'].includes(handId);
    else if (handCond === 'four') match = ['four_of_a_kind','five_of_a_kind','flush_five'].includes(handId);
    else if (handCond === 'straight') match = ['straight','straight_flush'].includes(handId);
    else if (handCond === 'flush') match = ['flush','straight_flush','flush_house','flush_five'].includes(handId);
    else if (handCond === 'four_suit') {
      const suits = new Set();
      ctx.scoringCards.forEach(c => getCardSuits(c).forEach(s => suits.add(s)));
      match = suits.size >= 4;
    }
    else match = (handId === handCond);
    if (match) {
      if (typeof e.mult === 'number') mult = e.mult;
      if (typeof e.chips === 'number') chips = e.chips;
      if (typeof e.xmult === 'number') xmult = e.xmult;
    }
    return {chips, mult, xmult};
  }

  // === 点数条件 ===
  if (e.rank || tags.includes('rank')) {
    const targetRanks = Array.isArray(e.rank) ? e.rank : [];
    ctx.scoringCards.forEach(c => {
      const rv = RANK_ORDER[c.rank];
      if (targetRanks.includes(rv) || targetRanks.includes(c.rank)) {
        if (typeof e.mult === 'number') mult += e.mult;
        if (typeof e.chips === 'number') chips += e.chips;
      }
    });
    if (typeof e.xmult === 'number' && (mult > 0 || chips > 0)) xmult = e.xmult;
    return {chips, mult, xmult};
  }

  // === 人头牌条件 ===
  if (tags.includes('face')) {
    let count = 0;
    ctx.scoringCards.forEach(c => { if (['J','Q','K'].includes(c.rank)) count++; });
    if (typeof e.mult === 'number') mult = e.mult * count;
    if (typeof e.chips === 'number') chips = e.chips * count;
    if (typeof e.xmult === 'number' && count > 0) xmult = e.xmult;
    // 照片只对第一张
    if (joker.id === 'j_photograph' && count > 0) { mult = 0; chips = 0; xmult = e.xmult || 2; }
    return {chips, mult, xmult};
  }

  return {chips:0, mult:0, xmult:0};
}

// ============ UI 渲染 ============
let allJokerData = [];

function init(jokerData) {
  allJokerData = jokerData.filter(c => c.type === 'joker');
  state.allJokerData = allJokerData;
  renderDeck();
  renderJokerPicker();
  renderHandLevels();
  recalc();
}

function renderDeck() {
  const grid = document.getElementById('calc-deck-grid');
  if (!grid) return;
  grid.innerHTML = '';
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      const btn = document.createElement('button');
      btn.className = 'calc-card-btn';
      btn.dataset.suit = suit;
      btn.dataset.rank = rank;
      const sym = SUIT_SYMBOLS[suit];
      btn.innerHTML = '<span class="calc-card-rank">' + rank + '</span><span class="calc-card-suit" style="color:' + SUIT_COLORS[suit] + '">' + sym + '</span>';
      btn.onclick = () => toggleCard(suit, rank, btn);
      grid.appendChild(btn);
    });
  });
}

function toggleCard(suit, rank, btn) {
  const idx = state.selectedCards.findIndex(c => c.suit===suit && c.rank===rank);
  if (idx >= 0) {
    state.selectedCards.splice(idx, 1);
    btn.classList.remove('selected');
  } else {
    if (state.selectedCards.length >= 5) return;
    state.selectedCards.push({suit, rank, enhancement:'none', edition:'none', seal:'none'});
    btn.classList.add('selected');
  }
  renderSelectedHand();
  recalc();
}

function renderSelectedHand() {
  const area = document.getElementById('calc-hand-area');
  if (!area) return;
  if (state.selectedCards.length === 0) {
    area.innerHTML = '<p class="calc-empty">点击下方扑克牌选择手牌（最多5张）</p>';
    return;
  }
  area.innerHTML = state.selectedCards.map((c, i) => {
    const sym = SUIT_SYMBOLS[c.suit];
    const color = SUIT_COLORS[c.suit];
    const enh = ENHANCEMENTS.find(e => e.id === c.enhancement) || ENHANCEMENTS[0];
    const edi = EDITIONS.find(e => e.id === c.edition) || EDITIONS[0];
    const seal = SEALS.find(s => s.id === c.seal) || SEALS[0];
    return '<div class="calc-hand-card">' +
      '<div class="calc-hc-face" style="color:'+color+'"><span class="calc-hc-rank">'+c.rank+'</span><span class="calc-hc-suit">'+sym+'</span></div>' +
      '<div class="calc-hc-mods">' +
        '<select class="calc-mod-sel" data-idx="'+i+'" data-field="enhancement" onchange="calculator.onModChange(this)">' +
          ENHANCEMENTS.map(e => '<option value="'+e.id+'"'+(c.enhancement===e.id?' selected':'')+'>'+e.name+'</option>').join('') +
        '</select>' +
        '<select class="calc-mod-sel" data-idx="'+i+'" data-field="edition" onchange="calculator.onModChange(this)">' +
          EDITIONS.map(e => '<option value="'+e.id+'"'+(c.edition===e.id?' selected':'')+'>'+e.name+'</option>').join('') +
        '</select>' +
        '<select class="calc-mod-sel" data-idx="'+i+'" data-field="seal" onchange="calculator.onModChange(this)">' +
          SEALS.map(s => '<option value="'+s.id+'"'+(c.seal===s.id?' selected':'')+'>'+s.name+'</option>').join('') +
        '</select>' +
      '</div>' +
      '<button class="calc-hc-remove" onclick="calculator.removeCard('+i+')">\u2715</button>' +
    '</div>';
  }).join('');
}

function onModChange(sel) {
  const i = parseInt(sel.dataset.idx);
  const field = sel.dataset.field;
  state.selectedCards[i][field] = sel.value;
  recalc();
}

function removeCard(idx) {
  const c = state.selectedCards[idx];
  state.selectedCards.splice(idx, 1);
  // 取消高亮
  const btns = document.querySelectorAll('.calc-card-btn');
  btns.forEach(btn => {
    if (btn.dataset.suit === c.suit && btn.dataset.rank === c.rank) btn.classList.remove('selected');
  });
  renderSelectedHand();
  recalc();
}

function clearAll() {
  state.selectedCards = [];
  state.jokers = [];
  document.querySelectorAll('.calc-card-btn.selected').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.calc-joker-slot').forEach(s => s.innerHTML = '<span class="calc-joker-empty">+</span>');
  renderSelectedHand();
  recalc();
}

// Joker 选择器
let jokerPanelOpen = false;

function toggleJokerPanel() {
  jokerPanelOpen = !jokerPanelOpen;
  const panel = document.getElementById('calc-joker-panel');
  const btn = document.getElementById('calc-joker-toggle');
  if (panel) panel.style.display = jokerPanelOpen ? 'block' : 'none';
  if (btn) btn.textContent = jokerPanelOpen ? '收起 Joker 列表' : '+ 添加 Joker';
  if (jokerPanelOpen) showJokerGrid('');
}

function renderJokerPicker() {}

function showJokerGrid(query) {
  const container = document.getElementById('calc-joker-search-results');
  if (!container) return;
  let list = allJokerData;
  if (query && query.length > 0) {
    const q = query.toLowerCase();
    list = allJokerData.filter(j => j.name.toLowerCase().includes(q) || j.id.includes(q) || (j.description||'').toLowerCase().includes(q));
  }
  const shown = list;
  if (shown.length === 0) {
    container.innerHTML = '<p class="calc-empty">没有匹配的 Joker</p>';
    return;
  }
  container.innerHTML = shown.map(j => {
    const inDeck = state.jokers.find(x => x.id === j.id);
    return '<div class="calc-joker-grid-item' + (inDeck ? ' calc-jgi-selected' : '') + '" onclick="calculator.addJoker(\'' + j.id + '\')" title="' + j.name + ': ' + (j.description||'').replace(/"/g,'&quot;') + '">' +
      (j.image ? '<img class="calc-jgi-img" src="' + j.image + '" loading="lazy">' : '<div class="calc-jgi-placeholder">🃏</div>') +
    '</div>';
  }).join('');
}

function searchJoker(query) {
  showJokerGrid(query);
}

function addJoker(id) {
  const j = allJokerData.find(c => c.id === id);
  if (!j) return;
  if (state.jokers.find(x => x.id === id)) {
    // 已有则移除
    state.jokers = state.jokers.filter(x => x.id !== id);
  } else {
    state.jokers.push(j);
  }
  renderJokerSlots();
  recalc();
  // 刷新网格选中状态
  const searchInput = document.getElementById('calc-joker-search');
  if (searchInput) showJokerGrid(searchInput.value);
}

function removeJoker(idx) {
  state.jokers.splice(idx, 1);
  renderJokerSlots();
  recalc();
}

function renderJokerSlots() {
  const area = document.getElementById('calc-joker-slots');
  if (!area) return;
  if (state.jokers.length === 0) {
    area.innerHTML = '<p class="calc-empty">搜索并添加 Joker（最多5张）</p>';
    return;
  }
  area.innerHTML = state.jokers.map((j, i) =>
    '<div class="calc-joker-chip">' +
      (j.image ? '<img class="calc-jc-img" src="'+j.image+'" loading="lazy">' : '') +
      '<span class="calc-jc-name">'+j.name+'</span>' +
      '<button class="calc-jc-remove" onclick="calculator.removeJoker('+i+')">\u2715</button>' +
    '</div>'
  ).join('');
}

// 牌型等级
function renderHandLevels() {
  const area = document.getElementById('calc-hand-levels');
  if (!area) return;
  area.innerHTML = HAND_TYPES.slice(0, 9).map(h => {
    const lv = state.handLevels[h.id] || 1;
    return '<div class="calc-hl-item">' +
      '<span class="calc-hl-name">'+h.name+'</span>' +
      '<button class="calc-hl-btn" onclick="calculator.changeLevel(\''+h.id+'\',-1)">-</button>' +
      '<span class="calc-hl-val" id="calc-hl-'+h.id+'">'+lv+'</span>' +
      '<button class="calc-hl-btn" onclick="calculator.changeLevel(\''+h.id+'\',1)">+</button>' +
    '</div>';
  }).join('');
}

function changeLevel(handId, delta) {
  const cur = state.handLevels[handId] || 1;
  state.handLevels[handId] = Math.max(1, cur + delta);
  const el = document.getElementById('calc-hl-' + handId);
  if (el) el.textContent = state.handLevels[handId];
  recalc();
}

// 重算 + 渲染结果
function recalc() {
  const result = calculate();
  // 结果区
  const nameEl = document.getElementById('calc-result-hand');
  const chipsEl = document.getElementById('calc-result-chips');
  const multEl = document.getElementById('calc-result-mult');
  const totalEl = document.getElementById('calc-result-total');
  const bdEl = document.getElementById('calc-breakdown');
  if (nameEl) nameEl.textContent = result.handName;
  if (chipsEl) chipsEl.textContent = result.chips;
  if (multEl) multEl.textContent = result.mult;
  if (totalEl) {
    let t = result.total;
    if (t >= 1e8) totalEl.textContent = (t/1e8).toFixed(1) + '\u4ebf';
    else if (t >= 1e4) totalEl.textContent = (t/1e4).toFixed(1) + '\u4e07';
    else totalEl.textContent = t;
  }
  // 明细
  if (bdEl) {
    if (result.breakdown.length === 0) {
      bdEl.innerHTML = '<p class="calc-empty">选择手牌后显示计分明细</p>';
    } else {
      bdEl.innerHTML = result.breakdown.map(b => {
        let cls = 'calc-bd-' + b.type;
        let text = b.label;
        if (b.chips) text += ' <span class="bd-chips">+' + b.chips + ' chips</span>';
        if (b.mult) text += ' <span class="bd-mult">+' + b.mult + ' mult</span>';
        if (b.xmult) text += ' <span class="bd-xmult">\u00d7' + b.xmult + ' mult</span>';
        return '<div class="calc-bd-row '+cls+'">'+text+'</div>';
      }).join('');
    }
  }
}

// 格式化大数
function formatNum(n) {
  if (n >= 1e8) return (n/1e8).toFixed(1) + '\u4ebf';
  if (n >= 1e4) return (n/1e4).toFixed(1) + '\u4e07';
  return n.toString();
}

return {
  init, recalc, toggleCard, removeCard, clearAll,
  searchJoker, addJoker, removeJoker, toggleJokerPanel,
  changeLevel, onModChange,
  renderSelectedHand, renderJokerSlots,
  get state() { return state; }
};
})();
