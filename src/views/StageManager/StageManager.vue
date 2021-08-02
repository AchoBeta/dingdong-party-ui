<template>
  <el-card shadow="hover">
    <el-tabs v-model="activeName" v-loading="loading">
      <el-tab-pane v-for="item in tabData" :key="item.id" :label="item.name" :name="item.name" >
        <SecondTab :secTabData="item.task"></SecondTab>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
const SecondTab = ()=>import('./SecondTab/SecondTab')
import {request} from '../../network/request'
  export default {
    data() {
      return {
        activeName: '' //活动标签页
        ,tabData: []  //标签选择项数据
        ,loading: true //加载遮罩
      };
    },
    methods: {
      //获取标签列表
      getTags(){
        request({
          url: 'stage'
        }).then(res => {
          this.tabData = res;
          this.activeName = res[0].name;
          this.loading = false;
        }).catch(err=>{
          this.$message({
            message: '标签获取失败',
              type: 'error',
              duration: 1000
          })
        })
      }
    }
    ,mounted(){
      this.getTags();
    }
    ,components: {
      SecondTab
    }
  };
</script>

