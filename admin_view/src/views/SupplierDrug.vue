<template>
    <v-container>

       <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="搜索"
        class="hidden-sm-and-down"
        v-model="searchContent"
        mb-5
        @blur="search()"
      ></v-text-field>

      <v-card color="grey lighten-4" flat v-for="item in drugs" :key="item.Drug.drug_id">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid blue;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">药品名称</div>
            <div class="ml-2" @click="toDrug(item.Drug.drug_id)">{{item.Drug.cname}}</div>
          </v-flex>
          <v-flex xs1>
            <div class="caption teal--text">售价</div>
            <div>{{item.sale_price}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">供应商</div>
            <div>{{supplierName}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">联系电话</div>
            <div>{{supplierPhone}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">输入购买数量</div>
            <input type="text" :ref="item.Drug.drug_id" :value="checkedNums(item)" style="width:70px" @blur="handleNum(item)">
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>

      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              class="my-1"
              :length="pageLength"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>

      <v-dialog
        v-model="dialog"
        max-width="290">
        <v-card>
          <v-card-title class="headline">{{dialogHead}}</v-card-title>
          <v-card-text>
            {{dialogInfo}}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    <v-btn
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      @click="buydialog = !buydialog"
    >
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-dialog
      v-model="buydialog"
      width="800px"
    >
      <v-card>
        <v-card-title class="grey darken-2">
          购物车
        </v-card-title>
        <v-container>
          <v-card color="grey lighten-4" flat v-for="(value,key) in checkedMap" :key="key">
            <v-layout row wrap class="pa-3" :style="`border-left: 4px solid pink;`">
            <v-flex xs3>
                <div class="caption teal--text ml-2">药品名称</div>
                <div class="ml-2">{{value.drug.Drug.cname}}</div>
            </v-flex>
            <v-flex xs2>
                <div class="caption teal--text">单价</div>
                <div>{{value.drug.sale_price}}</div>
            </v-flex>
            <v-flex xs2>
                <div class="caption teal--text">数量</div>
                <div>{{value.nums}}</div>
            </v-flex>
            <v-flex xs2>
                <div class="caption teal--text">总价</div>
                <div>{{parseInt(value.nums) * value.drug.sale_price}}</div>
            </v-flex>
            <v-flex xs2>
                <v-tooltip top mt-3>
                    <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon @click="removeIt(key)"><v-icon color="error">mdi-trash-can-outline</v-icon></v-btn>
                    </template>
                <span>移出购物车</span>
                </v-tooltip>
            </v-flex>
            </v-layout>
            <v-divider></v-divider>
        </v-card>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="clearShopCar"
          >清空购物车</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="success"
            @click="buyShopCar"
          >去付款</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-container>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      buydialog: false,
      dialogHead: '',
      dialogInfo: '',
      drugs: [],
      page: 1,
      pageLength: 10,
      id: 0,
      supplierName: '',
      supplierPhone: '',
      checkedMap: {},
      searchContent: ''
    }
  },
  computed: {
  },
  watch: {
    page: function () {
      // 获取supplier id
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/searchSuppliers/' + this.id, {
        params: {
          token: token,
          search_content: this.searchContent,
          page: this.page
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '未知原因'
          this.dialogInfo = '获取数据失败'
        } else {
          this.drugs = res.data.data.supplier.Drugs
          this.supplierName = res.data.data.supplier.name
          this.supplierPhone = res.data.data.supplier.phone
          // 计算页数
          var page = parseInt(res.data.data.supplier.total_drugs / 10)
          var carry = parseInt(res.data.data.supplier.total_drugs % 10)
          if (carry > 0) {
            this.pageLength = page + 1
          } else {
            this.pageLength = page
          }
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    }
  },
  methods: {
    handleNum (drug) {
      if (!isNaN(parseInt(this.$refs[drug.Drug.drug_id][0].value))) {
        this.checkedMap[drug.Drug.drug_id] = {
          drug: drug,
          nums: this.$refs[drug.Drug.drug_id][0].value
        }
        console.log(this.checkedMap)
      }
    },
    checkedNums (item) {
      if (this.checkedMap[item.Drug.drug_id] === undefined) {
        return ''
      }
      return this.checkedMap[item.Drug.drug_id].nums
    },
    removeIt (key) {
    //   delete this.checkedMap[key]
      var temp = this.checkedMap
      this.checkedMap = {}
      for (var k in temp) {
        if (key === k) {
          continue
        }
        this.$set(this.checkedMap, k, temp[k])
      }
    },
    clearShopCar () {
      this.checkedMap = {}
    },
    buyShopCar () {
      this.buydialog = false
      // 向后端发送请求
      // 获取经理id
      var mid = localStorage.getItem('mid')
      // 获取供应商id
      // this.id
      // 获取token
      var token = localStorage.getItem('token')
      // 构造drugs [{"DrugID":1152361,"Num":20,"SalePrice":100}]
      var drugs = []
      for (var key in this.checkedMap) {
        drugs.push({
          DrugID: parseInt(key),
          Num: parseInt(this.checkedMap[key].nums),
          SalePrice: parseInt(this.checkedMap[key].drug.sale_price)
        })
      }
      if (drugs.length === 0) {
        this.dialog = true
        this.dialogHead = '购买'
        this.dialogInfo = '购买失败, 购物车没有商品'
        return
      }
      drugs = JSON.stringify(drugs)
      // 发送post请求
      const formData = new FormData()
      formData.append('manager_id', parseInt(mid))
      formData.append('supplier_id', parseInt(this.id))
      formData.append('drugs', drugs)
      this.axios({
        url: '/api/v1/buyorder?token=' + token,
        method: 'POST',
        data: formData
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          // 请求成功
          this.checkedMap = {}
          this.dialog = true
          this.dialogHead = '购买'
          this.dialogInfo = '付款成功,已购买'
        } else {
          this.dialog = true
          this.dialogHead = '购买'
          this.dialogInfo = '购买失败,' + res.data.msg
        }
      }).catch(res => {
        console.log(res)
        this.dialog = true
        this.dialogHead = '购买'
        this.dialogInfo = '购买失败'
      })
    },
    toDrug (id) {
      this.$router.push('/drug/' + id)
    },
    search () {
      // 获取supplier id
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/searchSuppliers/' + this.id, {
        params: {
          token: token,
          search_content: this.searchContent
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '未知原因'
          this.dialogInfo = '获取数据失败'
        } else {
          this.drugs = res.data.data.supplier.Drugs
          this.supplierName = res.data.data.supplier.name
          this.supplierPhone = res.data.data.supplier.phone
          // 计算页数
          var page = parseInt(res.data.data.supplier.total_drugs / 10)
          var carry = parseInt(res.data.data.supplier.total_drugs % 10)
          if (carry > 0) {
            this.pageLength = page + 1
          } else {
            this.pageLength = page
          }
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    }
  },
  mounted () {
    // 获取supplier id
    var id = this.$route.params.id
    this.id = id
    // 先获取token
    var token = localStorage.getItem('token')
    this.axios.get('/api/v1/suppliers/' + id, {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.drugs = res.data.data.supplier.Drugs
        this.supplierName = res.data.data.supplier.name
        this.supplierPhone = res.data.data.supplier.phone
        console.log(this.drugs)
        // 计算页数
        var page = parseInt(res.data.data.supplier.total_drugs / 10)
        var carry = parseInt(res.data.data.supplier.total_drugs % 10)
        if (carry > 0) {
          this.pageLength = page + 1
        } else {
          this.pageLength = page
        }
      }
    }).catch(res => {
      this.dialog = true
      this.dialogHead = '你还没有登录'
      this.dialogInfo = '获取数据失败'
    })
  }
}
</script>
