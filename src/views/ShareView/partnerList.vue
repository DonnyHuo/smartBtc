<template>
  <div>
    <Header title="我的好友" />
    <div class="partnerList">
      <div v-if="!zeroAddress" class="listBox">
        <div class="title">我的邀请者：</div>
        <div class="content">{{ getUpper }}</div>
      </div>
      <div v-if="getLowers.length > 0" class="listBox">
        <div class="title">被我邀请者：</div>
        <div v-for="(list, index) in getLowers" class="content">
          <div :key="index">{{ list.lower }}</div>
        </div>
      </div>
      <div class="noData" v-if="zeroAddress && getLowers.length == 0">
        <img src="../../assets/img/noData.png" alt="" />
        <div>暫無好友數據</div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "../../components/Header.vue";
import { ethers } from "ethers";
import { getContract, getOkChainId } from "@/utils";
import inviteABI from "../../abi/invite.json";

export default {
  name: "partnerList",
  data() {
    return {
      getUpper: "",
      getLowers: [],
      zeroAddress: true,
    };
  },
  components: {
    Header,
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getUpperFun();
      this.getLowersFun();
    }
  },
  methods: {
    async getUpperFun() {
      const res = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "getUpper",
        this.$store.state.address
      ).catch((err) => console.log(err));
      console.log("res1", res);
      this.getUpper = res;
      console.log(ethers);
      this.zeroAddress = ethers.constants.AddressZero == this.getUpper;
    },
    async getLowersFun() {
      const res = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "getLowers",
        this.$store.state.address
      ).catch((err) => console.log(err));
      console.log("res2", res);
      this.getLowers = res;
    },
  },
};
</script>
<style lang="scss" scoped>
.partnerList {
  padding-top: 60px;
  .listBox {
    padding: 20px;
    text-align: left;
    font-size: 14px;
    .title {
    }
    .content {
      background-color: #fff;
      padding: 10px;
      margin-top: 10px;
      border-radius: 10px;
      box-shadow: 0 3px 6px #cfcece;
      font-size: 13px;
    }
  }
  .noData {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;

    color: #8a8a8a;
    img {
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
    }
  }
}
</style>
