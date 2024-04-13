<template>
  <div class="options">
    <div class="selectBox">
      <div class="info">
        <div class="logoBox">
          <img
            class="logo"
            :src="
              activeTabs
                ? require('@/assets/img/eth.svg')
                : require('@/assets/img/btc.svg')
            "
            alt=""
          />
          <div v-if="selectedCoin.symbol" class="miniCoin">
            {{ selectedCoin.symbol && selectedCoin.symbol.substring(0, 1) }}
          </div>
        </div>

        <div class="logoSymbols">
          <div>
            <div>{{ activeTabs ? "ETH" : "BTC" }}</div>
            <div>指数</div>
          </div>
          <div class="line">/</div>
          <div>
            <div>{{ selectedCoin.symbol }}</div>
            <div>权利金</div>
          </div>
        </div>
        <van-button
          size="small"
          :icon="require('@/assets/img/down.png')"
          icon-position="right"
          @click="tokenShow"
          >选择</van-button
        >
      </div>
      <div class="swap">
        <span class="name">{{ activeTabs ? "ETH" : "BTC" }}</span>
        <span>指数</span>
        <span>=</span>
        <span class="name">{{ USDPrice[activeTabs ? "ETH" : "BTC"] }}</span>
        <span>{{ selectedCoin.symbol }}</span>
      </div>
    </div>

    <!-- <div class="klineBox">
      <div class="upDown">
        <div>
          <span>{{ selectedCoin.indexCoin || "BTC" }}</span
          ><span>USD</span>
        </div>
        <div>40,854.72</div>
      </div>
      <div class="info">
        <div><span>24h Change</span><span>3.85%</span></div>
        <div>
          <span>24h Volume</span><span>21.50 {{ selectedCoin.indexCoin || "BTC" }}</span>
        </div>
      </div>

      <div class="chart">
        <Chart :activeTabs="activeTabs" />
      </div>
    </div> -->
    <div class="balanceBox">
      <div class="title">可用保证金({{ selectedCoin.symbol }})</div>
      <div class="balance">
        {{ orderInfo.available ? (orderInfo.available * 1).toFixed(2) : "0.00" }}
      </div>
      <img class="dashBoard" src="@/assets/img/dashBoard.png" alt="" />
      <div class="info">
        <div>
          <div class="maintenance">
            <span>维持保证金</span>
            <van-popover
              class="maintenancePopover"
              v-model:show="showPopoverMaintenance"
              placement="right"
            >
              <template #reference>
                <img class="tips" src="@/assets/img/tips.png" alt="" />
              </template>
              <div class="popoverTitle">维持保证金</div>
              <div>当可用余额小于下一次展期需要付出的权利金时，才会被扣除。</div>
            </van-popover>
          </div>

          <span>
            <span class="miniFont">{{
              orderInfo.locked && (orderInfo.locked * 1).toFixed(2)
            }}</span>
            <span>{{ selectedCoin.symbol }}</span>
          </span>
        </div>
        <!-- <div>
          <span>展期 | 18:48:4</span>
          <span>xx {{ selectedCoin.symbol || "POT" }}</span>
        </div> -->
      </div>
      <div class="btnBox">
        <van-button @click="showDepositSheetFun">存入</van-button>
        <van-button @click="showWithdrawSheetFun">取回</van-button>
      </div>
    </div>
    <div class="tradeBox">
      <div class="setting">
        <div>
          <span>{{ activeTabs ? "ETH" : "BTC" }}</span>
          <span>USD:</span>
          <span class="usdPrice">{{ USDPrice[activeTabs ? "ETH" : "BTC"] }}</span>
        </div>
        <div>
          <van-popover
            class="settingsPopover"
            v-model:show="settingPopover"
            placement="bottom-end"
          >
            <template #reference>
              <img src="@/assets/img/settings.png" alt="" />
            </template>
            <div class="title">
              <span>交易设置</span>
              <img
                class="closeSettingPopover"
                @click="settingPopover = false"
                src="../../../assets/img/close.png"
                alt=""
              />
            </div>
            <div>
              <div class="nav_title">滑点上限</div>
              <div class="selectSlippage">
                <van-button
                  v-for="(item, index) in slippages"
                  :key="index"
                  :class="slippage == item ? 'activeSlippage' : ''"
                  @click="setSlippage(item)"
                >
                  {{ item }}%
                </van-button>
                <div class="inputBox">
                  <input class="inputS" v-model="slippageInput" type="text" />
                  <span>%</span>
                </div>
              </div>
            </div>
            <div>
              <div class="nav_title">交易截止时间</div>
              <div class="deadline">
                <input class="inputValue" v-model="tradeTimeInput" type="text" />
                <span>分钟</span>
              </div>
            </div>
          </van-popover>
        </div>
      </div>
      <div class="tabs">
        <van-button :class="index == 0 ? 'active' : ''" @click="changeTab(0)"
          >做多</van-button
        >
        <van-button :class="index == 1 ? 'active' : ''" @click="changeTab(1)"
          >做空</van-button
        >
      </div>
      <div>数量（{{ activeTabs ? "ETH" : "BTC" }}）</div>
      <div class="inputBox">
        <input type="text" v-model="tradeAmount" :placeholder="`最大 ${maxAmount}`" />
        <van-button @click="maxSellFun" size="small">最大</van-button>
      </div>
      <div class="sliderBox">
        <a-slider
          style="width: 100%"
          :included="true"
          :tooltipOpen="false"
          v-model:value="sliderValue"
          :marks="marks"
          @afterChange="changeSliderFun"
        >
          <template #mark="{ label, point }">
            <template v-if="point === 100">
              <strong>{{ label }}</strong>
            </template>
            <template v-else>{{ label }}</template>
          </template>
        </a-slider>
      </div>
      <div class="infos">
        <span>手续费</span>
        <span>
          <span class="weight paddingRight">{{
            formatNum(
              tradingFeeRate * tradeAmount * 1 * USDPrice[activeTabs ? "ETH" : "BTC"],
              4
            )
          }}</span>
          <span>{{ selectedCoin.symbol }}</span>
        </span>
      </div>
      <!--  <div class="infos">
       <span class="info">
          <span>权利金</span>
          <img
            class="calculator"
            src="@/assets/img/calculator.png"
            @click="showPopover = true"
            alt=""
          />
          <van-popover
            class="calculatorPopover"
            v-model:show="showPopover"
            placement="top-start"
          >
            <div class="title">
              <span>权利金结算周期表</span>
              <img
                class="closeCalculatorPopover"
                src="../../../assets/img/close.png"
                alt=""
                @click="showPopover = false"
              />
            </div>
            <div class="infos">
              <div>
                <span>结算周期</span>
                <span>24小时</span>
              </div>
              <div>
                <span>权利金</span>
                <span class="symbolsBox">
                  <span class="symbols">
                    {{ selectedCoin.symbol && selectedCoin.symbol.substring(0, 1) }}
                  </span>
                  <span>{{ selectedCoin.symbol }}</span>
                </span>
              </div>
              <div>
                <span>开仓数量</span>
                <span>
                  <span style="padding-right: 4px">{{ tradeAmount }}</span>
                  <span>{{ activeTabs ? "ETH" : "BTC" }}</span>
                </span>
              </div>
            </div>
            <div class="phaseLists">
              <div v-for="(item, index) in phase">
                <div :key="index">
                  <div>周期 {{ index }}</div>
                  <div>{{ item.value }}</div>
                </div>
              </div>
            </div>
            <div class="nav_title">想要持仓的周期数</div>
            <div class="phaseInput">
              <div><input class="inputValue" type="text" /><span>周期</span></div>
              <div>{{ selectedCoin.symbol }}</div>
            </div>
          </van-popover>
        </span>
        <span>
          <span class="weight paddingRight"> 0.0</span>
          <span>{{ selectedCoin.symbol }}</span>
        </span>
      </div> -->
      <van-button @click="showTradeSheetFun" :class="`open ${!index ? 'long' : 'short'}`"
        >开仓</van-button
      >
    </div>
    <Orders
      :orderInfo="orderInfo"
      @getAccountInfo="getAccountInfo"
      :USDPrice="USDPrice"
    />
    <Pool :selectedCoin="selectedCoin" :activeTabs="activeTabs" />
    <Info :selectedCoin="selectedCoin" :activeTabs="activeTabs" />
    <Request />

    <van-action-sheet
      class="selectTokenList"
      v-model:show="showTokenList"
      title="选择代币"
    >
      <div class="content">
        <van-tabs class="tabs" v-model:active="activeTabs">
          <van-tab title="BTC-INDEX"></van-tab>
          <van-tab title="ETH-INDEX"> </van-tab>
        </van-tabs>
        <!-- <input
          class="search"
          type="text"
          v-model="searchValue"
          placeholder="输入代币地址查询"
        /> -->

        <van-search
          class="search"
          v-model="searchValue"
          placeholder="输入代币地址查询"
          input-align="center"
        />
        <div class="lists">
          <div v-for="(list, index) in actionsList">
            <div class="list" :key="index" @click="selectList(list)">
              <div>
                <div class="symbols">
                  {{ list.symbol && list.symbol.substring(0, 1) }}
                </div>
                <div class="name">
                  <div>{{ list.symbol }}</div>
                  <div>
                    24小时交易量：{{
                      list.volume && list.volume[activeTabs ? "ETH" : "BTC"]
                    }}
                    {{ activeTabs ? "ETH" : "BTC" }}
                  </div>
                </div>
              </div>
              <div v-if="list.values" class="balance">
                {{
                  formatNumber(
                    list.values[activeTabs ? "ETH" : "BTC"].pub +
                      list.values[activeTabs ? "ETH" : "BTC"].pri,
                    2
                  )
                }}
              </div>
            </div>
          </div>
          <div class="noData" v-if="actionsList.length == 0">
            <van-loading v-if="loadingList" />
            <van-empty v-else image="search" image-size="100" description="无数据" />
          </div>
        </div>
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="depositSheet"
      v-model:show="showDepositSheet"
      title="资金存入"
    >
      <div class="content">
        <div class="inputBox">
          <div class="coinName">{{ selectedCoin.symbol }}</div>
          <div class="inputDiv">
            <input
              v-model="depositValue"
              type="text"
              :placeholder="`最大 ${selectedCoin.balanceOf}`"
            />
            <van-button @click="maxDepositFun">最大</van-button>
          </div>
        </div>
        <div>
          <van-button
            v-if="allowance * 1 > 0"
            :loading="depositLoading"
            class="depositBtn"
            @click="depositFun"
            size="small"
            >存入</van-button
          >
          <van-button
            v-else
            :loading="approveLoading"
            class="depositBtn"
            @click="approve"
            size="small"
            >授权
          </van-button>
        </div>
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="withdrawSheet"
      v-model:show="showWithdrawSheet"
      title="取回资金"
    >
      <div class="content">
        <div class="inputBox">
          <div class="coinName">{{ selectedCoin.symbol }}</div>
          <div class="inputDiv">
            <input
              v-model="withdrawValue"
              type="text"
              :placeholder="`最大 ${orderInfo.available}`"
            />
            <van-button @click="maxWithdrawFun">最大</van-button>
          </div>
        </div>
        <van-button
          :loading="withdrawLoading"
          class="depositBtn"
          size="small"
          @click="withdrawFun"
          >取回</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="showTradeSheet"
      v-model:show="showTradeSheet"
      title="交易信息"
    >
      <div class="content">
        <div class="nameInfo">
          <div class="logos">
            <img
              :src="
                activeTabs
                  ? require('@/assets/img/eth.svg')
                  : require('@/assets/img/btc.svg')
              "
              alt=""
            />
            <div class="symbols">
              {{ selectedCoin.symbol && selectedCoin.symbol.substring(0, 1) }}
            </div>
          </div>
          <div class="name">
            <span>{{ activeTabs ? "ETH" : "BTC" }}USD </span>
            <span>-</span>
            <span>{{ selectedCoin.symbol }}</span>
          </div>
        </div>
        <div class="infoBox">
          <div>
            <span>期权类型</span>
            <span :class="index ? 'red' : 'green'">{{ index ? "做空" : "做多" }}</span>
          </div>
          <div>
            <span>开仓数量</span>
            <span>
              <span class="weight paddingRight">{{ formatNum(tradeAmount * 1) }}</span>
              <span>BTC</span>
            </span>
          </div>
          <div>
            <span>开仓指数</span>
            <span class="weight">{{ USDPrice[activeTabs ? "ETH" : "BTC"] }}</span>
          </div>
          <!-- <div>
            <span>首期权利金</span>
            <span>
              <span class="weight paddingRight">0.00</span>
              <span>{{ selectedCoin.symbol }}</span>
            </span>
          </div> -->
          <div>
            <span>手续费</span>
            <span>
              <span class="weight paddingRight">
                {{
                  (
                    tradingFeeRate *
                    tradeAmount *
                    USDPrice[activeTabs ? "ETH" : "BTC"] *
                    1
                  ).toFixed(2)
                }}
              </span>
              <span> {{ selectedCoin.symbol }}</span>
            </span>
          </div>
        </div>
        <van-button :loading="tradingLoading" @click="tradeFun" class="sure"
          >确认</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import liquidityManagerAbi from "@/abi/liquidityManager.json";
