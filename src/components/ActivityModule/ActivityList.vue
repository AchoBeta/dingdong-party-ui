<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片头 -->
      <div style="box-top-contain">
        <div slot="header" class="card_header">
          <el-form :inline="true" :model="searchFormData">
            <div class="box-top-contain-item">
              <el-form-item label="院党委">
                <el-select
                  v-model="searchFormData.branchId"
                  placeholder="选择所属院党委"
                  :disabled="disabledBranch"
                >
                  <el-option
                    v-for="item in optionBranch"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="getGroup(item.id)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="党支部">
                <el-select
                  placeholder="选择所属党支部"
                  v-model="searchFormData.groupId"
                  :disabled="disabledGroup"
                >
                  <el-option
                    v-for="item in optionGroup"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="getDirector(item.id)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建人">
                <el-autocomplete
                  v-model="searchFormData.directorName"
                  :fetch-suggestions="directorSearchAsync"
                  placeholder="请输入负责人姓名"
                  clearable
                  @select="selectDirector"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="活动状态">
                <el-select
                  placeholder="选择活动状态"
                  v-model="searchFormData.status"
                >
                  <el-option
                    v-for="(item, index) in optionsActivityStatus"
                    :key="index"
                    :label="item"
                    :value="index"
                    @click.native="searchFormData.status = index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="searchFormData.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择活动开始时间"
                >
                </el-date-picker>
                <el-date-picker
                  v-model="searchFormData.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择活动结束时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="beginSearch">搜索</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 卡片内容 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="活动名称" prop="name"></el-table-column>
        <el-table-column label="创建人" prop="directorName"></el-table-column>
        <el-table-column label="院党委" prop="branchName"></el-table-column>
        <el-table-column label="党支部" prop="groupName"></el-table-column>
        <el-table-column
          label="活动开始时间"
          prop="startTime"
        ></el-table-column>
        <el-table-column label="活动结束时间" prop="endTime"></el-table-column>
        <el-table-column label="活动状态" prop="status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status == 0">草稿</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status == 1"
              >未审核</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status == 2"
              >被驳回</el-tag
            >
            <el-tag type="success" v-else-if="scope.row.status == 3"
              >已审批</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status == 4"
              >正进行</el-tag
            >
            <el-tag type="success" v-else>已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              style="text-align: center;margin-bottom: 10px"
              type="primary"
              size="mini"
              @click="SearchAllMsg(scope.row.id)"
              >详情</el-button
            >
            <el-button
              style="text-align: center;margin-bottom: 10px"
              type="danger"
              size="mini"
              @click="delectActivity(scope.row.id)"
              >删除</el-button
            >
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
        :center="true"
      >
        <el-descriptions title="活动信息">
          <template slot="extra">
            <el-button
              type="success"
              size="small"
              v-if="formInfo.status == 1"
              @click="approveActivity"
              >通过审核</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-if="formInfo.status == 0 && disableFormInfo"
              @click="disableFormInfo = false"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-if="!disableFormInfo"
              @click="changeFrom(formInfo.id)"
              >完成</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-if="formInfo.status == 0 && disableFormInfo"
              @click="SubmitActivity(formInfo.id)"
              >提交审核</el-button
            >
          </template>
        </el-descriptions>
        <!-- 表单内容 -->
        <el-card>
          <el-form :model="formInfo" label-position="top" label-width="120px">
            <el-row>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="负责人姓名">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.directorName"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="负责人邮箱">
                    <el-input
                      v-model="formInfo.email"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
            </el-row>
            <el-row justify="center">
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="活动名称">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.name"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="活动状态">
                    <el-input
                      placeholder="未知"
                      :value="optionsActivityStatus[formInfo.status]"
                      disabled
                    ></el-input>
                  </el-form-item></div
              ></el-col>
            </el-row>
            <el-form-item label="活动摘要">
              <el-input
                v-model="formInfo.summary"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="未填"
                :disabled="disableFormInfo"
              ></el-input>
            </el-form-item>
            <el-form-item label="活动内容">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="formInfo.content"
                placeholder="未填"
                :disabled="disableFormInfo"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8"
                ><div class="grid-content bg-purple">
                  <el-form-item label="开始时间">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.startTime"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="8"
                ><div class="grid-content bg-purple">
                  <el-form-item label="结束时间">
                    <el-input
                      v-model="formInfo.endTime"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="8"
                ><div class="grid-content bg-purple">
                  <el-form-item label="报名截止">
                    <el-input
                      v-model="formInfo.endTime"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="活动地址">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.address"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="人数限制">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.directorName"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
            </el-row>
            <el-form-item label="注意事项">
              <el-input
                style="width: 98%"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="formInfo.attention"
                placeholder="未填"
                :disabled="disableFormInfo"
              ></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12"
                ><div class="grid-content bg-purple">
                  <el-form-item label="公告链接">
                    <el-input
                      v-model="formInfo.announcement"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
              <el-col :span="12"
                ><div class="grid-content bg-purple-light">
                  <el-form-item label="附件链接">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.enclosure"
                      placeholder="未填"
                      :disabled="disableFormInfo"
                    ></el-input>
                  </el-form-item></div
              ></el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-descriptions title="活动参与人"></el-descriptions>
        <el-card>
          <span>活动参与人数:{{ total2 }}</span>
          <div>
            <el-table :data="userList" stripe style="width: 100%">
              <el-table-column prop="name" label="姓名"> </el-table-column>
              <el-table-column label="身份">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.studentId != null"
                    >学生</el-tag
                  >
                  <el-tag type="success" v-if="scope.row.teacherId != null"
                    >老师</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column prop="branchName" label="党委名称">
              </el-table-column>
              <el-table-column prop="groupName" label="党支部名称">
              </el-table-column>
              <el-table-column prop="stageId" label="阶段"> </el-table-column>
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
            :total="total2"
          >
          </el-pagination>
        </el-card>
        <el-descriptions title="活动评价"></el-descriptions>

        <el-card>
          <div>
            <el-table :data="userComment" stripe style="width: 100%">
              <el-table-column prop="name" label="评价人"> </el-table-column>
              <el-table-column prop="content" label="内容"> </el-table-column>
              <el-table-column prop="time" label="评价时间"> </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    style="text-align: center;margin-bottom: 10px"
                    type="danger"
                    size="mini"
                    @click="deleteComment(scope.row.id)"
                    plain
                    >删除</el-button
                  >
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
              :total="total3"
            >
            </el-pagination>
          </div>
        </el-card>
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
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ActivityList",
  data() {
    return {
      //展示表单
      tableData: [],
      //搜索表单
      searchFormData: {
        branchId: window.sessionStorage.getItem("branchId"),
        directorId: window.sessionStorage.getItem("adminId"), //负责人
        directorName: "", //负责人名称
        endTime: "", //截止时间
        groupId: window.sessionStorage.getItem("group"), //党组Id
        name: "", //活动名称
        startTime: "", //起始时间
        status: null, //审批状态
      },
      //选项
      optionsActivityStatus: [
        "草稿",
        "待审批",
        "被驳回",
        "未开始",
        "进行中",
        "已结束",
      ],
      optionBranch: [], //党支部
      disabledBranch: false,
      optionGroup: [], //党小组
      disabledGroup: false,
      optionDirector: [], //负责人

      //分页相关变量
      total: 0,
      page: 1,
      size: 10,
      //详情分页插件1
      total2: 0,
      page2: 1,
      size2: 5,
      //详情分页插件2
      total3: 0,
      page3: 1,
      size3: 5,
      //详情表展示所需变量
      detailDialog: false,
      //时间范围弹窗
      timeDialog: false,
      //表单信息
      formInfo: {},
      disableFormInfo: true, //详情页表单锁定
      //活动参与人数统计和用户列表
      userList: [],
      //活动结束评价
      userComment: [],
      //绑定详情的id来使用
      detailId: "",

      pageNo: 1,
      pageNum: 5,
    };
  },
  created() {
    this.getBranch();
    if (this.searchFormData.groupId) {
      this.disabledGroup = true;
      this.disabledBranch = true;
      this.getGroup(this.searchFormData.branchId);
    } else if (this.searchFormData.branchId) {
      this.disabledBranch = true;
      this.getGroup(this.searchFormData.branchId);
    }
    this.beginSearch();
  },
  methods: {
    //获取党委列表
    getBranch() {
      //获取党支部数据
      this.$get({
        url: "/base/branches",
        params: {
          page: 1,
          size: 100,
        },
      })
        .then((res) => {
          this.optionBranch = res.data.list.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //通过党支部的选择来获取党小组的选择
    getGroup(branchId) {
      this.searchFormData.branchId = branchId; //把传进来的值放到对应位置
      this.$get({
        url: "/base/branch/" + branchId + "/groups",
        params: {
          page: 1,
          size: 100,
        },
      })
        .then((res) => {
          this.optionGroup = res.data.list.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //获取当前党支部全部负责人
    getDirector(groupId) {
      this.searchFormData.groupId = groupId;
      this.$get({
        url: "/backstage/admins",
        params: {
          branchId: this.searchFormData.branchId,
          groupId: this.searchFormData.groupId,
          page: 1,
          size: 100,
          authority: 2, //？？？什么含义
        },
      })
        .then((res) => {
          for (let i of res.data.list.items) {
            i.value = i.name; //将想要展示的数据作为value
          }
          this.optionDirector = res.data.list.items;
        })
        .catch((err) => {
          this.optionDirector = [];
          console.log(err);
        });
    },
    //搜索创建人
    directorSearchAsync(queryString, cb) {
      let optionDirector = this.optionDirector;
      let res = queryString
        ? optionDirector.filter((item) => {
            return item.name.indexOf(queryString) === 0;
          })
        : optionDirector;
      cb(res);
    },
    selectDirector(e) {
      this.searchFormData.directorId = e.userId;
      this.searchFormData.directorName = e.name;
    },
    //开始搜索
    beginSearch() {
      //把时间选择放进来
      // console.log(this.searchFormData);
      this.$get({
        url: "/organization/activities",
        params: {
          page: this.page,
          size: this.size,
          searchFormData: this.searchFormData,
        },
      })
        .then((res) => {
          this.tableData = res.data.list.items || {}; //数据展示
          // this.tableData.forEach((item) => {
          //   item.branchName = this.optionBranch.filter(
          //     (i) => i.id == item.branchId
          //   );
          //   item.groupName = this.optionGroup.filter(
          //     (i) => i.id == item.groupId
          //   );
          // });
          this.total = res.data.list.total; //数据总条数
          this.value = [];
        })
        .catch((err) => {
          console.log(err);
          this.formInfo = {};
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
          this.detailDialog = false;
        });
    },
    //获取活动详情并显示详情框
    SearchAllMsg(id) {
      this.$get({
        url: "/organization/activities/" + id,
        params: {
          page: 1,
          size: 100,
        },
      })
        .then((res) => {
          //数据复刻
          this.formInfo = res.data.item;
          //调用函数:获取参与活动人和人数
          this.getActivityUser(id);
          //调用函数:获取评论
          this.getCommentList(id);
          //绑定这个id到后面分页使用
          this.detailId = id;
          //由于到这里说明detailId改变了,因此
          this.page2 = 1;
          this.size2 = 5;
          this.total2 = 0;
          //由于到这里说明detailId改变了,因此
          this.page3 = 1;
          this.size3 = 5;
          this.total3 = 0;
          //数据到位了再开
          this.detailDialog = true;
        })
        .catch((err) => {
          this.formInfo = {};
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
          this.detailDialog = false;
        });
    },
    delectActivity(id) {
      console.log(id);
      this.$del({
        url: "/organization/activities/" + id,
      })
        .then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$message({
            message: "删除活动失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    changeFrom(id) {
      this.$put({
        url: "/organization/activities/" + id,
        data: this.formInfo,
      })
        .then((res) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
          this.disableFormInfo = true;
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "修改活动失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //活动提交审核
    SubmitActivity(id) {
      this.$post({
        url: "/organization/activities/" + id + "/commit",
        params: {
          activityId: id,
        },
      }).then((res) => {
        console.log(res);
      });
    },
    //活动通过审核
    approveActivity(id) {},
    // 改变页码
    changeCurrentPage(page) {
      this.page = page;
      this.beginSearch();
    },
    // 修改每页记录数
    changeSizePage(size) {
      this.size = size;
      this.beginSearch();
    },
    // 改变页码
    changeCurrentPage2(page) {
      this.page2 = page;
      this.getActivityUser(this.detailId);
      console.log(this.detailId);
    },
    // 修改每页记录数
    changeSizePage2(size) {
      this.size2 = size;
      this.getActivityUser(this.detailId);
    },
    // 改变页码
    changeCurrentPage3(page) {
      this.page3 = page;
      this.getCommentList(this.detailId);
    },
    // 修改每页记录数
    changeSizePage3(size) {
      this.size3 = size;
      this.getCommentList(this.detailId);
    },
    //获取参与活动用户及人数
    getActivityUser(id) {
      this.$get({
        url: "/organization/activities/" + id + "/users",
        params: {
          page: this.page2,
          size: this.size2,
        },
      })
        .then((res) => {
          console.log("活动参与人", res);
          this.userList = res.data.list.items;
          this.total2 = res.data.list.total;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //评价列表
    getCommentList(id) {
      this.$get({
        url: "/organization/activities/" + id + "/comments",
        params: {
          page: this.page3,
          size: this.size3,
        },
      })
        .then((res) => {
          console.log("活动评论", res.data.list.items);
          this.userComment = res.data.list.items; //获取需要的数据
          this.total3 = res.data.list.total; //获取总数
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1000,
          });
        });
    },
    //评价删除
    deleteComment(id) {
      this.$del({
        url: "/organization/activities/" + this.detailId + "/comments/" + id,
      })
        .then((res) => {
          console.log(res);
          //删除之后我们要刷新一下
          this.getCommentList(this.detailId);
        })
        .catch((err) => {
          this.$message({
            message: "删除评论失败",
            type: "error",
            duration: 1000,
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
.box-top-contain {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.box-top-contain-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0vw 15vw;
  flex-wrap: wrap;
}

/deep/ .el-form-item {
  margin-right: 20px;
}
/deep/ .el-form-item__label {
  width: 70px;
  height: 40px;
  text-align: justify;
  text-align-last: justify;
}

/deep/ .el-card {
  margin-bottom: 30px;
}
</style>
