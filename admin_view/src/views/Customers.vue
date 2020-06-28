<template>
    <v-container>
      <v-card color="grey lighten-4" flat v-for="item in customers" :key="item.customer_id">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid yellow;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">顾客ID</div>
            <div class="ml-2" @click="toCustomerSale(item.customer_id)">{{item.customer_id}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">顾客姓名</div>
            <div>{{item.name}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">顾客手机号</div>
            <div>{{item.phone}}</div>
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
      customers: [],
      page: 1,
      pageLength: 10
    }
  },
  watch: {
    page: function () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/customers', {
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
          this.customers = res.data.data.customers
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
    toCustomerSale (id) {
      this.$router.push('/customerSale/' + id)
    }
  },
  mounted () {
    // 先获取token
    var token = localStorage.getItem('token')
    this.axios.get('/api/v1/customers', {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.customers = res.data.data.customers
        console.log(this.customers)
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
