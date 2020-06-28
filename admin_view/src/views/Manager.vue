<template>
    <v-container>
      <v-card color="grey lighten-4" flat>
        <v-layout row wrap class="pa-3" :style="`border-left: 4px solid gold;`">
          <v-flex xs3>
            <div class="caption teal--text ml-2">ID</div>
            <div class="ml-2">{{manager.manager_id}}</div>
          </v-flex>
          <v-flex xs3>
            <div class="caption teal--text">用户名</div>
            <div>{{manager.username}}</div>
          </v-flex>
          <v-flex xs2>
            <div class="caption teal--text">密码</div>
            <input type="text" :ref="'password'" :value="manager.password" style="width:70px" @blur="editPassword()">
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>

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
      manager: {},
      mid: 0
    }
  },
  methods: {
    editPassword () {
      // 新的密码
      //   console.log(this.$refs.password.value)
      if (this.manager.password.toString() !== this.$refs.password.value) {
        // 先获取token
        var token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('new_password', this.$refs.password.value)
        formData.append('confirm_password', this.$refs.password.value)
        this.axios({
          url: '/api/v1/manager/' + this.manager.manager_id + '?token=' + token,
          method: 'PUT',
          data: formData
        }).then(res => {
          if (res.data.code === 200) {
            this.dialog = true
            this.dialogHead = '修改密码'
            this.dialogInfo = '成功'
            this.manager.password = this.$refs.password.value
          } else {
            this.dialog = true
            this.dialogHead = '修改密码'
            this.dialogInfo = '失败'
          }
        }).catch(res => {
          console.log('error')
          this.dialog = true
          this.dialogHead = '修改密码'
          this.dialogInfo = '失败'
        })
      }
    }
  },
  mounted () {
    // 先获取token
    var token = localStorage.getItem('token')
    // 获取经理id
    this.mid = localStorage.getItem('mid')
    this.axios.get('/api/v1/manager/' + this.mid, {
      params: {
        token: token
      }
    }).then(res => {
      if (res.data.code !== 200) {
        this.dialog = true
        this.dialogHead = '未知原因'
        this.dialogInfo = '获取数据失败'
      } else {
        this.manager = res.data.data.manager
        console.log(this.manager)
      }
    }).catch(res => {
      this.dialog = true
      this.dialogHead = '你还没有登录'
      this.dialogInfo = '获取数据失败'
    })
  }
}
</script>
