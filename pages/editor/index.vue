<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  @keyup.enter="addTag"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                  >
                    <i @click="removeTag(index)" class="ion-close-round"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, updateArticle, getArticle } from '~/api/articles'

export default {
  middleware: 'not-logined',
  name: 'Editor',
  head () {
    return {
      title: 'Editor'
    }
  },
  data () {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      tag: ''
    }
  },
  computed: {
    slug () {
      return this.$route.params.slug
    }
  },
  created () {
    // 如果是修改文章，先获取原文
    if (this.slug) {
      getArticle(this.slug).then(res => {
        const { article } = res.data
        this.article.title = article.title
        this.article.description = article.description
        this.article.body = article.body
        this.article.tagList = article.tagList
      })
    }
  },
  methods: {
    addTag () {
      if (this.tag) {
        this.article.tagList.push(this.tag)
        this.tag = ''
      }
    },
    removeTag (index) {
      this.article.tagList.splice(index, 1)
    },
    onSubmit () {
      // 更新 或 修改
      const handler = this.slug ? updateArticle : createArticle

      handler(this.article, this.slug).then(res => {
        const { article } = res.data
        this.$router.push({
          name: 'article',
          params: {
            slug: article.slug
          }
        })
      })
    }
  }
}
</script>

<style></style>
