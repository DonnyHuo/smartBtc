<template>
  <div class="kolContent">
    <div class="header">
      <div :class="active === 0 && 'active'" @click="changeTabs(0)">审核KOL</div>
      <div :class="active === 1 && 'active'" @click="changeTabs(1)">审核新增项目</div>
      <div :class="active === 2 && 'active'" @click="changeTabs(2)">审核认领项目</div>
    </div>
    <div v-if="active === 0">
      <div v-if="kolWaitAgreeList.length">
        <div v-for="(item, index) in kolWaitAgreeList" class="form">
          <div class="list" :key="index">
            <span>认证地址</span>
            <span>{{ shortStr(item.address) }}</span>
          </div>
          <div class="list">
            <span>X地址</span>
            <span>{{ item.twitter_account }}</span>
          </div>
          <div class="list">
            <span>状态</span>
            <span>{{ statusFun(item.status) }}</span>
          </div>
          <div class="list">
            <span>创建时间</span>
            <span>{{ formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm") }}</span>
          </div>
          <div class="list btnBox">
            <van-button
              :disabled="![0].includes(item.status)"
              @click="adminAgree(item, true)"
              >审核通过</van-button
            >
            <van-button
              :disabled="![0].includes(item.status)"
              @click="adminAgree(item, false)"
              >审核不通过</van-button
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
    <div v-if="active === 1">
      <div v-if="projectWaitAgreeList.length">
        <div v-for="(item, index) in projectWaitAgreeList" class="form">
          <div :key="index">
            <div class="list">
              <span>币种名称</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="list">
              <span>币种symbol</span>
              <span>{{ item.symbol }}</span>
            </div>
            <div class="list">
              <span>发行数量</span>
              <span>{{ item.total_supply }}</span>
            </div>
            <div class="listBoxs">
              <div class="title">发行比例</div>
              <div class="listDiv">
                <div class="listS">
                  <span>跨链</span>
                  <div class="inputBox">{{ item.cross_percent / 100 }} %</div>
                </div>
                <div class="listS">
                  <span>流动性发行</span>
                  <div class="inputBox">{{ item.le_percent / 100 }} %</div>
                </div>
              </div>
              <div class="listDiv">
                <div class="listS">
                  <span>启动池</span>
                  <div class="inputBox">{{ item.lm_percent / 100 }} %</div>
                </div>
                <div class="listS">
                  <span>社区空头</span>
                  <div class="inputBox">{{ item.kol_percent / 100 }} %</div>
                </div>
              </div>
            </div>
            <div class="list mt-20">
              <span>创建时间</span>
              <span>{{ formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm") }}</span>
            </div>
            <div class="list btnList">
              <button @click="projectAgree(item, true)">审核通过</button>
              <button @click="projectAgree(item, false)">审核不通过</button>
            </div>
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
    <div v-if="active === 2">
      <div v-if="bindProjectWaitList.length">
        <div v-for="(item, index) in bindProjectWaitList" class="form">
          <div :key="index">
            <div class="list">
              <span>币种名称</span>
              <span>{{ item.project_name }}</span>
            </div>
            <div class="list">
              <span>认领地址</span>
              <span>{{ shortStr(item.address) }}</span>
            </div>
            <div class="list">
              <span>twitter地址</span>
              <span>{{ item.twitter_account }}</span>
            </div>
            <div class="list">
              <span>创建时间</span>
              <span>{{ formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm") }}</span>
            </div>
            <div class="list btnList">
              <button @click="openModel(item)">审核通过</button>
              <button
                @click="bindProjectAggree(item.address, item.project_name, false, 200)"
              >
                审核不通过
              </button>
            </div>
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
    <van-action-sheet class="model" v-model:show="model" title="审核认领项目">
      <div class="content">
        <div class="inputBox">
          <div class="coinName">分配比例</div>
          <div class="inputDiv"><input v-model="percent" type="text" /> %</div>
        </div>
        <van-button
          :loading="withdrawLoading"
          class="modelBtn"
          size="small"
          @click="bindProject(selectedItem.address, selectedItem.project_name)"
          >审核通过</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { shortStr, formatDate } from "@/utils";
import { showToast } from "vant";

export default {
  name: "review",
  data() {
    return {
      active: 0,
      kolWaitAgreeList: [],
      projectWaitAgreeList: [],
      bindProjectWaitList: [],
      timer: null,
      model: false,
      percent: "",
      selectedItem: {},
    };
  },
  mounted() {
    this.getInfo();
    this.getProjectWaitAgreeList();
    this.getBindProjectWaitList();
    this.timer = setInterval(() => {
      this.getInfo();
      this.getProjectWaitAgreeList();
      this.getBindProjectWaitList();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    shortStr,
    formatDate,
    changeTabs(number) {
      this.active = number;
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
    statusFun(status) {
      switch (status) {
        case 0: {
          return "认证未审核";
        }
        case 1: {
          return "认证通过，未认领项目";
        }
        case 2: {
          return "已认领项目,未生效";
        }
        case 3: {
          return "待执行合约设置kol";
        }
        case 4: {
          return "项目kol已生效";
        }
        case 5: {
          return "项目kol设置执行失败";
        }
        case 6: {
          return "项目kol设置为失效";
        }
        case 7: {
          return "认证审核未通过";
        }
      }
    },
    getInfo() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/kol_wait_aggree_list")
        .then((res) => {
          this.kolWaitAgreeList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    adminAgree(list, agree) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol_admin/aggree", {
          admin_address: this.$store.state.address,
          kol_address: list.address,
          aggree: agree,
        })
        .then((res) => {
          this.getInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getProjectWaitAgreeList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_wait_aggree_list")
        .then((res) => {
          this.projectWaitAgreeList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    projectAgree(list, agree) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol_admin/project_aggree", {
          admin_address: this.$store.state.address,
          project_name: list.project_name,
          aggree: agree,
        })
        .then((res) => {
          showToast("审核通过");
          this.getProjectWaitAgreeList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getBindProjectWaitList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/bind_project_wait_aggre_list")
        .then((res) => {
          this.bindProjectWaitList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    bindProjectAggree(kol_address, project_name, aggree, percent) {
      this.$axios
        .post("https://smartbtc.io/bridge/kol_admin/bind_project_aggree", {
          admin_address: this.$store.state.address,
          kol_address,
          project_name,
          aggree,
          percent,
        })
        .then((res) => {
          showToast("审核通过");
          this.getBindProjectWaitList();
          this.model = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModel(item) {
      this.model = true;
      this.selectedItem = item;
    },
    bindProject(address, project_name) {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(this.percent) || this.percent * 1 > 100) {
        return showToast("请输入正确的分配比例");
      }
      this.bindProjectAggree(address, project_name, true, this.percent * 100);
    },
  },
};
</script>
<style lang="scss" scoped>
.kolContent {
  background-color: #fff;
  height: 100vh;
  overflow: auto;
  padding-bottom: 50px;
}
.header {
  background: #f5f5f5;
  width: 90%;
  height: 40px;
  margin: 20px auto;
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
.form {
  width: 90%;
  margin: 20px auto;
  padding: 20px 0;
  border-radius: 10px;
  background-color: #f5f5f5;
  font-size: 12px;
  font-weight: bold;
  .listBoxs {
    font-size: 12px;
    .listDiv {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .listS {
        width: 50%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 20px;
        color: #666;
        > span {
          width: 80px;
        }
        .inputBox {
          width: 80px;
        }
        input {
          width: 80%;
          height: 26px;
        }
      }
    }
    .title {
      font-size: 12px;
      text-align: left;
      padding-left: 20px;
      color: #111;
      margin-top: 20px;
      font-weight: bold;
    }
  }
  .list {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      width: 40%;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
      font-size: 12px;
    }
  }
  .btnList {
    margin-top: 30px;
  }
}

.btnBox {
  margin-top: 20px;
}

.listBox {
  padding: 0 20px;
  .list {
    box-shadow: 0 3px 10px #cfcece;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    .listContent {
      .listHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        .icon {
          width: 25px;
          margin-right: 10px;
        }
        .down {
          width: 16px;
          margin-left: auto;
        }
      }
      .contentList {
        text-align: left;
        margin-top: 20px;
        font-size: 12px;
        .contentL {
          background-color: #f5f5f5;
          padding: 10px 20px;
          border-radius: 10px;
          margin-bottom: 10px;
          > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 0;
          }
        }
      }
    }
  }
}
button {
  width: 48%;
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
  background: #ffc519;
  border: none;
  color: #333;
  font-weight: 600;
  font-size: 12px;
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
.mt-20 {
  margin-top: 20px;
}
.model {
  padding: 30px 0;
  .modelBtn {
    margin-bottom: 20px;
    height: 40px;
    font-size: 14px;
  }
  .inputBox {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    font-size: 14px;
    .inputDiv {
      margin-left: 40px;
      input {
        width: 100px;
        border: 1px solid #999;
        border-radius: 10px;
        height: 30px;
        padding: 5px 10px;
      }
    }
  }
}
</style>
