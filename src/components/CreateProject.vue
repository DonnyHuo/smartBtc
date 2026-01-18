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
      <!-- 联合KOL -->
      <div
        class="w-1/3 h-full flex items-center justify-center cursor-pointer"
        :class="
          activeIndex === 0
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(0)"
      >
        {{ $t("createProject.kolTypes.joint") }}
      </div>
      <!-- 单一KOL -->
      <div
        class="w-1/3 h-full flex items-center justify-center cursor-pointer"
        :class="
          activeIndex === 1
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(1)"
      >
        {{ $t("createProject.kolTypes.single") }}
      </div>
      <!-- 銘文做市 -->
      <div
        class="w-1/3 h-full flex items-center justify-center cursor-pointer"
        :class="
          activeIndex === 2
            ? 'bg-[#FEE540] rounded-[4px] border border-black border-solid'
            : ''
        "
        @click="changeActiveIndex(2)"
      >
        {{ $t("createProject.kolTypes.marketMaking") }}
      </div>
    </div>

    <div v-if="activeIndex == 0" class="text-left">
      <div class="flex items-center justify-between mt-[20px] gap-2">
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("createProject.tokenName") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeOne.brc20_name"
              :placeholder="$t('createProject.custom')"
            />
          </div>
        </div>
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("createProject.stockCode") }}
          </div>
          <div>
            <input
              class="w-full disabled:bg-[#f5f5f5] text-[12px]"
              type="text"
              v-model="typeOne.symbol"
              :placeholder="$t('createProject.custom')"
            />
          </div>
        </div>
      </div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("createProject.totalSupply") }}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("createProject.contracts.fairLaunch")
            }}</span>
            <div class="flex-shrink-0">
              {{ typeOne.percents[0] }}
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("createProject.contracts.launchPool")
            }}</span>

            <div class="flex-shrink-0">{{ typeOne.percents[2] }} %</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("createProject.contracts.lpAddition")
            }}</span>
            <div class="flex-shrink-0">
              {{ typeOne.percents[1] }}
              %
            </div>
          </div>
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("createProject.contracts.kolAirdrop")
            }}</span>
            <div class="flex-shrink-0">
              {{ typeOne.percents[3] }}
              %
            </div>
          </div>
        </div>
      </div>
      <div class="my-4">
        <TokenSelect
          v-model="selectedTokenOne"
          :options="selectTokenList"
        />
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
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("createProject.tokenName") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeTwo.brc20_name"
              :placeholder="$t('createProject.custom')"
            />
          </div>
        </div>
        
        <div class="w-1/2">
          <div class="text-black font-bold text-[12px] mb-[10px]">
            {{ $t("createProject.stockCode") }}
          </div>
          <div>
            <input
              class="w-full text-[12px]"
              type="text"
              v-model="typeTwo.symbol"
              :placeholder="$t('createProject.custom')"
            />
          </div>
        </div>
      </div>

      
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("createProject.totalSupply") }}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{
              $t("createProject.contracts.fairLaunch")
            }}</span>
            <div>{{ typeTwo.percents[0] }}%</div>
          </div>

          
          <div
            class="border border-solid border-[#202325] h-[52px] p-[10px] rounded-lg w-1/2 flex items-center justify-between"
          >
            <span class="text-[12px]">{{ $t("newData.launchPool") }}</span>

            <div>{{ typeTwo.percents[2] }}%</div>
           
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
            <span class="text-[12px]">{{ $t("newData.kolRewards") }}</span>

            <div>
              <input
                class="w-[60px] !h-[30px] text-[12px] text-right"
                type="text"
                v-model="typeTwo.percents[3]"
                placeholder="> 0"
                @change="changeStartPool"
              />
              %
            </div>
          </div>
        
          
        </div>
      </div>
      <div class="my-4">
        <TokenSelect
          v-model="selectedTokenTwo"
          :options="selectTokenList"
        />
      </div>
      <div class="text-[12px] text-[#D90007] mt-4 leading-4">{{ text }}</div>
      <div class="mt-[20px]">
        <div class="text-black font-bold text-[12px] mb-[10px]">
          {{ $t("createProject.tokenDescription") }}
        </div>
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
    <div class="text-left text-[12px] text-red-500">
      * {{ $t("createProject.submitTip") }}
    </div>
  </div>
</template>
<script>
import { ethers } from "ethers";
import { showToast, showConfirmDialog } from "vant";

import { copy, getContract } from "@/utils";

import depositAbi from "../abi/deposit.json";
import TokenSelect from "./TokenSelect.vue";

export default {
  name: "creatProject",
  components: {
    TokenSelect,
  },
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
        percents: ["45", "20", "15", "20"],
      },
      typeTwo: {
        brc20_name: "",
        brc20_id: "",
        brc20_supply: "1000000000",
        symbol: "",
        totalSupply: "",
        details: "",
        percents: ["45", "", "15", ""],
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
      text: this.$t("createProject.fairLaunchNote"),

      selectedTokenOne: {
        mint_base_token: "BNB",
        mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
        exchange_rate: "9000000",
      },
      selectedTokenTwo: {
        mint_base_token: "BNB",
        mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
        exchange_rate: "9000000",
      },
      selectTokenList: [
        {
          mint_base_token: "BNB",
          mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
          exchange_rate: "9000000",
        },
        {
          mint_base_token: "USDT",
          mint_base_token_addr: "0x55d398326f99059ff775485246999027b3197955",
          exchange_rate: "10000",
        },
        {
          mint_base_token: "BTCB",
          mint_base_token_addr: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
          exchange_rate: "900000000",
        },
      ],
      showList: false,
      fileList: [],
      logoUrl: "",
    };
  },
  computed: {
    // 从 store 读取质押数量，实时响应变化
    activeAmount() {
      return this.$store.state.activeAmount * 1;
    },
  },
  mounted() {
    this.refreshActiveAmount();
  },

  methods: {
    async refreshActiveAmount() {
      const res = await getContract(
        this.$store.state.pledgeAddress,
        depositAbi,
        "viewUserDepositedAmount",
        this.$store.state.address
      );
      console.log("res", res);
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
      // 校验质押数量是否满足当前模式要求
      const amount = this.activeAmount * 1;
      const modeRequirements = [
        { min: 100, max: 2099, name: this.$t("createProject.kolTypes.joint") },
        { min: 10000, max: Infinity, name: this.$t("createProject.kolTypes.single") },
        { min: 2100, max: 9999, name: this.$t("createProject.kolTypes.marketMaking") },
      ];
      const req = modeRequirements[this.activeIndex];
      
      if (amount < req.min || amount > req.max) {
        const tip = this.activeIndex === 1 
          ? this.$t("createProject.stakeRequirement.min", { mode: req.name, min: req.min })
          : this.$t("createProject.stakeRequirement.range", { mode: req.name, min: req.min, max: req.max });
        showToast(tip);
        return;
      }

      // 检测是否上传了图片
      if (!this.logoUrl) {
        showToast(this.$t("createProject.uploadLogoRequired"));
        return;
      }

      if (this.$store.state.accountInfoStatus !== 1) {
        showToast(this.$t("createProject.notCertified"));
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
          ...this.selectedTokenOne,
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
          ...this.selectedTokenTwo,
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
