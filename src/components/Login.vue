<template>
  <div class="login">
    <mt-header fixed title="登录">
    </mt-header>
    <mt-field label="用户名" placeholder="请输入用户名" v-model="user.username"></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="user.password"></mt-field>
    <div class="btn-group">
      <mt-button class="act-btn" type="primary" size="large" @click.native="login">登录</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login: function () {
      Indicator.open()
      var vm = this
      var qs = require('qs')
      this.$http.post('https://souvenir.nkmun.cn/api/user/login', qs.stringify({
        'username': this.user.username,
        'password': this.user.password
      }))
      .then(function (response) {
        Toast({
          message: response.data.message,
          position: 'bottom',
          duration: 3000
        })
        Indicator.close()
        if (response.data.code === '200') {
          window.sessionStorage.setItem('role', response.data.role)
          window.sessionStorage.setItem('user', response.data.username)
          vm.$router.push('/')
        } else {
          vm.$router.push('/login')
        }
      }).catch(function (error) {
        Toast({
          message: error,
          position: 'bottom',
          duration: 3000
        })
        Indicator.close()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }
</style>
