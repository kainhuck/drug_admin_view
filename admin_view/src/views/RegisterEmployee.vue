<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="username" :counter="10" :rules="usernameRules" label="用户名" required></v-text-field>
      <v-text-field v-model="password" :type="'password'" :rules="passwordRules" label="密码" required></v-text-field>
      <v-text-field v-model="cpassword" :type="'password'" :rules="cpasswordRules" label="确认密码" required></v-text-field>
      <v-text-field v-model="name" :counter="10" :rules="nameRules" label="真实名字" required></v-text-field>
      <v-text-field v-model="position" :counter="10" :rules="positionRules" label="职位" required></v-text-field>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">注册</v-btn>
    </v-form>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
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
  data: () => ({
    valid: true,
    username: '',
    usernameRules: [v => !!v || '用户名不能为空'],
    password: '',
    passwordRules: [v => !!v || '密码不能为空'],
    cpassword: '',
    cpasswordRules: [v => !!v || '确认密码不能为空'],
    name: '',
    nameRules: [v => !!v || '真名不能为空'],
    position: '',
    positionRules: [v => !!v || '职位不能为空'],
    dialog: false,
    dialogHead: '',
    dialogInfo: ''
  }),

  methods: {
    validate () {
      this.$refs.form.validate()
      var token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      formData.append('confirm_password', this.cpassword)
      formData.append('name', this.name)
      formData.append('position', this.position)
      this.axios({
        url: '/api/v1/employee?token=' + token,
        method: 'POST',
        data: formData
      })
        .then(res => {
          if (res.data.code === 200) {
            this.username = ''
            this.password = ''
            this.cpassword = ''
            this.name = ''
            this.position = ''
            this.dialog = true
            this.dialogHead = '注册成功'
            this.dialogInfo = 'ok'
          } else {
            this.dialog = true
            this.dialogHead = '注册失败'
            this.dialogInfo = res.data.msg
          }
        })
        .catch(res => {
          this.dialog = true
          this.dialogHead = '注册失败'
          this.dialogInfo = '请求发送失败'
        })
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
