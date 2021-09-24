<template>
  <div>
    <el-card shadow="hover">
      <div class="contain-out">
        <div class="contain">
          <el-descriptions
            title="负责人信息"
            direction="vertical"
            :column="4"
            border
            colon
          >
            <el-descriptions-item label="姓名">{{
              formLabelAlign.directorName
            }}</el-descriptions-item>
            <el-descriptions-item label="负责人id">{{
              formLabelAlign.directorId
            }}</el-descriptions-item>
            <el-descriptions-item label="所在党委">{{
              branchName
            }}</el-descriptions-item>
            <el-descriptions-item label="所在党支部" v-if="groupId">{{
              groupList[groupId].name
            }}</el-descriptions-item>
          </el-descriptions>
          <el-form
            :label-position="labelPosition"
            label-width="80px"
            :model="formLabelAlign"
            class="form-contain"
          >
            <el-form-item label="党支部" required>
              <el-select
                v-model="formLabelAlign.groupId"
                placeholder="选择党支部"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  @click.native="formLabelAlign.groupId = item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称" required>
              <el-input
                placeholder="请输入活动名称"
                v-model="formLabelAlign.name"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="活动摘要" required>
              <el-input
                placeholder="请输入活动摘要"
                v-model="formLabelAlign.summary"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="活动地点" required>
              <el-input
                placeholder="请输入活动地点"
                v-model="formLabelAlign.address"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="活动详情" required>
              <el-input
                placeholder="请输入活动详情"
                v-model="formLabelAlign.content"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="活动时间" required>
              <div class="block">
                <el-date-picker
                  v-model="formLabelAlign.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间"
                >
                </el-date-picker>
                <span>&nbsp;--&nbsp;</span>
                <el-date-picker
                  v-model="formLabelAlign.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="最大参与人数" required>
              <el-input
                placeholder="请输入最大数量"
                v-model="formLabelAlign.limitNum"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="负责人邮箱" required>
              <el-input
                placeholder="请输入本人邮箱地址"
                v-model="formLabelAlign.email"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="公告链接">
              <el-input
                placeholder="请输入公告链接"
                v-model="formLabelAlign.announcement"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item id="button-item">
              <el-button type="primary" plain @click="saveAsDraft"
                >保存草稿</el-button
              >
              <el-button type="primary" @click="submitForm">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <!--  选择用户  -->
    <el-dialog
      title="选择活动参与人员"
      :visible.sync="activityDialog"
      width="50%"
      :modal-append-to-body="false"
      top="1vh"
      :center="true"
    >
      <el-form :inline="true" v-if="!hidden">
        <el-form-item label="阶段">
          <el-select placeholder="选择所在阶段" clearable v-model="groupVal">
            <el-option
              v-for="item in stagesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click.native="searchFormData.stageId = item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期数">
          <el-input
            v-model="searchFormData.periodsNum"
            :placeholder="'输入期数,范围(0,' + periodsNum + ']'"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="beginSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" v-if="hidden">
        <el-form-item>
          <el-select
            v-model="userIds"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择人员"
          >
            <el-option
              v-for="item in usersOptions"
              :key="item.userId"
              :label="item.name"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitUsers">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import router from "../../router";

