<template>
    <v-container>
      <v-layout column wrap>
        <!-- 这一行放药品简要信息 -->
        <v-flex xs4 mb-5>
          <v-layout row wrap>
            <!-- 左边放图片 -->
            <v-flex xs4>
              <v-card flat>
                <v-img
                  :src="drug.thumb"
                  height="125"
                  class="grey darken-4"
                ></v-img>
              </v-card>
            </v-flex>
            <!-- 右边放文字 -->
            <v-flex xs8>
              <v-layout column wrap ml-5>
                <!-- 上面放名字 -->
                <v-flex xs4 ml-3>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-card flat>
                        中文名: {{drug.cname}}
                      </v-card>
                    </v-flex>
                    <v-flex xs6>
                      <v-card flat>英文名: {{drug.ename}}</v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-divider></v-divider>
                <!-- 中间放类型 -->
                <v-flex xs4 ml-3>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <v-card flat>医保类型: {{drug.drug_health_type}}</v-card>
                    </v-flex>
                    <v-flex xs4>
                      <v-card flat>处方类型: {{drug.drug_recipe_type}}</v-card>
                    </v-flex>
                    <v-flex xs4>
                      <v-card flat>药品类型: {{drug.drug_type}}</v-card>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-divider></v-divider>
                <!-- 下面放性状 -->
                <v-flex xs4>
                  <v-card flat>性状: {{drug.property}}</v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- 药品介绍 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >药品介绍</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3>
            <p>{{drug.introduction}}</p>
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 成分 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >成分</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.component">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 适应症 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >适应症</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.indication">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 规格 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >规格</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.medic_format">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 禁忌 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >禁忌</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.taboo">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 有效期 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >有效期</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3>
            <p>{{drug.ytime}}</p>
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 执行标准 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >执行标准</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3>
            <p>{{drug.mstandard}}</p>
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 用法用量 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >用法用量</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.dosage">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 不良反应 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >不良反应</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.adverseReactions">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 药品相互作用 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >药品相互作用</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.interactions">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      <!-- 注意事项 -->
        <v-layout column left>
          <v-flex xs1>
            <v-btn color="success" text >注意事项</v-btn>
          </v-flex>
          <v-flex xs1>
            <div pa-3 v-html="drug.notice">
          </div>
          </v-flex>
        </v-layout>
      <v-divider></v-divider>
      </v-layout>

      <v-dialog
        v-model="dialog"
        max-width="290">
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
  data () {
    return {
      id: 0,
      dialog: false,
      dialogHead: '',
      dialogInfo: '',
      drug: {}
    }
  },
  mounted () {
    // 获得订单的id
    this.id = this.$route.params.id
    // 发送请求
    this.axios.get('/api/v1/drugs/' + this.id).then(res => {
      if (res.data.code === 200) {
        this.drug = res.data.data.drug
        console.log(this.drug)
      } else {
        this.dialog = true
        this.dialogHead = '你还没有登录'
        this.dialogInfo = '获取数据失败'
      }
    }).catch(res => {
      this.dialog = true
      this.dialogHead = '你还没有登录'
      this.dialogInfo = '获取数据失败'
    })
  }
}
</script>
