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
            <div class="caption teal--text">供应商</div>
            <div>{{item.Supplier.name}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">进价</div>
            <div>{{item.purchase_price}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">售价</div>
            <input type="text" :ref="item.inventory_drug_id" :value="item.sale_price" style="width:70px" @blur="editPrice(item)">
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">库存数量</div>
            <div>{{item.inventory_num}}</div>
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
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      dialogHead: '',
      dialogInfo: '',
      invDrugs: [],
      page: 1,
      pageLength: 10,
      searchContent: ''
    }
  },
  watch: {
    page: function () {
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/searchInvDrug', {
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
      this.axios.get('/api/v1/searchInvDrug', {
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
    }
  },
  mounted () {
    // 先获取token
    var token = localStorage.getItem('token')
    this.axios.get('/api/v1/invdrugs', {
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
  }
}
</script>
