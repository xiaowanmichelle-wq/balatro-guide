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
  selectedCards: [],
  jokers: [],
  handLevels: {},
  handCards: [],
  allJokerData: [],
  breakdown: [],
  plasma: false,
  observatory: false
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

  // 检查哪些 Joker 有重触发效果
  let jokerRetriggers = 0;
  state.jokers.forEach(j => {
    if (j.id === 'j_hanging_chad') jokerRetriggers = Math.max(jokerRetriggers, 2); // 首张计分牌额外触发2次
    if (j.id === 'j_sock') jokerRetriggers = Math.max(jokerRetriggers, 1); // 人头牌额外触发1次
    if (j.id === 'j_hack') jokerRetriggers = Math.max(jokerRetriggers, 1); // 2345额外触发1次
  });

  // 遍历计分牌
  scoringCards.forEach((card, cardIdx) => {
    const enh = ENHANCEMENTS.find(e => e.id === card.enhancement) || ENHANCEMENTS[0];
    const edi = EDITIONS.find(e => e.id === card.edition) || EDITIONS[0];
    const seal = SEALS.find(s => s.id === card.seal) || SEALS[0];
    let retriggers = 1 + (seal.retrigger || 0);
    // 未断选票：首张计分牌额外触发
    if (cardIdx === 0 && state.jokers.some(j => j.id === 'j_hanging_chad')) retriggers += 2;
    // 长袜与半身裤：人头牌额外触发
    if (['J','Q','K'].includes(card.rank) && state.jokers.some(j => j.id === 'j_sock')) retriggers += 1;
    // 烂脱口秀演员：2345额外触发
    if (['2','3','4','5'].includes(card.rank) && state.jokers.some(j => j.id === 'j_hack')) retriggers += 1;

    for (let t = 0; t < retriggers; t++) {
      if (!enh.noRank) {
        const rv = RANK_VALUES[card.rank] || 0;
        chips += rv;
        if (t === 0) breakdown.push({label: SUIT_SYMBOLS[card.suit]+card.rank, chips:rv, type:'card'});
      }
      if (enh.chips) { chips += enh.chips; breakdown.push({label: enh.name, chips:enh.chips, type:'enh'}); }
      if (enh.mult) { mult += enh.mult; breakdown.push({label: enh.name, mult:enh.mult, type:'enh'}); }
      if (enh.xmult && enh.xmult > 0) xmultList.push({val:enh.xmult,label:enh.name+' \u00d7'+enh.xmult});
      if (edi.chips) { chips += edi.chips; breakdown.push({label:edi.name, chips:edi.chips, type:'edi'}); }
      if (edi.mult) { mult += edi.mult; breakdown.push({label:edi.name, mult:edi.mult, type:'edi'}); }
      if (edi.xmult && edi.xmult > 0) xmultList.push({val:edi.xmult,label:edi.name+' \u00d7'+edi.xmult});
      if (t > 0) breakdown.push({label: '\u21bb 重触发 #'+(t+1), type:'seal'});
    }
  });

  // 手牌中的钢铁牌提供 ×1.5
  state.handCards.forEach(card => {
    if (card.enhancement === 'steel') {
      xmultList.push({val:1.5, label:SUIT_SYMBOLS[card.suit]+card.rank+' 钢铁牌(手牌) \u00d71.5'});
      breakdown.push({label:SUIT_SYMBOLS[card.suit]+card.rank+' 钢铁牌(手牌中)', type:'hand_steel'});
    }
  });

  // 遍历 Joker（从左到右），支持 Blueprint/Brainstorm
  const jokerEffects = resolveJokerOrder(state.jokers);
  jokerEffects.forEach(({joker, sourceLabel}) => {
    const result = applyJoker(joker, {type, scoringCards, cards, handCards: state.handCards});
    const label = sourceLabel || joker.name;
    if (result.chips) { chips += result.chips; breakdown.push({label:label+' +'+result.chips+'筹码', chips:result.chips, type:'joker'}); }
    if (result.mult) { mult += result.mult; breakdown.push({label:label+' +'+result.mult+'倍率', mult:result.mult, type:'joker'}); }
    if (result.xmult) xmultList.push({val:result.xmult, label:label+' \u00d7'+result.xmult});
  });

  // 应用所有 xmult
  let finalMult = mult;
  xmultList.forEach(x => {
    finalMult *= x.val;
    breakdown.push({label:x.label, xmult:x.val, type:'xmult'});
  });
  finalMult = Math.round(finalMult * 100) / 100;

  // 等离子牌组：筹码和倍率取平均
  if (state.plasma) {
    const avg = Math.round((chips + finalMult) / 2);
    breakdown.push({label: '🟣 等离子牌组：(' + chips + '+' + finalMult + ')/2 = ' + avg, type:'plasma'});
    chips = avg;
    finalMult = avg;
  }

  // 天文台凭证：消耗品中的行星牌×1.5（简化为按已使用行星数）
  // 这里简化处理：如果开启天文台，给每个行星牌等级>1的牌型额外×1.5
  if (state.observatory) {
    let obsCount = 0;
    Object.entries(state.handLevels).forEach(([hid, lv]) => {
      if (lv > 1) obsCount += (lv - 1);
    });
    if (obsCount > 0) {
      const obsX = Math.pow(1.5, Math.min(obsCount, 5));
      finalMult *= obsX;
      finalMult = Math.round(finalMult * 100) / 100;
      breakdown.push({label: '🔭 天文台 \u00d7' + obsX.toFixed(2) + ' (' + obsCount + '级行星牌加成)', xmult: obsX, type:'xmult'});
    }
  }

  const total = Math.round(chips * finalMult);
  state.breakdown = breakdown;
  return {chips, mult: finalMult, total, handName: type.name + ' Lv.' + lv, breakdown};
}

