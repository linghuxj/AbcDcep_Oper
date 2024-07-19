<template>
  <div class="main-content">
    <div>
      优惠券适用渠道
      <!-- <el-button
        type="primary"
        class="but"
        @click="handleAddCouponType"
      >添加类型</el-button
      > -->
    </div>
    <div style="margin-top: 30px">
      <el-table
        v-loading="loading"
        align="center"
        :data="list"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          type="index"
          prop="typeId"
          label="序号"
          width="50"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="typeName" label="优惠券适用渠道名称">
        </el-table-column>
        <el-table-column prop="typeDesc" label="优惠券适用渠道说明">
        </el-table-column>
        <el-table-column label="停用/启用">
          <!-- 启用-normal，停用-disabled -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="停用"
              active-value="normal"
              inactive-value="disabled"
              @change="to_changeEnabled(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
    <el-dialog
      :title="opType === 'add' ? '添加优惠券适用渠道' : '编辑优惠券适用渠道'"
      :visible="addOrEditVisible"
      @close="handleCancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="135px">
        <el-form-item label="优惠券适用渠道：">
          <!-- <el-input v-model="form.typeName" maxlength="64" placeholder="请输入内容" /> -->
          <div>{{ form.typeName }}</div>
        </el-form-item>
        <el-form-item prop="typeDesc" label="说明：">
          <el-input v-model="form.typeDesc" type="textarea" maxlength="255" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="bLoading" @click="handleCancel">{{
          $t("message.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :disabled="bLoading"
          @click="editCouponType"
          >{{ $t("message.confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  pageChannelList,
  editCouponType,
  enabledCouponType,
} from "@/api/coupon/couponType";
import TablePagination from "@/components/table-pagination";
export default {
  components: { TablePagination },
  data() {
    return {
      list: [],
      opType: "add",
      loading: false,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      form: {
        typeDesc: undefined,
        typeName: undefined,
      },
      addOrEditVisible: false,
      bLoading: false,
      switchShow: false,
      rules: {
        typeDesc: [
          { required: true, message: "适用渠道名称不能为空", trigger: "blur" },
          { min: 1, max: 20, message: "不能多于20个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      const params = Object.assign({}, this.search);
      params.size = this.pagination.size;
      params.current = this.pagination.current;
      await pageChannelList(params).then((res) => {
        console.log(res.data.data, "data");
        this.loading = false;
        if (res.data.data.length > 0) {
          const { total, pages, records = [] } = res.data.data;
          this.list = records;
          this.pagination.total = total;
          this.pagination.pages = pages;
        }
      });
    },
    //去停用和启用
    to_changeEnabled(val) {
      const data = {
        typeId: val.typeId,
        status: val.status,
      };
      enabledCouponType(data).then((res) => {
        console.log(res);
        this.$message.success("操作成功");
        this.getList();
      });
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.getList();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.getList();
    },
    handleCancel() {
      this.addOrEditVisible = false;
      this.$refs.form.resetFields();
      this.form = {
        typeName: undefined,
        typeDesc: undefined,
      };
    },
    //编辑
    handleEdit(row) {
      this.origin = Object.assign({}, row);
      this.form = row;
      this.opType = "edit";
      this.addOrEditVisible = true;
    },
    //编辑提交
    editCouponType() {
      const { typeId, typeDesc, typeName } = this.form;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            typeId,
            typeName,
            typeDesc,
          };
          editCouponType(params).then((res) => {
            console.log(res);
            this.$message.success("修改成功");
            this.handleCancel();
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .but {
    float: right;
  }
}
</style>
