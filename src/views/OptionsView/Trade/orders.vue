<template>
  <div class="order">
    <div class="title">订单</div>
    <div class="tables">
      <van-tabs v-model:active="active">
        <van-tab title="当前持仓">
          <a-table
            :dataSource="dataSource"
            :columns="columns"
            rowKey="id"
            :expandRowByClick="true"
            :expandedRowKeys="expandedRowKeys"
            @expand="expandFun"
            :pagination="false"
            :bordered="false"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'id'">#</template>
              <template v-if="column.key === 'trade'">交易对</template>
              <template v-if="column.key === 'typeTime'">
                <div>期权类型</div>
                <div>开仓时间</div>
              </template>
              <template v-if="column.key === 'amount'">
                <div>开仓数量</div>
                <div>未实现盈亏</div>
              </template>
            </template>
            <!-- -->

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'id'"> {{ record.id }} </template>
              <template v-if="column.key === 'trade'">
                <div class="logos">
                  <img
                    :src="
                      record.name == 'BTC'
                        ? require('@/assets/img/btc.svg')
                        : require('@/assets/img/eth.svg')
                    "
                    alt=""
                  />
                  <div class="symbols">
                    {{
                      record.tokenInfo &&
                      record.tokenInfo.symbol.substring(0, 1)
                    }}
                  </div>
                </div>
              </template>
              <template v-if="column.key === 'typeTime'">
                <div :class="record.isBuy ? 'long' : 'short'">
                  {{ record.isBuy ? "做多" : " 做空" }}
                </div>
                <div>{{ record.startTime }}</div>
              </template>
              <template v-if="column.key === 'amount'">
                <div>
                  <span class="weight paddingRight">{{ record.amount }}</span>
                  <span>{{ record.name }}</span>
                </div>
                <div>
                  <span
                    :class="`${getActiveVolume(record) > 0 ? 'green' : 'red'}`"
                  >
                    <span>{{ getActiveVolume(record) > 0 ? "+" : "" }}</span>
                    <span>
                      {{ getActiveVolume(record) }}
                    </span>
                  </span>
                  <span>
                    {{ record.tokenInfo && record.tokenInfo.symbol }}</span
                  >
                </div>
              </template>
            </template>

            <template #expandedRowRender="{ record }">
              <div class="expandedBox">
                <div>
                  <div>开仓指数</div>
                  <div>{{ (record.openPrice * 1).toFixed(2) }}</div>
                </div>
                <div>
                  <div>标记指数</div>
                  <div>{{ USDPrice[record.name] }}</div>
                </div>
                <div>
                  <div>手续费</div>
                  <div>
                    {{ (record.tradingFee * 1).toFixed(2) }}
                    {{ record.tokenInfo.symbol }}
                  </div>
                </div>
                <div>
                  <div>已付权利金</div>
                  <div>
                    {{ (record.fundingFeePaid * 1).toFixed(2) }}
                    {{ record.tokenInfo.symbol }}
                  </div>
                </div>
              </div>
              <van-button @click="showCloseOrderFun(record)" class="closeOrder"
                >平仓</van-button
              >
            </template>
          </a-table>
        </van-tab>
        <van-tab title="历史交易">
          <a-table
            :dataSource="historySources"
            :columns="historyColumns"
            rowKey="id"
            :expandRowByClick="true"
            :expandedRowKeys="expandedHistoryRowKeys"
            @expand="expandHistoryFun"
            :pagination="false"
            :bordered="false"
          >
            <template #headerCell="{ column }">
              <template v-if="column.key === 'id'">#</template>
              <template v-if="column.key === 'trade'">交易对</template>
              <template v-if="column.key === 'typeTime'">
                <div>期权类型</div>
                <div>平仓时间</div>
              </template>
              <template v-if="column.key === 'amount'">
                <div>数量</div>
                <div>损益</div>
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'id'"> {{ record.id }} </template>
              <template v-if="column.key === 'trade'">
                <div class="logos">
                  <img
                    :src="
                      record.name == 'BTC'
                        ? require('@/assets/img/btc.svg')
                        : require('@/assets/img/eth.svg')
                    "
                    alt=""
                  />
                  <div class="symbols">
                    {{
                      record.tokenInfo &&
                      record.tokenInfo.symbol.substring(0, 1)
                    }}
                  </div>
                </div>
              </template>
              <template v-if="column.key === 'typeTime'">
                <div :class="record.isBuy ? 'long' : 'short'">
                  {{ record.isBuy ? "做多" : " 做空" }}
                </div>
                <div>{{ record.closeTimestamp }}</div>
              </template>
              <template v-if="column.key === 'amount'">
                <div>
                  <span class="weight paddingRight">{{ record.amount }}</span>
                  <span>{{ record.name }}</span>
                </div>
                <div>
                  <span
                    :class="`${
                      getHistoryVolume(record) * 1 > 0 ? 'green' : 'red'
                    }`"
                    >{{ getHistoryVolume(record) }}</span
                  >
                  <span>{{ record.tokenInfo && record.tokenInfo.symbol }}</span>
                </div>
              </template>
            </template>
            <template #expandedRowRender="{ record }">
              <div class="expandedBox">
                <div>
                  <div>开仓时间</div>
                  <div>{{ record.openTimestamp }}</div>
                </div>
                <div>
                  <div>平仓时间</div>
                  <div>{{ record.closeTimestamp }}</div>
                </div>
                <div>
                  <div>开仓指数</div>
                  <div>
                    {{ (record.openPrice * 1).toFixed(2) }}
                  </div>
                </div>
                <div>
                  <div>平仓指数</div>
                  <div>
                    {{ (record.closePrice * 1).toFixed(2) }}
                  </div>
                </div>
                <div>
                  <div>已付权利金</div>
                  <div>
                    {{ (record.fundingFee * 1).toFixed(2) }}
                    {{ record.tokenInfo.symbol }}
                  </div>
                </div>
              </div>
            </template>
          </a-table>
        </van-tab>
      </van-tabs>
    </div>

    <van-action-sheet
      class="closeOrderSheet"
      v-model:show="showCloseOrderSheet"
      title="平仓信息"
    >
      <div class="content">
        <div class="logos">
          <img
            :src="
              activeOrder.name == 'BTC'
                ? require('@/assets/img/btc.svg')
                : require('@/assets/img/eth.svg')
            "
            alt=""
          />
          <div class="symbols">
            {{
              activeOrder.tokenInfo.symbol &&
              activeOrder.tokenInfo.symbol.substring(0, 1)
            }}
          </div>
          <div>
            {{ activeOrder.name }}USD - {{ activeOrder.tokenInfo.symbol }}
          </div>
        </div>
        <div class="orderInfo">
          <div>
            <div>ID</div>
            <div>#{{ activeOrder.id }}</div>
          </div>
          <div>
            <div>期权类型</div>
            <div :class="activeOrder.isBuy ? 'green' : 'red'">
              {{ activeOrder.isBuy ? " 做多" : "做空" }}
            </div>
          </div>
          <div>
            <div>持仓数量</div>
            <div>{{ activeOrder.amount }} {{ activeOrder.name }}</div>
          </div>
          <div>
            <div>开仓指数</div>
            <div>{{ (activeOrder.openPrice * 1).toFixed(2) }}</div>
          </div>
          <div>
            <div>平仓指数</div>
            <div>{{ USDPrice[activeOrder.name] }}</div>
          </div>
          <div>
            <div>损益</div>
            <div>
              <span
                :class="`${getActiveVolume(activeOrder) > 0 ? 'green' : 'red'}`"
              >
                <span>{{ getActiveVolume(activeOrder) > 0 ? "+" : "" }}</span>
                <span>
                  {{ getActiveVolume(activeOrder) }}
                </span>
              </span>
              <span>{{ activeOrder.tokenInfo.symbol }}</span>
            </div>
          </div>
        </div>
        <van-button
          :loading="closeOrderLoading"
          class="closeSure"
          @click="closeOrder"
          >确认</van-button
        >
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import { getContract, getWriteContractLoad, formatNum } from "@/utils";
import perpetualOptionsAbi from "@/abi/perpetualOptions.json";
import erc20Abi from "@/abi/erc20.json";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { showToast } from "vant";
import { http } from "@/http/request";

export default {
  name: "order",
  props: ["orderInfo", "USDPrice"],
  data() {
    return {
      active: 0,
      timer: null,
      dataSource: [
        {
          key: "",
          name: "",
          address: "",
          amount: "",
        },
      ],

      columns: [
        {
          // title: ["#"],
          dataIndex: "id",
          key: "id",
          width: 10,
        },
        {
          // title: ["交易对"],
          dataIndex: "trade",
          key: "trade",
          width: 60,
        },
        {
          // title: ["期权类型", "开仓时间"],
          dataIndex: "typeTime",
          key: "typeTime",
          width: 120,
        },
        {
          // title: ["开仓数量", "未实现盈亏"],
          dataIndex: "amount",
          align: "right",
          key: "amount",
          width: 120,
        },
      ],
      expandedData: {},
      expandedRowKeys: [],
      expandedHistoryData: {},
      expandedHistoryRowKeys: [],

      historySources: [],
      historyColumns: [
        {
          // title: "#",
          dataIndex: "id",
          key: "id",
          width: 10,
        },
        {
          // title: "交易对",
          dataIndex: "trade",
          key: "trade",
          width: 60,
        },
        {
          // title: `期权类型  平仓类型`,
          dataIndex: "typeTime",
          key: "typeTime",
          width: 120,
        },
        {
          // title: "数量  损益",
          dataIndex: "amount",
          align: "right",
          key: "amount",
          width: 120,
        },
      ],
      showCloseOrderSheet: false,
      activeOrder: {},
      closeOrderLoading: false,
    };
  },
  computed: {
    slippage() {
      return this.$store.state.slippage;
    },
    selectCoinInfo() {
      return this.$store.state.selectedCoin;
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getActiveOrders(this.orderInfo);
    }, 5000);
  },
  methods: {
    formatNum,
    async getActiveOrders(orderInfo) {
      await getContract(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "queryOrdersInfo",
        orderInfo.orderIDs
      )
        .then(async (res) => {
          const orderList = [];
          for (let i = 0; i < res.length; i++) {
            let decimals = 0;
            await getContract(res[i].token, erc20Abi, "decimals").then(
              (decimal) => {
                decimals = decimal.toString();
              }
            );
            const list = {
              id: orderInfo.orderIDs[i].toString(),
              name: res[i].name,
              isBuy: res[i].isBuy,
              amount: this.formatNum(
                ethers.utils.formatUnits(res[i].amount, 18) * 1
              ),
              closePrice: res[i].closePrice.toString(),
              fundingFee: ethers.utils.formatUnits(res[i].fundingFee, 18),
              fundingFeePaid: ethers.utils.formatUnits(
                res[i].fundingFeePaid,
                decimals
              ),
              liquidationFee: ethers.utils.formatUnits(
                res[i].liquidationFee,
                18
              ),
              openPrice: ethers.utils.formatUnits(res[i].openPrice, 18),
              startTime: dayjs(res[i].startTime.toString() * 1000).format(
                "MM-DD HH:mm"
              ),
              startTimes: res[i].startTime.toString(),
              state: res[i].state,
              token: res[i].token,
              tradingFee: ethers.utils.formatUnits(res[i].tradingFee, decimals),
              holder: res[i].holder,
              tokenInfo: await this.getERC20Token(res[i].token),
            };
            orderList.push(list);
          }
          this.dataSource = orderList.sort(
            (a, b) => b.startTimes - a.startTimes
          );
        })
        .catch((err) => console.log(err));
    },

    // 获取token列表
    async getERC20Token(address) {
      const info = {
        address,
        name: await getContract(address, erc20Abi, "name"),
        symbol: await getContract(address, erc20Abi, "symbol"),
        decimals: await getContract(address, erc20Abi, "decimals"),
      };
      return info;
    },

    expandFun(expanded, record) {
      if (expanded) {
        this.expandedRowKeys = [record.id];
        this.expandedData = record;
      } else {
        let expandedRowKeys = this.expandedRowKeys.filter(
          (RowKey) => RowKey !== record.id
        );
        this.expandedRowKeys = expandedRowKeys;
      }
    },

    expandHistoryFun(expanded, record) {
      if (expanded) {
        this.expandedHistoryRowKeys = [record.id];
        this.expandedHistoryData = record;
      } else {
        let expandedHistoryRowKeys = this.expandedHistoryRowKeys.filter(
          (RowKey) => RowKey !== record.id
        );
        this.expandedHistoryRowKeys = expandedHistoryRowKeys;
      }
    },
    showCloseOrderFun(order) {
      this.showCloseOrderSheet = true;
      this.activeOrder = order;
    },
    async closeOrder() {
      this.closeOrderLoading = true;
      await getWriteContractLoad(
        this.$store.state.PerpetualOptionsAddr,
        perpetualOptionsAbi,
        "closeOrder",
        this.activeOrder.id * 1,
        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeOrder.name] *
            (1 - this.slippage / 100)
          ).toString(),
          18
        ),
        ethers.utils.parseUnits(
          (
            this.USDPrice[this.activeOrder.name] *
            (1 + this.slippage / 100)
          ).toString(),
          18
        )
      )
        .then((res) => {
          this.$emit("getAccountInfo");
          this.$emit("getMaxAmount");
          this.closeOrderLoading = false;
          showToast("平仓成功");
          this.showCloseOrderSheet = false;
        })
        .catch((err) => {
          console.log(err);
          this.showCloseOrderSheet = false;
          this.closeOrderLoading = false;
        });
    },
    // 获取历史交易订单
    async getHistoryOrders() {
      const url =
        "https://api.thegraph.com/subgraphs/name/garlicwilliam/shield-history-bsc";
      const query = `{
            orders(
              first: 100,
              orderBy: closeTimestamp,
              orderDirection: desc,
              where: {taker: "${this.$store.state.address}", status_gt: 0}
            ) {
              id,
              name,
              token,
              amount,
              isBuy,
              tradingFee,
              fundingFee,
              openPrice,
              openTimestamp,
              closePrice,
              closeTimestamp,
              status,
              positionProfit,
            }
         }`;
      const response = await http(url, query);
      const res = response.orders;

      const historyOrderList = [];
      for (let i = 0; i < res.length; i++) {
        let decimals = 0;
        await getContract(res[i].token, erc20Abi, "decimals").then(
          (decimal) => {
            decimals = decimal.toString();
          }
        );

        const positionProfit = res[i].isBuy
          ? ethers.utils.formatUnits(res[i].positionProfit, decimals) /
            ethers.utils.formatUnits(res[i].amount, 18)
          : (ethers.utils.formatUnits(res[i].positionProfit, decimals) /
              ethers.utils.formatUnits(res[i].amount, 18)) *
            -1;

        const list = {
          amount: this.formatNum(
            ethers.utils.formatUnits(res[i].amount, 18) * 1
          ),
          closePrice:
            res[i].positionProfit * 1 == 0
              ? ethers.utils.formatUnits(res[i].closePrice, 18) * 1
              : ethers.utils.formatUnits(res[i].closePrice, 18) * 1 +
                positionProfit * 1,
          closeTimestamp: dayjs(res[i].closeTimestamp.toString() * 1000).format(
            "MM-DD HH:mm"
          ),
          fundingFee: ethers.utils.formatUnits(res[i].fundingFee, decimals),
          id: res[i].id,
          isBuy: res[i].isBuy,
          name: res[i].name,
          openPrice: ethers.utils.formatUnits(res[i].openPrice, 18),
          openTimestamp: dayjs(res[i].openTimestamp.toString() * 1000).format(
            "MM-DD HH:mm"
          ),
          positionProfit: res[i].positionProfit,
          status: res[i].status,
          token: res[i].token,
          tokenInfo: await this.getERC20Token(res[i].token),
          tradingFee: res[i].tradingFee,
        };

        historyOrderList.push(list);
      }
      console.log("historyOrderList", historyOrderList);
      this.historySources = historyOrderList;
    },
    // 历史订单 获取收益
    getHistoryVolume(record) {
      if (record.isBuy) {
        const volume =
          (record.closePrice * 1 - record.openPrice * 1) * record.amount * 1;

        return volume > 0
          ? (volume - record.fundingFee * 1).toFixed(2)
          : `-${(record.fundingFee * 1).toFixed(2)}`;
      } else {
        const volume =
          (record.closePrice * 1 - record.openPrice * 1) * record.amount * 1;
        return volume < 0
          ? (volume * -1 - record.fundingFee * 1).toFixed(2)
          : `-${(record.fundingFee * 1).toFixed(2)}`;
      }

      // if (record.isBuy) {

      // } else {
      //   if (record.closePrice * 1 - record.openPrice * 1 >= 0) {
      //     const volume =
      //       (record.closePrice * 1 - record.openPrice * 1) * record.amount * 1 -
      //       record.fundingFee * 1;

      //     return volume > 0
      //       ? `+${(volume * 1).toFixed(2)}`
      //       : `${(volume * 1).toFixed(2)}`;
      //   }
      //   return `-${(record.fundingFee * 1).toFixed(2)}`;
      // }
    },

    // 当前活跃订单收益
    getActiveVolume(record) {
      const volume = this.USDPrice[record.name] - record.openPrice;
      if (record.isBuy) {
        if (volume > 0) {
          return (Math.abs(volume) * record.amount * 1).toFixed(2);
        } else {
          return (volume * record.amount * 1).toFixed(2);
        }
      } else {
        if (volume > 0) {
          return (volume * record.amount * -1).toFixed(2);
        } else {
          return (volume * record.amount * -1).toFixed(2);
        }
      }
    },
  },
  beforeUnmount() {
    clearInterval(this.timer); // 清除定时器
    this.timer = null;
  },
  watch: {
    orderInfo(value) {
      this.getActiveOrders(value);
      this.getHistoryOrders();
    },
    USDPrice() {
      this.getActiveOrders(this.orderInfo);
    },
    active(value) {
      value && this.getHistoryOrders();
    },
  },
};
</script>
<style lang="scss" scoped>
.order {
  width: 92%;
  margin: 0 auto;
  .title {
    font-size: 20px;

    text-align: left;
    margin-top: 30px;
  }

  .tables {
    background-color: #fff;
    border-radius: 5px;
    padding-bottom: 20px;
    margin-top: 10px;
    overflow: hidden;
    table {
      width: 100%;
    }
  }
}
::v-deep .ant-table {
  .ant-table-thead {
    font-size: 12px;
  }
  .ant-table-row {
    border: none;
  }
  .ant-table-cell {
    padding: 10px;
  }
  .ant-table-tbody {
    color: #666;
    font-size: 12px;
    > tr > td:first-child {
      min-width: 10px !important;
      width: 10px !important;
    }
    > tr > td:nth-child(2) {
      padding: 0;
    }
    .long {
      color: #15b384;
    }
    .short {
      color: #f55858;
    }
  }
  .ant-table-tbody .expandedBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    > div {
      width: 50%;
      color: #111;

      text-align: left;
      font-size: 14px;
      padding: 10px;
      > div:first-child {
        color: #666;
        font-size: 12px;
      }
    }
    > div:nth-child(2n) {
      text-align: right;
    }
  }
}
.closeOrder,
.closeSure {
  width: 100%;
  border-radius: 10px;
  border: none;
  margin-top: 20px;
  background-color: #ffc519;
}
.closeOrderSheet {
  .content {
    padding: 20px;
    border-top: 1px solid #f5f5f5;

    .orderInfo {
      padding: 10px 20px;
      background-color: #f5f5f5;
      border-radius: 5px;
      font-size: 14px;

      margin-top: 20px;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
      }
    }
  }
}

.logos {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 26px;
    height: 26px;
  }
}
.symbols {
  width: 26px;
  height: 26px;
  line-height: 26px;
  border: 2px solid #333;
  color: #333;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: #d5d4d4;
  text-align: center;
}
.green {
  color: #15b384;
  padding-right: 4px;
}
.red {
  color: #f55858;
  padding-right: 4px;
}
.weight {
  color: #111;
  font-size: 14px;
}
.paddingRight {
  padding-right: 2px;
}
</style>
