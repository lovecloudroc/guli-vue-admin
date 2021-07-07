<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-button type="text" @click="dialogChapterFormVisible=true">添加章节</el-button>
      </el-col>
    </el-row>

    <el-row>
      <ul class="chapterList">
        <li v-for="chapter in chapterVideoList" :key="chapter.id">
          <p>
            {{ chapter.title }}
            <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" style="" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
          </p>
          <!--  视频  -->

          <ul class="videoList">
            <li v-for="video in chapter.children" :key="video.id">
              <p>
                {{ video.title }}
                <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-from-item>
          <el-button @click="previous">上一步</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </el-from-item>
      </el-col>
    </el-row>

    <!--  添加修改章节表单 -->
    <el-dialog title="添加章节" :visible.sync="dialogChapterFormVisible">
      <el-form :model="chapter" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="章节标题">
              <el-input v-model="chapter.title" :label-width="formLabelWidth"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="章节排序">
              <el-input-number v-model="chapter.sort" :min="0" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReSet">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="课时标题">
              <el-input v-model="video.title"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="课时排序">
              <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="是否免费">
              <el-radio-group v-model="video.isFree">
                <el-radio :label="true">免费</el-radio>
                <el-radio :label="false">默认</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="上传视频">
              <!--  TODO -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="el-dialog__footer">
        <el-button @click="dialogVideoFormVisible = false">取消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '',
      chapterVideoList: [],
      chapter: {  // 封装章节数据
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: '',
        isFree: false
      },
      dialogChapterFormVisible: false, //章节弹框,
      dialogVideoFormVisible: false, // 小节弹窗（课时）
      formLabelWidth: '120px'
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
  methods: {
//====================================小节操作====================================
    // 打开小节弹窗方法
    openVideo(chapterId) {
      this.video =  {
         title: '',
          sort: '',
        isFree: false
      }
      // 弹框
      this.dialogVideoFormVisible = true
      // 设置章节id
      this.video.chapterId = chapterId
    },
    // 添加小节
    addVideo() {
      //  设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
      .then(response => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示信息
        this.$message({
          type:'success',
          message:'添加小节成功！'
        });
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 编辑小节信息
    editVideo(videoId) {
      // 打开小节信息弹窗
      this.dialogVideoFormVisible = true
      // 根据videoId查询小节信息
      video.getVideoById(videoId)
        .then(response => {
          this.video = response.data.eduVideo
        })
    },
    // 修改小节信息方法
    updateVideo(){
      video.updateVideo(this.video)
      .then(response => {
        // 关闭弹框
        this.dialogVideoFormVisible = false
        // 提示信息
        this.$message({
          type:'success',
          message:'修改小节成功！'
        });
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 修改或保存小节信息
    saveOrUpdateVideo() {
      if (!this.video.id){
        this.addVideo()
      }else{
        this.updateVideo()
      }
    },
    // 删除小节信息
    removeVideo(videoId){
      this.$confirm('此操作将删除小节，是否继续？', '提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {//  点击确认执行then方法
        // 调用删除api
        video.deleteVideo(videoId)
          .then(response => {
            // 删除成功后
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // 刷新页面
            this.getChapterVideo()
          })
      })
    },
//====================================章节操作====================================
    // 删除章节信息
    removeChapter(chapterId) {
      this.$confirm('此操作将删除章节，是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { //  点击确认执行then方法
        //调用删除方法
        chapter.deleteChapter(chapterId)
          .then(response => {
            // 删除成功后
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            // 刷新页面数据
            this.getChapterVideo()
          })
      })
    },
    // 根据课程id查询章节小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          if (response.data.allChapterVo) {
            this.chapterVideoList = response.data.allChapterVo
          }
        })
    },
    previous() {
      //  上一步
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      // 跳转到第二步骤
      this.$router.push({ path: '/course/publish/' + this.courseId })
    },
    dialogReSet() {
      // 关闭谈框
      this.dialogChapterFormVisible = false
      // 初始化chapter
      this.chapter = {
        title: '',
        sort: 0
      }
    },
    // 点击【编辑】信息查询并进行弹框显示
    editChapter(chapterId) {
      // 打开弹框
      this.dialogChapterFormVisible = true
      // 查询章节信息进返显
      chapter.getChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },
    // 添加章节信息
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭谈框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加章节成功！'

          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 修改章节信息
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭谈框
          this.dialogChapterFormVisible = false
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改章节成功！'
          })
          //修改成功后 清除一下chapter.id
          this.chapter = {
            title: '',
            sort: 0
          }
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 添加/修改章节信息
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    }
  }
}
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
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
