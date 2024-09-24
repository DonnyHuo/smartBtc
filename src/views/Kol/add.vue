<template>
  <div class="kolContent">
    <div class="header font-medium">{{ $t("kolAdd.title") }}</div>
    <div class="form">
      <div class="list">
        <span class="font-medium">{{ $t("kolAdd.name") }}</span>
        <input type="text" v-model="name" />
      </div>
      <div class="list">
        <span class="font-medium">{{ $t("kolAdd.symbol") }}</span>
        <input type="text" v-model="symbol" />
      </div>
      <div class="list">
        <span class="font-medium">{{ $t("kolAdd.total") }}</span>
        <input type="text" v-model="totalSupply" />
      </div>
      <div class="listBox">
        <div class="title font-medium">{{ $t("kolAdd.rate") }}</div>
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
      name: "",
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
        name: this.name,
        symbol: this.symbol,
        total_supply: this.totalSupply,
        percents: this.percents.map((list) => list * 100),
      };
      if (
        project_info.name &&
        project_info.symbol &&
        project_info.total_supply &&
        project_info.percents.every((list) => list !== 0)
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
  margin-top: 30px;
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