// Blueprint/Brainstorm 解析
function resolveJokerOrder(jokers) {
  const results = [];
  for (let i = 0; i < jokers.length; i++) {
    const j = jokers[i];
    if (j.id === 'j_blueprint') {
      // 复制右侧 Joker
      const right = jokers[i + 1];
      if (right && right.id !== 'j_blueprint' && right.id !== 'j_brainstorm') {
        results.push({joker: right, sourceLabel: '\u{1f4cb} 蓝图\u2192' + right.name});
      }
    } else if (j.id === 'j_brainstorm') {
      // 复制最左侧 Joker
      const left = jokers[0];
      if (left && left.id !== 'j_blueprint' && left.id !== 'j_brainstorm') {
        results.push({joker: left, sourceLabel: '\u{1f9e0} 头脑风暴\u2192' + left.name});
      }
    } else {
      results.push({joker: j, sourceLabel: null});
    }
  }
  return results;
}

// ============ Joker 效果计算 ============
function applyJoker(joker, ctx) {
  const e = joker.effects || {};
  const tags = joker.tags || [];
  let chips = 0, mult = 0, xmult = 0;

  // === 成长型 Joker：使用用户输入的自定义值 ===
  const sc = SCALING_JOKERS[joker.id];
  if (sc && joker._customVal !== undefined) {
    const val = joker._customVal;
    if (sc.field === 'mult') return {chips:0, mult:val, xmult:0};
    if (sc.field === 'chips') return {chips:val, mult:0, xmult:0};
    if (sc.field === 'xmult') return {chips:0, mult:0, xmult: val > 0 ? val : 0};
    return {chips:0, mult:0, xmult:0};
  }

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
  loadFromUrl();
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
  // 石头牌（无花色无点数，+50筹码）
  const stoneBtn = document.createElement('button');
  stoneBtn.className = 'calc-card-btn calc-stone-btn';
  stoneBtn.dataset.suit = 'none';
  stoneBtn.dataset.rank = 'Stone';
  stoneBtn.innerHTML = '<span class="calc-card-rank" style="font-size:0.6rem">石头</span><span class="calc-card-suit" style="color:#95a5a6">\u{1faa8}</span>';
  stoneBtn.title = '石头牌 +50筹码（无花色无点数）';
  stoneBtn.onclick = () => addStoneCard();
  grid.appendChild(stoneBtn);
}