import perpetualOptionsAbi from "@/abi/perpetualOptions.json";
import underlyingAssetAbi from "@/abi/underlyingAsset.json";
import USDPriceAbi from "@/abi/USDPrice.json";
import brokerAbi from "@/abi/broker.json";
import publicPoolAbi from "@/abi/publicPool.json";
import privatePoolAbi from "@/abi/privatePool.json";
import erc20Abi from "@/abi/erc20.json";
import {
  copy,
  getContract,
  getWriteContractLoad,
  getWriteContract,
  formatNumber,
  formatNum,
} from "@/utils";
import { http } from "@/http/request";
import { ethers } from "ethers";
import { showToast } from "vant";
import Info from "../Trade/info.vue";
import Orders from "../Trade/orders.vue";
import Pool from "../Trade/pool.vue";
import Request from "./request.vue";
import Chart from "@/components/Chart.vue";

export default {
  name: "options",
  data() {
    return {
      sliderValue: "100%",
      marks: { 0: "", 25: "", 50: "", 75: "", 100: "" },
      slippages: [0.5, 1, 3],
      index: 0,
      activeTabs: 0,
      showPopover: false,
      settingPopover: false,
      phase: [
        {
          value: "0.0001",
        },
        {
          value: "0.0003",
        },
        {
          value: "0.0001",
        },
        {
          value: "0.0002",
        },
        {
          value: "0.0001",
        },
        {
          value: "0.0000",
        },
      ],
      showTokenList: false,
      searchValue: "",
      actions: [],
      searchActions: [],
      selectedCoin: {
        symbol: "POT",
        address: "",
      },
      showDepositSheet: false,
      showWithdrawSheet: false,
      withdrawValue: "",
      depositValue: "",
      orderInfo: {},
      inviters: "",
      depositLoading: false,
      withdrawLoading: false,
      maxAmount: "",
      tradeAmount: "",
      tradingLoading: false,
      slippageInput: "",
      tradeTimeInput: "",
      showPopoverMaintenance: false,
      loadingList: true,
      showTradeSheet: false,
      USDPrice: {},
      FundingFeeRateMatrix: [],
      tradingFeeRate: 0,
      allowance: 0,
      approveLoading: false,
    };
  },
  components: {
    Info,
    Orders,
    Pool,
    Request,
    Chart,
  },
  computed: {
    actionsList() {
      return this.searchValue ? this.searchActions : this.actions;
    },
    tradeTime() {
      return this.$store.state.tradeTime;
    },
    slippage() {
      return this.$store.state.slippage;
    },
  },
  mounted() {
    this.getTokenList();
    this.tradeTimeInput = this.tradeTime;
    this.slippageInput = this.slippage;
    Object.keys(this.$store.state.selectedCoin).length > 0 &&
      (this.selectedCoin = this.$store.state.selectedCoin);

    this.$store.state.selectedList.length > 0 &&
      (this.actions = this.$store.state.selectedList);
    this.init();
    this.getUSDPrice();
    setInterval(() => {
      this.getUSDPrice();
    }, 3000);
  },
  methods: {
    formatNum,
    formatNumber,
    changeTab(ind) {
      this.index = ind;
    },
    tokenShow() {
      this.showTokenList = true;
    },
    Clipboard(address) {
      console.log(address);
      showToast("复制成功");
      return copy(address);
    },
    selectList(item) {
      this.showTokenList = false;
      this.selectedCoin = item;
    },
    async getTokenList() {
      // 获取token的长度
      const length = await getContract(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "getTokenListLength"
      );
      const len = length.toString();
      // 获取token的address地址
      const tokenList = await getContract(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "getTokenList",
        0,
        len
      );
      const newList = await this.getTokenInfo(tokenList);
      this.dataLoading = false;

      this.actions = newList;
      this.getVolume();
      this.getTokenAnyInfo();

      if (Object.keys(this.$store.state.selectedCoin).length == 0) {
        this.selectedCoin = newList[0];
        this.$store.commit("setSelectedCoin", newList[0]);
      }

      this.$store.commit("setSelectedList", this.actions);
    },

    // 获取tokenlist基础信息
    async getTokenInfo(tokenList) {
      const arr = [];
      for (let i = 0; i < tokenList.length; i++) {
        const tokenInfo = {
          address: tokenList[i],
          symbol: await getContract(tokenList[i], erc20Abi, "symbol"),
        };
        arr.push(tokenInfo);
      }

      return arr;
    },

    // 获取tokenList其他信息
    async getTokenAnyInfo() {
      for (let i = 0; i < this.actions.length; i++) {
        const decimals =
          (await getContract(this.actions[i].address, erc20Abi, "decimals")).toString() *
          1;
        const balanceOf = await ethers.utils.formatUnits(
          await getContract(
            this.actions[i].address,
            erc20Abi,
            "balanceOf",
            this.$store.state.address
          ),
          decimals
        );
        this.actions[i].balanceOf = balanceOf;
        this.actions[i].decimals = decimals;
        const values = {
          ETH: (await this.getValues(this.actions[i], "ETH")) || 0,
          BTC: await this.getValues(this.actions[i], "BTC"),
        };
        this.actions[i].values = values;
      }
    },

    // 获取公池地址和数量
    async getValues(token, type) {
      let pubAvailableAmount = 0;
      let priAvailableAmount = 0;
      await getContract(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "getLiquidityPool",
        token.address,
        type
      )
        .then(async (address) => {
          if (address.pubPool !== ethers.constants.AddressZero) {
            const pub = await getContract(
              address.pubPool,
              publicPoolAbi,
              "publicPoolInfo"
            );
            pubAvailableAmount = ethers.utils.formatUnits(
              pub.availableAmount,
              token.decimals
            );
          }
          if (address.priPool !== ethers.constants.AddressZero) {
            const pri = await getContract(
              token.address,
              erc20Abi,
              "balanceOf",
              address.priPool
            );
            const locked = await getContract(
              address.priPool,
              privatePoolAbi,
              "totalLockedLiquidity"
            );
            priAvailableAmount = ethers.utils.formatUnits(pri, token.decimals) * 1;
            //  -
            // ethers.utils.formatUnits(locked, token.decimals) * 1;
          }
        })
        .catch((err) => console.log(err));
      console.log("token", token, pubAvailableAmount, priAvailableAmount);
      return {
        pub: pubAvailableAmount * 1,
        pri: priAvailableAmount * 1,
      };
    },
    // 获取token列表
    async getERC20Token(address) {
      const info = {
        address,
        name: await getContract(address, erc20Abi, "name"),
        symbol: await getContract(address, erc20Abi, "symbol"),
      };
      const decimals = await getContract(address, erc20Abi, "decimals");
      const balance = await getContract(
        address,
        erc20Abi,
        "balanceOf",
        this.$store.state.address
      );
      const balanceOf = ethers.utils.formatUnits(balance, decimals);
      info.balanceOf = balanceOf;
      info.decimals = decimals;
      return info;
    },
    // 获取授权
    async getAllowance(tokenAddress) {
      const allowance = await getContract(
        tokenAddress,
        erc20Abi,
        "allowance",
        this.$store.state.address,
        this.$store.state.PerpetualOptionsAddr
      );
      this.allowance = allowance.toString();
    },
    // 授权
    async approve() {
      if (!this.selectedCoin.address) {
        return showToast("请选择授权代币");
      }
      this.approveLoading = true;
      await getWriteContractLoad(
        this.selectedCoin.address,
        erc20Abi,
        "approve",
        this.$store.state.PerpetualOptionsAddr,
        ethers.constants.MaxUint256
      )
        .then(() => {
          this.approveLoading = false;
          showToast("授權成功");
          this.getAllowance(this.selectedCoin.address);
        })
        .catch((err) => {
          this.approveLoading = false;
          console.log(err);
        });
    },

    maxDepositFun() {
      console.log("this.selectedCoin", this.selectedCoin);
      this.depositValue = this.selectedCoin.balanceOf;
    },

    maxWithdrawFun() {
      this.withdrawValue = this.orderInfo.available;
    },

    //查询用户账户信息
    async getAccountInfo() {
      const info = await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "getAccountInfo",
        this.$store.state.address,
        this.selectedCoin.address
      );
      this.orderInfo = {
        available:
          ethers.utils.formatUnits(info.available, this.selectedCoin.decimals) * 1,
        locked: ethers.utils.formatUnits(info.locked, this.selectedCoin.decimals) * 1,
        orderAmount: info.orderAmount.toString() * 1,
        orderIDs: info.orderIDs.map((order) => order.toString()),
      };
    },

    // 查询用户的邀请人
    async getInviters() {
      const inviters = await getContract(
        this.$store.state.BrokerAddr,
        brokerAbi,
        "inviters",
        this.$store.state.address
      );
      this.inviters = inviters;
    },
    // 用户存款
    async depositFun() {
      if (this.depositValue * 1 > this.selectedCoin.balanceOf * 1) {
        return showToast("余额不足");
      }
      if (this.depositValue == "") {
        return showToast("请输入正确的金额");
      }
      this.depositLoading = true;
      const overrides = {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("5", "gwei"),
      };
      await getWriteContractLoad(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "deposit",
        this.selectedCoin.address,
        ethers.utils.parseUnits(this.depositValue, this.selectedCoin.decimals),
        this.inviters,
        overrides
      )
        .then(async () => {
          this.depositLoading = false;
          this.showDepositSheet = false;
          this.getMaxAmount(this.index);
          this.getAccountInfo();
          showToast("资金存入成功");
          this.selectedCoin.balanceOf = await getContract(
            this.selectedCoin.address,
            erc20Abi,
            "balanceOf"
          );
        })
        .catch((err) => {
          this.depositLoading = false;
          this.showDepositSheet = false;
          console.log(err);
        });
    },
    // 用户取款
    async withdrawFun() {
      if (this.withdrawValue * 1 > this.orderInfo.available * 1) {
        return showToast("余额不足");
      }
      if (this.withdrawValue == "") {
        return showToast("请输入正确的金额");
      }
      this.withdrawLoading = true;
      await getWriteContractLoad(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "withdraw",
        this.selectedCoin.address,
        ethers.utils.parseUnits(this.withdrawValue.toString(), this.selectedCoin.decimals)
      )
        .then(async () => {
          this.withdrawLoading = false;
          this.showWithdrawSheet = false;
          this.getMaxAmount(this.index);
          this.getAccountInfo();
          showToast("资金取回成功");
          this.selectedCoin.balanceOf = await getContract(
            this.selectedCoin.address,
            erc20Abi,
            "balanceOf"
          );
        })
        .catch((err) => {
          console.log(err);
          this.showWithdrawSheet = false;
          this.withdrawLoading = false;
        });
    },

    async showDepositSheetFun() {
      this.showDepositSheet = true;
      this.selectedCoin.balanceOf = ethers.utils.formatUnits(
        await getContract(
          this.selectedCoin.address,
          erc20Abi,
          "balanceOf",
          this.$store.state.address
        ),
        this.selectedCoin.decimals
      );
    },
    async showWithdrawSheetFun() {
      this.withdrawValue = "";
      this.showWithdrawSheet = true;
      this.getAccountInfo();
    },
    // 查询用户最大可开单数量
    async getMaxAmount(type) {
      const maxAmount = await getWriteContract(
        this.$store.state.PerpetualOptionsAddr, //合约地址
        perpetualOptionsAbi, //abi
        "getMaxAmount",
        this.selectedCoin.address.toLocaleLowerCase(), //当前选中的token的地址
        this.activeTabs ? "ETH" : "BTC",
        type ? false : true
      );
      this.maxAmount = this.formatNum(ethers.utils.formatUnits(maxAmount, 18) * 1);
    },

    // 最大开仓
    maxSellFun() {
      this.tradeAmount = this.maxAmount;
      this.sliderValue = 100;
    },

    //滑动进度条
    changeSliderFun(value) {
      this.tradeAmount = this.formatNum((this.maxAmount * value) / 100).toString();
    },

    showTradeSheetFun() {
      if (this.tradeAmount * 1 > 0) {
        this.showTradeSheet = true;
      }
    },
    /** 交易
     *  1. string类型，_name，交易对名称（BTC,ETH）
        2. address类型，_token，开仓的token地址
        3. address类型，_maker，指定maker地址
        4. bool类型， _isBuy，true为开多，false为开空
        5. uint256类型， _amount，开仓标的物的数量
        6. uint256类型， _slideDownPrice，开空的交易价格滑点
        7. uint256类型， _slideUpPrice，开多的交易价格滑点
        8. uint256类型， _deadline，交易成功的截止时间
     **/

    async tradeReadFun() {
      await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "tradeRead",
        this.activeTabs ? "ETH" : "BTC",
        this.selectedCoin.address,
        ethers.constants.AddressZero,
        this.index ? false : true,
        ethers.utils.parseUnits("0.1", 18),
        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeTabs ? "ETH" : "BTC"] *
            (1 - this.slippage / 100)
          ).toString(),
          18
        ),
        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeTabs ? "ETH" : "BTC"] *
            (1 + this.slippage / 100)
          ).toString(),
          18
        ),
        Date.parse(new Date()) / 1000 + this.tradeTime * 60
      )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },

    async tradeFun() {
      this.tradingLoading = true;
      // const overrides = {
      //   gasLimit: 1000000,
      //   gasPrice: ethers.utils.parseUnits("5", "gwei"),
      // };
      await getWriteContractLoad(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "trade",
        this.activeTabs ? "ETH" : "BTC",
        this.selectedCoin.address,
        ethers.constants.AddressZero,
        this.index ? false : true,
        ethers.utils.parseUnits(this.tradeAmount, 18),

        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeTabs ? "ETH" : "BTC"] *
            (1 - this.slippage / 100)
          ).toString(),
          18
        ),
        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeTabs ? "ETH" : "BTC"] *
            (1 + this.slippage / 100)
          ).toString(),
          18
        ),
        Date.parse(new Date()) / 1000 + this.tradeTime * 60

        // overrides
      )
        .then((res) => {
          this.tradingLoading = false;
          showToast("开仓成功");
          this.tradeAmount = "";
          this.sliderValue = 0;
          this.showTradeSheet = false;
          this.getMaxAmount(this.index);
          this.getAccountInfo();
        })
        .catch((err) => {
          console.log(err);
          showToast("开仓失败");
          this.tradingLoading = false;
          this.showTradeSheet = false;
        });
    },
    setSlippage(value) {
      this.slippageInput = value;
      this.$store.commit("setSlippage", value);
    },

    init() {
      this.brokerPortion();
      this.migrationPeriod();
      this.getFundingFeeRateMatrix();
      this.getTradingFeeRate();
      this.liquidationFeeRate();
      this.getVolume();
    },

    // 查询 broker返佣比例
    async brokerPortion() {
      await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "brokerPortion"
      ).then((res) => {
        console.log("brokerPortion", res.toString());
      });
    },
    // 查询订单展期（结算）频率
    async migrationPeriod() {
      await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "migrationPeriod"
      ).then((res) => {
        console.log("migrationPeriod", res.toString());
      });
    },

    // 查询权利金（Funding Fee）收取比例表
    async getFundingFeeRateMatrix() {
      await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "getFundingFeeRateMatrix"
      ).then((res) => {
        const data = res.map((list) => {
          return ethers.utils.formatUnits(list, 18);
        });
        let total = 0;
        data.map((list) => {
          total += list * 1;
        });
        this.FundingFeeRateMatrix = data;
      });
    },
    // 查询交易手续费率（Trading Fee）
    async getTradingFeeRate() {
      await getContract(
        this.activeTabs
          ? this.$store.state.ETHUnderlyingAssetAddr
          : this.$store.state.BTCUnderlyingAssetAddr,
        underlyingAssetAbi,
        "tradingFeeRate"
      ).then((res) => {
        this.tradingFeeRate = ethers.utils.formatUnits(res, 18);
        console.log(
          "ethers.utils.formatUnits(res, 18)",
          ethers.utils.formatUnits(res, 18)
        );
      });
    },

    // 查询维持保证金率（Maintenance Margin）
    async liquidationFeeRate() {
      await getContract(
        this.$store.state.BTCUnderlyingAssetAddr,
        underlyingAssetAbi,
        "liquidationFeeRate"
      ).then((res) => {
        console.log("liquidationFeeRate", ethers.utils.formatUnits(res, 18));
      });
    },
    // 获取 BTCUSDPrice ETHUSDPrice
    async getUSDPrice() {
      const USDPrice = {};
      await getContract(this.$store.state.BTCUSDPrice, USDPriceAbi, "latestAnswer").then(
        (res) => {
          USDPrice.BTC = (ethers.utils.formatUnits(res, 8) * 1).toFixed(2);
        }
      );
      await getContract(this.$store.state.ETHUSDPrice, USDPriceAbi, "latestAnswer").then(
        (res) => {
          USDPrice.ETH = (ethers.utils.formatUnits(res, 8) * 1).toFixed(2);
        }
      );
      this.USDPrice = USDPrice;
    },

    // 获取24小时交易量
    async getVolume() {
      const url =
        "https://api.thegraph.com/subgraphs/name/garlicwilliam/shield-history-bsc";
      const timeStamp = (Math.round(new Date() / 1000) - 24 * 60 * 60) * 1;
      const name = this.activeTabs ? "ETH" : "BTC";
      const query = `
      {
        trades( where: {name: "${name}", blockTimestamp_gt: ${timeStamp} })  {
            name,
            token,
            number
         },
         closeOrders( where: {name:"${name}", state_not: 0, blockTimestamp_gt: ${timeStamp} })  {
            name,
            token,
            number
         }
      }`;
      const response = await http(url, query);
      const newData = [...response.closeOrders, ...response.trades];

      const groupedByAddress = newData.reduce((acc, obj) => {
        const address = obj.token;
        if (!acc[address]) {
          acc[address] = [];
        }
        acc[address].push(obj);
        return acc;
      }, {});

      const newArr = [];
      for (let key in groupedByAddress) {
        let total = 0;
        groupedByAddress[key].map((list) => {
          total += ethers.utils.formatUnits(list.number, 18) * 1;
        });
        newArr.push({ address: key, value: total });
      }
      console.log("newArr", newArr, this.actions);

      for (let i = 0; i < this.actions.length; i++) {
        this.actions[i].volume = {
          [this.activeTabs ? "ETH" : "BTC"]: (0).toFixed(2),
        };
        for (let j = 0; j < newArr.length; j++) {
          if (this.actions[i].address.toLowerCase() == newArr[j].address.toLowerCase()) {
            this.actions[i].volume = {
              [this.activeTabs ? "ETH" : "BTC"]: (newArr[j].value * 1).toFixed(2),
            };
          }
        }
      }
    },
  },
  watch: {
    async searchValue(value) {
      if (ethers.utils.isAddress(value)) {
        this.loadingList = true;
        const arr = [];
        this.actions.map((info) => {
          if (info.address.toLowerCase() == value.toLowerCase()) {
            arr.push(info);
          }
        });
        this.loadingList = false;
        this.searchActions = arr;
      } else {
        showToast("地址不合法");
        this.searchActions = [];
      }
    },
    tradeAmount() {
      this.tradeReadFun();
    },
    selectedCoin(value) {
      this.getAllowance(value.address);
      this.getMaxAmount(this.index);
      this.getAccountInfo();
      this.getInviters();
      this.$store.commit("setSelectedCoin", value);
    },
    index(value) {
      this.getMaxAmount(value);
    },
    tradeTimeInput(value) {
      this.$store.commit("setTradeTime", value);
    },
    slippageInput(value) {
      this.setSlippage(value);
    },
    activeTabs() {
      this.getVolume();
    },
    actions(value) {
      this.$store.commit("setSelectedList", value);
    },
    showDepositSheet(value) {
      !value && (this.depositValue = "");
    },
  },
};
</script>
<style lang="scss" scoped>
.options {
  height: calc(100vh - 60px);
  overflow: auto;
  .shadow {
    box-shadow: 0 3px 10px #ddd;
  }
  .selectBox {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    .logoBox {
      position: relative;
      .logo {
        width: 30px;
        height: 30px;
      }
      .miniCoin {
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 10px;
        border: 1px solid #333;
        color: #333;
        font-weight: 600;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        background-color: #d5d4d4;
        text-align: center;
        position: absolute;
        bottom: 0;
        right: -15px;
      }
    }

    .info {
      display: flex;
      align-items: center;
      padding: 20px;
      .logoSymbols {
        display: flex;
        align-items: center;
        margin-left: 10px;
        text-align: left;
        .line {
          font-size: 30px;
          margin: 0 4px;
          color: #333;
          line-height: 1;
          padding: 0 2px;
          box-sizing: border-box;
        }
        > div {
          > div:first-child {
            font-weight: 600;
            font-size: 18px;
            color: #333;
          }
          > div:last-child {
            font-size: 12px;
            color: #999;
            line-height: 10px;
          }
        }
      }
    }
    .swap {
      padding-top: 20px;
      padding: 20px;
      color: #999;
      > span {
        padding-right: 4px;
      }
      .name {
        color: #333;
        font-weight: 600;
      }
    }
    button {
      margin-left: auto;
      ::v-deep .van-icon__image {
        width: 0.8em;
        height: 0.8em;
      }
    }
  }
  .selectToken {
    width: 100%;
    font-weight: 600;
    background-color: #fff;
    border-top: 1px solid #f1f1f1;
    .tokenList {
      padding: 0 20px;
      height: 40vh;
      overflow: auto;
      .token-list {
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        border-bottom: 1px solid #f1f1f1;
        .trading {
          font-size: 12px;
          font-weight: 400;
          color: #999;
        }
      }
    }
    .tokenUp {
      padding: 10px 0;
      img {
        width: 30px;
      }
    }
  }

  .klineBox {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;

    .upDown {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }
    .info {
      background-color: #f6f7f9;
      padding: 10px;
      border-radius: 10px;
      margin-top: 10px;
      font-size: 12px;
      > div {
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .chart {
      width: 100%;
      border-radius: 5px;
    }
  }
  .balanceBox {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;

    > div > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      font-weight: 600;
      font-size: 16px;
    }
    .balance {
      font-weight: 600;
      font-size: 50px;
      color: #ffc519;
      margin: 20px 0 10px 0;
    }
    .dashBoard {
      width: 30px;
    }
    .info {
      background-color: #f6f7f9;
      padding: 10px;
      border-radius: 10px;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 30px;

        .miniFont {
          color: #111;
          padding-right: 2px;
          font-weight: 500;
        }
        .maintenance {
          .tips {
            width: 16px;
            height: 16px;
            margin-left: 2px;
          }
        }
      }
    }
    .btnBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        width: 48%;
        height: 40px;
        border-radius: 6px;
        &:first-child {
          background-color: #ffc519;
          border: none;
        }
      }
    }
  }
  .tradeBox {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    font-weight: 400;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      color: #999;
      font-size: 14px;
      img {
        width: 20px;
      }
    }
    .usdPrice {
      color: #ffc519;
      font-weight: 500;
    }
    .tabs {
      > button {
        width: 50%;
        &:first-child {
          border-radius: 0;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          &.active {
            border: 1px solid #15b384;
            box-shadow: 0 0 2px #15b384;
            color: #15b384;
          }
        }
        &:last-child {
          border-radius: 0;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          &.active {
            border: 1px solid #f55858;
            box-shadow: 0 0 2px #f55858;
            color: #f55858;
          }
        }
      }
    }
    .inputBox {
      height: 50px;
      border-bottom: 1px solid #cecdcd;
      margin-bottom: 20px;
      input {
        font-size: 20px;
        color: #333;
        &::placeholder {
          color: #cac8c8;
        }
      }
      button {
        color: #333;
        background-color: #e4e1e1;
        border: none;
        font-weight: 400;
        border-radius: 10px;
      }
    }
    .sliderBox {
      height: 30px;
    }
    .infos {
      font-size: 13px;
      font-weight: 400;
      padding-bottom: 0;
      .info {
        display: flex;
        align-items: center;
        .calculator {
          width: 16px;
          margin-left: 2px;
          padding-bottom: 2px;
        }
      }
    }
    .open {
      width: 100%;
      border-radius: 6px;
      margin-top: 20px;
      color: #fff;
      border: none;
    }
    .long {
      background-color: #15b384;
    }
    .short {
      background-color: #f55858;
    }
  }
  .selectTokenList {
    .content {
      padding: 0 20px;
      border-top: 1px solid #f5f5f5;
      height: 50vh;
      .tabs {
        margin-bottom: 10px;
        ::v-deep .van-tabs__line {
          background-color: #ffc519;
        }
      }
      .search {
        width: 100%;
        padding: 10px;
        height: 40px;
        border: 1px solid #d6d6d6;
        border-radius: 5px;
        font-size: 14px;
        ::v-deep .van-search__content {
          background-color: transparent;
          padding-left: 0;
          .van-field__control--center {
            text-align: left;
          }
        }
        &:focus {
          border: 1px solid #999;
        }
      }
      .lists {
        max-height: calc(50vh - 100px);
        padding: 0 10px;
        overflow: auto;
        .noData {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          color: #333;
          font-weight: 500;
          border-bottom: 1px solid #ebe9e9;
          font-size: 14px;
          .name {
            text-align: left;
            line-height: 16px;
            font-weight: 600;
            div:last-child {
              color: #999;
              font-size: 12px;
              font-weight: 400;
            }
          }
          > div {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }
        }
        .balance {
          font-weight: 600;
        }
      }
    }
  }
}

