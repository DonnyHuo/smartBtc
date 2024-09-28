<template>
  <div class="kolContent">
    <div class="header font-medium">
      {{ $t("kolAdd.title") }}
    </div>
    <div class="form">
      <div class="list">
        <span class="font-medium">
          <span class="text-red-600 pr-1">*</span>
          <span> {{ $t("kolAdd.brc20Name") }}</span>
        </span>
        <input type="text" v-model="brc20_name" />
      </div>
      <div class="list">
        <span class="font-medium">
          {{ $t("kolAdd.brc20Id") }}
        </span>
        <input type="text" v-model="brc20_id" />
      </div>
      <div class="list">
        <span class="font-medium">
          <span class="text-red-600 pr-1">*</span>
          <span>{{ $t("kolAdd.brc20Supply") }}</span>
        </span>
        <input type="text" v-model="brc20_supply" />
      </div>
      <div class="list">
        <span class="font-medium">
          <span class="text-red-600 pr-1">*</span>
          <span> {{ $t("kolAdd.symbol") }}</span>
        </span>
        <input type="text" v-model="symbol" />
      </div>
      <div class="list">
        <span class="font-medium">
          <span class="text-red-600 pr-1">*</span>
          <span>{{ $t("kolAdd.total") }}</span>
        </span>
        <input type="text" v-model="totalSupply" />
      </div>
      <div class="listBox">
        <div class="title font-medium">
          <span class="text-red-600 pr-1">*</span>
          <span> {{ $t("kolAdd.rate") }}</span>
        </div>
        <div class="listDiv">
          <div class="listS">
            <span>{{ $t("kolAdd.rateArr[0]") }}</span>
            <div class="inputBox">
              <input type="text" v-model="percents[0]" placeholder=">=50" /> %
            </div>
          </div>
          <div class="listS">
            <span>{{ $t("kolAdd.rateArr[1]") }}</span>
            <div class="inputBox">
              <input type="text" v-model="percents[1]" placeholder=">=10" /> %
            </div>
          </div>
          <div class="listS">
            <span>{{ $t("kolAdd.rateArr[2]") }}</span>
            <div class="inputBox">
              <input type="text" v-model="percents[2]" placeholder="1-3" /> %
            </div>
          </div>
          <div class="listS">
            <span>{{ $t("kolAdd.rateArr[3]") }}</span>
            <div class="inputBox">
              <input type="text" v-model="percents[3]" placeholder="<=20" /> %
            </div>
          </div>
        </div>
      </div>

      <div class="text-[14px] px-[20px] my-2 mt-10 text-left leading-6">
        <div class="text-[#111] font-medium text-center w-3/4 m-auto pb-5">
          {{ $t("kolAdd.descTitle") }}
        </div>
        <div class="text-[#999]">
          <div class="pb-2">
            {{ $t("kolAdd.descTips[0]") }}
          </div>
          <div class="pb-2">
            {{ $t("kolAdd.descTips[1]") }}
          </div>
          <div class="pb-2">
            {{ $t("kolAdd.descTips[2]") }}
          </div>
        </div>
      </div>

      <div class="sure">
        <van-button @click="newProject">{{ $t("kolAdd.submit") }}</van-button>
      </div>
      <div class="desc">
        {{ $t("kolAdd.desc") }}
      </div>
      <div
        class="px-[20px] text-left leading-6 font-medium text-black"
        @click="copyAddress(tweet)"
      >
        <span class="text-red-600">*</span>
        {{ tweet }}
        <img
          class="w-[16px] inline-block"
          src="../../assets/img/copy.png"
          alt=""
        />
      </div>
      <div class="text-left mt-4 px-[20px] text-[#999] text-xs">
        {{ $t("kol.tweetTips") }}
      </div>
    </div>
  </div>
</template>
<script>
import { shortStr, copy } from "@/utils";
import { showToast, showConfirmDialog } from "vant";

export default {
  name: "kolAdd",
  data() {
    return {
      active: 0,
      brc20_name: "",
      brc20_id: "",
      brc20_supply: "",
      symbol: "",
      totalSupply: "",
      percents: ["", "", "", ""],
    };
  },
  computed: {
    tweet() {
      return this.$t("kol.tweet", {
        address: this.shortStr(this.$store.state.address),
        name: this.symbol,
      });
    },
  },
  methods: {
    shortStr,
    changeTabs(number) {
      this.active = number;
    },
    copyAddress(msg) {
      if (!this.symbol) {
        return showToast(this.$t("kolAdd.tips[0]"));
      }
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    newProject() {
      const project_info = {
        brc20_name: this.brc20_name,
        brc20_id: this.brc20_id,
        brc20_supply: this.brc20_supply,
        symbol: this.symbol,
        total_supply: this.totalSupply,
        percents: this.percents.map((list) => list * 100),
      };
      if (
        project_info.brc20_name &&
        project_info.brc20_supply &&
        project_info.symbol &&
        project_info.total_supply &&
        project_info.percents.every((list) => list !== "")
      ) {
        showConfirmDialog({
          title: `${this.$t("kolAdd.tips[1]", {
            name: project_info.name,
          })}`,
          message: this.$t("kolAdd.tips[2]"),
          confirmButtonText: this.$t("sure"),
          cancelButtonText: this.$t("cancel"),
        })
          .then(() => {
            this.$axios
              .post("https://smartbtc.io/bridge/kol/new_project", {
                kol_address: this.$store.state.address,
                project_info,
              })
              .then((res) => {
                showToast(this.$t("kolAdd.success"));
                setTimeout(() => {
                  this.$router.push("/kol");
                }, 1000);
              })
              .catch((err) => {
                console.log(err);
                showToast(err);
              });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        showToast(this.$t("kolAdd.error"));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.kolContent {
  font-size: 14px;
}
.header {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #fff;
}
.form {
  width: 90%;
  margin: 20px auto;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  text-align: left;
}
.list {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    color: #111;
  }
}
.listBox {
  .title {
    margin-top: 20px;
    color: #111;
    text-align: left;
    padding-left: 20px;
  }
  .listDiv {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(80%, 1fr));
    padding: 0 20px;
    margin-top: 10px;

    .listS {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #666;
      padding: 0 10px;
      .inputBox {
        width: 80px;
      }
      input {
        width: 80%;
        height: 26px;
        padding: 0 10px;
        font-size: 14px;
      }
    }
  }
}
input {
  width: 50%;
  border: 1px solid #999;
  border-radius: 10px;
  height: 32px;
  padding: 0 15px;
  background-color: transparent;
}
.sure {
  margin-top: 10px;
  text-align: center;
  button {
    width: 90%;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
  }
}
.desc {
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  padding: 20px;
}
</style>
