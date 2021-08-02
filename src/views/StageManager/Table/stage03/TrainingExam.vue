<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">

      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="学号" prop="casid"></el-table-column>
      <el-table-column label="所在党支部" prop="general_branch.name"></el-table-column> 
      <el-table-column label="所在进度" prop='currTask'></el-table-column>
      <el-table-column label="成绩" prop="score.school_score"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template>
            <el-popconfirm title="是否确认操作" @onConfirm="nextTask(scope.row)">
              <el-button slot="reference" type="primary" size="mini">下一任务</el-button>
            </el-popconfirm>
            <el-button size="mini" @click="getCasid(scope.row)">成绩录入</el-button>
            <!-- Form -->
            <el-dialog title="成绩录入" 
              :visible.sync="dialogFormVisible"
              width="450px">
              <el-form 
                :model="gradeForm"
                :inline="true">
                <el-form-item label="成绩：">
                  <el-input v-model="gradeForm.school_score" autocomplete="off"></el-input>
                </el-form-item>
                <el-button type="primary" @click="gradeSubmit()">确 定</el-button>
              </el-form>
            </el-dialog>
            <el-button size="mini" @click="reset(scope.$index, scope.row)" type="danger" style="margin: 5px">重置</el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>
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
  </div>
  
</template>

<script>
import {request} from '../../../../network/request'
  export default {
    name: 'NextTask',
    data() {
      return {
        total: 0, // 总记录数 
        page: 1, // 页码
        limit: 5, // 每页记录数
        tableData: [] //表格数据
        ,loading: true //加载遮罩
        ,dialogFormVisible: false //成绩录入弹窗
        ,gradeForm: {
          casid: -1, //学号
          school_score: "" // 成绩
        }
      }
    }
    ,props: ['taskID'] //taskID是二级标签组组件传下来的任务id号
    ,mounted(){
      this.getTableData();
    }
    ,methods: {
      //获取学号 上传成绩
      getCasid(row){
        this.gradeForm.casid = row.casid
        this.dialogFormVisible = true
        this.gradeSubmit()
      },
      //成绩上传
      gradeSubmit(){
        //判断成绩合法
        if(this.gradeForm.school_score > 100 || this.gradeForm.school_score < 0 || this.gradeForm.school_score == ""){
          this.$message({
            message: '请输入0~100之间的数',
            duration: 2000
          })
          return
        }

        request({
          url: `score/record`,
          method: 'post',
          data: this.gradeForm
        }).then(res=>{
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000
          })
          this.gradeForm.school_score = ""
          this.dialogFormVisible = false
          this.getTableData()
        }).catch(err=>{
          this.gradeForm.school_score = ""
          this.$message({
            message: '服务器开了小差',
            type: 'error',
            duration: 1000
          })
        })
      },

      // 改变页码
      changeCurrentPage(page) {
        this.page = page
        this.loading = true
        this.getTableData()
      },
      // 修改每页记录数
      changeSizePage(size) {
        this.limit = size
        this.loading = true
        this.getTableData()
      },
      //获取任务表格数据函数
      getTableData(){
        //请求任务表格数据
        request({
          url: `task/${this.taskID}`,
          params: {
            limit: this.limit,
            page: this.page
          }
        }).then(res=>{
          this.total = res.total
          for(let i=0;i<res.user.length;i++){
            res.user[i]['currTask'] = res.name; //给每个记录添加当前任务属性
          }          
          this.tableData = res.user;
          this.loading = false;
        }).catch(err=>{
          this.$message({
            message: '表格数据获取失败',
            type: 'error',
            duration: 1000
          })
        })
      }
      //进入下一任务接口
      ,nextTask(row) {
        let casid = row.casid
        request({
          url: 'state/next_mission?casid=' + casid,
          method: 'put'
        }).then(res=>{
          this.getTableData();
          this.$message({
            message: '成功进入下一任务',
            type: 'success',
            duration: 1500
          })
        }).catch(err=>{
          this.$message({
            message: '操作失败',
            type: 'error',
            duration: 1500
          })
        })
      }
      //重置进度（开发时测试使用）
      ,reset(index, row){
        let casid = row.casid;
        request({
          url: 'state/resetState?casid=' + casid,
          method: 'put'
        }).then(res=>{
          this.getTableData();
          this.$message({
            message: '重置成功',
            type: 'success',
            duration: 1500
          })
        }).catch(err=>{
          this.$message({
            message: '重置失败',
            type: 'error',
            duration: 1500
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