.depositSheet,
.withdrawSheet {
  .content {
    padding: 20px;
    border-top: 1px solid #f5f5f5;
    .inputBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border: 1px solid #999;
      padding-left: 10px;
      border-radius: 10px;
      overflow: hidden;
      .coinName {
        font-size: 14px;
        font-weight: 500;
      }
      .inputDiv {
        display: flex;
        align-items: center;
      }
      button {
        border: none;
      }
      input {
        height: 38px;
        text-align: right;
        font-size: 14px;
        font-weight: 500;
      }
    }
    .depositBtn {
      width: 100%;
      background-color: #ffc519;
      border: none;
      height: 40px;
      color: #333;
      font-weight: 500;
      font-size: 14px;
      margin: 40px 0;
      border-radius: 10px;
    }
  }
}

.settingsPopover {
  .activeSlippage {
    background-color: #ffc519;
    border: none;
  }
  .inputS {
    font-size: 14px;
    padding-left: 4px;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .closeSettingPopover {
      width: 24px;
      height: 24px;
    }
  }

  .deadline {
    .inputValue {
      font-size: 14px;
      padding-left: 4px;
    }
  }
}

.copyImg {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}

.symbols {
  width: 26px;
  height: 26px;
  line-height: 26px;
  border: 2px solid #333;
  color: #333;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: #d5d4d4;
  text-align: center;
}
.calculatorPopover {
  font-size: 14px;
  .title {
    font-size: 14px;
  }
  .infos {
    > div {
      font-size: 12px;
      line-height: 30px;
    }
  }
  .phaseLists {
    font-size: 12px;
  }
  .nav_title {
    font-size: 12px;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .closeCalculatorPopover {
    width: 20px;
    height: 20px;
  }
  .symbolsBox {
    display: flex;
    align-items: center;
    .symbols {
      width: 20px;
      height: 20px;
    }
  }
}
.maintenancePopover {
  ::v-deep .van-popover__content {
    width: 200px;
    text-align: left;
    padding: 20px 10px;
    font-size: 12px;
    color: #666;
    line-height: 16px;
    .popoverTitle {
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 10px;
      color: #111;
    }
  }
}
.showTradeSheet {
  .content {
    padding: 20px;
    border-top: 1px solid #f5f5f5;
    .nameInfo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .logos {
        display: flex;
        align-items: center;
        img {
          width: 26px;
          height: 26px;
        }
      }
      .name {
        font-weight: 500;
      }
    }
    .infoBox {
      background-color: #f5f5f5;
      border-radius: 5px;
      padding: 10px 20px;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 35px;
        font-size: 14px;
        color: #666;
        > span:first-child {
          color: #111;
        }
      }
    }
    .sure {
      width: 100%;
      margin-top: 20px;
      background-color: #ffc519;
      border-radius: 10px;
      border: none;
      font-size: 14px;
    }
  }
}
.weight {
  font-weight: 500;
  color: #111;
}
.paddingRight {
  padding-right: 2px;
}
.green {
  color: #15b384;
  padding-right: 4px;
  font-weight: 600;
}
.red {
  color: #f55858;
  padding-right: 4px;
  font-weight: 600;
}

::v-deep .ant-slider:hover .ant-slider-dot-active {
  border-color: #ffc519;
}
::v-deep .ant-slider:hover .ant-slider-track {
  background-color: #ffc519;
}
::v-deep .ant-slider .ant-slider-handle:hover::after,
.ant-slider .ant-slider-handle:active::after,
.ant-slider .ant-slider-handle:focus::after {
  box-shadow: 0 0 0 4px #ffc519;
}

::v-deep .ant-slider .ant-slider-handle::after {
  box-shadow: 0 0 0 2px #ffc519;
}

::v-deep .ant-slider .ant-slider-track {
  background-color: #ffc519;
}
::v-deep .ant-slider .ant-slider-dot-active {
  border-color: #ffc519;
}
</style>
