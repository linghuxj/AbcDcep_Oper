<template>
  <div class="main-content">
    <el-form ref="specialForm" :model="specialForm" :rules="rules" label-width="100px">
      <el-form-item label="选择城市：" prop="areaCodeList">
        <el-select v-model="specialForm.areaCodeList" multiple filterable remote :multiple-limit="multiple_limit"
          reserve-keyword :remote-method="remoteArea" placeholder="请输入或选择城市名称">
          <el-option v-for="(item, index) in areaList" :key="index" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道选择：" prop="topicName">
        <el-select v-model="specialForm.channel" reserve-keyword placeholder="渠道名称">
          <el-option label="嗨ING小程序" value='嗨ING小程序'></el-option>
          <el-option label="创客APP" value='创客APP'></el-option>
          <el-option label="创米APP" value='创米APP'></el-option>
          <el-option label="H5链接" value='H5链接'></el-option>
        </el-select>
        <span class="span-tips">专题页面名称，在专题页顶部展示</span>
      </el-form-item>
      <el-form-item label="专题名称：" prop="topicName">
        <el-input v-model="specialForm.topicName" style="width: 300px" />
        <span class="span-tips"> 专题内页导航栏名称</span>
      </el-form-item>
      <el-form-item label="专题图片：" prop="topicImage">
        <upload-file ref="upload" v-model="specialForm.topicImage" type="content" :limit="1" :multiple="true"
          :auto-upload="false" type-name="conten" />
        <div class="span-tips">
          上传了，则前端专题页展示该广告图；未上传，则不展示。
        </div>
      </el-form-item>
      <!-- <el-form-item label="专题底色：" prop="topicColor">
        <el-input v-model="specialForm.topicColor" disabled style="width: 200px" size="small">
          <el-color-picker slot="append" v-model="specialForm.topicColor" size="mini" />
        </el-input>
      </el-form-item> -->
      <el-form-item label="生效时间：" prop="time">
        <el-date-picker v-model="specialForm.time" type="datetimerange" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="onChangeFormat">
        </el-date-picker>
        <div class="span-tips">
          未设时间，则保存后就发布该专题，不会自动下架该专题，需要手动下架。
        </div>
      </el-form-item>
      <!-- <el-form-item label="专题栏目：" prop="type">
        <el-radio v-model="specialForm.type" label="1">不区分栏目</el-radio>
        <div v-show="specialForm.type === '1'">
          <el-table :data="tableDataNo" border style="width: 600px; margin-top: 5px">
            <el-table-column v-if="isEdit" label="历史已关联产品数">
              <template slot-scope="scope">
                <el-button type="text" @click="
                    selectRelatedGoods(scope.$index, 'history', scope.row)
                  ">{{ scope.row.relationProductNum }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="新增关联产品数">
              <template slot-scope="scope">
                <el-button type="text" @click="selectRelatedGoods(scope.$index, 'update', scope.row)">
                  {{ scope.row.topicDetailList.length }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="relatedGoods(scope.$index, 'add', scope.row)">关联产品
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-radio v-model="specialForm.type" label="2">区分栏目</el-radio>
        <div v-show="specialForm.type === '2'">
          <el-button type="primary" @click="addColumn">添加栏目</el-button>
          <el-table :data="tableData" border style="width: 1000px; margin-top: 5px">
            <el-table-column prop="columnName" label="栏目名称">
            </el-table-column>
            <el-table-column v-if="isEdit" label="历史已关联产品数">
              <template slot-scope="scope">
                <el-button type="text" @click="
                    selectRelatedGoods(scope.$index, 'history', scope.row)
                  ">{{ scope.row.relationProductNum }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="新增关联产品数">
              <template slot-scope="scope">
                <el-button type="text" @click="selectRelatedGoods(scope.$index, 'update', scope.row)">
                  {{ scope.row.topicDetailList.length }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" :disabled="scope.row.status === 'normal' ? false : true"
                  @focus="hedSort(scope.$index, scope.row.sort)" @change="updateSort(scope.$index, scope.row.sort)">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="停用/启用">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-text="启用" inactive-text="停用" active-value="normal"
                  inactive-value="disabled">
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="relatedGoods(scope.$index, 'add', scope.row)">关联产品
                </el-button>
                <el-button v-if="!scope.row.columnId" size="small" type="text" @click="handleDelete(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item> -->
      <el-form-item label="规则说明">
        <editor-bar v-model="form.profile" ></editor-bar>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="interactive.loading" :loading="interactive.loading" type="primary"
          @click="submitForm('specialForm')">下一步</el-button>
        <el-button @click="resetForm('specialForm')">重置</el-button>
      </el-form-item>

    </el-form>
    <!-- <el-dialog title="添加栏目" :visible.sync="interactive.dialogForm" width="30%" append-to-body>
      <el-form ref="formColumn" :model="form" :rules="rulesForm" label-width="80px">
        <el-form-item label="栏目名称" prop="columnName">
          <el-input v-model="form.columnName" placeholder="请输入栏目名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleName('formColumn')">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 关联产品 -->
    <topic-form v-if="interactive.dialogProducts" ref="relatedProducts"
      @refreshRelatedGoodsData="refreshRelatedGoodsData" />
  </div>
</template>

<script>
  import UploadFile from "@/components/Upload-File/upload";
  import EditorBar from "@/components/Rich-Text-Editor/Editor-Bar";
  import TopicForm from "./TopicForm";
  import {
    postGoodsToppic,
    getTopicDetailById
  } from "@/api/content/special";
  import {
    getAreaList
  } from "@/api/content/advert";

  export default {
    name: "SpecialFrom",
    components: {
      UploadFile,
      TopicForm,
      EditorBar
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      // 地址校验
      var areaCodeList = (rule, value, callback) => {
        if (!value) {
          callback("请选择城市");
        } else {
          callback();
        }
      };
      var validate = (rule, value, callback) => {
        const b = this.tableData.some((val, index, arr) => {
          return val.columnName === value;
        });
        if (b) {
          callback(new Error("该栏目名称已经存在，请更换栏目名称！"));
        } else {
          callback();
        }
      };
      return {
        specialForm: {
          channel:'嗨ING小程序',
          areaCodeList: [],
          endTime: "",
          topicColumnList: [],
          topicDetailList: [],
          startTime: "",
          topicColor: "",
          topicId: undefined,
          topicImage: undefined,
          topicName: "",
          time: "",
          // type: "",
        },
        // value 排序框获得焦点时缓存当前数据
        value: undefined,
        // 栏目弹出窗
        form: {},
        // 栏目table
        tableData: [{
          columnId: undefined,
          columnName: "1",
          relationProductNum: 0,
          topicDetailList: [],
          sort: 1,
          status: "normal",
        }, ],
        // 不区分栏目时换的table
        tableDataNo: [{
          relationProductNum: 0,
          topicDetailList: [],
        }, ],
        // 记录当前是第几行的栏目
        columnId: undefined,
        // 操作类型
        interactive: {
          dialogForm: false,
          dialogProducts: false,
          specForm: false,
          tableLoading: false,
          loading: false,
        },
        multiple_limit: 5,
        areaList: [],
        rules: {
          areaCodeList: [{
            required: true,
            validator: areaCodeList,
            trigger: "change"
          }, ],
          topicName: [{
              required: true,
              message: "请输入活动名称",
              trigger: "blur"
            },
            {
              min: 2,
              max: 10,
              message: "长度在 2 到 10 个字符",
              trigger: "blur",
            },
          ],

          type: [{
            required: true,
            message: "专题栏目为必选项",
            trigger: "blur"
          }, ],
        },
        rulesForm: {
          columnName: [{
              required: true,
              message: "栏目名称不能为空"
            },
            {
              min: 1,
              max: 8,
              message: "长度在 1 到 8 个字符",
              trigger: "blur"
            },
            {
              required: true,
              validator: validate,
              trigger: "blur"
            },
          ],
        },
      };
    },
    created() {
      this.$nextTick(() => {
        if (this.isEdit) {
          const id = this.$route.params && this.$route.params.id;
          this.getList(id);
        }
        this.getAreaList();
      });
    },
    methods: {
      //查询地区列表
      getAreaList() {
        const data = {
          areaTypes: "city",
          size: "50",
          keyword: this.keyword,
        };
        getAreaList(data).then((res) => {
          this.areaList = res.data.data;
        });
      },
      // 编辑时查看详情
      getList(id) {
        this.tableData = [];
        getTopicDetailById(id).then((res) => {
          const page = res.data.data;
          if (page.topicImage) {
            this.$refs.upload.loadImg(page.topicImage);
          }
          console.debug("!page.columnRespList", !page.columnList);
          if (page.columnList.length === 0 || !page.columnList) {
            this.specialForm = {
              endTime: page.endTime,
              areaCodeList: page.areaCodeList,
              topicColumnList: [],
              topicDetailList: [],
              startTime: page.startTime,
              topicColor: page.topicColor,
              topicId: page.topicId,
              topicImage: page.topicImage,
              topicName: page.topicName,
              time: [page.startTime, page.endTime],
              type: "1",
            };
            this.tableDataNo = [{
              columnId: "-1",
              relationProductNum: page.relationProductNum,
              topicDetailList: [],
            }, ];
          } else {
            this.specialForm = {
              endTime: page.endTime,
              areaCodeList: page.areaCodeList,
              topicColumnList: [],
              topicDetailList: [],
              startTime: page.startTime,
              topicColor: page.topicColor,
              topicId: page.topicId,
              topicImage: page.topicImage,
              topicName: page.topicName,
              time: [page.startTime, page.endTime],
              type: "2",
            };
            page.columnList.forEach((item) => {
              const data = {
                columnId: item.columnId,
                columnName: item.columnName,
                relationProductNum: item.relationProductNum,
                topicDetailList: [],
                sort: item.sort,
                status: item.status,
              };
              this.tableData.push(data);
            });
          }

          console.debug("columnList", this.specialForm);
        });
      },

      // 提交
      async submitForm(formName) {
        console.log(this.specialForm,'this.specialForm')
        this.$router.push({
          // path:`/content/special/preView`,
          name:'专题预览',
          params:{
           specialForm: this.specialForm
          },
          // query:{
          //  specialForm: this.specialForm
          // }
        });

        return
        const _this = this;
        _this.interactive.loading = true;
        const condition = _this.specialSubmit();
        if (condition) {
          if (_this.$refs.upload.files.length > 0) {
            // // 产品图
            // await _this.$refs.upload.uploadImg();
            // // 上传图片拿到imageURL
            // const uploadImage = this.$refs.upload.uploadParams;
            const uploadParams = this.$refs.upload.imgURL;
            console.debug("this.$refs.addUpload", uploadParams);
            uploadParams.forEach((item, indexs) => {
              if (indexs === 0) {
                this.specialForm.topicImage = item;
              }
            });
          }
          _this.$nextTick(() => {
            _this.$refs[formName].validate((valid) => {
              if (valid) {
                postGoodsToppic(_this.specialForm)
                  .then((res) => {
                    _this.interactive.loading = false;
                    _this.$message.success("提交成功");
                    _this.resetForm(formName);
                    setTimeout(() => {
                      _this.$router.go(-1);
                    }, 100);
                  })
                  .catch(() => {
                    _this.interactive.loading = false;
                  });
              } else {
                _this.interactive.loading = false;
                return false;
              }
            });
          });
        } else {
          console.debug("====", _this.isEdit);
          _this.interactive.loading = false;
          if (_this.isEdit) {
            if (_this.$refs.upload.files.length > 0) {
              // 产品图
              // await _this.$refs.upload.getUploadParams();
              // 上传图片拿到imageURL
              const uploadParams = this.$refs.upload.imgURL;
              uploadParams.forEach((item, indexs) => {
                if (indexs === 0) {
                  this.specialForm.topicImage = item;
                }
              });
            }
            _this.$nextTick(() => {
              _this.$refs[formName].validate((valid) => {
                if (valid) {
                  postGoodsToppic(_this.specialForm)
                    .then((res) => {
                      _this.interactive.loading = false;
                      _this.$message.success("提交成功");
                      _this.resetForm(formName);
                      setTimeout(() => {
                        _this.$router.go(-1);
                      }, 100);
                    })
                    .catch(() => {
                      _this.interactive.loading = false;
                    });
                } else {
                  _this.interactive.loading = false;
                  return false;
                }
              });
            });
          }
        }
      },

      // 处理table数据
      specialSubmit() {
        const _this = this;
        _this.specialForm.topicColumnList = [];
        _this.specialForm.topicDetailList = [];
        if (!_this.specialForm.type) {
          _this.$message("请选择专题栏目");
          return;
        }
        if (_this.specialForm.type === "2") {
          if (_this.tableData.length < 1) {
            _this.$message("请添加栏目");
            return;
          }
          const listTable = _this.tableData.every((item) => {
            let itemStatu = true;
            const table = {
              columnName: item.columnName,
              topicDetailList: [],
              sort: item.sort,
              status: item.status,
            };
            if (!_this.isEdit) {
              if (item.topicDetailList.length === 0) {
                _this.$message.error(
                  "栏目名为“" + item.columnName + "”关联产品数为0，无法提交！"
                );
                itemStatu = false;
              } else {
                itemStatu = true;
              }
            } else {
              if (!item.columnId) {
                if (item.topicDetailList.length === 0) {
                  _this.$message.error(
                    "栏目名为“" + item.columnName + "”关联产品数为0，无法提交！"
                  );
                  itemStatu = false;
                } else {
                  itemStatu = true;
                }
              } else {
                itemStatu = true;
              }
            }
            item.topicDetailList.forEach((goods) => {
              goods.skuLists.forEach((sku) => {
                const product = {
                  goodsId: sku.goodsId,
                  productId: goods.productId,
                };
                table.topicDetailList.push(product);
              });
            });
            _this.specialForm.topicColumnList.push(table);
            return itemStatu;
          });
          return listTable;
        } else if (_this.specialForm.type === "1") {
          if (_this.tableDataNo.length < 1) {
            _this.$message("请添加栏目");
            return;
          }
          const listTable = _this.tableDataNo.every((item) => {
            if (!this.isEdit) {
              if (item.topicDetailList.length === 0) {
                this.$message.error("新增关联产品数为0，无法提交！");
              }
            }
            item.topicDetailList.forEach((goods) => {
              goods.skuLists.forEach((sku) => {
                const product = {
                  goodsId: sku.goodsId,
                  productId: goods.productId,
                };
                _this.specialForm.topicDetailList.push(product);
              });
            });
            return item.topicDetailList.length !== 0;
          });
          return listTable;
        }
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 时间组件绑定发生变化时触发
      onChangeFormat(val) {
        const [startTime, endTime] = val;
        this.specialForm.startTime = startTime;
        this.specialForm.endTime = endTime;
      },
      //远程搜索城市
      remoteArea(query) {
        if (query !== "") {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.keyword = query;
            this.areaList = [];
            this.getAreaList();
          }, 200);
        } else {
          this.areaList = [];
          this.keyword = undefined;
          this.getAreaList();
        }
      },
      // // 添加栏目
      // addColumn() {
      //   this.form = {
      //     columnId: undefined,
      //     columnName: "",
      //     relationProductNum: 0,
      //     topicDetailList: [],
      //     sort: this.tableData.length + 1,
      //     status: "normal",
      //   };
      //   this.interactive.dialogForm = true;
      //   this.$nextTick(() => {
      //     this.$refs.formColumn.resetFields();
      //   });
      // },
      // // 新增栏目
      // handleName(formColumn) {
      //   this.$refs[formColumn].validate((valid) => {
      //     if (valid) {
      //       this.interactive.dialogForm = false;
      //       this.tableData.push(this.form);
      //     } else {
      //       return false;
      //     }
      //   });
      // },
      // // 关联产品弹窗
      // relatedGoods(index, isNo, val) {
      //   const _this = this;
      //   _this.columnId = index;
      //   _this.interactive.dialogProducts = true;
      //   _this.$nextTick(() => {
      //     _this.$refs.relatedProducts.init(this.isEdit, isNo, val);
      //   });
      // },
      // // 查询已关联的产品
      // selectRelatedGoods(index, isNo, val) {
      //   const _this = this;
      //   _this.columnId = index;
      //   _this.interactive.dialogProducts = true;
      //   _this.$nextTick(() => {
      //     _this.$refs.relatedProducts.init(this.isEdit, isNo, val);
      //   });
      // },
      // // 关联产品的确认操作
      // refreshRelatedGoodsData(val, isHistory) {
      //   const _this = this;
      //   if (_this.specialForm.type === "2") {
      //     _this.tableData[this.columnId].topicDetailList = val;
      //   } else if (_this.specialForm.type === "1") {
      //     _this.tableDataNo[this.columnId].topicDetailList = val;
      //   }
      //   _this.interactive.dialogProducts = false;
      // },
      // hedSort(index, val) {
      //   this.value = val;
      // },
      // deSort(index, val) {
      //   if (!val) {
      //     this.tableData.forEach((item, s) => {
      //       if (s !== index) {
      //         if (item.sort > this.value) {
      //           item.sort = item.sort - 1;
      //         }
      //       }
      //     });
      //   }
      // },
      // 排序
      // updateSort(index, val) {
      //   if (val > this.tableData.length) {
      //     this.$message.error("排序值不能大于" + this.tableData.length);
      //     return;
      //   }
      //   // 降序
      //   this.tableData.forEach((item, s) => {
      //     console.log("item.sort", item.sort);
      //     if (s !== index) {
      //       console.log("index", item.sort);
      //       if (this.value > val) {
      //         if (item.sort >= val && item.sort < this.value) {
      //           item.sort = Number(item.sort) + 1;
      //         }
      //       } else if (this.value < val) {
      //         if (item.sort <= val && item.sort > this.value) {
      //           item.sort = Number(item.sort) - 1;
      //         }
      //       }
      //     }
      //   });
      //   // 升
      //   // this.tableData.forEach((item, s) => {
      //   //   if (s !== index) {
      //   //     if (item.sort >= val) {
      //   //       item.sort = Number(item.sort) + 1
      //   //     }
      //   //   }
      //   // })
      // },
      // 删除栏目
      // handleDelete(val) {
      //   this.tableData.splice(val, 1);
      //   // this.specialForm.topicColumnList.splice(val, 1)
      //   this.tableData.forEach((item, s) => {
      //     if (item.sort > val) {
      //       item.sort = Number(item.sort) - 1;
      //     }
      //   });
      // },
    },
  };
</script>

<style scoped lang="scss">
  .special-content {
    background-color: white;
    margin: 10px 20px;
    padding: 20px 30px;
  }

  .span-tips {
    color: rgba(0, 0, 0, 0.498039215686275);
  }

  .el-radio {
    display: table;
    margin-top: 5px;
  }
</style>
