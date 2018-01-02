<template>
  <div class="overview">
    <mt-header fixed title="汇文纪念品销售系统">
      <mt-button slot="right" @click="logout">注销</mt-button>
    </mt-header>
    <mt-tab-container v-model="activeTab">
      <mt-tab-container-item id="souvenir">
        <mt-cell v-for="(item, index) in souvenirList" :key="index" :title="item.name" :to="'/productDetail/' + item.id" is-link :label="'剩余' + item.available + '个'">
        </mt-cell>
        <div class="btn-group">
          <mt-button class="act-btn" type="default" size="large" @click.native="add" v-if="role === 'admin'">增加纪念品</mt-button>
          <mt-button class="act-btn" type="primary" size="large" @click.native="sell">销售</mt-button>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="order">
        <mt-cell v-for="(item, index) in orderList" :key="index" :title="(item.id).toString()" :to="'/orderDetail/' + item.id" is-link :label="'总价' + item.order_total + '元'">
        </mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="preorder">
        <mt-cell v-for="(item, index) in preorderList" :key="index" :title="item.customer_name" :to="'/preorderDetail/' + item.id" is-link :label="'总价' + item.order_total + '元'">
          <span :class="{unconfirmed: !item.confirmed, confirmed: item.confirmed}">{{item.confirmed ? '已完成' : '未完成'}}</span>
        </mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="income">
        <mt-cell v-for="(item, index) in incomeList" :key="index" :title="item.date" :label="'总收入' + item.income + '元'">
        </mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
    <mt-tabbar v-model="selected" :swipeable="true">
      <mt-tab-item id="souvenir" @click.native="selectSouvenir">
        <img slot="icon" src="../assets/souvenir.png">
        纪念品
      </mt-tab-item>
      <mt-tab-item id="order" @click.native="selectOrder">
        <img slot="icon" src="../assets/order.png">
        订单
      </mt-tab-item>
      <mt-tab-item id="preorder" @click.native="selectPreorder">
        <img slot="icon" src="../assets/order.png">
        预订单
      </mt-tab-item>
      <mt-tab-item id="income" @click.native="selectIncome">
        <img slot="icon" src="../assets/income.png">
        收入
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
export default {
  name: 'overview',
  data () {
    return {
      souvenirList: [],
      orderList: [],
      incomeList: [],
      activeTab: 'souvenir',
      selected: 'souvenir'
    }
  },
  computed: {
    role: function () {
      return window.sessionStorage.getItem('role')
    },
    preorderList: function () {
      var list = []
      for (var i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].customer_name !== '') {
          list.push(this.orderList[i])
        }
      }
      return list
    }
  },
  mounted: function () {
    this.activeTab = (window.sessionStorage.getItem('activeTab') === null) ? 'souvenir' : window.sessionStorage.getItem('activeTab')
    this.selected = (window.sessionStorage.getItem('activeTab') === null) ? 'souvenir' : window.sessionStorage.getItem('activeTab')
    Indicator.open()
    var vm = this
    this.$http.get('https://souvenir.nkmun.cn/api/souvenir/list')
      .then(function (response) {
        if (response.data.code === 200 || !response.data.code) {
          vm.souvenirList = response.data
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
    this.$http.get('https://souvenir.nkmun.cn/api/order/list')
      .then(function (response) {
        if (response.data.code === 200 || !response.data.code) {
          vm.orderList = response.data
          vm.initIncomeList()
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
    selectSouvenir: function () {
      this.activeTab = 'souvenir'
      window.sessionStorage.setItem('activeTab', 'souvenir')
    },
    selectOrder: function () {
      this.activeTab = 'order'
      window.sessionStorage.setItem('activeTab', 'order')
    },
    selectPreorder: function () {
      this.activeTab = 'preorder'
      window.sessionStorage.setItem('activeTab', 'preorder')
    },
    selectIncome: function () {
      this.activeTab = 'income'
      window.sessionStorage.setItem('activeTab', 'income')
    },
    add: function () {
      this.$router.push('/add')
    },
    sell: function () {
      this.$router.push('/sale')
    },
    logout: function () {
      window.sessionStorage.removeItem('role')
      window.sessionStorage.removeItem('user')
      window.sessionStorage.removeItem('activeTab')
      this.$router.push('/login')
    },
    initIncomeList: function () {
      var timeBegin = new Date(this.orderList.length === 0 ? 0 : parseInt(this.orderList[0].order_time))
      var timeEnd = new Date(this.orderList.length === 0 ? 0 : parseInt(this.orderList[this.orderList.length - 1].order_time))
      var beginYear = timeBegin.getFullYear()
      var beginMonth = timeBegin.getMonth() + 1
      var beginDay = timeBegin.getDate()
      var endYear = timeEnd.getYear() + 1900
      var endMonth = timeEnd.getMonth() + 1
      var endDay = timeEnd.getDate()
      var date = new Date()
      date.setYear(beginYear)
      date.setMonth(beginMonth - 1)
      date.setDate(beginDay)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      timeBegin = Date.parse(date)
      date.setYear(endYear)
      date.setMonth(endMonth - 1)
      date.setDate(endDay)
      timeEnd = Date.parse(date)
      for (var i = 0; i <= ((timeEnd - timeBegin) / 86400000); i++) {
        var d = new Date(timeBegin + i * 86400000)
        this.incomeList.push({date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), income: 0})
        for (var j = 0; j < this.orderList.length; j++) {
          if (this.orderList[j].order_time > (timeBegin + i * 86400000) && this.orderList[j].order_time <= (timeBegin + (i + 1) * 86400000)) {
            this.incomeList[i].income = this.incomeList[i].income + parseInt(this.orderList[j].order_total)
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .overview {
    margin-top: 40px;
  }

  .btn-group {
    margin: 0 15px;
  }

  .act-btn {
    margin: 20px 0;
  }

  .unconfirmed {
    color: #ff6666;
  }

  .confirmed {
    color: #339933;
  }
</style>
