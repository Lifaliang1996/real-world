<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comments :user="user" :slug='article.slug' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import { getArticle } from '~/api/articles'
import { mapState } from 'vuex'

import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'

export default {
  name: 'Article',
  async asyncData ({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data

    // 将 md 语法转化为 HTML
    const md = new MarkdownIt()
    article.body = md.render(article.body)

    return {
      article
    }
  },
  computed: {
    ...mapState(['user'])
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  components: {
    ArticleMeta,
    ArticleComments
  }
}
</script>

<style></style>
