<template>
  <div>
    <div class="votingListBox">
      <div v-if="projectVotingList.length">
        <div v-for="(item, index) in projectVotingList" :key="index" class="votingList">
          <div>
            <span>项目名称</span>
            <span>{{ item.project_name }}</span>
          </div>
          <div>
            <span>币种名称</span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>币种Symbol</span>
            <span>{{ item.symbol }}</span>
          </div>

          <div>
            <span>发行数量</span>
            <span>{{ item.total_supply }}</span>
          </div>
          <div class="listBox">
            <div class="title">发行比例</div>
            <div class="listDiv">
              <div class="listS">
                <span>跨链</span>
                <span>{{ item.cross_percent / 100 }}%</span>
              </div>
              <div class="listS">
                <span>流动性发行</span>
                <span>{{ item.le_percent / 100 }}%</span>
              </div>
            </div>
            <div class="listDiv">
              <div class="listS">
                <span>启动池</span>
                <span>{{ item.lm_percent / 100 }}%</span>
              </div>
              <div class="listS">
                <span>社区空头</span>
                <span>{{ item.kol_percent / 100 }}%</span>
              </div>
            </div>
          </div>
          <div>
            <span>结束时间</span>
            <span>{{
              formatDate(new Date(item.vote_end_time), "yyyy-MM-dd hh:mm")
            }}</span>
          </div>
          <div class="btnBox">
            <van-button :disabled="item.isVoted" @click="vote(item.project_name)"
              >发起投票</van-button
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
  </div>
</template>
<script>
import erc20ABI from "../../abi/erc20.json";
import { getContract, formatDate } from "@/utils";
import { ethers } from "ethers";

export default {
  data() {
    return {
      projectVotingList: [],
      repMinThreshold: 0,
      sBtcBalance: 0,
    };
  },
  mounted() {
    this.getSBtcBalance();
    this.getVotingList();
    this.getMinThreshold();
  },
  methods: {
    formatDate,
    async getSBtcBalance() {
      const sBtcBalance = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "balanceOf",
        this.$store.state.address
      );
      const sBtcDecimals = await getContract(
        this.$store.state.sBtc,
        erc20ABI,
        "decimals"
      );
      this.sBtcBalance = ethers.utils.formatUnits(sBtcBalance, sBtcDecimals);
    },
    getVotingList() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/project_voting_list")
        .then(async (res) => {
          const data = res.data.data;
          if (data.length > 0) {
            this.getSBtcBalance();
          }
          for (let i = 0; i < data.length; i++) {
            const isVoted = await this.isVoted(data[i].project_name);
            data[i].voted = isVoted;
          }
          this.projectVotingList = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMinThreshold() {
      this.$axios
        .get("https://smartbtc.io/bridge/kol/min_threshold")
        .then((res) => {
          this.repMinThreshold = res.data.data.RepMinThreshold;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async isVoted(project_name) {
      const data = await this.$axios.post("https://smartbtc.io/bridge/kol/is_voted", {
        kol_address: this.$store.state.address,
        project_name,
      });

      return data.data.data;
    },
    vote(project_name) {
      console.log(
        "this.sBtcBalance * 1 < this.repMinThreshold",
        this.sBtcBalance * 1,
        this.repMinThreshold
      );
      if (this.sBtcBalance * 1 < this.repMinThreshold * 1) {
        return showToast("SBTC余额不足");
      }
      this.$axios
        .post("https://smartbtc.io/bridge/kol/vote", {
          address: this.$store.state.address,
          project_name,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message === "success") {
            showToast("投票成功");
          } else {
            showToast(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.votingList {
  background-color: #fff;
  border-radius: 10px;
  margin: 5%;
  padding: 20px;
  font-size: 12px;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .listBox {
    display: block;
    .title {
      margin-top: 20px;
    }
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
      }
    }
    .title {
      text-align: left;
      color: #111;
    }
  }
  .btnBox {
    margin-top: 30px;
    margin-bottom: 0;
    justify-content: center;
    button {
      width: 50%;
      height: 40px;
      border-radius: 10px;
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
</style>