function addStoneCard() {
  if (!heldMode && state.selectedCards.length >= 5) return;
  const card = {suit:'none', rank:'Stone', enhancement:'stone', edition:'none', seal:'none'};
  if (heldMode) {
    state.handCards.push(card);
    renderHeldCards();
  } else {
    state.selectedCards.push(card);
    renderSelectedHand();
  }
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
    const sym = SUIT_SYMBOLS[c.suit] || '\u{1faa8}';
    const color = SUIT_COLORS[c.suit] || '#95a5a6';
    const displayRank = c.rank === 'Stone' ? '石头' : c.rank;
    const enh = ENHANCEMENTS.find(e => e.id === c.enhancement) || ENHANCEMENTS[0];
    const edi = EDITIONS.find(e => e.id === c.edition) || EDITIONS[0];
    const seal = SEALS.find(s => s.id === c.seal) || SEALS[0];
    return '<div class="calc-hand-card">' +
      '<div class="calc-hc-face" style="color:'+color+'"><span class="calc-hc-rank">'+displayRank+'</span><span class="calc-hc-suit">'+sym+'</span></div>' +
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
  state.handCards = [];
  heldMode = false;
  document.querySelectorAll('.calc-card-btn.selected').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.calc-card-btn.held').forEach(b => b.classList.remove('held'));
  renderSelectedHand();
  renderHeldCards();
  renderJokerSlots();
  recalc();
  const mBtn = document.getElementById('calc-held-mode-btn');
  if (mBtn) mBtn.textContent = '切换到：选留手牌模式';
}

// 留手牌模式
let heldMode = false;

function toggleHeldMode() {
  heldMode = !heldMode;
  const btn = document.getElementById('calc-held-mode-btn');
  if (btn) btn.textContent = heldMode ? '当前：留手牌模式 ✋（点击扑克牌添加留手牌）' : '切换到：选留手牌模式';
  // 更新提示
  document.querySelectorAll('.calc-card-btn').forEach(b => {
    b.classList.toggle('held-mode', heldMode);
  });
}

function toggleCard(suit, rank, btn) {
  if (heldMode) {
    // 留手牌模式：每次点击添加一张（允许重复）
    state.handCards.push({suit, rank, enhancement:'none', edition:'none', seal:'none'});
    btn.classList.add('held');
    renderHeldCards();
    recalc();
    return;
  }
  // 打出手牌模式：每次点击添加一张（允许重复，最多5张）
  if (state.selectedCards.length >= 5) return;
  state.selectedCards.push({suit, rank, enhancement:'none', edition:'none', seal:'none'});
  btn.classList.add('selected');
  }
  renderSelectedHand();
  recalc();
}

function renderHeldCards() {
  const area = document.getElementById('calc-held-area');
  if (!area) return;
  if (state.handCards.length === 0) {
    area.innerHTML = '<p class="calc-empty">切换到留手牌模式后点击扑克牌添加</p>';
    return;
  }
  area.innerHTML = state.handCards.map((c, i) => {
    const sym = SUIT_SYMBOLS[c.suit];
    const color = SUIT_COLORS[c.suit];
    return '<div class="calc-hand-card calc-held-card">' +
      '<div class="calc-hc-face" style="color:'+color+'"><span class="calc-hc-rank">'+c.rank+'</span><span class="calc-hc-suit">'+sym+'</span></div>' +
      '<div class="calc-hc-mods">' +
        '<select class="calc-mod-sel" data-idx="'+i+'" data-field="heldEnhancement" onchange="calculator.onHeldModChange(this)">' +
          ENHANCEMENTS.map(e => '<option value="'+e.id+'"'+(c.enhancement===e.id?' selected':'')+'>'+e.name+'</option>').join('') +
        '</select>' +
      '</div>' +
      '<button class="calc-hc-remove" onclick="calculator.removeHeldCard('+i+')">\u2715</button>' +
    '</div>';
  }).join('');
}

function onHeldModChange(sel) {
  const i = parseInt(sel.dataset.idx);
  state.handCards[i].enhancement = sel.value;
  recalc();
}

function removeHeldCard(idx) {
  const c = state.handCards[idx];
  state.handCards.splice(idx, 1);
  document.querySelectorAll('.calc-card-btn').forEach(btn => {
    if (btn.dataset.suit === c.suit && btn.dataset.rank === c.rank) btn.classList.remove('held');
  });
  renderHeldCards();
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
  // 每次添加一个副本（允许重复，如负片/全息等场景）
  state.jokers.push(Object.assign({}, j));
  renderJokerSlots();
  recalc();
  const searchInput = document.getElementById('calc-joker-search');
  if (searchInput) showJokerGrid(searchInput.value);
}

