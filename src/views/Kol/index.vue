<template>
  <div class="kolIndex">
    <div class="header">
      <span>KOL</span>
      <router-link v-if="accountInfo.status === 1" to="/kolAdd" class="addBtn"
        >新增项目</router-link
      >
    </div>
    <div v-if="!accountInfo" class="kolRequest">
      <div>
        <span>收益地址</span>
        <input type="text" v-model="registerAddress" />
      </div>
      <div>
        <span>X地址</span>
        <input type="text" v-model="xAddress" />
      </div>
      <van-button @click="register">KOL认证</van-button>
    </div>
    <div v-if="accountInfo.status === 0" class="kolRequest">
      <div>
        <span>收益地址</span>
        <span>{{ shortStr(accountInfo.address) }}</span>
      </div>
      <div>
        <span>X地址</span>
        <span>{{ accountInfo.twitter_account }}</span>
      </div>
      <van-button disabled>KOL审核中...</van-button>
    </div>

    <div v-if="accountInfo.status === 1" class="listBoxs">
      <div v-if="projectIssuedList.length">
        <div v-for="(item, index) in projectIssuedList" class="list" :key="index">
          <div>
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ item.project_name }}</span>
          </div>
          <div>
            <van-button
              v-if="!activeAmount"
              class="activeBtn"
              size="small"
              @click="openActiveModal(item)"
              >去激活</van-button
            >
            <van-button
              v-else
              class="activeBtn"
              size="small"
              :loading="quitKolLoading"
              @click="quitKol(item)"
              >退出KOl</van-button
            >
            <van-button size="small" :disabled="!activeAmount" @click="openModel(item)"
              >去认领</van-button
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
            <span>{{ accountInfo.project_name }}</span>
          </div>
          <van-button size="small" disabled>{{
            accountInfo.status > 2 ? "认领完成" : "已认领 , 审核中..."
          }}</van-button>
        </div>
        <div v-if="accountInfo.status > 2" class="reserve">
          <div>
            <div>待收取收益： {{ viewCanWithdrawValue }} {{ reserveInfo?.symbol }}</div>
            <van-button
              size="small"
              :loading="withdrawLoading"
              @click="withdraw()"
              :disabled="!(viewCanWithdrawValue * 1)"
              >领取收益</van-button
            >
          </div>
          <div>
            <div>跨链进度</div>
            <div>{{ crossProgressValue }} %</div>
          </div>
          <div>
            <div>lp兑换发行进度</div>
            <div>{{ lpExProgressValue }} %</div>
          </div>
          <div>
            <div>kol奖励发行比例</div>
            <div>{{ kolProgressValue }} %</div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet class="model" v-model:show="model" title="认领说明">
      <div class="content">
        <div class="contentDesc">
          <p>1.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>2.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>3.必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>4.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx</p>
          <p>
            5.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
          <p>
            6.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
          <p>
            7.必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx必须发推特满足xxxx
          </p>
        </div>
        <van-button
          :loading="reserveLoading"
          class="modelBtn"
          size="small"
          @click="bindProject(selectedItem.project_name)"
          >已完成说明 去认领</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet class="model" v-model:show="activeModal" title="激活质押">
      <div class="content">
        <div class="balanceBox">余额：{{ sBtcBalance }} SBTC</div>
        <div class="inputBox">
          <input
            v-model="depositAmount"
            type="text"
            :placeholder="`请输入激活数量 >= ${minDeposit} sBTC`"
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
          >去激活</van-button
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
      accountInfo: "",
      projectVotingList: [],
      timer: null,
      projectIssuedList: [],
      reserveInfo: {},
      model: false,
      reserveLoading: false,
      selectedItem: {},
      viewCanWithdrawValue: "",
      tokenId: "",
      withdrawLoading: false,
      crossProgressValue: "",
      lpExProgressValue: "",
      kolProgressValue: "",
      activeModal: false,
      activeAmount: 0,
      activeLoading: false,
      approveLoading: false,
      allowance: 0,
      sBtcBalance: 0,
      depositAmount: "",
      sBtcDecimals: 18,
      quitKolLoading: false,
      minDeposit: "",
    };
  },
  mounted() {
    this.getInfo();
    this.getProjectIssuedList();
    this.registerAddress = this.address;
    this.getActiveAmount();
    this.getBalance();
    this.minDepositFun();

    this.timer = setInterval(() => {
      this.getInfo();
      this.getProjectIssuedList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },

  methods: {
    shortStr,
    formatDate,
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
      if (!ethers.utils.isAddress(this.registerAddress)) {
        return showToast("请填写正确的钱包地址");
      }
      if (this.xAddress == "") {
        return showToast("请填写正确的X地址");
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.registerAddress,
          twitter_account: this.xAddress,
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
        return showToast(`激活金额必须大于等于${this.minDeposit}sBTC`);
      if (this.depositAmount * 1 > this.sBtcBalance * 1) return showToast("余额不足");
      this.activeLoading = true;
      getWriteContractLoad(
        this.$store.state.kolAddress,
        kolAbi,
        "userDeposit",
        ethers.utils.parseUnits(this.depositAmount, this.sBtcDecimals * 1)
      )
        .then((res) => {
          console.log(res);
          this.activeLoading = false;
          this.activeModal = false;
          showToast("激活成功");
          this.getActiveAmount();
        })
        .catch(() => {
          this.activeLoading = false;
        });
    },
    async quitKol() {
      this.quitKolLoading = true;

      const tokenId = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.accountInfo.project_name
      );

      getWriteContractLoad(
        this.$store.state.kolAddress,
        kolAbi,
        "quitKol",
        tokenId.toString()
      )
        .then((res) => {
          this.quitKolLoading = false;
          showToast("退出KOL成功");
        })
        .catch(() => {
          this.quitKolLoading = false;
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
    async withdraw() {
      this.withdrawLoading = true;
      await getWriteContractLoad(
        "0xf6250E66a044c152c6294B934A0e02067F9b65C7",
        kolAbi,
        "withdrawKolAirdrop",
        this.tokenId
      )
        .then((res) => {
          this.withdrawLoading = false;
          showToast("领取成功");
        })
        .catch((err) => {
          this.withdrawLoading = false;
          console.log(err);
        });
    },
  },

  watch: {
    address() {
      this.getInfo();
    },
    reserveInfo(value) {
      value && this.getWithdraw();
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
  .activeBtn {
    margin-right: 4px;
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
      width: 70%;
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
    font-size: 14px;
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
  .reserve {
    margin-top: 20px;
    font-size: 12px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
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
  }
  .inputBox {
    width: 80%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      width: 100%;
      height: 36px;
      padding: 10px;
      border: 1px solid #999;
      border-radius: 10px;
      margin-right: 10px;
      font-size: 12px;
    }
    button {
      width: 50px;
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
    font-size: 14px;
    line-height: 30px;
  }
  > button {
    width: 80%;
    height: 36px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
}
</style>
