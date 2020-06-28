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

      <v-card color="grey lighten-4" flat v-for="item in invDrugs" :key="item.inventory_drug_id">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid blue;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">药品名称</div>
            <div class="ml-2" @click="toDrug(item.Drug.drug_id)">{{item.Drug.cname}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">生产商</div>
            <div>{{item.Supplier.name}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">售价</div>
            <input type="text" :ref="item.inventory_drug_id" :value="item.sale_price" style="width:70px" @blur="editPrice(item)">
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">剩余数量</div>
            <div>{{item.inventory_num}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">输入购买数量</div>
            <input type="text" :ref="item.inventory_drug_id" :value="checkedNums(item)" style="width:70px" @blur="handleNum(item)">
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
          <v-select
          :items="employeesName"
          dense
          label="选择收银员"
          v-model="choosedEmp"
        ></v-select>
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
      invDrugs: [],
      page: 1,
      pageLength: 10,
      checkedMap: {},
      searchContent: '',
      employees: [],
      employeesName: [],
      choosedEmp: ''
    }
  },
  watch: {
    page: function () {
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/c/searchInvDrug', {
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
          this.invDrugs = res.data.data.invDrugs
          console.log(this.invDrugs)
          // 计算页数
          var page = parseInt(res.data.data.count / 10)
          var carry = parseInt(res.data.data.count % 10)
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
    editPrice (invDrug) {
      // 库存药品id
      // console.log(invDrugID)
      // 新的售价
      // console.log(this.$refs[invDrugID][0].value)
      if (invDrug.sale_price.toString() !== this.$refs[invDrug.inventory_drug_id][0].value) {
        // 先获取token
        var token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('new_sale_price', this.$refs[invDrug.inventory_drug_id][0].value)
        this.axios({
          url: '/api/v1/invdrugs/' + invDrug.inventory_drug_id + '?token=' + token,
          method: 'PUT',
          data: formData
        }).then(res => {
          if (res.data.code === 200) {
            this.dialog = true
            this.dialogHead = '修改售价'
            this.dialogInfo = '成功'
            invDrug.sale_price = this.$refs[invDrug.inventory_drug_id][0].value
          } else {
            this.dialog = true
            this.dialogHead = '修改售价'
            this.dialogInfo = '失败'
          }
        }).catch(res => {
          console.log('error')
          this.dialog = true
          this.dialogHead = '修改售价'
          this.dialogInfo = '失败'
        })
      }
    },
    toDrug (id) {
      this.$router.push('/drug/' + id)
    },
    search () {
      // console.log(this.searchContent)
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/c/searchInvDrug', {
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
          this.invDrugs = res.data.data.invDrugs
          console.log(this.invDrugs)
          // 计算页数
          var page = parseInt(res.data.data.count / 10)
          var carry = parseInt(res.data.data.count % 10)
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
    },
    handleNum (drug) {
      if (!isNaN(parseInt(this.$refs[drug.inventory_drug_id][1].value))) {
        this.checkedMap[drug.inventory_drug_id] = {
          drug: drug,
          nums: this.$refs[drug.inventory_drug_id][1].value,
          invID: drug.inventory_drug_id
        }
        console.log(this.checkedMap)
      }
    },
    checkedNums (item) {
      if (this.checkedMap[item.inventory_drug_id] === undefined) {
        return ''
      }
      return this.checkedMap[item.inventory_drug_id].nums
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
      // 获取顾客id
      var cid = localStorage.getItem('cid')
      // 获取员工ID
      var eid = this.choosedEmp.split('-')[0]
      // 获取token
      var token = localStorage.getItem('token')
      // 构造drugs [{InventoryDrugID: 1212, Num: 2}, {InventoryDrugID: 231231, Num: 3}]
      var drugs = []
      for (var key in this.checkedMap) {
        drugs.push({
          InventoryDrugID: parseInt(this.checkedMap[key].invID),
          Num: parseInt(this.checkedMap[key].nums)
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
      formData.append('customer_id', parseInt(cid))
      formData.append('employee_id', parseInt(eid))
      formData.append('drugs', drugs)
      this.axios({
        url: '/api/v1/c/saleorder?token=' + token,
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
    }
  },
  mounted () {
    // 先获取token
    var token = localStorage.getItem('token')
    this.axios.get('/api/v1/c/invdrugs', {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.invDrugs = res.data.data.invDrugs
        console.log(this.invDrugs)
        // 计算页数
        var page = parseInt(res.data.data.count / 10)
        var carry = parseInt(res.data.data.count % 10)
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

    // 先获取token
    this.axios.get('/api/v1/c/employees', {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.employees = res.data.data.employees
        for (var i in this.employees) {
          this.employeesName.push(this.employees[i].employee_id + '-' + this.employees[i].name)
        }
        this.choosedEmp = this.employeesName[0]
        console.log(this.employees)
      }
    }).catch(res => {
      this.dialog = true
      this.dialogHead = '你还没有登录'
      this.dialogInfo = '获取数据失败'
    })
  }
}
</script>
