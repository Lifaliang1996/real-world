<template>
  <div>
    <form @submit.prevent="postComment" class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="commentBody"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button :disabled="!user || postDisabled" type="submit" class="btn btn-sm btn-primary">
          {{ user ? 'Post Comment' : 'Please Login' }}
        </button>
      </div>
    </form>

    <div>
      <div v-for="(comment, index) in comments" :key="comment.id" class="card">
        <div class="card-block">
          <p class="card-text">{{ comment.body }}</p>
        </div>
        <div class="card-footer">
          <nuxt-link
            :to="{
              name: 'profile',
              params: { username: comment.author.username }
            }"
            class="comment-author"
          >
            <img :src="comment.author.image" class="comment-author-img" />
          </nuxt-link>
          &nbsp;
          <nuxt-link
            :to="{
              name: 'profile',
              params: { username: comment.author.username }
            }"
            class="comment-author"
            >{{ comment.author.username }}</nuxt-link
          >
          <span class="date-posted">{{
            comment.createdAt | date('MMM DD, YYYY')
          }}</span>

          <!-- 删除评论按钮 -->
          <span
            v-if="user.username === comment.author.username"
            class="mod-options"
            @click="removeComment(comment.id, index)"
          >
            <i class="ion-trash-a"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments, deleteComment } from '~/api/articles'

export default {
  props: {
    slug: {
      type: String,
      required: true
    },
    // 当前登录用户
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      // 新增评论内容
      commentBody: '',
      postDisabled: false
    }
  },
  created () {
    getComments(this.slug).then(res => {
      const { comments } = res.data
      this.comments = comments
    })
  },
  methods: {
    // 提交评论
    postComment () {
      this.postDisabled = true
      addComments(this.slug, this.commentBody)
        .then(res => {
          this.commentBody = ''
          this.comments.unshift(res.data.comment)
        })
        .finally(() => {
          this.postDisabled = false
        })
    },
    removeComment (id, index) {
      addComments(this.slug, id)
        .then(() => {
          this.comments.splice(index, 1)
        })
    }
  }
}
</script>

<style></style>
