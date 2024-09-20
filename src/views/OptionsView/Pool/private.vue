<template>
  <div class="private">
    <div class="title">
      <div class="imgBox">
        <img
          @click="$router.push('/options/pool')"
          src="../../../assets/img/goBack.png"
          alt=""
        />
      </div>
      <div class="titleText">私池</div>
    </div>
    <div class="contents">
      <div class="nav_title">您的流动性</div>
      <div class="dataList">
        <div v-for="(list, index) in myPrivatePools" :key="index">
          <div class="poolInfo">
            <div class="logos">
              <img
                class="typeLogo"
                :src="
                  list.type == 'ETHUSD'
                    ? require('../../../assets/img/eth.svg')
                    : require('../../../assets/img/btc.svg')
                "
                alt=""
              />
              <div class="symbols">
                {{
                  list.coinInfo.symbol && list.coinInfo.symbol.substring(0, 1)
                }}
              </div>
            </div>
            <div class="coinName">
              <span>{{ list.type }}</span> -
              <span>{{ list.coinInfo.symbol }}</span>
            </div>
            <img
              class="settings"
              @click="settingsPool(list)"
              src="../../../assets/img/settings.png"
              alt=""
            />
          </div>

          <div class="desc">
            <span>可用率</span>
            <span>可用流动性</span>
          </div>
          <div class="poolData">
            <div>100%</div>
            <div>
              <span>{{ list.availableAmount }}</span>
              <span>/{{ list.amount }}</span>
              <span class="coinSymbol">{{ list.coinInfo.symbol }}</span>
            </div>
          </div>
          <div class="progressInfo">
            <van-progress
              :show-pivot="false"
              stroke-width="8"
              color="#ffc519"
              text-color="#333"
              :percentage="(list.availableAmount / list.amount) * 100"
            />
          </div>
          <div
            :class="`btnBox animate__animated animate__bounceIn`"
            v-show="list.showBtn"
          >
            <van-button size="small" @click="addLiqFromPoolList(list)"
              >添加</van-button
            >
            <van-button size="small" @click="deleteLiq(list)">移除</van-button>
          </div>
          <img
            :class="`doubleDown ${list.showBtn && 'rotate'}`"
            @click="showBtnBoxFun(index)"
            src="../../../assets/img/doubleDown.png"
            alt=""
          />
        </div>
        <div v-if="!myPrivatePools.length" class="noData">
          <van-loading v-if="dataLoading" />
          <van-empty
            v-else
            image="search"
            image-size="100"
            description="无数据"
          />
        </div>
      </div>

      <van-button class="addLiqBtn" @click="this.show = true"
        >添加流动性</van-button
      >
    </div>
    <!-- <div class="detail">
      <div class="nav_title">Liquidity Locked Detail</div>
      <div class="detailContent">
        <div class="selectBox">
          <van-button class="selectBtn">
            <div>
              <div></div>
            </div>
            <img src="../../../assets/img/down.png" alt="" />
          </van-button>
          <div class="settle"><span>Settle Funding Fee</span><span>(0)</span></div>
        </div>
        <div class="info">
          <div class="navTitle">Statistics</div>
          <div><span>Total Amount</span><span>0.00</span></div>
          <div><span>Position Loss</span><span>0.00</span></div>
          <div><span>Premium</span><span>0.00</span></div>
          <div><span>PnL</span><span>0.00</span></div>
        </div>
      </div>
    </div> -->
    <van-action-sheet class="addLiq" v-model:show="show" title="添加流动性">
      <div class="content">
        <div class="tradingTitle">选择交易对</div>
        <div class="tradingSelect">
          <van-button
            class="tradingSelectBtn"
            @click="showPicker = true"
            :icon="
              activeUSD
                ? require('../../../assets/img/btc.svg')
                : require('../../../assets/img/eth.svg')
            "
            >{{ column[activeUSD].text }}
            <van-image
              class="downImg"
              width="10"
              height="10"
              :src="require('../../../assets/img/down.png')"
            />
          </van-button>
          <span>-</span>
          <van-button class="tradingSelectBtn" @click="showTokenList = true">
            <span class="selectItem" v-if="selectedCoin.symbol">
              <span class="symbols">
                {{ selectedCoin.symbol && selectedCoin.symbol.substring(0, 1) }}
              </span>
              <span>{{ selectedCoin.symbol }}</span>
            </span>
            <van-image
              class="downImg"
              width="10"
              height="10"
              :src="require('../../../assets/img/down.png')"
          /></van-button>
        </div>

        <div class="tips">
          对于不存在的交易对，添加流动性会自动创建对应的交易对
        </div>
        <div class="selectlist">
          <div>数量</div>
          <div class="inputBox">
            <div>{{ selectedCoin.symbol }}</div>
            <div>
              <input
                v-model="amount"
                type="text"
                :placeholder="`最大 ${
                  selectedCoin.balanceOf ? selectedCoin.balanceOf : ''
                }`"
              />
              <van-button @click="maxFun" class="max">最大</van-button>
            </div>
          </div>
        </div>

        <van-button
          v-if="allowance * 1 == 0"
          :loading="approveLoading"
          class="addLi"
          @click="approve"
          >授权</van-button
        >
        <van-button
          v-else
          :loading="addLiqLoading"
          class="addLi"
          @click="addLiq"
          >添加流动性</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="selectTokenList"
      v-model:show="showTokenList"
      title="选择代币"
    >
      <div class="content">
        <input
          class="search"
          type="text"
          v-model="searchValue"
          placeholder="输入代币地址查询"
        />
        <div class="lists">
          <div v-for="(list, index) in actionsList">
            <div class="list" :key="index" @click="selectList(list)">
              <div>
                <div class="symbols">
                  {{ list.symbol && list.symbol.substring(0, 1) }}
                </div>
                <div class="name">{{ list.symbol }}</div>
                <img
                  class="copyImg"
                  @click.stop="Clipboard(list.address)"
                  src="../../../assets/img/copyUrl.png"
                  alt=""
                />
              </div>
              <div class="balance">{{ list.balanceOf }}</div>
            </div>
          </div>
          <div class="noData" v-if="actionsList.length == 0">
            <van-loading />
          </div>
        </div>
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="poolSettings"
      v-model:show="showSettings"
      title="私池设置"
    >
      <div class="content">
        <div class="headerTitle">
          <div class="logos">
            <img
              :src="
                selectPool.type == 'ETHUSD'
                  ? require('../../../assets/img/eth.svg')
                  : require('../../../assets/img/btc.svg')
              "
              alt=""
            />
            <div class="symbols">
              {{
                selectPool.coinInfo.symbol &&
                selectPool.coinInfo.symbol.substring(0, 1)
              }}
            </div>
          </div>
          <div>{{ selectPool.type }} - {{ selectPool.coinInfo.symbol }}</div>
        </div>
        <div class="privateAddress">
          <span>私池地址</span>
          <div>
            <span>{{ shortStr(selectPool.lpAddress) }}</span>
            <img
              class="copyImg"
              @click="Clipboard(selectPool.lpAddress)"
              src="../../../assets/img/copyUrl.png"
              alt=""
            />
          </div>
        </div>
        <div>
          <span>接单</span>
          <div class="switchBox">
            <span> {{ selectPool.isRejectOrder ? "开启" : "关闭" }}</span>

            <van-switch
              size="20px"
              v-model="selectPool.isRejectOrder"
              active-color="#ffc519"
              inactive-color="#dcdee0"
            />
          </div>
        </div>
        <div>
          <span>作为指定私池</span>
          <div class="switchBox">
            <span>{{ selectPool.isExclusive ? "开启" : "关闭" }}</span>
            <van-switch
              size="20px"
              v-model="selectPool.isExclusive"
              active-color="#ffc519"
              inactive-color="#dcdee0"
            />
          </div>
        </div>
        <van-button
          class="settingConfirm"
          :loading="settingLoading"
          @click="settingConfirmFun"
          >应用设置</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet
      class="deleteLiq"
      v-model:show="showDeleteLiq"
      title="移除流动性"
    >
      <div class="content">
        <div class="headerTitle">
          <div class="logos">
            <img src="../../../assets/img/eth.svg" alt="" />
            <div class="symbols">P</div>
          </div>
          <div>BTCUSD - {{ selectPool.coinInfo.symbol }}</div>
        </div>
        <div class="inputDiv">
          <div>移除数量</div>
          <div class="inputBox">
            <span>{{ selectPool.coinInfo.symbol }}</span>
            <div>
              <input
                class="deleteAmount"
                v-model="deleteAmount"
                type="text"
                :placeholder="`最大 ${
                  selectPool.availableAmount ? selectPool.availableAmount : ''
                }`"
              />
              <van-button @click="deleteMaxFun" class="max">最大</van-button>
            </div>
          </div>
        </div>
        <van-button
          class="deleteConfirm"
          :loading="deleteLoading"
          @click="deleteConfirmFun"
          >移除流动性</van-button
        >
      </div>
    </van-action-sheet>

    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        class="picker"
        :columns="column"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import liquidityManagerAbi from "../../../abi/liquidityManager.json";
import privatePoolAbi from "../../../abi/privatePool.json";
import erc20Abi from "../../../abi/erc20.json";
import {
  copy,
  getContract,
  getWriteContractLoad,
  shortStr,
} from "../../../utils";
import { ethers } from "ethers";
import { showToast } from "vant";

export default {
  name: "private",
  data() {
    return {
      showSettings: false,
      showDeleteLiq: false,
      showPicker: false,
      show: false,
      dataSource: [],
      activeUSD: 0,
      column: [
        { text: "ETHUSD", value: "0", symbol: "ETH" },
        { text: "BTCUSD", value: "1", symbol: "BTC" },
      ],
      selectItem: {},
      actions: [],
      searchActions: [],
      showTokenList: false,
      searchValue: "",
      selectedCoin: {},
      amount: "",
      myPrivatePools: [],
      addLiqLoading: false,
      approveLoading: false,
      allowance: 0,
      selectPool: {},
      settingLoading: false,
      deleteAmount: "",
      deleteLoading: false,
      dataLoading: true,
    };
  },
  computed: {
    actionsList() {
      return this.searchValue ? this.searchActions : this.actions;
    },
  },
  mounted() {
    this.getTokenList();
  },
  methods: {
    shortStr,
    onConfirm(value) {
      this.activeUSD = value.selectedValues[0];
      this.showPicker = false;
    },
    Clipboard(address) {
      console.log(address);
      showToast("复制成功");
      return copy(address);
    },
    selectList(item) {
      this.showTokenList = false;
      this.selectedCoin = item;
      console.log("this.selectedCoin", this.selectedCoin);
    },
    maxFun() {
      this.amount = this.selectedCoin.balanceOf;
    },
    showBtnBoxFun(index) {
      this.myPrivatePools[index].showBtn = !this.myPrivatePools[index].showBtn;
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
      this.actions = newList;
      this.getPrivatePools(tokenList);
    },
    // 获取tokenlist的info
    async getTokenInfo(tokenList) {
      const arr = [];
      for (let i = 0; i < tokenList.length; i++) {
        const tokenInfo = {
          address: tokenList[i],
          name: await getContract(tokenList[i], erc20Abi, "name"),
          symbol: await getContract(tokenList[i], erc20Abi, "symbol"),
          decimals: await getContract(tokenList[i], erc20Abi, "decimals"),
          balanceOf: ethers.utils.formatUnits(
            await getContract(
              tokenList[i],
              erc20Abi,
              "balanceOf",
              this.$store.state.address
            ),
            await getContract(tokenList[i], erc20Abi, "decimals")
          ),
        };
        arr.push(tokenInfo);
      }
      return arr;
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

    // 获取私池信息
    async getPrivatePools(addressList) {
      const contractList = [];
      for (let i = 0; i < addressList.length; i++) {
        for (let j = 0; j < this.column.length; j++) {
          const lpAddress = await getContract(
            this.$store.state.LiquidityManagerAddr,
            liquidityManagerAbi,
            "privatePools",
            addressList[i],
            this.column[j].symbol
          );
          contractList.push({
            address: addressList[i],
            lpAddress,
            type: this.column[j].text,
          });
        }
      }

      console.log("contractList", contractList);
      // 查询当前用户的lp balance 和 totalSupply
      const accounts = [];
      for (let i = 0; i < contractList.length; i++) {
        const { address, lpAddress, type } = contractList[i];
        if (lpAddress !== ethers.constants.AddressZero) {
          const info = await getContract(
            lpAddress,
            privatePoolAbi,
            "account",
            this.$store.state.address
          );
          const decimals = await getContract(address, erc20Abi, "decimals");

          console.log("info", info, decimals);
          if (info.availableAmount.toString() * 1 > 0) {
            const infos = {
              amount: (
                ethers.utils.formatUnits(info.amount, decimals) * 1
              ).toFixed(2),
              availableAmount: (
                ethers.utils.formatUnits(info.availableAmount, decimals) * 1
              ).toFixed(2),
              lockedAmount: (
                ethers.utils.formatUnits(info.lockedAmount, decimals) * 1
              ).toFixed(2),
              marginFee: (
                ethers.utils.formatUnits(info.marginFee, decimals) * 1
              ).toFixed(2),
              isRejectOrder: info.isRejectOrder,
              isExclusive: info.isExclusive,
              type,
              address,
              coinInfo: await this.getERC20Token(address),
              lpAddress,
              showBtn: false,
            };
            accounts.push(infos);
          }
        }
      }
      console.log("accounts", accounts);
      this.dataLoading = false;
      this.myPrivatePools = accounts;
    },

    // 获取授权
    async getAllowance(tokenAddress) {
      const allowance = await getContract(
        tokenAddress,
        erc20Abi,
        "allowance",
        this.$store.state.address,
        this.$store.state.LiquidityManagerAddr
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
        this.$store.state.LiquidityManagerAddr,
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
    // 添加私池流动性
    async addLiq() {
      if (this.amount == "" || this.amount * 1 == 0) {
        return showToast("请输入正确的添加数量");
      }
      if (this.amount * 1 > this.selectedCoin.balanceOf * 1) {
        return showToast("余额不足");
      }
      this.addLiqLoading = true;
      await getWriteContractLoad(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "addLiquidity",
        this.selectedCoin.address,
        this.column[this.activeUSD].symbol,
        true,
        ethers.utils.parseUnits(this.amount, this.selectedCoin.decimals)
      )
        .then(async (res) => {
          showToast("添加流动性成功");
          this.addLiqLoading = false;
          this.selectedCoin = await this.getERC20Token(
            this.selectedCoin.address
          );
          this.getTokenList();
          this.show = false;
        })
        .catch((err) => {
          this.addLiqLoading = false;
          console.log(err);
        });
    },
    settingsPool(list) {
      this.showSettings = true;
      this.selectPool = list;
    },
    deleteLiq(list) {
      this.showDeleteLiq = true;
      this.deleteAmount = "";
      this.selectPool = list;
    },
    addLiqFromPoolList(list) {
      this.show = true;
      this.selectPool = list;
      this.selectedCoin = { ...this.selectPool.coinInfo };
      this.activeUSD = this.selectPool.type == "ETHUSD" ? 0 : 1;
    },
    // 设置提交
    async settingConfirmFun() {
      this.settingLoading = true;
      await getWriteContractLoad(
        this.selectPool.lpAddress,
        privatePoolAbi,
        "setMakerInfo",
        this.selectPool.isRejectOrder ? true : false,
        this.selectPool.isExclusive ? true : false
      )
        .then((res) => {
          showToast("设置流动性成功");
          this.settingLoading = false;
          this.showSettings = false;
          this.getTokenList();
        })
        .catch((err) => {
          this.settingLoading = false;
          this.showSettings = false;
          console.log(err);
        });
    },
    // 最大值
    deleteMaxFun() {
      this.deleteAmount = this.selectPool.availableAmount;
    },
    // 移除流动性
    async deleteConfirmFun() {
      if (this.deleteAmount * 1 > this.selectPool.availableAmount * 1) {
        return showToast("余额不足");
      }
      if (this.deleteAmount == "" || this.deleteAmount * 1 == 0) {
        return showToast("请输入正确的移除数量");
      }
      this.deleteLoading = true;
      await getWriteContractLoad(
        this.selectPool.lpAddress,
        privatePoolAbi,
        "withdraw",
        ethers.utils.parseUnits(
          this.deleteAmount,
          this.selectPool.coinInfo.decimals.toString()
        )
      )
        .then((res) => {
          this.getTokenList();
          showToast("移除流动性成功");
          this.deleteLoading = false;
          this.showDeleteLiq = false;
        })
        .catch((err) => {
          this.deleteLoading = false;
          this.showDeleteLiq = false;
          console.log(err);
        });
    },
  },
  watch: {
    async searchValue(value) {
      if (ethers.utils.isAddress(value)) {
        const arr = [];
        this.actions.map((info) => {
          if (info.address.toLowerCase() == value.toLowerCase()) {
            arr.push(info);
          }
        });
        if (!arr.length) {
          arr.push(await this.getERC20Token(value));
        }
        this.searchActions = arr;
      } else {
        showToast("地址不合法");
        this.searchActions = [];
      }
    },
    selectedCoin(value) {
      this.getAllowance(value.address);
    },
    show() {
      this.amount = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.private {
  height: calc(100vh - 60px);
  overflow: auto;
  .title {
    font-size: 20px;

    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .imgBox {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 20px;
      top: 10px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .contents {
    width: 92%;
    margin: 20px auto;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px 0;
    .nav_title {
      font-size: 16px;
      border-bottom: 1px solid #f1f1f1;
      padding-bottom: 20px;
    }
    .dataList {
      min-height: 200px;
      > div {
        padding: 20px;
        border-bottom: 1px solid #f5f5f5;

        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;

          margin-bottom: 10px;
        }
      }
      .poolInfo {
        .logos {
          display: flex;
          align-items: center;
          .typeLogo {
            width: 26px;
            height: 26px;
          }
        }
        .coinName {
          span {
          }
        }
        .settings {
          width: 20px;
          height: 20px;
          margin-left: auto;
        }
      }
      .desc {
        color: #999;

        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 12px;
      }
      .poolData {
        > div:first-child {
          color: #ffc519;
        }
        .coinSymbol {
          color: #999;
          margin-left: 4px;
          font-size: 12px;
        }
      }
      .progressInfo {
        .van-progress {
          width: 100%;
        }
      }
      .btnBox {
        justify-content: space-around;
        background-color: #f6f7f9;
        padding: 20px 0;
        border-radius: 10px;
        button {
          width: 40%;
          border-radius: 6px;
          &:first-child {
            background-color: #ffc519;
            border: none;
          }
        }
      }
      .doubleDown {
        width: 16px;
        height: 16px;
      }
      .rotate {
        transform: rotate(180deg);
      }
    }
    .addLiqBtn {
      width: 80%;
      margin: 0 auto;
      background-color: #ffc519;
      border: none;
      font-size: 14px;

      border-radius: 10px;
      margin-top: 20px;
    }
  }
  .detail {
    width: 92%;
    margin: 80px auto;
    .nav_title {
      font-size: 18px;
      text-align: left;
      padding-bottom: 20px;
    }
    .detailContent {
      background-color: #fff;
      border-radius: 10px;
    }
    .selectBox {
      padding: 20px;
      .selectBtn {
        width: 100%;
        margin: 0 auto 20px auto;

        img {
          width: 16px;
          height: 16px;
        }
        ::v-deep .van-button__text {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            display: flex;
            align-items: center;

            font-size: 16px;
          }
        }
      }
      .settle {
        width: 100%;
        height: 40px;
        border: 1px solid #ffc519;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background-color: #fdfbfb;
        color: #ffc519;
      }
    }
    .info {
      border-top: 1px solid #f1f1f1;
      padding: 20px;
      .navTitle {
        text-align: left;
        font-size: 14px;
        color: #333;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        color: #999;
        font-size: 12px;
      }
    }
  }
}

.addLiq {
  .content {
    padding: 20px;
    overflow: hidden;
  }

  .nav_title {
    text-align: left;
  }

  .tradingTitle {
    text-align: left;

    font-size: 14px;
  }
  .tradingSelect {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    .tradingSelectBtn {
      width: 40%;

      position: relative;
      ::v-deep .van-button__content {
        justify-content: flex-start;
        line-height: 1;
      }
      .selectItem {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .downImg {
        position: absolute;
        top: 15px;
        right: 10px;
      }
    }
  }
  .tips {
    background-color: #fffaee;
    border: 1px solid #faeedb;
    border-radius: 8px;
    color: #999;
    padding: 8px 16px;
    text-align: left;
    font-size: 14px;
  }
  .selectlist {
    > div:first-child {
      text-align: left;

      font-size: 14px;
      margin-top: 30px;
    }
    .inputBox {
      margin-top: 10px;
      height: 40px;
      border: 1px solid #999;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 10px;

      font-size: 14px;
      > div {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      input {
        width: 60%;
        height: 38px;
        text-align: right;
      }
      .max {
        height: 30px;
        border: none;
      }
    }
    .noDatas {
      width: 100%;
      height: 100px;
      border: 1px solid #cfcdcd;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }
  }
  .addLi {
    width: 100%;
    height: 40px;
    margin-top: 40px;
    background-color: #ffc519;
    color: #333;

    border: none;
    font-size: 14px;
    border-radius: 10px;
  }
}

.selectTokenList {
  .content {
    padding: 20px;
    .search {
      width: 100%;
      padding: 10px;
      height: 40px;
      border: 1px solid #d6d6d6;
      border-radius: 5px;
      margin-bottom: 20px;
      font-size: 14px;
      &:focus {
        border: 1px solid #999;
      }
    }
    .lists {
      border-top: 1px solid #d6d6d6;
      max-height: calc(60vh - 120px);
      overflow: auto;
      .noData {
        height: 200px;
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

        border-bottom: 1px solid #ebe9e9;
        font-size: 14px;
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
      }
    }
  }
}

::v-deep .van-ellipsis {
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

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: #d5d4d4;
  text-align: center;
}
::v-deep .van-icon__image {
  width: 1.5em;
  height: 1.5em;
}
.noData {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: none !important;
}
.poolSettings,
.deleteLiq {
  .content {
    padding: 20px;
    font-size: 14px;
    border-top: 1px solid #f5f5f5;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .headerTitle {
      justify-content: center;

      .logos {
        display: flex;
        align-items: center;
        img {
          width: 26px;
        }
      }
    }
    .privateAddress {
      > div {
        display: flex;
        align-items: center;
        .copyImg {
          width: 15px;
          height: 15px;
        }
      }
    }
    .switchBox {
      display: flex;
      align-items: center;
      > span {
        padding-right: 4px;
      }
    }
    .inputDiv {
      display: inherit;
      text-align: left;
    }
    .inputBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #999;
      margin-top: 10px;
      height: 40px;
      border-radius: 10px;
      padding-left: 10px;

      overflow: hidden;
      > div {
        display: flex;
        align-items: center;
      }
      .deleteAmount {
        height: 38px;
        text-align: right;
        padding-right: 4px;
      }
      .max {
        height: 38px;
        border: none;
      }
    }
    .settingConfirm,
    .deleteConfirm {
      width: 100%;
      margin-top: 10px;
      background-color: #ffc519;
      border: none;

      border-radius: 10px;
    }
  }
}
::v-deep .van-picker__confirm {
  color: #ffc519;
}
</style>
