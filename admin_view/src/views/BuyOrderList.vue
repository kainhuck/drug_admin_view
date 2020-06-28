<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="startdate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startdate"
              label="选择起始日期"
              prepend-icon="mdi-calendar-today"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startdate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="handleStart">确定</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4">
        <v-menu
          ref="menu2"
          v-model="menu2"
          :close-on-content-click="false"
          :return-value.sync="enddate"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="enddate"
              label="选择截止日期"
              prepend-icon="mdi-calendar-today"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="enddate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="handleEnd">确定</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-card color="grey lighten-4" flat v-for="item in buyOrderList" :key="item.drug_sale_order_id">
      <v-layout row wrap class="pa-3" :style="`border-left: 4px solid purple;`">
        <v-flex xs1>
          <div class="caption teal--text ml-2">订单号</div>
          <div class="ml-2" @click="toDetail(item.drug_buy_order_id)">{{item.drug_buy_order_id}}</div>
        </v-flex>
        <v-flex xs4>
          <div class="caption teal--text">供应商</div>
          <div>{{item.supplier.name}}</div>
        </v-flex>
        <v-flex xs2>
          <div class="caption teal--text">经理</div>
          <div>{{item.manager.username}}</div>
        </v-flex>
        <v-flex xs2>
          <div class="caption teal--text">购买总额</div>
          <div>{{item.totalPrice}}</div>
        </v-flex>
        <v-flex xs3>
          <div class="caption teal--text">购买日期</div>
          <div>{{item.buy_date.substr(0, 10)}}</div>
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
  data: () => ({
    startdate: '2018-01-01',
    enddate: new Date().toISOString().substr(0, 10),
    menu: false,
    menu2: false,
    buyOrderList: [],
    page: 1,
    pageLength: 10,
    dialog: false,
    dialogHead: '',
    dialogInfo: ''
  }),
  methods: {
    handleStart () {
      this.menu = false
      this.$refs.menu.save(this.startdate)
      var token = localStorage.getItem('token')
      this.axios
        .get('/api/v1/periodBuy', {
          params: {
            token: token,
            start_time: this.startdate,
            end_time: this.enddate
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            this.buyOrderList = res.data.data.periodBuys
            // 计算页数
            var page = parseInt(res.data.data.count / 10)
            var carry = parseInt(res.data.data.count % 10)
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
        })
        .catch(res => {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        })
    },
    handleEnd () {
      this.menu2 = false
      this.$refs.menu2.save(this.enddate)
      var token = localStorage.getItem('token')
      this.axios
        .get('/api/v1/periodBuy', {
          params: {
            token: token,
            start_time: this.startdate,
            end_time: this.enddate
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            this.buyOrderList = res.data.data.periodBuys
            // 计算页数
            var page = parseInt(res.data.data.count / 10)
            var carry = parseInt(res.data.data.count % 10)
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
        })
        .catch(res => {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        })
    },
    toDetail (id) {
      this.$router.push('/detailBuyOrder/' + id)
    }
  },
  watch: {
    page: function () {
      var token = localStorage.getItem('token')
      this.axios
        .get('/api/v1/periodBuy', {
          params: {
            token: token,
            start_time: this.startdate,
            end_time: this.enddate,
            page: this.page
          }
        })
        .then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            this.buyOrderList = res.data.data.periodBuys
            // 计算页数
            var page = parseInt(res.data.data.count / 10)
            var carry = parseInt(res.data.data.count % 10)
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
        })
        .catch(res => {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        })
    }
  },
  mounted () {
    // 请求buy订单
    var token = localStorage.getItem('token')
    this.axios
      .get('/api/v1/periodBuy', {
        params: {
          token: token,
          start_time: this.startdate,
          end_time: this.enddate
        }
      })
      .then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.buyOrderList = res.data.data.periodBuys
          // 计算页数
          var page = parseInt(res.data.data.count / 10)
          var carry = parseInt(res.data.data.count % 10)
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
      })
      .catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
  }
}
</script>
