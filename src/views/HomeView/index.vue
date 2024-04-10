<template>
  <div class="home">
    <div class="homeLogoBox">
      <img class="homeLogo" src="../../assets/img/homeLogo1.png" alt="" />
    </div>
    <div class="wallet">
      <div>
        <div>當前連接錢包</div>
        <div>{{ shortStr($store.state.address) }}</div>
      </div>
      <div class="addressAndBalance">
        <span>100T 合约地址</span>
        <div class="tokenAddress">
          <a :href="link">{{ shortStr($store.state.t100) }}</a>
          <img
            @click="copyAddress($store.state.t100)"
            src="../../assets/img/copy.png"
            alt=""
            class="copyAddress"
          />
        </div>
      </div>
    </div>
    <div class="power">
      <div>
        <div><span>錢包餘額</span></div>
        <div class="data-num">{{ balance }} 100T</div>
        <a :href="`https://pancakeswap.finance/swap?outputCurrency=${$store.state.t100}`">
          <van-button>去購買</van-button>
        </a>
      </div>
      <div>
        <div><span> 質押算力 </span></div>
        <div class="data-num">{{ poolPowers }} H/S</div>
        <router-link to="lp" class="">
          <van-button>去質押</van-button>
        </router-link>
      </div>
      <div>
        <div><span> 邀請算力 </span></div>
        <div class="data-num">{{ invitePowers }} H/S</div>
        <router-link to="share?showPoster=true">
          <van-button>去邀請</van-button>
        </router-link>
      </div>
      <div class="apy">
        <span>實时APY</span>
        <span>{{ apy }}%</span>
        <router-link to="withdraw">
          <van-button>去领取</van-button>
        </router-link>
      </div>
    </div>
    <div class="contant">
      <div class="title">
        <div>BTC/BRC20 Staking Token 100T</div>
        <div>去中心化發行機制</div>
      </div>
      <div class="contantList">
        <div>
          <div>
            <div>
              <div>BTC和SBTC质押发行50%（1.05亿）</div>
              <div>BRC20-S协议，已支持质押SBTC</div>
            </div>
            <a href="https://www.okx.com/zh-hans/web3/defi/brc20-s">
              <van-button class="">BRC-20质押</van-button>
            </a>
          </div>
        </div>

        <div>
          <div>
            <div>
              <div>BRC-20质押发行20%（4200万）</div>
              <div>BRC20-S协议，首批支持质押</div>
              <div>ORDI、SATS、SBTC、RATS等</div>
            </div>
            <a href="https://www.okx.com/zh-hans/web3/defi/brc20-s">
              <van-button class="">BRC-20质押</van-button>
            </a>
          </div>
        </div>
        <div>
          <div>
            <div>流动池LP质押发行20%（4200万）</div>
            <router-link to="lp">
              <van-button class="">去參與</van-button>
            </router-link>
          </div>
          <!-- <div>
            <p class="addressCopy">
              <span>合约地址：</span>
              <a
                href="https://bscscan.com/address/0xCBa0580fa60C48b43556AdA557C426995488F24e"
              >
                {{ shortStr("0xCBa0580fa60C48b43556AdA557C426995488F24e") }}</a
              >
              <img
                class="copy"
                @click="copyAddress('0xCBa0580fa60C48b43556AdA557C426995488F24e')"
                src="../../assets/img/copy.png"
                alt=""
              />
            </p>
          </div> -->
        </div>
        <div>
          <div>
            <div>100T社区代币置换发行10%（2100万）</div>
            <div>
              <router-link to="swap">
                <van-button class=""> HECO跨鏈 </van-button>
              </router-link>
            </div>
          </div>
          <!-- <div class="hecoBuy">
            <div>
              <p class="addressCopy">
                <span>合约地址：</span>
                <a
                  href="https://bscscan.com/address/0x771e9e2321DF1fe9dE69fF6edFd9eBb22bcb6A1f"
                >
                  {{ shortStr("0x771e9e2321DF1fe9dE69fF6edFd9eBb22bcb6A1f") }}</a
                >
                <img
                  class="copy"
                  @click="copyAddress('0x771e9e2321DF1fe9dE69fF6edFd9eBb22bcb6A1f')"
                  src="../../assets/img/copy.png"
                  alt=""
                />
              </p>
            </div>
            <a href="http://100t.hk/#/home"
              ><van-button class="">HECO購買 </van-button></a
            >
          </div> -->
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="iconBox">
        <a href="https://SmartBTC.io">
          <img class="footerLogo" src="../../assets/img/footerLogo.png" alt="" />
        </a>
        <a href="https://twitter.com/SmartBTCdao">
          <img class="twiter" src="../../assets/img/twiter.png" alt="" />
        </a>
      </div>
      <div>专注比特币生态的VC DAO</div>
      <div>© 2024 SmartBTC.io</div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { shortStr, getContract, copy, getOkChainId } from "../../utils";
