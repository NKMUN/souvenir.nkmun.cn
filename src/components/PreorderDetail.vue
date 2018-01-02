<template>
  <div class="preorder-detail">
    <mt-header fixed title="详情">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div v-for="(item, index) in preorderInfo" :key="index">
      <mt-cell title="名称" :value="item.name"></mt-cell>
      <mt-cell title="个数" :value="item.num"></mt-cell>
    </div>
    <mt-cell title="代表姓名" :value="preorder.customer_name"></mt-cell>
    <mt-cell title="代表会场" :value="preorder.customer_committee"></mt-cell>
    <mt-cell title="代表手机" :value="preorder.customer_phone"></mt-cell>
    <mt-cell title="酒店/房间" :value="preorder.customer_hotel"></mt-cell>
    <mt-cell title="备注" :value="preorder.note"></mt-cell>
    <mt-cell title="订单总额" :value="preorder.order_total"></mt-cell>
    <mt-cell title="销售点" :value="preorder.operator"></mt-cell>
    <mt-cell title="销售时间" :value="time"></mt-cell>
    <div class="btn-group">
      <mt-button class="act-btn" type="primary" size="large" @click.native="confirm" v-if="!preorder.confirmed && role === 'admin'">确认送达</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'preorderDetail',
  data () {
    return {
      preorder: {},
      preorderInfo: []
    }
  },
  computed: {
    time: function () {
      var date = new Date(parseInt(this.preorder.order_time))
      return date.toLocaleString('chinese', {hour12: false})
    },
    role: function () {
      return window.sessionStorage.getItem('role')
    }
  },
  mounted: function () {
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/order/detail/' + this.$route.params.id)
      .then(function (response) {
        if (response.status === 200) {
          vm.preorder = response.data[0]
          vm.preorderInfo = JSON.parse(vm.preorder.order_info)
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
    confirm: function () {
      var vm = this
      this.$http.get('https://souvenir.nkmun.cn/api/order/confirm/' + this.$route.params.id)
      .then(function (response) {
        Toast({
          message: response.data.message,
          position: 'bottom',
          duration: 3000
        })
        Indicator.close()
        vm.$router.push('/')
      })
      .catch(function (error) {
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
  .preorder-detail {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }
</style>
