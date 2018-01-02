<template>
  <div class="product-detail">
    <mt-header fixed title="详情">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-cell title="名称" :value="souvenir.name"></mt-cell>
    <mt-cell title="售价" :value="souvenir.price"></mt-cell>
    <mt-cell title="总数" :value="souvenir.stock"></mt-cell>
    <mt-cell title="剩余数量" :value="souvenir.available"></mt-cell>
    <div class="btn-group">
      <mt-button class="act-btn" type="default" size="large" @click.native="editSouvenir" v-if="role === 'admin'">修改该纪念品</mt-button>
      <mt-button class="act-btn" type="danger" size="large" @click.native="deleteSouvenir" v-if="role === 'admin'">删除该纪念品</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'productDetail',
  data () {
    return {
      souvenir: {}
    }
  },
  computed: {
    role: function () {
      return window.sessionStorage.getItem('role')
    }
  },
  mounted: function () {
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/souvenir/detail/' + this.$route.params.id)
      .then(function (response) {
        if (response.status === 200) {
          vm.souvenir = response.data[0]
          Indicator.close()
        } else {
          Toast({
            message: response.data.message,
            position: 'bottom',
            duration: 3000
          })
          Indicator.close()
        }
      })
      .catch(function (error) {
        Toast({
          message: error,
          position: 'bottom',
          duration: 3000
        })
        Indicator.close()
      })
  },
  methods: {
    editSouvenir: function () {
      this.$router.push('/edit/' + this.souvenir.id)
    },
    deleteSouvenir: function () {
      Indicator.open()
      var vm = this
      var qs = require('qs')
      this.$http.post('https://souvenir.nkmun.cn/api/souvenir/delete', qs.stringify({
        'id': this.souvenir.id,
        'name': this.souvenir.name,
        'price': this.souvenir.price,
        'stock': this.souvenir.stock,
        'available': this.souvenir.available
      }))
      .then(function (response) {
        Toast({
          message: response.data.message,
          position: 'bottom',
          duration: 3000
        })
        Indicator.close()
        if (response.data.code === '200') {
          vm.$router.push('/')
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
  .product-detail {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }
</style>
