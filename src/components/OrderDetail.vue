<template>
  <div class="order-detail">
    <mt-header fixed title="详情">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div v-for="(item, index) in orderInfo" :key="index">
      <mt-cell title="名称" :value="item.name"></mt-cell>
      <mt-cell title="个数" :value="item.num"></mt-cell>
    </div>
    <mt-cell title="订单总额" :value="order.order_total"></mt-cell>
    <mt-cell title="备注" :value="order.note"></mt-cell>
    <mt-cell title="销售点" :value="order.operator"></mt-cell>
    <mt-cell title="销售时间" :value="time"></mt-cell>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'orderDetail',
  data () {
    return {
      order: {},
      orderInfo: []
    }
  },
  computed: {
    time: function () {
      var date = new Date(parseInt(this.order.order_time))
      return date.toLocaleString('chinese', {hour12: false})
    }
  },
  mounted: function () {
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/order/detail/' + this.$route.params.id)
      .then(function (response) {
        if (response.status === 200) {
          vm.order = response.data[0]
          vm.orderInfo = JSON.parse(vm.order.order_info)
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .order-detail {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }
</style>
