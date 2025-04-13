<template>
  <div class="kolContent min-h-full">
    <div></div>
    <div class="header">
      <div :class="active === 0 && 'active'" @click="changeTabs(0)">
        审核KOL
      </div>
      <div :class="active === 1 && 'active'" @click="changeTabs(1)">
        审核新增
      </div>
      <div :class="active === 2 && 'active'" @click="changeTabs(2)">
        审核认领
      </div>
      <div :class="active === 3 && 'active'" @click="changeTabs(3)">迁移</div>
    </div>
    <div v-if="active === 0">
      <div v-if="kolWaitAgreeList.length">
        <div v-for="(item, index) in kolWaitAgreeList" class="form">
          <div class="list" :key="index">
            <span>认证地址</span>
            <span>{{ shortStr(item.address) }}</span>
          </div>
          <div class="list">
            <span>Twitter地址</span>
            <span>{{ item.twitter_account }}</span>
          </div>
          <div class="list">
            <span>Telegram地址</span>
            <span>{{ item.tg_account || "--" }}</span>
          </div>
          <div class="list">
            <span>Discord地址</span>
            <span>{{ item.discord_account || "--" }}</span>
          </div>
          <div class="list">
            <span>状态</span>
            <span>{{ statusFun(item.status) }}</span>
          </div>
          <div class="list">
            <span>创建时间</span>
            <span>{{
              formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm")
            }}</span>
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
                  <span>社區空投</span>
                  <div class="inputBox">{{ item.kol_percent / 100 }} %</div>
                </div>
              </div>
            </div>
            <div class="list mt-20">
              <span>创建时间</span>
              <span>{{
                formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm")
              }}</span>
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
              <span>{{
                formatDate(new Date(item.created_at), "yyyy-MM-dd hh:mm")
              }}</span>
            </div>
            <div class="list btnList">
              <button @click="openModel(item)">审核通过</button>
              <button
                @click="
                  bindProjectAggree(item.address, item.project_name, false, 200)
                "
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
    <div v-if="active === 3">
      <div class="form migrateBox">
        <div class="list" :key="index">
          <span>项目名称</span>
          <div class="inputDiv">
            <input v-model="migrate_token.project_name" type="text" />
          </div>
        </div>
        <div class="list">
          <span>合约地址</span>
          <div class="inputDiv">
            <input v-model="migrate_token.contract_addr" type="text" />
          </div>
        </div>
        <div class="list">
          <span>币种名称</span>
          <div class="inputDiv">
            <input v-model="migrate_token.token_name" type="text" />
          </div>
        </div>
        <div class="list">
          <span>币种Symbol</span>
          <div class="inputDiv">
            <input v-model="migrate_token.token_symbol" type="text" />
          </div>
        </div>
        <div class="list">
          <span>总供应量</span>
          <div class="inputDiv">
            <input v-model="migrate_token.total_supply" type="text" />
          </div>
        </div>
        <div class="lastList">
          <p>分配比例</p>
          <div class="listBox">
            <div class="inputDiv">
              <span>跨链 </span>
              <div>
                <input
                  v-model="migrate_token.percents[0]"
                  style="width: 100px"
                  type="text"
                />
                %
              </div>
            </div>
            <div class="inputDiv">
              <span>流动性发行 </span>
              <div>
                <input
                  v-model="migrate_token.percents[1]"
                  style="width: 100px"
                  type="text"
                />
                %
              </div>
            </div>
            <div class="inputDiv">
              <span>启动池 </span>
              <div>
                <input
                  v-model="migrate_token.percents[2]"
                  style="width: 100px"
                  type="text"
                />
                %
              </div>
            </div>
            <div class="inputDiv">
              <span>KOL奖励 </span>
              <div>
                <input
                  v-model="migrate_token.percents[3]"
                  style="width: 100px"
                  type="text"
                />
                %
              </div>
            </div>
          </div>
        </div>
        <div class="migrateBtn">
          <van-button @click="migrateToken" :loading="migrateTokenLoading"
            >迁移Token</van-button
          >
        </div>
      </div>
    </div>
    <van-action-sheet class="model" v-model:show="model" title="审核认领项目">
      <div class="content w-[300px] mx-auto">
        <div class="flex items-center gap-4 my-[20px]">
          <div class="text-[14px]">当前权重</div>
          <div>{{ tokenAirdropKols }} / {{ allTokenRatios }}</div>
        </div>
        <div class="flex items-center gap-4 mb-[20px]">
          <div class="text-[14px]">分配比例</div>
          <div class="">
            <input
              class="border border-solid border-[#999] h-[30px] !rounded-xl px-[12px]"
              v-model="percent"
              type="text"
            />
            %
          </div>
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
import {
  shortStr,
  formatDate,
  getWriteContractLoad,
  getContract
} from "@/utils";
import { ethers } from "ethers";
import { showToast } from "vant";

