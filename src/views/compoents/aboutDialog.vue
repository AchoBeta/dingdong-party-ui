<template>
  <el-dialog
    title="关于本人"
    :visible="visible"
    width="50%"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div v-loading="loading">
      <el-row :gutter="24">
        <el-form ref="form" :model="form" label-width="auto">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <template>{{ form.studentId }}</template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <template>{{ form.name }}</template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="党支部" prop="branchName">
              <template>{{ form.branchName }}</template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="党组" prop="groupName">
              <template>{{ form.groupName }}</template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <template>{{ form.phone }}</template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <template>{{ form.email }}</template>
            </el-form-item>
          </el-col>
        </el-form>
      
      </el-row>
    </div>
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
    return {
      loading: true,
      form: {}
    };
  },
  created() {
    const userId = this.$store.state.userId || sessionStorage.getItem('userId');
    if (userId) this.getInfo(userId);
  },
  methods: {
    // 关闭
    onClose() {
      this.$emit("close-dialog");
    },
    // 查看信息
    getInfo(userId) {
      this.loading = true;
      this.$get({
        url: `base/users/${userId}/info`
      }).then((res) => {
        if (res.item) {
          this.loading = false;
          this.form ={ ...(res.item.main || {} ), ...(res.item.detail || {} ) };
        }
      })
    }
  },
};
</script>

<style scoped>
  .text-right {
    text-align: right;
  }
</style>