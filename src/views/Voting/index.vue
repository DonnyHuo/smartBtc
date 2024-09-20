<template>
  <div class="votingListBox">
    <div v-if="projectVotingList.length">
      <div
        v-for="(item, index) in projectVotingList"
        :key="index"
        class="votingList"
      >
        <div>
          <span>幣種名稱</span>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <span>幣種Symbol</span>
          <span>{{ item.symbol }}</span>
        </div>

        <div>
          <span>發行數量</span>
          <span>{{ item.total_supply }}</span>
        </div>
        <div class="listBox">
          <div class="title">發行比例</div>
          <div class="desc">
            專案方（KOL）可以藉鏡SBTC治理與回購方案，在專案營運發展中，不斷回購BSC鏈流通中的代幣轉入跨鏈橋合約，提高跨鏈額度直至100%。
          </div>
          <div class="listDiv">
            <div class="listS">
              <span>跨鏈橋合約 </span>
              <span>{{ item.cross_percent / 100 }}%</span>
            </div>
            <div class="listS">
              <span>LP兌換合約 </span>
              <span>{{ item.le_percent / 100 }}%</span>
            </div>
            <div class="listS">
              <span>啟動池合約 </span>
              <span>{{ item.lm_percent / 100 }}%</span>
            </div>
            <div class="listS">
              <span>KOL分配合約 </span>
              <span>{{ item.kol_percent / 100 }}%</span>
            </div>
          </div>
        </div>
        <div>
          <span>結束時間 </span>
          <span>{{
            formatDate(new Date(item.vote_end_time), "yyyy-MM-dd hh:mm")
          }}</span>
        </div>
        <div>
          <span>投票進度 </span>
          <!-- <span>{{ parseInt((item.vote_num * 100) / this.votePassNum) }} %</span> -->
          <div style="width: 80%">
            <van-progress
              :percentage="parseInt((item.vote_num * 100) / this.votePassNum)"
              stroke-width="8"
              text-color="#fff"
              pivot-color="#D9A504"
              color="#ffc519"
              track-color="#FFF2C9"
              :pivot-text="`投票中 ${parseInt(
                (item.vote_num * 100) / this.votePassNum
              )}%`"
            />
          </div>
        </div>
        <div class="records">
          <div class="recordTitle">投票記錄</div>
          <div
            class="recordList"
            v-for="(list, index) in item.projectVotes"
            :key="index"
          >
            <div>
              {{ shortStr(list.address) }}
            </div>
            <div>
              {{ formatDate(new Date(list.created_at), "yyyy-MM-dd hh:mm") }}
            </div>
          </div>
        </div>
        <div class="btnBox">
          <van-button :disabled="item.voted" @click="vote(item.project_name)"
            >投票支持</van-button
          >
        </div>
        <p class="desc center">
          現行投票規則：投票有效期限7天，投票門檻
          {{ repMinThreshold }} SBTC，投票完成門檻100票
        </p>
      </div>
    </div>
    <div v-else class="noData">
      <div>
        <img src="../../assets/img/noData.png" />
        <div>暫無數據</div>
      </div>
    </div>
  </div>
</template>
<script>
import erc20ABI from "../../abi/erc20.json";
import { getContract, formatDate, shortStr } from "@/utils";
import { ethers } from "ethers";
import { showToast } from "vant";

export default {
  data() {
    return {
      projectVotingList: [],
      repMinThreshold: 0,
      sBtcBalance: 0,
      timer: null,
      votePassNum: 0,
    };
  },
  mounted() {
    this.getSBtcBalance();
    this.getVotingList();
    this.getMinThreshold();

    this.timer = setInterval(() => {
      this.getVotingList();
    }, 5000);
  },
  unmounted() {
    clearInterval(this.timer);
  },

  methods: {
    formatDate,
    shortStr,
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
            const projectVotes = await this.projectVotes(data[i].project_name);
            console.log("projectVotes", projectVotes);
            data[i].voted = isVoted;
            data[i].projectVotes = projectVotes;
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
          this.votePassNum = res.data.data.vote_pass_nums;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async isVoted(project_name) {
      const data = await this.$axios.post(
        "https://smartbtc.io/bridge/kol/is_voted",
        {
          kol_address: this.$store.state.address,
          project_name,
        }
      );

      return data.data.data;
    },

    async projectVotes(project_name) {
      const data = await this.$axios.post(
        "https://smartbtc.io/bridge/kol/project_votes",
        {
          project_name,
          limit: 10,
        }
      );

      return data.data.data;
    },

    vote(project_name) {
      if (this.sBtcBalance * 1 < this.repMinThreshold * 1) {
        return showToast("SBTC餘額不足");
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
            this.getVotingList();
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
.votingListBox {
  height: calc(100vh - 60px);
  overflow: auto;
}
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
    font-family: Poppins-Medium;
  }
  .listBox {
    display: block;
    .title {
      margin-top: 20px;
    }

    .listDiv {
      //display: flex;
      //align-items: center;
      //justify-content: space-between;
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
      padding: 0 20px;

      .listS {
        height: 30px;
        display: flex;
        align-items: center;
        //justify-content: space-between;
        margin-top: 10px;
        //padding: 0 20px;
        color: #666;
        > span:last-child {
          padding-left: 10px;
        }
      }
    }
    .title {
      text-align: left;
      color: #111;
    }
  }
  .desc {
    font-size: 12px;
    color: #999;
    font-weight: 400;
    text-align: left;
    line-height: 20px;
    padding: 10px 0;
  }
  .center {
    text-align: center;
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
      font-family: Poppins-Medium;
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
.votingList {
  .records {
    text-align: left;
    display: inherit;
    .recordTitle {
      margin-bottom: 10px;
      color: #111;
      font-family: Poppins-Medium;
    }
    .recordList {
      padding: 5px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #999;
      font-weight: 400;
    }
  }
}
</style>
