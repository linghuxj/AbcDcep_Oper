<template>
  <div>
    <basic-container>
      <el-table
        :empty-text="$t('message.table_empty_text')"
        :data="data"
        border
        v-loading="loading"
      >
        <el-table-column
          type="index"
          width="120"
          :index="1"
          :label="$t('message.serial_number')"
        >
        </el-table-column>
        <el-table-column :label="$t('feed.user')">
          <template slot-scope="scope">
            <div class="column">
              <span>{{ scope.row.user.username }}</span>
            </div>
            <div class="column">
              <el-image
                :lazy="scope.$index < 10 ? false : true"
                :src="scope.row.user.avatar"
                alt=""
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.wallet.amount')" width="155">
          <template slot-scope="scope">
            <div class="column">
              <div class="sub-title">{{ $t("user.wallet.change_amount") }}</div>
              <div>{{ scope.row.changeAmount }}</div>
            </div>
            <div class="column">
              <div class="sub-title">
                {{ $t("user.wallet.current_balance") }}
              </div>
              <div>{{ scope.row.currentBalance }}</div>
            </div>
            <div class="column">
              <div class="sub-title">{{ $t("user.wallet.currency") }}</div>
              <div>{{ scope.row.currency }}</div>
            </div>
            <div class="column">
              <div class="sub-title">
                {{ $t("user.wallet.currency_symbol") }}
              </div>
              <div>{{ scope.row.currencySymbol }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('user.wallet.type')">
        </el-table-column>
        <el-table-column prop="typeName" :label="$t('user.wallet.type_name')">
        </el-table-column>
        <el-table-column
          prop="walletType"
          :label="$t('user.wallet.wallet_type')"
        >
        </el-table-column>
        <el-table-column
          prop="usedTypeName"
          :label="$t('user.wallet.used_type_name')"
        >
        </el-table-column>
        <el-table-column prop="remark" :label="$t('user.wallet.remark')">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('message.createTime')">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="20"
        layout="prev, pager, next"
        :total="page.total"
        @current-page="handlePagination"
      >
      </el-pagination>
    </basic-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: [],
      page: {
        total: 0,
        pageSize: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.getList(this.page);
  },
  methods: {
    getList(page) {
      this.loading = true;
    },
    handlePagination(page) {
      this.page.currentPage = page;
      this.getList(this.page);
    }
  }
};
</script>

<style>
.column {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ebeef5;
  padding: 0.2rem;
}
.sub-title {
  padding: 0.2rem;
}
</style>
