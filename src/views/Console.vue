<template>
  <div>
    <!-- 选择党委和党支部 -->
    <div>
      <el-card>
        <div>
          <!--
          <div>
            党委
            <el-select v-model="" placeholder="无">
              <el-option :label="" :value=""></el-option>
            </el-select>
          </div>
          <div>
            党支部
            <el-select v-model="" placeholder="无">
              <el-option :label="" :value=""></el-option>
            </el-select>
          </div>
          -->
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
    };
  },
  created() {
    const that = this;
    that.getInformation();
  },
  mounted() {},
  methods: {
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
#content-area,
#eChart-area {
  margin-top: 3vh;
}
</style>
