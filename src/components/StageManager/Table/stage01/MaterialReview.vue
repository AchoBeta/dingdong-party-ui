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
          <el-tag type="warning" v-if="!scope.row.details[0]"
            >未提交材料</el-tag
          >
          <el-tag v-else-if="scope.row.details[0].status == -1"
            >查重不过</el-tag
          >
          <el-tag v-else-if="scope.row.details[0].status == 0">待审核</el-tag>
          <el-tag type="success" v-else-if="scope.row.details[0].status == 1"
            >已审核通过</el-tag
          >
          <el-tag type="danger" v-else-if="scope.row.details[0].status == 2"
            >审核不通过</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            @click="getMaterial(scope.$index, scope.row)"
            >材料审核</el-button
          >
          <el-button
            size="mini"
            @click="reset(scope.$index, scope.row)"
            type="danger"
            >重置</el-button
          >
          <!-- 材料核审弹层 -->
          <el-dialog
            title="材料审核"
            :visible.sync="materialReviewVisible"
            width="400px"
            center
          >
            <!-- 主体 -->
            <div id="materialLayer">
              <el-button type="primary"
                ><a :href="materialURL">审核材料下载</a></el-button
              >
              <el-button type="warning"
                ><a :href="audit_url">已批注材料下载</a></el-button
              >
            </div>
            <!-- 底部按钮 -->
            <div slot="footer" class="dialog-footer">
              <el-button type="success" @click="nextTask()">审核通过</el-button>
              <el-button @click="resonVisible = true">不通过</el-button>
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
                  type="textarea"
                  v-model="reasonForNoPassForm.reason"
                  placeholder="(可选)不通过理由"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-upload
              drag
              ref="upload"
              :action="$store.state.baseURL + 'uploadDetailDoc'"
              :data="{ id: materialId }"
              :file-list="fileList"
              name="file[]"
              :limit="1"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                (可选)上传批注好的文档，该操作将覆盖原审核文件
              </div>
              <el-button
                v-show="false"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              >
            </el-upload>
            <el-button size="small" type="success" @click="temp"
              >上传到服务器</el-button
            >
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="reasonForNoPass()"
                >确 定</el-button
              >
              <el-button @click="resonVisible = false">取 消</el-button>
            </span>
          </el-dialog>
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
  name: "MaterialReview",
  data() {
    return {
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      tableData: [], //表格数据
      materialReviewVisible: false, //材料审核窗口显示变量
      resonVisible: false, //不通过弹层显示变量
      materialURL: "", //审核的材料url
      audit_url: "", //批注材料url
      materialId: 0, //审核材料的id
      reasonForNoPassForm: {
        id: -1, //材料id
        status: 2, //-1查重不过0待审核1已审核2不通过（默认为1）
        reason: "", //不通过原因（选填）
      },
      loading: true, //加载遮罩
      row: {}, //记录选中的对象
      fileList: [], //上传文件数组
    };
  },
  props: ["taskID"], //taskID是二级标签组组件传下来的任务id号
  mounted() {
    this.getTableData();
  },
  methods: {
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
    //不通过处理方法
    reasonForNoPass() {
      //获取审核材料id
      this.reasonForNoPassForm.id = this.materialId;
      this.reasonForNoPassForm.state = 2;
      //处理只有不通过原因的表单
      this.$post({
        url: "taskAudit",
        params: this.reasonForNoPassForm,
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1000,
          });
          //关闭俩个弹层
          this.resonVisible = false;
          this.materialReviewVisible = false;
          //fileList置空
          this.fileList = [];
          this.getTableData();
        })
        .catch((err) => {
          console.log(err);
          //fileList置空
          this.fileList = [];
          this.$message({
            message: "操作失败",
            type: "error",
            duration: 1000,
          });
        });
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
          console.log(res);
          for (let i = 0; i < res.user.length; i++) {
            res.user[i]["currTask"] = res.name; //给每个记录添加当前任务属性
          }
          this.total = res.total;
          this.tableData = res.user;
          this.loading = false;
        })
        .catch((err) => {
          this.$message({
            message: "表格数据获取失败",
            type: "error",
            duration: 1000,
          });
          this.loading = false;
        });
    },
    //获取审核材料
    getMaterial(index, row) {
      this.row = row;
      this.$get({
        url: "taskDetail",
        params: {
          task_id: this.taskID,
          user_id: row.casid,
        },
      })
        .then((res) => {
          this.materialReviewVisible = true;
          this.materialURL = res.url; //获取审核材料url
          this.audit_url = res.audit_url; //获取批注材料url
          this.materialId = res.id; //获取审核材料id
        })
        .catch((err) => {
          this.materialURL = "javascript:void(0);"; //审核材料url置空
          this.audit_url = "javascript:void(0);"; //批注材料url置空
          this.materialId = ""; //审核材料id置空
          this.$message({
            message: err.msg,
            type: "error",
            duration: 3000,
          });
          this.materialReviewVisible = false;
        });
    },
    //进入下一任务接口
    nextTask() {
      let casid = this.row.casid; //获取学号
      let name = this.row.name; //获得姓名
      //材料审核接口
      this.$post({
        url: "taskAudit",
        data: {
          id: this.materialId,
          status: 1, //1为已审核
        },
      })
        .then((res) => {
          //接上进入下一任务接口
          this.$put({
            url: "state/next_mission?casid=" + casid,
          })
            .then((res) => {
              this.getTableData(); //更新表格数据
              this.$message({
                message: name + " 成功进入下一任务",
                type: "success",
                duration: 1500,
              });
              //关闭弹窗
              this.materialReviewVisible = false;
            })
            .catch((err) => {
              this.$message({
                message: "操作失败",
                type: "error",
                duration: 1500,
              });
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
    //当上传文件超过限制时，触发函数
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传一个文件`);
    },
    //文件移除函数
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //文件上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    temp() {
      //开始上传
      this.submitUpload();
    },
    //文件上传成功函数
    handleSuccess(resp, file, fileList) {
      this.$message({
        message: "文件上传成功",
        type: "success",
        duration: 1500,
      });
      //上传完成后，设置该记录为不通过
      this.$post({
        url: "taskAudit",
        params: {
          id: this.materialId,
          status: 2,
        },
      })
        .then((res) => {
          this.$message({
            message: "该同学已设为不通过状态",
            type: "success",
            duration: 2000,
          });
        })
        .catch((err) => {
          this.$message({
            message: "设置不通过状态时失败",
            type: "error",
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
#materialLayer {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  text-decoration: none;
  color: white;
}
</style>
