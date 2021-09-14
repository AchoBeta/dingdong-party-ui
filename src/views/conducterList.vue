<template>
  <div class="conducter-list-wrapper">
    <div class="conducter-list-box">
      <el-form :inline="true" :model="form">
          <el-form-item label="党支部">
            <el-select :loading="loading" @change="getGroupOptions" placeholder="选择党支部" v-model="form.branchId">
              <el-option 
                v-for="item in branchOptions" 
                :key="item.id" 
                :label="item.name" 
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="党组">
            <el-select :loading="loading" placeholder="选择党组" v-model="form.group">
              <el-option 
              v-for="item in groupOptions" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" class="ml-3" @click="getList" :loading="loading">搜索</el-button>
          </el-form-item>
        </el-form>
      <!-- 表格内容 -->
      <div v-loading="loading">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="学号/工号" prop="studentId"></el-table-column>
          <el-table-column label="所在党支部" prop="branchId"></el-table-column>
          <el-table-column label="所在党组" prop="groupId"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getAllInfo(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="text-right">
          <el-pagination
            class="mt-3 text-center"
            @size-change="changePageSize"
            @current-change="changePageNo"
            :current-page="pageNo"
            :page-size="pageSize"
            :page-sizes="[10, 20, 40, 80]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <detailDialog v-if="detailDialogVisible" :visible="detailDialogVisible" :adminId="adminId" @close-dialog="onCloseDetailDialog" />
  </div>
</template>

<script>
import detailDialog from './compoents/conducterDetailDialog.vue';

export default {
  data() {
    return {
      loading: false,
      adminId: '',
      branchOptions: [],
      groupOptions: [],
      form: {
        branchId: '',
        groupId: ''
      },
      tableData: [],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      detailDialogVisible: false
    };
  },
  components: { detailDialog },
  created() {
    const adminId = this.$store.state.adminId || localStorage.getItem('adminId');
    if (adminId) {
      this.adminId = adminId;
      this.getBranchOptions();
      this.getList();
    }
  },
  methods: {
    // 获取支部选项
    getBranchOptions() {
      this.$get({
        url: '/base/branches',
        params: {}
      }).then((data) => {
        if (data.list) this.branchOptions = data.list.items;
      })
    },
    // 获取小组选项
    getGroupOptions() {
      this.$get({
        url: `/base/branch/${this.form.branchId}/groups`,
        params: {}
      }).then((data) => {
        if (data.list) this.groupOptions = data.list.items;
      })
    },
    // 获取列表
    getList() {
      this.loading = true;
      const { form: { branchId, groupId }, adminId, pageNo, pageSize } = this;
      const params = {
        adminId,
        page: pageNo,
        size: pageSize
      }
      if (branchId) params.branchId = branchId;
      if (groupId) params.groupId = groupId;
      this.$get({
        url: '/backstage/admins',
        params:{
          page: 1
          ,size: 100
        }
      }).then((data) => {
        console.log(data, '---------');
        if (data.list) {
          this.loading = false;
          this.tableData = data.list.items;
          this.total = data.list.total;
        }
      })
    },
    getAllInfo() {
      this.detailDialogVisible = true;
    },
    changePageNo(pageNo) {
      this.pageNo = pageNo;
      this.getList();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.getList();
    },
    onCloseDetailDialog() {
      this.detailDialogVisible = false;
    }
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
</style>
 