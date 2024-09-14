<template>
  <div class="kolIndex">
    <div class="header">
      <span v-if="!accountInfo.status">KOL认证 — 社交账户</span>
      <div v-else>
        <span v-if="!activeAmount">KOL认证 — 质押SBTC</span>
        <span v-if="activeAmount">KOL认证 — 成为项目方</span>
      </div>
    </div>
    <div v-if="!accountInfo" class="kolRequest">
      <div>
        <span><span class="must">*</span>收益地址</span>
        <input disabled type="text" :value="registerAddress" />
      </div>
      <div>
        <span><span class="must">*</span>Twitter地址</span>
        <input type="text" v-model="xAddress" />
      </div>
      <div class="desc">
        发布Twitter认证推文，包含SmartBTC、SBTC和想认领的铭文项目信息，文案自定义，主要考察该推文24小时阅读数、转发数和点赞数。
      </div>
      <div>
        <span>Telegram地址</span>
        <input type="text" v-model="tgAddress" />
      </div>
      <div>
        <span>Discord地址</span>
        <input type="text" v-model="disAddress" />
      </div>

      <van-button @click="register">提交认证</van-button>
      <div class="desc mt-20">
        KOL贡献分配权重计算方法：初始权重主要取决于社交账户总粉丝数、认证推文24小时活跃度和实际质押的SBTC数量这三大维度，运营中不定期抓取认证社交账户（Twitter为主，Telegram、Discord为辅）对认领铭文项目和SmartBTC平台的关注与推广数据，根据算法提高KOL贡献分配权重。
      </div>
    </div>
    <div v-if="accountInfo.status === 0" class="kolRequest">
      <div>
        <span>收益地址</span>
        <span>{{ shortStr(accountInfo.address) }}</span>
      </div>
      <div>
        <span>Twitter地址</span>
        <span>{{ accountInfo.twitter_account }}</span>
      </div>
      <van-button disabled>KOL审核中...</van-button>
    </div>
    <div v-if="[1].includes(accountInfo.status)" class="activeBtnBox">
      <van-button
        v-if="!activeAmount"
        class="activeBtn"
        size="small"
        @click="openActiveModal(item)"
        >去质押</van-button
      >
      <div v-else class="inputSearch">
        <input
          class="searchBox"
          type="text"
          v-model="searchValue"
          placeholder="输入项目名称搜索"
          @change="searchValueFun"
        />
        <router-link to="/kolAdd" class="addBtn">
          <van-button class="activeBtn" size="small">发起项目</van-button>
        </router-link>
      </div>

      <div v-if="!activeAmount" class="desc mt-10">
        认领和创建项目前，需要质押SBTC，数量2100个起，质押越多，分配权重越高，可以随时撤销质押。
      </div>
      <div v-else class="desc mt-10">
        推荐新的铭文项目，在SmartBTC BRC20
        Launchpad发起投票，7天内满100个有效投票，即获得上市资格并自动部署相关合约，同时完成KOL绑定为项目方，自动获得该项目的社区空投。
      </div>
    </div>

    <div v-if="accountInfo.status === 1" class="listBoxs">
      <div v-if="searchList.length">
        <div v-for="(item, index) in searchList" class="list" :key="index">
          <div>
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ item.name }}</span>
          </div>
          <div>
            <van-button size="small" :disabled="!activeAmount" @click="openModel(item)"
              >认领</van-button
            >
          </div>
        </div>
      </div>

      <div v-else class="noData">
        <div>
          <img src="../../assets/img/noData.png" />
          <div>暂无数据</div>
        </div>
      </div>
    </div>
    <div v-if="accountInfo !== '' && ![0, 1].includes(accountInfo.status)">
      <div class="hadPro">
        <div class="hadProList">
          <div>
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ accountInfo?.project_name?.split("100T-")[1] }}</span>
          </div>
          <div class="tips">{{ getStatus(accountInfo.status) }}</div>
        </div>
      </div>
    </div>

    <van-action-sheet class="model" v-model:show="model" title="认领规则">
      <div class="content">
        <div class="contentDesc">
          <p>
            1、原则上，KOL应保持常态通过Twitter、Telegram等社交网络，或组织线下活动等方式，积极参与某铭文项目的推广布道，才能认领成为该项目的社区KOL（项目方）；
          </p>
          <p>
            2、提交认领时，SmartBTC.io会多维度测算KOL的质押SBTC数量、社交账户活跃度、认证推文阅读点赞转发数、社交账户历史动态与项目的关联度、认领地址项目代币持仓数量等综合因素，通过算法自动测算出当前KOL对应的社区空投奖励分配权重；
          </p>
          <p>
            3、一个KOL（对应认证的钱包地址）只能唯一认领一个项目，且认领完成不可更改；
          </p>
          <p>
            4、可以随时撤销认领，解除收回质押的SBTC，一经解除KOL权益即时终止且不可申请复效；
          </p>
          <p>
            5、认领完成后，KOL应保持对该项目的推广布道，积极参与社区建设，SmartBTC.io平台算法不定期根据KOL多维度动态数据调整其空投奖励分配权益，并对长时间不参与社区建设的KOL暂停或终止分配权益。
          </p>
        </div>
        <van-button
          :loading="reserveLoading"
          class="modelBtn"
          size="small"
          @click="bindProject(selectedItem.project_name)"
          >我已阅读并认可认领规则，同意认领此项目</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet class="model" v-model:show="activeModal" title="质押SBTC">
      <div class="content">
        <div class="balanceBox">余额：{{ sBtcBalance }} SBTC</div>
        <div class="inputBox">
          <input
            v-model="depositAmount"
            type="text"
            :placeholder="`请输入质押数量 >= ${minDeposit} sBTC`"
            @change="changeDepositAmount"
          />
          <button size="small" @click="maxFun">最大</button>
        </div>
        <van-button
          v-if="!allowance"
          :loading="approveLoading"
          class="modelBtn"
          size="small"
          @click="approveActive()"
          >去授权</van-button
        >
        <van-button
          v-else
          :loading="activeLoading"
          class="modelBtn"
          size="small"
          @click="userDeposit()"
          >去质押</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { showToast } from "vant";
