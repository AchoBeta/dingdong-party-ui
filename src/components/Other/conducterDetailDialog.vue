<template>
  <el-dialog
    title="详细信息"
    :visible.sync="visible"
    width="80%"
    :close-on-click-modal="false"
  > 
    <div class="px-3">
      <el-form :model="form" inline label-width="auto">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input
                style="width: 98%"
                v-model="form.name"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号">
              <el-input
                v-model="form.casid"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族">
              <el-input
                style="width: 98%"
                v-model="form.nation"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯">
              <el-input
                v-model="form.origin"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号">
              <el-input
                style="width: 98%"
                v-model="form.id_card"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker
                type="date"
                placeholder="未填"
                v-model="form.birth"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input
                style="width: 98%"
                v-model="form.mobile"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家庭住址">
              <el-input
                v-model="form.family_address"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在年级">
              <el-input
                style="width: 98%"
                v-model="form.grade"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在班级">
              <el-input
                v-model="form.class"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在院系">
              <el-input
                style="width: 98%"
                v-model="form.institute"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在专业">
              <el-input
                v-model="form.major"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在社区">
              <el-input
                style="width: 98%"
                v-model="form.dormitory_area"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宿舍号">
              <el-input
                v-model="form.dormitory_no"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务">
              <el-input
                style="width: 98%"
                v-model="form.class_position"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input
                v-model="form.email"
                placeholder="未填"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="个人经历">
              <el-input
                type="textarea"
                v-model="form.resume"
                placeholder="无"
                disabled
                autosize
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    adminId: String
  },
  data() {
    return {
      form: {}
    };
  },
  created() {
    this.getBaseInfo();
    this.getJoin();
  },
  methods: {
    getBaseInfo() {

    },
    getJoin() {
      this.$get({
        url: `/base/users/${this.adminId}/activities`,
        params: {}
      }).then((data) => {
        if (data.list) this.branchOptions = data.list.items;
      })
    },
    getPublish() {}
  }
};
</script>

<style scoped>

  .px-3 {
    padding: 0 18px;
  }

</style>