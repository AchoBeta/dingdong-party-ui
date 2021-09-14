<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">

      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="学号" prop="casid"></el-table-column>
      <el-table-column label="所在党支部" prop="general_branch.name"></el-table-column> 
      <el-table-column label="所在进度" prop='currTask'></el-table-column>
      <el-table-column label="当前状态">
        <template slot-scope="scope">
          <!-- -1不过0待审1过审 -->
          <el-tag type="danger" v-if="scope.row.status == -1">审核不通过</el-tag>
          <el-tag v-else-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 1">已审核通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template>
            <!-- ========================================================= -->
            <el-button size="mini" @click='infoReview(scope.$index, scope.row)'>信息审核</el-button>
            <el-dialog 
              title="信息审核"
              :visible.sync="dialogFormVisible"
              width="50%"
              top="1vh"
              center='true'>
              
              <!-- 表单内容 -->
              <el-form 
                :model="formInfo" 
                label-position="top" 
                label-width="120px">

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="姓名">
                      <el-input style="width: 98%" v-model="formInfo.name" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="联系方式">
                      <el-input v-model="formInfo.mobile" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="所在单位">
                      <el-input style="width: 98%" v-model="formInfo.institute" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="所在党支部">
                      <el-input v-model="formInfo.branch.name" placeholder="未填" disabled></el-input>
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
                    <el-form-item label="性别">
                      <el-input :value="formInfo.gender=='1'?'男':'女'" placeholder="性别" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="出生日期">
                      <el-date-picker type="date" placeholder="未填" v-model="formInfo.birth" disabled></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="籍贯">
                      <el-input style="width: 98%" v-model="formInfo.origin" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="入团时间">
                      <el-date-picker type="date" placeholder="未填" v-model="formInfo.apply_time" disabled></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="申请入党时间">
                      <el-input style="width: 98%" v-model="formInfo.apply_time" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="学号">
                      <el-input style="width: 98%" v-model="formInfo.casid" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="年级">
                      <el-input v-model="formInfo.grade" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="专业班级">
                      <el-input style="width: 98%" v-model="formInfo.class" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="学生社区">
                      <el-input v-model="formInfo.dormitory_area" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="宿舍号">
                      <el-input style="width: 98%" v-model="formInfo.dormitory_no" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="电子邮箱">
                      <el-input v-model="formInfo.email" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="身份证号码">
                      <el-input style="width: 98%" v-model="formInfo.id_card" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="现居地">
                      <el-input v-model="formInfo.family_address" placeholder="未填" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="主要简历">
                      <el-input type="textarea" v-model="formInfo.resume" placeholder="无" disabled autosize></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="群团组织推荐入党积极分子意见">
                      <el-input type="textarea" v-model="formInfo.userBranch.activist_recommended_opinions" placeholder="无" disabled autosize></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form> 
              <div slot="footer" class="dialog-footer">
                <el-button @click="resonVisible = true">不通过</el-button>
                <el-button type="primary" @click="nextTask()">通过</el-button>
              </div>
            </el-dialog>
            <!-- 不通过处理弹层 -->
            <el-dialog title="不通过处理" :visible.sync="resonVisible" width="410px" center>
              <el-form :model="reasonForNoPassForm">
                <el-form-item>
                  <el-input style="height: 100%" type="textarea" v-model="reasonForNoPassForm.reason" placeholder="(可选)不通过理由"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reasonForNoPass()">确 定</el-button>
                <el-button @click="resonVisible = false">取 消</el-button>
              </span>
            </el-dialog>
            <!-- ========================================================= -->
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
    name: 'ApplyFormReview',
    data() {
      return {
        total: 0, // 总记录数 
        page: 1, // 页码
        limit: 5, // 每页记录数
        tableData: [] //表格数据
        ,loading: true //加载遮罩
        ,dialogFormVisible: false //弹层
        ,rowInfo: {} //选中列信息
        ,formInfo: {
          userBranch: {
            firstContact: {}, 
            secondContact: {},
          },
          branch: {}
        } // 待渲染表单数据
        ,resonVisible: false //不通过理由弹窗
        ,reasonForNoPassForm: {
          status: -1, // -1不通过0待审核1审核通过
          reason: "", // 不通过理由
          id: -1 //用户id
        }// 不通过字段
      }
    }
    ,props: ['taskID'] //taskID是二级标签组组件传下来的任务id号
    ,mounted(){
      this.getTableData();
    }
    ,methods: {
      // 不通过处理
      reasonForNoPass(){
        //请求任务表格数据
        request({
          url: `auditUser/${this.reasonForNoPassForm.id}`,
          data: this.reasonForNoPassForm,
          method: 'put'
        }).then(res=>{
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1000
          })
          this.resonVisible = false
          this.dialogFormVisible = false
          this.getTableData()
        }).catch(err=>{
          this.$message({
            message: '操作失败，服务器开了小差',
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
      //信息审核
      ,infoReview(index, row){
        this.rowInfo = row
        
        request({
          url: `user/${row.casid}`
        }).then(res => {
          console.log(res);
          this.formInfo = res
          this.reasonForNoPassForm.id = res.id;
          this.dialogFormVisible = true
        }).catch(err => {
          this.formInfo = {}
          this.$message({
            message: '获取数据失败',
            type: 'error',
            duration: 1500
          })
          this.dialogFormVisible = false
        })
      }
      //进入下一任务接口
      ,nextTask() {
        let casid = this.rowInfo.casid;
        request({
          url: 'state/next_mission?casid=' + casid,
          method: 'put'
        }).then(res=>{
          this.getTableData();
          this.dialogFormVisible = false
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
    }
  }
</script>

<style scoped>

</style>
