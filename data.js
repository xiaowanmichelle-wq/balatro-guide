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
        { id: "j_joker", image: "https://patchwiki.biligame.com/images/balatro/1/18/6krwwkiqwc8iqashqh8d721zt6ggzfu.png", name: "小丑", rarity: "common", type: "joker", effects: { mult: 4 }, tags: ["mult", "basic"], description: "+4倍率", best_with: ["all"], synergies: [] },
        
        // 花色小丑
        { id: "j_greedy", image: "https://patchwiki.biligame.com/images/balatro/f/fa/eakt0eeo4w1uwytj0q7ipmwv53l9v9r.png", name: "贪婪小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "diamonds", description: "打出的♦方块牌在计分时给予+3倍率", best_with: ["flush", "straight_flush"], synergies: ["j_lusty", "j_wrathful", "j_gluttonous", "j_flower_pot", "j_rough_gem", "j_hanging_chad"] },
        { id: "j_lusty", image: "https://patchwiki.biligame.com/images/balatro/8/80/b5x4nierifec18qs2apxorbdfehzwfj.png", name: "色欲小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "hearts", description: "打出的♥红桃牌在计分时给予+3倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_wrathful", "j_gluttonous", "j_bloodstone", "j_flower_pot", "j_hanging_chad"] },
        { id: "j_wrathful", image: "https://patchwiki.biligame.com/images/balatro/3/3c/6lb6wgmvn3w8srp2ftlq92wj7wbl8lr.png", name: "愤怒小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "spades", description: "打出的♠黑桃牌在计分时给予+3倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_lusty", "j_gluttonous", "j_arrowhead", "j_flower_pot", "j_hanging_chad"] },
        { id: "j_gluttonous", image: "https://patchwiki.biligame.com/images/balatro/a/a5/8fo15fuqxf8l8zsuzkxmol401rt282d.png", name: "暴食小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "suit"], suit: "clubs", description: "打出的♣梅花牌在计分时给予+3倍率", best_with: ["flush", "straight_flush"], synergies: ["j_greedy", "j_lusty", "j_wrathful", "j_onyx", "j_flower_pot", "j_smeared", "j_hanging_chad"] },
        
        // 牌型小丑 - 倍数
        { id: "j_jolly", image: "https://patchwiki.biligame.com/images/balatro/1/1a/h1jmgbhs9qvpmno2l74jax4az7p9xq1.png", name: "开心小丑", rarity: "common", type: "joker", effects: { mult: 8 }, tags: ["mult", "hand"], hand: "pair", description: "如果打出的牌包含对子给予+8倍率", best_with: ["one_pair"], synergies: ["j_duo", "j_spare_trousers", "j_mad", "j_clever", "j_zany", "j_wily", "j_trio"], synergy_note: "两对包含对子，打两对时开心小丑+8倍率也会触发，与疯狂小丑/聪敏小丑/备用裤子组成双对流 | 三条/葫芦/四条包含对子，古怪+12/狡猾+100/三重奏×3组成三条流" },
        { id: "j_zany", image: "https://patchwiki.biligame.com/images/balatro/2/29/bpwwkcz4qjtrls91dx3952bwh8kgin7.png", name: "古怪小丑", rarity: "common", type: "joker", effects: { mult: 12 }, tags: ["mult", "hand"], hand: "three_of_a_kind", description: "如果打出的牌包含三条给予+12倍率", best_with: ["three_of_a_kind"], synergies: ["j_trio", "j_wily", "j_jolly"], synergy_note: "狡猾+100筹码/三重奏×3倍率组成三条流核心；葫芦/四条包含三条，开心小丑对子效果也能触发" },
        { id: "j_mad", image: "https://patchwiki.biligame.com/images/balatro/8/8a/2w09lj3xk1yg7oa3sip2kv0z8j7jd84.png", name: "疯狂小丑", rarity: "common", type: "joker", effects: { mult: 10 }, tags: ["mult", "hand"], hand: "two_pair", description: "如果打出的牌包含两对给予+10倍率", best_with: ["two_pair"], synergies: ["j_spare_trousers", "j_clever", "j_jolly", "j_sly", "j_duo"], synergy_note: "备用裤子永久+倍率，聪敏小丑+80筹码，两对核心三件套；开心小丑/奸诈小丑对子效果也在两对中触发；二重奏×2倍率在打两对时也会触发" },
        { id: "j_crazy", image: "https://patchwiki.biligame.com/images/balatro/a/ae/byib2padib80vmq4v9pkcpdq2ij3pyz.png", name: "狂野小丑", rarity: "common", type: "joker", effects: { mult: 12 }, tags: ["mult", "hand"], hand: "straight", description: "如果打出的牌包含顺子给予+12倍率", best_with: ["straight"], synergies: ["j_order", "j_runner", "j_shortcut", "j_four_fingers", "j_superposition"] },
        { id: "j_droll", image: "https://patchwiki.biligame.com/images/balatro/f/fe/irqubwjpnifl8qwy8hfn8im12jvbfuc.png", name: "滑稽小丑", rarity: "common", type: "joker", effects: { mult: 10 }, tags: ["mult", "hand"], hand: "flush", description: "如果打出的牌包含同花给予+10倍率", best_with: ["flush"], synergies: ["j_tribe", "j_smeared", "j_rough_gem", "j_arrowhead"] },
        
        // 牌型小丑 - 筹码
        { id: "j_sly", image: "https://patchwiki.biligame.com/images/balatro/7/7b/j8d3qdudr218l6arppyaz0u41hq3myq.png", name: "奸诈小丑", rarity: "common", type: "joker", effects: { chips: 50 }, tags: ["chips", "hand"], hand: "pair", description: "如果打出的牌包含对子给予+50筹码", best_with: ["one_pair"], synergies: ["j_jolly", "j_duo", "j_spare_trousers", "j_mad", "j_clever"], synergy_note: "两对包含对子，打两对时奸诈小丑+50筹码也会触发，与两对系卡牌组成双对流" },
        { id: "j_wily", image: "https://patchwiki.biligame.com/images/balatro/8/8b/ck7l12j5xddt9fim7k0s48b3qseb4o1.png", name: "狡猾小丑", rarity: "common", type: "joker", effects: { chips: 100 }, tags: ["chips", "hand"], hand: "three_of_a_kind", description: "如果打出的牌包含三条给予+100筹码", best_with: ["three_of_a_kind"], synergies: ["j_zany", "j_trio", "j_jolly"], synergy_note: "古怪+12倍率/三重奏×3倍率组成三条流核心；葫芦包含三条+对子，开心小丑对子效果也能触发" },
        { id: "j_clever", image: "https://patchwiki.biligame.com/images/balatro/3/3c/th0b5s47l29mv7vixsnko4oydqy07pf.png", name: "聪敏小丑", rarity: "common", type: "joker", effects: { chips: 80 }, tags: ["chips", "hand"], hand: "two_pair", description: "如果打出的牌包含两对给予+80筹码", best_with: ["two_pair"], synergies: ["j_mad", "j_spare_trousers", "j_jolly", "j_sly", "j_duo"], synergy_note: "疯狂小丑+10倍率，备用裤子永久+倍率，两对核心三件套；开心小丑/奸诈小丑对子效果也在两对中触发；二重奏×2倍率在打两对时也会触发" },
        { id: "j_devious", image: "https://patchwiki.biligame.com/images/balatro/8/8f/p7mlrv5ku3e69lmvnbfh9sucooqmfnd.png", name: "阴险小丑", rarity: "common", type: "joker", effects: { chips: 100 }, tags: ["chips", "hand"], hand: "straight", description: "如果打出的牌包含顺子给予+80筹码", best_with: ["straight"], synergies: ["j_crazy", "j_order", "j_runner"] },
        { id: "j_crafty", image: "https://patchwiki.biligame.com/images/balatro/2/2c/rdy2etzbjpb3mb46agrr6zz0uouvg6n.png", name: "精明小丑", rarity: "common", type: "joker", effects: { chips: 80 }, tags: ["chips", "hand"], hand: "flush", description: "如果打出的牌包含同花给予+80筹码", best_with: ["flush"], synergies: ["j_droll", "j_tribe", "j_smeared", "j_rough_gem", "j_arrowhead"] },
        
        // 特殊效果
        { id: "j_half", image: "https://patchwiki.biligame.com/images/balatro/1/1e/1baq18cxvdozwk2g5t2150k9xkqk5i2.png", name: "半张小丑", rarity: "common", type: "joker", effects: { mult: 20 }, tags: ["mult", "hand_size"], description: "如果打出的牌的数量不大于3张给予+20倍率", best_with: ["high_card"], synergies: ["j_dna", "j_stuntman"], synergy_note: "特技演员手牌-2，更容易达到3张或更少手牌触发+20倍率" },
        { id: "j_stencil", image: "https://patchwiki.biligame.com/images/balatro/1/17/l9cl7qfplqquu9j6l9gpbkmspv5drhc.png", name: "模具小丑", rarity: "rare", type: "joker", effects: { xmult: "slot" }, tags: ["xmult", "scaling"], description: "每个空的小丑槽位获得×1倍率，模具小丑视为空的小丑槽位", best_with: ["all"], synergies: ["j_madness"] },
        { id: "j_four_fingers", image: "https://patchwiki.biligame.com/images/balatro/7/7d/n6fnqufd693tds7ihc3q8rrgbnqlq6x.png", name: "四指", rarity: "rare", type: "joker", effects: { special: "four_fingers" }, tags: ["special", "straight_flush"], description: "同花和顺子都可以由4张牌组成", best_with: ["straight", "flush", "straight_flush"], synergies: ["j_crazy", "j_droll", "j_order", "j_tribe", "j_shortcut", "j_spare_trousers", "j_square"] },
        
        // 斐波那契、奇数托德、偶数史蒂文 - 核心协同组合!
        { id: "j_fibonacci", image: "https://patchwiki.biligame.com/images/balatro/3/3a/toxn01lyfjhw6zmcml8xq23pi6o05k6.png", name: "斐波那契", rarity: "rare", type: "joker", effects: { mult: 8, rank: [1, 2, 3, 5, 8] }, tags: ["mult", "rank", "fibonacci"], description: "打出的A、2、3、5、8在计分时给予+8倍率", best_with: ["all"], synergies: ["j_even_steven", "j_odd_todd", "j_hack", "j_scholar", "j_wee", "j_hanging_chad", "j_ride_bus"], synergy_note: "与偶数史蒂文配合：2、8触发双重效果 | 与奇数托德配合：A、3、5触发双重效果 | 小小丑2计分+筹码叠加 | 未断选票让第1张计分牌额外触发2次，+8倍率变+24倍率 | 搭乘巴士鼓励只打数字牌，2/3/5/8全是数字牌" },
        { id: "j_even_steven", image: "https://patchwiki.biligame.com/images/balatro/f/f7/jalg6u249sru01koe72yep479n50mnd.png", name: "偶数史蒂文", rarity: "common", type: "joker", effects: { mult: 4, rank: [10, 8, 6, 4, 2] }, tags: ["mult", "rank", "even"], description: "打出的点数为偶数的牌（10、8、6、4、2）在计分时给予+4倍率", best_with: ["all"], synergies: ["j_fibonacci", "j_walkie", "j_wee", "j_hanging_chad", "j_hack", "j_ride_bus"], synergy_note: "与斐波那契配合：2、8触发双重效果 | 烂脱口秀演员让2和4额外触发1次 | 对讲机的10和4都是偶数 | 小小丑2计分时同时+4倍率 | 未断选票让第1张计分牌额外触发2次 | 搭乘巴士鼓励只打数字牌，偶数牌全覆盖" },
        { id: "j_odd_todd", image: "https://patchwiki.biligame.com/images/balatro/2/2e/s5r6g019iwo2127vsji2i09p7f1pzl9.png", name: "奇数托德", rarity: "common", type: "joker", effects: { chips: 31, rank: [1, 9, 7, 5, 3] }, tags: ["chips", "rank", "odd"], description: "打出的点数为奇数的牌（A、9、7、5、3）在计分时给予+31筹码", best_with: ["all"], synergies: ["j_fibonacci", "j_hanging_chad", "j_hack", "j_ride_bus"], synergy_note: "与斐波那契配合：A、3、5触发双重效果 | 烂脱口秀演员让3和5额外触发1次 | 未断选票让第1张计分牌额外触发2次 | 搭乘巴士鼓励只打数字牌，奇数数字牌全覆盖" },
        
        // 学者 - A卡相关
        { id: "j_scholar", image: "https://patchwiki.biligame.com/images/balatro/7/78/irhk7aqgkpnfpmmstmmmgormt1qryso.png", name: "学者", rarity: "common", type: "joker", effects: { chips: 20, mult: 4, rank: [1] }, tags: ["chips", "mult", "ace"], description: "打出的A在计分时给予+4倍率与+20筹码", best_with: ["all"], synergies: ["j_fibonacci", "j_hanging_chad", "j_ride_bus"], synergy_note: "学者和斐波那契都作用于A，打出A时同时触发两者效果 | 未断选票让A额外触发2次，+4倍率+20筹码变+12倍率+60筹码 | 搭乘巴士鼓励只打数字牌，A是数字牌不破连续，学者为A提供强力加成" },
        
        // 人头牌相关
        { id: "j_scary_face", image: "https://patchwiki.biligame.com/images/balatro/f/f8/extizxujmbwa3ni58hjpkxdlowfq3y2.png", name: "恐怖面孔", rarity: "common", type: "joker", effects: { chips: 30 }, tags: ["chips", "face"], description: "打出的人头牌在计分时给予+30筹码", best_with: ["all"], synergies: ["j_photograph", "j_pareidolia", "j_smiley", "j_sock", "j_triboulet"] },
        { id: "j_photograph", image: "https://patchwiki.biligame.com/images/balatro/2/24/4eivtt2jytpc2omr7noffb7m7chkvug.png", name: "照片", rarity: "common", type: "joker", effects: { xmult: 2, rank: "face", position: "first" }, tags: ["xmult", "face"], description: "打出的第1张人头牌在计分时给予×2倍率", best_with: ["all"], synergies: ["j_scary_face", "j_pareidolia", "j_smiley", "j_sock", "j_triboulet"] },
        { id: "j_smiley", image: "https://patchwiki.biligame.com/images/balatro/8/83/ch8lltj2oi5p7idpgujhljpzylg7kx9.png", name: "微笑表情", rarity: "common", type: "joker", effects: { mult: 5, rank: "face" }, tags: ["mult", "face"], description: "打出的人头牌在计分时给予+5倍率", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_pareidolia", "j_sock", "j_triboulet"] },
        { id: "j_sock", image: "https://patchwiki.biligame.com/images/balatro/0/02/7v70wnw4qxvpfq0kz0s02n49e76lc4d.png", name: "喜与悲", rarity: "rare", type: "joker", effects: { special: "reset_face" }, tags: ["special", "face"], description: "打出的人头牌在计分时会额外触发1次", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_smiley", "j_pareidolia", "j_baron", "j_triboulet"], synergy_note: "重置人头牌(J/Q/K)反复计分，特里布莱K/Q×2叠加触发；男爵每张K X1.5叠加触发；恐怖面孔/微笑脸/照片也反复加成", unlock: "在所有对局中打出300张人头牌" },
        { id: "j_pareidolia", image: "https://patchwiki.biligame.com/images/balatro/4/4a/p6k63dxwy711msq5vyur4ogf3q4ivw1.png", name: "幻视", rarity: "rare", type: "joker", effects: { special: "face" }, tags: ["special", "face"], description: "所有游戏牌均视为人头牌", best_with: ["all"], synergies: ["j_scary_face", "j_photograph", "j_smiley", "j_sock", "j_canio", "j_triboulet", "j_business_card", "j_midas"], synergy_note: "幻视让所有牌变人头牌，所有人头牌效果全触发：恐怖面孔/照片/微笑表情/喜与悲/特里布莱计分加成，名片赚钱翻倍，迈达斯面具全变金卡" },
        
        // K/Q 相关
        { id: "j_baron", image: "https://patchwiki.biligame.com/images/balatro/d/df/orzdyyt3i990qobdesm94czzx16pa51.png", name: "男爵", rarity: "legendary", type: "joker", effects: { xmult: "king", value: 1.5 }, tags: ["xmult", "rank"], description: "留在手牌中的每1张K都会给予×1.5倍率", best_with: ["all"], synergies: ["j_triboulet", "j_shoot_moon", "j_sock", "j_mime", "j_steel"], synergy_note: "特里布莱K X2叠加；射月Q+13倍率人头牌体系；喜与悲重置K反复触发X1.5 | 哑剧演员让手牌中K的×1.5额外触发1次 | 钢铁牌K同时触发男爵×1.5和钢铁×1.5双重叠乘" },
        { id: "j_triboulet", image: "https://patchwiki.biligame.com/images/balatro/1/16/1a7l7jjw8ik85e4gqcfqv4dp9ci6rhy.png", name: "特里布莱", rarity: "legendary", type: "joker", effects: { xmult: "king_queen", value: 2 }, tags: ["xmult", "rank"], description: "打出的K和Q在计分时给予×2倍率", best_with: ["all"], synergies: ["j_baron", "j_shoot_moon", "j_scary_face", "j_photograph", "j_smiley", "j_sock", "j_pareidolia"], synergy_note: "K和Q都是人头牌，特里布莱与所有打出人头牌相关卡牌协同：恐怖面孔+30筹码、照片第1张人头牌×2、微笑表情+5倍率、喜与悲额外触发1次、幻视让所有牌变人头牌", unlock: "通过灵魂牌发现" },
        { id: "j_shoot_moon", image: "https://patchwiki.biligame.com/images/balatro/6/6e/0az03mkcxv9fe7acdrlk1i1azkkit2k.png", name: "射月", rarity: "common", type: "joker", effects: { mult: "queen" }, tags: ["mult", "rank"], description: "留在手牌中的每1张Q提供+13倍率", best_with: ["all"], synergies: ["j_baron", "j_triboulet", "j_mime", "j_steel"], synergy_note: "男爵/特里布莱K/Q体系 | 哑剧演员让手牌中Q的+13倍率额外触发1次 | 钢铁牌Q同时触发射月+13和钢铁×1.5" },
        
        // J相关
        { id: "j_hit_road", image: "https://patchwiki.biligame.com/images/balatro/9/98/bhnx4iljfqk1f1h67u5ptwxu1etq4cd.png", name: "上路吧杰克", rarity: "legendary", type: "joker", effects: { xmult: "discard_j", value: 0.5 }, tags: ["xmult", "rank", "discard"], description: "回合中每舍弃1张J，这个小丑获得×0.5倍率，回合结束时重置为起始倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_canio", "j_drunkard", "j_merry_andy"], synergy_note: "醉汉/快乐安迪增加弃牌次数，加速上路吧杰克倍率累积" },
        { id: "j_canio", image: "https://patchwiki.biligame.com/images/balatro/7/71/nsvckiuc1hmattmkxal0z2qrs4bb768.png", name: "卡尼奥", rarity: "legendary", type: "joker", effects: { xmult: "destroy_face" }, tags: ["xmult", "destroy", "face"], description: "每当1张人头牌被摧毁时，这个小丑获得×1倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_hit_road", "j_pareidolia", "j_erosion"], unlock: "通过灵魂牌发现" },
        
        // 10/4 相关
        { id: "j_walkie", image: "https://patchwiki.biligame.com/images/balatro/e/e0/e2w9o0w9zthkk19phfyqq2n8bmxzyqx.png", name: "对讲机", rarity: "common", type: "joker", effects: { chips: 10, mult: 4, rank: [10, 4] }, tags: ["chips", "mult", "rank"], description: "打出的10和4在计分时给予+10筹码与+4倍率", best_with: ["all"], synergies: ["j_even_steven", "j_hack", "j_hanging_chad", "j_ride_bus"], synergy_note: "10和4都是偶数，触发偶数史蒂文；4在烂脱口秀演员重置范围(2,3,4,5)内，重置后反复触发 | 未断选票让第1张计分牌额外触发2次，+10筹码+4倍率变+30筹码+12倍率 | 搭乘巴士鼓励只打数字牌，10和4都是数字牌" },
        
        // 牌型倍率组合
        { id: "j_duo", image: "https://patchwiki.biligame.com/images/balatro/8/8a/3ks8my2xjjnqd35ycva8hb818wtfyed.png", name: "二重奏", rarity: "legendary", type: "joker", effects: { xmult: 2, hand: "pair" }, tags: ["xmult", "hand"], description: "如果打出的牌包含对子，则给予×2倍率", best_with: ["one_pair"], synergies: ["j_jolly", "j_sly", "j_mad", "j_clever", "j_spare_trousers"], synergy_note: "两对包含对子，打两对时二重奏×2也会触发；搭配开心+8倍率/奸诈+50筹码/疯狂+10倍率/聪敏+80筹码/备用裤子永久+倍率，组成对子/双对流", unlock: "赢得1局游戏，且未打出对子" },
        { id: "j_trio", image: "https://patchwiki.biligame.com/images/balatro/e/eb/4xqxpbecldizspgovlu5tdtr132ox70.png", name: "三重奏", rarity: "legendary", type: "joker", effects: { xmult: 3, hand: "three" }, tags: ["xmult", "hand"], description: "如果打出的牌包含三条，则给予×3倍率", best_with: ["three_of_a_kind"], synergies: ["j_zany", "j_wily", "j_jolly"], synergy_note: "古怪+12倍率/狡猾+100筹码组成三条流；葫芦包含三条+对子，开心小丑对子效果也能触发", unlock: "赢得1局游戏，且未打出三条" },
        { id: "j_family", image: "https://patchwiki.biligame.com/images/balatro/4/41/k3uw3hqr7cj21ej6nk03qyek0gygahf.png", name: "一家人", rarity: "legendary", type: "joker", effects: { xmult: 4, hand: "four" }, tags: ["xmult", "hand"], description: "如果打出的牌包含四条，则给予×4倍率", best_with: ["four_of_a_kind"], synergies: ["j_trio"], unlock: "赢得1局游戏，且未打出四条" },
        { id: "j_order", image: "https://patchwiki.biligame.com/images/balatro/c/cc/4oo4dn3pyv959nw5l1a2kjzzdjmu1pd.png", name: "秩序", rarity: "legendary", type: "joker", effects: { xmult: 3, hand: "straight" }, tags: ["xmult", "hand"], description: "如果打出的牌包含顺子，则给予×3倍率", best_with: ["straight"], synergies: ["j_crazy"], unlock: "赢得1局游戏，且未打出顺子" },
        { id: "j_tribe", image: "https://patchwiki.biligame.com/images/balatro/e/e0/i57gzzij7kd0dmsu7ofzl26zjpv2tp9.png", name: "部落", rarity: "legendary", type: "joker", effects: { xmult: 2, hand: "flush" }, tags: ["xmult", "hand"], description: "如果打出的牌包含同花，则给予×2倍率", best_with: ["flush"], synergies: ["j_droll", "j_smeared", "j_rough_gem"], unlock: "赢得1局游戏，且未打出同花" },
        
        // 花色组合
        { id: "j_flower_pot", image: "https://patchwiki.biligame.com/images/balatro/d/db/azku8xrqf7zl0pih0435ksp4xy1yday.png", name: "花盆", rarity: "rare", type: "joker", effects: { xmult: 3, hand: "four_suit" }, tags: ["xmult", "hand"], description: "如果打出的牌型中包含♠♥♣♦花色牌各1张，则给予×3倍率", best_with: ["all"], synergies: ["j_greedy", "j_lusty", "j_wrathful", "j_gluttonous"] },
        { id: "j_blackboard", image: "https://patchwiki.biligame.com/images/balatro/2/25/e8qfv84e7kmm1ughx77kv9zj0yc14ak.png", name: "黑板", rarity: "rare", type: "joker", effects: { xmult: 3, suit: ["spades", "clubs"] }, tags: ["xmult", "suit"], description: "如果留在手牌中的牌花色都是或，则给予×3倍率", best_with: ["all"], synergies: ["j_wrathful", "j_gluttonous", "j_arrowhead", "j_onyx"] },
        { id: "j_bloodstone", image: "https://patchwiki.biligame.com/images/balatro/0/0b/5by0c814rvrs5wf1rg3m9zs89pr8vuk.png", name: "血石", rarity: "rare", type: "joker", effects: { xmult: 1.5, suit: "hearts", chance: 0.5 }, tags: ["xmult", "suit", "chance"], description: "打出的♥红桃牌在计分时有1/2的概率给予×1.5倍率", best_with: ["flush"], synergies: ["j_lusty", "j_gros_michel", "j_smeared", "j_hanging_chad"], synergy_note: "未断选票让第1张计分牌额外触发2次，多2次机会触发X1.5倍率" },
        { id: "j_arrowhead", image: "https://patchwiki.biligame.com/images/balatro/f/fe/qrnz9huicaxe3c4srbc6iu47h9n8mq1.png", name: "箭头", rarity: "rare", type: "joker", effects: { chips: 50, suit: "spades" }, tags: ["chips", "suit"], description: "打出的♠黑桃牌在计分时给予+50筹码", best_with: ["straight", "flush"], synergies: ["j_wrathful", "j_smeared", "j_droll", "j_crafty", "j_hanging_chad"], synergy_note: "箭头黑桃+50筹码，与愤怒小丑同花色协同，模糊小丑扩大触发范围，滑稽/精明同花体系配合 | 未断选票让第1张计分牌额外触发2次，+50筹码变+150筹码", unlock: "牌组中拥有至少30张黑桃" },
        { id: "j_onyx", image: "https://patchwiki.biligame.com/images/balatro/b/b6/j3stvd4iadcz74dpao20x7wqy4dwtd8.png", name: "缟玛瑙", rarity: "rare", type: "joker", effects: { mult: 7, suit: "clubs" }, tags: ["mult", "suit"], description: "打出的♣梅花牌在计分时给予+7倍率", best_with: ["flush"], synergies: ["j_gluttonous", "j_blackboard", "j_smeared", "j_hanging_chad"], unlock: "牌组中拥有至少30张梅花" },
        { id: "j_rough_gem", image: "https://patchwiki.biligame.com/images/balatro/8/82/to4w28fzybcjdl1hnw4ilptjnqxz89l.png", name: "璞玉", rarity: "rare", type: "joker", effects: { economy: "diamonds", value: 1 }, tags: ["economy", "suit"], description: "打出的♦方块牌在计分时获得$1", best_with: ["flush", "straight_flush"], synergies: ["j_tribe", "j_smeared", "j_greedy", "j_droll", "j_crafty", "j_bull", "j_bootstraps"], synergy_note: "璞玉方块牌+$1，与同花体系（部落/滑稽/精明）配合打同花多方块牌收益最大化，贪婪小丑方块+3倍率同花色协同，模糊小丑扩大方块触发范围" },
        
        // 抽牌/弃牌相关
        { id: "j_burglar", image: "https://patchwiki.biligame.com/images/balatro/1/19/5fagb3seokyc4m0w5a6lnn1qtjve1c8.png", name: "窃贼", rarity: "rare", type: "joker", effects: { draw: 3, lose_discards: true }, tags: ["draw", "discard"], description: "选择盲注时，本回合+3出牌次数，并失去所有弃牌次数", best_with: ["all"], synergies: ["j_ramen", "j_mystic_summit", "j_delayed", "j_green", "j_obelisk"], synergy_note: "拉面/绿色小丑不扣倍率，神秘之峰0弃牌+15倍率，延迟满足+$2；方尖石塔：失去弃牌被迫多打非常用牌型，快速叠加X倍率" },
        { id: "j_drunkard", image: "https://patchwiki.biligame.com/images/balatro/a/a1/gwugpb42tdnqmu3scvznqjne5vwhfw2.png", name: "醉汉", rarity: "common", type: "joker", effects: { discard: 1 }, tags: ["discard"], description: "弃牌次数+1", best_with: ["all"], synergies: ["j_yorick", "j_hit_road", "j_banner", "j_burnt"] },
        { id: "j_merry_andy", image: "https://patchwiki.biligame.com/images/balatro/0/0e/08wbjd3k8koyuqvmdl78rrb58r2x3nj.png", name: "快乐安迪", rarity: "rare", type: "joker", effects: { discard: 3, hand_size: -1 }, tags: ["discard", "hand_size"], description: "手牌上限-1，弃牌次数+3", best_with: ["all"], synergies: ["j_yorick", "j_hit_road", "j_banner", "j_burnt"] },
        
        // 经济相关
        { id: "j_golden", image: "https://patchwiki.biligame.com/images/balatro/f/fc/c9e5ugzo7kuw1a557khunghsxx8suhd.png", name: "黄金小丑", rarity: "common", type: "joker", effects: { economy: 4 }, tags: ["economy"], description: "回合结束时获得$4", best_with: ["all"], synergies: ["j_to_moon", "j_rocket", "j_bull", "j_bootstraps"] },
        { id: "j_rocket", image: "https://patchwiki.biligame.com/images/balatro/3/34/segv2a0wf6pcd66woib9n85m6rb6imw.png", name: "火箭", rarity: "rare", type: "joker", effects: { economy: 1, economy_boss: 2 }, tags: ["economy", "boss"], description: "回合结束时获得$1，每击败1个boss盲注会这个能力获得的金钱+$2", best_with: ["all"], synergies: ["j_golden", "j_bull", "j_bootstraps"] },
        { id: "j_to_moon", image: "https://patchwiki.biligame.com/images/balatro/1/19/9awaef0twb7rgmlkjhumhoe4zmeizj4.png", name: "冲向月球", rarity: "rare", type: "joker", effects: { economy: "interest" }, tags: ["economy", "interest"], description: "回合结束时你每有$5，就获得$1的额外利息（不超过当前利息上限）", best_with: ["all"], synergies: ["j_golden", "j_bull", "j_bootstraps"] },
        
        // 复制类
        { id: "j_blueprint", image: "https://patchwiki.biligame.com/images/balatro/d/d2/gapp8i1mspjudd8304lqi6je4wu9a3v.png", name: "蓝图", rarity: "legendary", type: "joker", effects: { special: "copy_right" }, tags: ["special", "copy"], description: "复制右侧小丑牌的能力", best_with: ["all"], synergies: ["j_brainstorm"], unlock: "赢得1局游戏" },
        { id: "j_brainstorm", image: "https://patchwiki.biligame.com/images/balatro/9/97/6td17kusye90w228dlwevrmn18lvjs7.png", name: "头脑风暴", rarity: "legendary", type: "joker", effects: { special: "copy_left" }, tags: ["special", "copy"], description: "复制最左侧小丑牌的能力", best_with: ["all"], synergies: ["j_blueprint"], unlock: "弃掉1副皇家同花顺" },
        
        // 抽象/计数类
        { id: "j_abstract", image: "https://patchwiki.biligame.com/images/balatro/b/b1/50llmpy6671fo31i7aypj9e0au1sbab.png", name: "抽象小丑", rarity: "common", type: "joker", effects: { mult: 3 }, tags: ["mult", "joker_count"], description: "每有1张小丑，这张小丑就获得+3倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_riff_raff", "j_cartomancer"] },
        
        // 抽卡相关
        { id: "j_cartomancer", image: "https://patchwiki.biligame.com/images/balatro/d/de/ezv2labts99no53ak978lj33dqu6163.png", name: "卡牌术士", rarity: "rare", type: "joker", effects: { special: "create_tarot" }, tags: ["special", "tarot"], description: "选择盲注时，获得1张随机塔罗牌（必须有空位）", best_with: ["all"], synergies: ["j_abstract", "j_fortune_teller", "j_campfire"], synergy_note: "抽象小丑获额外倍率 | 占卜师每使用塔罗牌+1倍率 | 篝火每出售+×0.25，卡牌术士每盲注生成塔罗牌可出售喂篝火" },
        { id: "j_fortune_teller", image: "https://patchwiki.biligame.com/images/balatro/5/5e/pcgeplmwdtf4ee29ssmkqjuqglg0pzj.png", name: "占卜师", rarity: "common", type: "joker", effects: { mult: "tarot" }, tags: ["mult", "tarot"], description: "本赛局内每使用过1张塔罗牌，这张小丑获得+1倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_cartomancer", "j_constellation"] },
        { id: "j_constellation", image: "https://patchwiki.biligame.com/images/balatro/8/80/m93qng5jrf8v9ky6pj3fhs011g2xugk.png", name: "星座", rarity: "rare", type: "joker", effects: { xmult: "planet" }, tags: ["xmult", "planet"], description: "每使用1张星球牌，这张小丑获得×0.1倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_fortune_teller", "j_astronomer", "j_satellite"] },
        
        // 顺子相关
        { id: "j_superposition", image: "https://patchwiki.biligame.com/images/balatro/b/b9/to4unqll2r0wi6n1up7kgt3dwl070e6.png", name: "叠加态", rarity: "common", type: "joker", effects: { special: "tarot" }, tags: ["special", "tarot", "straight"], description: "如果打出的牌包含1张A和顺子，生成1张随机塔罗牌（必须有空位）", best_with: ["straight"], synergies: ["j_crazy", "j_shortcut", "j_runner"] },
        { id: "j_shortcut", image: "https://patchwiki.biligame.com/images/balatro/7/79/br3i4o0gqtf4w0x9peg9sk0b2drn3na.png", name: "捷径", rarity: "rare", type: "joker", effects: { special: "straight_gap" }, tags: ["special", "straight"], description: "让顺子可以相隔一个点数组成", best_with: ["straight"], synergies: ["j_crazy", "j_superposition", "j_runner"] },
        { id: "j_runner", image: "https://patchwiki.biligame.com/images/balatro/b/b9/cnxi23vtvbuxtwxp12sglo99g1ay3cq.png", name: "跑步选手", rarity: "common", type: "joker", effects: { chips: 15, hand: "straight" }, tags: ["chips", "hand"], description: "如果打出的牌包含顺子，这张小丑获得+15筹码（起始+0筹码）", best_with: ["straight"], synergies: ["j_crazy", "j_order", "j_superposition", "j_shortcut"] },
        { id: "j_ice_cream", image: "https://patchwiki.biligame.com/images/balatro/4/49/p8tte4xqv0v3e3xjvk21w1le1i4792k.png", name: "冰淇淋", rarity: "common", type: "joker", effects: { chips: 100, chips_decay: 5 }, tags: ["chips", "decay"], description: "+100筹码，每次出牌后这张小丑-5筹码", best_with: ["all"], synergies: [], synergy_note: "高初始筹码但逐渐衰减，适合早期爆发" },
        
        // 基础卡牌（无特殊协同）
        { id: "j_mime", image: "https://patchwiki.biligame.com/images/balatro/f/fc/7avkst1tqfea1ny4zeyzgch6lrui1so.png", name: "哑剧演员", rarity: "rare", type: "joker", effects: { special: "mime" }, tags: ["special", "scoring", "hand_trigger"], description: "额外触发1次所有留在手牌中的牌的能力", best_with: ["all"], synergies: ["j_steel", "j_seltzer", "j_dusk", "j_baron", "j_shoot_moon", "t_chariot"], synergy_note: "哑剧演员让手牌中的能力多触发1次：钢铁牌的×1.5再触发1次（变×2.25）、男爵K的×1.5再触发1次、射月Q的+13倍率再触发1次" },
        { id: "j_credit_card", image: "https://patchwiki.biligame.com/images/balatro/a/aa/5jx4gaf2op57of4alhlahp10b49t0fa.png", name: "信用卡", rarity: "common", type: "joker", effects: { special: "credit" }, tags: ["economy", "debt"], description: "可以负债，最多使资金-$20", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_vagabond"], synergy_note: "信用卡允许负债到-$20，负债会降低斗牛/提靴带效果所以不搭配 | 流浪者在≤$4时生成塔罗牌，负债让条件更容易满足" },
        { id: "j_ceremonial", image: "https://patchwiki.biligame.com/images/balatro/7/7d/i0zkktk6nd4rzt7hjn54rcgbqkfq6us.png", name: "仪式匕首", rarity: "rare", type: "joker", effects: { mult: "destroy_right", permanent: true }, tags: ["mult", "destroy", "boss"], description: "选择盲注时，摧毁这张小丑右侧的小丑牌，并将其售价的2倍永久增加至这张小丑牌的倍率", best_with: ["all"], synergies: ["j_riff_raff", "j_madness", "j_gift_card", "j_egg"], synergy_note: "乌合之众每盲注生成2张小丑补充被摧毁的位置 | 与疯狂摧毁体系配合 | 礼品卡每回合抬高小丑售价，摧毁时获更高永久倍率 | 鸡蛋每回合售价+$3，被摧毁时可获超高永久倍率" },
        { id: "j_banner", image: "https://patchwiki.biligame.com/images/balatro/c/c5/g7vcu3rc0es3r215rnh7npdhz2hzdp1.png", name: "旗帜", rarity: "common", type: "joker", effects: { chips: "discard" }, tags: ["chips", "discard"], description: "每有1次剩余的弃牌次数，这张小丑就获得+30筹码", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_mystic_summit", image: "https://patchwiki.biligame.com/images/balatro/e/e1/3iuoooh5zwx10lvzds79x70t2hp420g.png", name: "神秘之峰", rarity: "common", type: "joker", effects: { mult: 15 }, tags: ["mult", "discard"], description: "剩余弃牌次数为0时给予+15倍率", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除所有弃牌，使神秘之峰始终保持+15倍率" },
        { id: "j_marble", image: "https://patchwiki.biligame.com/images/balatro/5/55/dtamo4pgkn7yr5vp40a44tf2u56wxsf.png", name: "大理石小丑", rarity: "rare", type: "joker", effects: { special: "stone" }, tags: ["special", "deck"], description: "选择盲注时，增加1张石头牌到牌组中", best_with: ["all"], synergies: ["j_stone", "j_hologram"] },
        { id: "j_loyalty", image: "https://patchwiki.biligame.com/images/balatro/1/14/qvt6hi39uy299q14boca3ezz2q39lzt.png", name: "积分卡", rarity: "rare", type: "joker", effects: { xmult: 4, trigger: 6 }, tags: ["xmult", "timing"], description: "每第6次出牌，给予×4倍率", best_with: ["all"], synergies: ["j_seltzer"] },
        { id: "j_8ball", image: "https://patchwiki.biligame.com/images/balatro/6/6d/gcef9yu9cz6ffo24rrbkpij6ka4e7nv.png", name: "8号球", rarity: "common", type: "joker", effects: { special: "tarot_chance", chance: 0.25 }, tags: ["special", "tarot"], description: "打出的每1张计分的8都有1/4概率生成1张塔罗牌（必须有空位）", best_with: ["all"], synergies: ["j_fibonacci", "j_even_steven", "j_oops_6"], synergy_note: "8同时触发斐波那契+8倍率和偶数史蒂文+4倍率；六六大顺将1/4概率翻倍为1/2" },
        { id: "j_misprint", image: "https://patchwiki.biligame.com/images/balatro/0/0a/ccclc428x4zqta8l84viiedmzj47h7h.png", name: "印错小丑", rarity: "common", type: "joker", effects: { mult: "random_23" }, tags: ["mult", "random"], description: "随机给予+0~23倍率", best_with: ["all"], synergies: [] },
        { id: "j_dusk", image: "https://patchwiki.biligame.com/images/balatro/0/07/djsud7bh63esokfihghs6duk4t7l3ym.png", name: "黄昏", rarity: "rare", type: "joker", effects: { special: "dusk" }, tags: ["special", "scoring", "rescore"], description: "每回合最后1次出牌中打出并计分的牌会额外触发1次", best_with: ["all"], synergies: ["j_hanging_chad", "j_abstract"], synergy_note: "配合未断选票最大化重复打出，配合抽象小丑增加倍率" },
        { id: "j_raised_fist", image: "https://patchwiki.biligame.com/images/balatro/1/19/oynkxljgt7opuv0dn7syowlg30niq2b.png", name: "致胜之拳", rarity: "common", type: "joker", effects: { mult: "lowest" }, tags: ["mult", "hand"], description: "增加手牌中点数最小的牌的点数2倍的倍率", best_with: ["all"], synergies: [] },
        { id: "j_chaos", image: "https://patchwiki.biligame.com/images/balatro/b/bf/fac3rin13zqz1uif7jtpd9xpjvw6pdl.png", name: "混沌小丑", rarity: "common", type: "joker", effects: { special: "reroll" }, tags: ["special", "shop"], description: "购买时与每次进入商店时有1次免费重掷", best_with: ["all"], synergies: ["j_astronomer"] },
        { id: "j_steel", image: "https://patchwiki.biligame.com/images/balatro/1/15/h7xp2yhnb4mcbqk0x6932crzytaefqi.png", name: "钢铁小丑", rarity: "rare", type: "joker", effects: { xmult: "steel" }, tags: ["xmult", "steel"], description: "完整牌组内每有1张钢铁牌，这张小丑就获得×0.2倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_mime", "j_baron", "j_shoot_moon", "j_certificate", "t_chariot"], synergy_note: "哑剧演员让手牌中钢铁牌×1.5额外触发1次（变×2.25）；男爵K×1.5+钢铁×1.5双重叠乘；射月Q+13倍率+钢铁×1.5手牌多重收益；证书每回合加牌扩大牌组增加钢铁牌来源 | 战车创造钢铁牌是核心来源" },
        { id: "j_delayed", image: "https://patchwiki.biligame.com/images/balatro/9/95/ky6fq80xqexrpd77wofyxtbutqlxosn.png", name: "延迟满足", rarity: "common", type: "joker", effects: { economy: "discard" }, tags: ["economy", "discard"], description: "如果回合中你没有使用过弃牌，则该回合结束时每个剩余的弃牌次数都会给予$2", best_with: ["all"], synergies: ["j_burglar", "j_bull", "j_bootstraps"], synergy_note: "窃贼移除所有弃牌，使延迟满足始终获得最高$收益；赚的钱通过斗牛转筹码、提靴带转倍率" },
        { id: "j_hack", image: "https://patchwiki.biligame.com/images/balatro/3/30/e2xladxnuykgjaj2jr5mq8ysqck4b91.png", name: "烂脱口秀演员", rarity: "rare", type: "joker", effects: { special: "hack" }, tags: ["special", "rank"], description: "打出的2、3、4、5在计分时额外触发1次", best_with: ["all"], synergies: ["j_fibonacci", "j_walkie", "j_wee", "j_hanging_chad", "j_ride_bus"], synergy_note: "重置2,3,4,5反复计分：斐波那契2,3,5都在范围内；对讲机4在范围内；小小丑2在范围内反复+筹码 | 未断选票+烂脱口秀演员双重重复触发，第1张2/3/4/5计分3次 | 搭乘巴士鼓励只打数字牌，2/3/4/5全是数字牌" },
        { id: "j_gros_michel", image: "https://patchwiki.biligame.com/images/balatro/9/9a/g5wvjrhpy3gz6i02vjpt0jix293vw1h.png", name: "大麦克香蕉", rarity: "common", type: "joker", effects: { mult: 15 }, tags: ["mult", "risky"], description: "+15倍率，回合结束时有1/6概率自毁", best_with: ["all"], synergies: ["j_bloodstone"] },
        { id: "j_business_card", image: "https://patchwiki.biligame.com/images/balatro/3/33/8yyn5nuod9nhybrqnnmn3emontfhjd9.png", name: "名片", rarity: "common", type: "joker", effects: { economy: "face", chance: 0.5 }, tags: ["economy", "face"], description: "打出的人头牌在计分时有1/2概率给予$2", best_with: ["all"], synergies: ["j_pareidolia", "j_midas", "j_bull", "j_bootstraps", "j_sock"], synergy_note: "幻视所有牌变人头牌触发名片；迈达斯同为人头牌体系；喜与悲人头牌额外触发1次，多一次概率触发$2" },
        { id: "j_supernova", image: "https://patchwiki.biligame.com/images/balatro/a/a5/rmpddv328enfhes0ucxmzfulq0jrt0s.png", name: "超新星", rarity: "common", type: "joker", effects: { mult: "hand_used" }, tags: ["mult", "scaling"], description: "将当前打出的牌型在本赛局打出的次数增加至倍率", best_with: ["all"], synergies: ["j_space", "j_dna"], synergy_note: "太空1/4概率升级牌型 | DNA反复出高牌(High Card)，超新星倍率持续叠加" },
        { id: "j_ride_bus", image: "https://patchwiki.biligame.com/images/balatro/8/84/j4dlq5hj5nefkc79jnjwnmk3jwtimf8.png", name: "搭乘巴士", rarity: "common", type: "joker", effects: { mult: "consecutive" }, tags: ["mult", "consecutive"], description: "连续打出没有计分的人头牌时，这张小丑获得+1倍率，失败将会重置为起始倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_even_steven", "j_odd_todd", "j_fibonacci", "j_walkie", "j_hack", "j_wee", "s_cryptid", "s_incantation"], synergy_note: "搭乘巴士要求只打数字牌不打人头牌：偶数史蒂文(偶数+4倍率)/奇数托德(奇数+31筹码)/斐波那契(2358+8倍率)/对讲机(104加成)/烂脱口秀演员(2345额外触发)/小小丑(2永久+8筹码)都为数字牌提供加成 | 神秘生物复制数字牌增加密度 | 咒语摧毁1牌生成4张强化数字牌" },
        { id: "j_space", image: "https://patchwiki.biligame.com/images/balatro/a/a7/kjn7jhxg51of35dwgr9eoig7hj9hvsl.png", name: "太空小丑", rarity: "rare", type: "joker", effects: { special: "upgrade", chance: 0.25 }, tags: ["special", "upgrade"], description: "有1/4的概率提升打出牌型的等级", best_with: ["all"], synergies: ["j_supernova", "j_oops_6"] },
        { id: "j_egg", image: "https://patchwiki.biligame.com/images/balatro/f/f5/tl060oghnlfl49nb0f56mglzo0iovzc.png", name: "鸡蛋", rarity: "common", type: "joker", effects: { economy: 3 }, tags: ["economy"], description: "回合结束时，这张小丑的售价+$3", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_bull", "j_bootstraps", "j_swashbuckler", "j_ceremonial"], synergy_note: "鸡蛋每回合售价+$3，侠盗将所有小丑总售价转化为倍率，鸡蛋单卡就能持续涨倍率 | 仪式匕首摧毁鸡蛋时获得超高售价2倍的永久倍率" },
        { id: "j_dna", image: "https://patchwiki.biligame.com/images/balatro/f/f3/rees1v02ta0b7zyfmyu1g7xoy1sbyy8.png", name: "DNA", rarity: "legendary", type: "joker", effects: { special: "copy" }, tags: ["special", "copy"], description: "如果回合内的第1次出牌只有1张牌，则将其1张复制加入完整牌组中，并将该复制加入手牌", best_with: ["high_card"], synergies: ["j_half", "j_hologram", "j_hanging_chad", "j_hiker", "j_supernova", "j_blue"], synergy_note: "半张小丑出≤3张牌+20倍率 | 全息影像每复制+×0.25倍率 | 未断选票让单牌额外触发2次 | 徒步者反复出同一张单牌永久叠筹码 | 超新星每打高牌+倍率 | 蓝色小丑按牌组牌数+2筹码，DNA每回合复制加牌持续增强", unlock: "在回合第一手只打出1张牌" },
        { id: "j_splash", image: "https://patchwiki.biligame.com/images/balatro/b/b2/0mt56v12305whfq5hlz5vatb32lqsd1.png", name: "飞溅", rarity: "common", type: "joker", effects: { special: "splash" }, tags: ["special", "scoring"], description: "每张打出的牌都会被计分", best_with: ["all"], synergies: ["j_photograph", "j_scary_face", "j_smiley", "j_triboulet", "j_sock", "j_hiker"], synergy_note: "飞溅让所有打出的牌计分，人头牌加成卡(恐怖面孔/照片/微笑表情/特里布莱)和喜与悲全部触发；徒步者每张计分牌永久+5筹码" },
        { id: "j_blue", image: "https://patchwiki.biligame.com/images/balatro/6/62/evw6ijpwkbdxsxy5n1tf792cxrzpkam.png", name: "蓝色小丑", rarity: "common", type: "joker", effects: { chips: "deck_remaining" }, tags: ["chips", "deck"], description: "当前牌组每有1张牌，这张小丑就获得+2筹码", best_with: ["all"], synergies: ["j_dna", "j_certificate", "j_marble"], synergy_note: "蓝色小丑按牌组剩余牌数给筹码，加牌流小丑直接增强：DNA复制单牌加入牌组、证书选盲注加蜡封牌、大理石小丑选盲注加石头牌，都能持续增加牌组总数提升筹码" },
        { id: "j_sixth_sense", image: "https://patchwiki.biligame.com/images/balatro/6/65/dfl8l0fv3wxk8yxwyi3abtj9wtmbv97.png", name: "第六感", rarity: "rare", type: "joker", effects: { special: "soul" }, tags: ["special", "soul"], description: "如果回合内的第一次出牌只有1张单独的6，则将其摧毁并获得1张随机的幻灵牌（必须有空间）", best_with: ["all"], synergies: ["j_seance", "j_fortune_teller", "j_erosion"] },
        { id: "j_hiker", image: "https://patchwiki.biligame.com/images/balatro/6/69/me7cjq9mrw2qqc04bz9993m7wjgbt19.png", name: "徒步者", rarity: "rare", type: "joker", effects: { chips: "permanent_5" }, tags: ["chips", "permanent"], description: "打出的牌在计分时永久获得+5筹码", best_with: ["all"], synergies: ["j_splash", "j_hanging_chad", "j_dna"], synergy_note: "飞溅让所有打出的牌计分+5筹码 | 未断选票让第1张计分牌额外触发2次，永久+15筹码 | DNA反复出同一张单牌，筹码滚雪球叠加" },
        { id: "j_faceless", image: "https://patchwiki.biligame.com/images/balatro/e/ef/2tomancmctdued3dyjkxq0elshvkn8g.png", name: "无面小丑", rarity: "common", type: "joker", effects: { economy: "face_discard", count: 3 }, tags: ["economy", "discard"], description: "如果一次弃牌中舍弃了3张及以上的人头牌，获得$5", best_with: ["all"], synergies: ["j_pareidolia", "j_drunkard", "j_merry_andy", "j_bull", "j_bootstraps"] },
        { id: "j_green", image: "https://patchwiki.biligame.com/images/balatro/7/7e/991g9xls64e2erk00a1uiudaih91zrt.png", name: "绿色小丑", rarity: "common", type: "joker", effects: { mult: "play", mult_neg: "discard" }, tags: ["mult", "play", "discard"], description: "每次出牌这个小丑+1倍率，每次弃牌这个小丑-1倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除弃牌次数，使绿色小丑不会因弃牌扣倍率" },
        { id: "j_todo", image: "https://patchwiki.biligame.com/images/balatro/3/35/4fmodu2e4a1dau4l437axfailjfgbu5.png", name: "待办清单", rarity: "common", type: "joker", effects: { economy: "hand", hand: "changing" }, tags: ["economy", "hand"], description: "如果打出的牌型为（对应牌型），获得$4，每个回合结束时要求的牌型都会随机改变", best_with: ["all"], synergies: ["j_bull", "j_bootstraps"] },
        { id: "j_cavendish", image: "https://patchwiki.biligame.com/images/balatro/9/9a/dl1ocmf04t85b8etg0vlyrpmlb9a9nf.png", name: "卡文迪什", rarity: "common", type: "joker", effects: { xmult: 3, destroy_chance: 0.001 }, tags: ["xmult", "risky"], description: "×3倍率，回合结束时有1/1000的概率摧毁此牌", best_with: ["all"], synergies: [], exclusive_with: "j_gros_michel", unlock: "当前对局中大麦克香蕉自毁后出现" },
        { id: "j_card_sharp", image: "https://patchwiki.biligame.com/images/balatro/1/15/rralu3t2r32s4qgue8xyti21e1j2li2.png", name: "老千小丑", rarity: "rare", type: "joker", effects: { xmult: 3, hand: "repeat" }, tags: ["xmult", "hand"], description: "如果打出的牌型在本回合中已经打出过，则给予×3倍率", best_with: ["all"], synergies: ["j_hanging_chad", "j_dusk"] },
        { id: "j_red", image: "https://patchwiki.biligame.com/images/balatro/0/02/4cl551wxfv2byvt5y1vctg43ecel2cb.png", name: "红牌", rarity: "common", type: "joker", effects: { mult: "skip", count: 3 }, tags: ["mult", "skip"], description: "每次在补充包中按下跳过键，这张小丑牌获得+3倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_throwback"] },
        { id: "j_madness", image: "https://patchwiki.biligame.com/images/balatro/8/8b/1bch8eqfckweutkhvokdkqnw8qs8kbl.png", name: "疯狂", rarity: "rare", type: "joker", effects: { xmult: 0.5, destroy: "random" }, tags: ["xmult", "destroy"], description: "选择小盲注或大盲注时，这张小丑牌获得×0.5倍率，并随机摧毁1张其他小丑牌（起始×1倍率）", best_with: ["all"], synergies: ["j_abstract"], synergy_note: "每回合摧毁Joker，抽象小丑获得额外倍率" },
        { id: "j_square", image: "https://patchwiki.biligame.com/images/balatro/e/e0/tnh9pullb74b6445e07ctr3x5hpstuc.png", name: "方形小丑", rarity: "common", type: "joker", effects: { chips: 4, hand_size: 4 }, tags: ["chips", "hand_size"], description: "如果打出的牌的数量为4张，这张小丑获得+4筹码（起始+0筹码）", best_with: ["all"], synergies: ["j_turtle_bean", "j_juggler", "j_four_fingers", "j_spare_trousers"] },
        { id: "j_seance", image: "https://patchwiki.biligame.com/images/balatro/f/fd/ebyeuds3k3xyn38dtr3ykcfvzgwdfqu.png", name: "通灵", rarity: "rare", type: "joker", effects: { special: "spectral" }, tags: ["special", "spectral", "flush"], description: "如果打出的牌型为同花顺，则会获得1张随机的幻灵牌（必须有空位）", best_with: ["straight_flush"], synergies: ["j_fortune_teller", "j_constellation"] },
        { id: "j_riff_raff", image: "https://patchwiki.biligame.com/images/balatro/7/79/2fy52grw2p7b3rg7gp1c9sk49ye83wc.png", name: "乌合之众", rarity: "common", type: "joker", effects: { special: "create_joker", count: 2 }, tags: ["special", "create"], description: "选择盲注时，生成2张随机普通小丑牌", best_with: ["all"], synergies: ["j_abstract", "j_campfire", "j_ceremonial"], synergy_note: "抽象小丑获得额外倍率 | 篝火每出售+×0.25，乌合之众每盲注生成2张小丑可出售喂篝火+×0.5 | 仪式匕首摧毁小丑后乌合之众持续补位" },
        { id: "j_vampire", image: "https://patchwiki.biligame.com/images/balatro/2/2f/eqtijo8jnuzlx7vwlx8olix8rf7y5ys.png", name: "吸血鬼", rarity: "rare", type: "joker", effects: { xmult: "augment", chance: 0.1 }, tags: ["xmult", "augment"], description: "每打出1张计分的增强游戏牌，这张小丑获得×0.1倍率，并移除游戏牌的增强效果（起始×1倍率）", best_with: ["all"], synergies: ["t_empress", "t_emperor", "j_midas"], synergy_note: "迈达斯面具持续产出金卡供吸血鬼吸收，皇后/皇帝持续创造增强牌供吸血鬼消耗叠倍率" },
        { id: "j_hologram", image: "https://patchwiki.biligame.com/images/balatro/6/65/84em1b6mq32h83v4s4egu9xt5u91oa2.png", name: "全息影像", rarity: "rare", type: "joker", effects: { xmult: "card_added", value: 0.25 }, tags: ["xmult", "deck"], description: "每添加1张游戏牌到你的完整牌组中，这个小丑获得×0.25倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_fortune_teller", "j_constellation", "j_dna", "j_certificate", "j_marble"], synergy_note: "占卜师/星座配合塔罗牌/行星牌使用间接加牌；DNA复制单牌加入牌组；证书选盲注时加牌；大理石小丑选盲注时加石头牌，均触发全息+×0.25" },
        { id: "j_vagabond", image: "https://patchwiki.biligame.com/images/balatro/2/20/0m0zilxvq8o22h2sue2akk9snho3zfn.png", name: "流浪者", rarity: "legendary", type: "joker", effects: { special: "tarot", cost: 4 }, tags: ["special", "tarot"], description: "如果出牌时资金小于或等于$4，则生成1张随机塔罗牌（必须有空位）", best_with: ["all"], synergies: ["j_fortune_teller", "j_constellation", "j_cartomancer", "j_credit_card"], unlock: "手持$4或更少时打出牌" },
        { id: "j_cloud9", image: "https://patchwiki.biligame.com/images/balatro/4/4a/qa0hbe1o9zdtgq1xrada5j0f90xjr0i.png", name: "9霄云外", rarity: "rare", type: "joker", effects: { economy: "nine" }, tags: ["economy", "rank"], description: "完整牌组中每有1张9，回合结束时就获得$1", best_with: ["all"], synergies: ["j_to_moon", "j_bull", "j_bootstraps"] },
        { id: "j_obelisk", image: "https://patchwiki.biligame.com/images/balatro/d/d9/8m6xfs7ajv8gq3s84njh85wd9kdyyqm.png", name: "方尖石塔", rarity: "legendary", type: "joker", effects: { xmult: "uncommon_hand", value: 0.2 }, tags: ["xmult", "hand"], description: "连续打出你不是最常用的牌型时，这个小丑获得×0.2倍率，失败将会重置为起始倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_straight", "j_tribe", "j_two_pair", "j_burglar"], synergy_note: "窃贼失去弃牌只能出牌，被迫多打非常用牌型，方尖石塔快速叠加X倍率" },
        { id: "j_midas", image: "https://patchwiki.biligame.com/images/balatro/e/e7/7mxa1mkl2bwsxmqrpdxmybih802r6zt.png", name: "迈达斯面具", rarity: "rare", type: "joker", effects: { special: "gold" }, tags: ["special", "gold", "face"], description: "打出的人头牌在计分时变为黄金牌", best_with: ["all"], synergies: ["j_golden_ticket", "j_pareidolia", "j_vampire", "j_sock"], synergy_note: "迈达斯面具持续将人头牌变成金卡，为吸血鬼提供源源不断的增强牌来吸收；喜与悲人头牌额外触发增加变金效率" },
        { id: "j_luchador", image: "https://patchwiki.biligame.com/images/balatro/6/6d/f3wrhpore92ya3p5iv5uevqv885yi5c.png", name: "摔跤手", rarity: "rare", type: "joker", effects: { special: "disable_boss" }, tags: ["special", "boss"], description: "售出这张小丑牌会消除当前boss盲注的效果", best_with: ["all"], synergies: ["j_chicot"] },
        { id: "j_gift_card", image: "https://patchwiki.biligame.com/images/balatro/c/c9/dkef25sjbs1qx2vrh22kp4u8rgvvwod.png", name: "礼品卡", rarity: "rare", type: "joker", effects: { economy: "selling" }, tags: ["economy"], description: "回合结束时，使持有的小丑牌和消耗牌售价+$1", best_with: ["all"], synergies: ["j_campfire", "j_swashbuckler", "j_ceremonial", "j_bull", "j_bootstraps"], synergy_note: "侠盗将所有小丑总售价转化为倍率，礼品卡每回合+$1售价直接帮侠盗涨倍率 | 仪式匕首摧毁右侧小丑获售价2倍永久倍率，礼品卡抬高售价让匕首吃更多 | 篝火出售+×0.25叠加" },
        { id: "j_turtle_bean", image: "https://patchwiki.biligame.com/images/balatro/4/4d/qmehu20rmsr4j81bjt76ey36050zi76.png", name: "黑龟豆", rarity: "rare", type: "joker", effects: { hand_size: 5 }, tags: ["hand_size"], description: "+5手牌上限，回合结束时-1手牌上限", best_with: ["all"], synergies: ["j_juggler", "j_square"] },
        { id: "j_erosion", image: "https://patchwiki.biligame.com/images/balatro/b/b9/qm9atscbtq9q078awsd1iocsfdzq8x8.png", name: "侵蚀", rarity: "rare", type: "joker", effects: { mult: "lower_cards" }, tags: ["mult", "deck"], description: "当前的完整牌组数量每比初始的完整牌组数量少1张，这个小丑就获得+4倍率（起始+0倍率）", best_with: ["all"], synergies: ["t_hanged", "s_immolate", "j_sixth_sense", "j_canio"], synergy_note: "倒吊人移除2张牌=+8倍率；火祭摧毁5张牌=+20倍率且获$20；第六感摧毁6减少牌组+4倍率；卡尼奥摧毁人头牌叠X倍率，与侵蚀+倍率双重收益" },
        { id: "j_reserved", image: "https://patchwiki.biligame.com/images/balatro/2/2e/tnt8nrwx4ovw9eoc0it1e3745jfkk1g.png", name: "私人车位", rarity: "common", type: "joker", effects: { economy: "face_hand", chance: 0.5 }, tags: ["economy", "face"], description: "每次出牌后留在手牌中的每1张人头牌有1/2的概率获得$1", best_with: ["all"], synergies: ["j_pareidolia", "j_bull", "j_bootstraps"] },
        { id: "j_mail_in", image: "https://patchwiki.biligame.com/images/balatro/9/95/9is70ma7c6jk8q5xfjj23shuhxnhmvw.png", name: "邮寄回扣", rarity: "common", type: "joker", effects: { economy: "rank_discard", rank: "changing" }, tags: ["economy", "discard"], description: "每弃掉1张（对应点数）获得$5，每个回合点数都会改变", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy", "j_bull", "j_bootstraps"] },
        { id: "j_hallucination", image: "https://patchwiki.biligame.com/images/balatro/e/ed/21y2rnyijwmuoz6l1keu66h11fdb1jz.png", name: "幻觉", rarity: "common", type: "joker", effects: { special: "tarot", chance: 0.5 }, tags: ["special", "tarot"], description: "每次打开补充包都有1/2的概率获得1张随机塔罗牌（必须有空位）", best_with: ["all"], synergies: ["j_cartomancer", "j_fortune_teller"] },
        { id: "j_juggler", image: "https://patchwiki.biligame.com/images/balatro/a/a6/ieqwcd4cqxakqswlaxpblshroazwgbj.png", name: "杂耍师", rarity: "common", type: "joker", effects: { hand_size: 1 }, tags: ["hand_size"], description: "手牌上限+1", best_with: ["all"], synergies: ["j_turtle_bean", "j_troubadour"] },
        { id: "j_stone", image: "https://patchwiki.biligame.com/images/balatro/f/f9/12kdaiabrki0nea23x3bv0sg1zajeog.png", name: "石头小丑", rarity: "rare", type: "joker", effects: { chips: "stone" }, tags: ["chips", "stone"], description: "完整牌组内每有1张石头牌，这个小丑牌获得+25筹码（起始+0筹码）", best_with: ["all"], synergies: ["j_marble"] },
        { id: "j_lucky_cat", image: "https://patchwiki.biligame.com/images/balatro/0/00/n12p2x6idikwbdq69hlbwz6yare5nob.png", name: "招财猫", rarity: "rare", type: "joker", effects: { xmult: "lucky", value: 0.25 }, tags: ["xmult", "lucky"], description: "每次幸运牌被触发时，这张小丑获得×0.25倍率（起始×1倍率）", best_with: ["all"], synergies: ["t_magician", "j_oops_6"] },
        { id: "j_baseball", image: "https://patchwiki.biligame.com/images/balatro/b/b0/i7fuph3847pmy3clsgeyhknj5w2bzb6.png", name: "棒球卡", rarity: "legendary", type: "joker", effects: { xmult: "rare_joker", value: 1.5 }, tags: ["xmult", "rare"], description: "每张罕见小丑会给予×1.5倍率", best_with: ["all"], synergies: ["j_steel", "j_hack", "j_glass", "j_mime", "j_card_sharp", "j_seance", "j_constellation"], synergy_note: "棒球卡让每张稀有小丑额外×1.5倍率，稀有小丑越多倍率越恐怖。钢铁小丑(稀有)、烂脱口秀演员(稀有)、玻璃小丑(稀有)、哑剧演员(稀有)、老千小丑(稀有)、通灵(稀有)、星座(稀有)都是强力稀有小丑" },
        { id: "j_bull", image: "https://patchwiki.biligame.com/images/balatro/f/f1/0bv6vuas274xzrf59v7lnahlt5mmp7t.png", name: "斗牛", rarity: "rare", type: "joker", effects: { chips: "money", value: 2 }, tags: ["chips", "economy"], description: "每持有$1这个小丑就获得+2筹码", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_bootstraps", "j_rocket", "j_credit_card", "j_delayed", "j_business_card", "j_egg", "j_faceless", "j_todo", "j_cloud9", "j_gift_card", "j_reserved", "j_mail_in", "j_trading", "j_golden_ticket", "j_matador", "j_satellite", "j_rough_gem"] },
        { id: "j_diet_cola", image: "https://patchwiki.biligame.com/images/balatro/c/c6/2ypdeu1bjm7x5152k6bysdm8yi4f3vd.png", name: "零糖可乐", rarity: "rare", type: "joker", effects: { special: "double" }, tags: ["special", "double"], description: "售出这张小丑牌会获得1个双倍标签", best_with: ["all"], synergies: ["j_campfire"] },
        { id: "j_trading", image: "https://patchwiki.biligame.com/images/balatro/a/a6/okf4gyhj4vrhe7ow0xkyb2avza98tyh.png", name: "交易卡", rarity: "rare", type: "joker", effects: { economy: "single_discard", value: 3 }, tags: ["economy", "discard"], description: "如果回合内的第一次弃牌只有1张牌，则会将其摧毁并获得$3", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy", "j_bull", "j_bootstraps"] },
        { id: "j_flash", image: "https://patchwiki.biligame.com/images/balatro/0/0d/nmdc2mxq87sx1p585nj0dqd87n4baog.png", name: "闪示卡", rarity: "rare", type: "joker", effects: { mult: "reroll" }, tags: ["mult", "shop"], description: "每在商店中重掷1次，这个小丑获得+2倍率（起始+0倍率）", best_with: ["all"], synergies: ["j_chaos"] },
        { id: "j_popcorn", image: "https://patchwiki.biligame.com/images/balatro/4/46/6b4o5i84zjaozaffhv1hcbctu53tcid.png", name: "爆米花", rarity: "common", type: "joker", effects: { mult: 20, mult_decay: 4 }, tags: ["mult", "decay"], description: "+20倍率，回合结束时这个小丑-4倍率", best_with: ["all"], synergies: [] },
        { id: "j_spare_trousers", image: "https://patchwiki.biligame.com/images/balatro/a/a2/0oeftdb257l6nk8getn12jrch630smg.png", name: "备用裤子", rarity: "rare", type: "joker", effects: { mult: "two_pair" }, tags: ["mult", "hand"], hand: "two_pair", description: "如果打出的牌包含两对，这个小丑获得+2倍率（起始+0倍率）", best_with: ["two_pair"], synergies: ["j_mad", "j_clever", "j_jolly", "j_four_fingers", "j_square", "j_duo"], synergy_note: "疯狂小丑+10倍率、聪敏小丑+80筹码，两对核心三件套；开心小丑对子也在两对内触发；四指降低组牌门槛；二重奏×2倍率在打两对时也会触发" },
        { id: "j_ancient", image: "https://patchwiki.biligame.com/images/balatro/8/8c/gio0i781jyrndhf35zrokkhmv3nk3mx.png", name: "古老小丑", rarity: "legendary", type: "joker", effects: { xmult: 1.5, suit: "changing" }, tags: ["xmult", "suit", "changing"], description: "打出的（对应花色）牌在计分时会给予×1.5倍率，每个回合结束时需求花色都会改变", best_with: ["all"], synergies: ["j_smeared"] },
        { id: "j_ramen", image: "https://patchwiki.biligame.com/images/balatro/f/f6/jdfe5s4i7vlw5hi425fb80phj0x2e2f.png", name: "拉面", rarity: "rare", type: "joker", effects: { xmult: 2, mult_neg: "discard" }, tags: ["xmult", "discard"], description: "×2倍率，每弃1张牌失去×0.01倍率", best_with: ["all"], synergies: ["j_burglar"], synergy_note: "窃贼移除所有弃牌次数，使拉面保持满倍率" },
        { id: "j_seltzer", image: "https://patchwiki.biligame.com/images/balatro/d/d7/9aq7q8lpby4yi7skwoyzkdnse60i7k1.png", name: "苏打水", rarity: "rare", type: "joker", effects: { special: "reset", count: 10 }, tags: ["special", "reset"], description: "接下来的10次出牌中打出并计分的牌会额外触发1次", best_with: ["all"], synergies: ["j_hack", "j_hanging_chad"] },
        { id: "j_castle", image: "https://patchwiki.biligame.com/images/balatro/9/98/hhdq8tip39ckmuq856ixkiagsk3rpn4.png", name: "城堡", rarity: "rare", type: "joker", effects: { chips: "suit_discard", suit: "changing" }, tags: ["chips", "discard", "suit"], description: "每弃掉1张（对应花色）牌，这个小丑牌获得+3筹码，每个回合结束时花色都会改变（起始+0筹码）", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_campfire", image: "https://patchwiki.biligame.com/images/balatro/1/1a/mll86mdw41y8mu40ac4xe2cwgpzsb9w.png", name: "篝火", rarity: "legendary", type: "joker", effects: { xmult: "sell", value: 0.25 }, tags: ["xmult", "sell", "boss"], description: "每售出1张牌，这个小丑获得×0.25倍率，击败boss盲注后重置为起始倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_gift_card", "j_diet_cola", "j_riff_raff", "j_cartomancer"], synergy_note: "礼品卡抬高售价增值 | 零糖可乐出售创造免费双倍 | 乌合之众每盲注生成2张小丑可出售喂篝火+×0.5 | 卡牌术士每盲注生成塔罗牌可出售喂篝火+×0.25" },
        { id: "j_golden_ticket", image: "https://patchwiki.biligame.com/images/balatro/8/8e/sziabhgul1dm84fpyvo83hzdiz9linu.png", name: "黄金门票", rarity: "common", type: "joker", effects: { economy: "gold" }, tags: ["economy", "gold"], description: "打出的黄金牌在计分时获得$4", best_with: ["all"], synergies: ["j_midas", "j_bull", "j_bootstraps"], unlock: "打出包含5张黄金牌的一手牌" },
        { id: "j_mr_bones", image: "https://patchwiki.biligame.com/images/balatro/9/91/0mcxv3tmuec5u177lfd7awozjxu5ozt.png", name: "骷髅先生", rarity: "rare", type: "joker", effects: { special: "survive" }, tags: ["special", "survive"], description: "如果最终得到的分数至少是所需分数的25%，则不会死亡，随后自毁", best_with: ["all"], synergies: [], unlock: "输掉5局游戏" },
        { id: "j_acrobat", image: "https://patchwiki.biligame.com/images/balatro/3/35/b2m363vpkvsiyi6t067koete7i3no7m.png", name: "杂技演员", rarity: "rare", type: "joker", effects: { xmult: 3, position: "last" }, tags: ["xmult", "position"], description: "每回合的最后1次出牌，给予×3倍率", best_with: ["all"], synergies: ["j_dusk"], unlock: "打出200手牌" },
        { id: "j_swashbuckler", image: "https://patchwiki.biligame.com/images/balatro/2/2e/pq3ixa0eabrbzgvqy54xzj7870y6taw.png", name: "侠盗", rarity: "common", type: "joker", effects: { mult: "sell_value" }, tags: ["mult", "sell"], description: "将当前拥有的其他小丑的总售价增加至这个小丑的倍率", best_with: ["all"], synergies: ["j_campfire", "j_gift_card", "j_egg", "j_ceremonial"], synergy_note: "礼品卡每回合给所有小丑售价+$1，侠盗直接将总售价转化为倍率 | 鸡蛋每回合售价+$3，单卡即可为侠盗持续涨倍率 | 仪式匕首摧毁高售价小丑后售价重置，侠盗与匕首的倍率来源互补 | 篝火出售+×0.25配合出售体系", unlock: "出售20张小丑牌" },
        { id: "j_troubadour", image: "https://patchwiki.biligame.com/images/balatro/e/ef/jw8tim438bd086s8t5b3apijamdl339.png", name: "游吟诗人", rarity: "rare", type: "joker", effects: { hand_size: 2, hand_size_neg: 1 }, tags: ["hand_size"], description: "+2手牌上限，-1出牌次数", best_with: ["all"], synergies: ["j_juggler", "j_turtle_bean"], unlock: "连续5个回合每回合只出1手牌（可弃牌）" },
        { id: "j_certificate", image: "https://patchwiki.biligame.com/images/balatro/b/b1/frhkys40shtjxvvf9niot44u0yodml3.png", name: "证书", rarity: "rare", type: "joker", effects: { special: "seal" }, tags: ["special", "seal"], description: "选择盲注时，增加1张带有随机蜡封的游戏牌到手牌中，并将其加入完整牌堆中", best_with: ["all"], synergies: ["j_hologram", "j_steel"], synergy_note: "全息影像每加牌+×0.25倍率 | 证书加牌后用战车变钢铁牌，钢铁小丑每张钢铁牌+×0.2倍率", unlock: "拥有1张带金封印的黄金牌" },
        { id: "j_smeared", image: "https://patchwiki.biligame.com/images/balatro/e/e0/g31kfrkay37zlrscabfaste16mb066q.png", name: "模糊小丑", rarity: "rare", type: "joker", effects: { special: "suit_combine" }, tags: ["special", "suit"], description: "和视为同一花色，和视为同一花色", best_with: ["all"], synergies: ["j_greedy", "j_lusty", "j_wrathful", "j_gluttonous", "j_blackboard", "j_flower_pot", "j_ancient", "j_bloodstone", "j_arrowhead", "j_onyx", "j_rough_gem", "j_seeing_double"], synergy_note: "模糊小丑让红桃=方块、黑桃=梅花，所有指定花色的小丑触发范围翻倍", unlock: "牌组中拥有3张或以上万能牌" },
        { id: "j_throwback", image: "https://patchwiki.biligame.com/images/balatro/4/4e/1r4xoa54zwfs2ejf2nlyz61qst8xsvk.png", name: "回溯", rarity: "rare", type: "joker", effects: { xmult: "skip", value: 0.25 }, tags: ["xmult", "skip"], description: "本赛局每跳过1次盲注，这个小丑获得×0.25倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_red"], unlock: "从主菜单继续一局游戏" },
        { id: "j_hanging_chad", image: "https://patchwiki.biligame.com/images/balatro/0/0a/1nzxbc0wdk5alfmu9toekp1ecuyj2ve.png", name: "未断选票", rarity: "common", type: "joker", effects: { special: "first_card" }, tags: ["special", "scoring", "rescore"], description: "打出的第1张计分的牌额外触发2次", best_with: ["all"], synergies: ["t_justice", "j_dusk", "j_wee", "j_cavendish", "j_gros_michel", "j_fibonacci", "j_even_steven", "j_odd_todd", "j_scholar", "j_walkie", "j_hack", "j_scary_face", "j_smiley", "j_photograph", "j_greedy", "j_lusty", "j_wrathful", "j_gluttonous", "j_hiker", "j_bloodstone", "j_arrowhead", "j_onyx", "j_triboulet", "j_sock", "j_dna"], synergy_note: "核心能力：让第1张计分牌触发3次。正义创造玻璃牌(×2)，第1张玻璃牌触发3次=×8倍率极其恐怖 | 所有\"打出单牌有额外计分效果\"的卡牌（点数加成、花色加成、人头牌加成等）都是天然搭档，效果翻3倍 | DNA出单牌时第1张计分牌额外触发2次" },
        { id: "j_glass", image: "https://patchwiki.biligame.com/images/balatro/3/3b/rfytilg6srxq9z4yq6al7ute9ui58op.png", name: "玻璃小丑", rarity: "rare", type: "joker", effects: { xmult: "glass", value: 0.75 }, tags: ["xmult", "glass", "destroy"], description: "每摧毁1张玻璃牌，这个小丑获得×0.75倍率（起始×1倍率）", best_with: ["all"], synergies: ["t_justice", "t_fool"], synergy_note: "正义创造玻璃牌，愚者复制正义，持续供应玻璃牌被摧毁来叠加倍率" },
        { id: "j_showman", image: "https://patchwiki.biligame.com/images/balatro/9/9b/mh0ujc03do7tbef4l8ckwr2l4w5ruth.png", name: "马戏团长", rarity: "rare", type: "joker", effects: { special: "duplicates" }, tags: ["special"], description: "小丑牌、塔罗牌、星球牌、幻灵牌可以同时出现复数张", best_with: ["all"], synergies: ["j_blueprint", "j_brainstorm"] },
        { id: "j_wee", image: "https://patchwiki.biligame.com/images/balatro/6/62/ckzkxdjcrb2bzd4qt6g5xxadca57lvm.png", name: "小小丑", rarity: "legendary", type: "joker", effects: { chips: 8, rank: [2] }, tags: ["chips", "rank", "rescore"], description: "打出的2在计分时使这个小丑获得+8筹码（起始+0筹码）", best_with: ["all"], synergies: ["j_hanging_chad", "j_fibonacci", "j_even_steven", "j_hack", "j_ride_bus"], synergy_note: "未断选票重复触发；斐波那契2+8倍率叠加；偶数史蒂文2+4倍率叠加；烂脱口秀演员重置2反复计分 | 搭乘巴士鼓励只打数字牌，2是最小的数字牌" },
        { id: "j_oops_6", image: "https://patchwiki.biligame.com/images/balatro/f/f5/cxelu1uofv9vozxjcpxnqo6lie7h244.png", name: "六六大顺", rarity: "rare", type: "joker", effects: { special: "double_chance" }, tags: ["special", "chance"], description: "将所有以数字列出的概率翻倍", best_with: ["all"], synergies: ["j_bloodstone", "j_space", "j_lucky_cat", "j_gros_michel", "j_8ball", "j_business_card"], synergy_note: "概率翻倍：血石1/2→1/1必触发X1.5、太空1/4→1/2升级牌型、招财猫翻倍触发、大麦克1/6→1/3自毁风险加大、8号球1/4→1/2生成塔罗、名片1/2→1/1人头牌必给$2" },
        { id: "j_idol", image: "https://patchwiki.biligame.com/images/balatro/9/94/34ugrmo8yflm04qhztxe80p4mo7euqf.png", name: "偶像", rarity: "rare", type: "joker", effects: { xmult: 2, rank: "changing", suit: "changing" }, tags: ["xmult", "changing"], description: "每张打出的（对应花色）（对应点数）在计分时给予×2倍率，每个回合结束时花色和点数都会改变", best_with: ["all"], synergies: [] },
        { id: "j_seeing_double", image: "https://patchwiki.biligame.com/images/balatro/3/36/sthpwsj0nzi52zerh5n4zihctue8s3b.png", name: "重影", rarity: "rare", type: "joker", effects: { xmult: 2, hand: "suit_mix" }, tags: ["xmult", "suit"], description: "如果打出的牌中包含1张计分的花色牌和1张计分的其他花色牌，则给予×2倍率", best_with: ["all"], synergies: ["j_gluttonous", "j_smeared"], unlock: "打出包含四张梅花7的一手牌" },
        { id: "j_matador", image: "https://patchwiki.biligame.com/images/balatro/d/d9/f39fqr9bz8vyx4vhq8dw8l4yon7yjvq.png", name: "斗牛士", rarity: "rare", type: "joker", effects: { economy: "boss_trigger", value: 8 }, tags: ["economy", "boss"], description: "如果打出的牌有削弱的牌或触发了boss盲注的限制条件，获得$8", best_with: ["all"], synergies: ["j_luchador", "j_chicot", "j_bull", "j_bootstraps"] },
        { id: "j_stuntman", image: "https://patchwiki.biligame.com/images/balatro/9/97/sacgmbf2gs5lmnopa0kn0vv5fg6rzuj.png", name: "特技演员", rarity: "legendary", type: "joker", effects: { chips: 250, hand_size: -2 }, tags: ["chips", "hand_size"], description: "+250筹码，-2手牌上限", best_with: ["all"], synergies: ["j_juggler", "j_turtle_bean", "j_half"], synergy_note: "手牌-2更容易达到半张小丑3张或更少的条件；杂耍师/龟豆可补回手牌数" },
        { id: "j_invisible", image: "https://patchwiki.biligame.com/images/balatro/2/26/pee9m8nbc9r9ely9iej8fw5h5gijkof.png", name: "隐形小丑", rarity: "legendary", type: "joker", effects: { special: "delayed_copy" }, tags: ["special", "copy"], description: "经过2个回合后，售出这张小丑牌会随机复制1张拥有的小丑牌（移除复制获得的小丑的负片版本）", best_with: ["all"], synergies: ["j_blueprint"], unlock: "赢得1局游戏，且从未超过4张小丑" },
        { id: "j_satellite", image: "https://patchwiki.biligame.com/images/balatro/0/02/s0nxq1tk8sprjexsr15y8gi4q8ksgzm.png", name: "卫星", rarity: "rare", type: "joker", effects: { economy: "unique_planet" }, tags: ["economy", "planet"], description: "本赛局每使用过1种星球牌，回合结束时就获得$1（起始$0）", best_with: ["all"], synergies: ["j_astronomer", "j_constellation", "j_bull", "j_bootstraps"], synergy_note: "天文学家让行星牌免费，卫星每种独特行星+$1，免费拿行星快速叠收入 | 星座每用行星+×0.1倍率 | 斗牛/提靴带把卫星赚的钱转筹码/倍率" },
        { id: "j_driver_license", image: "https://patchwiki.biligame.com/images/balatro/e/e4/t1vvh5m7j62wx1ho8nqkjj5s115yctm.png", name: "驾驶执照", rarity: "legendary", type: "joker", effects: { xmult: 3, augment_count: 16 }, tags: ["xmult", "augment"], description: "如果你的完整牌组中有16张以上的增强卡牌，则给予×3倍率", best_with: ["all"], synergies: ["t_empress", "t_emperor"], synergy_note: "皇后/皇帝持续创造增强牌帮助达到16张门槛", unlock: "牌组中强化16张牌" },
        { id: "j_astronomer", image: "https://patchwiki.biligame.com/images/balatro/6/68/cytjlep1tyb007tdx7opxxooy9uc2rb.png", name: "天文学家", rarity: "rare", type: "joker", effects: { special: "free_planet" }, tags: ["special", "planet", "shop"], description: "商店中的所有星球牌和天体补充包免费", best_with: ["all"], synergies: ["j_constellation", "j_satellite"], synergy_note: "星座每用行星+×0.1倍率，天文学家免费拿行星无限叠 | 卫星每种独特行星+$1，天文学家免费获取加速卫星收入" },
        { id: "j_burnt", image: "https://patchwiki.biligame.com/images/balatro/f/f0/lijn2uaiykusk533zmiqv5sns5roukf.png", name: "烧焦小丑", rarity: "legendary", type: "joker", effects: { special: "upgrade_discard" }, tags: ["special", "upgrade", "discard"], description: "每个回合升级你第一次弃牌弃掉的牌型", best_with: ["all"], synergies: ["j_drunkard", "j_merry_andy"] },
        { id: "j_bootstraps", image: "https://patchwiki.biligame.com/images/balatro/d/da/i0vqh5izpx0xuwefhjeonj60onczpjy.png", name: "提靴带", rarity: "rare", type: "joker", effects: { mult: "money", value: 2, interval: 5 }, tags: ["mult", "economy"], description: "每持有$5这个小丑就获得+2倍率", best_with: ["all"], synergies: ["j_golden", "j_to_moon", "j_bull", "j_rocket", "j_delayed", "j_business_card", "j_egg", "j_faceless", "j_todo", "j_cloud9", "j_gift_card", "j_reserved", "j_mail_in", "j_trading", "j_golden_ticket", "j_matador", "j_satellite", "j_rough_gem"] },
        { id: "j_yorick", image: "https://patchwiki.biligame.com/images/balatro/f/f8/5p1lnj732ybix5gxetvztxjkmgexbpb.png", name: "约里克", rarity: "legendary", type: "joker", effects: { xmult: "discard_count", value: 1, count: 23 }, tags: ["xmult", "discard"], description: "每弃掉23张牌后，这个小丑获得×1倍率（起始×1倍率）", best_with: ["all"], synergies: ["j_burnt", "j_drunkard", "j_merry_andy"], synergy_note: "醉汉/快乐安迪增加弃牌次数，帮助快速达到23张弃牌；烧焦小丑同为弃牌流双核", unlock: "通过灵魂牌发现" },
        { id: "j_chicot", image: "https://patchwiki.biligame.com/images/balatro/1/1e/2oe6j7jntm3f18x8btzoknp8z9qa8de.png", name: "希科", rarity: "legendary", type: "joker", effects: { special: "disable_boss_all" }, tags: ["special", "boss"], description: "所有boss盲注效果消失", best_with: ["all"], synergies: ["j_luchador"], unlock: "通过灵魂牌发现" },
        { id: "j_perkeo", image: "https://patchwiki.biligame.com/images/balatro/4/48/qpmq0yj1ud1l9te7p2zoep3addx02dj.png", name: "帕奇欧", rarity: "legendary", type: "joker", effects: { special: "negative_copy" }, tags: ["special", "copy", "consumable"], description: "离开商店时，随机复制1张拥有的消耗牌，并给予其负片效果", best_with: ["all"], synergies: ["j_fortune_teller"], unlock: "通过灵魂牌发现" }
    ],

    // ============ TAROT 塔罗牌 ============
    tarots: [
        { id: "t_fool", image: "https://static.wikia.nocookie.net/balatrogame/images/6/61/Tarot_The_Fool.png", name: "愚者", effects: { special: "copy_last" }, tags: ["copy", "tarot"], description: "复制上一张使用的牌", synergies: [] },
        { id: "t_magician", image: "https://static.wikia.nocookie.net/balatrogame/images/7/78/Tarot_The_Magician.png", name: "魔术师", effects: { augment: "lucky" }, tags: ["augment", "lucky"], description: "1张牌强化为幸运牌", synergies: ["j_lucky_cat"] },
        { id: "t_priestess", image: "https://static.wikia.nocookie.net/balatrogame/images/c/cc/Tarot_The_High_Priestess.png", name: "女教皇", effects: { create: "planet", count: 2 }, tags: ["create", "planet"], description: "生成2张随机行星牌", synergies: ["j_constellation", "j_satellite"] },
        { id: "t_empress", image: "https://static.wikia.nocookie.net/balatrogame/images/8/8b/Tarot_The_Empress.png", name: "皇后", effects: { augment: "mult", count: 2 }, tags: ["augment", "mult"], description: "2张牌强化为倍率牌", synergies: ["j_vampire", "j_driver_license"] },
        { id: "t_emperor", image: "https://static.wikia.nocookie.net/balatrogame/images/1/11/Tarot_The_Emperor.png", name: "皇帝", effects: { augment: "bonus", count: 2 }, tags: ["augment", "bonus"], description: "2张牌强化为奖励牌", synergies: ["j_vampire", "j_driver_license"] },
        { id: "t_lovers", image: "https://static.wikia.nocookie.net/balatrogame/images/4/4c/Tarot_The_Lovers.png", name: "恋人", effects: { augment: "wild" }, tags: ["augment", "wild"], description: "1张牌强化为万能牌", synergies: ["j_flower_pot", "j_blackboard"] },
        { id: "t_chariot", image: "https://static.wikia.nocookie.net/balatrogame/images/f/f8/Tarot_The_Chariot.png", name: "战车", effects: { augment: "steel" }, tags: ["augment", "steel"], description: "1张牌强化为钢铁牌", synergies: ["j_steel", "j_mime"], synergy_note: "钢铁小丑每张钢牌+0.2X倍率 | 哑剧演员让手牌中钢铁牌的×1.5额外触发1次" },
        { id: "t_justice", image: "https://static.wikia.nocookie.net/balatrogame/images/4/45/Tarot_Justice.png", name: "正义", effects: { augment: "glass" }, tags: ["augment", "glass"], description: "1张牌强化为玻璃牌", synergies: ["j_glass"], synergy_note: "创造玻璃牌供玻璃小丑摧毁叠加倍率" },
        { id: "t_hermit", image: "https://static.wikia.nocookie.net/balatrogame/images/1/19/Tarot_The_Hermit.png", name: "隐士", effects: { economy: "double", max: 20 }, tags: ["economy"], description: "金钱翻倍(上限$20)", synergies: [] },
        { id: "t_wheel", image: "https://static.wikia.nocookie.net/balatrogame/images/5/57/Tarot_The_Wheel_of_Fortune.png", name: "命运之轮", effects: { special: "joker_foil", chance: 0.25 }, tags: ["special", "joker", "foil"], description: "1/4几率Joker闪箔/全息/多彩", synergies: [] },
        { id: "t_strength", image: "https://static.wikia.nocookie.net/balatrogame/images/7/7d/Tarot_Strength.png", name: "力量", effects: { rank_up: 1, count: 2 }, tags: ["rank", "upgrade"], description: "最多2张牌点数+1", synergies: [] },
        { id: "t_hanged", image: "https://static.wikia.nocookie.net/balatrogame/images/d/d6/Tarot_The_Hanged_Man.png", name: "倒吊人", effects: { destroy: "hand", count: 2 }, tags: ["destroy", "hand"], description: "永久移除最多2张牌", synergies: ["j_erosion"] },
        { id: "t_death", image: "https://static.wikia.nocookie.net/balatrogame/images/4/4d/Tarot_Death.png", name: "死神", effects: { transform: "right_to_left" }, tags: ["transform"], description: "最右牌转换为最左牌", synergies: [] },
        { id: "t_temperance", image: "https://static.wikia.nocookie.net/balatrogame/images/6/67/Tarot_Temperance.png", name: "节制", effects: { economy: "joker_sell" }, tags: ["economy", "sell"], description: "Joker出售值转为金钱", synergies: [] },
        { id: "t_devil", image: "https://static.wikia.nocookie.net/balatrogame/images/7/72/Tarot_The_Devil.png", name: "恶魔", effects: { augment: "gold" }, tags: ["augment", "gold"], description: "1张牌强化为黄金牌", synergies: ["j_midas", "j_golden_ticket"] },
        { id: "t_tower", image: "https://static.wikia.nocookie.net/balatrogame/images/a/af/Tarot_The_Tower.png", name: "塔", effects: { augment: "stone" }, tags: ["augment", "stone"], description: "1张牌强化为石头牌", synergies: ["j_stone", "j_marble"] },
        { id: "t_star", image: "https://static.wikia.nocookie.net/balatrogame/images/e/e1/Tarot_The_Star.png", name: "星星", effects: { suit: "diamonds", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为方块", synergies: ["j_greedy"] },
        { id: "t_moon", image: "https://static.wikia.nocookie.net/balatrogame/images/2/29/Tarot_The_Moon.png", name: "月亮", effects: { suit: "clubs", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为梅花", synergies: ["j_gluttonous"] },
        { id: "t_sun", image: "https://static.wikia.nocookie.net/balatrogame/images/2/2e/Tarot_The_Sun.png", name: "太阳", effects: { suit: "hearts", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为红桃", synergies: ["j_lusty"] },
        { id: "t_judgement", image: "https://static.wikia.nocookie.net/balatrogame/images/d/d9/Tarot_Judgement.png", name: "审判", effects: { create: "joker" }, tags: ["create", "joker"], description: "生成一张随机Joker", synergies: [] },
        { id: "t_world", image: "https://static.wikia.nocookie.net/balatrogame/images/4/49/Tarot_The_World.png", name: "世界", effects: { suit: "spades", count: 3 }, tags: ["suit", "transform"], description: "最多3张牌转换为黑桃", synergies: ["j_wrathful"] }
    ],

    // ============ PLANET 行星牌 ============
    planets: [
        { id: "p_pluto", image: "https://static.wikia.nocookie.net/balatrogame/images/9/9c/Planet_Pluto.png", name: "冥王星", hand: "high_card", chips: 10, mult: 1, tags: ["planet", "high_card"], description: "高牌 +10 筹码 +1 倍率", synergies: [] },
        { id: "p_mercury", image: "https://static.wikia.nocookie.net/balatrogame/images/e/e7/Planet_Mercury.png", name: "水星", hand: "pair", chips: 15, mult: 1, tags: ["planet", "pair"], description: "对子 +15 筹码 +1 倍率", synergies: [] },
        { id: "p_uranus", image: "https://static.wikia.nocookie.net/balatrogame/images/5/51/Planet_Uranus.png", name: "天王星", hand: "two_pair", chips: 20, mult: 1, tags: ["planet", "two_pair"], description: "两对 +20 筹码 +1 倍率", synergies: [] },
        { id: "p_venus", image: "https://static.wikia.nocookie.net/balatrogame/images/b/b6/Planet_Venus.png", name: "金星", hand: "three_of_a_kind", chips: 20, mult: 2, tags: ["planet", "three_of_a_kind"], description: "三条 +20 筹码 +2 倍率", synergies: [] },
        { id: "p_mars", image: "https://static.wikia.nocookie.net/balatrogame/images/f/fa/Planet_Mars.png", name: "火星", hand: "four_of_a_kind", chips: 30, mult: 3, tags: ["planet", "four_of_a_kind"], description: "四条 +30 筹码 +3 倍率", synergies: [] },
        { id: "p_jupiter", image: "https://static.wikia.nocookie.net/balatrogame/images/2/29/Planet_Jupiter.png", name: "木星", hand: "flush", chips: 15, mult: 2, tags: ["planet", "flush"], description: "同花 +15 筹码 +2 倍率", synergies: [] },
        { id: "p_earth", image: "https://static.wikia.nocookie.net/balatrogame/images/5/59/Planet_Earth.png", name: "地球", hand: "full_house", chips: 25, mult: 2, tags: ["planet", "full_house"], description: "葫芦 +25 筹码 +2 倍率", synergies: [] },
        { id: "p_saturn", image: "https://static.wikia.nocookie.net/balatrogame/images/8/82/Planet_Saturn.png", name: "土星", hand: "straight", chips: 30, mult: 2, tags: ["planet", "straight"], description: "顺子 +30 筹码 +2 倍率", synergies: [] },
        { id: "p_neptune", image: "https://static.wikia.nocookie.net/balatrogame/images/f/f9/Planet_Neptune.png", name: "海王星", hand: "straight_flush", chips: 40, mult: 3, tags: ["planet", "straight_flush"], description: "同花顺 +40 筹码 +3 倍率", synergies: [] },
        { id: "p_planet_x", image: "https://static.wikia.nocookie.net/balatrogame/images/6/68/Planet_X.png", name: "X行星", hand: "five_of_a_kind", chips: 35, mult: 3, tags: ["planet", "five_of_a_kind", "secret"], description: "五条 +35 筹码 +3 倍率", synergies: [] },
        { id: "p_eris", image: "https://static.wikia.nocookie.net/balatrogame/images/e/eb/Planet_Eris.png", name: "阋神星", hand: "flush_five", chips: 40, mult: 3, tags: ["planet", "flush_five", "secret"], description: "同花五条 +40 筹码 +3 倍率", synergies: [] },
        { id: "p_ceres", image: "https://static.wikia.nocookie.net/balatrogame/images/0/07/Planet_Ceres.png", name: "谷神星", hand: "flush_house", chips: 40, mult: 3, tags: ["planet", "flush_house", "secret"], description: "同花葫芦 +40 筹码 +3 倍率", synergies: [] }
    ],

    // ============ SPECTRAL 灵魂牌 ============
    spectrals: [
        { id: "s_familiar", image: "https://static.wikia.nocookie.net/balatrogame/images/2/2c/Spectral_Familiar.png", name: "使魔", effects: { destroy: 1, create: "face_enhanced", count: 3 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得3张强化人头牌", synergies: ["j_pareidolia", "j_photograph"] },
        { id: "s_grim", image: "https://static.wikia.nocookie.net/balatrogame/images/e/e0/Spectral_Grim.png", name: "严峻", effects: { destroy: 1, create: "ace_enhanced", count: 2 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得2张强化A", synergies: ["j_scholar", "j_fibonacci"] },
        { id: "s_incantation", image: "https://static.wikia.nocookie.net/balatrogame/images/6/65/Spectral_Incantation.png", name: "咒语", effects: { destroy: 1, create: "number_enhanced", count: 4 }, tags: ["spectral", "destroy", "create"], description: "摧毁1张牌，获得4张强化数字牌", synergies: ["j_ride_bus", "j_even_steven", "j_odd_todd", "j_fibonacci"], synergy_note: "摧毁1牌生成4张强化数字牌，增加数字牌比例 | 搭乘巴士更容易连续避开人头牌 | 偶数史蒂文/奇数托德/斐波那契为数字牌提供额外加成" },
        { id: "s_talisman", image: "https://static.wikia.nocookie.net/balatrogame/images/3/34/Spectral_Talisman.png", name: "护身符", effects: { seal: "gold" }, tags: ["spectral", "seal"], description: "1张牌添加金封印", synergies: ["j_midas", "j_golden_ticket"] },
        { id: "s_aura", image: "https://static.wikia.nocookie.net/balatrogame/images/4/47/Spectral_Aura.png", name: "光环", effects: { edition: "random" }, tags: ["spectral", "edition"], description: "1张牌随机添加闪箔/全息/多彩", synergies: [] },
        { id: "s_wraith", image: "https://static.wikia.nocookie.net/balatrogame/images/4/48/Spectral_Wraith.png", name: "幽灵", effects: { create: "joker_rare", cost: 0 }, tags: ["spectral", "create", "joker"], description: "创造1张稀有Joker，金钱归零", synergies: [] },
        { id: "s_sigil", image: "https://static.wikia.nocookie.net/balatrogame/images/5/5d/Spectral_Sigil.png", name: "符印", effects: { suit: "uniform" }, tags: ["spectral", "suit"], description: "所有手牌转为同一花色", synergies: [] },
        { id: "s_ouija", image: "https://static.wikia.nocookie.net/balatrogame/images/f/fc/Spectral_Ouija.png", name: "占卜板", effects: { rank: "uniform", hand_size: -1 }, tags: ["spectral", "rank", "hand_size"], description: "所有手牌转为同一点数，手牌-1", synergies: [] },
        { id: "s_ectoplasm", image: "https://static.wikia.nocookie.net/balatrogame/images/e/e5/Spectral_Ectoplasm.png", name: "灵质", effects: { edition: "polychrome", hand_size: -1 }, tags: ["spectral", "edition", "hand_size"], description: "随机Joker添加负极，手牌-1", synergies: [] },
        { id: "s_immolate", image: "https://static.wikia.nocookie.net/balatrogame/images/d/d8/Spectral_Immolate.png", name: "火祭", effects: { destroy: 5, economy: 20 }, tags: ["spectral", "destroy", "economy"], description: "摧毁5张牌，获得$20", synergies: ["j_erosion"] },
        { id: "s_ankh", image: "https://static.wikia.nocookie.net/balatrogame/images/e/ec/Spectral_Ankh.png", name: "安卡", effects: { duplicate: "joker" }, tags: ["spectral", "duplicate", "joker"], description: "随机复制1个Joker", synergies: [] },
        { id: "s_deja_vu", image: "https://static.wikia.nocookie.net/balatrogame/images/a/a0/Spectral_Deja_Vu.png", name: "既视感", effects: { seal: "red" }, tags: ["spectral", "seal"], description: "1张牌添加红封印", synergies: [] },
        { id: "s_hex", image: "https://static.wikia.nocookie.net/balatrogame/images/f/f4/Spectral_Hex.png", name: "妖法", effects: { edition: "polychrome", destroy: "all_joker" }, tags: ["spectral", "edition", "destroy"], description: "随机Joker添加多彩，摧毁其他", synergies: [] },
        { id: "s_trance", image: "https://static.wikia.nocookie.net/balatrogame/images/7/78/Spectral_Trance.png", name: "入迷", effects: { seal: "blue" }, tags: ["spectral", "seal"], description: "1张牌添加蓝封印", synergies: [] },
        { id: "s_medium", image: "https://static.wikia.nocookie.net/balatrogame/images/e/e1/Spectral_Medium.png", name: "灵媒", effects: { seal: "purple" }, tags: ["spectral", "seal"], description: "1张牌添加紫封印", synergies: [] },
        { id: "s_cryptid", image: "https://static.wikia.nocookie.net/balatrogame/images/5/5d/Spectral_Cryptid.png", name: "神秘生物", effects: { duplicate: "exact", count: 2 }, tags: ["spectral", "duplicate"], description: "选中的牌复制2份", synergies: ["j_ride_bus", "j_hologram"], synergy_note: "复制数字牌增加牌组中数字牌密度，搭乘巴士更容易连续避开人头牌 | 全息影像每复制+×0.25倍率" },
        { id: "s_soul", image: "https://static.wikia.nocookie.net/balatrogame/images/6/6b/Spectral_The_Soul.png", name: "灵魂", effects: { create: "joker_legendary" }, tags: ["spectral", "create", "joker", "legendary"], description: "创造1张传说Joker", rare: "ultra_rare", synergies: [] },
        { id: "s_black_hole", image: "https://static.wikia.nocookie.net/balatrogame/images/0/00/Spectral_Black_Hole.png", name: "黑洞", effects: { upgrade: "all_hand" }, tags: ["spectral", "upgrade"], description: "所有牌型升1级", rare: "ultra_rare", synergies: [] }
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
    // 特里布莱 + 人头牌体系
    triboulet_face: {
        cards: ["j_triboulet", "j_scary_face", "j_photograph", "j_smiley", "j_sock", "j_pareidolia"],
        name: "特里布莱人头牌体系",
        description: "特里布莱K/Q×2叠加所有人头牌加成：恐怖面孔+30筹码、照片第1张人头牌×2、微笑表情+5倍率、喜与悲额外触发、幻视让所有牌变人头牌"
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
        description: "基础经济组合：黄金小丑每回合+$4，冲向月球增加利息收益，火箭额外Boss奖励"
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
    midas_vampire: {
        cards: ["j_midas", "j_vampire"],
        name: "迈达斯吸血鬼",
        description: "迈达斯面具持续将人头牌变为金卡（增强牌），吸血鬼吸收增强牌+X0.1倍率，源源不断地叠加倍率"
    },

    // 弃牌能力协同
    ramen_burglar: {
        cards: ["j_ramen", "j_burglar"],
        name: "拉面窃贼",
        description: "窃贼移除所有弃牌次数，使拉面始终保持X2倍率不被削减"
    },
    burglar_mystic: {
        cards: ["j_burglar", "j_mystic_summit"],
        name: "窃贼神秘之峰",
        description: "窃贼移除所有弃牌，使神秘之峰始终保持0弃牌状态，获得稳定的+15倍率"
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
        name: "约里克醉汉",
        description: "醉汉每回合+1弃牌，帮助约里克快速达到23张弃牌触发+X1"
    },
    yorick_andy: {
        cards: ["j_yorick", "j_merry_andy"],
        name: "约里克快乐安迪",
        description: "快乐安迪+3弃牌，加速约里克弃牌数量累积，快速触发+X1"
    },
    hitroad_drunk: {
        cards: ["j_hit_road", "j_drunkard"],
        name: "上路吧杰克+醉汉",
        description: "醉汉增加弃牌次数，加速上路吧杰克每弃J X0.5倍率累积"
    },
    hitroad_andy: {
        cards: ["j_hit_road", "j_merry_andy"],
        name: "上路吧杰克+快乐安迪",
        description: "快乐安迪+3弃牌，大量增加上路吧杰克的倍率累积效率"
    },

    // 特殊/重置类协同
    mime_seltzer: {
        cards: ["j_mime", "j_seltzer"],
        name: "哑剧苏打水",
        description: "苏打水10手牌重置所有牌，哑剧演员可重置手牌能力"
    },
    mime_dusk: {
        cards: ["j_mime", "j_dusk"],
        name: "哑剧黄昏",
        description: "黄昏重置最后两手牌，哑剧演员可重置手牌能力"
    },
    // 哑剧演员 + 手牌效果协同
    mime_baron: {
        cards: ["j_mime", "j_baron"],
        name: "哑剧男爵",
        description: "哑剧演员让手牌中K的男爵×1.5倍率额外触发1次，每张K变为×2.25倍率"
    },
    mime_shoot_moon: {
        cards: ["j_mime", "j_shoot_moon"],
        name: "哑剧射月",
        description: "哑剧演员让手牌中Q的射月+13倍率额外触发1次，每张Q变为+26倍率"
    },
    mime_steel: {
        cards: ["j_mime", "j_steel"],
        name: "哑剧钢铁",
        description: "哑剧演员让手牌中钢铁牌的×1.5倍率额外触发1次，钢铁小丑的×0.2叠加也翻倍"
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
        description: "通灵同花顺产生灵魂牌，占卜师每张塔罗/灵魂牌+1倍率"
    },
    seance_constellation: {
        cards: ["j_seance", "j_constellation"],
        name: "降灵星座",
        description: "通灵同花顺产生灵魂牌，星座每张行星牌+0.1倍率"
    },
    hallucination_fortune: {
        cards: ["j_hallucination", "j_fortune_teller"],
        name: "幻觉算命",
        description: "幻觉开包1/2几率塔罗牌，占卜师每张塔罗牌+1倍率"
    },
    hallucination_cartomancer: {
        cards: ["j_hallucination", "j_cartomancer"],
        name: "幻觉占卜",
        description: "幻觉和卡牌术士都产生塔罗牌，大量塔罗牌收益"
    },
    vagabond_fortune: {
        cards: ["j_vagabond", "j_fortune_teller"],
        name: "流浪算命",
        description: "流浪者$4或更少产生塔罗牌，占卜师每张塔罗牌+1倍率"
    },
    vagabond_constellation: {
        cards: ["j_vagabond", "j_constellation"],
        name: "流浪星座",
        description: "流浪者产生塔罗牌，星座每张行星牌+0.1倍率"
    },
    vagabond_cartomancer: {
        cards: ["j_vagabond", "j_cartomancer"],
        name: "流浪占卜",
        description: "流浪者和卡牌术士都产生塔罗牌，大量塔罗牌收益"
    },

    // 钢卡类协同
    steel_chariot: {
        cards: ["j_steel", "t_chariot"],
        name: "钢铁战车",
        description: "战车将牌强化为钢铁牌，钢铁小丑每张钢卡+0.2倍率"
    },
    steel_baron: {
        cards: ["j_steel", "j_baron"],
        name: "钢铁男爵",
        description: "手牌中的K既触发钢铁牌×1.5倍率又触发男爵×1.5倍率，双重叠乘"
    },
    steel_shoot_moon: {
        cards: ["j_steel", "j_shoot_moon"],
        name: "钢铁射月",
        description: "手牌中的Q既触发钢铁牌×1.5倍率又提供射月+13倍率，手牌多重收益"
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
    hologram_dna: {
        cards: ["j_hologram", "j_dna"],
        name: "全息DNA",
        description: "DNA复制单牌加入牌组，全息每次复制+×0.25倍率，持续出单牌快速叠加"
    },
    hologram_certificate: {
        cards: ["j_hologram", "j_certificate"],
        name: "全息证书",
        description: "证书每次选盲注加1张蜡封牌到牌组，全息稳定+×0.25倍率"
    },
    hologram_marble: {
        cards: ["j_hologram", "j_marble"],
        name: "全息大理石",
        description: "大理石小丑每次选盲注加1张石头牌到牌组，全息稳定+×0.25倍率"
    },

    // 重复打出类协同
    cardsharp_chad: {
        cards: ["j_card_sharp", "j_hanging_chad"],
        name: "老千未断选票",
        description: "老千本回合重复牌型X3，未断选票重复打出+0.5倍率"
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
        description: "三重奏三条X3，一家人四条X4，配合最大化"
    },

    // 计分类协同
    splash_photo: {
        cards: ["j_splash", "j_photograph"],
        name: "飞溅照片",
        description: "飞溅所有打出的牌都计分，照片第一张人头牌X2，完美配合"
    },
    splash_scary: {
        cards: ["j_splash", "j_scary_face"],
        name: "飞溅恐怖面孔",
        description: "飞溅所有打出的牌都计分，恐怖面孔人头牌+30筹码"
    },

    // 非常用牌型协同
    obelisk_straight: {
        cards: ["j_obelisk", "j_crazy"],
        name: "方尖石塔顺子",
        description: "方尖石塔非常用牌型X0.2，顺子是非常用牌型，配合增加倍率"
    },
    obelisk_flush: {
        cards: ["j_obelisk", "j_droll"],
        name: "方尖石塔同花",
        description: "方尖石塔非常用牌型X0.2，同花是非常用牌型，配合增加倍率"
    },

    // 手牌类协同
    turtle_juggler: {
        cards: ["j_turtle_bean", "j_juggler"],
        name: "黑龟豆杂耍",
        description: "黑龟豆手牌+5，杂耍师手牌+1，大量手牌"
    },
    turtle_square: {
        cards: ["j_turtle_bean", "j_square"],
        name: "黑龟豆方块",
        description: "黑龟豆手牌+5，方形小丑4张手牌+4筹码，手牌越多收益越高"
    },

    // 计时类协同
    loyalty_seltzer: {
        cards: ["j_loyalty", "j_seltzer"],
        name: "积分苏打水",
        description: "积分卡每6手牌X4，苏打水10手牌重置，帮助快速触发"
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
        description: "疯狂小丑+10倍率，聪敏小丑+80筹码，备用裤子+2倍率(永久叠加)，两对核心三件套"
    },
    two_pair_flow: {
        cards: ["j_mad", "j_clever", "j_spare_trousers", "j_jolly", "j_sly"],
        name: "双对流",
        description: "核心：疯狂小丑+10倍率、聪敏小丑+80筹码、备用裤子永久+2倍率。两对包含对子，开心小丑+8倍率和奸诈小丑+50筹码也会触发，五卡齐聚双对伤害爆炸"
    },
    two_pair_obelisk: {
        cards: ["j_mad", "j_clever", "j_spare_trousers", "j_obelisk"],
        name: "双对方尖石塔",
        description: "两对为非常用牌型，方尖石塔叠加X倍率，配合两对三件套伤害倍增"
    },
    straight_full: {
        cards: ["j_crazy", "j_devious", "j_order", "j_runner"],
        name: "顺子全系",
        description: "疯狂+12倍率，阴险+100筹码，秩序X3，跑步选手+15筹码"
    },
    flush_full: {
        cards: ["j_droll", "j_crafty", "j_tribe"],
        name: "同花全系",
        description: "严肃+10倍率，精明+80筹码，同花X2，同花三重加成"
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
    four_fingers_square_trousers: {
        cards: ["j_four_fingers", "j_square", "j_spare_trousers"],
        name: "四张牌体系",
        description: "四指让顺子/同花只需4张牌，方形小丑打出恰好4张时+筹码，备用裤子两对+倍率，完美的4张牌协同"
    },

    // 模板+疯狂协同
    stencil_madness: {
        cards: ["j_stencil", "j_madness"],
        name: "模具疯狂",
        description: "疯狂摧毁Joker腾出空位，模具小丑每空位+1倍率"
    },

    // 经济+筹码/倍率协同
    bull_economy: {
        cards: ["j_bull", "j_golden", "j_to_moon"],
        name: "斗牛经济",
        description: "黄金+冲向月球积累金钱，斗牛每$1+2筹码，钱越多筹码越高"
    },
    bootstraps_economy: {
        cards: ["j_bootstraps", "j_golden", "j_to_moon"],
        name: "靴带经济",
        description: "黄金+冲向月球积累金钱，靴带每$5+2倍率，钱越多倍率越高"
    },
    bull_bootstraps: {
        cards: ["j_bull", "j_bootstraps"],
        name: "斗牛靴带",
        description: "斗牛每$1+2筹码，靴带每$5+2倍率，金钱同时转化为筹码和倍率"
    },

    // 出售类协同
    sell_combo: {
        cards: ["j_campfire", "j_gift_card", "j_diet_cola"],
        name: "出售体系",
        description: "篝火每出售+X0.25，礼品卡增加出售值，零糖可乐出售创造免费双倍"
    },
    sell_gift_swashbuckler: {
        cards: ["j_gift_card", "j_swashbuckler"],
        name: "礼品侠盗",
        description: "礼品卡每回合给所有小丑售价+$1，侠盗将总售价直接转化为倍率"
    },
    sell_gift_ceremonial: {
        cards: ["j_gift_card", "j_ceremonial"],
        name: "礼品匕首",
        description: "礼品卡抬高小丑售价，仪式匕首摧毁时获得售价2倍的永久倍率"
    },
    sell_egg_swashbuckler: {
        cards: ["j_egg", "j_swashbuckler"],
        name: "金蛋侠盗",
        description: "鸡蛋每回合售价+$3，侠盗将所有小丑总售价转化为倍率，鸡蛋单卡即可持续涨倍率"
    },
    sell_egg_ceremonial: {
        cards: ["j_egg", "j_ceremonial"],
        name: "金蛋匕首",
        description: "鸡蛋每回合售价+$3快速膨胀，被仪式匕首摧毁时获得超高售价2倍的永久倍率"
    },
    sell_campfire_riffraff: {
        cards: ["j_campfire", "j_riff_raff"],
        name: "篝火征兵",
        description: "乌合之众每盲注生成2张小丑，出售后篝火获得+×0.5倍率，持续喂火"
    },
    sell_campfire_cartomancer: {
        cards: ["j_campfire", "j_cartomancer"],
        name: "篝火占卜",
        description: "卡牌术士每盲注生成塔罗牌，出售后篝火获得+×0.25倍率"
    },

    // 搭乘巴士数字牌体系
    ride_bus_numbers: {
        cards: ["j_ride_bus", "j_even_steven", "j_odd_todd"],
        name: "巴士数字流",
        description: "搭乘巴士只打数字牌叠倍率，偶数史蒂文+4倍率/奇数托德+31筹码覆盖全部数字牌"
    },
    ride_bus_incantation: {
        cards: ["j_ride_bus", "s_incantation"],
        name: "巴士咒语",
        description: "咒语摧毁1牌生成4张强化数字牌，增加数字牌密度助搭乘巴士叠倍率"
    },
    ride_bus_cryptid: {
        cards: ["j_ride_bus", "s_cryptid"],
        name: "巴士复制",
        description: "神秘生物复制数字牌增加密度，搭乘巴士更容易连续避开人头牌"
    },
    oops_bloodstone: {
        cards: ["j_oops_6", "j_bloodstone"],
        name: "六六大顺血石",
        description: "六六大顺概率翻倍，血石红桃触发几率从1/2提升到1/1"
    },
    oops_space: {
        cards: ["j_oops_6", "j_space"],
        name: "六六大顺太空",
        description: "六六大顺概率翻倍，太空小丑升级牌型几率从1/4提升到1/2"
    },
    oops_lucky: {
        cards: ["j_oops_6", "j_lucky_cat"],
        name: "六六大顺招财猫",
        description: "六六大顺概率翻倍，招财猫触发几率翻倍，快速累积倍率"
    },

    // 跳过盲注协同
    skip_combo: {
        cards: ["j_throwback", "j_red"],
        name: "跳过体系",
        description: "回溯跳过+X0.25倍率，红牌跳过+3倍率，跳过盲注双重收益"
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
        description: "幻视使所有牌变人头牌，名片和私人车位双重经济收益"
    },
    faceless_discard: {
        cards: ["j_faceless", "j_pareidolia", "j_drunkard"],
        name: "无脸弃牌经济",
        description: "幻视使所有牌变人头牌，醉汉增加弃牌，无脸弃3人头+$5"
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
        description: "黑龟豆+5，杂耍+1，游吟诗人+2，大量手牌配合各种组合"
    },

    // 弃牌经济协同
    discard_economy: {
        cards: ["j_trading", "j_mail_in", "j_drunkard"],
        name: "弃牌经济",
        description: "交易卡单张弃牌+$3，邮寄回扣弃特定牌$5，醉汉增加弃牌次数"
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
        description: "第六感首张6创灵魂牌，通灵同花顺产灵魂牌，双灵魂牌来源"
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
        description: "燕子+冲向月球，利息收益最大化"
    },

    // 摧毁类协同 - 核心协同！
    glass_justice: {
        cards: ["j_glass", "t_justice"],
        name: "玻璃正义循环",
        description: "正义创造玻璃牌，玻璃卡计分时1/4概率摧毁，玻璃小丑永久+X0.75"
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
        description: "幻视使所有牌变人头牌，配合卡尼奥摧毁时增加倍率"
    },
    hanged_abstract: {
        cards: ["t_hanged", "j_abstract"],
        name: "倒吊抽象流",
        description: "倒吊人销毁卡牌增加 Joker 数量，抽象小丑获得更多倍率"
    },
    destroy_tarot_combo: {
        cards: ["t_high_priestess", "j_cartomancer", "j_fortune_teller"],
        name: "塔罗销毁流",
        description: "女祭司销毁配合卡牌术士/占卜师增加塔罗牌收益"
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
        description: "卡牌术士创造塔罗牌，占卜师每张塔罗牌+1倍率"
    },
    tarot_abstract: {
        cards: ["j_abstract", "j_cartomancer"],
        name: "抽象塔罗流",
        description: "卡牌术士每盲注创造塔罗牌，抽象小丑获得额外倍率"
    },
    tarot_8ball: {
        cards: ["j_8ball", "j_fortune_teller"],
        name: "8号算命",
        description: "8号球概率获得塔罗牌，占卜师将塔罗牌转化为倍率"
    },
    tarot_superposition: {
        cards: ["j_superposition", "j_fortune_teller"],
        name: "叠加塔罗",
        description: "叠加产生塔罗牌，占卜师增加倍率"
    },
    tarot_vagabond: {
        cards: ["j_vagabond", "j_fortune_teller"],
        name: "流浪塔罗",
        description: "流浪者低价产生塔罗牌，占卜师转化收益"
    },
    tarot_hallucination: {
        cards: ["j_hallucination", "j_cartomancer"],
        name: "幻觉占卜",
        description: "幻觉和卡牌术士都能产生额外塔罗牌"
    },
    tarot_strength: {
        cards: ["t_strength", "j_abstract"],
        name: "力量抽象",
        description: "力量升级卡牌增加 Joker 数量，抽象小丑获得倍率"
    },
    tarot_wheel: {
        cards: ["t_wheel", "j_showman"],
        name: "轮盘马戏团长",
        description: "命运之轮概率强化 Joker，马戏团长使强化效果可重复"
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
    planet_satellite_astronomer: {
        cards: ["j_satellite", "j_astronomer"],
        name: "卫星天文学",
        description: "天文学家让行星牌免费，卫星每种独特行星+$1收入"
    },
    planet_priestess: {
        cards: ["t_priestess", "j_constellation"],
        name: "女祭司星座",
        description: "女教皇生成行星牌，星座获得倍率"
    },
    planet_showman: {
        cards: ["j_showman", "j_constellation"],
        name: "马戏团长行星",
        description: "马戏团长使行星效果可重复，配合星座倍率翻倍"
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
        description: "通灵同花顺产生灵魂牌，占卜师增加倍率"
    },
    spectral_sixth: {
        cards: ["j_sixth_sense", "j_abstract"],
        name: "第六感抽象",
        description: "第六感创造灵魂牌，抽象小丑增加倍率"
    },
    spectral_familiar: {
        cards: ["s_familiar", "j_pareidolia"],
        name: "使魔人头",
        description: "使魔销毁获得人头牌，幻视增强效果"
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
        name: "火祭冲向月球",
        description: "火祭销毁5张牌获$20，冲向月球增加利息收益"
    },
    spectral_hex: {
        cards: ["s_hex", "j_showman"],
        name: "妖法主持",
        description: "妖法随机强化 Joker，马戏团长使效果可重复"
    },

    // ============ 重复打出/重置协同 ============
    chad_dusk: {
        cards: ["j_hanging_chad", "j_dusk"],
        name: "未断选票黄昏",
        description: "未断选票重复计分第一张牌，黄昏重置最后两手牌，最大化重复打出收益"
    },
    chad_wee: {
        cards: ["j_hanging_chad", "j_wee"],
        name: "未断选票小小丑",
        description: "未断选票让2可以重复计分，小小丑获得额外筹码"
    },
    chad_cavendish: {
        cards: ["j_hanging_chad", "j_cavendish"],
        name: "未断选票卡文迪什",
        description: "未断选票让卡文迪什有更多机会触发1/1000的X3倍率"
    },
    chad_gros: {
        cards: ["j_hanging_chad", "j_gros_michel"],
        name: "未断选票大麦克香蕉",
        description: "未断选票让大麦克香蕉有更多机会触发1/6的摧毁效果"
    },
    // 未断选票 + 点数效果卡协同
    chad_fibonacci: {
        cards: ["j_hanging_chad", "j_fibonacci"],
        name: "未断选票斐波那契",
        description: "未断选票让第1张A/2/3/5/8额外触发2次，+8倍率变+24倍率"
    },
    chad_even: {
        cards: ["j_hanging_chad", "j_even_steven"],
        name: "未断选票偶数史蒂文",
        description: "未断选票让第1张偶数牌额外触发2次，+4倍率变+12倍率"
    },
    chad_odd: {
        cards: ["j_hanging_chad", "j_odd_todd"],
        name: "未断选票奇数托德",
        description: "未断选票让第1张奇数牌额外触发2次，+31筹码变+93筹码"
    },
    chad_scholar: {
        cards: ["j_hanging_chad", "j_scholar"],
        name: "未断选票学者",
        description: "未断选票让A额外触发2次，学者+4倍率+20筹码变+12倍率+60筹码"
    },
    chad_walkie: {
        cards: ["j_hanging_chad", "j_walkie"],
        name: "未断选票对讲机",
        description: "未断选票让第1张10或4额外触发2次，+10筹码+4倍率变+30筹码+12倍率"
    },
    chad_hack: {
        cards: ["j_hanging_chad", "j_hack"],
        name: "未断选票烂脱口秀",
        description: "双重重复触发！未断选票+烂脱口秀演员让第1张2/3/4/5计分多达4次"
    },
    // 未断选票 + 花色效果卡协同
    chad_suit: {
        cards: ["j_hanging_chad", "j_greedy", "j_lusty", "j_wrathful", "j_gluttonous"],
        name: "未断选票花色加成",
        description: "未断选票让第1张计分牌的花色加成(+3倍率)触发3次，变为+9倍率"
    },
    chad_arrowhead: {
        cards: ["j_hanging_chad", "j_arrowhead"],
        name: "未断选票箭头",
        description: "未断选票让第1张黑桃牌的箭头+50筹码触发3次，变为+150筹码"
    },
    chad_onyx: {
        cards: ["j_hanging_chad", "j_onyx"],
        name: "未断选票缟玛瑙",
        description: "未断选票让第1张梅花牌的缟玛瑙+7倍率触发3次，变为+21倍率"
    },
    chad_bloodstone: {
        cards: ["j_hanging_chad", "j_bloodstone"],
        name: "未断选票血石",
        description: "未断选票让第1张红桃牌额外触发2次，多2次机会触发X1.5倍率"
    },
    // 未断选票 + 徒步者协同
    chad_hiker: {
        cards: ["j_hanging_chad", "j_hiker"],
        name: "未断选票徒步者",
        description: "未断选票让第1张计分牌的徒步者永久+5筹码触发3次，变为永久+15筹码"
    },
    dusk_abstract: {
        cards: ["j_dusk", "j_abstract"],
        name: "黄昏抽象",
        description: "黄昏重置手牌增加 Joker 计数，抽象小丑获得更多倍率"
    },
    throwback_skip: {
        cards: ["j_throwback", "j_hanging_chad"],
        name: "回溯未断选票",
        description: "跳过盲注时回溯增加倍率，未断选票让跳过更频繁"
    },

    // ============ 几率/风险加倍协同 ============
    risky_cavendish: {
        cards: ["j_cavendish", "j_gros_michel"],
        name: "风险兄弟",
        description: "两个高风险高回报卡牌，大麦克香蕉1/6摧毁，卡文迪什1/1000摧毁"
    },
    risky_bloodstone: {
        cards: ["j_gros_michel", "j_bloodstone"],
        name: "风险血石",
        description: "大麦克香蕉有几率摧毁，血石红桃1/2几率X1.5"
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
    },

    // ============ 新增遗漏协同 ============
    // 烂脱口秀 + 偶数/奇数
    hack_even: {
        cards: ["j_hack", "j_even_steven"],
        name: "烂脱口秀偶数",
        description: "烂脱口秀让2和4额外触发1次，2和4都是偶数，偶数史蒂文+4倍率双重触发"
    },
    hack_odd: {
        cards: ["j_hack", "j_odd_todd"],
        name: "烂脱口秀奇数",
        description: "烂脱口秀让3和5额外触发1次，3和5都是奇数，奇数托德+31筹码双重触发"
    },
    // 喜与悲 + 未断选票
    sock_chad: {
        cards: ["j_sock", "j_hanging_chad"],
        name: "喜与悲未断选票",
        description: "双重额外触发：未断选票让第1张计分牌触发3次，喜与悲让人头牌额外触发1次，第1张人头牌可计分高达4次"
    },
    // 六六大顺 + 8号球/名片
    oops_8ball: {
        cards: ["j_oops_6", "j_8ball"],
        name: "六六大顺8号球",
        description: "六六大顺将8号球的1/4概率翻倍为1/2，打出8更容易生成塔罗牌"
    },
    oops_business: {
        cards: ["j_oops_6", "j_business_card"],
        name: "六六大顺名片",
        description: "六六大顺将名片1/2概率翻倍为1/1，打出人头牌必定获得$2"
    },
    // 侵蚀 + 销毁
    erosion_hanged: {
        cards: ["j_erosion", "t_hanged"],
        name: "侵蚀倒吊人",
        description: "倒吊人永久移除2张牌，侵蚀每少1张牌+4倍率，移除2张=+8倍率"
    },
    erosion_immolate: {
        cards: ["j_erosion", "s_immolate"],
        name: "侵蚀火祭",
        description: "火祭摧毁5张牌获$20，侵蚀每少1张+4倍率，一次火祭=+20倍率"
    },
    erosion_sixth_sense: {
        cards: ["j_erosion", "j_sixth_sense"],
        name: "侵蚀第六感",
        description: "第六感摧毁6减少牌组张数，侵蚀+4倍率，同时获得幻灵牌双重收益"
    },
    erosion_canio: {
        cards: ["j_erosion", "j_canio"],
        name: "侵蚀卡尼奥",
        description: "摧毁人头牌时卡尼奥叠×倍率，同时牌组减少触发侵蚀+4倍率，双重倍率收益"
    },
    // 飞溅扩展协同
    splash_triboulet: {
        cards: ["j_splash", "j_triboulet"],
        name: "飞溅特里布莱",
        description: "飞溅让所有打出的牌计分，特里布莱K/Q×2对非计分位的K/Q也能触发"
    },
    splash_sock: {
        cards: ["j_splash", "j_sock"],
        name: "飞溅喜与悲",
        description: "飞溅让所有打出的牌计分，喜与悲人头牌额外触发1次，非计分位的人头牌也受益"
    },
    // 幻视扩展协同
    pareidolia_midas: {
        cards: ["j_pareidolia", "j_midas"],
        name: "幻视迈达斯",
        description: "幻视让所有牌变人头牌，迈达斯面具将所有打出的牌变为金卡，全牌镀金"
    },
    pareidolia_business: {
        cards: ["j_pareidolia", "j_business_card"],
        name: "幻视名片",
        description: "幻视让所有牌变人头牌，名片每张人头牌1/2概率+$2，全牌触发经济翻倍"
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CARD_DATA, TAGS, SYNERGY_RULES };
}
