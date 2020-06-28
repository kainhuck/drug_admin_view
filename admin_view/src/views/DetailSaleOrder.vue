<template>
    <v-container>
      <v-layout row wrap pa-4 justify-center>
        <v-flex xs2>
          <v-card flat>订单: {{id}}</v-card>
        </v-flex>
        <v-flex xs2>
          <v-card flat>顾客: {{customer.name}}</v-card>
        </v-flex>
        <v-flex xs2>
          <v-card flat>处理人: {{employee.name}}</v-card>
        </v-flex>
        <v-flex xs2>
          <v-card flat>药品总数: {{data.totalDrugs}}</v-card>
        </v-flex>
        <v-flex xs2>
          <v-card flat>总价: {{totalPrice}}</v-card>
        </v-flex>
        <v-flex xs4>
          <v-card flat>日期: {{data.sale_date}}</v-card>
        </v-flex>
      </v-layout>

      <v-card color="grey lighten-4" flat v-for="(item,index) in data.drug_list" :key="index">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid cyan;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">药品名称</div>
            <div class="ml-2" @click="toDrug(item.drug.drug_id)">{{item.drug.cname}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">进价</div>
            <div>{{item.buy_price}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">售价</div>
            <div>{{item.sale_price}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">数量</div>
            <div>{{item.num}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">总利润</div>
            <div>{{parseInt(item.num) * (parseInt(item.sale_price)-parseInt(item.buy_price))}}</div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>

      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination v-model="page" class="my-1" :length="pageLength"></v-pagination>
          </v-container>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">{{dialogHead}}</v-card-title>
          <v-card-text>{{dialogInfo}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      id: 0,
      page: 1,
      pageLength: 10,
      dialog: false,
      dialogHead: '',
      dialogInfo: '',
      data: {},
      customer: {},
      employee: {},
      totalPrice: 0
    }
  },
  watch: {
    page: function () {
      // 获得订单的id
      this.id = this.$route.params.id
      var token = localStorage.getItem('token')
      // 请求数据
      this.axios.get('/api/v1/detailSaleOrder/' + this.id, {
        params: {
          token: token,
          page: this.page
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.data = res.data.data.saleOrder
          this.totalPrice = res.data.data.totalPrice
          this.customer = res.data.data.saleOrder.customer
          this.employee = res.data.data.saleOrder.employee
          // 计算页数
          var page = parseInt(res.data.data.saleOrder.totalDrugs / 10)
          var carry = parseInt(res.data.data.saleOrder.totalDrugs % 10)
          if (carry > 0) {
            this.pageLength = page + 1
          } else {
            this.pageLength = page
          }
        } else {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    }
  },
  mounted () {
    // 获得订单的id
    this.id = this.$route.params.id
    var token = localStorage.getItem('token')
    // 请求数据
    this.axios.get('/api/v1/detailSaleOrder/' + this.id, {
      params: {
        token: token
      }
    }).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        this.data = res.data.data.saleOrder
        this.totalPrice = res.data.data.totalPrice
        this.customer = res.data.data.saleOrder.customer
        this.employee = res.data.data.saleOrder.employee
        // 计算页数
        var page = parseInt(res.data.data.saleOrder.totalDrugs / 10)
        var carry = parseInt(res.data.data.saleOrder.totalDrugs % 10)
        if (carry > 0) {
          this.pageLength = page + 1
        } else {
          this.pageLength = page
        }
      } else {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      }
    }).catch(res => {
      this.dialog = true
      this.dialogHead = '你还没有登录'
      this.dialogInfo = '获取数据失败'
    })
  },
  methods: {
    toDrug (id) {
      this.$router.push('/drug/' + id)
    }
  }
}
</script>
