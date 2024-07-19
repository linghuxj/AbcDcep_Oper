<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="消息名称">
        <span class="el-form-item-span">：</span>
        <el-input v-model="search.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="消息类型">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.name">
          <el-option label="全部" value="all"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息触点">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.name">
          <el-option label="全部" value="all"></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </div>
    </el-form>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        :header-cell-style="{background:'#f1f1f1',color:'#555555'}"
        style="width: 100%"
      >
        <el-table-column prop="name" label="序号">
          <!-- <template slot-scope="scope">
            <span>{{ scope }}</span>
            <span>{{ scope }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="消息名称"></el-table-column>
        <el-table-column prop="name" label="消息类型"></el-table-column>
        <el-table-column prop="name" label="消息触点"></el-table-column>
        <el-table-column prop="name" label="消息内容"></el-table-column>
        <el-table-column prop="name" label="渠道"></el-table-column>
        <el-table-column prop="name" label="消息发送数量"></el-table-column>
        <el-table-column prop="name" label="已查看数量"></el-table-column>
        <el-table-column prop="name" label="未查看数量"></el-table-column>
        <el-table-column prop="name" label="停用/启用"></el-table-column>
        <el-table-column prop="name" label="修改时间"></el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="toEdit(scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 编辑消息模板 -->
    <el-dialog title="编辑消息模板" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="消息名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消息类型：" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息触点：" :label-width="formLabelWidth">
          <el-select v-model="form.name" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：" :label-width="formLabelWidth">
          <el-checkbox v-model="form.checked">嗨ING</el-checkbox>
          <el-checkbox v-model="form.checked">创客plus</el-checkbox>
        </el-form-item>
        <el-form-item label="内容：" :label-width="formLabelWidth">
          <textarea placeholder="请填写提示内容" maxlength="100"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      tableData: [
        { name: '11' }
      ],
      search: {
        name: undefined
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: undefined,
        checked: false
      }
    }
  },
  created() {},
  methods: {
    getList() {},
    toEdit() {
      this.dialogFormVisible = true
    }
  }
}
</script>
