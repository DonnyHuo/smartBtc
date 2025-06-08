<template>
  <div>
    <div class="flex items-center gap-5">
      <img
        class="w-[30px]"
        :src="
          accountInfo
            ? require('../assets/img/success.png')
            : require('../assets/img/1.png')
        "
        alt=""
      />
      <span
        class="text-[26px] font-bold"
        :class="accountInfo ? 'text-[#E8AD00]' : 'text-[#1989FA]'"
        >{{ $t("kol.title[0]") }}</span
      >
    </div>
    <div class="mb-12">
      <div class="text-[14px]">
        <div class="flex items-center justify-between mt-8 gap-4">
          <div class="flex flex-col gap-2 text-left w-full">
            <span
              ><span class="must">*</span>{{ $t("kol.revenueAddress") }}</span
            >
            <div v-if="address" class="relative">
              <input
                disabled
                class="border border-solid border-[#a1a1a1] w-full h-[40px] text-[12px] rounded-[4px] px-2"
                type="text"
                :value="shortStr(address)"
              />
              <img
                v-if="$store.state.address"
                class="w-[20px] h-[20px] absolute right-[10px] top-[10px]"
                src="../assets/img/copy.png"
                alt=""
                @click="copyAddress($store.state.address)"
              />
            </div>
            <div v-else>
              <button
                class="border border-solid border-[#a1a1a1] w-full h-[40px] text-[12px] rounded-[4px] px-2"
                @click="connectWallet"
              >
                {{ $t("connectWallet") }}
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-2 text-left w-full">
            <span><span class="must">*</span>{{ $t("kol.twitter") }}</span>
            <input
              type="text"
              class="border border-solid border-[#a1a1a1] w-full h-[40px] text-[12px] rounded-[4px] px-2"
              v-model="xAddress"
              :placeholder="$t('kol.inputPlaceholder.twitter')"
              :disabled="!!accountInfo"
            />
          </div>
        </div>
        <div class="flex items-center justify-between mt-8 gap-4">
          <div class="flex flex-col gap-2 text-left w-full">
            <span>{{ $t("kol.telegram") }}</span>
            <input
              class="border border-solid border-[#a1a1a1] w-full h-[40px] text-[12px] rounded-[4px] px-2"
              type="text"
              v-model="tgAddress"
              :placeholder="$t('kol.inputPlaceholder.telegram')"
              :disabled="!!accountInfo"
            />
          </div>
          <div class="flex flex-col gap-2 text-left w-full">
            <span>{{ $t("kol.discord") }}</span>
            <input
              type="text"
              v-model="disAddress"
              :placeholder="$t('kol.inputPlaceholder.discord')"
              class="border border-solid border-[#a1a1a1] w-full h-[40px] text-[12px] rounded-[4px] px-2"
              :disabled="!!accountInfo"
            />
          </div>
        </div>
        <div class="mt-4 text-[12px] text-red-500 text-left leading-4">
          *{{ $t("kol.desc1") }}
        </div>
        <div class="mt-8" v-if="!accountInfo">
          <van-button
            class="w-full h-[40px] !bg-[#FFC519] !border-0"
            @click="register"
            >{{ $t("kol.submit") }}</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  formatDate,
  shortStr,
  copy,
  realIconLogo,
  connectWallet,
} from "@/utils";
import { ethers } from "ethers";
import { showToast } from "vant";

import ShareProject from "@/views/ShareProject";

export default {
  name: "kol",
  data() {
    return {
      xAddress: "",
      tgAddress: "",
      disAddress: "",
      accountInfo: "",
    };
  },
  components: { ShareProject },
  mounted() {
    this.getInfo();
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    connectWallet,
    clickItemFun(item) {
      if (this.activeAmount) {
        this.openModel(item);
      } else {
        showToast(this.$t("kol.desposit"));
      }
    },
    shortStr,
    formatDate,
    realIconLogo,
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    getInfo() {
      this.$axios
        .post("https://smartbtc.io/bridge/kol/query_kol", {
          address: this.$store.state.address,
        })
        .then((res) => {
          this.accountInfo = res.data.data;

          this.xAddress = res.data.data.twitter_account;
          this.tgAddress = res.data.data.tg_account;
          this.disAddress = res.data.data.discord_account;
        })
        .catch((err) => {
          this.accountInfo = "";
          console.log(err);
        });
    },
    register() {
      if (!ethers.utils.isAddress(this.address)) {
        return showToast(this.$t("kol.tips[0]"));
      }
      if (this.xAddress == "") {
        return showToast(this.$t("kol.tips[1]"));
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/register", {
          address: this.address,
          twitter_account: this.xAddress,
          tg_account: this.tgAddress,
          discord_account: this.disAddress,
        })
        .then((res) => {
          showToast(this.$t("kol.tips[5]"));
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  watch: {
    address() {
      this.getInfo();
    },
  },
};
</script>
<style lang="scss" scoped>
.kolIndex {
  // background-color: #fff;
  // height: 100vh;
  // padding-bottom: 100px;
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
      width: calc(100% - 120px);
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
