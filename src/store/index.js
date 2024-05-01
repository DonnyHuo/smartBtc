import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    address: "",
    t100: "0x38629893f4cedd26e33af93e581d1e3aca178c0a",
    sBtc: "0xf3669729f30bc4f6ebee1dbad401f26b80e69d5b",
    inviteAddress: "0xdCda96a2A1167D8A8DD7CdcE64448ee3F230a2fe",
    poolAddress: "0xCBa0580fa60C48b43556AdA557C426995488F24e",
    chainId: "",
    hecoBrigeAddress: "0x892b4f85d7854d3d484e3e7d6a7025175556ec01",
    hecoT100: "0xd56b1b54dfd4a9534b1c5eb58c8e9bb2dbe3c72b",
    usdtDecimals: 18,
    BTCUSDPrice: "0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf",
    ETHUSDPrice: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",

    // BTCUSDAggreagatorAddr: "0xC67F6DB4e7D9a33E0f69606d946DDe00F1fC458D",
    // ETHUSDAggreagatorAddr: "0x29F7e795F85B081C0dAbDfBE93CF912320A30907",
    // LiquidityFactoryAddr: "0xF3CF3Cbfc622A963Ea2A93aE6f8531018e666fe3",
    // LiquidityManagerAddr: "0xCCFb97c9f578d1b3a554DEf304D57b0C9C7EA160",
    // ETHUSDFormulaAddr: "0xb5379a63b5412BEaCEE41746b44c7DccEBc4e587",
    // BTCUSDFormulaAddr: "0x1477D9066fA62F453BFf13cfBA6939Bf8af4f037",
    // BTCUnderlyingAssetAddr: "0xE6e3BDA199A914E29D9da67F1Fd114cABa9A80Ef",
    // ETHUnderlyingAssetAddr: "0xFc34f1E683FdE619380600994b3e5cB41DBb351b",
    // BrokerAddr: "0x4366B94FfbEe751889b9B621377614d71F357001",
    // // PerpetualOptionsAddr: "0xab2CC8EbA51c9Dd60Ab9182f9B9e3b1ECbde4400",
    // PerpetualOptionsAddr: "0x1e933E0957e6236E519e64CD13f967146Fcb4755",

    BTCUSDAggreagatorAddr: "0xC67F6DB4e7D9a33E0f69606d946DDe00F1fC458D",
    ETHUSDAggreagatorAddr: "0x29F7e795F85B081C0dAbDfBE93CF912320A30907",
    LiquidityFactoryAddr: "0xF3CF3Cbfc622A963Ea2A93aE6f8531018e666fe3",
    LiquidityManagerAddr: "0xCCFb97c9f578d1b3a554DEf304D57b0C9C7EA160",
    ETHUSDFormulaAddr: "0xb5379a63b5412BEaCEE41746b44c7DccEBc4e587",
    BTCUSDFormulaAddr: "0x1477D9066fA62F453BFf13cfBA6939Bf8af4f037",
    BTCUnderlyingAssetAddr: "0xE6e3BDA199A914E29D9da67F1Fd114cABa9A80Ef",
    ETHUnderlyingAssetAddr: "0xFc34f1E683FdE619380600994b3e5cB41DBb351b",
    BrokerAddr: "0x4366B94FfbEe751889b9B621377614d71F357001",
    PerpetualOptionsAddr: "0xab2CC8EbA51c9Dd60Ab9182f9B9e3b1ECbde4400",

    slippage: 3,
    tradeTime: 1,
    selectedCoin: {},
    selectedList: [],
    tokenList: [],

    lpExchange: "0x976C825844fa939938110e05119EA0b7cDB77ceA",
  },
  mutations: {
    setAddress(state, data) {
      return (state.address = data);
    },
    setChainId(state, data) {
      return (state.chainId = data);
    },
    setSlippage(state, data) {
      return (state.slippage = data);
    },
    setTradeTime(state, data) {
      return (state.tradeTime = data);
    },
    setSelectedCoin(state, data) {
      return (state.selectedCoin = data);
    },
    setSelectedList(state, data) {
      return (state.selectedList = data);
    },
    setTokenList(state, data) {
      return (state.tokenList = data);
    },
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })],
});
