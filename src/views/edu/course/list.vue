<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="课程名称">
            <el-input
              v-model="courseQuery.title"
              placeholder="课程名称"
              clearable
              size="small"
              style="width: 240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="课程状态">
            <el-select
              v-model="courseQuery.status"
              clearable
              placeholder="课程状态"
              size="small"
              style="width: 240px">
              <el-option value="Normal" label="已发布"/>
              <el-option value="Draft" label="未发布"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="添加时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()">搜索</el-button>
        <el-button type="default" icon="el-icon-refresh" size="mini" @click="resetData()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>课程信息列表</span>
        <!--        <el-button style="float: right; padding: 3px 0" type="text" @click="addTeacherInfo()">添加讲师</el-button>-->
      </div>
      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        v-loading="listLoading"
        element-loading-text="数据加载中">

        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="title" label="课程名称" width="180"/>

        <el-table-column label="课程状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
          </template>
        </el-table-column>

        <el-table-column prop="lessonNum" label="课时数"/>

        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

        <el-table-column prop="viewCount" label="浏览数量" width="60"/>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/teacher/edit/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
            </router-link>
            <router-link :to="'/teacher/edit/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲息</el-button>
            </router-link>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

  </div>
</template>
<script>
//引入调用teacher.js文件
import course from '../../../api/edu/course'

export default {
  //写核心代码位置
  // data:{
  // },
  data() { //定义变量和初始值
    return {
      list: null,//查询之后接口返回集合
      page: 1,//当前页
      limit: 10,//每页记录数
      total: 0,//总记录数
      courseQuery: {}, //条件封装对象
      listLoading: true, // 是否显示loading信息
      // 日期范围
      dateRange: []
    }
  },
  created() { //页面渲染之前执行，一般调用methods定义的方法
    //调用
    this.getList()
  },
  methods: {  //创建具体的方法，调用teacher.js定义的方法
    //讲师列表的方法
    getList(page = 1) {
      this.page = page;
      this.courseQuery.begin = this.dateRange[0];
      this.courseQuery.end = this.dateRange[1];
      course.getPageCourseByCondition(page,this.limit,this.courseQuery)
      .then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
      .catch(error => {
        console.log(error)
      })
    },
    resetData() {//清空的方法
      //表单输入项数据清空
      this.courseQuery = {}
      //查询所有讲师数据
      this.getList()
    }
  }
}
</script>
