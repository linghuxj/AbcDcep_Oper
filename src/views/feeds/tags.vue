<template>
  <div>
    <basic-container>
      <!-- 权限 -->
      <el-button
        @click="handleCreate"
        class="add-item"
        type="primary"
        icon="el-icon-plus"
        >{{ $t("message.add") }}</el-button
      >
      <el-table
        :empty-text="$t('message.table_empty_text')"
        :data="data"
        border
        v-loading="loading"
      >
        <el-table-column
          :label="$t('message.serial_number')"
          width="120"
          type="index"
          :index="1"
        >
        </el-table-column>
        <el-table-column :label="$t('feed.tag.name')" prop="tagName">
        </el-table-column>
        <el-table-column :label="$t('message.createTime')" prop="createTime">
        </el-table-column>
        <el-table-column :label="$t('message.operate')">
          <template slot-scope="scope">
            <el-button>{{ $t("message.edit") }}</el-button>
            <el-button @click="handleDelete(scope.row.tagId)">{{
              $t("message.delete")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </basic-container>
    <el-dialog
      :visible="tagVisible"
      :title="isEdit ? $t('message.edit') : $t('message.add')"
    >
      <el-form
        ref="tagForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="100px"
      >
        <el-form-item prop="tagName" :label="$t('feed.tag.name')">
          <el-input v-model="form.tagName" />
        </el-form-item>
        <el-form-item>
          <template>
            <el-button v-if="!isEdit" @click="create">{{
              $t("message.confirm")
            }}</el-button>
            <el-button v-if="isEdit">{{ $t("message.confirm") }}</el-button>
            <el-button @click="handleCancel">{{
              $t("message.cancel")
            }}</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, postObj } from "@/api/feeds/tags";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: [],
      form: {
        tagName: ""
      },
      isEdit: false,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tagVisible: false,
      loading: false,
      rules: {
        tagName: [
          {
            required: true,
            message: this.$t("feed.tag.valid_name"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.getTags(this.page);
  },
  methods: {
    getTags(page) {
      this.loading = true;
      fetchList(
        Object.assign({
          size: page.pageSize,
          current: page.currentPage
        })
      )
        .then(resposne => {
          const result = response.data.data;
          this.data = result.records;
          this.page.total = result.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleCreate() {
      this.tagVisible = true;
    },
    handleEdit(row) {
      this.tagVisible = true;
      this.isEdit = true;
      this.form = row;
    },
    handleCancel() {
      this.tagVisible = false;
      this.isEdit = false;
      this.$refs.tagForm.resetFields();
      this.form = {
        tagName: ""
      };
    },
    handleDelete(row) {
      this.$confirm(
        this.$t("message.will_delete_data"),
        this.$t("message.prompt"),
        {
          confirmButtonText: this.$t("message.confirm"),
          cancelButtonText: this.$t("message.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          deleteById(row.id).then(res => {
            this.$message($t("message.delete_success"));
            this.fetchList(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("message.cancel_delete")
          });
        });
    },
    create() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          addObj(this.form).then(res => {
            this.$message.success(this.$t("message.add_success"));
          });
        }
      });
    },
    update() {
      this.$refs.tagForm.validate(valid => {
        if (valid) {
          postObj(this.form).then(res => {
            this.$message({
              type: "success",
              message: this.$t("message.edit_success")
            });
          });
        }
      });
    }
  }
};
</script>

<style>
.add-item {
  margin: 0.5rem 0 1rem 0;
}
</style>
