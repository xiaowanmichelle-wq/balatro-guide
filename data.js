// -*- coding: utf-8 -*-
/**
 * Balatro 卡牌数据
 * 包含 Joker, Tarot, Planet, Spectral 所有卡牌
 * 以及卡牌之间的协同关系
 */

const CARD_DATA = {
    // ============ JOKER 卡牌 ============
    // 协同关系定义：synergies 表示与哪些卡牌有配合
    jokers: [
        { id: "j_joker", name: "小丑", rarity: "common", type: "joker", effects: { mult: 4 }, tags: ["mult", "basic"], description: "基础倍率 +4", best_with: ["all"], synergies: [] },
        
        // 花色小丑
        { id: "j_greedy", name: "贪婪小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "diamonds", description: "方块牌 +3 倍率", best_with: ["flush", "straight_flush"], synergies: ["j_lusty", "j_wrathful", "j_gluttonous", "j_flower_pot"] },
        { id: "j_lusty", name: "淫欲小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "hearts", description: "红桃牌 +3 倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_wrathful", "j_gluttonous", "j_bloodstone", "j_flower_pot"] },
        { id: "j_wrathful", name: "愤怒小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "spades", description: "黑桃牌 +3 倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_lusty", "j_gluttonous", "j_arrowhead", "j_flower_pot"] },
        { id: "j_gluttonous", name: "贪吃小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "clubs", description: "梅花牌 +3 倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_lusty", "j_wrathful", "j_onyx", "j_flower_pot"] },
        
        // 牌型小丑 - 倍数
        { id: "j_jolly", name: "快乐小丑", rarity: "common", type: "joker", effects: { mult: 8 }, tags: ["mult", "hand"], hand: "pair", description: "对子 +8 倍率", best_with: ["one_pair"], synergies: ["j_duo", "j_spare_trousers"] },
        { id: "j_zany", name: "疯狂小丑", rarity: "common", type: "joker", effects: { mult: 12 }, tags: ["mult", "hand"], hand: "three_of_a_kind", description: "三条 +12 倍率", best_with: ["three_of_a_kind"], synergies: ["j_trio"] },
        { id: "j_mad", name: "狂热小丑", rarity: "common", type: "joker", effects: { mult: 10 }, tags: ["mult", "hand"], hand: "two_pair", description: "两对 +10 倍率", best_with: ["two_pair"], synergies: ["j_spare_trousers", "j_clever"] },
        { id: "j_crazy", name: "疯狂小丑", rarity: "common", type: "joker", effects: { mult: 12 }, tags: ["mult", "hand"], hand: "straight", description: "顺子 +12 倍率", best_with: ["straight"], synergies: ["j_order", "j_runner", "j_shortcut", "j_superposition"] },
        { id: "j_droll", name: "严肃小丑", rarity: "common", type: "joker", effects: { mult: 10 }, tags: ["mult", "hand"], hand: "flush", description: "同花 +10 倍率", best_with: ["flush"], synergies: ["j_tribe", "j_runner"] },
        
        // 牌型小丑 - 筹码
        { id: "j_sly", name: "狡诈小丑", rarity: "common", type: "joker", effects: { chips: 50 }, tags: ["chips", "hand"], hand: "pair", description: "对子 +50 筹码", best_with: ["one_pair"], synergies: ["j_jolly", "j_duo"] },
        { id: "j_wily", name: "狡猾小丑", rarity: "common", type: "joker", effects: { chips: 100 }, tags: ["chips", "hand"], hand: "three_of_a_kind", description: "三条 +100 筹码", best_with: ["three_of_a_kind"], synergies: ["j_zany", "j_trio"] },
        { id: "j_clever", name: "聪明小丑", rarity: "common", type: "joker", effects: { chips: 80 }, tags: ["chips", "hand"], hand: "two_pair", description: "两对 +80 筹码", best_with: ["two_pair"], synergies: ["j_mad", "j_spare_trousers"] },
        { id: "j_devious", name: "阴险小丑", rarity: "common", type: "joker", effects: { chips: 100 }, tags: ["chips", "hand"], hand: "straight", description: "顺子 +100 筹码", best_with: ["straight"], synergies: ["j_crazy", "j_order", "j_runner"] },
        { id: "j_crafty", name: "精巧小丑", rarity: "common", type: "joker", effects: { chips: 80 }, tags: ["chips", "hand"], hand: "flush", description: "同花 +80 筹码", best_with: ["flush"], synergies: ["j_droll", "j_tribe"] },
        
        // 特殊效果
        { id: "j_half", name: "一半小丑", rarity: "common", type: "joker", effects: { mult: 20 }, tags: ["mult", "hand_size"], description: "3张或更少手牌 +20 倍率", best_with: ["high_card"], synergies: ["j_dna"] },
        { id: "j_stencil", name: "模板小丑", rarity: "rare", type: "joker", effects: { xmult: "slot" }, tags: ["xmult", "scaling"], description: "每空一个Joker位 +1 倍率", best_with: ["all"], synergies: ["j_madness"] },
        { id: "j_four_fingers", name: "四指", rarity: "rare", type: "joker", effects: { special: "four_fingers" }, tags: ["special", "straight_flush"], description: "同花顺可用4张牌组成", best_with: ["straight", "flush", "straight_flush"], synergies: ["j_crazy", "j_droll", "j_order", "j_tribe"] },
        
        // 斐波那契、奇数托德、偶数史蒂文 - 核心协同组合!
        { id: "j_fibonacci", name: "斐波那契", rarity: "rare", type: "joker", effects: { mult: 8, rank: [1, 2, 3, 5, 8] }, tags: ["mult", "rank", "fibonacci"], description: "A,2,3,5,8 +8 倍率", best_with: ["all"], synergies: ["j_even_steven", "j_odd_todd", "j_hack", "j_scholar"], synergy_note: "与偶数史蒂文配合：2、8触发双重效果 | 与奇数托德配合：A、3、5触发双重效果" },
        { id: "j_even_steven", name: "偶数史蒂文", rarity: "common", type: "joker", effects: { mult: 4, rank: [10, 8, 6, 4, 2] }, tags: ["mult", "rank", "even"], description: "偶数牌(10,8,6,4,2) +4 倍率", best_with: ["all"], synergies: ["j_fibonacci"], synergy_note: "与斐波那契配合：2、8触发双重效果" },
        { id: "j_odd_todd", name: "奇数托德", rarity: "common", type: "joker", effects: { chips: 31, rank: [1, 9, 7, 5, 3] }, tags: ["chips", "rank", "odd"], description: "奇数牌(A,9,7,5,3) +31 筹码", best_with: ["all"], synergies: ["j_fibonacci"], synergy_note: "与斐波那契配合：A、3、5触发双重效果" },
        
        // 学者 - A卡相关
        { id: "j_scholar", name: "学者", rarity: "common", type: "joker", effects: { chips: 20, mult: 4, rank: [1] }, tags: ["chips", "mult", "ace"], description: "A +20筹码 +4倍率", best_with: ["all"], synergies: ["j_fibonacci", "j_triboulet", "j_photograph"] },
        
        // 人头牌相关
        { id: "j_scary_face", name: "恐怖脸", rarity: "common", type: "joker", effects: { chips: 30 }, tags: ["chips", "face"], description: "人头牌 +30 筹码", best_with: ["all"], synergies: ["j_photograph", "j_pareidolia", "j_smiley", "j_sock"] },
        { id: "j_photograph", name: "照片", rarity: "common", type: "joker", effects: { xmult: 2, rank: "face", position: "first" }, tags: ["xmult", "face"], description: "第一张人头牌 X2 倍率", best_with: ["all"], synergies: ["j_scary_face", "j_pareidolia", "j_smiley", "j_sock", "j_scholar"] },
        { id: "j_smiley", name: "笑脸", rarity: "common", type: "joker", effects: { mult: 5, rank: "face" }, tags: ["mult", "face"], description: "人头牌 +5 倍率", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_pareidolia", "j_sock"] },
        { id: "j_sock", name: "袜子", rarity: "rare", type: "joker", effects: { special: "reset_face" }, tags: ["special", "face"], description: "重置所有人头牌", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_smiley", "j_pareidolia"] },
        { id: "j_pareidolia", name: "空想性错觉", rarity: "rare", type: "joker", effects: { special: "face" }, tags: ["special", "face"], description: "所有牌视为人头牌", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_smiley", "j_sock", "j_canio"] },
        
        // K/Q 相关
        { id: "j_baron", name: "男爵", rarity: "legendary", type: "joker", effects: { xmult: "king", value: 1.5 }, tags: ["xmult", "rank"], description: "每张K X1.5 倍率", best_with: ["all"], synergies: ["j_triboulet", "j_shoot_moon"] },
        { id: "j_triboulet", name: "特里布莱", rarity: "legendary", type: "joker", effects: { xmult: "king_queen", value: 2 }, tags: ["xmult", "rank"], description: "K和Q各 X2", best_with: ["all"], synergies: ["j_baron", "j_shoot_moon", "j_scholar"] },
        { id: "j_shoot_moon", name: "射月", rarity: "common", type: "joker", effects: { mult: "queen" }, tags: ["mult", "rank"], description: "每张Q +13 倍率", best_with: ["all"], synergies: ["j_baron", "j_triboulet"] },
        
        // J相关
        { id: "j_hit_road", name: "赶路", rarity: "legendary", type: "joker", effects: { xmult: "discard_j", value: 0.5 }, tags: ["xmult", "rank", "discard"], description: "每弃J X0.5", best_with: ["all"], synergies: ["j_canio", "j_drunkard", "j_merry_andy"], synergy_note: "醉汉/快乐安迪增加弃牌次数，加速赶路倍率累积" },
        { id: "j_canio", name: "卡尼奥", rarity: "legendary", type: "joker", effects: { xmult: "destroy_face" }, tags: ["xmult", "destroy", "face"], description: "人头牌摧毁+X1", best_with: ["all"], synergies: ["j_hit_road", "j_pareidolia"] },
        
        // 10/4 相关
        { id: "j_walkie", name: "对讲机", rarity: "common", type: "joker", effects: { chips: 10, mult: 4, rank: [10, 4] }, tags: ["chips", "mult", "rank"], description: "10或4 +10筹码 +4倍率", best_with: ["all"], synergies: ["j_even_steven"], synergy_note: "4可触发偶数史蒂文效果" },
        
        // 牌型倍率组合
        { id: "j_duo", name: "二重奏", rarity: "legendary", type: "joker", effects: { xmult: 2, hand: "pair" }, tags: ["xmult", "hand"], description: "对子 X2", best_with: ["one_pair"], synergies: ["j_jolly"] },
        { id: "j_trio", name: "三重奏", rarity: "legendary", type: "joker", effects: { xmult: 3, hand: "three" }, tags: ["xmult", "hand"], description: "三条 X3", best_with: ["three_of_a_kind"], synergies: ["j_zany"] },
        { id: "j_family", name: "一家四口", rarity: "legendary", type: "joker", effects: { xmult: 4, hand: "four" }, tags: ["xmult", "hand"], description: "四条 X4", best_with: ["four_of_a_kind"], synergies: ["j_trio"] },
        { id: "j_order", name: "秩序", rarity: "legendary", type: "joker", effects: { xmult: 3, hand: "straight" }, tags: ["xmult", "hand"], description: "顺子 X3", best_with: ["straight"], synergies: ["j_crazy"] },
        { id: "j_tribe", name: "部落", rarity: "legendary", type: "joker", effects: { xmult: 2, hand: "flush" }, tags: ["xmult", "hand"], description: "同花 X2", best_with: ["flush"], synergies: ["j_droll"] },
        
        // 花色组合
        { id: "j_flower_pot", name: "花盆", rarity: "rare", type: "joker", effects: { xmult: 3, hand: "four_suit" }, tags: ["xmult", "hand"], description: "四花都有 X3 倍率", best_with: ["all"], synergies: ["j_greedy", "j_lusty", "j_wrathful", "j_gluttonous"] },
        { id: "j_blackboard", name: "黑板", rarity: "rare", type: "joker", effects: { xmult: 3, suit: ["spades", "clubs"] }, tags: ["xmult", "suit"], description: "全黑桃/梅花 X3 倍率", best_with: ["all"], synergies: ["j_wrathful", "j_gluttonous", "j_arrowhead", "j_onyx"] },
        { id: "j_bloodstone", name: "血石", rarity: "rare", type: "joker", effects: { xmult: 1.5, suit: "hearts", chance: 0.5 }, tags: ["xmult", "suit", "chance"], description: "红桃1/2几率X1.5", best_with: ["flush"], synergies: ["j_lusty", "j_gros_michel"] },
        { id: "j_arrowhead", name: "箭头", rarity: "rare", type: "joker", effects: { chips: 50, suit: "spades" }, tags: ["chips", "suit"], description: "黑桃 +50 筹码", best_with: ["straight", "flush"], synergies: ["j_wrathful", "j_blackboard"], unlock: "牌组中拥有至少30张黑桃" },
        { id: "j_onyx", name: "缟玛瑙", rarity: "rare", type: "joker", effects: { mult: 7, suit: "clubs" }, tags: ["mult", "suit"], description: "梅花 +7 倍率", best_with: ["flush"], synergies: ["j_gluttonous", "j_blackboard"] },
        { id: "j_rough_gem", name: "粗宝石", rarity: "rare", type: "joker", effects: { economy: "diamonds", value: 1 }, tags: ["economy", "suit"], description: "方块牌+$1", best_with: ["flush", "straight_flush"], synergies: ["j_greedy"] },
        
        // 抽牌/弃牌相关
        { id: "j_burglar", name: "窃贼", rarity: "rare", type: "joker", effects: { draw: 3, lose_discards: true }, tags: ["draw", "discard"], description: "+3手牌，失去所有弃牌", best_with: ["all"], synergies: ["j_ramen", "j_mystic_summit", "j_delayed", "j_green"] },
        { id: "j_drunkard", name: "醉汉", rarity: "common", type: "joker", effects: { discard: 1 }, tags: ["discard"], description: "每回合+1弃牌", best_with: ["all"], synergies: ["j_merry_andy"] },
        { id: "j_merry_andy", name: "快乐的安迪", rarity: "rare", type: "joker", effects: { discard: 3, hand_size: -1 }, tags: ["discard", "hand_size"], description: "+3弃牌，手牌-1", best_with: ["all"], synergies: ["j_drunkard"] },
        
        // 经济相关
        { id: "j_golden", name: "黄金小丑", rarity: "common", type: "joker", effects: { economy: 4 }, tags: ["economy"], description: "回合结束+$4", best_with: ["all"], synergies: ["j_to_moon", "j_rocket"] },
        { id: "j_rocket", name: "火箭", rarity: "rare", type: "joker", effects: { economy: 1, economy_boss: 2 }, tags: ["economy", "boss"], description: "回合$1，击败Boss+$2", best_with: ["all"], synergies: ["j_golden", "j_to_moon"] },
        { id: "j_to_moon", name: "登月", rarity: "rare", type: "joker", effects: { economy: "interest" }, tags: ["economy", "interest"], description: "$5以上每$1利息+$1", best_with: ["all"], synergies: ["j_golden", "j_rocket"] },
        
        // 复制类
        { id: "j_blueprint", name: "蓝图", rarity: "legendary", type: "joker", effects: { special: "copy_right" }, tags: ["special", "copy"], description: "复制右侧Joker", best_with: ["all"], synergies: ["j_brainstorm"] },
        { id: "j_brainstorm", name: "头脑风暴", rarity: "legendary", type: "joker", effects: { special: "copy_left" }, tags: ["special", "copy"], description: "复制最左侧Joker", best_with: ["all"], synergies: ["j_blueprint"] },
        
        // 抽象/计数类
        { id: "j_abstract", name: "抽象小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "joker_count"], description: "每张Joker +3 倍率", best_with: ["all"], synergies: ["j_riff_raff", "j_cartomancer"] },
        
        // 抽卡相关
        { id: "j_cartomancer", name: "占卜师", rarity: "rare", type: "joker", effects: { special: "create_tarot" }, tags: ["special", "tarot"], description: "盲注创造塔罗牌", best_with: ["all"], synergies: ["j_abstract", "j_fortune_teller"] },
        { id: "j_fortune_teller", name: "算命师", rarity: "common", type: "joker", effects: { mult: "tarot" }, tags: ["mult", "tarot"], description: "每张塔罗牌 +1 倍率", best_with: ["all"], synergies: ["j_cartomancer", "j_constellation"] },
        { id: "j_constellation", name: "星座", rarity: "rare", type: "joker", effects: { xmult: "planet" }, tags: ["xmult", "planet"], description: "每张行星牌 +0.1 倍率", best_with: ["all"], synergies: ["j_fortune_teller", "j_astronomer", "j_satellite"] },
        
        // 顺子相关
        { id: "j_superposition", name: "叠加", rarity: "common", type: "joker", effects: { special: "tarot" }, tags: ["special", "tarot", "straight"], description: "顺子产生塔罗牌", best_with: ["straight"], synergies: ["j_crazy", "j_shortcut", "j_runner"] },
        { id: "j_shortcut", name: "捷径", rarity: "rare", type: "joker", effects: { special: "straight_gap" }, tags: ["special", "straight"], description: "顺子允许1点空隙", best_with: ["straight"], synergies: ["j_crazy", "j_superposition", "j_runner"] },
        { id: "j_runner", name: "奔跑者", rarity: "common", type: "joker", effects: { chips: 15, hand: "straight" }, tags: ["chips", "hand"], description: "顺子 +15 筹码", best_with: ["straight"], synergies: ["j_crazy", "j_order", "j_superposition", "j_shortcut"] },
        { id: "j_ice_cream", name: "冰淇淋", rarity: "common", type: "joker", effects: { chips: 100, chips_decay: 5 }, tags: ["chips", "decay"], description: "+100筹码，每手牌-5", best_with: ["all"], synergies: [], synergy_note: "高初始筹码但逐渐衰减，适合早期爆发" },
        
        // 基础卡牌（无特殊协同）
        { id: "j_mime", name: "模仿小丑", rarity: "rare", type: "joker", effects: { special: "mime" }, tags: ["special", "scoring"], description: "重置手牌能力", best_with: ["all"], synergies: ["j_seltzer", "j_dusk"] },
        { id: "j_credit_card", name: "信用卡", rarity: "common", type: "joker", effects: { special: "credit" }, tags: ["economy", "debt"], description: "允许负债至 -$20", best_with: ["all"], synergies: ["j_golden", "j_to_moon"] },
        { id: "j_ceremonial", name: "祭祀匕首", rarity: "rare", type: "joker", effects: { mult: "destroy_right", permanent: true }, tags: ["mult", "destroy", "boss"], description: "击败Boss时摧毁右侧Joker，将其出售价值双倍永久加到倍率", best_with: ["all"], synergies: ["j_campfire", "j_riff_raff", "j_madness"], synergy_note: "篝火出售增值，流浪汉补充Joker，与疯狂摧毁体系配合" },
        { id: "j_banner", name: "旗帜", rarity: "common", type: "joker", effects: { chips: "discard" }, tags: ["chips", "discard"], description: "每剩余弃牌 +30 筹码", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_mystic_summit", name: "神秘山峰", rarity: "common", type: "joker", effects: { mult: 15 }, tags: ["mult", "discard"], description: "0弃牌时 +15 倍率", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除所有弃牌，使神秘山峰始终保持+15倍率" },
        { id: "j_marble", name: "大理石小丑", rarity: "rare", type: "joker", effects: { special: "stone" }, tags: ["special", "deck"], description: "盲注时加入石头牌", best_with: ["all"], synergies: ["j_stone"] },
        { id: "j_loyalty", name: "忠诚卡", rarity: "rare", type: "joker", effects: { xmult: 4, trigger: 6 }, tags: ["xmult", "timing"], description: "每6手牌 X4 倍率", best_with: ["all"], synergies: ["j_seltzer"] },
        { id: "j_8ball", name: "8号球", rarity: "common", type: "joker", effects: { special: "tarot_chance", chance: 0.25 }, tags: ["special", "tarot"], description: "打出8有1/4概率获塔罗牌", best_with: ["all"], synergies: ["j_fibonacci", "j_even_steven"] },
        { id: "j_misprint", name: "印刷错误", rarity: "common", type: "joker", effects: { mult: "random_23" }, tags: ["mult", "random"], description: "随机 +0-23 倍率", best_with: ["all"], synergies: [] },
        { id: "j_dusk", name: "黄昏", rarity: "rare", type: "joker", effects: { special: "dusk" }, tags: ["special", "scoring", "rescore"], description: "重置最后两手牌", best_with: ["all"], synergies: ["j_hanging_chad", "j_abstract"], synergy_note: "配合挂着的查德最大化重复打出，配合抽象小丑增加倍率" },
        { id: "j_raised_fist", name: "举起拳头", rarity: "common", type: "joker", effects: { mult: "lowest" }, tags: ["mult", "hand"], description: "最低牌数值×2 加到倍率", best_with: ["all"], synergies: [] },
        { id: "j_chaos", name: "混乱小丑", rarity: "common", type: "joker", effects: { special: "reroll" }, tags: ["special", "shop"], description: "商店免费重掷1次", best_with: ["all"], synergies: ["j_astronomer"] },
        { id: "j_steel", name: "钢铁小丑", rarity: "rare", type: "joker", effects: { xmult: "steel" }, tags: ["xmult", "steel"], description: "每张钢卡 +0.2 倍率", best_with: ["all"], synergies: ["t_chariot"] },
        { id: "j_delayed", name: "延迟满足", rarity: "common", type: "joker", effects: { economy: "discard" }, tags: ["economy", "discard"], description: "未用弃牌时每张+$2", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除所有弃牌，使延迟满足始终获得最高$收益" },
        { id: "j_hack", name: "黑客", rarity: "rare", type: "joker", effects: { special: "hack" }, tags: ["special", "rank"], description: "重置2,3,4,5", best_with: ["all"], synergies: ["j_fibonacci", "j_walkie"] },
        { id: "j_gros_michel", name: "大麦克", rarity: "common", type: "joker", effects: { mult: 15 }, tags: ["mult", "risky"], description: "+15 倍率，1/6几率摧毁", best_with: ["all"], synergies: ["j_bloodstone"] },
        { id: "j_business_card", name: "名片", rarity: "common", type: "joker", effects: { economy: "face", chance: 0.5 }, tags: ["economy", "face"], description: "人头牌1/2几率+$2", best_with: ["all"], synergies: ["j_pareidolia", "j_midas"] },
        { id: "j_supernova", name: "超新星", rarity: "common", type: "joker", effects: { mult: "hand_used" }, tags: ["mult", "scaling"], description: "牌型使用次数加到倍率", best_with: ["all"], synergies: ["j_space"] },
        { id: "j_ride_bus", name: "搭便车", rarity: "common", type: "joker", effects: { mult: "consecutive" }, tags: ["mult", "consecutive"], description: "连续非人头手牌 +1 倍率", best_with: ["all"], synergies: [] },
        { id: "j_space", name: "太空小丑", rarity: "rare", type: "joker", effects: { special: "upgrade", chance: 0.25 }, tags: ["special", "upgrade"], description: "1/4几率升级牌型", best_with: ["all"], synergies: ["j_supernova", "j_oops_6"] },
        { id: "j_egg", name: "蛋", rarity: "common", type: "joker", effects: { economy: 3 }, tags: ["economy"], description: "回合结束+$3", best_with: ["all"], synergies: ["j_golden", "j_to_moon"] },
        { id: "j_dna", name: "DNA", rarity: "legendary", type: "joker", effects: { special: "copy" }, tags: ["special", "copy"], description: "单张手牌复制", best_with: ["high_card"], synergies: ["j_half"], unlock: "在回合第一手只打出1张牌" },
        { id: "j_splash", name: "飞溅", rarity: "common", type: "joker", effects: { special: "splash" }, tags: ["special", "scoring"], description: "所有打出的牌都计分", best_with: ["all"], synergies: ["j_photograph", "j_scary_face"] },
        { id: "j_blue", name: "蓝小丑", rarity: "common", type: "joker", effects: { chips: "deck_remaining" }, tags: ["chips", "deck"], description: "每剩余牌 +2 筹码", best_with: ["all"], synergies: [] },
        { id: "j_sixth_sense", name: "第六感", rarity: "rare", type: "joker", effects: { special: "soul" }, tags: ["special", "soul"], description: "首张6创造灵魂牌", best_with: ["all"], synergies: ["j_seance", "j_fortune_teller"] },
        { id: "j_hiker", name: "徒步者", rarity: "rare", type: "joker", effects: { chips: "permanent_5" }, tags: ["chips", "permanent"], description: "每打出的牌永久+5筹码", best_with: ["all"], synergies: ["j_splash"] },
        { id: "j_faceless", name: "无脸小丑", rarity: "common", type: "joker", effects: { economy: "face_discard", count: 3 }, tags: ["economy", "discard"], description: "弃3张人头牌+$5", best_with: ["all"], synergies: ["j_pareidolia", "j_drunkard", "j_merry_andy"] },
        { id: "j_green", name: "绿色小丑", rarity: "common", type: "joker", effects: { mult: "play", mult_neg: "discard" }, tags: ["mult", "play", "discard"], description: "每手+1倍率，每弃-1倍率", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除弃牌次数，使绿色小丑不会因弃牌扣倍率" },
        { id: "j_todo", name: "待办清单", rarity: "common", type: "joker", effects: { economy: "hand", hand: "changing" }, tags: ["economy", "hand"], description: "特定牌型+$4", best_with: ["all"], synergies: [] },
        { id: "j_cavendish", name: "卡文迪什", rarity: "common", type: "joker", effects: { xmult: 3, destroy_chance: 0.001 }, tags: ["xmult", "risky"], description: "X3倍率，1/1000几率摧毁（大麦克灭绝后出现）", best_with: ["all"], synergies: ["j_oops_6"], exclusive_with: "j_gros_michel", unlock: "当前对局中大麦克自毁后出现" },
        { id: "j_card_sharp", name: "老千", rarity: "rare", type: "joker", effects: { xmult: 3, hand: "repeat" }, tags: ["xmult", "hand"], description: "本回合重复牌型 X3", best_with: ["all"], synergies: ["j_hanging_chad", "j_dusk"] },
        { id: "j_red", name: "红小丑", rarity: "common", type: "joker", effects: { mult: "skip", count: 3 }, tags: ["mult", "skip"], description: "跳过增强包+3倍率", best_with: ["all"], synergies: ["j_throwback"] },
        { id: "j_madness", name: "疯狂", rarity: "rare", type: "joker", effects: { xmult: 0.5, destroy: "random" }, tags: ["xmult", "destroy"], description: "小盲/大盲 X0.5 摧毁随机Joker", best_with: ["all"], synergies: ["j_abstract"], synergy_note: "每回合摧毁Joker，抽象小丑获得额外倍率" },
        { id: "j_square", name: "方块小丑", rarity: "common", type: "joker", effects: { chips: 4, hand_size: 4 }, tags: ["chips", "hand_size"], description: "4张手牌 +4 筹码", best_with: ["all"], synergies: ["j_turtle_bean", "j_juggler"] },
        { id: "j_seance", name: "降灵会", rarity: "rare", type: "joker", effects: { special: "spectral" }, tags: ["special", "spectral", "flush"], description: "同花顺产生灵魂牌", best_with: ["straight_flush"], synergies: ["j_fortune_teller", "j_constellation"] },
        { id: "j_riff_raff", name: "流浪汉", rarity: "common", type: "joker", effects: { special: "create_joker", count: 2 }, tags: ["special", "create"], description: "盲注创造2张普通Joker", best_with: ["all"], synergies: ["j_abstract"] },
        { id: "j_vampire", name: "吸血鬼", rarity: "rare", type: "joker", effects: { xmult: "augment", chance: 0.1 }, tags: ["xmult", "augment"], description: "增强牌 X0.1 倍率", best_with: ["all"], synergies: ["j_glass", "t_justice"], synergy_note: "与玻璃小丑/正义配合：玻璃卡被销毁时触发双重倍率" },
        { id: "j_hologram", name: "全息", rarity: "rare", type: "joker", effects: { xmult: "card_added", value: 0.25 }, tags: ["xmult", "deck"], description: "每加入牌组 +0.25 倍率", best_with: ["all"], synergies: ["j_tarot", "j_planet"] },
        { id: "j_vagabond", name: "流浪者", rarity: "legendary", type: "joker", effects: { special: "tarot", cost: 4 }, tags: ["special", "tarot"], description: "$4或更少产生塔罗牌", best_with: ["all"], synergies: ["j_fortune_teller", "j_constellation", "j_cartomancer"], unlock: "手持$4或更少时打出牌" },
        { id: "j_cloud9", name: "云9", rarity: "rare", type: "joker", effects: { economy: "nine" }, tags: ["economy", "rank"], description: "每张9 $1", best_with: ["all"], synergies: ["j_to_moon"] },
        { id: "j_obelisk", name: "方尖碑", rarity: "legendary", type: "joker", effects: { xmult: "uncommon_hand", value: 0.2 }, tags: ["xmult", "hand"], description: "非常用牌型 X0.2 倍率", best_with: ["all"], synergies: ["j_straight", "j_tribe", "j_two_pair"] },
        { id: "j_midas", name: "迈达斯", rarity: "rare", type: "joker", effects: { special: "gold" }, tags: ["special", "gold", "face"], description: "人头牌变金卡", best_with: ["all"], synergies: ["j_golden_ticket", "j_pareidolia"] },
        { id: "j_luchador", name: "墨西哥摔跤手", rarity: "rare", type: "joker", effects: { special: "disable_boss" }, tags: ["special", "boss"], description: "出售禁用Boss效果", best_with: ["all"], synergies: ["j_chicot"] },
        { id: "j_gift_card", name: "礼品卡", rarity: "rare", type: "joker", effects: { economy: "selling" }, tags: ["economy"], description: "Joker/消耗卡+$1", best_with: ["all"], synergies: ["j_campfire"] },
        { id: "j_turtle_bean", name: "龟豆", rarity: "rare", type: "joker", effects: { hand_size: 5 }, tags: ["hand_size"], description: "手牌+5，每回合-1", best_with: ["all"], synergies: ["j_juggler", "j_square"] },
        { id: "j_erosion", name: "侵蚀", rarity: "rare", type: "joker", effects: { mult: "lower_cards" }, tags: ["mult", "deck"], description: "低点数牌 +4 倍率", best_with: ["all"], synergies: ["j_fibonacci"] },
        { id: "j_reserved", name: "预留停车", rarity: "common", type: "joker", effects: { economy: "face_hand", chance: 0.5 }, tags: ["economy", "face"], description: "人头牌1/2几率+$1", best_with: ["all"], synergies: ["j_pareidolia"] },
        { id: "j_mail_in", name: "邮件返利", rarity: "common", type: "joker", effects: { economy: "rank_discard", rank: "changing" }, tags: ["economy", "discard"], description: "弃特定牌$5", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_hallucination", name: "幻觉", rarity: "common", type: "joker", effects: { special: "tarot", chance: 0.5 }, tags: ["special", "tarot"], description: "开包1/2几率塔罗牌", best_with: ["all"], synergies: ["j_cartomancer", "j_fortune_teller"] },
        { id: "j_juggler", name: "杂耍小丑", rarity: "common", type: "joker", effects: { hand_size: 1 }, tags: ["hand_size"], description: "手牌+1", best_with: ["all"], synergies: ["j_turtle_bean", "j_troubadour"] },
        { id: "j_stone", name: "石头小丑", rarity: "rare", type: "joker", effects: { chips: "stone" }, tags: ["chips", "stone"], description: "每张石头牌 +25 筹码", best_with: ["all"], synergies: ["j_marble"] },
        { id: "j_lucky_cat", name: "幸运猫", rarity: "rare", type: "joker", effects: { xmult: "lucky", value: 0.25 }, tags: ["xmult", "lucky"], description: "每触发幸运卡+0.25倍率", best_with: ["all"], synergies: ["t_magician", "j_oops_6"] },
        { id: "j_baseball", name: "棒球卡", rarity: "legendary", type: "joker", effects: { xmult: "rare_joker", value: 1.5 }, tags: ["xmult", "rare"], description: "每稀有Joker X1.5", best_with: ["all"], synergies: [] },
        { id: "j_bull", name: "公牛", rarity: "rare", type: "joker", effects: { chips: "money", value: 2 }, tags: ["chips", "economy"], description: "每$1 +2 筹码", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_bootstraps"] },
        { id: "j_diet_cola", name: "健怡可乐", rarity: "rare", type: "joker", effects: { special: "double" }, tags: ["special", "double"], description: "出售创造免费双倍", best_with: ["all"], synergies: ["j_campfire"] },
        { id: "j_trading", name: "交易卡", rarity: "rare", type: "joker", effects: { economy: "single_discard", value: 3 }, tags: ["economy", "discard"], description: "单张弃牌+$3", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_flash", name: "闪卡", rarity: "rare", type: "joker", effects: { mult: "reroll" }, tags: ["mult", "shop"], description: "商店重掷+2倍率", best_with: ["all"], synergies: ["j_chaos"] },
        { id: "j_popcorn", name: "爆米花", rarity: "common", type: "joker", effects: { mult: 20, mult_decay: 4 }, tags: ["mult", "decay"], description: "+20倍率，每回合-4", best_with: ["all"], synergies: [] },
        { id: "j_spare_trousers", name: "备用裤", rarity: "rare", type: "joker", effects: { mult: "two_pair" }, tags: ["mult", "hand"], hand: "two_pair", description: "两对 +2 倍率", best_with: ["two_pair"], synergies: ["j_jolly"] },
        { id: "j_ancient", name: "古老小丑", rarity: "legendary", type: "joker", effects: { xmult: 1.5, suit: "changing" }, tags: ["xmult", "suit", "changing"], description: "特定花色 X1.5 倍率", best_with: ["all"], synergies: ["j_smeared"] },
        { id: "j_ramen", name: "拉面", rarity: "rare", type: "joker", effects: { xmult: 2, mult_neg: "discard" }, tags: ["xmult", "discard"], description: "X2倍率，每弃-X0.01", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除所有弃牌次数，使拉面保持满倍率" },
        { id: "j_seltzer", name: "苏打水", rarity: "rare", type: "joker", effects: { special: "reset", count: 10 }, tags: ["special", "reset"], description: "10手牌重置所有牌", best_with: ["all"], synergies: ["j_hack", "j_hanging_chad"] },
        { id: "j_castle", name: "城堡", rarity: "rare", type: "joker", effects: { chips: "suit_discard", suit: "changing" }, tags: ["chips", "discard", "suit"], description: "弃特定花色+3筹码", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_campfire", name: "篝火", rarity: "legendary", type: "joker", effects: { xmult: "sell", value: 0.25 }, tags: ["xmult", "sell", "boss"], description: "每出售+X0.25，Boss重置", best_with: ["all"], synergies: ["j_gift_card", "j_diet_cola"] },
        { id: "j_golden_ticket", name: "黄金票", rarity: "common", type: "joker", effects: { economy: "gold" }, tags: ["economy", "gold"], description: "金卡+$4", best_with: ["all"], synergies: ["j_midas"] },
        { id: "j_mr_bones", name: "骨头先生", rarity: "rare", type: "joker", effects: { special: "survive" }, tags: ["special", "survive"], description: "25%血量防止死亡", best_with: ["all"], synergies: [], unlock: "输掉5局游戏" },
        { id: "j_acrobat", name: "杂技演员", rarity: "rare", type: "joker", effects: { xmult: 3, position: "last" }, tags: ["xmult", "position"], description: "最后一手 X3 倍率", best_with: ["all"], synergies: ["j_dusk"] },
        { id: "j_swashbuckler", name: "海盗", rarity: "common", type: "joker", effects: { mult: "sell_value" }, tags: ["mult", "sell"], description: "Joker出售值加到倍率", best_with: ["all"], synergies: ["j_campfire"] },
        { id: "j_troubadour", name: "吟游诗人", rarity: "rare", type: "joker", effects: { hand_size: 2, hand_size_neg: 1 }, tags: ["hand_size"], description: "手牌+2，每回合-1", best_with: ["all"], synergies: ["j_juggler", "j_turtle_bean"] },
        { id: "j_certificate", name: "证书", rarity: "rare", type: "joker", effects: { special: "seal" }, tags: ["special", "seal"], description: "回合开始加入封印牌", best_with: ["all"], synergies: [] },
        { id: "j_smeared", name: "涂抹小丑", rarity: "rare", type: "joker", effects: { special: "suit_combine" }, tags: ["special", "suit"], description: "红方合并，黑梅合并", best_with: ["all"], synergies: ["j_blackboard", "j_flower_pot", "j_ancient"] },
        { id: "j_throwback", name: "怀旧", rarity: "rare", type: "joker", effects: { xmult: "skip", value: 0.25 }, tags: ["xmult", "skip"], description: "跳过盲注+X0.25", best_with: ["all"], synergies: ["j_red"], unlock: "从主菜单继续一局游戏" },
        { id: "j_hanging_chad", name: "挂着的查德", rarity: "common", type: "joker", effects: { special: "first_card" }, tags: ["special", "scoring", "rescore"], description: "计分第一张牌重置2次", best_with: ["all"], synergies: ["j_dusk", "j_wee", "j_cavendish", "j_gros_michel"], synergy_note: "重复计分让卡文迪什/大麦克有更多机会触发" },
        { id: "j_glass", name: "玻璃小丑", rarity: "rare", type: "joker", effects: { xmult: "glass", value: 0.75 }, tags: ["xmult", "glass"], description: "每摧毁玻璃卡+X0.75", best_with: ["all"], synergies: ["j_vampire", "t_justice"], synergy_note: "与吸血鬼/正义配合：玻璃卡被销毁时触发双重倍率" },
        { id: "j_showman", name: "主持人", rarity: "rare", type: "joker", effects: { special: "duplicates" }, tags: ["special"], description: "Joker/塔罗/行星/灵魂可重复", best_with: ["all"], synergies: ["j_blueprint", "j_brainstorm"] },
        { id: "j_wee", name: "小不点", rarity: "legendary", type: "joker", effects: { chips: 8, rank: [2] }, tags: ["chips", "rank", "rescore"], description: "2计分 +8 筹码", best_with: ["all"], synergies: ["j_hanging_chad"], synergy_note: "配合挂着的查德可重复触发" },
        { id: "j_oops_6", name: "全是6", rarity: "rare", type: "joker", effects: { special: "double_chance" }, tags: ["special", "chance"], description: "概率翻倍", best_with: ["all"], synergies: ["j_bloodstone", "j_space", "j_lucky_cat", "j_gros_michel"] },
        { id: "j_idol", name: "偶像", rarity: "rare", type: "joker", effects: { xmult: 2, rank: "changing", suit: "changing" }, tags: ["xmult", "changing"], description: "特定点数花色 X2", best_with: ["all"], synergies: [] },
        { id: "j_seeing_double", name: "看清双倍", rarity: "rare", type: "joker", effects: { xmult: 2, hand: "suit_mix" }, tags: ["xmult", "suit"], description: "梅花+异花 X2", best_with: ["all"], synergies: ["j_gluttonous"], unlock: "打出包含四张梅花7的一手牌" },
        { id: "j_matador", name: "斗牛士", rarity: "rare", type: "joker", effects: { economy: "boss_trigger", value: 8 }, tags: ["economy", "boss"], description: "触发Boss+$8", best_with: ["all"], synergies: ["j_luchador", "j_chicot"] },
        { id: "j_stuntman", name: "特技演员", rarity: "legendary", type: "joker", effects: { chips: 250, hand_size: -2 }, tags: ["chips", "hand_size"], description: "+250筹码，手牌-2", best_with: ["all"], synergies: ["j_juggler", "j_turtle_bean"] },
        { id: "j_invisible", name: "隐形小丑", rarity: "legendary", type: "joker", effects: { special: "delayed_copy" }, tags: ["special", "copy"], description: "2回合后复制随机Joker", best_with: ["all"], synergies: ["j_blueprint"] },
        { id: "j_satellite", name: "卫星", rarity: "rare", type: "joker", effects: { economy: "unique_planet" }, tags: ["economy", "planet"], description: "每独特行星$1", best_with: ["all"], synergies: ["j_constellation"] },
        { id: "j_driver_license", name: "驾照", rarity: "legendary", type: "joker", effects: { xmult: 3, augment_count: 16 }, tags: ["xmult", "augment"], description: "16张增强牌 X3", best_with: ["all"], synergies: ["j_vampire"] },
        { id: "j_astronomer", name: "天文学家", rarity: "rare", type: "joker", effects: { special: "free_planet" }, tags: ["special", "planet", "shop"], description: "商店行星/天体包免费", best_with: ["all"], synergies: ["j_constellation"] },
        { id: "j_burnt", name: "烧焦小丑", rarity: "legendary", type: "joker", effects: { special: "upgrade_discard" }, tags: ["special", "upgrade", "discard"], description: "每回合升级弃牌牌型", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_bootstraps", name: "靴带", rarity: "rare", type: "joker", effects: { mult: "money", value: 2, interval: 5 }, tags: ["mult", "economy"], description: "每$5 +2 倍率", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_bull"] },
        { id: "j_yorick", name: "尤里克", rarity: "legendary", type: "joker", effects: { xmult: "discard_count", value: 1, count: 23 }, tags: ["xmult", "discard"], description: "弃23张牌+X1", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"], synergy_note: "醉汉/快乐安迪增加弃牌次数，帮助快速达到23张弃牌" },
        { id: "j_chicot", name: "奇科", rarity: "legendary", type: "joker", effects: { special: "disable_boss_all" }, tags: ["special", "boss"], description: "禁用所有Boss效果", best_with: ["all"], synergies: ["j_luchador"] },
        { id: "j_perkeo", name: "佩尔基奥", rarity: "legendary", type: "joker", effects: { special: "negative_copy" }, tags: ["special", "copy", "consumable"], description: "创造消耗卡负面复制", best_with: ["all"], synergies: ["j_fortune_teller"] }
    ],

    // ============ TAROT 塔罗牌 ============
    tarots: [
        { id: "t_fool", name: "愚者", effects: { special: "copy_last" }, tags: ["copy", "tarot"], description: "复制上一张使用的牌", synergies: [] },
        { id: "t_magician", name: "魔术师", effects: { augment: "lucky" }, tags: ["augment", "lucky"], description: "1张牌强化为幸运牌", synergies: ["j_lucky_cat"] },
        { id: "t_priestess", name: "女教皇", effects: { create: "planet", count: 2 }, tags: ["create", "planet"], description: "生成2张随机行星牌", synergies: ["j_constellation", "j_satellite"] },
        { id: "t_empress", name: "皇后", effects: { augment: "mult", count: 2 }, tags: ["augment", "mult"], description: "2张牌强化为倍率牌", synergies: ["j_vampire", "j_driver_license"] },
        { id: "t_emperor", name: "皇帝", effects: { augment: "bonus", count: 2 }, tags: ["augment", "bonus"], description: "2张牌强化为奖励牌", synergies: ["j_vampire", "j_driver_license"] },
        { id: "t_lovers", name: "恋人", effects: { augment: "wild" }, tags: ["augment", "wild"], description: "1张牌强化为万能牌", synergies: ["j_flower_pot", "j_blackboard"] },
        { id: "t_chariot", name: "战车", effects: { augment: "steel" }, tags: ["augment", "steel"], description: "1张牌强化为钢铁牌", synergies: ["j_steel"] },
        { id: "t_justice", name: "正义", effects: { augment: "glass" }, tags: ["augment", "glass"], description: "1张牌强化为玻璃牌", synergies: ["j_glass", "j_vampire"], synergy_note: "玻璃卡被销毁时，玻璃小丑+0.75倍率，吸血鬼+0.1倍率" },
        { id: "t_hermit", name: "隐士", effects: { economy: "double", max: 20 }, tags: ["economy"], description: "金钱翻倍(上限$20)", synergies: [] },
        { id: "t_wheel", name: "命运之轮", effects: { special: "joker_foil", chance: 0.25 }, tags: ["special", "joker", "foil"], description: "1/4几率Joker闪箔/全息/多彩", synergies: [] },
        { id: "t_strength", name: "力量", effects: { rank_up: 1, count: 2 }, tags: ["rank", "upgrade"], description: "最多2张牌点数+1", synergies: [] },
        { id: "t_hanged", name: "倒吊人", effects: { destroy: "hand", count: 2 }, tags: ["destroy", "hand"], description: "永久移除最多2张牌", synergies: [] },
        { id: "t_death", name: "死神", effects: { transform: "right_to_left" }, tags: ["transform"], description: "最右牌转换为最左牌", synergies: [] },
        { id: "t_temperance", name: "节制", effects: { economy: "joker_sell" }, tags: ["economy", "sell"], description: "Joker出售值转为金钱", synergies: [] },
        { id: "t_devil", name: "恶魔", effects: { augment: "gold" }, tags: ["augment", "gold"], description: "1张牌强化为黄金牌", synergies: ["j_midas", "j_golden_ticket"] },
        { id: "t_tower", name: "塔", effects: { augment: "stone" }, tags: ["augment", "stone"], description: "1张牌强化为石头牌", synergies: ["j_stone", "j_marble"] },
        { id: "t_star", name: "星星", effects: { suit: "diamonds", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为方块", synergies: ["j_greedy"] },
        { id: "t_moon", name: "月亮", effects: { suit: "clubs", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为梅花", synergies: ["j_gluttonous"] },
        { id: "t_sun", name: "太阳", effects: { suit: "hearts", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为红桃", synergies: ["j_lusty"] },
        { id: "t_judgement", name: "审判", effects: { create: "joker" }, tags: ["create", "joker"], description: "生成一张随机Joker", synergies: [] },
        { id: "t_world", name: "世界", effects: { suit: "spades", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为黑桃", synergies: ["j_wrathful"] }
    ],

    // ============ PLANET 行星牌 ============
    planets: [
        { id: "p_pluto", name: "冥王星", hand: "high_card", chips: 10, mult: 1, tags: ["planet", "high_card"], description: "高牌 +10 筹码 +1 倍率", synergies: [] },
        { id: "p_mercury", name: "水星", hand: "pair", chips: 15, mult: 1, tags: ["planet", "pair"], description: "对子 +15 筹码 +1 倍率", synergies: [] },
        { id: "p_uranus", name: "天王星", hand: "two_pair", chips: 20, mult: 1, tags: ["planet", "two_pair"], description: "两对 +20 筹码 +1 倍率", synergies: [] },
        { id: "p_venus", name: "金星", hand: "three_of_a_kind", chips: 20, mult: 2, tags: ["planet", "three_of_a_kind"], description: "三条 +20 筹码 +2 倍率", synergies: [] },
        { id: "p_mars", name: "火星", hand: "four_of_a_kind", chips: 30, mult: 3, tags: ["planet", "four_of_a_kind"], description: "四条 +30 筹码 +3 倍率", synergies: [] },
        { id: "p_jupiter", name: "木星", hand: "flush", chips: 15, mult: 2, tags: ["planet", "flush"], description: "同花 +15 筹码 +2 倍率", synergies: [] },
        { id: "p_earth", name: "地球", hand: "full_house", chips: 25, mult: 2, tags: ["planet", "full_house"], description: "葫芦 +25 筹码 +2 倍率", synergies: [] },
        { id: "p_saturn", name: "土星", hand: "straight", chips: 30, mult: 2, tags: ["planet", "straight"], description: "顺子 +30 筹码 +2 倍率", synergies: [] },
        { id: "p_neptune", name: "海王星", hand: "straight_flush", chips: 40, mult: 3, tags: ["planet", "straight_flush"], description: "同花顺 +40 筹码 +3 倍率", synergies: [] },
        { id: "p_planet_x", name: "X行星", hand: "five_of_a_kind", chips: 35, mult: 3, tags: ["planet", "five_of_a_kind", "secret"], description: "五条 +35 筹码 +3 倍率", synergies: [] },
        { id: "p_eris", name: "阋神星", hand: "flush_five", chips: 40, mult: 3, tags: ["planet", "flush_five", "secret"], description: "同花五条 +40 筹码 +3 倍率", synergies: [] },
        { id: "p_ceres", name: "谷神星", hand: "flush_house", chips: 40, mult: 3, tags: ["planet", "flush_house", "secret"], description: "同花葫芦 +40 筹码 +3 倍率", synergies: [] }
    ],

    // ============ SPECTRAL 灵魂牌 ============
    spectrals: [
        { id: "s_familiar", name: "使魔", effects: { destroy: 1, create: "face_enhanced", count: 3 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得3张强化人头牌", synergies: ["j_pareidolia", "j_photograph"] },
        { id: "s_grim", name: "严峻", effects: { destroy: 1, create: "ace_enhanced", count: 2 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得2张强化A", synergies: ["j_scholar", "j_fibonacci"] },
        { id: "s_incantation", name: "咒语", effects: { destroy: 1, create: "number_enhanced", count: 4 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得4张强化数字牌", synergies: [] },
        { id: "s_talisman", name: "护身符", effects: { seal: "gold" }, tags: ["spectral", "seal"], description: "1张牌添加金封印", synergies: ["j_midas", "j_golden_ticket"] },
        { id: "s_aura", name: "光环", effects: { edition: "random" }, tags: ["spectral", "edition"], description: "1张牌随机添加闪箔/全息/多彩", synergies: [] },
        { id: "s_wraith", name: "幽灵", effects: { create: "joker_rare", cost: 0 }, tags: ["spectral", "create", "joker"], description: "创造1张稀有Joker，金钱归零", synergies: [] },
        { id: "s_sigil", name: "符印", effects: { suit: "uniform" }, tags: ["spectral", "suit"], description: "所有手牌转为同一花色", synergies: [] },
        { id: "s_ouija", name: "占卜板", effects: { rank: "uniform", hand_size: -1 }, tags: ["spectral", "rank", "hand_size"], description: "所有手牌转为同一点数，手牌-1", synergies: [] },
        { id: "s_ectoplasm", name: "灵质", effects: { edition: "polychrome", hand_size: -1 }, tags: ["spectral", "edition", "hand_size"], description: "随机Joker添加负极，手牌-1", synergies: [] },
        { id: "s_immolate", name: "火祭", effects: { destroy: 5, economy: 20 }, tags: ["spectral", "destroy", "economy"], description: "摧毁5张牌，获得$20", synergies: [] },
        { id: "s_ankh", name: "安卡", effects: { duplicate: "joker" }, tags: ["spectral", "duplicate", "joker"], description: "随机复制1个Joker", synergies: [] },
        { id: "s_deja_vu", name: "既视感", effects: { seal: "red" }, tags: ["spectral", "seal"], description: "1张牌添加红封印", synergies: [] },
        { id: "s_hex", name: "妖法", effects: { edition: "polychrome", destroy: "all_joker" }, tags: ["spectral", "edition", "destroy"], description: "随机Joker添加多彩，摧毁其他", synergies: [] },
        { id: "s_trance", name: "入迷", effects: { seal: "blue" }, tags: ["spectral", "seal"], description: "1张牌添加蓝封印", synergies: [] },
        { id: "s_medium", name: "灵媒", effects: { seal: "purple" }, tags: ["spectral", "seal"], description: "1张牌添加紫封印", synergies: [] },
        { id: "s_cryptid", name: "神秘生物", effects: { duplicate: "exact", count: 2 }, tags: ["spectral", "duplicate"], description: "选中的牌复制2份", synergies: [] },
        { id: "s_soul", name: "灵魂", effects: { create: "joker_legendary" }, tags: ["spectral", "create", "joker", "legendary"], description: "创造1张传说Joker", rare: "ultra_rare", synergies: [] },
        { id: "s_black_hole", name: "黑洞", effects: { upgrade: "all_hand" }, tags: ["spectral", "upgrade"], description: "所有牌型升1级", rare: "ultra_rare", synergies: [] }
    ]
};

// ============ 标签定义 ============
const TAGS = {
    // 稀有度
    common: { name: "普通", color: "#95a5a6" },
    rare: { name: "稀有", color: "#3498db" },
    legendary: { name: "传奇", color: "#f39c12" },
    secret: { name: "隐藏", color: "#9b59b6" },
    ultra_rare: { name: "极稀有", color: "#e74c3c" },

    // 效果类型
    mult: { name: "倍数", color: "#e74c3c" },
    xmult: { name: "倍率", color: "#f39c12" },
    chips: { name: "筹码", color: "#2ecc71" },
    draw: { name: "抽牌", color: "#3498db" },
    discard: { name: "弃牌", color: "#9b59b6" },
    hand_size: { name: "手牌", color: "#1abc9c" },
    economy: { name: "经济", color: "#f1c40f" },
    
    // 特殊标签
    fibonacci: { name: "斐波那契", color: "#8e44ad" },
    even: { name: "偶数", color: "#3498db" },
    odd: { name: "奇数", color: "#e67e22" },
    face: { name: "人头牌", color: "#e74c3c" },
    ace: { name: "A牌", color: "#f39c12" },
    rank: { name: "点数", color: "#9b59b6" },
    suit: { name: "花色", color: "#e91e63" },

    // 卡牌类型
    joker: { name: "Joker", color: "#e74c3c" },
    tarot: { name: "塔罗牌", color: "#9b59b6" },
    planet: { name: "行星牌", color: "#3498db" },
    spectral: { name: "灵魂牌", color: "#2c3e50" },

    // 牌型
    high_card: { name: "高牌", color: "#95a5a6" },
    one_pair: { name: "对子", color: "#3498db" },
    two_pair: { name: "两对", color: "#9b59b6" },
    three_of_a_kind: { name: "三条", color: "#e67e22" },
    straight: { name: "顺子", color: "#e74c3c" },
    flush: { name: "同花", color: "#1abc9c" },
    full_house: { name: "葫芦", color: "#f39c12" },
    four_of_a_kind: { name: "四条", color: "#2ecc71" },
    straight_flush: { name: "同花顺", color: "#c0392b" },
    five_of_a_kind: { name: "五条", color: "#8e44ad" },
    flush_five: { name: "同花五条", color: "#16a085" },
    flush_house: { name: "同花葫芦", color: "#d35400" },

    // 花色
    hearts: { name: "红桃", color: "#e74c3c" },
    diamonds: { name: "方块", color: "#e67e22" },
    clubs: { name: "梅花", color: "#27ae60" },
    spades: { name: "黑桃", color: "#2c3e50" }
};

// ============ 协同效果定义 ============
// 用于匹配算法识别卡牌间的协同关系
const SYNERGY_RULES = {
    // 点数相关协同 - 斐波那契系列
    fibonacci_even: {
        cards: ["j_fibonacci", "j_even_steven"],
        name: "斐波那契+偶数",
        description: "2、8可同时触发双方的加成效果（斐波那契+8，偶数史蒂文+4）"
    },
    fibonacci_odd: {
        cards: ["j_fibonacci", "j_odd_todd"],
        name: "斐波那契+奇数",
        description: "A、3、5可触发双重效果（斐波那契+倍率，奇数托德+筹码）"
    },
    
    // 人头牌协同
    face_cards: {
        cards: ["j_photograph", "j_scary_face", "j_smiley", "j_pareidolia"],
        name: "人头牌组合",
        description: "多头人牌加成叠加"
    },
    
    // 花色协同
    four_suit: {
        cards: ["j_greedy", "j_lusty", "j_wrathful", "j_gluttonous", "j_flower_pot"],
        name: "四花组合",
        description: "覆盖所有花色，最大化花色加成"
    },
    
    // 牌型协同
    hand_mult_combo: {
        cards: ["j_jolly", "j_duo", "j_spare_trousers"],
        name: "对子体系",
        description: "对子相关倍率叠加"
    },
    straight_combo: {
        cards: ["j_crazy", "j_order", "j_runner", "j_superposition", "j_shortcut"],
        name: "顺子体系",
        description: "顺子相关加成叠加"
    },
    
    // K/Q 协同
    kq_combo: {
        cards: ["j_baron", "j_triboulet", "j_shoot_moon"],
        name: "K/Q组合",
        description: "K和Q的双重倍率加成"
    },
    
    // 复制类协同
    copy_combo: {
        cards: ["j_blueprint", "j_brainstorm"],
        name: "复制组合",
        description: "互相复制形成无限可能"
    },

    // 经济类协同 - 金额相关
    economy_basic: {
        cards: ["j_golden", "j_rocket", "j_to_moon"],
        name: "经济三兄弟",
        description: "基础经济组合：黄金小丑每回合+$4，登月增加利息收益，火箭额外Boss奖励"
    },
    economy_plus: {
        cards: ["j_golden", "j_credit_card"],
        name: "信用卡组合",
        description: "黄金小丑+$4，信用卡-$2但无上限，负到-20会清空"
    },
    money_trash: {
        cards: ["j_trash", "j_cash_card"],
        name: "垃圾变钱",
        description: "垃圾桶把不要的牌变成$4，现金卡每回合额外$2"
    },
    satellite_economy: {
        cards: ["j_satellite", "j_rocket"],
        name: "卫星经济",
        description: "卫星每弃一张牌+$1，火箭Boss额外+$2"
    },
    perk_economy: {
        cards: ["j_perk", "j_golden"],
        name: "小费经济",
        description: "小费每回合+$4，与黄金小丑叠加"
    },
    matriarch_economy: {
        cards: ["j_matriarch", "j_greedy"],
        name: "黑帮经济",
        description: "黑帮夫人和贪婪小丑都需要方块触发"
    },
    business: {
        cards: ["j_business", "j_drunkard"],
        name: "商业组合",
        description: "商人和醉汉配合增加弃牌和手牌利用"
    },

    // 弃牌能力协同
    ramen_burglar: {
        cards: ["j_ramen", "j_burglar"],
        name: "拉面窃贼",
        description: "窃贼移除所有弃牌次数，使拉面始终保持X2倍率不被削减"
    },
    burglar_mystic: {
        cards: ["j_burglar", "j_mystic_summit"],
        name: "窃贼神秘山",
        description: "窃贼移除所有弃牌，使神秘山峰始终保持0弃牌状态，获得稳定的+15倍率"
    },
    burglar_delayed: {
        cards: ["j_burglar", "j_delayed"],
        name: "窃贼延迟满足",
        description: "窃贼移除所有弃牌，延迟满足每张未用弃牌+$2，可稳定获得高收益"
    },
    burglar_green: {
        cards: ["j_burglar", "j_green"],
        name: "窃贼绿色",
        description: "窃贼移除弃牌次数，绿色小丑不会因弃牌扣倍率，始终保持每手+1倍率"
    },

    // 增加弃牌类协同
    banner_drunk: {
        cards: ["j_banner", "j_drunkard"],
        name: "旗帜醉汉",
        description: "醉汉+1弃牌，旗帜每剩余弃牌+30筹码，配合增加收益"
    },
    banner_andy: {
        cards: ["j_banner", "j_merry_andy"],
        name: "旗帜快乐安迪",
        description: "快乐安迪+3弃牌，旗帜每剩余弃牌+30筹码，大量筹码加成"
    },
    yorick_drunk: {
        cards: ["j_yorick", "j_drunkard"],
        name: "尤里克醉汉",
        description: "醉汉每回合+1弃牌，帮助尤里克快速达到23张弃牌触发+X1"
    },
    yorick_andy: {
        cards: ["j_yorick", "j_merry_andy"],
        name: "尤里克快乐安迪",
        description: "快乐安迪+3弃牌，加速尤里克弃牌数量累积，快速触发+X1"
    },
    hitroad_drunk: {
        cards: ["j_hit_road", "j_drunkard"],
        name: "赶路醉汉",
        description: "醉汉增加弃牌次数，加速赶路每弃J X0.5倍率累积"
    },
    hitroad_andy: {
        cards: ["j_hit_road", "j_merry_andy"],
        name: "赶路快乐安迪",
        description: "快乐安迪+3弃牌，大量增加赶路的倍率累积效率"
    },

    // 特殊/重置类协同
    mime_seltzer: {
        cards: ["j_mime", "j_seltzer"],
        name: "模仿苏打水",
        description: "苏打水10手牌重置所有牌，模仿小丑可重置手牌能力"
    },
    mime_dusk: {
        cards: ["j_mime", "j_dusk"],
        name: "模仿黄昏",
        description: "黄昏重置最后两手牌，模仿小丑可重置手牌能力"
    },

    // 疯狂类协同
    madness_abstract: {
        cards: ["j_madness", "j_abstract"],
        name: "疯狂抽象",
        description: "疯狂小丑每回合摧毁随机Joker，抽象小丑每张Joker+3倍率，摧毁越多收益越高"
    },

    // 灵魂/塔罗类协同
    seance_fortune: {
        cards: ["j_seance", "j_fortune_teller"],
        name: "降灵算命",
        description: "降灵会同花顺产生灵魂牌，算命师每张塔罗/灵魂牌+1倍率"
    },
    seance_constellation: {
        cards: ["j_seance", "j_constellation"],
        name: "降灵星座",
        description: "降灵会同花顺产生灵魂牌，星座每张行星牌+0.1倍率"
    },
    hallucination_fortune: {
        cards: ["j_hallucination", "j_fortune_teller"],
        name: "幻觉算命",
        description: "幻觉开包1/2几率塔罗牌，算命师每张塔罗牌+1倍率"
    },
    hallucination_cartomancer: {
        cards: ["j_hallucination", "j_cartomancer"],
        name: "幻觉占卜",
        description: "幻觉和占卜师都产生塔罗牌，大量塔罗牌收益"
    },
    vagabond_fortune: {
        cards: ["j_vagabond", "j_fortune_teller"],
        name: "流浪算命",
        description: "流浪者$4或更少产生塔罗牌，算命师每张塔罗牌+1倍率"
    },
    vagabond_constellation: {
        cards: ["j_vagabond", "j_constellation"],
        name: "流浪星座",
        description: "流浪者产生塔罗牌，星座每张行星牌+0.1倍率"
    },
    vagabond_cartomancer: {
        cards: ["j_vagabond", "j_cartomancer"],
        name: "流浪占卜",
        description: "流浪者和占卜师都产生塔罗牌，大量塔罗牌收益"
    },

    // 钢卡类协同
    steel_chariot: {
        cards: ["j_steel", "t_chariot"],
        name: "钢铁战车",
        description: "战车将牌强化为钢铁牌，钢铁小丑每张钢卡+0.2倍率"
    },

    // 加入牌组类协同
    hologram_tarot: {
        cards: ["j_hologram", "j_fortune_teller"],
        name: "全息塔罗",
        description: "塔罗牌加入牌组，全息每加入+0.25倍率"
    },
    hologram_planet: {
        cards: ["j_hologram", "j_constellation"],
        name: "全息星座",
        description: "行星牌加入牌组，全息每加入+0.25倍率"
    },

    // 重复打出类协同
    cardsharp_chad: {
        cards: ["j_card_sharp", "j_hanging_chad"],
        name: "老千查德",
        description: "老千本回合重复牌型X3，挂着的查德重复打出+0.5倍率"
    },
    cardsharp_dusk: {
        cards: ["j_card_sharp", "j_dusk"],
        name: "老千黄昏",
        description: "老千本回合重复牌型X3，黄昏重置最后两手牌增加重复机会"
    },

    // 牌型类协同
    family_trio: {
        cards: ["j_family", "j_trio"],
        name: "一家三重奏",
        description: "三重奏三条X3，一家四口四条X4，配合最大化"
    },

    // 计分类协同
    splash_photo: {
        cards: ["j_splash", "j_photograph"],
        name: "飞溅照片",
        description: "飞溅所有打出的牌都计分，照片第一张人头牌X2，完美配合"
    },
    splash_scary: {
        cards: ["j_splash", "j_scary_face"],
        name: "飞溅恐怖脸",
        description: "飞溅所有打出的牌都计分，恐怖脸人头牌+30筹码"
    },

    // 非常用牌型协同
    obelisk_straight: {
        cards: ["j_obelisk", "j_crazy"],
        name: "方尖碑顺子",
        description: "方尖碑非常用牌型X0.2，顺子是非常用牌型，配合增加倍率"
    },
    obelisk_flush: {
        cards: ["j_obelisk", "j_droll"],
        name: "方尖碑同花",
        description: "方尖碑非常用牌型X0.2，同花是非常用牌型，配合增加倍率"
    },

    // 手牌类协同
    turtle_juggler: {
        cards: ["j_turtle_bean", "j_juggler"],
        name: "龟豆杂耍",
        description: "龟豆手牌+5，杂耍小丑手牌+1，大量手牌"
    },
    turtle_square: {
        cards: ["j_turtle_bean", "j_square"],
        name: "龟豆方块",
        description: "龟豆手牌+5，方块小丑4张手牌+4筹码，手牌越多收益越高"
    },

    // 计时类协同
    loyalty_seltzer: {
        cards: ["j_loyalty", "j_seltzer"],
        name: "忠诚苏打水",
        description: "忠诚卡每6手牌X4，苏打水10手牌重置，帮助快速触发"
    },

    // 牌型筹码+倍数配对协同
    pair_system: {
        cards: ["j_jolly", "j_sly", "j_duo"],
        name: "对子全系",
        description: "快乐+8倍率，狡诈+50筹码，二重奏X2，对子三重加成"
    },
    three_system: {
        cards: ["j_zany", "j_wily", "j_trio"],
        name: "三条全系",
        description: "疯狂+12倍率，狡猾+100筹码，三重奏X3，三条三重加成"
    },
    two_pair_system: {
        cards: ["j_mad", "j_clever", "j_spare_trousers"],
        name: "两对全系",
        description: "狂热+10倍率，聪明+80筹码，备用裤+2倍率，两对三重加成"
    },
    straight_full: {
        cards: ["j_crazy", "j_devious", "j_order", "j_runner"],
        name: "顺子全系",
        description: "疯狂+12倍率，阴险+100筹码，秩序X3，奔跑者+15筹码"
    },
    flush_full: {
        cards: ["j_droll", "j_crafty", "j_tribe"],
        name: "同花全系",
        description: "严肃+10倍率，精巧+80筹码，同花X2，同花三重加成"
    },

    // 四指协同
    four_fingers_straight: {
        cards: ["j_four_fingers", "j_crazy", "j_order"],
        name: "四指顺子",
        description: "四指让同花顺只需4张，大幅降低顺子门槛"
    },
    four_fingers_flush: {
        cards: ["j_four_fingers", "j_droll", "j_tribe"],
        name: "四指同花",
        description: "四指让同花顺只需4张，大幅降低同花门槛"
    },

    // 模板+疯狂协同
    stencil_madness: {
        cards: ["j_stencil", "j_madness"],
        name: "模板疯狂",
        description: "疯狂摧毁Joker腾出空位，模板小丑每空位+1倍率"
    },

    // 经济+筹码/倍率协同
    bull_economy: {
        cards: ["j_bull", "j_golden", "j_to_moon"],
        name: "公牛经济",
        description: "黄金+登月积累金钱，公牛每$1+2筹码，钱越多筹码越高"
    },
    bootstraps_economy: {
        cards: ["j_bootstraps", "j_golden", "j_to_moon"],
        name: "靴带经济",
        description: "黄金+登月积累金钱，靴带每$5+2倍率，钱越多倍率越高"
    },
    bull_bootstraps: {
        cards: ["j_bull", "j_bootstraps"],
        name: "公牛靴带",
        description: "公牛每$1+2筹码，靴带每$5+2倍率，金钱同时转化为筹码和倍率"
    },

    // 出售类协同
    sell_combo: {
        cards: ["j_campfire", "j_gift_card", "j_diet_cola"],
        name: "出售体系",
        description: "篝火每出售+X0.25，礼品卡增加出售值，健怡可乐出售创造免费双倍"
    },

    // 概率翻倍协同
    oops_bloodstone: {
        cards: ["j_oops_6", "j_bloodstone"],
        name: "全是6血石",
        description: "全是6概率翻倍，血石红桃触发几率从1/2提升到1/1"
    },
    oops_space: {
        cards: ["j_oops_6", "j_space"],
        name: "全是6太空",
        description: "全是6概率翻倍，太空小丑升级牌型几率从1/4提升到1/2"
    },
    oops_lucky: {
        cards: ["j_oops_6", "j_lucky_cat"],
        name: "全是6幸运猫",
        description: "全是6概率翻倍，幸运猫触发几率翻倍，快速累积倍率"
    },

    // 跳过盲注协同
    skip_combo: {
        cards: ["j_throwback", "j_red"],
        name: "跳过体系",
        description: "怀旧跳过+X0.25倍率，红小丑跳过+3倍率，跳过盲注双重收益"
    },

    // 超新星+太空协同
    supernova_space: {
        cards: ["j_supernova", "j_space"],
        name: "超新星太空",
        description: "太空升级牌型，超新星每次使用牌型+倍率，配合加速成长"
    },

    // 人头牌经济协同
    face_economy: {
        cards: ["j_business_card", "j_reserved", "j_pareidolia"],
        name: "人头牌经济",
        description: "空想性错觉使所有牌变人头牌，名片和预留停车双重经济收益"
    },
    faceless_discard: {
        cards: ["j_faceless", "j_pareidolia", "j_drunkard"],
        name: "无脸弃牌经济",
        description: "空想性错觉使所有牌变人头牌，醉汉增加弃牌，无脸弃3人头+$5"
    },

    // 涂抹类协同
    smeared_blackboard: {
        cards: ["j_smeared", "j_blackboard"],
        name: "涂抹黑板",
        description: "涂抹合并花色，黑板更容易达成全黑X3倍率"
    },
    smeared_flower: {
        cards: ["j_smeared", "j_flower_pot"],
        name: "涂抹花盆",
        description: "涂抹合并花色，花盆四花更容易达成X3倍率"
    },

    // 手牌大小协同
    hand_size_combo: {
        cards: ["j_turtle_bean", "j_juggler", "j_troubadour"],
        name: "手牌大师",
        description: "龟豆+5，杂耍+1，吟游诗人+2，大量手牌配合各种组合"
    },

    // 弃牌经济协同
    discard_economy: {
        cards: ["j_trading", "j_mail_in", "j_drunkard"],
        name: "弃牌经济",
        description: "交易卡单张弃牌+$3，邮件返利弃特定牌$5，醉汉增加弃牌次数"
    },
    castle_discard: {
        cards: ["j_castle", "j_drunkard", "j_merry_andy"],
        name: "城堡弃牌",
        description: "城堡弃特定花色+3筹码，醉汉/快乐安迪增加弃牌次数加速累积"
    },
    burnt_discard: {
        cards: ["j_burnt", "j_drunkard", "j_merry_andy"],
        name: "烧焦弃牌",
        description: "烧焦每回合升级弃牌牌型，醉汉/快乐安迪增加弃牌加速升级"
    },

    // 杂技演员协同
    acrobat_dusk: {
        cards: ["j_acrobat", "j_dusk"],
        name: "杂技黄昏",
        description: "杂技演员最后一手X3，黄昏重置最后两手牌，最后一手双重加成"
    },

    // 第六感协同
    sixth_seance: {
        cards: ["j_sixth_sense", "j_seance"],
        name: "第六感降灵",
        description: "第六感首张6创灵魂牌，降灵会同花顺产灵魂牌，双灵魂牌来源"
    },

    // 飞溅+徒步者协同
    splash_hiker: {
        cards: ["j_splash", "j_hiker"],
        name: "飞溅徒步",
        description: "飞溅所有牌计分，徒步者每打出+5永久筹码，所有牌永久增强"
    },
    swallow: {
        cards: ["j_swallow", "j_to_moon"],
        name: "燕子经济",
        description: "燕子+登月，利息收益最大化"
    },

    // 摧毁类协同 - 核心协同！
    glass_vampire: {
        cards: ["j_glass", "j_vampire"],
        name: "玻璃吸血鬼",
        description: "玻璃卡被摧毁时触发双重倍率加成"
    },
    glass_destroy: {
        cards: ["j_glass", "t_fool"],
        name: "玻璃销毁流",
        description: "愚者销毁玻璃卡，玻璃小丑增加倍率"
    },
    flower_sell: {
        cards: ["j_flower_pot", "t_high_priestess"],
        name: "卖花女组合",
        description: "女祭司销毁卡牌配合花盆四花加成"
    },
    canio_face: {
        cards: ["j_canio", "j_pareidolia"],
        name: "人头牌销毁流",
        description: "空想性错觉使所有牌变人头牌，配合卡尼奥摧毁时增加倍率"
    },
    hanged_abstract: {
        cards: ["t_hanged", "j_abstract"],
        name: "倒吊抽象流",
        description: "倒吊人销毁卡牌增加 Joker 数量，抽象小丑获得更多倍率"
    },
    destroy_tarot_combo: {
        cards: ["t_high_priestess", "j_cartomancer", "j_fortune_teller"],
        name: "塔罗销毁流",
        description: "女祭司销毁配合占卜师/算命师增加塔罗牌收益"
    },
    spectral_destroy_combo: {
        cards: ["s_familiar", "s_grim", "j_photograph", "j_scholar"],
        name: "灵魂销毁流",
        description: "Spectral牌销毁卡牌获得强化牌，配合人头牌/A牌加成"
    },
    madness_destroy: {
        cards: ["j_madness", "j_abstract"],
        name: "疯狂销毁流",
        description: "疯狂小丑每回合摧毁 Joker，抽象小丑获得额外倍率"
    },

    // ============ Joker + Tarot 协同 ============
    tarot_fortune: {
        cards: ["j_fortune_teller", "j_cartomancer"],
        name: "塔罗大师",
        description: "占卜师创造塔罗牌，算命师每张塔罗牌+1倍率"
    },
    tarot_abstract: {
        cards: ["j_abstract", "j_cartomancer"],
        name: "抽象塔罗流",
        description: "占卜师每盲注创造塔罗牌，抽象小丑获得额外倍率"
    },
    tarot_8ball: {
        cards: ["j_8ball", "j_fortune_teller"],
        name: "8号算命",
        description: "8号球概率获得塔罗牌，算命师将塔罗牌转化为倍率"
    },
    tarot_superposition: {
        cards: ["j_superposition", "j_fortune_teller"],
        name: "叠加塔罗",
        description: "叠加产生塔罗牌，算命师增加倍率"
    },
    tarot_vagabond: {
        cards: ["j_vagabond", "j_fortune_teller"],
        name: "流浪塔罗",
        description: "流浪者低价产生塔罗牌，算命师转化收益"
    },
    tarot_hallucination: {
        cards: ["j_hallucination", "j_cartomancer"],
        name: "幻觉占卜",
        description: "幻觉和占卜师都能产生额外塔罗牌"
    },
    tarot_strength: {
        cards: ["t_strength", "j_abstract"],
        name: "力量抽象",
        description: "力量升级卡牌增加 Joker 数量，抽象小丑获得倍率"
    },
    tarot_wheel: {
        cards: ["t_wheel", "j_showman"],
        name: "轮盘主持人",
        description: "命运之轮概率强化 Joker，主持人使强化效果可重复"
    },

    // ============ Joker + Planet 协同 ============
    planet_constellation: {
        cards: ["j_constellation", "j_astronomer"],
        name: "星座天文学",
        description: "天文学家免费获取行星，星座将行星转化为倍率"
    },
    planet_satellite: {
        cards: ["j_satellite", "j_constellation"],
        name: "卫星星座",
        description: "卫星获取独特行星，星座增加倍率"
    },
    planet_priestess: {
        cards: ["t_priestess", "j_constellation"],
        name: "女祭司星座",
        description: "女教皇生成行星牌，星座获得倍率"
    },
    planet_showman: {
        cards: ["j_showman", "j_constellation"],
        name: "主持人行星",
        description: "主持人使行星效果可重复，配合星座倍率翻倍"
    },
    planet_hand: {
        cards: ["j_crazy", "p_saturn"],
        name: "顺子行星",
        description: "顺子小丑+土星，顺子牌型双重加成"
    },
    planet_flush: {
        cards: ["j_tribe", "p_jupiter"],
        name: "同花行星",
        description: "同花小丑+木星，同花牌型双重加成"
    },

    // ============ Joker + Spectral 协同 ============
    spectral_seance: {
        cards: ["j_seance", "j_fortune_teller"],
        name: "降灵魂师",
        description: "降灵会同花顺产生灵魂牌，算命师增加倍率"
    },
    spectral_sixth: {
        cards: ["j_sixth_sense", "j_abstract"],
        name: "第六感抽象",
        description: "第六感创造灵魂牌，抽象小丑增加倍率"
    },
    spectral_familiar: {
        cards: ["s_familiar", "j_pareidolia"],
        name: "使魔人头",
        description: "使魔销毁获得人头牌，空想性错觉增强效果"
    },
    spectral_grim: {
        cards: ["s_grim", "j_scholar"],
        name: "严峻学者",
        description: "严峻销毁获得强化A，学者增加A的倍率"
    },
    spectral_incantation: {
        cards: ["s_incantation", "j_abstract"],
        name: "咒语抽象",
        description: "咒语销毁获得强化数字牌，抽象小丑获得倍率"
    },
    spectral_immolate: {
        cards: ["s_immolate", "j_to_moon"],
        name: "火祭登月",
        description: "火祭销毁5张牌获$20，登月增加利息收益"
    },
    spectral_hex: {
        cards: ["s_hex", "j_showman"],
        name: "妖法主持",
        description: "妖法随机强化 Joker，主持人使效果可重复"
    },

    // ============ 重复打出/重置协同 ============
    chad_dusk: {
        cards: ["j_hanging_chad", "j_dusk"],
        name: "查德黄昏",
        description: "查德重复计分第一张牌，黄昏重置最后两手牌，最大化重复打出收益"
    },
    chad_wee: {
        cards: ["j_hanging_chad", "j_wee"],
        name: "查德小不点",
        description: "查德让2可以重复计分，小不点获得额外筹码"
    },
    chad_cavendish: {
        cards: ["j_hanging_chad", "j_cavendish"],
        name: "查德卡文迪什",
        description: "查德让卡文迪什有更多机会触发1/1000的X3倍率"
    },
    chad_gros: {
        cards: ["j_hanging_chad", "j_gros_michel"],
        name: "查德大麦克",
        description: "查德让大麦克有更多机会触发1/6的摧毁效果"
    },
    dusk_abstract: {
        cards: ["j_dusk", "j_abstract"],
        name: "黄昏抽象",
        description: "黄昏重置手牌增加 Joker 计数，抽象小丑获得更多倍率"
    },
    throwback_skip: {
        cards: ["j_throwback", "j_hanging_chad"],
        name: "怀旧查德",
        description: "跳过盲注时怀旧增加倍率，查德让跳过更频繁"
    },

    // ============ 几率/风险加倍协同 ============
    risky_cavendish: {
        cards: ["j_cavendish", "j_gros_michel"],
        name: "风险兄弟",
        description: "两个高风险高回报卡牌，大麦克1/6摧毁，卡文迪什1/1000摧毁"
    },
    risky_bloodstone: {
        cards: ["j_gros_michel", "j_bloodstone"],
        name: "风险血石",
        description: "大麦克有几率摧毁，血石红桃1/2几率X1.5"
    },
    risky_madness: {
        cards: ["j_madness", "j_abstract"],
        name: "疯狂抽象",
        description: "疯狂小丑摧毁 Joker 增加抽象小丑倍率"
    },
    chance_chips: {
        cards: ["j_bloodstone", "j_gros_michel", "j_cavendish"],
        name: "几率筹码",
        description: "多个高风险卡牌组合，追求高收益"
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CARD_DATA, TAGS, SYNERGY_RULES };
}
