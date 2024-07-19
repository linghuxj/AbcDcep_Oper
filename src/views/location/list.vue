<template>
  <basic-container>
    <div class="avue-crud">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            v-if="permissions.area_add"
            icon="el-icon-plus"
            type="primary"
            @click="addOrUpdateHandle(false, {})"
          >
            {{ $t("message.add") }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :empty-text="$t('message.table_empty_text')"
        border
        v-loading="loading"
        :data="areas"
        row-key="id"
        lazy
        :load="handleLoadTree"
        :tree-props="{ children: 'children', hasChildren: 'areaId' }"
      >
        <el-table-column
          prop="areaId"
          label="#ID"
          :show-overflow-tooltip="true"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          :label="$t('location.name')"
          :show-overflow-tooltip="true"
          width="180"
        ></el-table-column>
        <!-- <el-table-column prop="code" label="区域编码" align="center" width="100">
        </el-table-column>
        <el-table-column prop="statusName" label="状态名称"></el-table-column> -->
        <el-table-column prop="status" :label="$t('message.status')">
          <template slot-scope="scope">
            <span>{{ scope.row.statusName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.operate')"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-plus"
              @click="addOrUpdateHandle(false, scope.row)"
              v-if="permissions.area_add"
              >{{ $t("message.add") }}
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-refresh"
              @click="handleTrans(scope.row)"
            >
              {{ $t("system.dict.trans") }}
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(true, scope.row)"
              v-if="permissions.area_edit"
              >{{ $t("message.edit") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getList"
      ></table-form>
    </div>
  </basic-container>
</template>

<script>
import { areas } from "@/api/area";
import TableForm from "./form";
import { mapGetters } from "vuex";

export default {
  name: "area",
  components: { TableForm },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      areas: []
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    addOrUpdateHandle(isEdit, row) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, row);
      });
    },
    getList(parentId = -1) {
      this.loading = true;
      areas({ lazy: true, parentId: parentId })
        .then(response => {
          this.areas = response.data.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleLoadTree(tree, treeNode, resolve) {
      areas({ lazy: true, parentId: tree.areaId }).then(response => {
        resolve(response.data.data);
      });
    },
    // 打开翻译弹窗
    handleTrans(area) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.transAreaDialog(area);
      });
    }
  }
};
</script>
