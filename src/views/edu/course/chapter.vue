<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{chapter.title}}
          <span class="acts">
            <el-button type="text">添加课时</el-button>
            <el-button type="text" style="">编辑</el-button>
            <el-button type="text">删除</el-button>
          </span>
        </p>
        <!--  视频  -->

        <ul class="videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{video.title}}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
              </span>
            </p>
          </li>
        </ul>

      </li>
    </ul>

    <el-form label-width="120px">
      <el-from-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-from-item>
    </el-form>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'

export default {
  data() {
    return {
      saveBtnDisabled:false,
      courseId: '',
      chapterVideoList: []
    }
  },
  created() {
    // 获取路由中id
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id

      // 根据课程id查询章节小节
      this.getChapterVideo()
    }
  },
  methods:{
    // 根据课程id查询章节小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList =  response.data.allChapterVo
        })
    },
    previous() {
      //  上一步
      this.$router.push({path:'/course/info/1'})
    },
    next() {
      // 跳转到第二步骤
      this.$router.push({path:'/course/publish/1'})
    }
  }
}
</script>

<style scoped>
.chapterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts{
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}


</style>
