<template>
  <div class="public">
    <div class="title">
      <div class="imgBox">
        <img
          @click="$router.push('/options/pool')"
          src="../../../assets/img/goBack.png"
          alt=""
        />
      </div>
      <div class="titleText">公池</div>
    </div>
    <div class="addLi">
      <div class="nav_title">添加流动性</div>
      <div class="selectText">选择代币</div>
      <van-button class="selectBtn" @click="show = true">
        <div>
          <div v-if="selectedCoin.symbol">
            <div class="symbols">
              {{ selectedCoin.symbol && selectedCoin.symbol.substring(0, 1) }}
            </div>
            <div>{{ selectedCoin.symbol }}</div>
          </div>
          <div v-else class="selectTokenTitle">选择代币</div>
        </div>
        <img src="../../../assets/img/down.png" alt="" />
      </van-button>
      <div class="tips">
        对于不存在的交易对，添加流动性会自动创建对应的交易对
      </div>
      <div class="amount">
        <span>数量</span>
        <span
          >{{
            selectedCoin.balanceOf && (selectedCoin.balanceOf * 1).toFixed(2)
          }}
          {{ selectedCoin.symbol }}</span
        >
      </div>
      <div class="inputBalance">
        <span class="coinName">{{ selectedCoin.symbol }}</span>
        <div>
          <input v-model="inputValue" type="text" placeholder="MAX 0" />
          <van-button @click="maxFun">MAX</van-button>
        </div>
      </div>
      <van-button
        :loading="approveLoading"
        v-if="allowance * 1 == 0"
        @click="approve"
        class="addBtn"
        >授权</van-button
      >
      <van-button :loading="addLiqLoading" v-else class="addBtn" @click="addLiq"
        >添加流动性</van-button
      >
    </div>
    <div class="shareBox">
      <div class="nav_title">您在池中的份额</div>
      <div class="content">
        <div class="tokenList">
          <div v-for="(list, index) in myPublicPools" :key="index">
            <div class="listInfo">
              <div>
                <span class="symbols">{{
                  list.addressSymbol && list.addressSymbol.substring(0, 1)
                }}</span>
                <span> {{ list.addressSymbol }}</span>
                <img
                  @click="Clipboard(list.address)"
                  class="copyImg"
                  src="../../../assets/img/copyUrl.png"
                  alt=""
                />
              </div>
              <div>
                1re{{ list.addressSymbol }} =
                {{ list.tokenAmountByLPToken * 1 }}
                {{ list.addressSymbol }}
              </div>
            </div>
            <div class="progress">
              <div class="progressInfo">
                <span
                  >{{
                    ((list.balance / list.totalSupply) * 100).toFixed(2)
                  }}%</span
                >
                <span>
                  <span
                    >{{ list.balance }}/{{
                      formatNumber(list.totalSupply, 2)
                    }}</span
                  >
                  <span style="color: #999; padding-left: 2px"
                    >{{ list.symbol }}
                  </span>
                </span>
              </div>
              <van-progress
                :show-pivot="false"
                stroke-width="8"
                color="#ffc519"
                text-color="#333"
                :percentage="(list.balance / list.totalSupply) * 100"
              />
              <van-button
                class="deleteLiqBtn"
                type="primary"
                size="small"
                @click="deleteLiqFun(list)"
                >移除</van-button
              >
            </div>
          </div>
        </div>
        <div v-if="!myPublicPools.length" class="noData">
          <van-loading v-if="dataLoading" />
          <van-empty
            v-else
            image="search"
            image-size="100"
            description="无数据"
          />
        </div>
      </div>
    </div>

    <van-action-sheet class="selectToken" v-model:show="show">
      <div class="content">
        <div class="nav_title">选择代币</div>
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
      class="deleteLiq"
      v-model:show="deleteAction"
      title="移除流动性"
    >
      <div class="content">
        <div class="logoInfo">
          <div class="symbols">
            {{
              deleteLiqItem.addressSymbol &&
              deleteLiqItem.addressSymbol.substring(0, 1)
            }}
          </div>
          <div>{{ deleteLiqItem.addressSymbol }}</div>
        </div>
        <div class="deleteLiqTitle">移除数量</div>
        <div class="inputBox">
          <div>{{ deleteLiqItem.symbol }}</div>
          <div class="inputDiv">
            <input type="text" v-model="deleteValue" />
            <van-button @click="maxDeleteFun">最大</van-button>
          </div>
        </div>
        <div class="receipt">
          <span>你将接收到</span>
          <span
            >{{ realDeleteTokenAmount }} {{ deleteLiqItem.addressSymbol }}</span
          >
        </div>
        <van-button
          :loading="withdrawLoading"
          class="deleteBtn"
          @click="withdrawFun"
          >移除流动性</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import liquidityManagerAbi from "../../../abi/liquidityManager.json";
