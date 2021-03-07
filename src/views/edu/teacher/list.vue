<template>
  　 <div class="app-container">
        讲师列表
  <el-form :inline="true"  class="demo-form-inline">
    <el-form-item label="讲师名">
      <el-input v-model="teacherQuery.name" placeholder="讲师名"></el-input>
    </el-form-item>

    <el-form-item label="活动区域">
      <el-select v-model="teacherQuery.level" placeholder="讲师头衔">
        <el-option label="高级讲师" value="1"></el-option>
        <el-option label="首席讲师" value="2"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="添加时间">
      <el-date-picker
        v-model="teacherQuery.begin"
        type="datetime"
        placeholder="选择开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>

    <el-form-item label="结束时间">
      <el-date-picker
        v-model="teacherQuery.end"
        type="datetime"
        placeholder="选择截止时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default"  @click="resetData()">清空</el-button>
    </el-form-item>
  </el-form>
  <!-- 表格 -->
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="数据加载中"
    border
    fit
    highlight-current-row>
    <el-table-column
      label="序号"
      width="70"
      align="center">
      <template slot-scope="scope">
        {{ (page - 1) * limit + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" width="80" />
    <el-table-column label="头衔" width="80">
      <template slot-scope="scope">
        {{ scope.row.level===1?'高级讲师':'首席讲师' }}
      </template>
    </el-table-column>
    <el-table-column prop="intro" label="资历" />
    <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
    <el-table-column prop="sort" label="排序" width="60" />
    <el-table-column label="操作" width="200" align="center">
      <template slot-scope="scope">
        <router-link :to="'/edu/save/'+scope.row.id">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
        </router-link>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
    @size-change="getList"
    @current-change="getList"
    :current-page="page"
    :page-sizes="[limit, 2*limit, 3*limit, 4*limit]"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0;text-align: center;"
    layout="total, sizes, prev, pager, next, jumper"
    >
  </el-pagination>
</div>
</template>

<script>
// 引入调用teacher.js文件
import teacher from '@/api/edu/teacher'

export default {
  // 写核心代码的位置
  data(){ // 定义变量和初始值
    return{
      listLoading: true, // 是否显示loading信息
      list:null,  // 查询之后接口返回集合
      page:1, //当前页
      limit:10, //每页记录数
      total:0,  //总记录数
      teacherQuery:{} //条件封装对象
    }
  },
  created() { //页面渲染之前执行，调用methods中的方法
   this.getList()
  },
  methods:{ // 创建具体的方法，调用teacher.js中的方法
    // 讲师列表方法
    getList(page = 1){
      this.page = page;
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(response =>{
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空查询条件
    resetData(){
      this.teacherQuery = {}
      this.getList()
    },
    // 删除讲师的方法
    removeDataById(id){
        this.$confirm('此操作将永久删除该讲师记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调用删除讲师的方法
          teacher.deleteTeacherById(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 刷新讲师列表
          this.getList();
        })
    }
  }
}
</script>

<style>

</style>
