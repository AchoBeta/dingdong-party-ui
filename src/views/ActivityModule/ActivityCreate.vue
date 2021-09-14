<template>
  <div>
    <el-card shadow="hover">
      <div style="width: 600px;margin-left: 25%">
        <el-form  :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="选择党小组" v-if="groupId==null">
            <el-select v-model="groupVal[0]" placeholder="请选择授权党小组">
              <el-option
                  v-for="item in groupsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="formLabelAlign.groupId = item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="负责人姓名">
            <el-input v-model="name" disabled></el-input>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input placeholder="请输入活动名称" v-model="formLabelAlign.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动地点" required>
            <el-input placeholder="请输入活动地点" v-model="formLabelAlign.address" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动详情" required>
            <el-input placeholder="请输入活动详情" v-model="formLabelAlign.content" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动摘要" required>
            <el-input placeholder="请输入活动摘要" v-model="formLabelAlign.summary" clearable></el-input>
          </el-form-item>
          <el-form-item label="负责人邮箱" required>
            <el-input placeholder="请输入本人邮箱地址" v-model="formLabelAlign.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <div class="block">
              <el-date-picker
                  v-model="formLabelAlign.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间">
              </el-date-picker>
              <span>&nbsp;--&nbsp;</span>
              <el-date-picker
                  v-model="formLabelAlign.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="公告链接">
            <el-input placeholder="请输入公告链接" v-model="formLabelAlign.announcement" clearable></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" style="margin-left: 10px">保存草稿</el-button>
            <el-button type="primary" @click="submitForm">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
<!--  选择用户  -->
    <el-dialog
        title="选择活动参与人员"
        :visible.sync="activityDialog"
        width="50%"
        :modal-append-to-body="false"
        top="1vh"
        :center="true">
      <el-form :inline="true" v-if="!hidden">
        <el-form-item label="阶段">
          <el-select placeholder="选择所在阶段" clearable v-model="groupVal">
            <el-option
                v-for="item in stagesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="searchFormData.stageId = item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="searchFormData.periodsNum" :placeholder="'输入期数,范围(0,'+periodsNum+']'"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="beginSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" v-if="hidden">
        <el-form-item>
          <el-select
              v-model="userIds"
              multiple
              collapse-tags
              style="margin-left: 20px;"
              placeholder="请选择人员">
            <el-option
                v-for="item in usersOptions"
                :key="item.userId"
                :label="item.name"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitUsers">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {userRequest} from "../../network/request";
import {userRequest2} from "../../network/request";
export default {
  name: "ActivityCreate",
  data() {
    return {
      //分页属性
      page:1,
      size:5,
      //创建表单形式
      labelPosition:'top',
      //创建表但填写
      formLabelAlign: {}
      //方便使用的
      ,branchId: window.sessionStorage.getItem('branchId')
      ,groupId: window.sessionStorage.getItem('groupId')
      ,name: window.sessionStorage.getItem('name')
      //党小组
      ,groupsList:[]
      ,groupVal:''

      //储存一下活动Id再说
      ,activityId: null
      ,userIds:[]//保存用户id的数组

      //活动参与人员选择
      ,activityDialog: false
      ,searchFormData:{}
      ,userName: ''//方面显示人员
      //阶段
      ,stagesList: []
      //期数
      ,periodsNum: 0

      //适当是隐藏搜索
      ,hidden: false

      //用户渲染
      ,usersOptions: []
    }
  },
  created() {
    //加载党小组
    this.loadGroups()
    //加载期数
    this.loadStages()
    //加载阶段
    this.loadPeriodsNum()
  },
  methods:{
    submitForm() {
      this.formLabelAlign.directorName = window.sessionStorage.getItem('name')//名字
      this.formLabelAlign.directorId = window.sessionStorage.getItem('adminId')//管理员ID
      if (window.sessionStorage.getItem('groupId')!=null){
        this.formLabelAlign.groupId = window.sessionStorage.getItem('groupId')
      }//groupId
      this.formLabelAlign.branchId = window.sessionStorage.getItem('branchId')//branchId
      console.log(this.formLabelAlign)
      userRequest({
        method:'post',
        url: '/dingdong-party/organization/activities',
        data: this.formLabelAlign
      }).then(res => {
        if (res.success){
          this.formLabelAlign={}
          this.activityId = res.data.activityId//保存一下活动Id
          this.activityDialog = true//页面现
          console.log(res)
        }else {
          this.$message({
            message: '没有填写完必填信息',
            type: 'error'
          })
        }
      }).catch(err =>{
        this.$message({
          message: '创建活动失败',
          type: 'error',
          duration: 1500
        })
      })
    }
    //党小组
    ,loadGroups(){
      //选项 党组
      if (window.sessionStorage.getItem('groupId')==null){
        userRequest({
          url: '/dingdong-party/base/branch/'+window.sessionStorage.getItem('branchId')+'/groups',
          params: {
            page: 1,
            size: 100
          }
        }).then(res => {
          console.log(res)
          this.groupsList = res.data.list.items
        }).catch(err => {
          this.$message({
            message: '获取数据失败',
            type: 'error',
            duration: 1500
          })
        })
      }else {
        this.formLabelAlign.groupId = window.sessionStorage.getItem('groupId')
        this.groupsList = []
      }
    }
    //阶段
    ,loadStages(){
      userRequest({
        url: '/dingdong-party/base/stages',
      }).then(res => {
        console.log(res)
        this.stagesList = res.data.items
      }).catch(err => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    }
    //期数
    ,loadPeriodsNum(){
      userRequest({
        url: '/dingdong-party/base/others/max-periods',
      }).then(res => {
        console.log(res)
        this.periodsNum = res.data.num
      }).catch(err => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    }
    //挑选出用户
    ,beginSearch(){
      this.groupVal = ''//不然好像会有bug，哎
      this.searchFormData.branchId = window.sessionStorage.getItem('branchId')
      this.searchFormData.groupId = this.groupId
      console.log(this.searchFormData)
      userRequest({
        url: '/dingdong-party/base/users',
        params:{
          page: 1
          ,size: 100
          ,searchFormData: this.searchFormData
        }
      }).then(res => {
        console.log('beginSearch:')
        console.log(res)
        let dataList = res.data.list.items
        dataList.forEach(item => {
          this.usersOptions[this.usersOptions.length] = {userId: item.userId,name: item.name}
        })
        this.hidden = true
      }).catch(err => {
        this.$message({
          message: '搜索人员失败',
          type: 'error',
          duration: 1500
        })
      })
    }
    //提交人员
    ,submitUsers(){
      this.userIds.forEach(item => {
        item = item.userId
      })
      console.log('userIds.....')
      console.log(this.userIds)
      userRequest2({
        method: 'post'
        ,url: '/dingdong-party/organization/activities/'+this.activityId+'/users/add?'+'branchId='+this.branchId+'&'+'groupId='+this.groupId
        ,data: this.userIds
      }).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({
            message: '选择的人员参与成功',
            type: 'success'
          })
          this.activityDialog = false;
        }else {
          this.$message({
            message: '失败',
            type: 'error'
          })
        }

      }).catch(err => {
        this.$message({
          message: '人员提交失败',
          type: 'error',
          duration: 1500
        })
      })
    }
  }
}
</script>