import publicPoolAbi from "../../../abi/publicPool.json";
import erc20Abi from "../../../abi/erc20.json";
import {
  copy,
  getContract,
  getWriteContractLoad,
  formatNumber,
} from "../../../utils";
import { ethers } from "ethers";
import { showToast } from "vant";

export default {
  name: "public",
  data() {
    return {
      show: false,
      deleteAction: false,
      actions: [],
      coinName: "100T",
      inputValue: "",
      searchValue: "",
      searchActions: [],
      selectedCoin: { symbol: "", name: "", address: "", balanceOf: 0 },
      allowance: 0,
      addLiqLoading: false,
      approveLoading: false,
      myPublicPools: [],
      deleteLiqItem: {},
      deleteValue: "",
      realDeleteTokenAmount: "",
      withdrawLoading: false,
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
    formatNumber,
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
      if (this.$store.state.tokenList.length > 0) {
        this.actions = this.$store.state.tokenList;
      }
      const newList = await this.getTokenInfo(tokenList);
      this.actions = newList;

      this.$store.commit("setTokenList", newList);

      this.getPublicPools(tokenList);
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
    selectList(item) {
      this.show = false;
      this.selectedCoin = item;
    },
    maxFun() {
      this.inputValue = this.selectedCoin.balanceOf;
    },
    Clipboard(address) {
      showToast("复制成功");
      return copy(address);
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
        this.$store.state.LiquidityManagerAddr
      );
      this.allowance = allowance.toString();
    },
    // 授权
    async approve() {
      if (!this.selectedCoin.address) {
        return showToast("请选择要授权的代币");
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
    // 添加公池流动性
    async addLiq() {
      if (this.inputValue == "" || this.inputValue * 1 == 0) {
        return showToast("请输入正确的添加数量");
      }
      if (this.inputValue * 1 > this.selectedCoin.balanceOf * 1) {
        return showToast("余额不足");
      }
      this.addLiqLoading = true;
      console.log(
        "this.selectedCoin.decimals",
        this.selectedCoin.decimals.toString()
      );

      await getWriteContractLoad(
        this.$store.state.LiquidityManagerAddr,
        liquidityManagerAbi,
        "addLiquidity",
        this.selectedCoin.address,
        "ETH",
        false,
        ethers.utils.parseUnits(
          this.inputValue,
          this.selectedCoin.decimals.toString()
        )
      )
        .then(async (res) => {
          showToast("添加流动性成功");
          this.addLiqLoading = false;
          this.selectedCoin = await this.getERC20Token(
            this.selectedCoin.address
          );
          this.getTokenList();
        })
        .catch((err) => {
          this.addLiqLoading = false;
          console.log(err);
        });
    },

    // 查询公池合约地址
    async getPublicPools(addressList) {
      const contractList = [];
      for (let i = 0; i < addressList.length; i++) {
        await getContract(
          this.$store.state.LiquidityManagerAddr,
          liquidityManagerAbi,
          "publicPools",
          addressList[i]
        )
          .then((lpAddress) => {
            contractList.push({ address: addressList[i], lpAddress });
          })
          .catch((err) => console.log(err));
      }
      console.log("contractList", contractList);
      // 查询当前用户的lp balance 和 totalSupply
      const accounts = [];
      for (let i = 0; i < contractList.length; i++) {
        const { address, lpAddress } = contractList[i];
        if (lpAddress !== ethers.constants.AddressZero) {
          const balance = await getContract(
            lpAddress,
            erc20Abi,
            "balanceOf",
            this.$store.state.address
          );

          console.log("balance", balance);

          if (balance.toString() * 1 > 0) {
            const accountInfo = {
              address: address,
              addressSymbol: await getContract(address, erc20Abi, "symbol"),
              decimals: await getContract(address, erc20Abi, "decimals"),
              lpAddress: lpAddress,
              symbol: await getContract(lpAddress, erc20Abi, "symbol"),
              tokenAmountByLPToken: (
                ethers.utils.formatUnits(
                  await getContract(
                    lpAddress,
                    publicPoolAbi,
                    "getTokenAmountByLPToken",
                    ethers.utils.parseUnits(
                      "1",
                      await getContract(address, erc20Abi, "decimals")
                    )
                  ),
                  await getContract(address, erc20Abi, "decimals")
                ) * 1
              ).toFixed(6),
              balance: (
                ethers.utils.formatUnits(
                  await getContract(
                    lpAddress,
                    erc20Abi,
                    "balanceOf",
                    this.$store.state.address
                  ),
                  await getContract(address, erc20Abi, "decimals")
                ) * 1
              ).toFixed(2),
              realBalance: ethers.utils.formatUnits(
                await getContract(
                  lpAddress,
                  erc20Abi,
                  "balanceOf",
                  this.$store.state.address
                ),
                await getContract(address, erc20Abi, "decimals")
              ),

              totalSupply: (
                ethers.utils.formatUnits(
                  await getContract(lpAddress, erc20Abi, "totalSupply"),
                  await getContract(address, erc20Abi, "decimals")
                ) * 1
              ).toFixed(2),
            };
            accounts.push(accountInfo);
          }
        }
      }
      console.log("accounts", accounts);
      this.dataLoading = false;
      this.myPublicPools = accounts;
    },

    // 点击移除逻辑
    deleteLiqFun(list) {
      this.deleteAction = true;
      this.deleteLiqItem = list;
      this.deleteValue = list.realBalance;
    },
    // 点击最大值逻辑
    maxDeleteFun() {
      this.deleteValue = this.deleteLiqItem.realBalance;
    },

    // 移除操作
    async withdrawFun() {
      if (this.deleteValue == "" || this.deleteValue * 1 == 0) {
        return showToast("请输入正确的移除数量");
      }

      if (this.deleteValue * 1 > this.deleteLiqItem.realBalance * 1) {
        return showToast("余额不足");
      }
      this.withdrawLoading = true;
      await getWriteContractLoad(
        this.deleteLiqItem.lpAddress,
        publicPoolAbi,
        "withdraw",
        ethers.utils.parseUnits(this.deleteValue, this.deleteLiqItem.decimals)
      )
        .then(async (res) => {
          showToast("移除流动性成功");
          this.withdrawLoading = false;
          this.deleteAction = false;
          this.getTokenList();
        })
        .catch((err) => {
          this.withdrawLoading = false;
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
    deleteValue(value) {
      this.realDeleteTokenAmount =
        value * this.deleteLiqItem.tokenAmountByLPToken;
    },
    show(value) {
      if (!value) {
        this.searchValue = "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.public {
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
  .addLi {
    width: 90%;
    margin: 20px auto;
    border-radius: 10px;
    background-color: #fff;
    .nav_title {
      font-size: 16px;
      border-bottom: 1px solid #f1f1f1;
      height: 50px;
      line-height: 50px;
    }
    .selectText {
      padding: 20px;
      padding-bottom: 10px;
      text-align: left;

      font-size: 14px;
    }
    .selectBtn {
      width: 90%;
      margin: 0 auto 20px auto;

      img {
        width: 10px;
        height: 10px;
      }
      ::v-deep .van-button__text {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div > div {
          display: flex;
          align-items: center;

          font-size: 14px;
        }
      }
      .selectTokenTitle {
        color: #999;
        font-size: 12px !important;
        font-weight: 400 !important;
      }
    }
    .tips {
      width: 92%;
      color: #999;
      text-align: left;
      padding: 10px;
      margin: 0 auto;
      background-color: #fffaee;
      border: 1px solid #faeedb;
      border-radius: 8px;
      line-height: 20px;
      font-size: 14px;
    }
    .amount {
      text-align: left;

      font-size: 14px;
      padding: 20px 20px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span:last-child {
        color: #666;
        font-size: 14px;
      }
    }
    .inputBalance {
      width: 90%;
      margin: 0 auto;
      border: 1px solid #999;
      font-size: 14px;

      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 10px;
      overflow: hidden;
      > div {
        display: flex;
        align-items: center;
      }
      input {
        text-align: right;
        max-width: 200px;
      }
      button {
        border: none;
      }
      .coinName {
      }
    }
    .addBtn {
      width: 90%;
      margin: 30px auto;
      font-size: 14px;

      border-radius: 6px;
      border: none;
      background-color: #ffc519;
    }
  }
  .shareBox {
    width: 90%;
    margin: 30px auto;
    border-radius: 10px;
    background-color: #fff;
    .nav_title {
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #f1f1f1;
    }
    .content {
      min-height: 100px;
      .noData {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .tokenList {
        > div {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .listInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;

          font-size: 14px;
          > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          > div:last-child {
            background: rgb(241, 243, 243);
            font-size: 12px;
            padding: 6px;
            border-radius: 10px;
          }
        }
        .progress {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-top: 30px;
          position: relative;
          .progressInfo {
            width: 85%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: absolute;
            top: 0px;
            right: 15%;
            font-size: 12px;
            color: #666;

            > span {
              color: #333;
              font-size: 14px;
            }
            > span:first-child {
              color: #ffc519;
            }
          }
          .van-progress {
            width: 85%;
          }
          .deleteLiqBtn {
            background-color: #ffc519;
            color: #333;
            border: none;
          }
        }
      }
    }
  }
}
.selectToken {
  .content {
    padding: 20px;
    height: 60vh;
    padding: 20px;
    overflow: hidden;
    .nav_title {
      text-align: left;
    }
    .search {
      width: 100%;
      padding: 10px;
      height: 40px;
      border: 1px solid #d6d6d6;
      border-radius: 5px;
      margin: 20px 0;
      font-size: 14px;

      &::placeholder {
        color: #999;
      }
      &:focus {
        border: 1px solid #999;
      }
    }
    .lists {
      border-top: 1px solid #d6d6d6;
      max-height: calc(60vh - 120px);

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

::v-deep .van-action-sheet__header {
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  padding-left: 20px;
}
.deleteLiq {
  height: 30vh;
  .content {
    padding: 20px;
    font-size: 14px;
    .logoInfo {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 16px;
      line-height: 1;
      margin-bottom: 20px;
    }
    .deleteLiqTitle {
      font-size: 14px;
    }
    .inputBox {
      width: 100%;
      height: 40px;
      margin: 10px 0;
      border: 1px solid #999;
      border-radius: 6px;
      overflow: hidden;
      padding-left: 10px;

      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .inputDiv {
        input {
          height: 38px;
          text-align: right;
          margin-right: 10px;
        }
      }
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .deleteBtn {
      margin-top: 40px;
      width: 100%;
      background-color: #ffc519;
      border: none;
    }
    .receipt {
      color: #666;
      font-size: 12px;
    }
  }
}

.copyImg {
  width: 15px;
  height: 15px;
  margin-left: 6px;
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
</style>
