<template>
  <div>
    <!-- 编辑和添加弹框 -->
    <el-dialog
      :title="editOrAdd==='Add'?'新增收货地址':'编辑收货地址'"
      :visible.sync="interactive.dialogVisible_address"
      width="40%">
      <el-form 
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules">
        <el-form-item v-if="!isEdit" label="店铺名称：" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.storeName" placeholder="请输入收货人" width="100"></el-input>
        </el-form-item>
        <el-form-item label="收货人：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="所在地区：" :label-width="formLabelWidth" prop="area">
          <el-input v-model="ruleForm.area" placeholder="请选择省/市/县区"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" :label-width="formLabelWidth" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入详细地址，最多50个字符"></el-input>
        </el-form-item>
        <el-form-item
          v-model="interactive.default_value"
          label="设为默认地址：" 
          :label-width="formLabelWidth">
          <el-switch
            v-model="ruleForm.default_value1">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible_address = false">取 消</el-button>
        <el-button type="primary" @click="interactive.dialogVisible_address = false">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      interactive: {
        dialogVisible_address: false
      },
      formLabelWidth: '120px',
      editOrAdd: 'Add',
      ruleForm: {
        name: undefined,
        phone: undefined,
        area: undefined,
        address: undefined,
        default_value1: true
      },
      rules: {
        name: [
          { required: true, message: '请输入收货人', trigger: 'blur' },
          { max: 10, message: '长度在10个字符以内', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { max: 11, message: '长度在11个字符以内', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入所在地区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]

      } 
    }
  }
}
</script>
