<template>
  <div>
    <basic-container>
      <el-table
        :data="data"
        :empty-text="$t('message.table_empty_text')"
        border
        v-loading="loading"
      >
        <el-table-column
          type="index"
          :index="1"
          width="120"
          :label="$t('message.serial_number')"
        ></el-table-column>
        <el-table-column prop="user" :label="$t('circle.apply_user')">
          <template slot-scope="scope">
            <div class="column">
              <div>{{ scope.row.user.username }}</div>
            </div>
            <div class="column">
              <el-image
                :lazy="scope.$index < 10 ? false : true"
                :src="scope.row.user.avatar"
                alt="load image failed"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="auditUser" :label="$t('circle.reviewer')">
          <template
            v-if="scope.row.applyStatus !== 'applying'"
            slot-scope="scope"
          >
            <div class="column">
              <div>{{ scope.row.auditUser.username }}</div>
            </div>
            <div class="column">
              <el-image
                :lazy="scope.$index < 10 ? false : true"
                :src="scope.row.auditUser.avatar"
                alt=""
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyTypeName"
          :label="$t('circle.apply_type')"
        ></el-table-column>
        <el-table-column prop="applyStatus" :label="$t('circle.apply_status')">
          <template slot-scope="scope">
            <span>{{ scope.row.applyStatusName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="failureReason"
          :label="$t('circle.fail_reason')"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('message.createTime')"
        ></el-table-column>
        <el-table-column fixed="right" :label="$t('message.operate')">
          <template
            slot="menu"
            v-if="scope.row.applyStatus === 'applying'"
            slot-scope="scope"
          >
            <el-button
              v-if="permissions.apply_user_audit"
              icon="el-icon-delete"
              type="text"
              @click="handlePass(scope.row.id)"
            >
              {{ $t("message.check_pass") }}
            </el-button>
            <el-button
              type="text"
              v-if="permissions.apply_user_audit"
              @click="handleReject(scope.row.id)"
              >{{ $t("message.refuse") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="20"
        layout="prev, pager, next"
        :total="page.total"
        @current-page="handlePagination"
      ></el-pagination>
    </basic-container>
  </div>
</template>

<script>
import { fetchList, checkPass, checkReject } from "@/api/circle/check";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      }
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.getList(this.page);
  },
  methods: {
    getList(page) {
      this.loading = true;
      fetchList(
        Object.assign({
          current: page.currentPage,
          size: page.pageSize
        })
      )
        .then(res => {
          const result = res.data.data;
          this.data = result.records;
          this.page.total = result.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handlePagination(page) {
      this.page.currentPage = page;
      this.getList(this.page);
    },
    handlePass(applyId) {
      checkPass({
        id: applyId,
        isSuccess: true
      }).then(response => {
        this.$message({
          type: "success",
          message: this.$t("message.check_pass")
        });
        this.getList(this.page);
      });
    },
    handleReject(applyId) {
      this.$prompt(this.$t("message.reject_reason"), "", {
        confirmButtonText: this.$t("message.confirm"),
        cancelButtonText: this.$t("message.cancel"),
        inputValidator(content) {
          if (content === "" || content === null) {
            return false;
          }
          return true;
        },
        inputErrorMessage: this.$t("circle.check.valid_reason")
      })
        .then(({ value }) => {
          checkReject({ failureReason: value, id: applyId, isSuccess: false })
            .then(res => {
              this.$message.success(this.$t("message.operate_success"));
              this.getList(this.page);
            })
            .catch(() => {
              this.$message(this.$t("message.operate_failed"));
            });
        })
        .catch(() => {
          this.$message(this.$t("message.operate_cancel"));
        });
    }
  }
};
</script>

<style></style>
