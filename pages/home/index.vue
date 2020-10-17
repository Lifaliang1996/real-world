<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Real World</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  exact
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  exact
                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <a class="nav-link" :class="{ active: tab === 'tag' }" exact
                  >#{{ tag }}</a
                >
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <articles-list
            :articles="articles"
            :limit="limit"
            :total="total"
            :page="page"
            @page-change="pageChange"
          />
          <!-- /文章列表 -->
        </div>

        <!-- 标签 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <template v-for="tag in tags">
                <nuxt-link
                  :to="{ name: 'home', query: { tab: 'tag', tag } }"
                  :key="tag"
                  href=""
                  class="tag-pill tag-default"
                  >{{ tag }}</nuxt-link
                >
              </template>
            </div>
          </div>
        </div>
        <!-- /标签 -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles, getFeedArticles, getTags } from '@/api/articles'

import ArticlesList from '~/components/articles-list'

export default {
  name: 'HomeIndex',
  head () {
    return {
      title: 'Real World'
    }
  },
  data () {
    return {
      articles: [],
      total: 0,
      limit: 20,
      tags: [],
      tag: '',
      tab: ''
    }
  },

  async asyncData ({ query, store }) {
    try {
      const page = Number.parseInt(query.page || 1)
      const limit = 20
      const offset = (page - 1) * limit
      const tab = query.tab || 'global_feed'
      const tag = query.tag

      // 用户登录且请求关注文章 / 请求公共文章
      const getArticlesList =
        store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles

      const [articlesRes, tagsRes] = await Promise.all([
        getArticlesList({
          limit,
          offset,
          tag
        }),
        getTags()
      ])

      const { articles, articlesCount: total } = articlesRes.data
      // 添加点赞按钮是否禁用属性
      articles.forEach(article => (article.favoriteDisabled = false))

      const tags = tagsRes.data.tags

      return {
        articles,
        total,
        limit,
        tags,
        tag,
        tab
      }
    } catch (error) {}
  },

  watchQuery: ['page', 'tag', 'tab'],

  computed: {
    ...mapState(['user']),
    // 当前页码
    page: {
      get () {
        return Number.parseInt(this.$route.query.page) || 1
      },
      set (current) {
        this.$router.push({
          name: 'home',
          query: {
            tab: this.tab,
            tag: this.tag,
            page: current
          }
        })
      }
    }
  },

  methods: {
    pageChange (current) {
      this.page = current
    }
  },
  components: {
    ArticlesList
  }
}
</script>

<style></style>
