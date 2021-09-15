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
  name: "NextTask",
  data() {
    return {
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      tableData: [], //表格数据
      loading: true, //加载遮罩
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
  },
};
</script>

<style scoped></style>
