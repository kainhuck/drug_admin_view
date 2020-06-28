<template>
    <v-container>
      <v-card color="grey lighten-4" flat v-for="item in employees" :key="item.employee_id">
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid yellow;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">员工ID</div>
            <div class="ml-2" @click="toEmployeeSale(item.employee_id)">{{item.employee_id}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">员工姓名</div>
            <div>{{item.name}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">员工职称</div>
            <input type="text" :ref="item.employee_id + 'p'" :value="item.position" style="width:70px" @blur="editPosition(item)">
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">员工用户名</div>
            <div>{{item.username}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">员工密码</div>
            <input type="text" :ref="item.employee_id" :value="item.password" style="width:70px" @blur="editPassword(item)">
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
      employees: [],
      page: 1,
      pageLength: 10
    }
  },
  watch: {
    page: function () {
      var token = localStorage.getItem('token')
      this.axios.get('/api/v1/employees', {
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
          this.employees = res.data.data.employees
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
    editPosition (employee) {
      // 新的职称
      //   console.log(this.$refs[employee.employee_id + 'p'][0].value)
      if (employee.position.toString() !== this.$refs[employee.employee_id + 'p'][0].value) {
        // 先获取token
        var token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('new_position', this.$refs[employee.employee_id + 'p'][0].value)
        this.axios({
          url: '/api/v1/employeePosition/' + employee.employee_id + '?token=' + token,
          method: 'PUT',
          data: formData
        }).then(res => {
          if (res.data.code === 200) {
            this.dialog = true
            this.dialogHead = '修改职称'
            this.dialogInfo = '成功'
            employee.position = this.$refs[employee.employee_id + 'p'][0].value
          } else {
            this.dialog = true
            this.dialogHead = '修改职称'
            this.dialogInfo = '失败'
          }
        }).catch(res => {
          console.log('error')
          this.dialog = true
          this.dialogHead = '修改职称'
          this.dialogInfo = '失败'
        })
      }
    },
    editPassword (employee) {
      // 新的密码
      // console.log(this.$refs[employee.employee_id][0].value)
      if (employee.password.toString() !== this.$refs[employee.employee_id][0].value) {
        // 先获取token
        var token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('new_password', this.$refs[employee.employee_id][0].value)
        formData.append('confirm_password', this.$refs[employee.employee_id][0].value)
        this.axios({
          url: '/api/v1/employee/' + employee.employee_id + '?token=' + token,
          method: 'PUT',
          data: formData
        }).then(res => {
          if (res.data.code === 200) {
            this.dialog = true
            this.dialogHead = '修改密码'
            this.dialogInfo = '成功'
            employee.password = this.$refs[employee.employee_id][0].value
          } else {
            this.dialog = true
            this.dialogHead = '修改密码'
            this.dialogInfo = '失败'
          }
        }).catch(res => {
          console.log(res)
          this.dialog = true
          this.dialogHead = '修改密码'
          this.dialogInfo = '失败'
        })
      }
    },
    toEmployeeSale (id) {
      this.$router.push('/employeeSale/' + id)
    }
  },
  mounted () {
    // 先获取token
    var token = localStorage.getItem('token')
    this.axios.get('/api/v1/employees', {
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
        console.log(this.employees)
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
