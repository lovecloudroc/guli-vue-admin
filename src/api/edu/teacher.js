import request from '@/utils/request'

export default {

  // 1、讲师列表（条件分页查询）
  // current当前页，limitm每页记录数，teacherQuery查询条件
  　getTeacherListPage(current,limit,teacherQuery) {
      return request({
        url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
        method: 'post',
        // teacherQuery条件对象，后端使用RequertBody获取数据
        // data表示把对象转换成json进行传递到接口里面
        data: teacherQuery
      })
   }
}
