<template>
  <div>
    <el-card shadow="hover">
      <div v-show="show">
        <div style="text-align: center">
          <h3>选择活动</h3>
        </div>
        <div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="创建人" prop="directorName"></el-table-column>
            <el-table-column label="活动开始时间" prop="startTime"></el-table-column>
            <el-table-column label="活动状态" prop="status">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.status == 0">草稿</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 1">未审核</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 2">被驳回</el-tag>
                <el-tag type="success" v-else-if="scope.row.status == 3">已审批</el-tag>
                <el-tag type="danger" v-else-if="scope.row.status == 4">正进行</el-tag>
                <el-tag type="success" v-else>已结束</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="请假审批" fixed="right">
              <template slot-scope="scope">
                <el-button style="text-align: center;margin-bottom: 10px" type="primary" size="mini" @click='searchUsers(scope.row)'>操作</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-show="!show">
        <span><el-button size="small" type="primary" @click="show = true">活动列表</el-button></span>
        <div style="text-align: center">
          <span style="font-size: large">选择请假人员</span>
          <div>
            <el-table :data="usersData" style="width: 100%">
              <el-table-column label="学生姓名" prop="name"></el-table-column>
<!--              <el-table-column label="班级" prop="'还不行'"></el-table-column>-->
              <el-table-column label="阶段ID" prop="stageId"></el-table-column>
              <el-table-column label="活动名称" prop="activityName"></el-table-column>
              <el-table-column label="活动状态" prop="status">
                <template slot-scope="scope">
                  <el-tag type="info" v-if="scope.row.status == 0">草稿</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.status == 1">未审核</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.status == 2">被驳回</el-tag>
                  <el-tag type="success" v-else-if="scope.row.status == 3">已审批</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.status == 4">正进行</el-tag>
                  <el-tag type="success" v-else>已结束</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="请假">
                <template slot-scope="scope">
                  <el-button style="text-align: center;margin-bottom: 10px" type="primary" size="mini" @click='agree(scope.row)'>同意</el-button>
                  <el-button style="text-align: center;margin-bottom: 10px" type="primary" size="mini" @click='disagree(scope.row)'>驳回</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>


import {userRequest} from "../../network/request";

export default {
  name: "ActivityLeaveApplication",
  data(){
    return {
      tableData: []//活动数组
      ,usersData:[]//用户数组
      ,page: 1
      ,size: 100
      ,show: true
    }
  },
  created() {
    this.beginSearch();
    this.show = true
  },
  methods:{
    //把所有活动全部搜索出来
    beginSearch(){
      userRequest({
        url:'/dingdong-party/organization/activities',
        params:{
          page: this.page
          ,size: this.size
          ,branchId: window.sessionStorage.getItem('branchId')
          ,groupId: window.sessionStorage.getItem('groupId')
          //,status: 1
        }
      }).then(res => {
        console.log(res)//打印看一下数据
        this.tableData = res.data.list.items//数据展示
        this.total = res.data.list.total//数据总条数
      }).catch(err =>{
        this.$message({
          message: '获取数据失败',
          type: 'error'
        })
      })
    },
    //搜出活动人数
    searchUsers(item) {
      console.log(item)
      userRequest({
        url: '/dingdong-party/organization/activities/'+item.id+'/users/query-by-activityId'
      }).then(res => {
        console.log(res)
        this.usersData = res.data.items
        console.log(this.usersData)
        this.usersData.forEach(it => {
          //活动当前状态
          it.status = item.status
          //活动名称
          it.activityName = item.name
          //活动Id
          it.activityId = item.id
        })
        //显示
        this.show = false
        console.log(this.usersData)
      }).catch(err =>{
        this.$message({
          message: '获取数据失败',
          type: 'error'
        })
      })
    },
    //同意
    agree(item) {
      console.log(item)
      userRequest({
        method: 'POST',
        url: '/dingdong-party/backstage/admins/partake-activity-success',
        params: {
          userId: item.userId,//'1427546569351131137',
          activityId: item.activityId,//'1419572431459876245',
          groupId: item.groupId,//1
        }
      }).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({
            message: '通过成功',
            type: 'success'
          })
          //过滤一下，免得管理员麻烦
          this.usersData = this.usersData.filter(it => it.userId != item.userId)
        }else {
          this.$message({
            message: res.message+",请重新登录",
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: '通过失败',
          type: 'error'
        })
      })
    },
    //失败
    disagree(item) {
      userRequest({
        method: 'POST',
        url: '/dingdong-party/backstage/admins/partake-activity-fail',
        params: {
          userId: item.userId,//'1427546569351131137',
          activityId: item.activityId,//'1419572431459876245',
          groupId: item.groupId,//1
        }
      }).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          //过滤一下，免得管理员麻烦
          this.usersData = this.usersData.filter(it => it.userId != item.userId)
        }else {
          this.$message({
            message: res.message+",请重新登录",
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: '通过失败',
          type: 'error'
        })
      })
    }
  },
}
</script>

<style scoped>

</style>