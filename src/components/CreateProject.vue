<template>
  <div>
    <div class="w-[200px] h-[200px] mb-[20px] m-auto">
      <van-uploader
        v-model="fileList"
        :max-size="500 * 1024"
        max-count="1"
        preview-size="200px"
        ><img
          class="w-[200px] h-[200px] mb-[20px]"
          src="../assets/img/upload.png"
          alt=""
      /></van-uploader>
    </div>

    <div
      class="h-[40px] border border-solid border-[#E2E2E2] bg-[#FCFCFC] flex items-center rounded-lg p-1 text-[12px]"
    >
      <div
        v-if="
          (activeAmount * 1 >= 1 && activeAmount * 1 < 2100) ||
          activeAmount * 1 == 0
        "
        class="w-1/2 h-full flex items-center justify-center"
        :class="
          activeIndex === 0
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(0)"
      >
        联合KOL模式
      </div>
      <div
        v-if="activeAmount * 1 >= 10000 || activeAmount * 1 == 0"
        class="w-1/2 h-full flex items-center justify-center"
        :class="
          activeIndex === 1
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(1)"
      >
        单一KOL模式
      </div>
      <div
        v-if="
          (activeAmount >= 2100 && activeAmount * 1 < 10000) ||
          activeAmount * 1 == 0
        "
        class="w-1/2 h-full flex items-center justify-center"
        :class="
          activeIndex === 2
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(2)"
      >
        铭文做市商模式
      </div>
    </div>

    <div v-if="activeIndex == 0" class="text-left">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">代币全称</div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeOne.brc20_name"
              placeholder="自定义"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">股票代码</div>
          <div>
            <input
              class="w-full disabled:bg-[#f5f5f5] text-[12px]"
              type="text"
              v-model="typeOne.symbol"
              placeholder="自定义"
            />
          </div>
        </div>
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          代币总量10亿，按比例分配至如下合约地址
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">公平发射合约</span>
            <div>
              {{ typeOne.percents[0] }}
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">启动池合约</span>

            <div>{{ typeOne.percents[3] }} %</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">LP添加合约</span>
            <div>
              {{ typeOne.percents[1] }}
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">KOL空投合约</span>
            <div>
              {{ typeOne.percents[2] }}
              %
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div
          class="border border-solid border-[#000] rounded-[4px] h-[40px] flex items-center gap-4 px-4 text-[14px] my-4 relative"
          @click="this.showList = true"
        >
          <span>{{ selectedToken.mint_base_token }}</span>
          <span>
            1 {{ selectedToken.mint_base_token }} =
            {{ selectedToken.exchange_rate }} 代币</span
          >
          <span
            class="rounded-[20px] bg-[#FFBB00] p-1 absolute right-3 top-2.5"
          >
            <img class="w-[10px]" src="../assets/img/arrowDown.png" alt="" />
          </span>
        </div>

        <div
          v-if="showList"
          class="border border-solid border-[#333] rounded-sm absolute top-[40px] left-0 w-full bg-white px-4"
        >
          <div
            v-for="(item, index) in selectTokenList"
            :key="index"
            class="text-[14px] h-[40px] flex items-center gap-4"
            @click="selectTokenFun(item)"
          >
            <span>{{ item.mint_base_token }}</span>
            <span>
              1 {{ item.mint_base_token }} = {{ item.exchange_rate }} 代币</span
            >
          </div>
        </div>
      </div>
      <div class="text-[12px] text-[#D90007] mt-4 leading-4">{{ text }}</div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenDescription") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeOne.details"
            :placeholder="$t('newData.description')"
          />
        </div>
      </div>
    </div>

    <div v-if="activeIndex == 1" class="text-left">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">代币全称</div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeTwo.brc20_name"
              placeholder="自定义"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">股票代码</div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeTwo.symbol"
              placeholder="自定义"
            />
          </div>
        </div>
      </div>
      <!-- 
      <div v-if="activeIndex == 1" class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.deployInscriptionId") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeTwo.brc20_id"
          />
        </div>
      </div> -->
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          代币总量10亿，按比例分配至如下合约地址
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">公平发射合约</span>
            <div>{{ typeTwo.percents[0] }}%</div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.kolRewards") }}</span>

            <div>{{ typeTwo.percents[3] }}%</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.lpAddition") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px] text-right"
                type="text"
                v-model="typeTwo.percents[1]"
                placeholder="> 0"
              />
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.launchPool") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px] text-right"
                type="text"
                v-model="typeTwo.percents[2]"
                placeholder="> 0"
                @change="changeStartPool"
              />
              %
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div
          class="border border-solid border-[#000] rounded-[4px] h-[40px] flex items-center gap-4 px-4 text-[14px] my-4 relative"
          @click="this.showList = true"
        >
          <span>{{ selectedToken.mint_base_token }}</span>
          <span>
            1 {{ selectedToken.mint_base_token }} =
            {{ selectedToken.exchange_rate }} 代币</span
          >
          <span
            class="rounded-[20px] bg-[#FFBB00] p-1 absolute right-3 top-2.5"
          >
            <img class="w-[10px]" src="../assets/img/arrowDown.png" alt="" />
          </span>
        </div>

        <div
          v-if="showList"
          class="border border-solid border-[#333] rounded-sm absolute top-[40px] left-0 w-full bg-white px-4"
        >
          <div
            v-for="(item, index) in selectTokenList"
            :key="index"
            class="text-[14px] h-[40px] flex items-center gap-4"
            @click="selectTokenFun(item)"
          >
            <span>{{ item.mint_base_token }}</span>
            <span>
              1 {{ item.mint_base_token }} = {{ item.exchange_rate }} 代币</span
            >
          </div>
        </div>
      </div>
      <div class="text-[12px] text-[#D90007] mt-4 leading-4">{{ text }}</div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">代幣描述</div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeTwo.details"
            :placeholder="$t('newData.description')"
          />
        </div>
      </div>
    </div>

    <div v-if="activeIndex == 2" class="text-left">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.token") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeThree.brc20_name"
              :placeholder="$t('newData.sameNameAsInscription')"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("newData.totalSupply") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeThree.brc20_supply"
              :placeholder="$t('newData.equalAmountToInscription')"
            />
          </div>
        </div>
      </div>

      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.deployInscriptionId") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeThree.brc20_id"
          />
        </div>
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenRatio") }}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("newData.inscriptionCrossChain")
            }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeThree.percents[0]"
              />
              %
            </div>
            <!-- <div v-if="activeIndex === 1">
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeThree.percents[0]"
                placeholder=">=50"
              />
            </div>
            <div v-else>50%</div> -->
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.kolRewards") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px]"
                type="text"
                v-model="typeThree.percents[3]"
              />
              %
            </div>
            <!-- <div v-if="activeIndex === 1">
              <input
                class="w-[60px] !h-[30px]"
                type="text"
                v-model="typeThree.percents[3]"
                placeholder="<=20"
              />
            </div>
            <div v-else>20%</div> -->
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.lpAddition") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] disabled:bg-[#f5f5f5] text-[12px] text-right"
                type="text"
                v-model="typeThree.percents[1]"
              />
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.launchPool") }}</span>
            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px] text-right"
                type="text"
                v-model="typeThree.percents[2]"
              />
              %
            </div>
          </div>
        </div>
      </div>
      <div
        class="!text-black text-[12px] mt-[20px] border-0 border-b border-t border-solid border-[#E8E8E8] py-2"
      >
        {{ $t("newData.launchPoolNote") }}
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("newData.tokenDescription") }}
        </div>
        <div>
          <input
            class="w-full text-[12px]"
            type="text"
            v-model="typeThree.details"
            :placeholder="$t('newData.description')"
          />
        </div>
      </div>
    </div>

    <div class="w-full text-center my-[20px]">
      <van-button
        class="!bg-[#ffc519] w-full !text-black !border-0"
        @click="newProject"
        >{{ $t("kolAdd.submit") }}</van-button
      >
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { showToast, showConfirmDialog } from "vant";