function removeJoker(idx) {
  state.jokers.splice(idx, 1);
  renderJokerSlots();
  recalc();
}

// 成长型 Joker 定义：需要用户输入当前累积值
const SCALING_JOKERS = {
  // +倍率型
  j_spare_trousers: {field:'mult', label:'+倍率', default:0, step:2, desc:'每弃两对+2'},
  j_green: {field:'mult', label:'+倍率', default:0, step:1, desc:'每出牌+1/弃牌-1'},
  j_red_card: {field:'mult', label:'+倍率', default:0, step:3, desc:'每跳过补充包+3'},
  j_swashbuckler: {field:'mult', label:'+倍率', default:0, step:1, desc:'=其他Joker售价总和'},
  j_flash: {field:'mult', label:'+倍率', default:0, step:2, desc:'每次重掷+2'},
  j_fortune_teller: {field:'mult', label:'+倍率', default:0, step:1, desc:'每用塔罗牌+1'},
  j_abstract: {field:'mult', label:'+倍率', default:0, step:3, desc:'每张Joker+3'},
  j_popcorn: {field:'mult', label:'+倍率', default:20, step:4, desc:'起始+20 每轮-4'},
  j_ice_cream: {field:'chips', label:'+筹码', default:100, step:5, desc:'起始+100 每出牌-5'},
  j_mystic_summit: {field:'mult', label:'+倍率', default:15, step:0, desc:'0弃牌时+15'},
  j_banner: {field:'chips', label:'+筹码/弃牌次', default:30, step:0, desc:'每剩余弃牌次+30'},
  j_supernova: {field:'mult', label:'+倍率', default:0, step:1, desc:'=本局打该牌型次数'},
  j_ride_bus: {field:'mult', label:'+倍率', default:0, step:1, desc:'连续不含人头+1'},
  j_runner: {field:'chips', label:'+筹码', default:0, step:15, desc:'每打顺子+15'},
  j_card_sharp: {field:'xmult', label:'\u00d7倍率', default:1, step:0, desc:'重复牌型\u00d73'},
  // +筹码型
  j_wee: {field:'chips', label:'+筹码', default:0, step:8, desc:'每打出A+8'},
  j_castle: {field:'chips', label:'+筹码', default:0, step:3, desc:'每弃对应花色+3'},
  j_bull: {field:'chips', label:'+筹码', default:0, step:2, desc:'每$1加+2筹码'},
  j_square: {field:'chips', label:'+筹码', default:0, step:4, desc:'打满4张时+4'},
  j_stone_joker: {field:'chips', label:'+筹码', default:0, step:25, desc:'每张石头牌+25'},
  j_erosion: {field:'mult', label:'+倍率', default:0, step:4, desc:'牌组每少1张+4'},
  j_hiker: {field:'chips', label:'+筹码', default:0, step:5, desc:'每打出1张牌永久+5'},
  // \u00d7倍率型
  j_hologram: {field:'xmult', label:'\u00d7倍率', default:1, step:0.25, desc:'每添加牌+0.25'},
  j_obelisk: {field:'xmult', label:'\u00d7倍率', default:1, step:0.2, desc:'连续不打最常用牌型+0.2'},
  j_vampire: {field:'xmult', label:'\u00d7倍率', default:1, step:0.1, desc:'吸收增强牌+0.1'},
  j_canio: {field:'xmult', label:'\u00d7倍率', default:1, step:1, desc:'摧毁人头牌+\u00d71'},
  j_yorick: {field:'xmult', label:'\u00d7倍率', default:1, step:1, desc:'每弃23张+\u00d71'},
  j_throwback: {field:'xmult', label:'\u00d7倍率', default:1, step:0.25, desc:'每跳过盲注+0.25'},
  j_glass: {field:'xmult', label:'\u00d7倍率', default:1, step:0.75, desc:'玻璃牌摧毁时+0.75'},
  j_steel_joker: {field:'xmult', label:'\u00d7倍率', default:1, step:0.2, desc:'每张钢铁牌+0.2'},
  j_constellation: {field:'xmult', label:'\u00d7倍率', default:1, step:0.1, desc:'每用行星牌+0.1'},
  j_madness: {field:'xmult', label:'\u00d7倍率', default:1, step:0.5, desc:'小盲/大盲+0.5'},
  j_campfire: {field:'xmult', label:'\u00d7倍率', default:1, step:0.25, desc:'每出售+0.25 Boss重置'},
  j_ramen: {field:'xmult', label:'\u00d7倍率', default:2, step:0.01, desc:'起始\u00d72 每弃-0.01'},
  j_hit_road: {field:'xmult', label:'\u00d7倍率', default:1, step:0.5, desc:'每弃J+0.5 轮末重置'},
  j_idol: {field:'xmult', label:'\u00d7倍率', default:2, step:0, desc:'对应花色点数\u00d72'},
  j_ancient: {field:'xmult', label:'\u00d7倍率', default:1.5, step:0, desc:'对应花色\u00d71.5'},
  j_seltzer: {field:'retrigger', label:'重触发', default:1, step:1, desc:'所有牌重触发'},
  j_dusk: {field:'retrigger', label:'重触发', default:1, step:1, desc:'最后出牌重触发'},
  // 特殊条件型
  j_driver_license: {field:'xmult', label:'\u00d7倍率', default:3, step:0, desc:'16+增强牌\u00d73'},
  j_seeing_double: {field:'xmult', label:'\u00d7倍率', default:2, step:0, desc:'含\u2663+其他花色\u00d72'},
  j_acrobat: {field:'xmult', label:'\u00d7倍率', default:3, step:0, desc:'最后出牌\u00d73'},
  j_stencil: {field:'xmult', label:'\u00d7倍率', default:1, step:1, desc:'每空Joker槽\u00d71'},
  j_lucky_cat: {field:'xmult', label:'\u00d7倍率', default:1, step:0.25, desc:'幸运牌触发+0.25'},
  j_bootstraps: {field:'mult', label:'+倍率', default:0, step:2, desc:'每$5加+2倍率'},
  j_rocket: {field:'money', label:'$', default:1, step:2, desc:'击败Boss+$2'},
  j_turtle_bean: {field:'hand_size', label:'手牌上限', default:5, step:1, desc:'每轮-1'},
};

