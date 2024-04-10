<template>
  <div class="shareBox">
    <div class="header">
      <div class="header-item">
        <div class="pool-title">我的算力</div>
        <div class="force-num">{{ shortStr($store.state.address) }}</div>
      </div>
      <div class="header-item">
        <div class="name">邀請算力</div>
        <div class="force-num">{{ invitePowers }} H/S</div>
      </div>
      <div class="header-item">
        <div class="name">邀請提速</div>
        <div class="num">
          {{ invitePowers == "--" ? invitePowers : (invitePowers / 100).toFixed(2) }} %
        </div>
      </div>
      <div class="header-item">
        <div class="name">質押算力</div>
        <div class="num">{{ poolPowers }} H/S</div>
      </div>
      <div class="header-desc">
        <p>*每個被邀請人完成一筆質押後均貢獻邀請算力；</p>
        <p>*只有質押算力&gt;0時，邀請算力才能提供實際收益；</p>
        <p>*質押算力越大，邀請算力提速收益越高。</p>
      </div>
    </div>
    <div class="data-group">
      <div class="pool-title">礦池總算力</div>
      <div class="data-item">
        <div class="big">
          <div class="big-item">
            <div class="name">質押算力</div>
            <div class="data">{{ totalPoolPowers }} H/S</div>
          </div>
        </div>
      </div>
      <div class="data-item">
        <div class="big big-two">
          <div class="big-item big-item-two">
            <div class="name">邀請算力</div>
            <div class="data">{{ totalInvitePowers }} H/S</div>
          </div>
        </div>
      </div>
    </div>
    <div class="blank"></div>
    <div>
      <div class="btn-group">
        <div @click="shareBox" class="invite-btn">分享好友</div>
        <div class="friend-btn"><router-link to="partner">我的好友</router-link></div>
      </div>
    </div>
    <van-overlay :show="show" @click="show = false">
      <div class="overlayBox">
        <img class="inviteBg" src="../../assets/img/inviteBg.jpeg" alt="" />
        <div class="copyUrl">
          <div>http://100t.hk</div>
          <div class="copyUrlBox">
            <span>複製分享連結</span>
            <img
              @click="copyUrlFun(`${href}?inviteAddress=${$store.state.address}`)"
              src="../../assets/img/copyUrl.png"
              alt=""
            />
          </div>
        </div>
        <div class="qrcode">
          <qrcode-vue
            :value="`${href}?inviteAddress=${$store.state.address}`"
            size="100"
            level="H"
          />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { shortStr, copy, getContract, getWriteContract, getOkChainId } from "@/utils";
import QrcodeVue from "qrcode.vue";
import { showToast } from "vant";
import inviteABI from "../../abi/invite.json";
import poolABI from "../../abi/pool.json";
import { showConfirmDialog } from "vant";

export default {
  name: "ShareView",
  data() {
    return {
      show: false,
      invitePowers: "--",
      poolPowers: "--",
      totalInvitePowers: "--",
      totalPoolPowers: "--",
      href: window.location.href,
    };
  },
  components: { QrcodeVue },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.invitePowersFun();
      this.poolPowersFun();
      this.totalPoolPowersFun();
      this.totalInvitePowersFun();
      if (this.$route.query.inviteAddress) {
        showConfirmDialog({
          title: "接收邀请",
          message: `是否接收来自${this.$route.query.inviteAddress}的邀请？`,
        })
          .then(() => {
            this.registerFun();
          })
          .catch(() => {
            const path = this.$route.path; // 先获取路由路径
            this.$router.push(path);
          });
      }
    }
  },
  methods: {
    shortStr,
    shareBox() {
      this.show = true;
    },
    copyUrlFun(msg) {
      copy(msg);
      showToast("複製成功");
    },
    async invitePowersFun() {
      const invitePower = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "getInvitePower",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.invitePowers = (invitePower.toString() * 1).toFixed(2);
    },
    async poolPowersFun() {
      const poolPower = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getUserBalance",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.poolPowers = (
        ethers.utils.formatUnits(poolPower, this.$store.state.usdtDecimals) * 1
      ).toFixed(2);
    },
    async totalInvitePowersFun() {
      const invitePower = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "totalInvitePowers"
      ).catch((err) => console.log(err));
      this.totalInvitePowers = (invitePower.toString() * 1).toFixed(2);
    },
    async totalPoolPowersFun() {
      const poolPower = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "poolsTotalPowers"
      ).catch((err) => console.log(err));
      this.totalPoolPowers = (
        ethers.utils.formatUnits(poolPower, this.$store.state.usdtDecimals) * 1
      ).toFixed(2);
    },

    async registerFun() {
      await getWriteContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "register",
        this.$store.state.address,
        this.$route.query.inviteAddress
      )
        .then(() => {
          showToast("被請求成功");
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
<style scoped lang="scss">
.shareBox {
  border-bottom: 1px solid transparent;
  padding-top: 20px;
  height: 100vh;
  overflow: auto;
  .header {
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.5em;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    box-shadow: 0 3px 10px #cfcece;
    .header-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      height: 50px;
      font-size: 14px;
      .name {
        font-weight: 600;
      }
      .pool-title {
        font-weight: 600;
        text-align: left;
      }
      .force-num {
        display: flex;
        align-items: center;
        font-weight: 400;
      }
    }
    .header-desc {
      font-size: 12px;
      color: #999;
      text-align: left;
      padding-top: 10px;
      line-height: 20px;
    }
  }
  .data-group {
    width: 90%;
    border-radius: 10px;
    margin: 20px auto 0 auto;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0 3px 10px #cfcece;
    .pool-title {
      font-size: 14px;
      font-weight: 600;
      text-align: left;
    }
    .data-item {
      width: 100%;
      margin: 10px auto 15px auto;
      text-align: left;
      .big {
        min-height: 60px;
        border-radius: 10px;
        width: 100%;
        margin: 0 auto;
        background: url("../../assets/img/pool.png") no-repeat 100%
          rgba(37, 226, 177, 0.2);
        background-size: auto 100%;
        display: flex;
        align-items: center;
        padding: 10px 0 15px 20px;
        box-sizing: border-box;
        .big-item {
          margin-right: 30px;
          .name {
            font-weight: 700;
            color: #16172a;
            font-size: 13px;
            margin: 10px 0;
          }
        }
      }
      .big-two {
        background: url("../../assets/img/invite.png") no-repeat 100%
          rgba(151, 127, 241, 0.2);
      }
    }
  }
  .btn-group {
    width: 90%;
    margin: 30px auto 100px auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    div {
      width: 48%;
      height: 40px;
      border-radius: 5px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #2a2b33;
      font-weight: 700;
    }
    .invite-btn {
      background-color: #ffc519;
    }
    .friend-btn {
      background: #16172a;
      color: #fff;
    }
  }
  .overlayBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: relative;
  }
  .inviteBg {
    width: 88%;
    height: auto;
  }
  .qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    background-color: #fff;
    position: absolute;
    bottom: 40px;
    right: 40px;
  }
  .copyUrl {
    position: absolute;
    left: 50px;
    bottom: 60px;
    > div {
      color: #fff;
      text-align: left;
      font-size: 14px;
    }
    .copyUrlBox {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffc519;
      font-size: 14px;
      margin-top: 4px;
      img {
        width: 16px;
        height: 16px;
        margin-left: 6px;
      }
    }
  }
}
</style>
