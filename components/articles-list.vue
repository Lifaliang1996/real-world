<template>
  <div>
    <!-- 文章 -->
    <template v-for="article in articles">
      <div :key="article.slug" class="article-preview">
        <div class="article-meta">
          <nuxt-link
            :to="{
              name: 'profile',
              params: { username: article.author.username }
            }"
          >
            <img :src="article.author.image"
          /></nuxt-link>
          <div class="info">
            <nuxt-link
              :to="{
                name: 'profile',
                params: { username: article.author.username }
              }"
              class="author"
              >{{ article.author.username }}</nuxt-link
            >
            <span class="date" :title="article.createdAt | date('YYYY/MM/DD')"
              >{{ article.createdAt | date('MMM DD, YYYY') }}
            </span>
          </div>
          <button
            :class="{ active: article.favorited }"
            class="btn btn-outline-primary btn-sm pull-xs-right"
            :disabled="article.favoriteDisabled"
            @click="onFavorite(article)"
          >
            <i class="ion-heart"></i> {{ article.favoritesCount }}
          </button>
        </div>
        <nuxt-link
          :to="{ name: 'article', params: { slug: article.slug } }"
          class="preview-link"
        >
          <h1>{{ article.title }}</h1>
          <p>{{ article.description }}</p>
          <span>Read more...</span>
        </nuxt-link>
      </div>
    </template>
    <!-- /文章 -->

    <!-- 页码 -->
    <el-pagination
      hide-on-single-page
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="limit"
      @current-change="pageChange"
    >
    </el-pagination>
    <!-- /页码 -->
  </div>
</template>

<script>
import { addFavorite, deleteFavorite } from '@/api/articles'

export default {
  props: {
    articles: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      default () {
        return 20
      }
    },
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  },

  methods: {
    pageChange (current) {
      this.$emit('page-change', current)
    },
    // 点赞与取消
    onFavorite (article) {
      // 禁用按钮
      article.favoriteDisabled = true

      let handler, count

      if (article.favorited) {
        // 取消点赞
        handler = deleteFavorite
        count = -1
      } else {
        // 添加点赞
        handler = addFavorite
        count = 1
      }

      handler(article.slug)
        .then(() => {
          article.favorited = !article.favorited
          article.favoritesCount += count
        })
        .finally(() => {
          article.favoriteDisabled = false
        })
    }
  }
}
</script>

<style>
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #5cb85c;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #5cb85c;
  color: #fff;
}
</style>
