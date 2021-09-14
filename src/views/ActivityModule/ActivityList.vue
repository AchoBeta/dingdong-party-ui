<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片头 -->
      <div style="margin-left: 18%;">
        <div slot="header" class="card_header">
          <el-form :inline="true"  :model="searchFormData">
            <div>
              <el-form-item label="院党委">
                <el-select v-model="value[0]" placeholder="选择所属院党委"  >
                  <el-option
                      v-for="item in optionBranchName"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="getBranchTeam(item.id)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="党支部">
                <el-select placeholder="选择所属党支部" v-model="value[1]">
                  <el-option
                      v-for="item in optionBranchTeam"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @click.native="searchFormData.groupId = item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建人">
                <el-select placeholder="选择创建人" v-model="value[3]">
                  <el-option
                      v-for="(item,index) in optionsActivityStatus"
                      :key="index"
                      :label="item"
                      :value="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="活动状态">
                <el-select placeholder="选择活动状态" v-model="value[4]">
                  <el-option
                  v-for="(item,index) in optionsActivityStatus"
                  :key="index"
                  :label="item"
                  :value="index"
                  @click.native="searchFormData.status = index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                    v-model="searchFormData.startTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择活动开始时间">
                </el-date-picker>
                <el-date-picker
                    v-model="searchFormData.endTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择活动结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="beginSearch" style="margin-left: 190px">搜索</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 卡片内容 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="创建人" prop="directorName"></el-table-column>
        <el-table-column label="院党委" prop="branchName"></el-table-column>
        <el-table-column label="党支部" prop="groupId"></el-table-column>
        <el-table-column label="活动开始时间" prop="startTime"></el-table-column>
        <el-table-column label="活动结束时间" prop="endTime"></el-table-column>
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
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button style="text-align: center;margin-bottom: 10px" type="primary" size="mini" @click='SearchAllMsg(scope.row.id)'>详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--   详情表单弹出   -->
      <el-dialog
          title="详细信息"
          :visible.sync="detailDialog"
          width="50%"
          :modal-append-to-body="false"
          top="1vh"
          :center="true">

        <!-- 表单内容 -->
        <el-form
            :model="formInfo"
            label-position="top"
            label-width="120px">
          <el-form-item label="活动信息">
            <el-card style="text-align: center">
              <div>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="活动名称">
                      <el-input style="width: 98%" v-model="formInfo.name" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="活动状态">
                      <el-input placeholder="未填" v-model="status" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="活动地址">
                      <el-input style="width: 98%" v-model="formInfo.address" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="公告链接">
                      <el-input v-model="formInfo.announcement" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="注意事项">
                      <el-input style="width: 98%" v-model="formInfo.attention" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="内容">
                      <el-input v-model="formInfo.content" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="负责人姓名">
                      <el-input style="width: 98%" v-model="formInfo.directorName" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="邮箱">
                      <el-input v-model="formInfo.email" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="附件链接">
                      <el-input style="width: 98%" v-model="formInfo.enclosure" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="摘要">
                      <el-input v-model="formInfo.summary" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="开始时间">
                      <el-input style="width: 98%" v-model="formInfo.startTime" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="结束时间">
                      <el-input v-model="formInfo.endTime" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="活动参与人员">
            <span>活动参与人数:{{this.userList.length}}</span>
            <el-card style="text-align: center">
              <div>
                <el-table
                    :data="userList"
                    stripe
                    style="width: 100%">
                  <el-table-column
                      prop="name"
                      label="姓名">
                  </el-table-column>
                  <el-table-column label="身份">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.studentId != null">学生</el-tag>
                      <el-tag type="success" v-if="scope.row.teacherId != null">老师</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="branchName"
                      label="党委名称">
                  </el-table-column>
                  <el-table-column
                      prop="groupName"
                      label="党支部名称">
                  </el-table-column>
                  <el-table-column
                      prop="stageId"
                      label="阶段">
                  </el-table-column>
                </el-table>
              </div>
              <!-- 分页组件2 -->
              <el-pagination
                  background
                  @size-change="changeSizePage2"
                  @current-change="changeCurrentPage2"
                  :current-page="page2"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="size2"
                  style="padding-top: 15px; text-align: center"
                  layout="prev, pager, next, sizes, jumper, ->, total"
                  :total="total2">
              </el-pagination>
            </el-card>
          </el-form-item>
          <el-form-item label="活动评价">
            <el-card style="text-align: center">
              <div>
                <el-table
                    :data="userComment"
                    stripe
                    style="width: 100%">
                  <el-table-column
                      prop="name"
                      label="评价人">
                  </el-table-column>
                  <el-table-column
                      prop="content"
                      label="内容">
                  </el-table-column>
                  <el-table-column
                      prop="time"
                      label="评价时间">
                  </el-table-column>
                  <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                      <el-button style="text-align: center;margin-bottom: 10px" type="danger" size="mini" @click='deleteComment(scope.row.id)' plain>删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页组件3 -->
                <el-pagination
                    background
                    @size-change="changeSizePage3"
                    @current-change="changeCurrentPage3"
                    :current-page="page3"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="size3"
                    style="padding-top: 15px; text-align: center"
                    layout="prev, pager, next, sizes, jumper, ->, total"
                    :total="total3">
                </el-pagination>
              </div>
            </el-card>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 分页组件1 -->
      <el-pagination
          background
          @size-change="changeSizePage"
          @current-change="changeCurrentPage"
          :current-page="page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          style="padding-top: 15px; text-align: center"
          layout="prev, pager, next, sizes, jumper, ->, total"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {userRequest} from "../../network/request";
