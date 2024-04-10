<template>
  <div id="chartDiv">
    <div class="timeSelect">
      <div v-for="(item, index) in klineList">
        <div :key="index" @click="changeTime(index)">
          <span :class="item.active && 'active'">
            {{ item.name }}
          </span>
        </div>
      </div>
      <img src="@/assets/img/kline.png" alt="" />
    </div>
    <canvas ref="chartDiv" width="100%" height="300"></canvas>
  </div>
</template>
<script>
import { http } from "@/http/request";
import { Chart, registerables } from "chart.js";
import dayjs from "dayjs";

export default {
  name: "",
  props: ["activeTabs"],
  data() {
    return {
      dataList: [],
      config: {},
      klineList: [
        { name: "24小时", active: true, value: "" },
        { name: "1周", active: false, value: "" },
        { name: "1月", active: false, value: "" },
      ],
      index: 0,
      chart: "",
    };
  },
  computed: {
    queryList() {
      return [
        `{ hourDatas(
                where: {name: "${
                  !this.activeTabs ? "BTC" : "ETH"
                }", hourIndex_gte: 474083},
                orderBy: hourIndex,
                orderDirection: asc
            )
              {
                count,
                data
              }
        }`,

        `{
          dayDatas(
              where: {name: "${!this.activeTabs ? "BTC" : "ETH"}", dayIndex_gte: 19747},
              orderBy: dayIndex,
              orderDirection: asc) {
                  count,
                  data
              }
        }`,
        `{
          dayDatas(
              where: {name: "${!this.activeTabs ? "BTC" : "ETH"}", dayIndex_gte: 30},
              orderBy: dayIndex,
              orderDirection: asc) {
                  count,
                  data
              }
        }`,
      ];
    },
  },
  async mounted() {
    await this.getData();
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chartDiv;
      Chart.register(...registerables);
      this.chart = new Chart(ctx, this.config);
    },

    async getData(index = 0) {
      const url =
        "https://api.thegraph.com/subgraphs/name/garlicwilliam/chainlink-price-bsc";
      const query = this.queryList[index];
      const response = await http(url, query);
      const data = response.hourDatas || response.dayDatas;

      const newData = data.map((list) => {
        list.data = list.data.split(";");
        return list;
      });
      console.log("newData", newData);

      const labels = [];
      const dataBase = [];
      newData.map((list) => {
        list.data.map((item) => {
          labels.push(dayjs(item.split(",")[0] * 1000).format("MM-DD HH:mm:ss"));
          dataBase.push(item.split(",")[1] / 10 ** 8);
        });
      });

      console.log(labels, dataBase);

      const ctx = this.$refs.chartDiv.getContext("2d");
      console.log("ctx", ctx);
      const gradientStroke = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStroke.addColorStop(0, "rgba(255,197,25,0.3)");
      gradientStroke.addColorStop(1, "#fff");

      const totalDuration = 1000;
      const delayBetweenPoints = totalDuration / labels.length;
      const previousY = (ctx) =>
        ctx.index === 0
          ? ctx.chart.scales.y.getPixelForValue(100)
          : ctx.chart
              .getDatasetMeta(ctx.datasetIndex)
              .data[ctx.index - 1].getProps(["y"], true).y;

      const animation = {
        x: {
          type: "number",
          easing: "linear",
          duration: 1000,
          from: NaN, // the point is initially skipped
          delay(ctx) {
            if (ctx.type !== "data" || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
        y: {
          type: "number",
          easing: "linear",
          duration: 1000,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
          },
        },
      };
      const dataConfig = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              data: dataBase,
              borderColor: "#ffc519",
              borderWidth: 1,
              radius: 0,
              fill: true,
              backgroundColor: gradientStroke,
              spanGaps: true,
            },
          ],
        },
        options: {
          animation,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
              // ticks: {
              //   stepSize: 0.1,
              // },
            },
            y: {
              display: false,
              ticks: {
                display: false, // 去除 y 轴刻度数字
              },
            },
          },
        },
      };
      this.config = dataConfig;
    },

    async changeTime(index) {
      this.klineList.forEach((list, ind) => {
        list.active = ind === index;
      });
      this.index = index;
      await this.getData(index);
      this.chart.destroy();
      this.renderChart();
    },
  },
  watch: {
    async activeTabs() {
      await this.getData(this.index);
      this.chart.destroy();
      this.renderChart();
    },
  },
};
</script>
<style lang="scss" scoped>
#chartdiv {
  width: 100%;
  height: 300px;
}
.timeSelect {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 14px;
  img {
    width: 16px;
  }
  .active {
    color: #ffc519;
    font-weight: 600;
  }
}
</style>
