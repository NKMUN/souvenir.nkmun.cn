<template>
  <div class="sale">
    <mt-header fixed title="销售">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="form-group">
      <div class="souvenir-group" v-for="(item, index) in souvenirList" :key="index">
        <mt-field :label="item.name" placeholder="请输入购买数量" type="number" :disableClear="true" :attr="{max: item.available}" v-model="item.num" @change.native="compute(index)"></mt-field>
        <mt-cell class="error" v-if="item.num > item.available">剩余数量不足！</mt-cell>
        <mt-cell>价格为{{item.total}}元</mt-cell> 
      </div>
      <mt-cell>总计应收{{shouldTotal}}元</mt-cell>
      <mt-field label="实际收取" placeholder="请输入实收金额" type="number" v-model="acturallyTotal"></mt-field>
      <mt-field label="代表姓名" placeholder="请输入代表姓名" type="text" v-model="customerName"></mt-field>
      <mt-field label="代表会场" placeholder="请输入代表会场" type="text" v-model="customerCommittee"></mt-field>
      <mt-field label="代表手机" placeholder="请输入代表手机" type="text" v-model="customerPhone" :attr="{maxlength: 11}"></mt-field>
      <mt-field label="酒店/房间" placeholder="请输入酒店/房间" type="text" v-model="customerHotel"></mt-field>
      <mt-field label="备注" placeholder="请输入备注" type="text" v-model="note"></mt-field>
    </div>
    <div class="btn-group">
      <mt-button class="act-btn" type="primary" size="large" @click.native="submit" :disabled="disabled">确认销售</mt-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'sale',
  data () {
    return {
      souvenirList: [],
      customerName: '',
      customerCommittee: '',
      customerPhone: '',
      customerHotel: '',
      note: '',
      orderList: [],
      orderInfo: '',
      acturallyTotal: null
    }
  },
  computed: {
    shouldTotal: function () {
      var totalMoney = 0
      for (var i = 0; i < this.souvenirList.length; i++) {
        totalMoney = totalMoney + this.souvenirList[i].total
      }
      return totalMoney
    },
    total: function () {
      if (this.acturallyTotal > 0) {
        return parseInt(this.acturallyTotal)
      } else {
        return this.shouldTotal
      }
    },
    confirmed: function () {
      if (this.customerName || this.customerCommittee || this.customerPhone || this.customerHotel) {
        return false
      } else {
        return true
      }
    },
    disabled: function () {
      if (this.customerName && (this.customerCommittee || this.customerHotel)) {
        return false
      } else if (!this.customerName && !this.customerCommittee && !this.customerPhone && !this.customerHotel) {
        return false
      } else {
        return true
      }
    }
  },
  mounted: function () {
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/souvenir/list')
      .then(function (response) {
        if (response.status === 200) {
          vm.souvenirList = response.data
          for (var i = 0; i < vm.souvenirList.length; i++) {
            vm.souvenirList[i].num = ''
            vm.souvenirList[i].total = 0
          }
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
    compute: function (index) {
      var id = this.souvenirList[index].id
      var name = this.souvenirList[index].name
      var num = this.souvenirList[index].num
      var price = this.souvenirList[index].price
      var stock = this.souvenirList[index].stock
      var available = this.souvenirList[index].available
      Vue.set(this.souvenirList, index, {
        id: id,
        name: name,
        num: num < 0 ? 0 : num,
        price: price,
        stock: stock,
        available: available,
        total: num <= 0 ? 0 : price * (num === '' ? 0 : num)
      })
    },
    submit: function () {
      for (var i = 0; i < this.souvenirList.length; i++) {
        this.orderList.push({id: this.souvenirList[i].id, name: this.souvenirList[i].name, num: this.souvenirList[i].num})
      }
      var date = new Date()
      this.orderInfo = JSON.stringify(this.orderList)
      Indicator.open()
      var vm = this
      var qs = require('qs')
      this.$http.post('https://souvenir.nkmun.cn/api/souvenir/sell', qs.stringify({
        orderInfo: this.orderInfo,
        orderTotal: this.total.toString(),
        customerName: this.customerName,
        customerCommittee: this.customerCommittee,
        customerHotel: this.customerHotel,
        customerPhone: this.customerPhone,
        orderTime: date.getTime(),
        operator: window.sessionStorage.getItem('user'),
        confirmed: this.confirmed,
        note: this.note
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
  .sale {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }

  .act-btn:disabled {
    opacity: 0.5;
  }

  .souvenir-group {
    margin: 5px 0;
  }

  .switch {
    margin: 10px 0;
  }

  .error {
    color: red;
  }
</style>
