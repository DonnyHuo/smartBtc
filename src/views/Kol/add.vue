<template>
  <div class="kolContent">
    <div class="header font-medium">KOL認證 — 推薦新項目</div>
    <div class="form">
      <div class="list">
        <span class="font-medium">銘文BRC20</span>
        <input type="text" v-model="name" />
      </div>
      <div class="list">
        <span class="font-medium">幣種symbol</span>
        <input type="text" v-model="symbol" />
      </div>
      <div class="list">
        <span class="font-medium">代幣總量</span>
        <input type="text" v-model="totalSupply" />
      </div>
      <div class="listBox">
        <div class="title font-medium">BSC鏈初始發行分配比例</div>
        <div class="listDiv">
          <div class="listS">
            <span>跨鏈</span>
            <div class="inputBox">
              <input type="text" v-model="percents[0]" placeholder=">=50" /> %
            </div>
          </div>
          <div class="listS">
            <span>流動性發行</span>
            <div class="inputBox">
              <input type="text" v-model="percents[1]" placeholder=">=10" /> %
            </div>
          </div>
          <div class="listS">
            <span>啟動池</span>
            <div class="inputBox">
              <input type="text" v-model="percents[2]" placeholder="1-3" /> %
            </div>
          </div>
          <div class="listS">
            <span>社區KOL空投獎勵</span>
            <div class="inputBox">
              <input type="text" v-model="percents[3]" placeholder="<=20" /> %
            </div>
          </div>
        </div>
      </div>
      <div class="sure">
        <van-button @click="newProject">提交初審</van-button>
      </div>
      <div class="desc">
        說明：計畫初審通過後，將進入社區投票階段，有效投票期7天，持有SBTC社群會員可參與投票推薦，滿100票取得上市權益，自動部署相關合約。
      </div>
      <div
        class="px-[20px] text-left leading-6 font-medium"
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
      return `我的錢包${shortStr(
        this.$store.state.address
      )}已經質押SBTC，正在SmartBTC.io平台提交KOL認證，參與推廣${
        this.symbol
      }銘文！請大家幫忙按讚、轉發這則推文，助力 ${
        this.symbol || "--"
      }銘文上SmartBTC熱門！`;
    },
  },
  methods: {
    shortStr,
    changeTabs(number) {
      this.active = number;
    },
    copyAddress(msg) {
      if (!this.symbol) {
        return showToast("請填寫幣種symbol");
      }
      copy(msg);
      showToast("複製成功");
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
          title: `發行${project_info.name}项目`,
          message: "確認是否已發推文且以目前按讚數提交申請",
        })
          .then(() => {
            this.$axios
              .post("https://smartbtc.io/bridge/kol/new_project", {
                kol_address: this.$store.state.address,
                project_info,
              })
              .then((res) => {
                showToast("申請成功");
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
        showToast("提交資料有誤");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.kolContent {
  background-color: #f1f1f1;
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
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
  width: 70%;
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
