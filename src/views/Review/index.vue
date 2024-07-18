<template>
  <div class="kolContent">
    <div class="header">
      <div :class="active === 0 && 'active'" @click="changeTabs(0)">审核KOL</div>
      <div :class="active === 1 && 'active'" @click="changeTabs(1)">审核认证</div>
    </div>
    <div v-if="!active">
      <div>
        <div class="form">
          <div class="list">
            <span>币种名称</span>
            <span>BNB</span>
          </div>
          <div class="list">
            <span>币种symbol</span>
            <span>BNB</span>
          </div>
          <div class="list">
            <span>发行数量</span>
            <span>10000000</span>
          </div>
          <div class="list">
            <span>合约地址</span>
            <span>0x321312g32131283213daw</span>
          </div>
          <div class="list btnBox">
            <van-button>审核通过</van-button>
            <van-button>审核不通过</van-button>
          </div>
        </div>
        <div class="form">
          <div class="list">
            <span>币种名称</span>
            <span>Ether</span>
          </div>
          <div class="list">
            <span>币种symbol</span>
            <span>ETH</span>
          </div>
          <div class="list">
            <span>发行数量</span>
            <span>2000000</span>
          </div>
          <div class="list">
            <span>合约地址</span>
            <span>0xdewqqw32131283213daw</span>
          </div>
          <div class="list btnBox">
            <van-button>审核通过</van-button>
            <van-button>审核不通过</van-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="listBox">
        <div class="list">
          <div class="listContent">
            <div class="listHeader">
              <img class="icon" src="../../assets/img/btc.svg" alt="" />
              <span>100T-BTC</span>
              <img class="down" src="../../assets//img/doubleDown.png" alt="" />
            </div>
            <div class="contentList">
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="listContent">
            <div class="listHeader">
              <img class="icon" src="../../assets/img/tokenList/brc20-merm.png" alt="" />
              <span>100T-MERM</span>
              <img class="down" src="../../assets//img/doubleDown.png" alt="" />
            </div>
            <div class="contentList">
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="listContent">
            <div class="listHeader">
              <img class="icon" src="../../assets/img/tokenList/brc20-bnb.png" alt="" />
              <span>100T-BNB</span>
              <img class="down" src="../../assets//img/doubleDown.png" alt="" />
            </div>
            <div class="contentList">
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="listContent">
            <div class="listHeader">
              <img class="icon" src="../../assets/img/tokenList/brc20-btcs.png" alt="" />
              <span>100T-BTCS</span>
              <img class="down" src="../../assets//img/doubleDown.png" alt="" />
            </div>
            <div class="contentList">
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
              <div class="contentL">
                <div>
                  <div>申请地址</div>
                  <div>0x2131231312</div>
                </div>
                <div>
                  <div>twitter地址</div>
                  <div>twitter.com/home</div>
                </div>
                <div>
                  <van-button>通过</van-button>
                  <van-button>不通过</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "review",
  data() {
    return {
      active: 1,
    };
  },
  methods: {
    changeTabs(number) {
      this.active = number;
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
</style>
