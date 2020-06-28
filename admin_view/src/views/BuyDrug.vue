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

      <v-card color="grey lighten-4" flat v-for="item in suppliers" :key="item.supplier_id">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid tomato;`">
          <v-flex xs6>
            <div class="caption teal--text ml-2">供应商名称</div>
            <div class="ml-2">{{item.name}}</div>
          </v-flex>
          <v-flex xs5>
            <div class="caption teal--text">供应商电话</div>
            <div>{{item.phone}}</div>
          </v-flex>
          <v-flex xs1>
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                 <v-btn v-on="on" icon @click="toSupplierDrug(item.supplier_id)"><v-icon>mdi-arrow-left-circle</v-icon></v-btn>
                </template>
            <span>去这家选药</span>
            </v-tooltip>
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
      suppliers: [],
      page: 1,
      pageLength: 10,
      searchContent: ''
    }
  },
  watch: {
    page: function () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/suppliers', {
        params: {
          token: token,
          page: this.page
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.suppliers = res.data.data.suppliers
          console.log(this.suppliers)
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
    toSupplierDrug (id) {
      this.$router.push('/supplierDrug/' + id)
    },
    search () {
      // 先获取token
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/searchSuppliers', {
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
          this.suppliers = res.data.data.suppliers
          console.log(res.data)
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
    // 获取供应商列表
    this.axios.get('/api/v1/suppliers', {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.suppliers = res.data.data.suppliers
        console.log(this.suppliers)
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
