<template>
  <el-form ref="ruleForm" :model="form" label-width="150px" :rules="rules">
    <el-form-item label="姓名：" prop="username">
      <el-input
        v-model="form.username"
        style="width: 300px"
        placeholder="请输入人员姓名"
        maxlength="10"
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号码：" prop="mobile">
      <el-input
        v-model="form.mobile"
        style="width: 300px"
        placeholder="请输入人员手机号码"
        maxlength="11"
      ></el-input>
    </el-form-item>
    <el-form-item label="所属银行：" placeholder="请选择所属银行" prop="unitId">
      <el-select
        v-model="form.unitId"
        placeholder="请选择所属银行"
        @change="selectBank()"
      >
        <el-option
          v-for="(item, index) in unitArr"
          :label="item.unitName"
          :value="item.unitId"
          :key="index"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上级银行：">
      <label>{{ superBank }}</label>
    </el-form-item>
    <el-form-item label="岗位：" prop="jobTitle">
      <el-input
        v-model="form.jobTitle"
        style="width: 300px"
        placeholder="请输入岗位"
        maxlength="10"
      ></el-input>
    </el-form-item>
    <el-form-item label="状态：" placeholder="请选择状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio label="normal">正常</el-radio>
        <el-radio label="disabled">冻结</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="角色权限：" placeholder="请选择角色权限">
      <el-radio-group v-model="form.roleId">
        <el-radio label="1">超级管理员</el-radio>
        <el-radio label="2">管理员</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item
      label="功能权限："
      placeholder="请选择功能权限"
      prop="unitPermission"
    >
      <el-checkbox v-model="form.unitPermission">查看网点信息</el-checkbox>
      <el-checkbox v-model="form.publishPermission">可以发布任务</el-checkbox>
    </el-form-item>
    <el-form-item label="用户默认密码为：">
      <label>yh123456</label>
      <el-button
        @click="resetPassword()"
        style="margin-left: 10px"
        v-if="isEdit && permissions.unit_user_reset_password"
      >
        恢复默认密码
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit('ruleForm')"
        :loading="interview.loading"
      >
        确定
      </el-button>
      <el-button @click="to_cancel()">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import {
  addUnit,
  resetPasswordUnit,
  getUnitAll,
  getUnitByID,
  getDetailById,
  updateUnit,
} from "@/api/bankers/staff.js";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // 手机号验证
    var validateMobile = (rule, value, callback) => {
      console.debug("手机号验证", value, this.form.contactTel);
      const PHONO_REG =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!this.form.contactTel) {
        if (!value) {
          callback(new Error("手机号码不能为空！"));
        }
        if (!PHONO_REG.test(value)) {
          callback(new Error("手机号码格式错误！"));
        }
        callback();
      } else {
        callback();
      }
    };
    return {
      interview: {
        loading: false,
      },
      form: {
        username: undefined,
        mobile: undefined,
        unitId: undefined,
        jobTitle: undefined,
        status: undefined,
        // roleId: undefined,
        unitPermission: undefined,
      },
      unitArr: [],
      staffMes: {},
      superBank: undefined,
      rules: {
        username: [
          { required: true, message: "请输入人员姓名", trigger: "blur" },
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: "blur" },
        ],
        unitId: [
          { required: true, message: "请选择所属银行", trigger: "change" },
        ],
        jobTitle: [{ required: true, message: "请输入岗位", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        unitPermission: [
          { required: true, message: "请选择功能权限", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (this.$route.query.userId) {
      this.userId = this.$route.query.userId;
      this.getDetailById();
    }
    this.getUnitAll();
  },
  methods: {
    // 提交
    onSubmit(ruleForm) {
      this.interview.loading = true;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.update_staff();
          } else {
            this.add_staff();
          }
        } else {
          this.interview.loading = false;
        }
      });
    },
    // 添加员工
    add_staff() {
      addUnit(this.form)
        .then((res) => {
          console.debug("res", res);
          this.interview.loading = false;
          this.$message.success("添加成功");
          this.$router.go(-1);
        })
        .catch(() => {
          this.interview.loading = false;
        });
    },
    //修改员工
    update_staff() {
      this.form.userId = this.userId;
      updateUnit(this.form)
        .then((res) => {
          console.debug("res", res);
          this.interview.loading = false;
          this.$message.success("修改成功");
          this.$router.go(-1);
        })
        .catch(() => {
          this.interview.loading = false;
        });
    },
    // 查看详情
    getDetailById() {
      getDetailById(this.userId).then((res) => {
        this.form = res.data.data;
      });
    },
    // 获取所属单位列表
    getUnitAll() {
      getUnitAll().then((res) => {
        this.unitArr = res.data.data;
      });
    },
    // 根据所属银行查询上一级
    selectBank() {
      let parentId = undefined;
      for (let i in this.unitArr) {
        console.debug("i", i);
        if (this.unitArr[i].unitId === this.form.unitId) {
          parentId = this.unitArr[i].parentId;
        }
      }
      if (parentId === -1) {
        this.superBank = "暂无上级";
        return;
      }
      getUnitByID(parentId).then((res) => {
        console.debug("res", res);
        this.superBank = res.data.data.unitName;
      });
    },
    // 恢复默认密码
    resetPassword() {
      resetPasswordUnit(this.userId).then((res) => {
        console.debug("res", res);
        this.$message.success("恢复默认密码成功");
      });
    },
    // 去取消
    to_cancel() {
      this.$router.go(-1);
    },
  },
};
</script>
