<template>
  <v-container>
    <v-layout row wrap justify-space-around>
      <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="#385F73" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">库存药品总数</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{ invDrugNum }}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getInvDrugNum()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="pink darken-4" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">员工总数</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{employeeNum}}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getEmployeeNum()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="deep-purple darken-4" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">顾客总数</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{customerNum}}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getCustomerNum()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-space-around mt-5>
        <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="deep-orange darken-4" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">销售总额</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{totalSale}}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getTotalSale()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="cyan darken-4" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">总利润</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{totalProfit}}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getTotalProfit()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
      <v-flex xs12 md4 lg2>
        <v-hover v-slot:default="{ hover }" close-delay="200">
          <v-card color="grayd darken-4" dark class="ma-1" :elevation="hover ? 16 : 2">
            <v-card-title class="headline">总支出</v-card-title>
            <v-card-subtitle>
              <div class="display-1">{{totalBuy}}</div>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="getTotalBuy()">refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>

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
      invDrugNum: 99999,
      employeeNum: 99999,
      customerNum: 99999,
      totalSale: 99999,
      totalProfit: 99999,
      totalBuy: 99999
    }
  },
  methods: {
    getInvDrugNum () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/invdrugs', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.invDrugNum = res.data.data.count
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    },
    getEmployeeNum () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/employees', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.employeeNum = res.data.data.count
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    },
    getCustomerNum () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/customers', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.customerNum = res.data.data.count
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    },
    getTotalSale () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/totalSales', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.totalSale = res.data.data.totalSales
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    },
    getTotalBuy () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/totalBuy', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.totalBuy = res.data.data.totalBuy
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    },
    getTotalProfit () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/totalProfit', {
        params: {
          token: token
        }
      }).then(res => {
        if (res.data.code !== 200) {
          this.dialog = true
          this.dialogHead = '你还没有登录'
          this.dialogInfo = '获取数据失败'
        } else {
          this.totalProfit = res.data.data.totalProfit
        }
      }).catch(res => {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      })
    }
  },
  mounted () {
    this.getInvDrugNum()
    this.getEmployeeNum()
    this.getCustomerNum()
    this.getTotalSale()
    this.getTotalBuy()
    this.getTotalProfit()
  }
}
</script>
