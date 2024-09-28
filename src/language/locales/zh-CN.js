export default {
  home: {
    buy: "購買",
    title: ["BRC20 Launchpad", "銘文流動性聚合平台"],
    voting: "投票中",
    vote: "投票",
    onMarket: "已上市",
    projectDetail: "项目详情",
    title2: ["KOL認證與空投獎勵", "發起项目與推廣項目"],
    desc2: [
      "擁有活躍的Twitter等社交帳戶，並質押至少2100個SBTC，即可提交KOL認證；",
      "通過KOL認證，即可發起項目投票或選擇上幣項目，推廣項目以獲得代幣空投獎勵；",
      "根據推特粉絲數，認證推文的閱讀、評論、按讚和轉發數，以及實際質押的SBTC數量，並參考Telegram、Discord帳戶粉絲數和活躍度，綜合計算綁定項目的代幣空投分配權重。",
    ],
    kolBtn: "KOL認證",
    startProject: "發起项目",
    review: "审核",
    dispositNumber: "質押數量",
    dispositDesc: "解除SBTC質押，將即時終止KOL資格，且不可申請複效，謹慎操作。",
    liftDisposit: "解除質押",
    title3: ["跨鏈橋Bridge", "SBTC治理與回購"],
    navTitle3: "持有SBTC项目投票，質押SBTC项目空投。",
    desc3: [
      "BSC鏈的SBTC 代幣50%發行至跨鏈橋合約，以供活躍的SBTC銘文帳戶跨鏈轉移；30%以LP兌換的方式智能合約發行，即獎勵給流動性提供者（LP）；18%以空投的方式獎勵給參與社區推廣建設的KOL；2%發行至啟動池合約。 ",
      "SmartBTC定期以網站收入和项目空投所得回購SBTC並轉入跨鏈橋合約，不斷啟動跨鏈額度直至100%，全部啟動後，雙向跨鏈同步生效。",
    ],
    title4: "技術路線圖",
    navTitle4:
      "BTC公平發行資產，跨鏈BSC整合豐富DeFi應用，逐步相容主流BTC L2 ...... ",
    desc4: [
      {
        time: "2023年3月9日",
        desc: "Ordinals協定首個帶有BTC字元的銘文SBTC部署發布",
      },
      {
        time: "2023年5月12日",
        desc: "總量2100萬，單次500的SBTC被全部Mint近2000個地址參與",
      },
      {
        time: "2024年1月13日",
        desc: "多家知名華人WEB3品牌共同舉辦的香港比特幣生態高峰會，共同發表SmartBTC 一專注於比特幣生態的VC DAO ",
      },
      {
        time: "2024年4月15日",
        desc: "收購擁有超1萬錢包地址的CoinDAO，社區代幣100T可10:1置換為BSC鏈挖礦獎勵代幣100T，遷移加入SmartBTCdao,並為BRC852新資產提供基礎流動性 ",
      },
      {
        time: "2024年4月26日",
        desc: "主網SmartBTC.io 正式發布，開通第一個跨鏈資產SBTC，提供SWAP交易，推出流動池LP質押挖礦，上線以比特幣為指數銘文為權利金的永續選擇權 ",
      },
      {
        time: "2024年5月10日",
        desc: "香港Bitcoin Asia大會，SmartBTC正式發布錨定BRC20的新資產發行協議 -- BRC852協議，為比特幣生態注入新的想像空間 ",
      },
      {
        time: "2024年下半年",
        desc: "新加坡Token2049會議期間，SmartBTC.io發布2.0版本，SmartBTC繼續整合豐富的DeFi應用，逐步向活躍比特幣銘文開放服務，SBTC成為市值TOP3主流銘文",
      },
      {
        time: "2025年",
        desc: "SmartBTC逐步相容主流BTC L2，並由BRC20(銘文)擴展到比特幣全生態，BRC852成為主流資產發行協議，SmartBTC.io成為比特幣生態底層應用，SBTC成為銘文新龍頭",
      },
    ],
    myProject: "我的項目",
    revenueCollected: "待收取收益",
    receiveBenefits: "領取收益",
    crossChainProgress: "跨鏈進度",
    LpProgress: "LP兌換發行進度",
    KOLProgress: "KOL獎勵發行進度",
    progressDesc:
      "備註：每發生一筆新的跨鍊或LP兌換，均將根據當筆數量對應比例觸發一次新的KOL奖励，認證KOL將根據增加的分配權重得到對應的項目代幣空投獎勵，可隨時領取。",
    toExerciseRights: "去行權",
    options: "期权",
    unstake: "解除質押",
    unstakeDesc: "解除質押即終止KOL資格。",
  },

  voting: {
    name: "幣種名稱",
    symbol: "幣種Symbol",
    issuanceNumber: "發行數量",
    issuanceRatio: "發行比例",
    desc: " 專案方（KOL）可以藉鏡SBTC治理與回購方案，在專案營運發展中，不斷回購BSC鏈流通中的代幣轉入跨鏈橋合約，提高跨鏈額度直至100%。",
    bridgeContract: "跨鏈橋合約",
    LPContract: "LP兌換合約",
    startContract: "啟動池合約",
    KOLContract: "KOL分配合約",
    endTime: "結束時間",
    voteProgress: "投票進度",
    voteHistory: "投票記錄",
    voteBtn: "投票支持",
    voteTips: [
      "現行投票規則：",
      "投票有效期限7天，投票門檻1 SBTC，投票完成門檻100票",
    ],
    voteSuccess: "投票成功",
  },
  noData: "暫無數據",
  noBalance: "SBTC餘額不足",
  copySuccess: "複製成功",
  stakeSuccess: "质押成功",
  kol: {
    title: ["KOL認證 — 社交帳戶", "KOL認證 — 質押SBTC", "KOL認證 — 成為项目方"],
    revenueAddress: "收益地址",
    twitter: "Twitter地址",
    desc1:
      "發布Twitter認證推文，包含SmartBTC、SBTC和想認領的銘文項目信息，文案自定義，主要考察該推文24小時閱讀數、轉發數和點贊數。",
    telegram: "Telegram地址",
    discord: "Discord地址",
    submit: "提交认证",
    submitDesc:
      "KOL貢獻分配權重計算方法：初始權重主要取決於社交帳戶總粉絲數、認證推文24小時活躍度和實際質押的SBTC數量這三大維度，運營中不定期抓取認證社交帳戶（Twitter為主，Telegram、Discord為輔）對認領銘文项目與SmartBTC平台的關注與推廣數據，根據演算法提高KOL貢獻分配權重。",
    kolReview: "KOL审核中...",
    desposit: "去质押",
    search: "输入项目名称搜索",
    startPro: "发起项目",
    desc: [
      "認領和創建项目前，需要質押SBTC，數量2100個起，質押越多，分配權重越高，可以隨時撤銷質押。",
      "在下方清單中選擇您支援的項目（支援模糊搜尋），一鍵「認領」綁定。如您支持的項目尚未在SmartBTC上市，可“發起项目”，推薦新的銘文項目，在SmartBTC BRC20 Launchpad發起投票，7天內滿100個有效投票，即取得上市資格並自動部署相關合約，同時完成KOL綁定為项目方，自動獲得該项目的KOL奖励。",
    ],
    claim: "認領",
    contentDesc: [
      "1.原則上，KOL應保持常態透過Twitter、Telegram等社交網絡，或組織線下活動等方式，積極參與某銘文項目的推廣佈道，才能認領成為該項目的社區KOL（項目方）；",
      "2.提交認領時，SmartBTC.io會多維度測算KOL的質押SBTC數量、社交帳戶活躍度、認證推文閱讀點讚轉發數、社交帳戶歷史動態與項目的關聯度、認領地址項目代幣持倉數量等綜合因素，透過演算法自動計算出當前KOL對應的社群空投獎勵分配權重；",
      "3.一個KOL（對應認證的錢包位址）只能唯一認領一個項目，且認領完成不可更改；",
      "4.可以隨時撤銷認領，解除收回質押的SBTC，一經解除KOL權益即時終止且不可申請複效；",
      "5.認領完成後，KOL應保持對該計畫的推廣佈道，積極參與社區建設，SmartBTC.io平台演算法不定期根據KOL多維度動態數據調整其空投獎勵分配權益，並對長時間不參與社區建設的KOL暫停或終止分配權益。",
    ],
    sure: "我已閱讀並認可認領規則，同意認領此項目。",
    claimRule: "認領規則",
    approve: "去授權",
    despositSBTC: "质押SBTC",
    balance: "餘額",
    inputNumber: "請輸入質押數量",
    max: "最大",
    tweet:
      "我的錢包{address}已經質押SBTC，正在SmartBTC.io平台提交KOL認證，參與推廣{name}銘文，請大家幫忙點讚、轉發這則推文，助力{name}銘文上SmartBTC熱門！",
    tweetTips: "复制以上文案发布推特并{'@'}smartbtcdao",
    status: [
      "認證通過",
      "已認領或建立项目,審核中。。。",
      "待執行合約設定KOL",
      "KOL合約已執行",
      "項目KOL已生效",
      "项目KOL設定執行失敗",
      "認證審核未通過",
      "項目KOL設定為失效",
    ],
    tips: [
      "請填寫正確的錢包地址",
      "請填寫正確的X位址",
      "認領{name}项目",
      "確認是否已發推文且以目前按讚數提交申請",
      "质押金额必须大于等于{minDeposit}SBTC",
      "已提交認證申請",
    ],
    claimSuccess: "認領成功",
  },
  kolAdd: {
    title: "KOL認證 — 推薦新項目",
    brc20Name: "銘文字符",
    brc20Id: "部署銘文ID",
    brc20Supply: "銘文總量",
    name: "銘文BRC20",
    symbol: "BSC代幣字符",
    total: "BSC代幣總量",
    rate: "BSC鏈初始發行分配比例",
    rateArr: ["跨鏈合约", "流動性發行合约", "啟動池", "KOL獎勵合约"],
    submit: "提交初審",
    desc: "說明：計畫初審通過後，將進入社區投票階段，有效投票期7天，持有SBTC社群會員可參與投票推薦，滿100票取得上市權益，自動部署相關合約。",
    tips: [
      "請填寫BSC代幣字符",
      "發行{name}项目",
      "確認是否已發推文且以目前按讚數提交申請",
    ],
    success: "申請成功",
    error: "提交資料有誤",
    descTitle: "BRC852协议",
    descNavTitle: ["锚定BTC铭文资产,跨链发行,", "融合流动性与社区激励机制"],
    descTips: [
      "模式一，只開通跨鏈橋：銘文總量與BSC代幣總量一致，且跨鏈合約100%，其他合約0。",
      "模式二，流動性發行與KOL獎勵不依賴增發：銘文總量與BSC代幣總量一致，跨鏈合約佔比50%，可透過後續營運回購轉入提高至100%。",
      "模式三，流動性發行與KOL獎勵透過BSC鏈增發提供，跨鏈合約比例＝銘文總量/BSC代幣總量，其他合約比例則根據代幣經濟模型設定。",
    ],
  },

  community: {
    title: ["我的算力", "邀請算力", "邀請提速", "質押算力", "礦池總算力"],
    desc: [
      "*每個被邀請人完成一筆質押後均貢獻邀請算力；",
      "*只有質押算力&gt;0時，邀請算力才能提供實際收益；",
      "*質押算力越大，邀請算力提速收益越高。",
    ],
    btns: ["分享好友", "我的好友"],
    list: ["我的邀请者", "被我邀请者", "暫無好友數據", "我的好友"],
    share: [
      "1. 下载OKX Web3钱包",
      "2. “发现”频道，搜索框输入 smartbtc.io",
      "3. CoinDAO会员把100T钱包导入下载的OKX，迁移跨链到BSC链；比特币铭文SBTC用户跨链转账到BSC",
      "4. 参与流动性质押挖矿，成为期权做市商 （添加流动池），参与期权交易",
      "专注比特币生态的 VC DAO",
      "複製分享連結",
    ],
    inviteSuccess: "被請求成功",
    revice: "接收邀请",
    reviceDesc: "是否接收来自{address}的邀请？",
  },
  pool: {
    search: "请输入名称搜索",
    goStaking: "去挖矿",
    scale: "管理規模",
    header: ["總流動性質押", "實时APY", "合约"],
  },
  poolDetail: {
    goPancake: "從Pancakeswap獲取LP",
    lp: "LP 地址",
    min: "最小質押算力",
    search: "輸入要質押的LP數量",
    getLp: "請先獲取 LP",
    balance: "餘額",
    tips: ["當前1LP價值", "預計獲得質押算力"],
    approve: "授權LP",
    stake: "質押LP",
    unStake: "贖回",
    desc: ["質押滿7天后可贖回；", "不贖回算力則持續生效，持續收益。"],
    contractAddress: "合約地址",
    stakeSuccess: "質押成功",
    noLp: "LP不足",
    approveSuccess: "授權成功",
    approveError: "授權失败",
    max: "最大",
    placeHolder: "本次輸入需 ≥ 0",
  },
  withdraw: {
    title: "領取空投",
    btn: "提 現",
    history: "近期記錄",
    desc: ["質押算力", "質押塊高", "贖回塊高", "贖回", "待收收益", "收取"],
    allData: "已載入全部數據",
    withdrawSuccess: "提現成功",
    ChargeSuccess: "收取成功",
    redemptionSuccess: "赎回成功",
  },
  lpSwap: {
    title: "提供流動性發行資產",
    desc: "錨定BRC20-{name}，總供應量 {total} K",
    desc2: "錨定符文IOOT•SMARTBTC•IO，總供應量 {total} K",
    address: "合約地址",
    shares: "我的持股(佔比)",
    navTitle: "流動性發行兌換進度",
    timely: "即時兌換率",
    swap: "去兌換",
    select: "選擇代幣",
    list1: [
      "社區公平鑄造",
      "收購CoinDAO",
      "LP質押挖礦",
      "流動性發行",
      "啟動池部署",
    ],
    list: ["跨鏈", "流動性發行", "啟動池", "KOL奖励"],
    swapSuccess: "兑换成功",
    swapFail: "兑换失败",
    noBalance: "余额不足",
    errorTips: "请输入正确数量的LP",
    expected: "预计兑换出",
  },
  btcSwap: {
    swap: "跨鏈",
    send: "先铭刻，再發送",
    buy: "購買",
    reviceAddress: "接收地址",
    paste: "粘贴",
    submit: "提交跨鏈",
    history: "跨鏈記錄",
    select: "選擇銘文",
    tips: "沒有可以發送的 {selectedChain} 銘文",
    allData: "已載入全部數據",
    connect: "請連接BTC錢包",
    desc: ["請選擇要發送的銘文", "請填寫正確的接收地址"],
    status: ["新建", "進行中", "已完成", "失敗", "進行中"],
    hash: "交易Hash",
    amount: "數量",
    orderStatus: "訂單狀態",
  },

  hecoSwap: {
    balance: "100T餘額",
    max: "最大",
    approve: "授權",
    submit: "跨鏈提交",
    bridge: "跨鏈",
    bridgeAmount: "可跨鏈金額",
    tips: "因被SmartBTC收购，CoinDAO社區代币100T (HECO)可10:1置换为比特币符文IOOT•SMARTBTC•IO（BSC对应代币为100T） ，请尽快行权!",
    history: "跨鏈記錄",
    number: "訂單編號",
    hash: "交易Hash",
    amount: "數量",
    orderStatus: "訂單狀態",
    noBalance: "餘額不足",
    approveSuccess: "授權成功",
    min: "最小跨鏈金額為{number}",
    submitSucccess: "跨鏈提交成功",
    placeHolder: "本次輸入需 ≥ {number}",
  },

  options: {
    tradeTitle: "交易",
    marketMakerTitle: "做市商",
    trade: {
      title: [
        "指数",
        "权利金",
        "选择",
        "可用保证金",
        "维持保证金",
        "存入",
        "取回",
        "交易设置",
        "滑点上限",
        "交易截止时间",
        "分钟",
        "做多",
        "做空",
        "数量",
        "手续费",
        "资金存入",
        "取回资金",
        "交易信息",
        "期权类型",
        "开仓数量",
        "开仓指数",
      ],
      desc: "当可用余额小于下一次展期需要付出的权利金时，才会被扣除。",
      max: "最大",
      select: "选择代币",
      search: "输入代币地址查询",
      nodata: "无数据",
      errorAddress: "地址不合法",
      openFail: "开仓失败",
      openSuccess: "开仓成功",
      getSuccess: "资金取回成功",
      errorTips: ["余额不足", "请输入正确的金额"],
      desposit: "资金存入成功",
      selectApproveToken: "请选择授权代币",
      tradeAmount: "24小时交易量",
      approve: "授權",
      fee: "手续费",
      sure: "确认",
      open: "开仓",
    },
    order: {
      title: "订单",
      have: "当前持仓",
      tradeLP: "交易对",
      type: "期权类型",
      openTime: "开仓时间",
      openAmount: "开仓数量",
      UPL: "未实现盈亏",
      long: "做多",
      short: "做空",
      openIndex: "开仓指数",
      markIndex: "标记指数",
      fee: "手续费",
      paid: "已付权利金",
      close: "平仓",
      history: "历史交易",
      amount: "数量",
      profitAndLoss: "损益",
      closeTime: "平仓时间",
      closeInfo: "平仓信息",
      positionAmount: "持仓数量",
      closingIndex: "平仓指数",
      sure: "确认",
      closeSuccess: "平仓成功",
    },
    info: {
      title: "信息",
      desc: [
        "有效日期",
        "永续",
        "手续费率",
        "维持保证金率",
        "类型",
        "永续期权",
        "行权",
        "手动",
        "风险保证金",
      ],
    },
    pool: {
      title: "流动性池",
      desc: ["私池", "可用流动性", "公池", "可用流动性"],
    },
    marketMaker: {
      title: "添加池子，坐享做市商收益",
      desc: [
        "公池",
        "通过提供储备流动性赚取溢价，向所有代币开放。",
        "私池",
        "提供流动性以卖出永续期权，仅向专业做市商开放。",
      ],
    },
    public: {
      addLi: "添加流动性",
      select: "选择代币",
      tips: " 对于不存在的交易对，添加流动性会自动创建对应的交易对",
      amount: "数量",
      approve: "授权",
      navTitle: "您在池中的份额",
      remove: "移除",
      nodata: "无数据",
      search: "输入代币地址查询",
      removeLi: "移除流动性",
      removeAmount: "移除数量",
      max: "最大",
      willGet: "你将接收到",
      selectApprove: "请选择要授权的代币",
      addLiSuccess: "添加流动性成功",
      errorTips: ["请输入正确的移除数量", "余额不足"],
      successTips: "移除流动性成功",
    },
    private: {
      setLiq: "设置流动性成功",
      applicationSet: "应用设置",
      setPool: "作为指定私池",
      getOrder: "接单",
      address: "私池地址",
      setAddress: "私池设置",
      selecTradeLp: "选择交易对",
      add: "添加",
      availability: "可用率",
      yourLp: "您的流动性",
    },
  },

  sure: "確認",
  cancel: "取消",

  footer: {
    mine: "我的",
    bridge: "跨鏈橋",
    swap: "LP兌換",
    pool: "啟動池",
    community: "社區",
  },
  noWallet: "未偵測到錢包",
  connectTip: ["請選擇幣安智能鏈", "請選擇火币智能鏈"],
};
