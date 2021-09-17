<template>
  <div>
    <!-- 选择党委和党支部 -->
    <div>
      <el-card>
        <div class="select-container">
          <div class="select-item">
            党委：
            <el-select
              :loading="loading"
              placeholder="选择党委"
              @change="getGroupOptions"
              v-model="groupId"
            >
              <el-option
                v-for="item in branchOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          党支部：
          <el-select
            :loading="loading"
            placeholder="选择党支部"
            v-model="branchId"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </el-card>
    </div>
    <!-- 党建数据 -->
    <div id="content-area">
      <el-card>
        <div slot="header" class="clearfix">
          <span>党建数据</span>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col
              :span="8"
              style="margin-bottom: 10px"
              v-for="item in informationData"
              :key="item.id"
            >
              <el-card style="text-align: center;"
                >{{ item.name }}:{{ item.value }}人</el-card
              >
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
    <!-- 图表数据 -->
    <div id="eChart-area">
      <el-card>
        <div slot="header" class="clearfix">
          <span>图表数据</span>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-card>
                <div
                  id="pie-area"
                  style="height: 300px !important;width: 100% !important;"
                ></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
// import {request} from '../network/request'
// import {request} from "../network/request";
import eCharts from "echarts";
export default {
  name: "Console",
  data() {
    return {
      branchId: "",
      groupId: "",
      authority: "",
      loading: false,
      branchOptions: [], //支部选项
      groupOptions: [], //党组选项
      informationData: [
        { name: "入党申请人", value: 0 },
        { name: "入党积极分子", value: 0 },
        { name: "发展对象", value: 0 },
        { name: "预备党员", value: 0 },
        { name: "正式党员", value: 0 },
      ],
      chart: null,
      informationNameArr: [
        "入党申请人",
        "入党积极分子",
        "发展对象",
        "预备党员",
        "正式党员",
      ],
      pageSize: 5,
      pageNo: 1,
    };
  },
  created() {
    this.getBranchOptions();
    this.getInformation();
  },
  mounted() {},
  methods: {
    // 获取支部选项
    getBranchOptions() {
      this.$get({
        url: "/base/branches",
        params: {
          page: this.pageNo,
          size: this.pageSize,
        },
      })
        .then((res) => {
          this.branchOptions = res.data.list.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取支部失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    // 获取党组选项
    getGroupOptions(branchId) {
      this.$get({
        url: "/base/branch/" + branchId + "/groups",
        params: {
          branchId: branchId,
          page: this.pageNo,
          size: this.pageSize,
        },
      })
        .then((res) => {
          this.groupOptions = res.data.list.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取用户数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //获取党建数据
    getInformation() {
      const that = this;
      this.$get({
        url: "/base/others/count",
      })
        .then((res) => {
          const data = res.data;
          let temp = [];
          data.items.map((v, k) => {
            let obj = { name: v.name, value: v.total };
            console.log(obj);
            if (k != 5) temp.push(obj);
            that.informationData = temp;
          });
          that.drawGraph("#pie-area", "pie");
        })
        .catch((err) => {
          this.$message({
            message: "数据获取失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    drawGraph(selector, type) {
      const that = this;
      that.chart = eCharts.init(document.querySelector(selector));
      that.chart.showLoading();
      that.chart.setOption({
        title: {
          text: "党建数据",
          subtext: "详细数据",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          x: "center",
          y: "bottom",
          data: that.informationNameArr, // this
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true,
            },
            magicType: {
              show: true,
              type: ["pie"],
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
            },
          },
        },
        calculable: true,
        series: [
          {
            name: "阶段身份",
            type: type,
            radius: [30, 100],
            center: ["50%", "50%"],
            data: that.informationData,
          },
        ],
      });
      that.chart.hideLoading();
    },
  },
};
</script>
<style scoped>
.select-container {
  display: flex;
  flex-flow: row wrap;
}

.select-item {
  margin-right: 20px;
}
#content-area,
#eChart-area {
  margin-top: 3vh;
}
</style>
