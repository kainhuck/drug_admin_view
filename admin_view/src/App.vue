<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" link  @click="routerTo(child.src)">
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link @click="routerTo(item.src)">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">医药管理</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon :link="true" to="/mlogin">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <!-- <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn :href="source" icon large target="_blank" v-on="on">
                <v-icon large>mdi-code-tags</v-icon>
              </v-btn>
            </template>
            <span>Source</span>
          </v-tooltip>
        </v-row>
      </v-container>-->
      <router-view></router-view>
    </v-main>
   <v-dialog
        v-model="dialog"
        max-width="290">
        <v-card>
          <v-card-title class="headline">退出登录</v-card-title>
          <v-card-text>
            你已经成功退出登录
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

  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      { icon: 'mdi-medical-bag', text: '药品进货', src: '/buyDrug' },
      { icon: 'mdi-bottle-tonic-plus', text: '查看库存', src: '/viewInvDrug' },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: '人员管理',
        model: true,
        children: [
          { icon: 'mdi-account', text: '经理', src: '/manager' },
          { icon: 'mdi-account', text: '员工', src: '/employees' },
          { icon: 'mdi-account', text: '顾客', src: '/customers' }
        ]
      },
      {
        icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: '历史订单',
        model: true,
        children: [
          { icon: 'mdi-playlist-plus', text: '进货订单', src: '/buyOrderList' },
          { icon: 'mdi-playlist-star', text: '销售订单', src: '/saleOrderList' }
        ]
      },
      { icon: 'mdi-database', text: '数据统计', src: '/showData' },
      { icon: 'mdi-account-plus', text: '员工注册', src: '/registerEmployee' }
    ]
  }),
  methods: {
    routerTo (src) {
      this.$router.push(src)
    },
    logout () {
      localStorage.removeItem('token')
      this.dialog = true
    }
  }
}
</script>
