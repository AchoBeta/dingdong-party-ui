<template>
  <div id="outer">
    <el-card>
      <div id="title">党建君-叮咚党建</div>
      <el-divider></el-divider>
      <el-form>
        <el-form-item >
          <el-input type="text" placeholder="请输入账号" v-model="formData.casid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="请输入密码" v-model="formData.password"></el-input>
        </el-form-item>
        <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {loginRequest} from '../../network/request'
  export default {
    name: "Login",
    data(){
      return {
        animate: true
        ,formData:{
          casid: '',
          password: ''
        }
      }
    },
    methods: {
      login(){
        loginRequest({
          method: 'post',
          url: 'common/token/admin',
          data: this.formData
        }).then(res => {
          //保存token到vuex
          this.$store.state.token = res.data.Authorization;
          //保存token到
          window.sessionStorage.setItem("Authorization", res.data.Authorization);
          //提示成功登陆并跳转
          this.$message({
            message: '登陆成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.$router.push('/home');
            }
          })
        }).catch(err=>{
          //提示成功登陆并跳转
          this.$message({
            message: '密码或账号错误',
            type: 'error',
            duration: 1000
          })
        })
      }
    }
  }
</script>

<style scoped>
  #title{
    font-size: 25px;
    font-weight: bold;
    color: #20222A;
    text-align: center;
  }
  #outer{
    width: 100vw;
    height: 100vh;
    background-color: #20222A;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-card{
    width: 400px;
    height: 300px;
  }
</style>
