<template>
  <div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="isEdit ? $t('message.edit') : $t('message.add')"
      :visible.sync="visible"
    >
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('location.super_region')">
              <treeselect
                v-model="form.parentId"
                :options="areaOptions"
                :load-options="loadOptions"
                :show-count="true"
                :placeholder="$t('location.select_super_region')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('location.name')" prop="name">
              <el-input
                v-model="form.name"
                :placeholder="$t('location.place_name')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isEdit">
            <el-form-item :label="$t('message.status')">
              <el-select v-model="form.status">
                <el-option
                  v-for="item in items"
                  :key="item.id"
                  :label="item.itemLabel"
                  :value="item.itemValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入地区编码"/>
      </el-form-item>
      <el-form-item label="状态名称" prop="statusName">
        <el-input v-model="form.statusName" placeholder="请输入状态名称"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="form.status" placeholder="请输入状态" />
      </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="b_loading"
          @click="dataFormSubmit"
          >{{ $t("message.confirm") }}</el-button
        >
        <el-button @click="handleCancel">{{ $t("message.cancel") }}</el-button>
      </div>
    </el-dialog>
    <!-- 翻译框 -->
    <el-dialog
      @close="handleCloseTransDialog"
      :title="$t('system.dict.trans')"
      class="dialog"
      :visible.sync="transDialog"
    >
      <div style="margin-top:-1rem;" class="radio">
        <div style="color:#4d0000;">
          {{ $t("system.dict.tips") }}
        </div>
        <span>{{ $t("system.dict.trans") }}：</span>
        <el-radio
          @change="translate"
          v-model="language"
          v-for="dict in languageDicts"
          :key="dict.id"
          :label="dict.itemValue"
          >{{ dict.itemLabel }}</el-radio
        >
      </div>
      <el-form
        v-if="transDialog"
        :model="transForm"
        ref="transForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('location.name')" prop="name">
              <el-input
                disabled
                v-model="transForm.name"
                :placeholder="$t('location.place_name')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="b_loading"
            @click="transArea"
            v-if="permissions.area_trans"
          >
            {{ $t("message.trans") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, areas, postObj, trans, transGet } from "@/api/area";
import { remote } from "@/api/system/dict";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";

export default {
  name: "area",
  components: { Treeselect },
  computed: {
    ...mapGetters(["permissions"])
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      areaOptions: [],
      // 是否显示弹出层
      visible: false,
      // 是否编辑
      isEdit: false,
      b_loading: false,
      // 翻译相关
      transDialog: false,
      languageDicts: [],
      transForm: {},
      language: window.localStorage.getItem("mewooo-language") || "en",

      // 状态
      items: [],
      // 图标
      form: {
        name: undefined,
        parentId: -1
      },
      origin: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: this.$t("location.valid_name"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    init(isEdit, row) {
      if (!row || row.id != null) {
        this.form.parentId = row.id;
      }
      this.isEdit = isEdit;
      this.visible = true;
      this.getTreeselect(row);
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (isEdit) {
          this.form = Object.assign({}, row);
          this.origin = Object.assign({}, row);
          this.getStatusItems();
        }
      });
    },
    transAreaDialog(area) {
      this.transDialog = true;
      this.transForm = Object.assign({}, area);
      if (this.languageDicts.length === 0) {
        remote("language").then(response => {
          this.languageDicts = response.data.data;
        });
      }
    },
    translate() {
      let obj = {
        id: this.transForm.id || this.transForm.areaId,
        language: this.language
      };
      transGet(obj).then(res => {
        console.log(res, "res");
        this.transForm = res.data.data;
      });
    },
    handleCloseTransDialog() {
      this.language = window.localStorage.getItem("mewooo-language") || "en";
    },
    transArea() {
      this.b_loading = true;
      trans({
        id: this.transForm.id || this.transForm.areaId,
        language: this.language
      })
        .then(res => {
          this.transForm = res.data.data;
          this.$message.success(this.$t("message.trans_success"));
          this.b_loading = false;
        })
        .catch(() => {
          this.b_loading = false;
        });
    },
    // 获取状态列表
    getStatusItems() {
      // 获取地区字典项
      remote("area_status_type").then(response => {
        this.items = response.data.data;
      });
    },
    handleCancel() {
      this.visible = false;
      this.form = {
        name: undefined,
        parentId: -1
      };
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.form.parentId === undefined) {
            this.form.parentId = 0;
          }
          if (this.isEdit) {
            this.b_loading = true;
            let form = Object.assign({}, this.form);
            if (form.name === this.origin.name) {
              delete form.name;
            }
            postObj(form)
              .then(data => {
                this.$message.success({
                  type: "success",
                  message: this.$t("message.edit_success")
                });
                this.visible = false;
                this.b_loading = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.b_loading = false;
              });
          } else {
            this.b_loading = true;
            addObj(this.form)
              .then(data => {
                this.$message.success(this.$t("message.add_success"));
                this.visible = false;
                this.b_loading = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.b_loading = false;
              });
          }
        }
      });
    },
    loadOptions({ action, parentNode, callback }) {
      areas({ lazy: true, parentId: parentNode.id }).then(response => {
        response.data.data.map(area => {
          return (area.label = area.name);
        });
        parentNode.children = response.data.data;
        callback();
      });
    },
    /** 查询菜单下拉树结构 */
    getTreeselect(row) {
      let data = Object.assign({}, row);
      console.log(data, "233");
      areas({ lazy: true, parentId: row.id || -1 }).then(response => {
        this.areaOptions = [];
        response.data.data.map(item => {
          return (item.label = item.name);
        });
        console.log(response.data.data, "1");
        if (JSON.stringify(data) !== "{}") {
          data.label = data.name;
          data.children = response.data.data;
          this.areaOptions.push(data);
        } else {
          const area = {
            id: -1,
            label: this.$t("location.root_location"),
            children: []
          };
          area.children = response.data.data;
          this.areaOptions.push(area);
          console.log(this.areaOptions, "options");
        }
      });
    }
  }
};
</script>
