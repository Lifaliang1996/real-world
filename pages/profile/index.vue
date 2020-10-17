<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio || 'Nothing...' }}</p>

            <!-- 设置个人信息 -->
            <nuxt-link v-if="user.username === username" to="/settings">
              <button class="btn btn-sm btn-outline-secondary action-btn">
                <i class="ion-gear-a"></i>
                Edit Profile
              </button>
            </nuxt-link>
            <!-- 关注按钮 -->
            <button
              v-else
              @click="postFollow"
              :disabled="followDisabled"
              :class="{ active: profile.following }"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{
                (profile.following ? 'Unfollow ' : 'Follow ') + profile.username
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  @click="changeTab('author')"
                  :class="{ active: tab === 'author' }"
                  class="nav-link "
                  style="cursor: pointer;"
                  >My Articles</a
                >
              </li>
              <li class="nav-item">
                <a
                  @click="changeTab('favorited')"
                  :class="{ active: tab === 'favorited' }"
                  class="nav-link"
                  style="cursor: pointer;"
                  >Favorited Articles</a
                >
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <template v-if="articles">
            <articles-list
              :articles="articles"
              :limit="limit"
              :total="total"
              :page="page"
              @page-change="pageChange"
            />
          </template>
          <span v-else>Nothing</span>
          <!-- /文章列表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, follow, unfollow } from '~/api/user'
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'

import ArticlesList from '~/components/articles-list'

export default {
  middleware: 'not-logined',
  name: 'Profile',
  head () {
    return {
      title: 'Profile'
    }
  },
  data () {
    return {
      profile: {},
      articles: [],
      total: 0,
      limit: 20,
      tab: 'author',
      page: 1,
      followDisabled: false
    }
  },
  watchQuery: ['page', 'tab'],

  computed: {
    ...mapState(['user']),
    // 用户名
    username () {
      return this.$route.params.username
    }
  },

  created () {
    if (this.user.username === this.username) {
      this.profile = this.user
    } else {
      // 获取其他用户信息
      getProfile(this.username).then(res => {
        const { data } = res
        this.profile = data.profile
      })
    }

    // 获取文章列表
    this.getArticlesList()
  },

  watch: {
    tab () {
      this.articles = []
      this.getArticlesList()
    },
    page () {
      this.articles = []
      this.getArticlesList()
    }
  },

  methods: {
    pageChange (current) {
      this.page = current
    },

    changeTab (newTab) {
      if (this.tab !== newTab) this.tab = newTab
    },

    // 获取用户 发布/点赞 文章
    getArticlesList () {
      const offset = (this.page - 1) * this.limit

      getArticles({
        limit: this.limit,
        [this.tab]: this.username,
        offset
      }).then(res => {
        const { articles } = res.data
        articles.forEach(article => (article.favoriteDisabled = false))
        this.articles = articles
      })
    },

    // 关注与取关
    postFollow () {
      this.followDisabled = true

      const handler = this.profile.following ? unfollow : follow

      handler(this.username)
        .then(res => {
          this.profile = res.data.profile
        })
        .finally(() => {
          this.followDisabled = false
        })
    }
  },
  components: {
    ArticlesList
  }
}
</script>

<style scoped>
.profile-page .user-info .action-btn.active {
  color: #fff;
  background-color: #5cb85c;
  border-color: #5cb85c;
}
</style>