import erc20ABI from "../../abi/erc20.json";
import inviteABI from "../../abi/invite.json";
import poolABI from "../../abi/pool.json";
import { showToast } from "vant";

export default {
  name: "HomeView",
  data() {
    return {
      balance: "--",
      invitePowers: "--",
      poolPowers: "--",
      apy: "--",
      link: `https://bscscan.com/address/${this.$store.state.address}`,
    };
  },
  async created() {
    if (this.$store.state.address && (await getOkChainId())) {
      this.getBalance();
      this.totalInvitePowers();
      this.totalPoolPowers();
      this.getAPY();
    }
  },
  methods: {
    copyAddress(msg) {
      copy(msg);
      showToast("複製成功");
    },
    shortStr,
    async getBalance() {
      if (this.$store.state.t100 && this.$store.state.address) {
        const balanceOf = await getContract(
          this.$store.state.t100,
          erc20ABI,
          "balanceOf",
          this.$store.state.address
        ).catch((err) => console.log(err));
        const decimals = await getContract(
          this.$store.state.t100,
          erc20ABI,
          "decimals"
        ).catch((err) => console.log(err));
        this.balance = (ethers.utils.formatUnits(balanceOf, decimals) * 1).toFixed(6);
      }
    },

    async totalInvitePowers() {
      const invitePower = await getContract(
        this.$store.state.inviteAddress,
        inviteABI,
        "getInvitePower",
        this.$store.state.address
      ).catch((err) => console.log(err));
      this.invitePowers = (invitePower.toString() * 1).toFixed(2);
    },
    async totalPoolPowers() {
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

    async getAPY() {
      const apy = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "perBlockAndLpRewardPools"
      ).catch((err) => console.log(err));
      const MTokenAddress = await getContract(
        this.$store.state.poolAddress,
        poolABI,
        "getMTokenPrice"
      ).catch((err) => console.log(err));
      this.apy = (
        ethers.utils.formatUnits(apy, 8) *
        24 *
        60 *
        20 *
        365 *
        ethers.utils.formatUnits(MTokenAddress, this.$store.state.usdtDecimals) *
        100
      ).toFixed(2);
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  height: calc(100vh - 50px);
  font-size: 14px;
  overflow: auto;
}
.homeLogoBox {
  background: #fff;
  height: 50px;
  display: flex;
  padding: 10px 15px;
  .homeLogo {
    height: 30px;
  }
}

.wallet {
  background: #fff;
  color: #111;
  padding: 10px 20px;
  font-weight: 600;
  border-bottom: 1px solid #eeeeee;
  > div {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tokenAddress {
      display: flex;
      align-items: center;
      a {
        text-decoration: underline;
      }
    }
    .copyAddress {
      width: 14px;
      height: 14px;
      margin-left: 4px;
    }
  }
}
.power {
  background-color: #fff;
  padding: 20px;
  font-weight: 600;
  > div {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-button {
      height: 30px;
      padding: 4px 10px;
      border-radius: 4px;
      background: #ffc519;
      border: none;
      color: #333;
      font-weight: 600;
      font-size: 12px;
    }
  }
}
.contant {
  padding: 20px 0;
  background-size: 100% 100%;
  background-color: #fff;
  padding: 20px;
  border-top: 1px solid #eeeeee;
  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
    > div:nth-child(2) {
      color: #919090;
      font-weight: 500;
      font-size: 14px;
    }
  }
  .contantList {
    > div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      text-align: left;
      padding: 10px 0;
      > div {
        font-weight: 600;
        font-size: 14px;
        line-height: 30px;
        &:nth-child(1) {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
  .apy {
    padding: 20px 0;
    font-weight: 600;
  }
  .loading {
    position: relative;
    img {
      margin: 0 auto;
      width: 60%;
    }
    .loading1 {
      position: absolute;
      bottom: 20px;
      left: 60%;
      transform: translate(-50%);
    }
  }
  button {
    height: 30px;
    padding: 4px 10px;
    border-radius: 4px;
    background: #ffc519;
    border: none;
    color: #333;
    font-weight: 600;
    font-size: 12px;
    .van-button__text {
      p {
        color: #333;
        font-weight: 600;
        font-size: 12px;
      }
    }
  }
  .addressCopy {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    a {
      text-decoration: underline;
    }
  }
  .copy {
    width: 15px;
    height: 15px;
    margin-left: 4px;
  }
  .hecoBuy {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.footer {
  padding: 20px 30px 30px 30px;
  background-color: #fff;
  font-size: 16px;
  color: #111;
  font-weight: 500;
  border-top: 1px solid #eeeeee;
  .iconBox {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 20px;
    .footerLogo {
      width: 60px;
    }
    .twiter {
      width: 30px;
    }
  }

  > div:last-child {
    font-size: 12px;
    color: #333;
    padding-top: 10px;
  }
}
</style>
