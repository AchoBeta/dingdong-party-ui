<template>
  <div id="outer">
    <el-card>
      <div id="title">党建君-叮咚党建</div>
      <el-divider></el-divider>
      <el-form>
        <el-form-item>
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model="formData.username"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
          ></el-input>
          <!-- 登录验证码实现 -->
        </el-form-item >
         <el-form-item class="allwidth">
          <el-input 
          class="vcwidth"
            type="text"
            placeholder="请输入图形验证码"
            v-model="formData.code"
          ></el-input>
          <el-image
          id="captcha_img"
           class="imgwidth"
           @click="refresh" 
           :src="imgurl" >
         </el-image>
        </el-form-item>      
        <el-button type="primary" style="width: 100%" @click="login"
          >登录</el-button
        >
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      animate: true,
      imgurl:"https://api.dingdongtongxue.com/dingdong-party/backstage/image-code",
      formData: {
        username: "",
        password: "",
        code:"",
      },
     


    };
  },
  created() {
   sessionStorage.clear();
  },
  methods: {
    login() 
      {return this.$post({
        url: '/backstage/login',
        params: this.formData
      }).then((data) => {
        //保存token到vuex
        // console.log(data);
        this.$store.state.token = data.token;
        this.$store.state.userId = data.items.userId;
        this.$store.state.adminId =data.items.id;
        window.sessionStorage.setItem('adminId', data.items.id);
        window.sessionStorage.setItem('userId', data.items.userId);
        window.sessionStorage.setItem('groupId',data.items.groupId);
        window.sessionStorage.setItem('branchId',data.items.branchId)
        window.sessionStorage.setItem('name',data.items.name)
        window.sessionStorage.setItem('token', data.token);
        window.sessionStorage.setItem('authority',data.items.authority)
        //提示成功登陆并跳转
        this.$message({
          message: "登陆成功",
          type: "success",
          duration: 1000,
          onClose: () => {
            this.$router.push("/home");
          },
        });
      })
    },
     refresh() {
            document.getElementById('captcha_img').src=this.imgurl;
         }   
  },
};
 
</script>

<style scoped>
#title {
  font-size: 25px;
  font-weight: bold;
  color: #20222a;
  text-align: center;
}
#outer {
  width: 100vw;
  height: 100vh;
  background-color: #20222a;
  display: flex;
  justify-content: center;
  align-items: center;
}
.allwidth .imgwidth{width:180px; height: 40px;border-radius: 4px; float: right}

.allwidth .vcwidth{width:200px;float: left}

.el-card {
  width: 450px;
  height: 370px;
}
</style>