import erc20ABI from "../../abi/erc20.json";
import { ethers } from "ethers";
import {
  formatDate,
  shortStr,
  getContract,
  getWriteContract,
  getWriteContractLoad,
} from "@/utils";
import kolAbi from "../../abi/kol.json";

export default {
  name: "kol",
  data() {
    return {
      kol: 2,
      claim: 3,
      address: this.$store.state.address,
      registerAddress: "",
      xAddress: "",
      tgAddress: "",
      disAddress: "",
      accountInfo: "",
      projectVotingList: [],
      timer: null,
      projectIssuedList: [],
      reserveInfo: {},
      model: false,
      reserveLoading: false,
      selectedItem: {},
      tokenId: "",
      activeModal: false,
      activeAmount: 0,
      activeLoading: false,
      approveLoading: false,
      allowance: 0,
      sBtcBalance: 0,
      depositAmount: "",
      sBtcDecimals: "18",
      minDeposit: "",
      searchValue: "",
      searchList: "",
    };
  },
  mounted() {
    this.getInfo();
    this.getProjectIssuedList();
    this.registerAddress = shortStr(this.address);
    this.getActiveAmount();
    this.getBalance();
    this.minDepositFun();

    this.timer = setInterval(() => {
      this.getInfo();
      // this.getProjectIssuedList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    shortStr,
    formatDate,
    getStatus(status) {
      switch (status) {
        case 1:
          return "认证通过";
        case 2:
          return "已认领或创建项目,审核中。。。";
        case 3:
          return "待执行合约设置kol";
        case 4:
          return "kol合约已执行";
        case 5:
          return "项目kol已生效";
        case 6:
          return "项目kol设置执行失败";
        case 7:
          return "认证审核未通过";
        case 8:
          return "项目kol设置为失效";
        default:
          return "";
      }
    },
    /**
     * 0: 认证未审核,
     * 1: 认证通过，未认领项目
     * 2.已认领项目,未生效
     * 3.待执行合约设置kol
     * 4.项目kol已生效
     * 5.项目kol设置执行失败
     * 6.项目kol设置为失效
     * 7.认证审核未通过
     */
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;
        })
        .catch((err) => {
          this.accountInfo = "";
          console.log(err);
        });
    },
    register() {
      if (!ethers.utils.isAddress(this.address)) {
        return showToast("请填写正确的钱包地址");
      }
      if (this.xAddress == "") {
        return showToast("请填写正确的X地址");
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.address,
          twitter_account: this.xAddress,
          tg_account: this.tgAddress,
          discord_account: this.disAddress,
        })
        .then((res) => {
          showToast("已提交认证申请");
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bindProject(project_name) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/bind_project", {
          kol_address: this.$store.state.address,
          project_name: project_name,
        })
        .then((res) => {
          showToast("认领成功");
          this.model = false;
        })
        .catch((err) => {
          showToast(err.message);
          console.log(err);
        });
    },
    getProjectIssuedList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_issued_list")
        .then((res) => {
          this.projectIssuedList = res.data.data;
          this.searchList = this.projectIssuedList;

          const reserveInfo = this.projectIssuedList.filter(
            (list) => list.project_name == this.accountInfo.project_name
          );
          this.reserveInfo = reserveInfo[0];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    openModel(item) {
      this.model = true;
      this.selectedItem = item;
    },

    async getBalance() {
      const decimals = await getContract(this.$store.state.sBtc, erc20ABI, "decimals");
      this.sBtcDecimals = decimals.toString();
      const balance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      this.sBtcBalance = ethers.utils.formatUnits(balance, decimals) * 1;
    },

    async getActiveAmount() {
      const res = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = res.toString() * 1;

      const allowance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.kolAddress
      );
      this.allowance = allowance.toString() * 1;
    },

    approveActive() {
      this.approveLoading = true;
      getWriteContractLoad(
        this.$store.state.sBtc,
        erc20ABI,
        "approve",
        this.$store.state.kolAddress,
        ethers.constants.MaxUint256
      )
        .then((res) => {
          console.log(res);
          this.approveLoading = false;
          this.getActiveAmount();
        })
        .catch((err) => {
          console.log(err);
          this.approveLoading = false;
        });
    },
    maxFun() {
      this.depositAmount = this.sBtcBalance;
    },

    changeDepositAmount(e) {
      this.depositAmount = e.target.value;
    },

    async minDepositFun() {
      const decimals = await getContract(this.$store.state.sBtc, erc20ABI, "decimals");
      const minDeposit = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "minDeposit"
      );
      this.minDeposit = ethers.utils.formatUnits(minDeposit, decimals) * 1;
    },
    userDeposit() {
      if (this.depositAmount * 1 < this.minDeposit * 1)
        return showToast(`质押金额必须大于等于${this.minDeposit}sBTC`);
      if (this.depositAmount * 1 > this.sBtcBalance * 1) return showToast("余额不足");
      this.activeLoading = true;
      getWriteContractLoad(
        this.$store.state.kolAddress,
        kolAbi,
        "userDeposit",
        ethers.utils.parseUnits(this.depositAmount.toString(), this.sBtcDecimals)
      )
        .then((res) => {
          console.log(res);
          this.activeLoading = false;
          this.activeModal = false;
          showToast("质押成功");
          this.getActiveAmount();
        })
        .catch(() => {
          this.activeLoading = false;
        });
    },

    openActiveModal(item) {
      this.activeModal = true;
      this.selectedItem = item;
    },
    async getWithdraw() {
      const tokenId = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.accountInfo.project_name
      );

      this.tokenId = tokenId.toString();

      const viewCanWithdrawValue = await getWriteContract(
        this.$store.state.kolAddress,
        kolAbi,
        "viewCanWithdrawValue",
        tokenId.toString()
      );

      this.viewCanWithdrawValue = (
        ethers.utils.formatUnits(viewCanWithdrawValue, 18) * 1
      ).toFixed(4);

      const crossProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getCrossProgress",
        tokenId.toString()
      );
      console.log("crossProgress1111", crossProgress);

      const lpExProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getLpExProgress",
        tokenId.toString()
      );

      const kolProgress = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getKolProgress",
        tokenId.toString()
      );

      this.crossProgressValue = ((crossProgress.toString() * 1) / 100).toFixed(4);
      this.lpExProgressValue = ((lpExProgress.toString() * 1) / 100).toFixed(4);
      this.kolProgressValue = ((kolProgress.toString() * 1) / 100).toFixed(4);
    },
    searchValueFun(e) {
      this.searchValue = e.target.value;
    },
  },

  watch: {
    address() {
      this.getInfo();
    },
    reserveInfo(value) {
      value && this.getWithdraw();
    },
    searchValue(value) {
      if (value !== "") {
        this.searchList = this.projectIssuedList.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.searchList = this.projectIssuedList;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.kolIndex {
  // background-color: #fff;
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
}
.header {
  background-color: #fff;
  padding: 0 5%;
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .addBtn {
    font-size: 12px;
    position: absolute;
    right: 5%;
    top: 2px;
  }
}
.tabs {
  background: #fff;
  width: 90%;
  height: 40px;
  margin: 10px auto 10px auto;
  border-radius: 10px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  padding: 5px;
  > div {
    width: 50%;
    border-radius: 10px;
    padding: 8px;
  }
  .active {
    background-color: #ffc519;
  }
}
.listBoxs {
  padding: 20px;
  .list {
    box-shadow: 0 3px 10px #cfcece;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    .icon {
      width: 25px;
      margin-right: 10px;
    }
  }
  button {
    height: 30px;
    border-radius: 5px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
  }
}

.activeBtn {
  margin-right: 4px;
}
.kolRequest {
  width: 90%;
  margin: 20px auto;
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  font-size: 14px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    input {
      width: 68%;
      height: 40px;
      border: 1px solid #c8c7c7;
      border-radius: 10px;
      padding: 5px 10px;
    }
  }

  button {
    width: 50%;
    height: 40px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
    margin-top: 30px;
  }
}
.mt-10 {
  margin-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}
.desc {
  font-size: 12px;
  color: #999;
  text-align: left;
  line-height: 20px;
}

.kolContent {
  height: 100vh;
  background-color: #fff;
  padding: 0 5%;
  padding-bottom: 100px;
  overflow: auto;
  .header {
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    .addBtn {
      font-size: 12px;
      position: absolute;
      right: 5%;
      top: 2px;
    }
  }
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    font-size: 18px;
    > span {
      font-size: 12px;
    }
    .icon {
      width: 25px;
      margin-right: 10px;
    }
  }
  .title {
    font-size: 14px;
    padding-bottom: 20px;
    font-weight: bold;
  }
  .content {
    text-align: left;
    font-size: 12px;
  }
  .form {
    border: 1px solid #e1dede;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
  }
  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 10px 0;
    input {
      width: 70%;
      border: 1px solid #d0cfcf;
      border-radius: 10px;
      height: 36px;
      padding: 0 15px;
      background-color: transparent;
    }
  }
  .sure {
    margin-top: 30px;
  }
  button {
    width: 100%;
    height: 40px;
    line-height: 30px;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: bold;
    font-size: 14px;
  }
  .orange {
    color: orange;
  }
  .green {
    color: green;
  }
}
.hadPro {
  font-size: 14px;
  background-color: #fff;
  margin: 20px 5%;
  border-radius: 10px;
  padding: 20px;
  .hadProList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      width: 30px;
      margin-right: 10px;
    }
    button {
      height: 30px;
      border-radius: 5px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
      font-size: 12px;
    }
  }
}
.noData {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  img {
    width: 70px;
    margin-bottom: 20px;
  }
}
.content {
  font-size: 14px;
  padding: 20px 20px 0;
  text-align: center;
  .contentDesc {
    padding: 20px;
    text-align: left;
    line-height: 20px;
    font-size: 12px;
    padding-top: 0;
  }
  .inputBox {
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      width: 80%;
      height: 36px;
      padding: 10px;
      border: 1px solid #999;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 12px;
    }
    button {
      width: 20%;
      border-radius: 5px;
      font-size: 12px;
    }
  }
  .balanceBox {
    width: 80%;
    margin: 0 auto;
    text-align: left;
    font-size: 12px;
    margin-bottom: 4px;
  }
  button {
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: bold;
    font-size: 12px;
    line-height: 30px;
  }
  > button {
    width: 80%;
    height: 36px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
}
.activeBtnBox {
  font-size: 12px;
  padding: 10px 20px;
  .activeBtnDesc {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    line-height: 20px;
    margin-bottom: 10px;
  }
  > span {
    padding-right: 10px;
  }
  button {
    border-radius: 5px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: bold;
    font-size: 12px;
    line-height: 28px;
  }
  .inputSearch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    .searchBox {
      width: calc(100% - 80px);
      height: 36px;
      background-color: transparent;
      border: 1px solid #999;
      border-radius: 10px;
      padding: 10px;
      font-size: 12px;
    }
  }
}
.tips {
  font-size: 12px;
  color: #999;
}
.must {
  color: rgb(235, 58, 58);
  padding-right: 2px;
}
</style>