import { copy, getContract } from "@/utils";

import depositAbi from "../abi/deposit.json";

export default {
  name: "creatProject",
  data() {
    return {
      activeIndex: 0,
      typeOne: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: "1000000000",
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["45", "20", "20", "15"],
      },
      typeTwo: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: "1000000000",
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["45", "", "", "15"],
      },
      typeThree: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: "",
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["", "", "", ""],
      },
      text: "* 公平发射进度达 100% 时，合约自动将募集到的全部资金与启动池代币组合创建 LP 并转入黑洞地址销毁，开盘价约为公平发射价的 300%",

      selectedToken: {
        mint_base_token: "BNB",
        mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
        exchange_rate: "22500000",
      },
      selectTokenList: [
        {
          mint_base_token: "BNB",
          mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
          exchange_rate: "22500000",
        },
        {
          mint_base_token: "USDT",
          mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
          exchange_rate: "1000",
        },
        {
          mint_base_token: "SOS",
          mint_base_token_addr: "0x1d887F723F77b2F8C99BED8B94F4e3BA71BAF70e",
          exchange_rate: "200",
        },
      ],
      showList: false,
      fileList: [],
      logoUrl: "",
      accountInfo: this.$store.state.accountInfo,
      activeAmount: 0,
    };
  },
  mounted() {
    this.getActiveAmount();
  },

  methods: {
    async getActiveAmount() {
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      console.log("res", res);
      this.activeAmount = (ethers.utils.formatUnits(res, 18) * 1).toFixed(2);

      this.$store.commit(
        "setActiveAmount",
        (ethers.utils.formatUnits(res, 18) * 1).toFixed(2)
      );
    },
    selectTokenFun(item) {
      this.selectedToken = item;
      this.showList = false;
    },
    changeActiveIndex(index) {
      this.activeIndex = index;
    },
    copyAddress(msg) {
      copy(msg);
      showToast(this.$t("copySuccess"));
    },
    changeStartPool(value) {
      console.log("value", value.target.value);
      this.typeTwo.percents[1] = 30 - value.target.value;
    },
    newProject() {
      if (this.accountInfo.status !== 1) {
        showToast("请先完成KOL认证且SOS质押");
        return;
      }

      let project_info = "";
      if (this.activeIndex == 0) {
        project_info = {
          brc20_name: this.typeOne.brc20_name,
          brc20_id: this.typeOne.brc20_id,
          brc20_supply: this.typeOne.brc20_supply,
          symbol: this.typeOne.symbol,
          total_supply: this.typeOne.brc20_supply,
          details: this.typeOne.details,
          percents: this.typeOne.percents.map((list) => list * 100),
          project_type: 0,
          logo_url: this.logoUrl,
          ...this.selectedToken,
        };

        console.log("project_info", project_info);
      } else if (this.activeIndex == 1) {
        project_info = {
          brc20_name: this.typeTwo.brc20_name,
          brc20_id: this.typeTwo.brc20_id,
          brc20_supply: this.typeTwo.brc20_supply,
          symbol: this.typeTwo.symbol,
          total_supply: this.typeTwo.brc20_supply,
          details: this.typeTwo.details,
          percents: this.typeTwo.percents.map((list) => list * 100),
          project_type: 1,
          brc20_id: "",
          logo_url: this.logoUrl,
          ...this.selectedToken,
        };
      } else {
        project_info = {
          brc20_name: this.typeThree.brc20_name,
          brc20_supply: this.typeThree.brc20_supply,
          symbol: this.typeThree.brc20_name,
          total_supply: this.typeThree.brc20_supply,
          details: this.typeThree.details,
          percents: this.typeThree.percents.map((list) => list * 100),
          project_type: 2,
          logo_url: this.logoUrl,
          brc20_id: "",
        };
      }

      if (
        project_info.brc20_name &&
        project_info.brc20_supply &&
        project_info.total_supply &&
        project_info.percents.every((list) => list !== "")
      ) {
        showConfirmDialog({
          title: `${this.$t("kolAdd.tips[1]", {
            name: project_info.name,
          })}`,
          message: this.$t("kolAdd.tips[2]"),
          confirmButtonText: this.$t("sure"),
          cancelButtonText: this.$t("cancel"),
        })
          .then(() => {
            this.$axios
              .post("https://smartbtc.io/bridge/kol/new_project", {
                kol_address: this.$store.state.address,
                project_info,
              })
              .then((res) => {
                showToast(this.$t("kolAdd.success"));
              })
              .catch((err) => {
                console.log(err);
                showToast(err);
              });
          })
          .catch(() => {
            // on cancel
          });
      } else {
        showToast(this.$t("kolAdd.error"));
      }
    },

    uploadImage(fileList) {
      const formData = new FormData();
      console.log("fileList", fileList[0]);
      formData.append("image", fileList[0].file);
      return this.$axios
        .post("https://smartbtc.io/images/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          return `https://smartbtc.io${res?.data?.url}`;
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          throw err;
        });
    },
  },
  watch: {
    fileList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.uploadImage(newVal)
            .then((url) => {
              this.logoUrl = url;
            })
            .catch((err) => {
              console.error("Upload failed:", err);
            });
        }
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.kolContent {
  font-size: 12px;
}
.header {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #fff;
}
.form {
  padding: 20px 0;
  border-radius: 10px;
  background-color: #fff;
  text-align: left;
}
.list {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    color: #111;
  }
}
.listBox {
  .title {
    margin-top: 20px;
    color: #111;
    text-align: left;
    padding-left: 20px;
  }
  .listDiv {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(80%, 1fr));
    padding: 0 20px;
    margin-top: 10px;

    .listS {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #666;
      padding: 0 10px;
      .inputBox {
        width: 80px;
      }
      input {
        width: 80%;
        height: 26px;
        padding: 0 10px;
        font-size: 12px;
      }
    }
  }
}
input {
  border: 1px solid #a1a1a1;
  border-radius: 4px;
  height: 40px;
  padding: 0 10px;
  background-color: transparent;
}
.sure {
  margin-top: 10px;
  text-align: center;
  button {
    width: 90%;
    border-radius: 10px;
    background: #ffc519;
    border: none;
    color: #333;
  }
}
.desc {
  text-align: left;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  padding: 20px;
}
</style>
