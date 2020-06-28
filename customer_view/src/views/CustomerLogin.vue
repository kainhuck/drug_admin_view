<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="username" :counter="11" :rules="usernameRules" label="手机号" required></v-text-field>

      <v-text-field v-model="password" :type="'password'" :rules="passwordRules" label="密码" required></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">登录</v-btn>
    </v-form>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">登录失败</v-card-title>
        <v-card-text>
          账号或密码有误
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
    dialog: false
  }),

  methods: {
    validate () {
      this.$refs.form.validate()
      const formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      this.axios({
        url: '/auth/c',
        method: 'POST',
        data: formData
      })
        .then(res => {
          localStorage.setItem('token', res.data.data.token)
          // 存储经理id
          localStorage.setItem('cid', res.data.data.id)
          this.$router.push('/shopmall')
        })
        .catch(res => {
          this.dialog = true
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