function renderJokerSlots() {
  const area = document.getElementById('calc-joker-slots');
  if (!area) return;
  if (state.jokers.length === 0) {
    area.innerHTML = '<p class="calc-empty">点击下方「+ 添加 Joker」选择</p>';
    updateOrderTip();
    const dh = document.getElementById('calc-drag-hint');
    if (dh) dh.style.display = 'none';
    return;
  }
  const dh = document.getElementById('calc-drag-hint');
  if (dh) dh.style.display = state.jokers.length > 1 ? 'inline' : 'none';

  area.innerHTML = state.jokers.map((j, i) => {
    const sc = SCALING_JOKERS[j.id];
    let inputHtml = '';
    if (sc) {
      const val = (j._customVal !== undefined) ? j._customVal : sc.default;
      inputHtml = '<div class="calc-jc-scaling">' +
        '<span class="calc-jc-sc-label">' + sc.label + '</span>' +
        '<input type="number" class="calc-jc-sc-input" value="' + val + '" step="' + (sc.step || 1) + '" data-idx="' + i + '" onchange="calculator.onJokerValChange(this)" oninput="calculator.onJokerValChange(this)">' +
        '<span class="calc-jc-sc-desc">' + sc.desc + '</span>' +
      '</div>';
    }
    return '<div class="calc-joker-chip" title="' + j.name + '" draggable="true" data-jidx="' + i + '">' +
      '<div class="calc-jc-drag-handle">\u2630</div>' +
      (j.image ? '<img class="calc-jc-img" src="' + j.image + '" loading="lazy">' : '') +
      inputHtml +
      '<button class="calc-jc-remove" onclick="calculator.removeJoker(' + i + ')">\u2715</button>' +
    '</div>';
  }).join('');

  // 绑定拖拽事件
  area.querySelectorAll('.calc-joker-chip').forEach(el => {
    el.addEventListener('dragstart', onJokerDragStart);
    el.addEventListener('dragover', onJokerDragOver);
    el.addEventListener('drop', onJokerDrop);
    el.addEventListener('dragend', onJokerDragEnd);
  });
  updateOrderTip();
}

