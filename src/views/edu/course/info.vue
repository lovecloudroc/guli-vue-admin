<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-col :span="12">
          <el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-col>
      </el-form-item>
      <!--  所属分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!--  课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placehoder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <el-col :span="16">
<!--          <el-input v-model="courseInfo.description" placeholder=""/>-->
          <tinymce :height="300" v-model = "courseInfo.description"/>
        </el-col>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/uploadFile'"
          class="avatar-uploader">
          <img :src="courseInfo.cover"  width="280" height="360" alt="">

        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="rirght" placeholder="免费课程请设置为0"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: {Tinymce},
  data() {
      return {
        saveBtnDisabled:false ,
        courseInfo:{
          title:'',
          subjectId:'', //二级分类id
          subjectParentId:'', // 一级分类id
          teacherId:'',
          lessonNum:'',
          description:'',
          cover:'https://cloudroc.oss-cn-beijing.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210519180442.png',
          price: 0
        },
        courseId:'',
        BASE_API: process.env.BASE_API, // 接口API地址
        teacherList: [],
        subjectOneList: [], // 一级分类
        subjectTwoList: [],// 二级分类
        imageLt: 3,
      }
  },
  created() {
    // 获取路由中的courseId
    if (this.$route.params  && this.$route.params.id){
      this.courseId = this.$route.params.id;
      // 调用根据课程id查询课程信息的方法
      this.getInfo();
    }
    // 初始化讲师
    this.getListTeacher()
    // 初始化一级分类
    this.getOneSubject()
  },
  methods:{
    // 获取课程信息根据课程id（进行回显）
    getInfo() {
      course.getCourseInfoByid(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfoVo
        })
    },
    // 上传封面之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 3

      if (!isJPG) {
        this.$message.error('上传封面图片只能是 JPG 格式')
      }
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 "+this.imageLt+"MB")
      }
      return isJPG && isLt2M
    },

    // 上传封面成功后调用的方法
    handleAvatarSuccess(res,file) {
      this.courseInfo.cover = res.data.url
    },
    // 点击某个一级分类，出发change，显示对应的二级分类
    subjectLevelOneChanged(value) {
      // value就是一级分类的ID
      // 遍历所有的分类
      for (let i = 0 ;i < this.subjectOneList.length ;i++){
        let oneSubject = this.subjectOneList[i];
        if (value === oneSubject.id){
          // 从一级分类中获取所有二级分类
          this.subjectTwoList = oneSubject.children
          // 将二级分类id值清空一下
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 查询所有一级分类
    getOneSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    },
    // 查询所有讲师
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    saveOrUpdate() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '添加课程信息成功！'
          });
          // 跳转到第二步骤
          this.$router.push({path:'/course/chapter/'+ response.data.courseId})
        })

      }
  }
}
</script>

<style scoped>

</style>
