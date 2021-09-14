<template>
  <div class="conducter-list-wrapper">
    <div class="conducter-list-box">
      <el-form :inline="true" :model="form">
        <el-form-item label="党支部">
          <el-select
            :loading="loading"
            @change="getGroupOptions"
            placeholder="选择党支部"
            v-model="form.branchId"
          >
            <el-option
              v-for="item in branchOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="党组">
          <el-select
            :loading="loading"
            placeholder="选择党组"
            v-model="form.groupId"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="operateBtn">
          <el-button
            size="medium"
            type="primary"
            class="ml-3"
            @click="getList"
            :loading="loading"
            >搜索</el-button
          >
          <el-button
            size="medium"
            type="primary"
            class="ml-3"
            @click="AddManager"
            :loading="loading"
            >添加</el-button
          >
        </el-form-item>
        <el-dialog
          title="搜索"
          :visible.sync="managerDetailVisible"
          style="width: 120%"
        >
          <el-form-item label="姓名">
            <el-input v-model="stuName" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="stuId" placeholder="学号"></el-input>
            <el-button type="primary" size="mini" @click="Search"
              >查询</el-button
            >
          </el-form-item>
          <el-table :data="managerData" style="width: 100%">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="身份" prop="name"></el-table-column>
            <el-table-column
              label="所在党支部"
              prop="branchName"
            ></el-table-column>
            <el-table-column label="所在阶段" prop="stage"></el-table-column>
            <el-table-column label="所在批次" prop="name"></el-table-column>
            <el-table-column
              label="进入当前阶段时间"
              prop="name"
            ></el-table-column>
            <el-table-column label="所在学院" prop="name"></el-table-column>
            <el-table-column label="年级" prop="name"></el-table-column>
            <el-table-column label="专业" prop="name"></el-table-column>
            <el-table-column label="身份验证" prop="name"></el-table-column>
            <el-table-column label="操作" prop="name"></el-table-column>
          </el-table>
        </el-dialog>
      </el-form>
      <!-- 表格内容 -->
      <div v-loading="loading">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="学号/工号" prop="studentId"></el-table-column>
          <el-table-column label="管理员权限" prop="branchId"></el-table-column>
          <el-table-column label="管理范围" prop="groupId"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="getAllInfo(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 详情页面弹出 -->
        <el-dialog title="收货地址" :visible.sync="detailDialogVisible">
          <el-table :data="gridData">
            <el-table-column
              property="date"
              label="日期"
              width="150"
            ></el-table-column>
            <el-table-column
              property="name"
              label="姓名"
              width="200"
            ></el-table-column>
            <el-table-column property="address" label="地址"></el-table-column>
          </el-table>
        </el-dialog>
        <!-- 分页组件 -->
        <div class="text-right">
          <el-pagination
            class="mt-3 text-center"
            @size-change="changePageSize"
            @current-change="changePageNo"
            :current-page="pageNo"
            :page-size="pageSize"
            :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      managerDetailVisible: false,
      managerData: [],
      stuName: "",
      stuId: "201944101218",
      gridData: [],
      loading: false,
      adminId: "",
      branchOptions: [],
      groupOptions: [],
      form: {
        branchId: "",
        groupId: "",
        authority: "",
      },
      tableData: [],
      pageSize: 5,
      pageNo: 1,
      total: 0,
      detailDialogVisible: false,
    };
  },
  created() {
    this.getBranchOptions();
  },
  methods: {
    // 获取支部选项
    async getBranchOptions() {
      let res = await this.$get({
        url: "/base/branches",
        params: {
          page: this.pageNo,
          size: this.pageSize,
        },
      });
      if (res.code != 200) {
        return this.$message({
          message: "获取用户数据失败",
          type: "error",
          duration: 1500,
        });
      }
      this.branchOptions = res.data.list.items;
      // console.log(this.branchOptions);
    },
    // 获取党组选项
    async getGroupOptions() {
      let res = await this.$get({
        url: "/base/branch/" + this.form.branchId + "/groups",
        params: {
          branchId: this.form.branchId,
          page: this.pageNo,
          size: this.pageSize,
        },
      });
      if (res.code != 200) {
        return this.$message({
          message: "获取用户数据失败",
          type: "error",
          duration: 1500,
        });
      }
      this.groupOptions = res.data.list.items;
      // console.log(this.groupOptions);
    },
    // 获取列表
    async getList() {
      let res = await this.$get({
        url: "/backstage/admins",
        params: {
          page: this.pageNo,
          size: this.pageSize,
          groupId: this.form.groupId,
          branchId: this.form.branchId,
          // ? 这个管理员权限等级是哪个数据？
          authority: 2,
        },
      });
      if (res.code != 200) {
        return this.$message({
          message: "获取用户数据失败",
          type: "error",
          duration: 1500,
        });
      }
      this.tableData = res.data.list.items;
      this.total = res.data.list.total;
      // console.log(this.tableData);
    },

    // * 关闭与打开弹窗，详情
    getAllInfo() {
      this.detailDialogVisible = true;
    },
    onCloseDetailDialog() {
      this.detailDialogVisible = false;
    },

    // * 添加管理员操作
    AddManager() {
      this.managerDetailVisible = true;
    },
    async Search() {
      let res = this.$get({
        url: "/base/students/201944101218",
        params: {},
      });
      console.warn(res);
    },

    // * 换页或者显示函数
    changePageNo(pageNo) {
      this.pageNo = pageNo;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },

    //  async Search() {
    //       let res = await this.$get({
    //         url: "/base/users",
    //         params: {
    //           size: 6,
    //           page: 1,
    //         },
    //       });
    //       if (res.code != 200) {
    //         return this.$message({
    //           message: "获取用户数据失败",
    //           type: "error",
    //           duration: 1500,
    //         });
    //       }
    //       this.managerData = res.data.list.items;
    //       // console.log(this.managerData);

    //      this.searchStage();
    //      this.managerData.forEach(items => {
    //        this.searchStu(items);
    //        })

    //     },
    //     // * 获取所在阶段
    //     async searchStage() {
    //       let res = await this.$get({
    //         url: "/base/stages/"
    //       });
    //        if (res.code != 200) {
    //         return this.$message({
    //           message: "获取用户数据失败",
    //           type: "error",
    //           duration: 1500,
    //         });
    //       }
    //       let stage = res.data.items;
    //       // console.log(stage);
    //       this.managerData.forEach((element) => {
    //         if (element.stageId) {
    //           element.stage = stage[element.stageId - 1].name;
    //           //  console.log(element.stageId);
    //         }
    //       });
    //     },
    //     async searchStu(data) {
    //       let res = await this.$get({
    //         url: `/base/students/${data.studentId}`
    //       })
    //       console.log(res);
    //       console.log(1);
    //     },
  },
};
</script>

<style scoped>
.ml-3 {
  margin-left: 18px;
}

.mb-3 {
  margin-bottom: 18px;
}

.mt-3 {
  margin-top: 18px;
}

.text-right {
  text-align: right;
}

.conducter-list-wrapper {
  padding: 32px;
  background-color: #fff;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.el-form {
  position: relative;
}
.operateBtn {
  position: absolute;
  right: 0;
}
.el-input {
  width: 200px;
  display: inline-block;
}
.el-dialog .el-button {
  margin-left: 40px;
}
</style>