// 拖拽排序
let dragJokerIdx = -1;

function onJokerDragStart(e) {
  dragJokerIdx = parseInt(e.currentTarget.dataset.jidx);
  e.currentTarget.classList.add('calc-jc-dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onJokerDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('calc-jc-dragover');
}
function onJokerDrop(e) {
  e.preventDefault();
  const toIdx = parseInt(e.currentTarget.dataset.jidx);
  e.currentTarget.classList.remove('calc-jc-dragover');
  if (dragJokerIdx >= 0 && dragJokerIdx !== toIdx) {
    const moved = state.jokers.splice(dragJokerIdx, 1)[0];
    state.jokers.splice(toIdx, 0, moved);
    renderJokerSlots();
    recalc();
  }
}
function onJokerDragEnd(e) {
  e.currentTarget.classList.remove('calc-jc-dragging');
  document.querySelectorAll('.calc-jc-dragover').forEach(el => el.classList.remove('calc-jc-dragover'));
  dragJokerIdx = -1;
}

// Joker 顺序建议
function updateOrderTip() {
  const tip = document.getElementById('calc-joker-order-tip');
  if (!tip) return;
  if (state.jokers.length < 2) { tip.innerHTML = ''; return; }

  const tips = [];
  const ids = state.jokers.map(j => j.id);
  // 蓝图应该在要复制的 Joker 左边
  if (ids.includes('j_blueprint')) {
    const bi = ids.indexOf('j_blueprint');
    if (bi === ids.length - 1) tips.push('⚠️ 蓝图在最右边没有可复制的 Joker');
  }
  // 头脑风暴复制最左侧
  if (ids.includes('j_brainstorm')) {
    const bsi = ids.indexOf('j_brainstorm');
    if (bsi === 0) tips.push('⚠️ 头脑风暴在最左边会复制自己（无效）');
  }
  // +mult 应在 xmult 左边
  const hasAddMult = state.jokers.some(j => {
    const e = j.effects || {};
    return (typeof e.mult === 'number' && e.mult > 0) || (SCALING_JOKERS[j.id] && SCALING_JOKERS[j.id].field === 'mult');
  });
  const hasXMult = state.jokers.some(j => {
    const e = j.effects || {};
    return (typeof e.xmult === 'number' && e.xmult > 0) || (SCALING_JOKERS[j.id] && SCALING_JOKERS[j.id].field === 'xmult');
  });
  if (hasAddMult && hasXMult) {
    tips.push('💡 建议：+倍率 Joker 放左边，×倍率 Joker 放右边（先加后乘收益最大）');
  }

  tip.innerHTML = tips.map(t => '<div class="calc-order-tip-line">' + t + '</div>').join('');
}

function onJokerValChange(input) {
  const idx = parseInt(input.dataset.idx);
  const val = parseFloat(input.value) || 0;
  state.jokers[idx]._customVal = val;
  recalc();
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
  // 显示/隐藏分享按钮
  const shareEl = document.getElementById('calc-share-actions');
  if (shareEl) shareEl.style.display = result.total > 0 ? 'flex' : 'none';
  // 更新 URL
  saveToUrl();
}

// 分享文案
function copyShareText() {
  const result = calculate();
  if (result.total === 0) return;
  const cards = state.selectedCards.map(c => SUIT_SYMBOLS[c.suit] + c.rank).join(' ');
  const jokers = state.jokers.map(j => j.name).join(', ');
  let text = '🃏 小丑牌计算器\n';
  text += '牌型: ' + result.handName + '\n';
  text += '手牌: ' + cards + '\n';
  if (jokers) text += 'Joker: ' + jokers + '\n';
  text += '筹码 ' + result.chips + ' \u00d7 倍率 ' + result.mult + ' = ' + formatNum(result.total) + '\n';
  text += '\n\U0001f517 https://xiaowanmichelle-wq.github.io/balatro-guide/?tab=calculator';
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('calc-share-toast');
    if (toast) { toast.textContent = '\u2705 已复制！'; setTimeout(() => toast.textContent = '', 2000); }
  }).catch(() => {
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    const toast = document.getElementById('calc-share-toast');
    if (toast) { toast.textContent = '\u2705 已复制！'; setTimeout(() => toast.textContent = '', 2000); }
  });
}

