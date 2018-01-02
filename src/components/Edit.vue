<template>
  <div class="edit">
    <mt-header fixed title="修改纪念品">
      <router-link :to="'/detail/'+ this.$route.params.id" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-field label="名称" placeholder="请输入纪念品名称" v-model="souvenir.name"></mt-field>
    <mt-field label="售价" placeholder="请输入纪念品售价" type="number" v-model="souvenir.price"></mt-field>
    <mt-field label="库存数量" placeholder="请输入纪念品库存数量" type="number" v-model="souvenir.stock"></mt-field>
    <mt-field label="剩余数量" placeholder="请输入纪念品剩余数量" type="number" v-model="souvenir.available"></mt-field>
    <div class="btn-group">
      <mt-button class="act-btn" type="primary" size="large" @click.native="submit">确定</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'edit',
  data () {
    return {
      souvenir: {}
    }
  },
  mounted: function () {
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/souvenir/detail/' + this.$route.params.id)
      .then(function (response) {
        console.log(response)
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
    submit: function () {
      Indicator.open()
      var vm = this
      var qs = require('qs')
      this.$http.post('https://souvenir.nkmun.cn/api/souvenir/update', qs.stringify({
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
          vm.$router.push('/detail/' + vm.$route.params.id)
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
  .edit {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }
</style>