export default {
  name: "ActivityCreate",
  data() {
    return {
      //分页属性
      page: 1,
      size: 5,
      //创建表单形式
      labelPosition: "top",
      //创建表单填写
      formLabelAlign: {
        address: "",
        announcement: "",
        attention: "",
        branchId: "",
        content: "",
        directorId: "",
        directorName: "",
        email: "",
        enclosure: "",
        endTime: "",
        groupId: "",
        id: "",
        limitNum: 0,
        name: "",
        num: 0,
        startTime: "",
        status: 0,
        summary: "",
      },
      //方便使用的
      branchId: window.sessionStorage.getItem("branchId"),
      groupId: window.sessionStorage.getItem("groupId"),
      name: window.sessionStorage.getItem("name"),

      // 党委列表
      branchName: "",
      //党小组
      groupList: [],
      groupVal: "",

      //储存一下活动Id再说
      activityId: "",
      userIds: [], //保存用户id的数组

      //活动参与人员选择
      activityDialog: false,
      searchFormData: {},
      userName: "", //方面显示人员
      //阶段
      stagesList: [],
      //期数
      periodsNum: 0,

      //适当是隐藏搜索
      hidden: false,

      //用户渲染
      usersOptions: [],

      pageSize: 5,
      pageNo: 1,
    };
  },
  created() {
    //获取党委列表
    this.loadBranch();
    //加载党小组
    this.loadGroups();
    //加载期数
    this.loadStages();
    //加载阶段
    this.loadPeriodsNum();

    this.formLabelAlign.directorName = window.sessionStorage.getItem("name"); //名字
    this.formLabelAlign.directorId = window.sessionStorage.getItem("adminId"); //管理员ID
    this.formLabelAlign.groupId =
      window.sessionStorage.getItem("groupId") || ""; //groudId
    this.formLabelAlign.branchId = window.sessionStorage.getItem("branchId"); //branchId
  },
  methods: {
    selectGroup(e) {
      this.formLabelAlign.groupId = e;
    },
    //提交草稿
    saveAsDraft() {
      this.$post({
        url: "/organization/activities",
        data: this.formLabelAlign,
      })
        .then((res) => {
          if (res.success) {
            this.formLabelAlign = {};
            router.push("/home/activity/activityList");
          } else {
            this.$message({
              message: "没有填写完必填信息",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "保存草稿失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //提交活动
    submitForm() {
      this.$post({
        url: "/organization/activities",
        data: Object.assign(this.formLabelAlign, { status: 1 }),
      })
        .then((res) => {
          if (res.success) {
            this.formLabelAlign = {};
            this.activityId = res.data.activityId; //保存一下活动Id
            this.activityDialog = true; //弹窗显示
            // console.log(res);
          } else {
            this.$message({
              message: "没有填写完必填信息",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "创建活动失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //获取用户所在党委名称
    loadBranch() {
      this.$get({
        url: "/base/branches",
        params: {
          page: this.pageNo,
          size: this.pageSize,
        },
      }).then((res) => {
        let branch = res.data.list.items.filter((item) => {
          return item.id == this.formLabelAlign.branchId;
        });
        this.branchName = branch[0].name;
      });
    },
    //党小组
    loadGroups() {
      //选项 党组
      this.$get({
        url:
          "/base/branch/" +
          window.sessionStorage.getItem("branchId") +
          "/groups",
        params: {
          page: 1,
          size: 100,
        },
      })
        .then((res) => {
          console.log(res.data.list.items);
          this.groupList = res.data.list.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
      if (window.sessionStorage.getItem("groupId") == null) {
        this.formLabelAlign.groupId = window.sessionStorage.getItem("groupId");
      }
    },
    //阶段
    loadStages() {
      this.$get({
        url: "/base/stages",
      })
        .then((res) => {
          console.log(res);
          this.stagesList = res.data.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //期数
    loadPeriodsNum() {
      this.$get({
        url: "/base/others/max-periods",
      })
        .then((res) => {
          console.log(res);
          this.periodsNum = res.data.num;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //挑选出用户
    beginSearch() {
      this.groupVal = ""; //不然好像会有bug，哎
      this.searchFormData.branchId = window.sessionStorage.getItem("branchId");
      this.searchFormData.groupId = this.groupId;
      console.log(this.searchFormData);
      this.$get({
        url: "/base/users",
        params: {
          page: 1,
          size: 100,
          searchFormData: this.searchFormData,
        },
      })
        .then((res) => {
          console.log("beginSearch:");
          console.log(res);
          let dataList = res.data.list.items;
          dataList.forEach((item) => {
            this.usersOptions[this.usersOptions.length] = {
              userId: item.userId,
              name: item.name,
            };
          });
          this.hidden = true;
        })
        .catch((err) => {
          this.$message({
            message: "搜索人员失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //提交人员
    submitUsers() {
      this.userIds.forEach((item) => {
        item = item.userId;
      });
      console.log("userIds.....");
      console.log(this.userIds);
      this.$post({
        url:
          "/organization/activities/" +
          this.activityId +
          "/users/add?" +
          "branchId=" +
          this.branchId +
          "&" +
          "groupId=" +
          this.groupId,
        data: this.userIds,
      })
        .then((res) => {
          console.log(res);
          if (res.success) {
            this.$message({
              message: "选择的人员参与成功",
              type: "success",
            });
            this.activityDialog = false;
          } else {
            this.$message({
              message: "失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "人员提交失败",
            type: "error",
            duration: 1500,
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.contain-out {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contain {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
}
.form-contain {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-evenly;
  align-items: center;
}
/deep/ .el-form-item {
  width: 500px;
}

#button-item {
  text-align: center;
}

/deep/.el-descriptions-item__cell {
  width: 268px;
}

/deep/ .el-descriptions {
  margin-bottom: 30px;
}
</style>
