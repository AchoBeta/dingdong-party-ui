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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template>
            <el-button type="mini" @click="selectionIntroducer(scope.row)"
              >指定培养联系人</el-button
            >
            <!-- 联系人表格 -->
            <el-dialog title="可选联系人" :visible.sync="dialogTableVisible">
              <!-- 表单 -->
              <el-form :inline="true" :model="selectForm">
                <el-input
                  v-show="false"
                  v-model="selectForm.develop_contact_first_id"
                ></el-input>
                <el-input
                  v-show="false"
                  disabled
                  v-model="selectForm.develop_contact_second_id"
                ></el-input>
                <el-form-item label="第一培养联系人(选填):">
                  <el-input
                    disabled
                    v-model="selectForm.firName"
                    placeholder="从下方选择"
                  ></el-input>
                </el-form-item>
                <el-form-item label="第二培养联系人(选填):">
                  <el-input
                    disabled
                    v-model="selectForm.secName"
                    placeholder="从下方选择"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="selectFormSubmit"
                    >确定</el-button
                  >
                </el-form-item>
              </el-form>
              <el-table
                :data="introducerData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  property="name"
                  label="姓名"
                  width="150"
                ></el-table-column>
                <el-table-column
                  property="party_positions"
                  label="党内职务"
                  width="200"
                ></el-table-column>
                <el-table-column
                  property="administrative_position"
                  label="行政职位"
                ></el-table-column>
                <el-table-column
                  property="party_age"
                  label="党龄"
                ></el-table-column>
              </el-table>
              <!-- 分页组件 -->
              <el-pagination
                background
                @size-change="innerChangeSizePage"
                @current-change="innerChangeCurrentPage"
                :current-page="selectForm.page"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="selectForm.limit"
                style="padding-top: 15px; text-align: center"
                layout="prev, pager, next, sizes, jumper, ->, total"
                :total="selectForm.total"
              >
              </el-pagination>
            </el-dialog>
            <!--  -->
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
  name: "AppointIntroducer",
  data() {
    return {
      dialogTableVisible: false, // 联系人弹窗
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      tableData: [], //表格数据
      loading: true, //加载遮罩
      introducerData: [], //联系人数据
      selectForm: {
        casid: "", // 学号
        develop_contact_first_id: "", // 第一培养联系人（选填）（若不填可以传0或不传）
        firName: "", // 第一培养联系人姓名 只作显示用
        develop_contact_second_id: "", // 第二培养联系人（选填）（若不填可以传0或不传）
        secName: "", // 第二培养联系人姓名 只作显示用
        page: 1,
        limit: 5,
        total: 0,
      },
    };
  },
  props: ["taskID"], //taskID是二级标签组组件传下来的任务id号
  mounted() {
    this.getTableData();
  },
  methods: {
    // 弹窗内
    innerChangeSizePage(size) {
      this.selectForm.size = size;
      this.getIntroducers();
    },
    // 弹窗内
    innerChangeCurrentPage(page) {
      this.selectForm.page = page;
      this.getIntroducers();
    },
    // 发送联系人表单
    selectFormSubmit() {
      if (this.selectForm.develop_contact_first_id == 0) {
        this.$message({
          message: "至少选择一个联系人",
          type: "error",
          duration: 1000,
        });
        return;
      }

      //获取联系人列表
      this.$post({
        url: `assignContacts`,
        params: {
          casid: this.selectForm.casid,
          develop_contact_first_id: this.selectForm.develop_contact_first_id,
          develop_contact_second_id: this.selectForm.develop_contact_second_id,
        },
      })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1000,
          });
          this.dialogTableVisible = false;
          this.nextTask(); // 进入下一任务
        })
        .catch((err) => {
          this.$message({
            message: "操作失败，服务器开了小差",
            type: "error",
            duration: 1000,
          });
        });
    },
    // 选择联系人
    selectionIntroducer(row) {
      this.selectForm.casid = row.casid;
      this.dialogTableVisible = true; // 弹窗现

      this.getIntroducers();
    },
    //获取联系人列表
    getIntroducers() {
      this.$get({
        url: `contacts`,
        params: {
          limit: this.selectForm.limit,
          page: this.selectForm.page,
        },
      })
        .then((res) => {
          this.selectForm.total = res.data.total;
          this.introducerData = res.data.data;
        })
        .catch((err) => {
          this.$message({
            message: "联系人数据获取失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    // 多选联系人
    handleSelectionChange(val) {
      if (val.length >= 2) {
        this.selectForm.develop_contact_first_id = val[0].id;
        this.selectForm.firName = val[0].name;
        this.selectForm.develop_contact_second_id = val[1].id;
        this.selectForm.secName = val[1].name;
      } else if (val.length == 1) {
        this.selectForm.develop_contact_first_id = val[0].id;
        this.selectForm.firName = val[0].name;
        this.selectForm.develop_contact_second_id = 0;
        this.selectForm.secName = "";
      } else {
        this.selectForm.develop_contact_first_id = 0;
        this.selectForm.firName = "";
        this.selectForm.develop_contact_second_id = 0;
        this.selectForm.secName = "";
      }
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
    //进入下一任务接口
    nextTask() {
      let casid = this.selectForm.casid;
      this.$put({
        url: "state/next_mission?casid=" + casid,
      })
        .then((res) => {
          this.getTableData();
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
  },
};
</script>

<style scoped></style>
