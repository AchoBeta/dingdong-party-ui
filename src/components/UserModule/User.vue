<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片头 -->
      <div style="margin-left: 18%;">
        <div slot="header" class="card_header">
          <el-form :inline="true" :model="searchFormData">
            <div>
              <el-form-item label="支部">
                <el-select
                  v-model="value[0]"
                  clearable
                  placeholder="选择所在支部"
                >
                  <el-option
                    v-for="item in list1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="searchFormData.groupId = item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="阶段">
                <el-select
                  placeholder="选择所在阶段"
                  clearable
                  v-model="value[1]"
                >
                  <el-option
                    v-for="item in list2"
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
                  :placeholder="'输入期数,范围(0,' + periodMaxNum + ']'"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="学院">
                <el-select placeholder="选择所在学院" v-model="value[3]">
                  <el-option
                    v-for="item in listInstitute"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="loadMajor(item.id, item.name)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="专业">
                <el-select placeholder="选择所在专业" v-model="value[5]">
                  <el-option
                    v-for="item in listMajor"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    @click.native="searchFormData.major"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="年级">
                <el-input
                  v-model="searchFormData.grade"
                  :placeholder="
                    '输入年级,范围[' +
                      (gradeMaxNum - 3) +
                      ',' +
                      gradeMaxNum +
                      ']'
                  "
                ></el-input>
              </el-form-item>
            </div>
            <div style="margin-left: 29%">
              <el-form-item>
                <el-button type="primary" @click="beginSearch">搜索</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 卡片内容 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="所在支部" prop="branchName"></el-table-column>
        <el-table-column label="所在小组" prop="groupName"></el-table-column>
        <el-table-column label="所在学院" prop="institute"></el-table-column>
        <el-table-column label="年级" prop="grade"></el-table-column>
        <el-table-column label="专业" prop="major"></el-table-column>
        <el-table-column
          label="参与活动数"
          prop="activity"
          sortable
        ></el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.status == 0">未通过</el-tag>
            <el-tag type="success" v-if="scope.row.status != 0">已通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              style="text-align: center;margin-bottom: 10px"
              type="primary"
              size="mini"
              @click="SearchAllMsg(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!--详情表单弹出-->
      <el-dialog
        title="详细信息"
        :visible.sync="detailDialog"
        width="50%"
        :modal-append-to-body="false"
        top="1vh"
        :center="true"
      >
        <!-- 表单内容 -->
        <el-form :model="formInfo" label-position="top" label-width="120px">
          <el-form-item>
            <el-button
              v-if="authority == 3"
              style="margin-left: 85%;"
              type="primary"
              size="mini"
              @click="
                ruleForm.userId = formInfo.lastInfo.userId;
                registerDialog = true;
              "
              >设为管理员</el-button
            >
            <el-card shadow="always">
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
                  <el-form-item label="学号">
                    <el-input
                      v-model="formInfo.studentId"
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
                      v-model="formInfo.gender2"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="民族">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.nation"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="籍贯">
                    <el-input
                      v-model="formInfo.origin"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="身份证号">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.idCard"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="出生日期">
                    <el-date-picker
                      type="date"
                      placeholder="未填"
                      v-model="formInfo.birthday"
                      disabled
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="联系方式">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.phone"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="家庭住址">
                    <el-input
                      v-model="formInfo.familyAddress"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在院系">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.institute"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="所在专业">
                    <el-input
                      v-model="formInfo.major"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在班级">
                    <el-input
                      v-model="formInfo.className"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="所在社区">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.dormitoryArea"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="宿舍号">
                    <el-input
                      v-model="formInfo.dormitoryNo"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11">
                  <el-form-item label="职务">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.classPosition"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="入党时间">
                    <el-input
                      style="width: 98%"
                      v-model="formInfo.joinLeagueTime"
                      placeholder="未填"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-form-item>
          <el-form-item label="参与的活动" style="text-align: center">
            <el-card style="text-align: center">
              <div>
                <template>
                  <el-table :data="activities" style="width: 100%">
                    <el-table-column prop="name" label="活动名称" width="180">
                    </el-table-column>
                    <el-table-column
                      prop="startTime"
                      label="开始时间"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="endTime"
                      label="结束时间"
                      width="180"
                    >
                    </el-table-column>
                    <el-table-column prop="summary" label="总结" width="180">
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item
            v-if="formInfo.lastInfo.status == 0"
            label="信息审核"
            style="text-align: center;height: auto"
          >
            <el-card style="text-align: center">
              <el-button
                v-if="!this.show"
                type="primary"
                @click="
                  passInfo(
                    '通过',
                    formInfo.lastInfo.groupId,
                    formInfo.lastInfo.userId
                  )
                "
                style="margin-left: 10px"
                >通过</el-button
              >
              <el-button
                v-if="!this.show"
                type="primary"
                @click="changeShow"
                style="margin-left: 10px"
                >驳回</el-button
              >

              <div style="margin-bottom:50px" v-if="this.show">
                <el-input
                  type="textarea"
                  placeholder="请输入不通过的原因"
                  v-model="textarea"
                  maxlength="300"
                  show-word-limit
                >
                </el-input>
                <el-button
                  type="primary"
                  @click="
                    rejectInfo(
                      '不通过',
                      formInfo.lastInfo.groupId,
                      formInfo.lastInfo.userId
                    )
                  "
                  style="margin-left: 10px"
                  >提交</el-button
                >
              </div>
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
        :total="total"
      >
      </el-pagination>
      <!-- 弹出设置登录框 -->
      <el-dialog
        title="设置该管理员账号和密码"
        :visible.sync="registerDialog"
        width="50%"
        :modal-append-to-body="false"
        top="1vh"
        :center="true"
      >
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item v-if="groupId == null" label="授权党组">
            <el-select v-model="value[7]" placeholder="请选择授权党小组">
              <el-option
                v-for="item in demo01"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="ruleForm.groupId = id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限选择">
            <el-select v-model="value[8]" placeholder="请进行权限选择">
              <el-option
                v-for="item in authorityOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click.native="ruleForm.authority = item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "User",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //管理员权限
      authority: window.sessionStorage.getItem("authority"),
      //分页有关
      total: 10, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      //展示用户表面信息等
      tableData: [],
      //搜索数据
      searchFormData: {},
      //详细信息栏
      detailDialog: false,
      formInfo: {
        lastInfo: {},
      },
      //选项框
      value: ["", "", "", "", "", "", ""],
      list1: [],
      list2: [],
      periodMaxNum: 0,
      listInstitute: [],
      listMajor: [],
      gradeMaxNum: 0,
      //驳回原因表单
      rejectDialog: false,
      textarea: "",
      //展示活动
      activities: [],
      //作用于通过隐藏来实现信息审核的美观
      show: false,
      //注册弹出
      registerDialog: false,
      ruleForm: {
        username: "",
        pass: "",
        checkPass: "",
        userId: null,
        authority: null,
        branchId: "",
        groupId: "",
        id: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      //额....我太菜了
      demoTest: {},
      //有画蛇添足之嫌
      groupId: window.sessionStorage.getItem("groupId"),
      //权限选择数组
      authorityOption: [
        { id: "1", name: "创建" },
        { id: "2", name: "创建+审核" },
        { id: "3", name: "创建+审核+创建管理员" },
      ],
    };
  },
  methods: {
    // 改变页码
    changeCurrentPage(page) {
      this.page = page;
      this.beginSearch();
    },
    // 修改每页记录数
    changeSizePage(size) {
      this.limit = size;
      this.beginSearch();
    },
    //开始条件搜索
    beginSearch() {
      //我改了一下
      this.$get({
        url: "/base/users",
        data: {
          size: this.limit,
          page: this.page,
        },
      })
        .then((res) => {
          console.log("我进来了");
          console.log(res);
          this.tableData = res.data.list.items;
          this.total = res.data.list.total;
        })
        .catch((err) => {
          this.tableData = [];
          this.$message({
            message: "获取用户数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    //用户全部信息(表单渲染)
    SearchAllMsg(row) {
      //用户基本信息
      this.$get({
        url: "/base/users/" + row.userId + "/info", //拼接url
      })
        .then((res) => {
          this.formInfo = res.data.item.details; //把后端传过来的数据添加到一个数组中
          this.formInfo.name = row.name; //把名字带进表单
          //带数据进去;
          if (this.formInfo.gender != null) {
            this.formInfo.gender2 = this.formInfo.gender ? "男" : "女";
          } //把男女表式出来
          this.formInfo.lastInfo = row; //把前面的数据丢进表单

          console.log(this.formInfo); //打印出来看一下
          this.detailDialog = true; //弹出表单
        })
        .catch((err) => {
          this.formInfo = {};
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
          this.detailDialog = false;
        });
      //活动信息
      this.$get({
        url: "/base/users/" + row.userId + "/acitvities",
      })
        .then((res) => {
          this.activities = res.data.items;
          this.detailDialog = true;
        })
        .catch((err) => {
          this.formInfo.activities = {};
          this.$message({
            message: "获取活动数据失败",
            type: "error",
            duration: 1500,
          });
          this.detailDialog = false;
        });
    },
    //信息审核
    passInfo(status, groupId, userId) {
      //通过
      console.log(status + groupId + userId);
      this.$get({
        url: "/backstage/admins/examine-user-info",
        params: {
          status: status,
          groupId: groupId,
          userId: userId,
        },
      })
        .then((res) => {
          console.log(res);
          this.detailDialog = false;
        })
        .catch((err) => {
          this.formInfo = {};
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
          this.detailDialog = false;
        });
      this.detailDialog = false;
    },
    rejectInfo(status, groupId, userId) {
      //驳回
      this.rejectDialog = true; //弹出拒绝窗口
      //传到后端
      this.$get({
        url: "/backstage/admins/examine-user-info",
        params: {
          status: status,
          groupId: groupId,
          userId: userId,
          statusReason: this.textarea,
        },
      })
        .then((res) => {
          console.log(this.textarea);
          this.textarea = "";
          console.log(res);
          this.detailDialog = false;
          this.changeShow(); //还原一下
        })
        .catch((err) => {
          this.textarea = "";
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
          this.detailDialog = false;
        });
    },
    changeShow() {
      this.show = !this.show;
    },
    //添加管理员
    addAdmin(ruleForm) {
      this.demoTest = [];
      this.registerDialog = !this.registerDialog;
      this.demoTest = {
        //id: window.sessionStorage.getItem('adminId')   //管理员id,关闭浏览器/页面 数据就会清楚
        password: ruleForm.pass, //密码
        userId: ruleForm.userId, //用户id
        username: ruleForm.username, //账号
        authority: ruleForm.authority, //权限
        branchId: window.sessionStorage.getItem("branchId"), //党支部ID
        groupId: ruleForm.groupId, //党小组
      };
      console.log(this.demoTest);
      if (this.demoTest.groupId == "") {
        this.demoTest.groupId = window.sessionStorage.getItem("groupId");
      }
      console.log(this.demoTest);
      this.$post({
        url: "/backstage/admins",
        data: this.demoTest,
      })
        .then((res) => {
          console.log(res);
          if (!res.success) {
            this.$message({
              message: "设为管理员失败",
              type: "error",
            });
          } else {
            this.$message({
              message: "设为管理员成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "设为管理员失败",
            type: "error",
          });
        });
    },
    //密码审核函数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAdmin(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //加载选项信息
    loadGroup() {
      //不为空的是否不需要加载
      if (window.sessionStorage.getItem("groupId") != null) {
        //直接给它
        this.searchFormData.groupId = window.sessionStorage.getItem("groupId");
        this.list1 = [];
      } else {
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
            console.log(res);
            this.list1 = res.data.list.items;
          })
          .catch((err) => {
            this.$message({
              message: "获取数据失败",
              type: "error",
              duration: 1500,
            });
          });
      }
    },
    loadStage() {
      this.$get({
        url: "/base/stages",
      })
        .then((res) => {
          console.log(res);
          this.list2 = res.data.items;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    loadPeriod() {
      this.$get({
        url: "/base/others/max-periods",
      })
        .then((res) => {
          console.log(res);
          this.periodMaxNum = res.data.num;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    loadInstitute() {
      this.listMajor = [];
      this.$get({
        url: "/backstage/institutes",
      })
        .then((res) => {
          console.log(res);
          this.listInstitute = res.data.list;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    loadMajor(instituteId, instituteName) {
      console.log(instituteName, instituteId);
      this.searchFormData.institute = instituteName; //放数据到列表中
      this.$get({
        url: "/backstage/institutes/" + instituteId + "/major",
      })
        .then((res) => {
          console.log(res);
          this.listMajor = res.data.list;
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
    loadGrade() {
      this.$get({
        url: "/base/others/max-grade",
      })
        .then((res) => {
          console.log(res);
          this.gradeMaxNum = res.data.num;
          console.log(this.gradeMaxNum, "年级年级");
        })
        .catch((err) => {
          this.$message({
            message: "获取数据失败",
            type: "error",
            duration: 1500,
          });
        });
    },
  },
  created() {
    this.beginSearch();
    this.loadGroup();
    this.loadStage();
    this.loadPeriod();
    this.loadInstitute();
    this.loadGrade();
  },
};
</script>
