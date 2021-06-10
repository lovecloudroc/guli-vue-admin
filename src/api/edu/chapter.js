import request from '@/utils/request'

export default {
  // 根据id获取章节和小节列表
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduservice/edu-chapter/${courseId}`,
      method: 'get',
    })
  }
}
