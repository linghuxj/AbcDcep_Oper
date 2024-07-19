<template>
  <!-- 添加或修改菜单对话框 -->
  <div>
    <el-dialog
      :title="isEdit ? $t('message.edit') : $t('message.add')"
      :visible.sync="visible"
    >
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('menu.menu_type')" prop="type">
              <el-radio-group v-model="form.type" size="small">
                <el-radio-button label="menu">{{
                  $t('menu.left_menu')
                }}</el-radio-button>
                <el-radio-button label="button">{{
                  $t('menu.button')
                }}</el-radio-button>
                <el-radio-button label="top">{{
                  $t('menu.top_menu')
                }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('menu.super_menu')">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                :placeholder="$t('menu.select_super_menu')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="form.type !== 'button'"
          :label="$t('menu.icon')"
          prop="icon"
        >
          <avue-icon-select
            v-model="form.icon"
            :icon-list="iconList"
          ></avue-icon-select>
        </el-form-item>
        <el-form-item :label="$t('menu.name')" prop="label">
          <el-input
            v-model="form.label"
            :placeholder="$t('menu.place_menu_name')"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type !== 'button'"
          :label="$t('menu.path')"
          prop="path"
        >
          <el-input v-model="form.path" :placeholder="$t('menu.place_path')" />
        </el-form-item>
        <el-form-item
          v-if="form.type === 'button'"
          :label="$t('menu.authority_sign')"
          prop="permission"
        >
          <el-input
            v-model="form.permission"
            :placeholder="$t('menu.place_auth_sign')"
            maxlength="50"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('menu.sort')" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.type !== 'button'"
              :label="$t('menu.keet_alive')"
              prop="keepAlive"
            >
              <el-radio-group v-model="form.keepAlive">
                <el-radio-button label="0">{{
                  $t('message.no')
                }}</el-radio-button>
                <el-radio-button label="1">{{
                  $t('message.yes')
                }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="b_loading"
          @click="dataFormSubmit"
          >{{ $t('message.confirm') }}</el-button
        >
        <el-button @click="visible = false">{{
          $t('message.cancel')
        }}</el-button>
      </div>
    </el-dialog>

    <!-- 翻译 -->
    <el-dialog
      :title="$t('system.dict.trans')"
      :visible.sync="transDialog"
      @close="handleCloseTransDialog"
    >
      <div style="margin-top: -1rem; margin-bottom: 2rem" class="radio">
        <div style="color: #4d0000">
          {{ $t('system.dict.tips') }}
        </div>
        <span>{{ $t('system.dict.trans') }}：</span>
        <el-radio
          v-for="dict in languageDicts"
          :key="dict.id"
          v-model="language"
          :label="dict.itemValue"
          @change="translate"
          >{{ dict.itemLabel }}</el-radio
        >
      </div>
      <el-form ref="transForm" :model="transForm" label-width="80px">
        <el-form-item :label="$t('menu.name')" prop="label">
          <el-input
            v-model="transForm.label"
            disabled
            :placeholder="$t('menu.place_menu_name')"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="permissions.menu_trans"
          type="primary"
          :disabled="b_loading"
          @click="handleTrans"
          >{{ $t('system.dict.trans') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  fetchMenuTree,
  getObj,
  postObj,
  trans,
  transGet
} from '@/api/user/menu'
import { remote } from '@/api/system/dict'
import Treeselect from '@riophae/vue-treeselect'
import iconList from '@/const/iconList'
// import TableForm from './index'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  components: { Treeselect },

  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单树选项
      menuOptions: [],
      // 是否显示弹出层
      visible: false,
      // 是否编辑
      isEdit: false,
      b_loading: false,
      // 翻译相关
      transDialog: false,
      languageDicts: [],
      transForm: {},
      language: window.localStorage.getItem('mewooo-language') || 'en',
      // 图标
      iconList: iconList,
      form: {
        label: undefined,
        path: undefined,
        icon: undefined,
        permission: undefined,
        parentId: -1,
        type: '0',
        keepAlive: '0',
        sort: 999
      },
      // 表单校验
      rules: {
        label: [
          {
            required: true,
            message: this.$t('menu.valid.name'),
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: this.$t('menu.valid.sort'),
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: this.$t('menu.valid.path'),
            trigger: 'blur'
          }
        ],
        keepAlive: [
          {
            required: true,
            message: this.$t('menu.valid.keep_alive'),
            trigger: 'blur'
          }
        ],
        permission: [
          {
            required: true,
            message: this.$t('menu.valid.permission'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    init(isEdit, id) {
      if (id != null) {
        this.form.parentId = id
      }
      this.isEdit = isEdit
      this.visible = true
      this.getTreeselect()
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (isEdit) {
          getObj(id).then(response => {
            this.form = response.data.data
          })
        }
      })
    },
    handleCloseTransDialog() {
      this.language = window.localStorage.getItem('mewooo-language') || 'en'
    },
    handleTransDialog(menu) {
      this.transDialog = true
      this.transForm = Object.assign({}, menu)
      if (this.languageDicts.length === 0) {
        remote('language').then(response => {
          this.languageDicts = response.data.data
        })
      }
    },
    translate() {
      transGet({
        id: this.transForm.id || this.transForm.menuId,
        language: this.language
      }).then(res => {
        this.transForm = res.data.data
      })
    },
    handleTrans() {
      this.b_loading = true
      trans({
        id: this.transForm.id || this.transForm.menuId,
        language: this.language
      })
        .then(res => {
          this.b_loading = false
          this.transForm = res.data.data
          this.$message.success(this.$t('message.trans_success'))
        })
        .catch(() => {
          this.b_loading = false
        })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.form.parentId === undefined) {
            this.form.parentId = -1
          }

          if (this.isEdit) {
            this.b_loading = true
            postObj(this.form)
              .then(() => {
                this.$message.success(this.$t('message.edit_success'))
                this.visible = false
                this.b_loading = false
                this.$emit('refreshDataList')
              })
              .catch(() => {
                this.b_loading = false
              })
          } else {
            this.b_loading = true
            addObj(this.form)
              .then(() => {
                this.$message.success(this.$t('message.add_success'))
                this.visible = false
                this.b_loading = false
                this.$emit('refreshDataList')
              })
              .catch(() => {
                this.b_loading = false
              })
          }
        }
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      fetchMenuTree().then(response => {
        this.menuOptions = []
        const menu = { id: -1, label: this.$t('menu.root_menu'), children: [] }
        menu.children = response.data.data
        this.menuOptions.push(menu)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (!node.children) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  min-height: 50vh;
}
</style>
