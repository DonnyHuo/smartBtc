<template>
  <div class="kolIndex">
    <div class="header font-medium">
      <span v-if="!accountInfo.status">KOL認證 — 社交帳戶</span>
      <div v-else>
        <span v-if="!activeAmount">KOL認證 — 質押SBTC</span>
        <span v-if="activeAmount">KOL認證 — 成為项目方</span>
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
        發布Twitter認證推文，包含SmartBTC、SBTC和想認領的銘文項目信息，文案自定義，主要考察該推文24小時閱讀數、轉發數和點贊數。
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
        KOL貢獻分配權重計算方法：初始權重主要取決於社交帳戶總粉絲數、認證推文24小時活躍度和實際質押的SBTC數量這三大維度，運營中不定期抓取認證社交帳戶（Twitter為主，
        Telegram、Discord為輔）對認領銘文项目與SmartBTC平台的關注與推廣數據，根據演算法提高KOL貢獻分配權重。
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
    <div v-if="accountInfo.status === 1" class="activeBtnBox">
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
        認領和創建项目前，需要質押SBTC，數量2100個起，質押越多，分配權重越高，可以隨時撤銷質押。
      </div>
      <div v-else class="desc mt-10">
        在下方清單中選擇您支援的項目（支援模糊搜尋），一鍵「認領」綁定。如您支持的項目尚未在SmartBTC上市，可“發起项目”，推薦新的銘文項目，在SmartBTC
        BRC20
        Launchpad發起投票，7天內滿100個有效投票，即取得上市資格並自動部署相關合約，同時完成KOL綁定為项目方，自動獲得該项目的KOL奖励。
      </div>
    </div>

    <div v-if="accountInfo.status === 1" class="listBoxs">
      <div v-if="searchList.length">
        <div v-for="(item, index) in searchList" class="list" :key="index">
          <div class="flex items-center">
            <img
              class="w-[30px] mr-3 rounded-2xl"
              :src="realIconLogo(item.project_name)"
              alt=""
            />
            <!--/default.png -->
            <span>{{ item.name }}</span>
          </div>
          <div>
            <van-button
              size="small"
              :disabled="!activeAmount"
              @click="openModel(item)"
              >認領</van-button
            >
          </div>
        </div>
      </div>

      <div v-else class="noData">
        <div>
          <img src="../../assets/img/noData.png" />
          <div>暫無數據</div>
        </div>
      </div>
    </div>
    <div v-if="accountInfo !== '' && ![0, 1].includes(accountInfo.status)">
      <div class="hadPro">
        <div class="hadProList">
          <div class="flex items-center">
            <img class="icon" src="../../assets/img/default.png" alt="" />
            <span>{{ accountInfo?.project_name?.split("100T-")[1] }}</span>
          </div>
          <div class="tips">{{ getStatus(accountInfo.status) }}</div>
        </div>
      </div>
    </div>

    <van-action-sheet class="model" v-model:show="model" title="認領規則">
      <div class="content">
        <div class="contentDesc">
          <p>
            1.原則上，KOL應保持常態透過Twitter、Telegram等社交網絡，或組織線下活動等方式，積極參與某銘文項目的推廣佈道，才能認領成為該項目的社區KOL（項目方）；
          </p>
          <p>
            2.提交認領時，SmartBTC.io會多維度測算KOL的質押SBTC數量、社交帳戶活躍度、認證推文閱讀點讚轉發數、社交帳戶歷史動態與項目的關聯度、認領地址項目代幣持倉數量等綜合因素，透過演算法自動計算出當前KOL對應的社群空投獎勵分配權重；
          </p>
          <p>
            3.一個KOL（對應認證的錢包位址）只能唯一認領一個項目，且認領完成不可更改；
          </p>
          <p>
            4.可以隨時撤銷認領，解除收回質押的SBTC，一經解除KOL權益即時終止且不可申請複效；
          </p>
          <p>
            5.認領完成後，KOL應保持對該計畫的推廣佈道，積極參與社區建設，SmartBTC.io平台演算法不定期根據KOL多維度動態數據調整其空投獎勵分配權益，並對長時間不參與社區建設的KOL暫停或終止分配權益。
          </p>
          <div class="text-left" @click="copyAddress(tweet)">
            <span class="text-black font-medium">
              <span class="text-red-600">*</span>
              {{ tweet }}
            </span>
            <img
              class="w-[16px] inline-block"
              src="../../assets/img/copy.png"
              alt=""
            />
          </div>
        </div>

        <van-button
          :loading="reserveLoading"
          class="modelBtn"
          size="small"
          @click="bindProject(selectedItem.project_name)"
          >我已閱讀並認可認領規則，同意認領此項目</van-button
        >
      </div>
    </van-action-sheet>

    <van-action-sheet class="model" v-model:show="activeModal" title="质押SBTC">
      <div class="content">
        <div class="balanceBox">餘額：{{ sBtcBalance }} SBTC</div>
        <div class="inputBox">
          <input
            v-model="depositAmount"
            type="text"
            :placeholder="`請輸入質押數量 >= ${minDeposit} SBTC`"
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
          >去授權</van-button
        >
        <van-button
          v-else
          :loading="activeLoading"
          class="modelBtn"
          size="small"
          @click="userDeposit()"
          >去質押</van-button
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
  copy,
  realIconLogo,
} from "@/utils";
import kolAbi from "../../abi/kol.json";
import depositAbi from "../../abi/deposit.json";
import { showConfirmDialog } from "vant";

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
      this.getProjectIssuedList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    tweet() {
      return `我的錢包${shortStr(
        this.$store.state.address
      )}已經質押SBTC，正在SmartBTC.io平台提交KOL認證，參與推廣${
        this.selectedItem.name
      }銘文，請大家幫忙點讚、轉發這則推文，助力${
        this.selectedItem.name
      }銘文上SmartBTC熱門！`;
    },
  },
  methods: {
    shortStr,
    formatDate,
    realIconLogo,
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return "認證通過";
        case 2:
          return "已認領或建立项目,審核中。。。";
        case 3:
          return "待執行合約設定KOL";
        case 4:
          return "KOL合約已執行";
        case 5:
          return "項目KOL已生效";
        case 6:
          return "项目KOL設定執行失敗";
        case 7:
          return "認證審核未通過";
        case 8:
          return "項目KOL設定為失效";
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
        return showToast("請填寫正確的錢包地址");
      }
      if (this.xAddress == "") {
        return showToast("請填寫正確的X位址");
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.address,
          twitter_account: this.xAddress,
          tg_account: this.tgAddress,
          discord_account: this.disAddress,
        })
        .then((res) => {
          showToast("已提交認證申請");
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bindProject(project_name) {
      showConfirmDialog({
        title: `認領${project_name}项目`,
        message: "確認是否已發推文且以目前按讚數提交申請",
      })
        .then(() => {
          this.$axios
            .post("https://smartbtc.io/bridge/kol/bind_project", {
              kol_address: this.$store.state.address,
              project_name: project_name,
            })
            .then((res) => {
              showToast("認領成功");
              this.model = false;
            })
            .catch((err) => {
              showToast(err.message);
              console.log(err);
            });
        })
        .catch(() => {
          // on cancel
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
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
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
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      this.activeAmount = ethers.utils.formatUnits(res, decimals) * 1;

      const allowance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "allowance",
        this.$store.state.address,
        this.$store.state.pledgeAddress
      );
      this.allowance = allowance.toString() * 1;
    },

    approveActive() {
      this.approveLoading = true;
      getWriteContractLoad(
        this.$store.state.sBtc,
        erc20ABI,
        "approve",
        this.$store.state.pledgeAddress,
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
      const decimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      const minDeposit = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "minDeposit"
      );
      this.minDeposit = ethers.utils.formatUnits(minDeposit, decimals) * 1;
    },
    userDeposit() {
      if (this.depositAmount * 1 < this.minDeposit * 1) {
        return showToast(`质押金额必须大于等于${this.minDeposit}sBTC`);
      }
      if (this.depositAmount * 1 > this.sBtcBalance * 1) {
        return showToast("余额不足");
      }

      this.activeLoading = true;

      console.log(
        this.$store.state.pledgeAddress,
        depositAbi,
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      );

      getWriteContractLoad(
        this.$store.state.pledgeAddress,
        depositAbi,
        "userDeposit",
        ethers.utils.parseUnits(
          this.depositAmount.toString(),
          this.sBtcDecimals
        )
      )
        .then((res) => {
          console.log("res", res);
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
    searchValueFun(e) {
      this.searchValue = e.target.value;
    },
  },

  watch: {
    address() {
      this.getInfo();
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
}
.header {
  background-color: #fff;
  padding: 0 5%;
  height: 50px;
  line-height: 50px;

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
  background-color: #fff;
  padding: 0 5%;

  .header {
    height: 50px;
    line-height: 50px;

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
  padding: 0 20px;
  text-align: center;
  .contentDesc {
    padding: 20px;
    text-align: left;
    line-height: 24px;
    font-size: 14px;
    > p {
      padding-bottom: 10px;
    }
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
      font-size: 14px;
    }
    button {
      width: 20%;
      border-radius: 5px;
      font-size: 14px;
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

    font-size: 14px;
    line-height: 30px;
  }
  > button {
    height: 36px;
    margin-bottom: 20px;
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