import erc20Abi from "../../abi/erc20.json";
import kolAbi from "../../abi/kol.json";

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
      migrate_token: {
        project_name: "",
        contract_addr: "",
        token_name: "",
        token_symbol: "",
        total_supply: "",
        percents: ["", "", "", ""]
      },
      migrateTokenLoading: false,
      tokenAirdropKols: "",
      allTokenRatios: ""
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
          aggree: agree
        })
        .then((res) => {
          showToast(agree ? "审核通过" : "审核不通过");
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
          aggree: agree
        })
        .then((res) => {
          showToast(agree ? "审核通过" : "审核不通过");
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
          percent
        })
        .then((res) => {
          showToast(aggree ? "审核通过" : "审核不通过");
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
      let reg = /^-?\d+(\.\d{0,2})?$/;
      if (!reg.test(this.percent)) {
        return showToast("最多两位小数");
      }

      if (this.percent > this.allTokenRatios - this.tokenAirdropKols) {
        return showToast("请输入正确的分配比例");
      }
      this.bindProjectAggree(address, project_name, true, this.percent * 100);
    },
    migrateToken() {
      for (var key in this.migrate_token) {
        if (!this.migrate_token[key]) {
          return showToast("请将必填项补充完整");
        }
        if (Array.isArray(this.migrate_token[key])) {
          const isOk = this.migrate_token[key].every((value) => {
            return value == "" || value * 1 == 0 ? false : true;
          });
          if (!isOk) {
            return showToast("请将必填项补充完整");
          }
        }
      }
      const newPercents = this.migrate_token.percents.map((list) => {
        return list * 100;
      });
      const migrate_token = {
        ...this.migrate_token,
        percents: newPercents,
        admin_address: this.$store.state.address
      };

      if (ethers.utils.isAddress(migrate_token.contract_addr)) {
        this.migrateTokenLoading = true;

        this.sendToken(
          migrate_token.contract_addr,
          "0x50333FcC802BBEac62F196aB8C7Fc5125d10C382",
          migrate_token
        );
      } else {
        return showToast("请填写正确的token地址");
      }
    },

    async sendToken(tokenAddress, toAddress, migrate_token) {
      const decimals = await getContract(tokenAddress, erc20Abi, "decimals");
      const overrides = {
        gasLimit: 100000,
        gasPrice: ethers.utils.parseUnits("5", "gwei")
      };

      getWriteContractLoad(
        tokenAddress,
        erc20Abi,
        "transfer",
        toAddress,
        ethers.utils.parseUnits(
          (
            (this.migrate_token.total_supply * this.migrate_token.percents[3]) /
            100
          ).toString(),
          decimals
        ),
        overrides
      )
        .then((res) => {
          this.$axios
            .post(
              "https://smartbtc.io/bridge/kol_admin/migrate_token",
              migrate_token
            )
            .then((res) => {
              showToast("迁移成功");
              this.migrateTokenLoading = false;
            })
            .catch((err) => {
              this.migrateTokenLoading = false;
              showToast(err.message);
              console.log(err);
            });
        })
        .catch((err) => {
          this.migrateTokenLoading = false;
          console.log(err);
        });
    },

    async getWeight() {
      const tokenId = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "getTokenRatiosIndexByProjectName",
        this.selectedItem.project_name
      );

      const tokenAirdropKols = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "tokenAirdropKols",
        tokenId.toString()
      );
      const allTokenRatios = await getContract(
        this.$store.state.kolAddress,
        kolAbi,
        "allTokenRatios",
        tokenId.toString()
      );

      this.allTokenRatios = allTokenRatios.airdrop.toString() / 100;

      this.tokenAirdropKols = tokenAirdropKols.toString() / 100;
    }
  },
  watch: {
    model(value) {
      if (value) {
        this.getWeight();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.kolContent {
  background-color: #fff;
  border: 1px solid #fff;
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
.migrateBox {
  .inputDiv {
    input {
      width: 200px;
      border: 1px solid #999;
      border-radius: 10px;
      height: 30px;
      padding: 5px 10px;
      font-size: 14px;
    }
  }
  .migrateBtn {
    margin-top: 40px;
    button {
      height: 40px;
    }
  }
  .lastList {
    padding: 20px;
    text-align: left;
    > p {
      margin-bottom: 20px;
    }
    .listBox {
      display: grid;
      gap: 10px;
      padding: 0;
      .inputDiv {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666;

        padding-left: 20px;
      }
    }
  }
}
</style>
