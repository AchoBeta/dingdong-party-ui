<template>
  <div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="学号" prop="casid"></el-table-column>
      <el-table-column
        label="所在党支部"
        prop="general_branch.name"
      ></el-table-column>
      <el-table-column label="所在进度" prop="currTask"></el-table-column>
      <el-table-column label="当前状态">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pivot.status == -1"
            >审核不通过</el-tag
          >
          <el-tag v-else-if="scope.row.pivot.status == 0">待审核</el-tag>
          <el-tag type="success" v-else-if="scope.row.pivot.status == 1"
            >已审核通过</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template>
            <!-- ========================================================= -->
            <el-button size="mini" @click="infoReview(scope.$index, scope.row)"
              >信息审核</el-button
            >
            <el-dialog
              title="信息审核"
              :visible.sync="dialogFormVisible"
              width="50%"
              top="1vh"
              :center="true"
            >
              <!-- 表单内容 -->
              <el-form
                :model="formInfo"
                label-position="top"
                label-width="120px"
              >
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="姓名">
                      <el-input
                        style="width: 98%"
                        v-model="formInfo.name"
                        placeholder="未填"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="联系方式">
                      <el-input
                        v-model="formInfo.mobile"
                        placeholder="未填"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="所在单位">
                      <el-input
                        style="width: 98%"
                        v-model="formInfo.institute"
                        placeholder="未填"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="所在党支部">
                      <el-input
                        v-model="formInfo.branch.name"
                        placeholder="未填"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="性别">
                      <el-input
                        style="width: 98%"
                        :value="formInfo.gender == '1' ? '男' : '女'"
                        placeholder="未填"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="确定为入党积极分子时间">
                      <el-date-picker
                        type="date"
                        placeholder="未填"
                        v-model="formInfo.userBranch.activist_time"
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="11">
                    <el-form-item label="出生日期">
                      <el-date-picker
                        type="date"
                        placeholder="未填"
                        v-model="formInfo.birth"
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="申请入党时间">
                      <el-date-picker
                        type="date"
                        placeholder="未填"
                        v-model="formInfo.userBranch.apply_time"
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="培养联系人1">
                  <el-card shadow="always">
                    <span v-if="!formInfo.userBranch.firstContact">无</span>
                    <el-row v-if="formInfo.userBranch.firstContact">
                      <el-col :span="11">
                        <el-form-item label="姓名">
                          <el-input
                            style="width: 98%"
                            :value="formInfo.userBranch.firstContact.name"
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label="党内职务">
                          <el-input
                            :value="
                              formInfo.userBranch.firstContact.party_positions
                            "
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="formInfo.userBranch.firstContact">
                      <el-col :span="11">
                        <el-form-item label="党龄">
                          <el-input
                            style="width: 98%"
                            :value="formInfo.userBranch.firstContact.party_age"
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label="行政职务">
                          <el-input
                            :value="
                              formInfo.userBranch.firstContact
                                .administrative_position
                            "
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-form-item>

                <el-form-item label="培养联系人2">
                  <el-card shadow="always">
                    <span v-if="!formInfo.userBranch.secondContact">无</span>
                    <el-row v-if="formInfo.userBranch.secondContact">
                      <el-col :span="11">
                        <el-form-item label="姓名">
                          <el-input
                            style="width: 98%"
                            :value="formInfo.userBranch.secondContact.name"
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label="党内职务">
                          <el-input
                            :value="
                              formInfo.userBranch.secondContact.party_positions
                            "
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="formInfo.userBranch.secondContact">
                      <el-col :span="11">
                        <el-form-item label="党龄">
                          <el-input
                            style="width: 98%"
                            :value="formInfo.userBranch.secondContact.party_age"
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11">
                        <el-form-item label="行政职务">
                          <el-input
                            :value="
                              formInfo.userBranch.secondContact
                                .administrative_position
                            "
                            placeholder="未填"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-form-item>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="奖励情况">
                      <el-input
                        type="textarea"
                        v-model="formInfo.userBranch.awards_info"
                        placeholder="无"
                        disabled
                        autosize
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="受处分情况">
                      <el-input
                        type="textarea"
                        v-model="formInfo.userBranch.disposition_info"
                        placeholder="无"
                        disabled
                        autosize
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item label="2次考察情况(半年一次)">
                      <el-input
                        type="textarea"
                        placeholder="无"
                        disabled
                        v-if="
                          !formInfo.userBranch
                            .investigation_in_half_year_activist
                        "
                      ></el-input>
                      <div
                        v-for="(item, index) in formInfo.userBranch
                          .investigation_in_half_year_activist"
                        :key="index"
                        style="margin-bottom: 5px"
                      >
                        <el-input
                          type="textarea"
                          :value="item"
                          placeholder="无"
                          disabled
                        ></el-input>
                      </div>
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
            <el-dialog
              title="不通过处理"
              :visible.sync="resonVisible"
              width="410px"
              center
            >
              <el-form :model="reasonForNoPassForm">
                <el-form-item>
                  <el-input
                    style="height: 100%"
                    type="textarea"
                    v-model="reasonForNoPassForm.reason"
                    placeholder="(可选)不通过理由"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="reasonForNoPass()"
                  >确 定</el-button
                >
                <el-button @click="resonVisible = false">取 消</el-button>
              </span>
            </el-dialog>
            <!-- ========================================================= -->
            <el-button
              size="mini"
              @click="reset(scope.$index, scope.row)"
              type="danger"
              style="margin: 5px"
              >重置</el-button
            >
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
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "FormReview",
  data() {
    return {
      reasonForNoPassForm: {
        casid: -1,
        status: -1,
        reason: "",
      }, //不通过表单
      resonVisible: false, // 不通过弹层
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      tableData: [], //表格数据
      loading: true, //加载遮罩
      dialogFormVisible: false, //弹层
      rowInfo: {}, //选中列信息
      formInfo: {
        branch: {},
        userBranch: {
          firstContact: {},
          secondContact: {},
        },
      }, // 待渲染表单数据
    };
  },
  props: ["taskID"], //taskID是二级标签组组件传下来的任务id号
  mounted() {
    this.getTableData();
  },
  methods: {
    //不通过处理函数
    reasonForNoPass() {
      this.reasonForNoPassForm.casid = this.rowInfo.casid;
      this.$post({
        url: `state/audit`,
        data: this.reasonForNoPassForm,
      })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1000,
          });
          this.resonVisible = false;
          this.dialogFormVisible = false;
          this.getTableData();
        })
        .catch((err) => {
          this.$message({
            message: "服务器开了小差",
            type: "error",
            duration: 1000,
          });
        });
    },
    // 改变页码
    changeCurrentPage(page) {
      this.page = page;
      this.loading = true;
      this.getTableData();
    },
    // 修改每页记录数
    changeSizePage(size) {
      this.limit = size;
      this.loading = true;
      this.getTableData();
    },
    //获取任务表格数据函数
    getTableData() {
      //请求任务表格数据
      this.$get({
        url: `task/${this.taskID}`,
        params: {
          limit: this.limit,
          page: this.page,
        },
      })
        .then((res) => {
          this.total = res.total;
          for (let i = 0; i < res.user.length; i++) {
            res.user[i]["currTask"] = res.name; //给每个记录添加当前任务属性
          }
          this.tableData = res.user;
          this.loading = false;
        })
        .catch((err) => {
          this.$message({
            message: "表格数据获取失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //重置进度（开发时测试使用）
    reset(index, row) {
      let casid = row.casid;
      this.$put({
        url: "state/resetState?casid=" + casid,
      })
        .then((res) => {
          this.getTableData();
          this.$message({
            message: "重置成功",
            type: "success",
            duration: 1500,
          });
        })
        .catch((err) => {
          this.$message({
            message: "重置失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //信息审核
    infoReview(index, row) {
      this.rowInfo = row;

      this.$get({
        url: `user/${row.casid}`,
      })
        .then((res) => {
          console.log(res);
          this.formInfo = res;
          this.dialogFormVisible = true;
        })
        .catch((err) => {
          this.formInfo = {};
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
          this.dialogFormVisible = false;
        });
    },
    //进入下一任务接口
    nextTask() {
      let casid = this.rowInfo.casid;
      this.$put({
        url: "state/next_mission?casid=" + casid,
      })
        .then((res) => {
          this.getTableData();
          this.dialogFormVisible = false;
          this.$message({
            message: "成功进入下一任务",
            type: "success",
            duration: 1500,
          });
        })
        .catch((err) => {
          this.$message({
            message: "操作失败",
            type: "error",
            duration: 1500,
          });
        });
    },
  },
};
</script>

<style scoped></style>
