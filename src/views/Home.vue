<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        :router="true"
        :collapse="isCollapse"
        background-color="#20222A"
        text-color="#fff"
        :default-active="$route.path"
        open="1"
        active-text-color="#ffd04b"
      >
        <div id="title">党建君-叮咚党建</div>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>主页</span>
          </template>
          <el-menu-item index="/home/console">
            <i class="el-icon-s-data"></i>
            <span>控制台</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>管理模块</span>
          </template>
          <el-menu-item index="/home/admin">
            <i class="el-icon-menu"></i>
            <span>管理员列表</span>
          </el-menu-item>
        </el-submenu>
        <!--   用户模块布局     -->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>用户模块</span>
          </template>
          <el-menu-item index="/home/user">
            <i class="el-icon-search"></i>
            <span>用户管理</span>
          </el-menu-item>
        </el-submenu>
        <!--   活动模块布局     -->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-flag"></i>
            <span>活动模块</span>
          </template>
          <el-menu-item index="/home/activity/activityCreate">
            <i class="el-icon-eleme"></i>
            <span>创建活动</span>
          </el-menu-item>
          <el-menu-item index="/home/activity/activityList">
            <i class="el-icon-s-data"></i>
            <span>活动列表</span>
          </el-menu-item>
          <el-menu-item index="/home/activity/activityLeaveApplication">
            <i class="el-icon-s-data"></i>
            <span>请假申请</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/home/stageManager">
          <i class="el-icon-s-claim"></i>
          <span slot="title">党建管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="80px">
        <div id="headerTop">
          <div style="display: inline-block; position: absolute; left: 10px">
            <i class="el-icon-s-fold" @click="closeMenu"></i>
          </div>
          <div
            style="display: inline-block; position: absolute; right: 15px;top:10px"
          >
            <el-dropdown>
              <span class="el-dropdown-link" style="cursor: pointer">
                管理员<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><span @click="pChange">修改密码</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="aboutMessage">关于本人</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="logout">退出</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <!-- <div id="HeaderBottom" style="padding: 13px">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home/console' }">控制台</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/home/stageSearch' }">阶段查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <pEditDialog
      v-if="pEditDialogVisible"
      :visible="pEditDialogVisible"
      @close-dialog="onClosePEditDialog"
    />
    <aboutDialog
      v-if="aboutDialogVisible"
      :visible="aboutDialogVisible"
      @close-dialog="onCloseAboutDialog"
    />
  </el-container>
</template>

<script>
import pEditDialog from "../components/Other/pEditDialog.vue";
import aboutDialog from "../components/Other/aboutDialog.vue";

export default {
  name: "Home",
  data() {
    return {
      isCollapse: false, //是否折叠菜单
      pEditDialogVisible: false,
      aboutDialogVisible: false,
    };
  },
  components: { pEditDialog, aboutDialog },
  methods: {
    //折叠菜单方法
    closeMenu() {
      this.isCollapse = !this.isCollapse;
    },
    //注销方法
    logout() {
      this.$post({
        url: "/backstage/logout",
      }).then((res) => {
        console.log(res);
        // 提示成功退出并跳转
        this.$store.state.token = "";
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("groupId");
        window.sessionStorage.removeItem("userId");
        window.sessionStorage.removeItem("adminId");
        window.sessionStorage.removeItem("name");
        this.$message({
          message: "退出成功",
          type: "success",
          duration: 1000,
          onClose: () => {
            this.$router.push("/login");
          },
        });
      });
    },
    // 修改密码
    pChange() {
      this.pEditDialogVisible = true;
    },
    // 关于本人
    aboutMessage() {
      this.aboutDialogVisible = true;
    },
    // 关闭修改密码弹窗
    onClosePEditDialog() {
      this.pEditDialogVisible = false;
    },
    // 关闭关于本人弹窗
    onCloseAboutDialog() {
      this.aboutDialogVisible = false;
    },
  },
  mounted() {},
};
</script>

<style scoped>
#title {
  height: 39px;
  line-height: 39px;
  font-size: 16px;
  font-weight: normal;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
}
#headerTop {
  position: relative;
  height: 39px;
  border-bottom: 1px rgba(102, 102, 102, 0.1) solid;
}
#headerBottom {
  height: 40px;
}
.el-container {
  height: 100vh;
}
.el-aside {
  background-color: #20222a;
}
.el-header {
  background-color: rgba(255, 255, 255, 1);
  margin: 0;
  padding: 0;
  box-shadow: 1px 1px 1px rgba(102, 102, 102, 0.8);
}
.el-menu {
  border: 0;
}
.el-icon-s-fold {
  font-size: 28px;
  margin: 8px 0px 0px 10px;
}
</style>
