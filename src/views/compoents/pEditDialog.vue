<template>
  <el-dialog
    title="修改密码"
    :visible="visible"
    width="40%"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="form.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="form.newPwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input v-model="form.checkPwd" show-password></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const checkPwd = (rule, value, callback) => {
      if (value !== this.form.newPwd) return callback(new Error('两次输入密码不一致!'));
      callback();
    };
    return {
      form: {
        oldPwd: "",
        newPwd: "",
        checkPwd: ""
      },
      rules: {
        oldPwd: [{ required: true, message: "请填写旧密码", trigger: "blur" }],
        newPwd: [{ required: true, message: "请填写新密码", trigger: "blur" }],
        checkPwd: [{ required: true, message: "请再次输入密码", trigger: "blur" }, { validator: checkPwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    onClose() {
      this.$emit("close-dialog");
    },
    onReset() {
      this.$refs.form.resetFields();
    },
    // 确定修改
    onConfirm() {
      this.$refs.form.validate((valid) =>{
        if (valid) {
          const adminId = this.$store.state.adminId || window.localStorage.getItem('adminId');
          this.$post({
            url: `/backstage/admins/${adminId}/change-pwd`,
            params: {
              adminId,
              oldPwd: this.form.oldPwd,
              newPwd: this.form.newPwd
            }
          })
            .then(() => {
              // 返回登录页
              this.$message.success('修改密码成功, 请重新登录');
              setTimeout(() => {
                this.$router.replace("/login");
              }, 1500)
            })
            .catch((err) => {
              this.$message({
                message: err,
                type: "error",
                duration: 1000,
              });
            });
        }
      })
    },
  },
};
</script>

<style scoped>
</style>