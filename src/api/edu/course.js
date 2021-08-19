import request from '@/utils/request'
export default {
  // 添加课程信息
  addCourseInfo(courseInfo) {
      return request({
        url: 'eduservice/course/addCourseInfo',
        method: 'post',
        data:courseInfo
      })
  },
  // 查询所有讲师
  getListTeacher() {
    return request({
      url: 'eduservice/teacher/findAll',
      method: 'get'
    })
  },

  // 根据课程id查询课程基本信息
  getCourseInfoByid(courseId) {
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method:'get'
    })
  },

  // 根据课程id查询课程基本信息
  updateCourseInfoByid(courseInfo) {
    return request({
      url: `/eduservice/course/updateCourseInfo`,
      method:'post',
      data:courseInfo
    })
  },
  // 根据课程id查询课程发布信息
  getPublishCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  // 课程最终发布
  publishCourseInfo(courseId) {
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: 'post'
    })
  },
  getListCourse(){
    return request({
      url:'/eduservice/course/getCourseList',
      method:'get'
    })
  },
  getPageCourseByCondition(current,limit,courseQuery){
    return request({
      url:`/eduservice/course/pageCourseCondition/${current}/${limit}`,
      method:'post',
      data:courseQuery
    })
  }
}
