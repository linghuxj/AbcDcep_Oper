<template>
  <div class="main-content discountType">
    <!-- <div id="tableBtn" v-if="permissions.coupon_type_add">
      <el-button type="primary" @click="handleAddCouponType"
        >添加类型</el-button
      >
    </div> -->
    <el-table
      v-loading="loading"
      :data="typeList"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      style="width: 100%"
      border
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="优惠券种类名称" width="275" prop="typeName" />
      <el-table-column label="优惠券种类说明" prop="typeDesc" />
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
      <el-table-column label="操作" width="175">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.coupon_type_edit"
            type="text"
            @click="handleEdit(scope.row)"
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
    <!-- 弹窗 -->
    <el-dialog
      :title="isEdit ? '编辑' : '添加' + '优惠券种类'"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="form" label-width="135px">
        <el-form-item label="优惠券种类：" v-if="isEdit">
          <div>{{ form.typeName }}</div>
        </el-form-item>
        <el-form-item
          label="优惠券种类："
          prop="typeName"
          :rules="{
            required: true,
            message: '请填写优惠券种类',
            trigger: 'blur',
          }"
          v-else
        >
          <el-input
            v-model="form.typeName"
            maxlength="20"
            style="width: 200px"
            placeholder="请输入优惠券种类"
          />
        </el-form-item>
        <el-form-item
          prop="typeDesc"
          label="说明："
          :rules="{
            required: true,
            message: '请填写说明~',
            trigger: 'blur,change',
          }"
        >
          <el-input
            v-model="form.typeDesc"
            type="textarea"
            maxlength="255"
            placeholder="请输入优惠券说明"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editCouponType">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import {
  pageCouponType,
  editCouponType,
  addCouponType,
  enabledCouponType,
} from "@/api/coupon/couponType";
export default {
  components: { TablePagination },
  data() {
    return {
      loading: false,
      typeList: [],
      dialogVisible: false,
      isEdit: false,
      form: {
        typeName: undefined,
        typeDesc: undefined,
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        total: 0, //总条数
        pages: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight();
      };
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById("demo-form-inline");
      let tableBtn = document.getElementById("tableBtn");
      let tabs = 55;
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`;
    },
    // 查询列表
    getList() {
      this.loading = true;
      pageCouponType({ ...this.pagination, type: "discount" }).then((res) => {
        const { total, pages, records = [] } = res.data.data;
        this.typeList = records;
        this.pagination.total = total;
        this.pagination.pages = pages;
        this.loading = false;
      });
    },
    // 添加
    // handleAddCouponType() {
    //   this.isEdit = false;
    //   (this.form = {
    //     typeName: undefined,
    //     typeDesc: undefined,
    //   }),
    //     (this.dialogVisible = true);
    // },
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
    // 编辑
    handleEdit(rowData) {
      this.form = { ...rowData };
      this.isEdit = true;
      this.dialogVisible = true;
    },
    // 编辑
    editCouponType() {
      const { typeId, typeDesc, typeName } = this.form;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            typeId,
            typeName,
            typeDesc,
          };
          if (this.isEdit) {
            editCouponType(params).then((res) => {
              if (res.data.data) {
                this.$message.success("优惠券种类说明修改成功~");
                this.dialogVisible = false;
                this.getList();
              }
            });
          } else {
            addCouponType(params).then((res) => {
              if (res.data.data) {
                this.$message.success("优惠券种类说明添加成功~");
                this.dialogVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
