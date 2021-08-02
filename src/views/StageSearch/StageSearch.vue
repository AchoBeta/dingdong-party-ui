<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片头 -->
      <div slot="header" class="card_header">
        <el-form 
          :inline="true"
          :model="searchFormData">
          <el-form-item label="阶段">
            <el-select placeholder="选择阶段" v-model="selectedStage">
              <el-option 
                v-for="item in searchFormData['data']" 
                :key="item.id" 
                :label="item.name" 
                :value="item.id"
                @click.native="changSelectedStageIndex(item.index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务">
            <el-select placeholder="选择任务" v-model="selectedTask">
              <el-option 
              v-for="item in searchFormData['data'][selectedStageIndex].task" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="beginSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 卡片内容 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="学号" prop="casid"></el-table-column>
        <el-table-column label="所在党支部" prop="general_branch.name"></el-table-column>
        <el-table-column label="所在进度" prop="current"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click='getAllInfo(scope.row)'>查看</el-button>
            
          </template>
        </el-table-column>
      </el-table>
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

          <el-form-item label="基本信息">
            <el-card shadow="always">
              <el-row>
                <el-col :span="11">
                  <el-form-item label="姓名">
                    <el-input style="width: 98%" v-model="formInfo.name" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="学号">
                    <el-input v-model="formInfo.casid" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="民族">
                    <el-input style="width: 98%" v-model="formInfo.nation" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="籍贯">
                    <el-input v-model="formInfo.origin" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="身份证号">
                    <el-input style="width: 98%" v-model="formInfo.id_card" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="出生日期">
                    <el-date-picker type="date" placeholder="未填" v-model="formInfo.birth" disabled></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="联系方式">
                    <el-input style="width: 98%" v-model="formInfo.mobile" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="家庭住址">
                    <el-input v-model="formInfo.family_address" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在院系">
                    <el-input style="width: 98%" v-model="formInfo.institute" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="所在专业">
                    <el-input v-model="formInfo.major" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在年级">
                    <el-input style="width: 98%" v-model="formInfo.grade" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="所在班级">
                    <el-input v-model="formInfo.class" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在社区">
                    <el-input style="width: 98%" v-model="formInfo.dormitory_area" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="宿舍号">
                    <el-input v-model="formInfo.dormitory_no" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="职务">
                    <el-input style="width: 98%" v-model="formInfo.class_position" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="邮箱">
                    <el-input v-model="formInfo.email" placeholder="未填" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="个人经历">
                    <el-input type="textarea" v-model="formInfo.resume" placeholder="无" disabled autosize></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-form-item>

          <el-form-item label="其他信息">
            <el-card>
              待填充。。。
            </el-card>
            
          </el-form-item>

        </el-form> 
      </el-dialog>
      <!-- 分页组件 -->
      <el-pagination
        background
        @size-change="changeSizePage"
        @current-change="changeCurrentPage"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="limit"
        style="padding-top: 15px; text-align: center"
        layout="prev, pager, next, sizes, jumper, ->, total"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
  
</template>

<script>
import {request} from '../../network/request'
  export default {
    data() {
      return {
        searchFormData: {
          "data": []
        }  //搜索数据
        ,selectedStage: 1 //选中的阶段
        ,selectedTask:  "" //选中的任务
        ,selectedStageIndex: 0 //阶段选择的下标
        ,tableData: [] //表格数据
        ,total: 0 // 总记录数 
        ,page: 1 // 页码
        ,limit: 5 // 每页记录数
        ,detailDialog: false // 弹查看窗
        ,formInfo: {
          branch:{},
          userBranch: {
            firstContact: {},
            secondContact: {}
          }
        } // 待渲染表单数据
      }
    }
    ,methods: {
      // 获取所有信息
      getAllInfo(row){
        
        request({
          url: `user/${row.casid}`
        }).then(res => {
          this.formInfo = res
          this.detailDialog = true
        }).catch(err => {
          this.formInfo = {}
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
        this.getTableData()
      },
      // 修改每页记录数
      changeSizePage(size) {
        this.limit = size
        this.getTableData()
      },
      //搜索框二级联动
      changSelectedStageIndex(index){
        this.selectedStageIndex = index;
        this.selectedTask = "";
      }
      //开始搜索
      ,beginSearch(){
        this.limit = 5
        this.page = 1
        if(this.selectedTask==""){
          request({
            url: 'stage/' + this.selectedStage,
            params: {
              limit: this.limit,
              page: this.page
            }
          }).then(
            res => {
              console.log(res);
              this.total = res.total
              for(let i=0;i<res.user.length;i++){
                res.user[i]['current'] = res.name;
              }
              this.tableData = res.user;
            }
          ).catch(
            err => {
              this.$message({
                message: '哎呀，搜索出了问题',
                type: 'error',
                duration: 1000
              })
            }
          )
        }else{
          request({
            url: 'task/' + this.selectedTask,
            params: {
              limit: this.limit,
              page: this.page
            }
          }).then(
            res => {
              this.total = res.total
              for(let i=0;i<res.user.length;i++){
                res.user[i]['current'] = res.name;
              }
              this.tableData = res.user;
            }
          ).catch(
            err => {
              this.$message({
                message: '哎呀，搜索出了问题',
                type: 'error',
                duration: 1000
              })
            }
          )
        }
      }
      // 获取记录
      ,getTableData(){
        if(this.selectedTask != ""){
          request({
            url: `task/${this.selectedTask}`,
            params: {
              limit: this.limit,
              page: this.page
            }
          }).then(res => {
            for(let i=0;i<res.user.length;i++){
              res.user[i]['current'] = res.name;
            }
            this.total = res.total
            this.tableData = res.user;
            console.log(this.tableData);
          }).catch(err => {
            this.$message({
              message: '获取表格数据失败',
              type: 'error',
              duration: 1000
            })
          })
          return
        }
        request({
          url: `stage/${this.selectedStage}`,
          params: {
            limit: this.limit,
            page: this.page
          }
        }).then(res => {
          for(let i=0;i<res.user.length;i++){
            res.user[i]['current'] = res.name;
          }
          this.total = res.total
          this.tableData = res.user;
          console.log(this.tableData);
        }).catch(err => {
          this.$message({
            message: '获取表格数据失败',
            type: 'error',
            duration: 1000
          })
        })
      }
    }
    ,mounted(){
      //获取阶段与任务的搜索项
      request({
        url: 'stage'
        ,method: 'get'
      }).then(
        res => {
          for(let i=0;i<res.length;i++){
            res[i].index = i;
          }
          console.log(res);
          this.searchFormData["data"] = res;
        }
      ).catch(
        err => {
          this.$message({
            message: '获取搜索列表失败',
            type: 'error',
            duration: 1000
          })
        }
      )
      //初始化表格
      this.getTableData()
    }
  }
</script>

<style scoped>
  .el-form-item{
    margin-bottom: 0;
  }
</style>
