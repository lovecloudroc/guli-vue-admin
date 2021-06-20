<template>
  <div class="app-container">
    讲师添加
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头像缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          更换头像
        </el-button>
      <!--
        v-show：是否显示上传组件
        :key 类似于id，如果一个页面的多个图片上传控件，可以作区分
        :url 后台上传的url地址
        @close 关闭上传组件
        @crop-upload-success 上传成功和后的回调
      -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecroppperKey"
          :url="BASE_API+'/eduoss/uploadFile'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper,PanThumb },
  data(){
    return{
      teacher:{
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: '',
      },
      imagecropperShow:false, // 上传头像的弹框是否显示
      imagecroppperKey:0,    // 上传头像框的默认标识key
      BASE_API:process.env.BASE_API, // 获取dev.env.js里面的地址
      saveBtnDisabled:false // 保存按钮是禁用状态
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(to, from){
      this.init()
    }
  },
  methods:{
    // 关闭上传弹框的方法
    close() {
      this.imagecropperShow = false
      // 上传组件初始化
      this.imagecroppperKey = this.imagecroppperKey+1
    },
    // 头像上传成功的方法
    cropSuccess(data) {
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      // 上传组件初始化
      this.imagecroppperKey = this.imagecroppperKey+1

    },
    init() {
      // 判断路径中是否有id值
      if (this.$route.params && this.$route.params.id){
        const id = this.$route.params.id
        // 调用根据id查询讲师的方法
        this.getTeacherInfo(id)
      }else {
        this.teacher = {}
      }
    },
    getTeacherInfo(id) {
      teacher.getTeacherInfoById(id)
      .then(response => {
        this.teacher  = response.data.teacher
      })
    },
    saveOrUpdate() {
      // 判断保存和修改操作，根据teacher中id来判断
      if(!this.teacher.id){
        this.addTeacher();
      }else{
        this.updateTeacher()
      }
    },
    addTeacher() {
      teacher.addTeacher(this.teacher)
      .then(response => {
        this.$message({
          type:'success',
          message:'添加成功！'
        })
      })
      // 返回教师列表 路由跳转
      this.$router.push({path:'/edu/table'})
    },
    updateTeacher() {
      teacher.updateTeacher(this.teacher)
      .then(response => {
        // 提示信息
        this.$message({
          type:'success',
          message:'修改成功！'
        })
      });
      // 路由跳转 返回列表界面
      this.$router.push({path:'/edu/table'})
    }
  }
}
</script>

<style>

</style>
