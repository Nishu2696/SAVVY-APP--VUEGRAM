<template>
  <div id="dashboard">
    <transition name="fade">
      <CommentModal
        v-if="showCommentModal"
        :post="selectedPost"
        @close="toggleCommentModal()"
      ></CommentModal>
    </transition>
    <section>
      <div class="col1">
        <div class="profile">
          <span v-if="img1"
            ><img class="profilePic" :src="img1" width="30" height="30"
          /></span>
          <span class="name">{{ userProfile.name }}</span>
          <button @click="click1">Upload</button>
          <input
            type="file"
            ref="input1"
            style="display: none"
            @change="previewImage"
            accept="image/*"
          />
          <p>{{ userProfile.title }}</p>
          <div class="create-post">
            <p>create a post</p>
            <form @submit.prevent>
              <textarea v-model.trim="post.content"></textarea>
              <button
                @click="createPost()"
                :disabled="post.content === ''"
                class="button"
              >
                post
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col2">
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
            <h5>{{ post.userName }}</h5>
            <span>{{ post.createdOn }}</span>
            <p>{{ post.content }}</p>
            <ul>
              <li>
                <a @click="toggleCommentModal(post)"
                  >comments {{ post.comments }}</a
                >
              </li>
              <li>
                <a @click="likePost(post.id, post.likes)"
                  >likes {{ post.likes }}</a
                >
              </li>
              <li><a @click="viewPost(post)">view full post</a></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>
    </section>

    <!-- full post modal -->
    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">
        <div class="p-container">
          <a @click="closePostModal()" class="close">close</a>
          <div class="post">
            <h5>{{ fullPost.userName }}</h5>
            <span>{{ fullPost.createdOn }}</span>
            <!-- <span>{{ fullPost.createdOn | formatDate }}</span> -->
            <p>{{ fullPost.content }}</p>
            <ul>
              <li>
                <a>comments {{ fullPost.comments }}</a>
              </li>
              <li>
                <a>likes {{ fullPost.likes }}</a>
              </li>
            </ul>
          </div>
          <div v-show="postComments.length" class="comments">
            <div
              v-for="comment in postComments"
              :key="comment.id"
              class="comment"
            >
              <p>{{ comment.userName }}</p>
              <span>{{ comment.createdOn }}</span>
              <!-- <span>{{ comment.createdOn | formatDate }}</span> -->
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import CommentModal from "@/components/CommentModal";
import { commentsCollection } from "@/firebase";
import { db, AppDB } from "@/firebase";

export default {
  components: {
    CommentModal,
  },
  data() {
    return {
      post: {
        content: "",
      },
      showCommentModal: false,
      selectedPost: {},
      showPostModal: false,
      fullPost: {},
      postComments: [],
      img1: "",
      imageData: null,
    };
  },
  computed: {
    ...mapState(["userProfile", "posts"]),
  },
  methods: {
    click1() {
      alert("inside click");
      this.$refs.input1.click();
    },

    previewImage(event) {
      alert("inside preview image");
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },

    onUpload() {
      alert("inside on upload");
      this.img1 = null;
      const storageRef = db.ref(`${this.imageData.name}`).put(this.imageData);
      alert("line-no:154");
      storageRef.on(
        `state_changed`,
        (snapshot) => {
          this.uploadValue =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log("line-no: 161", error.message);
        },
        () => {
          this.uploadValue = 100;
          storageRef.snapshot.ref.getDownloadURL().then((url) => {
            this.img1 = url;
            console.log(this.img1);
            this.create();
          });
        }
      );
    },

    create() {
      const post = {
        photo: this.img1,
      };

      // db.ref("budget")
      AppDB.push(post)
        .then((response) => {
          alert("success");
          console.log(response);
        })
        .catch((err) => {
          alert("failed");
          console.log(err);
        });
    },

    createPost() {
      this.$store.dispatch("createPost", { content: this.post.content });
      this.post.content = "";
    },

    toggleCommentModal(post) {
      this.showCommentModal = !this.showCommentModal;
      // if opening modal set selectedPost, else clear
      if (this.showCommentModal) {
        this.selectedPost = post;
      } else {
        this.selectedPost = {};
      }
    },

    likePost(id, likesCount) {
      this.$store.dispatch("likePost", { id, likesCount });
    },

    async viewPost(post) {
      const docs = await commentsCollection
        .where("postId", "==", post.id)
        .get();
      docs.forEach((doc) => {
        let comment = doc.data();
        comment.id = doc.id;
        this.postComments.push(comment);
      });
      this.fullPost = post;
      this.showPostModal = true;
    },

    closePostModal() {
      this.postComments = [];
      this.showPostModal = false;
    },
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    },
  },
};
</script>

<style>
.name {
  font-size: 2ch;
  font-weight: bold;
}

.profilePic {
  border-radius: 90%;
}
</style>
