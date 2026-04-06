// -*- coding: utf-8 -*-
/**
 * Balatro Guide - 中文语言包 (zh-CN)
 */

i18n.register('zh-CN', {
    // ============ 页面元信息 ============
    meta: {
        title: 'Balatro 新手助手 - 卡牌图鉴、构筑推荐与种子分享 | Balatro Guide',
        description: 'Balatro 新手助手：最全的 Balatro 卡牌图鉴（150+张 Joker、塔罗牌、行星牌、灵魂牌），智能牌组匹配与构筑推荐，21种流派攻略指南，以及玩家种子分享社区。',
        ogTitle: 'Balatro 新手助手 - 卡牌图鉴、构筑推荐与种子分享',
        ogDescription: '最全的 Balatro 卡牌图鉴（150+张），智能牌组匹配与构筑推荐，21种流派攻略指南，以及玩家种子分享社区。',
        siteName: 'Balatro 新手助手',
    },

    // ============ 通用 UI ============
    ui: {
        // Header
        logo: '🃏 Balatro 新手助手',
        subtitle: '卡牌图鉴 · 牌组匹配 · 构筑推荐',
        
        // Tab 导航
        tabs: {
            gallery: '卡牌图鉴',
            matcher: '牌组匹配',
            guide: '攻略指南',
            seeds: '🌱 种子分享',
        },
        
        // Footer
        footer: 'Balatro 新手助手 - 帮助你更好地理解游戏',
        dataSource: '卡牌数据基于游戏版本整理',
        siteStats: '🎴 本站总访问量 {{pv}} 次 · 访客数 {{uv}} 人',
        
        // 通用
        search: '搜索',
        loading: '加载中...',
        noResults: '没有找到匹配的卡牌',
    },

    // ============ 卡牌图鉴页面 ============
    gallery: {
        filterToggle: '🔽 筛选条件',
        
        // 筛选分类标题
        filterType: '卡牌类型',
        filterRarity: '稀有度',
        filterEffect: '效果类型',
        filterHand: '适合牌型',
        
        // 卡牌类型
        types: {
            joker: 'Joker',
            tarot: '塔罗牌',
            planet: '行星牌',
            spectral: '灵魂牌',
        },
        // 简称（用于卡牌标签）
        typeShort: {
            joker: 'Joker',
            tarot: '塔罗',
            planet: '行星',
            spectral: '灵魂',
        },
        
        // 稀有度
        rarity: {
            common: '普通',
            uncommon: '罕见',
            rare: '稀有',
            legendary: '传奇',
        },
        
        // 效果类型
        effects: {
            mult: '倍数',
            xmult: '倍率',
            chips: '筹码',
            draw: '抽牌',
            discard: '弃牌',
            economy: '经济',
            hand_size: '手牌',
            suit: '花色',
        },
        
        // 牌型
        hands: {
            high_card: '高牌',
            one_pair: '对子',
            two_pair: '两对',
            three_of_a_kind: '三条',
            straight: '顺子',
            flush: '同花',
            full_house: '葫芦',
            four_of_a_kind: '四条',
            straight_flush: '同花顺',
        },
        
        clearFilter: '清除筛选',
        filterUnlock: '解锁条件',
        unlockOnly: '仅显示需解锁',
        resultCount: '找到 {{count}} 张卡牌',
        searchPlaceholder: '搜索卡牌名称、效果...',
    },
    
    // ============ 牌组匹配页面 ============
    matcher: {
        title: '🎯 牌组匹配',
        description: '选择你已有的卡牌，获取推荐搭配',
        myDeck: '我的卡组 (已选 {{count}} 张)',
        clearDeck: '清空卡组',
        addCard: '➕ 选择要添加的卡牌',
        searchCard: '搜索卡牌...',
        emptyDeck: '点击卡牌添加到你的卡组',
        
        // 推荐
        recTitle: '✨ 推荐搭配',
        preferChips: '偏好筹码加成',
        preferMult: '偏好倍数加成',
        emptyRec: '选择卡牌后，系统将为你推荐最佳搭配',
        noRec: '没有找到推荐卡牌，试试添加更多卡牌',
        
        // 匹配结果
        matchedBuilds: '🧭 匹配到的构筑方向',
        missingCards: '还缺: {{cards}}',
        coreComplete: '✅ 核心已齐全！',
        compatBrief: '🔗 可兼容: {{names}}',
        matchRate: '{{rate}}% 匹配',
        score: '{{score}}分',
        
        // 推荐分类
        recJoker: '🎯 推荐 Joker',
        recTarot: '🔮 推荐塔罗牌',
        recPlanet: '🪐 推荐行星牌',
        recSpectral: '🌟 推荐灵魂牌',
    },
    
    // ============ 攻略指南页面 ============
    guide: {
        title: '📖 新手攻略',
        basicConcepts: '🎯 基础概念',
        
        // 得分公式卡
        scoringTitle: '筹码 × 倍数 = 得分',
        scoringIntro: 'Balatro 的核心公式：<strong>Chips × Mult = Score</strong>',
        scoringChips: '<strong>筹码(Chips)</strong>: 分数的基础值，由牌型基础筹码 + 打出牌的点数 + 各种 +Chips 效果累加',
        scoringMult: '<strong>倍数(Mult)</strong>: 加法型乘数，由牌型基础倍数 + 各种 <span style="color:#e74c3c">+Mult</span> 效果累加（如 +4、+8）',
        scoringXmult: '<strong>倍率(XMult)</strong>: 乘法型乘数，在倍数累加完成后，依次 <span style="color:#f39c12">×XMult</span> 相乘（如 X2、X3）',
        scoringExample: '📐 计算顺序示例：',
        scoringStep1: '① 筹码 = 牌型基础 + 打出牌点数 + 各种 +Chips → 得到总筹码',
        scoringStep2: '② 倍数 = 牌型基础 + 各种 <span style="color:#e74c3c">+Mult</span> → 得到基础倍数',
        scoringStep3: '③ 倍率加成 = 基础倍数 <span style="color:#f39c12">× X2 × X3 ...</span> → 得到最终倍数',
        scoringStep4: '④ <strong>最终得分 = 总筹码 × 最终倍数</strong>',
        scoringNote: '⚠️ 注意：倍数(+Mult)是加法叠加，倍率(XMult)是乘法叠加。1个 X2 倍率 ≈ 把你的倍数翻一倍，远比 +2 倍数强！',
        
        // 卡牌顺序卡
        orderTitle: '🔀 卡牌顺序很重要！',
        orderIntro: 'Balatro 中<strong>小丑卡牌</strong>和<strong>手中的扑克牌</strong>都可以手动拖拽调整顺序，这会直接影响计分结果。',
        orderJoker: '<strong>小丑(Joker)顺序</strong>：Joker 的效果按<span style="color:#ffd700">从左到右</span>的顺序依次触发。拖拽 Joker 可以改变触发顺序',
        orderPoker: '<strong>扑克牌顺序</strong>：手牌中的扑克牌也可以拖拽排列，打出的牌按<span style="color:#ffd700">从左到右</span>依次计分',
        orderExampleTitle: '🎯 顺序影响举例：',
        orderExample1: '• <strong>蓝图</strong>复制<span style="color:#3498db">右侧</span>的 Joker → 把最强 Joker 放在蓝图右边',
        orderExample2: '• <strong>头脑风暴</strong>复制<span style="color:#3498db">最左侧</span>的 Joker → 把最强 Joker 放在最左边',
        orderExample3: '• <strong>照片</strong>对打出的<span style="color:#3498db">第一张</span>人头牌 X2 → 人头牌尽量放最左边先打出',
        orderExample4: '• <strong>+Mult</strong> 的 Joker 应放在 <strong>XMult</strong> 的 Joker <span style="color:#f39c12">左边</span> → 先加后乘，收益最大化',
        orderTip: '💡 小技巧：长按/拖拽即可调整顺序。养成随时调整 Joker 排列的习惯，尤其是获得蓝图、头脑风暴等位置敏感的卡牌时！',
        
        // 构筑思路
        buildTitle: '💡 构筑思路',
        coreCards: '核心卡牌：',
        compatLabel: '🔗 可兼容流派：',
        tryBuild: '试试这个构筑 →',
        
        // 推荐卡牌
        recTitle: '⭐ 推荐卡牌',
        recSubtitle: '按构筑流派分类，点击卡牌可添加到牌组匹配',
        
        // 推荐分类名
        recCategories: {
            all_star: '🌟 全明星',
            early_game: '🌱 前期好用',
            scaling: '📈 成长型',
            xmult: '🔥 倍率炸弹',
            economy_picks: '💰 经济好牌',
            utility: '🔧 万能辅助',
        },
    },
    
    // ============ 种子分享页面 ============
    seeds: {
        title: '🌱 种子分享',
        description: '分享你发现的好种子，帮助其他玩家获得精彩开局！',
        
        // 投稿表单
        submitTitle: '📝 投稿种子',
        seedCode: '种子代码',
        seedCodePlaceholder: '如：ABCD1234',
        nickname: '你的昵称',
        nicknamePlaceholder: '匿名玩家',
        seedTitle: '标题/亮点',
        seedTitlePlaceholder: '如：第一关直接给传说Joker',
        buildLabel: '推荐流派',
        buildNone: '不限',
        difficultyLabel: '难度评价',
        difficultyEasy: '⭐ 简单',
        difficultyMedium: '⭐⭐ 中等',
        difficultyHard: '⭐⭐⭐ 困难',
        detailLabel: '详细说明',
        detailPlaceholder: '描述这个种子的特色、关键Joker、推荐打法等...',
        submitBtn: '🚀 提交种子',
        submitHint: '投稿需审核通过后才会展示',
        
        // 提交状态
        submitting: '⏳ 提交中...',
        submitSuccess: '✅ 投稿成功！审核通过后将展示在列表中',
        submitError: '❌ 投稿失败，请稍后重试',
        validateError: '请填写种子代码和标题',
        
        // 列表
        searchPlaceholder: '搜索种子代码或描述...',
        sortHot: '🔥 最热',
        sortNew: '🕐 最新',
        loadingSeeds: '🎴 加载中...',
        loadError: '😵 加载失败，请稍后重试',
        noMatch: '没有找到匹配的种子',
        beFirst: '还没有种子分享，成为第一个投稿的人吧！',
        anonymous: '匿名玩家',
        liked: '已点赞',
        like: '点赞',
        
        // 时间
        justNow: '刚刚',
        minutesAgo: '{{n}} 分钟前',
        hoursAgo: '{{n}} 小时前',
        daysAgo: '{{n}} 天前',
        
        // 难度映射
        difficulty: {
            '简单': '⭐',
            '中等': '⭐⭐',
            '困难': '⭐⭐⭐',
        },
    },
    
    // ============ 流派名称（种子表单下拉选项等）============
    buildNames: {
        pair_build: '🃏 对子流',
        double_pair_build: '👯 双对流',
        straight_build: '📏 顺子流',
        flush_build: '🎨 同花流',
        face_build: '👑 人头牌流',
        kq_build: '♔ K/Q皇室流',
        fibonacci_build: '🐚 斐波那契流',
        economy_build: '💰 经济流',
        discard_build: '🗑️ 弃牌流',
        burglar_build: '🦝 侠盗流',
        tarot_build: '🔮 塔罗流',
        planet_build: '🪐 行星流',
        destroy_build: '💥 摧毁流',
        copy_build: '📋 复制流',
        sell_build: '🔥 出售流',
        chance_build: '🎲 概率流',
        augment_build: '🧛 增强吸收流',
        skip_build: '⏭️ 跳过流',
        steel_build: '🛡️ 钢铁牌流',
        add_card_build: '➕ 加牌流',
        remove_card_build: '➖ 减牌流',
    },
    
    // ============ 匹配算法中的连招名 ============
    comboNames: {
        face_destroy: '人头牌销毁流',
        hanged_abstract: '倒吊抽象流',
        madness_abstract: '疯狂销毁流',
        abstract_tarot: '抽象塔罗流',
    },

    // ============ 策略翻译 ============
    // 策略的 name/difficulty/desc/detail/tips/compatibleWith[].note
    // 直接从 getBuildStrategies() 的中文内容提取
    strategies: {
        pair_build: {
            name: '🃏 对子流',
            difficulty: '⭐ 简单',
            desc: '围绕对子牌型构筑，容易凑成，倍率稳定增长',
            detail: '对子是最容易凑成的牌型，核心是通过对子相关Joker叠加倍率和筹码。配合牌库压缩提高拿到对子的概率。',
            tips: '优先升级对子的行星牌（水星），后期寻找二重奏(X2)作为终极倍率',
        },
        double_pair_build: {
            name: '👯 双对流',
            difficulty: '⭐⭐ 中等',
            desc: '两对牌型组合卡牌，双倍触发对子加成，伤害爆炸',
            detail: '两对包含两个对子，因此开心小丑(+8倍率)、奸诈小丑(+50筹码)会双倍触发。再叠加疯狂小丑(+10倍率)、聪敏小丑(+80筹码)、备用裤子(+2倍率永久叠加)，五卡齐聚时对子效果全部触发两次，伤害倍增。',
            tips: '两对是双倍快乐——对子系加成会触发两次！备用裤子的倍率叠加尤其强大，两对一次叠加+4倍率',
        },
        straight_build: {
            name: '📏 顺子流',
            difficulty: '⭐⭐ 中等',
            desc: '顺子体系，配合捷径降低门槛，秩序提供X3倍率',
            detail: '顺子需要5张连续牌，难度较高但回报丰厚。捷径允许1点间隔大幅降低组成难度，四指可以只用4张。',
            tips: '捷径是顺子流的核心辅助，让2-4-5-6-7也算顺子。四指进一步降低到4张即可',
        },
        flush_build: {
            name: '🎨 同花流',
            difficulty: '⭐⭐ 中等',
            desc: '同花体系，配合花色Joker和模糊小丑提高触发率',
            detail: '同花需要5张同花色牌，模糊小丑合并红方/黑梅大幅提高概率。四指可以降低到4张。',
            tips: '模糊小丑是同花流最重要的辅助——红桃方块合并、黑桃梅花合并，等于只有2种花色',
        },
        face_build: {
            name: '👑 人头牌流',
            difficulty: '⭐⭐ 中等',
            desc: '围绕J/Q/K人头牌构筑，多个Joker提供叠加加成',
            detail: '人头牌(J/Q/K)有大量专属加成Joker，幻视可以让所有牌都变成人头牌，是人头牌流的终极辅助。',
            tips: '幻视(所有牌变人头牌)是核心中的核心，拿到后所有人头牌加成都能触发',
        },
        kq_build: {
            name: '♔ K/Q皇室流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '围绕K和Q打造超高倍率，特里布莱K/Q各X2',
            detail: '特里布莱让K和Q各提供X2倍率，男爵让每张K提供X1.5，射月让每张Q+13倍率。配合幻视让所有牌变人头牌后效果更强。',
            tips: '传说Joker特里布莱是核心，每张K和Q都X2，手牌全是K/Q时倍率爆炸',
        },
        fibonacci_build: {
            name: '🐚 斐波那契流',
            difficulty: '⭐⭐ 中等',
            desc: '利用斐波那契数列(A,2,3,5,8)的双重触发效果',
            detail: '斐波那契小丑对A/2/3/5/8加倍率，偶数史蒂文对2/4/6/8/10加倍率，奇数托德对A/3/5/7/9加筹码。2和8可同时触发斐波那契+偶数，A/3/5可触发斐波那契+奇数。',
            tips: '2和8是双重触发王者(斐波那契+偶数)，尽量多拿这两个点数',
        },
        economy_build: {
            name: '💰 经济流',
            difficulty: '⭐ 简单',
            desc: '快速积累金钱，利用金钱转化为筹码/倍率',
            detail: '先通过经济Joker快速积累资金，再用公牛(每$1+2筹码)和提靴带(每$5+2倍率)将金钱转化为战斗力。冲向月球让利息收益最大化。',
            tips: '保持$25以上获得最大利息($5)，公牛和乌合之众让你的钱包就是你的武器',
        },
        discard_build: {
            name: '🗑️ 弃牌流',
            difficulty: '⭐⭐ 中等',
            desc: '利用弃牌触发各种效果，弃牌也能赚钱和加倍率',
            detail: '醉汉和快乐安迪增加弃牌次数，旗帜将剩余弃牌转化为筹码，约里克弃23张后获得X倍率，上路吧杰克弃J获得倍率。弃牌经济卡则把弃牌变成收入。',
            tips: '快乐安迪+3弃牌是核心引擎，配合旗帜每剩余弃牌+30筹码非常可观',
        },
        burglar_build: {
            name: '🦝 侠盗流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '窃贼移除所有弃牌，让多个Joker保持最佳状态',
            detail: '窃贼移除所有弃牌次数但+3手牌。这让拉面始终保持X2倍率、神秘峰顶始终+15倍率、延迟满足获得最高$收益、绿色小丑不会扣倍率。',
            tips: '窃贼是整个流派的基石——没有弃牌=拉面不衰减+神秘峰顶满触发+延迟满足满收益',
        },
        tarot_build: {
            name: '🔮 塔罗流',
            difficulty: '⭐⭐ 中等',
            desc: '大量产出塔罗牌，算命先生将每张塔罗牌转化为倍率',
            detail: '卡牌术士每盲注创造塔罗牌，幻觉开包1/2概率获得塔罗牌，流浪者低价时产生塔罗牌。算命先生每张使用过的塔罗牌+1倍率，后期倍率非常可观。',
            tips: '算命先生的倍率随游戏进行不断累积，是塔罗流的核心产出卡',
        },
        planet_build: {
            name: '🪐 行星流',
            difficulty: '⭐⭐ 中等',
            desc: '利用行星牌升级牌型，星座将行星转化为倍率',
            detail: '天文学家让商店行星牌免费，星座每使用行星牌+0.1X倍率。配合卫星获取独特行星收入。太空小丑有1/4概率自动升级牌型。',
            tips: '天文学家是行星流的引擎——免费行星意味着每次商店都能升级牌型+增加星座倍率',
        },
        destroy_build: {
            name: '💥 摧毁流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '通过摧毁卡牌/Joker获得永久加成',
            detail: '玻璃小丑每摧毁玻璃卡+X0.75，正义塔罗创造玻璃牌供摧毁，愚者可复制正义形成循环。仪式匕首击败Boss时摧毁右侧Joker获得永久倍率。疯狂+抽象也是经典摧毁组合。注意：吸血鬼的"移除增强"不等于摧毁，不会触发玻璃小丑。',
            tips: '玻璃卡+正义塔罗牌是核心循环——正义创造玻璃卡，玻璃卡摧毁时玻璃小丑增加倍率，愚者可复制上次使用的正义',
        },
        copy_build: {
            name: '📋 复制流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '蓝图和头脑风暴复制最强Joker效果',
            detail: '蓝图复制右侧Joker效果，头脑风暴复制最左侧Joker效果。将它们放在关键位置可以让核心Joker效果翻倍甚至三倍。',
            tips: '蓝图复制右侧、头脑风暴复制最左——合理安排Joker顺序让最强效果被复制',
        },
        sell_build: {
            name: '🔥 出售流',
            difficulty: '⭐⭐ 中等',
            desc: '通过出售卡牌获得增益，篝火每出售+X0.25',
            detail: '篝火每出售一张卡+X0.25倍率(Boss重置)，礼品卡增加出售值，零糖可乐出售创造免费双倍标签。每回合买卖循环快速累积倍率。',
            tips: '篝火在Boss重置前要尽量多出售卡牌累积倍率，乌合之众每盲注创造2个普通Joker可以出售',
        },
        chance_build: {
            name: '🎲 概率流',
            difficulty: '⭐⭐ 中等',
            desc: '六六大顺翻倍所有概率，让概率型卡牌更稳定',
            detail: '六六大顺让所有概率翻倍：血石1/2→1/1(必触发)、太空1/4→1/2、招财猫触发率翻倍。配合幸运牌和概率型Joker效果极佳。',
            tips: '六六大顺是概率流的基石——血石从50%变100%触发，太空从25%变50%，简直是作弊。注意大麦克香蕉灭绝后会变成卡文迪什(X3)更强',
        },
        augment_build: {
            name: '🧛 增强吸收流',
            difficulty: '⭐⭐ 中等',
            desc: '吸血鬼吸收增强牌效果叠加X倍率，注意与驾驶执照的取舍',
            detail: '吸血鬼打出增强牌时移除增强效果+X0.1倍率，通过塔罗牌（皇后/皇帝等）不断给牌附增强供吸收。驾驶执照需要16张增强牌才能X3，与吸血鬼存在天然矛盾——吸血鬼吃掉增强会导致驾驶执照失效，需要合理取舍。',
            tips: '如果走吸血鬼路线就别指望驾驶执照了，专注给牌加增强然后让吸血鬼吃掉叠倍率。塔罗牌产出越多，增强供应越稳定',
        },
        skip_build: {
            name: '⏭️ 跳过流',
            difficulty: '⭐⭐ 中等',
            desc: '跳过盲注获得倍率积累，回溯+红牌双重收益',
            detail: '回溯每跳过盲注+X0.25倍率，红牌每跳过增强包+3倍率。跳过小盲注和大盲注（只打Boss）可以快速积累倍率。',
            tips: '跳过小盲和大盲，只打Boss。骷髅先生防止意外死亡，杂技演员最后一手X3保底',
        },
        steel_build: {
            name: '🛡️ 钢铁牌流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '用战车塔罗创造钢铁牌，手牌中钢铁牌提供持续X1.5倍率',
            detail: '钢铁牌留在手牌中时每张提供×1.5倍率，不需要打出即可生效。钢铁小丑每有1张钢铁牌+×0.2倍率。哑剧演员让手牌中钢铁牌的×1.5额外触发1次（变为×2.25）。配合男爵(K×1.5)和射月(Q+13)，手牌中的K/Q既触发钢铁又触发皇室加成，倍率叠乘极其恐怖。',
            tips: '钢铁牌的核心优势是"不打出就能加倍率"——用战车把手牌中不需要打出的牌变钢铁牌，配合哑剧演员让每张钢铁牌的×1.5额外触发1次。手牌全钢铁时倍率指数级增长',
        },
        add_card_build: {
            name: '➕ 加牌流',
            difficulty: '⭐⭐ 中等',
            desc: '持续往牌组添加卡牌，全息影像每加1张+×0.25倍率',
            detail: '全息影像每往牌组添加1张牌就+×0.25倍率，是加牌流的核心产出。DNA每回合首次出单牌复制加入牌组，证书每选盲注加1张蜡封牌，大理石小丑每选盲注加1张石头牌。配合占卜师/星座，使用塔罗牌/行星牌也能间接触发加牌效果。后期全息倍率滚雪球极其恐怖。',
            tips: '全息影像是核心引擎，DNA是最佳搭档——每回合出单牌就+×0.25。证书和大理石提供被动稳定加牌。注意牌组膨胀后抽牌稳定性会下降',
        },
        remove_card_build: {
            name: '➖ 减牌流',
            difficulty: '⭐⭐⭐ 高级',
            desc: '通过摧毁/移除卡牌缩减牌组，侵蚀每少1张+4倍率',
            detail: '侵蚀的核心机制是牌组每比初始少1张就+4倍率。倒吊人每次移除2张牌=+8倍率，火祭一次摧毁5张=+20倍率且获$20。第六感摧毁6获得幻灵牌同时减少牌组。卡尼奥在人头牌被摧毁时叠×倍率，与侵蚀的+倍率形成双重收益。牌组越精简，抽牌越稳定，倍率越高。',
            tips: '侵蚀+火祭是爆发组合——一次火祭=+20倍率+$20。倒吊人则是稳定的每回合减牌手段。牌组压缩到极限后抽牌极其稳定，配合卡尼奥倍率叠乘恐怖',
        },
    },

    // ============ 卡牌翻译 ============
    // 中文语言包不需要重复卡牌数据，直接使用 data.js 中的原始值
    // cards: {} 留空，cardT() 回退到原始数据
});