export default {
  name: "ActivityList",
  data(){
    return{
      //展示表单
      tableData:[]
      //搜索表单
      ,searchFormData:{
        //branchId
        //directorId 负责人
        //directorName 负责人名称
        //endTime 截止时间
        //groupId 党组Id
        //name 活动名称
        //page  页号
        //size 大小
        //startTime 起始时间
        //status 审批状态
      }
      //选项
      ,optionsActivityStatus:['草稿','未审核','以审核','被驳回','正进行','已结束']
      ,optionBranchName:[]//党支部
      ,optionBranchTeam:[]//党小组
      ,value:['','','','','','']//作用是显示选项
      //分页相关变量
      ,total:0
      ,page: 1
      ,size: 5
      //详情分页插件1
      ,total2:0
      ,page2: 1
      ,size2: 5
      //详情分页插件2
      ,total3:0
      ,page3: 1
      ,size3: 5
      //详情表展示所需变量
      ,detailDialog: false
      //时间范围弹窗
      ,timeDialog: false
      //表单信息
      ,formInfo:{}
      ,status:'未填'
      //活动参与人数统计和用户列表
      ,userList:[]
      //活动结束评价
      ,userComment:[]
      //绑定详情的id来使用
      ,detailId:''
    }
  },
  created() {
    this.fillOptionBranch();
    this.beginSearch();
  },
  methods:{
    //通过党支部的选择来获取党小组的选择
    getBranchTeam(id){
      this.searchFormData.branchId = id;//把传进来的值放到对应位置
      userRequest({
        url:'/dingdong-party/base/branch/'+id+'/groups',
        params:{
          page: 1
          ,size: 100
        }
      }).then(res => {
        this.optionBranchTeam = res.data.list.items
        console.log(res)
      }).catch(err =>{
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    },
    //填入必要选项
    fillOptionBranch(){
      //获取党支部数据
      userRequest({
        url:'/dingdong-party/base/branches',
        params:{
          page: 1
          ,size: 100
        }
      }).then(res => {
        this.optionBranchName = res.data.list.items
      }).catch(err =>{
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    },
    //开始搜索
    beginSearch(){
      //把时间选择放进来
      console.log(this.searchFormData)
      userRequest({
        url:'/dingdong-party/organization/activities',
        params:{
          page: this.page
          ,size: this.size
          ,searchFormData: this.searchFormData
        }
      }).then(res => {
        console.log(res)//打印看一下数据
        this.tableData = res.data.list.items//数据展示
        this.total = res.data.list.total//数据总条数
        this.searchFormData = {}//设置为空
        this.value = []
      }).catch(err =>{
        this.formInfo = {}
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
        this.detailDialog = false
      })
    },
    //详情框
    SearchAllMsg(id){
      userRequest({
        url:'/dingdong-party/organization/activities/'+id,
        params:{
          page: 1
          ,size: 100
        }
      }).then(res => {
        //数据复刻
        this.formInfo = res.data.item
        //转换状态
        if(this.formInfo.status == 0){
          this.status = '草稿'
        }else if(this.formInfo.status == 1){
          this.status = '未审核'
        }else if(this.formInfo.status == 2){
          this.status = '已审核'
        }else{
          this.status = '被反驳'
        }
        //console.log(this.formInfo)//打印看一下数据
        //调用函数:获取参与活动人和人数
        this.getActivityUser(id)
        console.log("==================")
        //调用函数:获取评论
        this.getCommentList(id)
        //绑定这个id到后面分页使用
        this.detailId = id
        //由于到这里说明detailId改变了,因此
        this.page2 = 1
        this.size2 = 5
        this.total2 = 0
        //由于到这里说明detailId改变了,因此
        this.page3 = 1
        this.size3 = 5
        this.total3 = 0
        //数据到位了再开
        this.detailDialog = true
      }).catch(err =>{
        this.formInfo = {}
        status = '未填'
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
        this.detailDialog = false
      })
    },
    // 改变页码
    changeCurrentPage(page) {
      this.page = page
      this.beginSearch();
    },
    // 修改每页记录数
    changeSizePage(size) {
      this.size = size
      this.beginSearch()
    },
    // 改变页码
    changeCurrentPage2(page) {
      this.page2 = page
      this.getActivityUser(this.detailId);
      console.log(this.detailId)
    },
    // 修改每页记录数
    changeSizePage2(size) {
      this.size2 = size
      this.getActivityUser(this.detailId)
    },
    // 改变页码
    changeCurrentPage3(page) {
      this.page3 = page
      this.getCommentList(this.detailId)
    },
    // 修改每页记录数
    changeSizePage3(size) {
      this.size3 = size
      this.getCommentList(this.detailId)
    },
    //获取参与活动用户及人数
    getActivityUser(id) {
      userRequest({
        url:'/dingdong-party/organization/activities/'+id+'/users',
        params:{
          page: this.page2
          ,size: this.size2
        }
      }).then(res => {
        console.log('用户.......')
         console.log(res)
        this.userList = res.data.list.items
        this.total2 = this.userList.length
      }).catch(err => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    },
    //评价列表
    getCommentList(id){
      userRequest({
        url:'/dingdong-party/organization/activities/'+id+'/comments',
        params:{
          page: this.page3
          ,size: this.size3
        }
      }).then(res => {
        this.userComment = res.data.list.items//获取需要的数据
        this.total3 = this.userComment.length//获取总数
      }).catch(err => {
        this.$message({
          message: '获取数据失败',
          type: 'error',
          duration: 1500
        })
      })
    },
    //评价删除
    deleteComment(id){
      userRequest({
        url:'/dingdong-party/organization/activities/'+this.detailId+'/comments/'+id
      }).then(res => {
        console.log(res)
        //删除之后我们要刷新一下
        this.getCommentList(this.detailId)
      }).catch(err => {
        this.$message({
          message: '删除评论失败',
          type: 'error',
          duration: 1500
        })
      })
    }
  }
}
</script>

