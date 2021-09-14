<template>
  <el-tabs v-model="activeName" @tab-click="updateTableData">
    <el-tab-pane v-for="item in secTabData" :key="item.id" :label="item.name" :name="item.name">
      <!-- stage01 -->
      <MaterialReview :taskID="item.id" v-if="item.name=='提交电子版《入党申请书》'"/>
      <ApplyFormReview :taskID="item.id" v-else-if="item.name=='填写电子版《入党申请人培养考察手册》'"/>
      <!-- stage02 -->
      <FormReview :taskID="item.id" v-else-if="item.name=='填写电子版《入党积极分子培养考察手册》'"/>
      <AppointIntroducer :taskID="item.id" v-else-if="item.name=='指定培养联系人'"/>
      <Exam :taskID="item.id" v-else-if="item.name=='分党校培训考试'"/>
      <!-- stage03 -->
      <AppointPartyIntroducer :taskID="item.id" v-else-if="item.name=='指定入党介绍人'"/>
      <MaterialReview :taskID="item.id" v-else-if="item.name=='政治审查'"/>
      <TrainingExam :taskID="item.id" v-else-if="item.name=='学校党课培训考试'"/>
      <MaterialReview :taskID="item.id" v-else-if="item.name=='提交电子版考察期《思想汇报》（每季度1篇）、《自传》（建议此任务作为一个平行任务，在成为入党积极分子时即可开启）'"/>
      <suggestFrom :taskID="item.id" v-else-if="item.name=='补充《入党积极分子培养考察手册》的意见等内容'"/>
      <VolunteerFrom :taskID="item.id" v-else-if="item.name=='填写电子版《中国共产党入党志愿书》'"/>
      <!-- stage04 -->
      <InspectForm :taskID="item.id" v-else-if="item.name=='填写《预备党员培养考察手册》'"/>
      <MaterialReview :taskID="item.id" v-else-if="item.name=='提交电子版《转正申请书》'"/>
      <InspectReplenish :taskID="item.id" v-else-if="item.name=='补充《预备党员培养考察手册》中的意见等内容'"/>
      <!-- stage06 -->
      <Final :taskID="item.id" v-else-if="item.name=='党员名单'"/>
      <!-- basic -->
      <NextTask :taskID="item.id" v-else/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// basic
const NextTask = ()=>import('../Table/basic/NextTask')
// stage01
const MaterialReview = ()=>import('../Table/stage01/MaterialReview')
const ApplyFormReview = ()=>import('../Table/stage01/ApplyFormReview')
// stage02
const FormReview = ()=>import('../Table/stage02/FormReview')
const AppointIntroducer = ()=>import('../Table/stage02/AppointIntroducer')
const Exam = ()=>import('../Table/stage02/Exam')
// stage03
const AppointPartyIntroducer = ()=>import('../Table/stage03/AppointPartyIntroducer')
const PoliticalMaterialReview = ()=>import('../Table/stage03/PoliticalMaterialReview')
const TrainingExam = ()=>import('../Table/stage03/TrainingExam')
const suggestFrom = ()=>import('../Table/stage03/suggestFrom')
const VolunteerFrom = ()=>import('../Table/stage03/VolunteerFrom')
// stage04
const InspectForm = ()=>import('../Table/stage04/InspectForm')
const InspectReplenish = ()=>import('../Table/stage04/InspectReplenish')

//stage06
const Final = ()=> import('../Table/stage06/Final')
export default {
  data() {
      return {
        activeName: ''
        ,count: 0
      };
  }
  ,methods: {
    updateTableData(tab, event){
      //调用子组件更新子组件表格数据
      tab.$children[0].getTableData();
    }
  }
  ,computed:{
    
  }
  ,props: {
    //获取任务列表
    secTabData: {
      type: Array,
      default: []
    }
  }
  ,mounted(){
    this.activeName = this.secTabData[0].name;
  }
  ,components: {
    NextTask
    ,MaterialReview
    ,ApplyFormReview
    ,FormReview
    ,AppointIntroducer
    ,AppointPartyIntroducer
    ,PoliticalMaterialReview
    ,Exam
    ,TrainingExam
    ,VolunteerFrom
    ,suggestFrom
    ,InspectForm
    ,InspectReplenish
    ,Final
  }
}
</script>

<style>

</style>