// URL 参数保存/读取
function saveToUrl() {
  if (state.selectedCards.length === 0 && state.jokers.length === 0) return;
  try {
    const data = {
      c: state.selectedCards.map(c => c.suit[0] + c.rank + (c.enhancement !== 'none' ? ':' + c.enhancement : '') + (c.edition !== 'none' ? '.' + c.edition : '') + (c.seal !== 'none' ? '!' + c.seal : '')),
      j: state.jokers.map(j => j.id + (j._customVal !== undefined ? ':' + j._customVal : '')),
      h: state.handCards.map(c => c.suit[0] + c.rank + (c.enhancement !== 'none' ? ':' + c.enhancement : ''))
    };
    const param = btoa(JSON.stringify(data));
    const url = new URL(window.location);
    url.searchParams.set('calc', param);
    url.searchParams.set('tab', 'calculator');
    history.replaceState(null, '', url);
  } catch(e) {}
}

function loadFromUrl() {
  try {
    const url = new URL(window.location);
    const param = url.searchParams.get('calc');
    if (!param) return;
    const data = JSON.parse(atob(param));
    if (data.c && Array.isArray(data.c)) {
      data.c.forEach(s => {
        const suitMap = {s:'spades',h:'hearts',c:'clubs',d:'diamonds'};
        const suit = suitMap[s[0]];
        let rest = s.slice(1);
        let enhancement = 'none', edition = 'none', seal = 'none';
        if (rest.includes('!')) { const p = rest.split('!'); rest = p[0]; seal = p[1]; }
        if (rest.includes('.')) { const p = rest.split('.'); rest = p[0]; edition = p[1]; }
        if (rest.includes(':')) { const p = rest.split(':'); rest = p[0]; enhancement = p[1]; }
        if (suit) state.selectedCards.push({suit, rank: rest, enhancement, edition, seal});
      });
    }
    if (data.j && Array.isArray(data.j)) {
      data.j.forEach(s => {
        const parts = s.split(':');
        const j = allJokerData.find(x => x.id === parts[0]);
        if (j) {
          const copy = Object.assign({}, j);
          if (parts[1]) copy._customVal = parseFloat(parts[1]);
          state.jokers.push(copy);
        }
      });
    }
    if (data.h && Array.isArray(data.h)) {
      data.h.forEach(s => {
        const suitMap = {s:'spades',h:'hearts',c:'clubs',d:'diamonds'};
        const suit = suitMap[s[0]];
        let rest = s.slice(1);
        let enhancement = 'none';
        if (rest.includes(':')) { const p = rest.split(':'); rest = p[0]; enhancement = p[1]; }
        if (suit) state.handCards.push({suit, rank: rest, enhancement, edition:'none', seal:'none'});
      });
    }
    // 高亮选中的牌
    document.querySelectorAll('.calc-card-btn').forEach(btn => {
      const s = btn.dataset.suit, r = btn.dataset.rank;
      if (state.selectedCards.find(c => c.suit === s && c.rank === r)) btn.classList.add('selected');
      if (state.handCards.find(c => c.suit === s && c.rank === r)) btn.classList.add('held');
    });
    renderSelectedHand();
    renderHeldCards();
    renderJokerSlots();
    recalc();
  } catch(e) {}
}

function togglePlasma(checked) { state.plasma = checked; recalc(); }
function toggleObservatory(checked) { state.observatory = checked; recalc(); }

return {
  init, recalc, toggleCard, removeCard, clearAll,
  searchJoker, addJoker, removeJoker, toggleJokerPanel,
  toggleHeldMode, removeHeldCard, onHeldModChange,
  onJokerValChange, copyShareText,
  togglePlasma, toggleObservatory,
  changeLevel, onModChange,
  renderSelectedHand, renderJokerSlots,
  get state() { return state; }
};
})();
