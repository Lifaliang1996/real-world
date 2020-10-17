<template>
  <div class="article-meta">
    <nuxt-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>

    <!-- 当前用户的文章 > 编辑文章 -->
    <nuxt-link
      v-if="isCurrent"
      class="btn btn-outline-secondary btn-sm"
      :to="{ name: 'editor', params: { slug: article.slug } }"
    >
      <i class="ion-edit"></i> Edit Article
    </nuxt-link>
    <!-- 非当前用户的文章 > 关注用户 -->
    <button
      v-else
      @click="postFollow"
      :disabled="followDisabled"
      :class="{ active: article.author.following }"
      class="btn btn-sm btn-outline-secondary action-btn"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{
        (article.author.following ? 'Unfollow ' : 'Follow ') +
          article.author.username
      }}
    </button>

    &nbsp;

    <!-- 当前用户的文章 > 删除文章 -->
    <button
      v-if="isCurrent"
      class="btn btn-outline-danger btn-sm"
      @click="postDeleteArticle"
    >
      <i class="ion-trash-a"></i> Delete Article
    </button>
    <!-- 非当前用户的文章 > 点赞文章 -->
    <button
      v-else
      class="btn btn-sm btn-outline-primary"
      :class="{ active: article.favorited }"
      :disabled="favoriteDisabled"
      @click="onFavorite"
    >
      <i class="ion-heart"></i>
      &nbsp; {{
        article.favorited ? 'Unfavorite Post' : 'Favorite Post'
      }}
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { deleteArticle, addFavorite, deleteFavorite } from '~/api/articles'
import { follow, unfollow } from '~/api/user'

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      followDisabled: false,
      favoriteDisabled: false
    }
  },
  computed: {
    // 是否是当前作者的文章
    isCurrent () {
      return this.article.author.username === this.$store.state.user.username
    }
  },
  methods: {
    // 删除文章
    postDeleteArticle () {
      deleteArticle(this.article.slug).then(() => {
        alert('删除成功')
        this.$router.push({
          name: 'profile',
          params: {
            username: this.article.author.username
          }
        })
      })
    },
    // 关注与取关
    postFollow () {
      this.followDisabled = true
      const following = this.article.author.following

      const handler = following ? unfollow : follow

      handler(this.username)
        .then(() => {
          this.article.author.following = !following
        })
        .finally(() => {
          this.followDisabled = false
        })
    },
    // 点赞与取消
    onFavorite () {
      // 禁用按钮
      this.favoriteDisabled = true

      let handler, count

      if (this.article.favorited) {
        // 取消点赞
        handler = deleteFavorite
        count = -1
      } else {
        // 添加点赞
        handler = addFavorite
        count = 1
      }

      handler(this.article.slug)
        .then(() => {
          this.article.favorited = !this.article.favorited
          this.article.favoritesCount += count
        })
        .finally(() => {
          this.favoriteDisabled = false
        })
    }
  }
}
</script>

<style scoped>
.article-meta .action-btn.active {
  color: #fff;
  background-color: #5cb85c;
  border-color: #5cb85c;
}
</style>
