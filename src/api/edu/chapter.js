import request from '@/utils/request'

export default {
  // 根据id获取章节和小节列表
  getAllChapterVideo(courseId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'get',
    })
  },

  // 添加章节
  addChapter(chapter) {
    return request({
      url: '/eduservice/edu-chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },

  // 通过id来获取章节
  getChapterById(chapterId) {
    return request({
      url: '/eduservice/edu-chapter/getChapterInfo/'+chapterId,
      method: 'get'
    })
  },

  // 修改章节
  updateChapter(chapter) {
    return request({
      url: '/eduservice/edu-chapter/updateChapter',
      method: 'put',
      data:chapter
    })
  },

  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: '/eduservice/edu-chapter/deleteChapterInfo/'+chapterId,
      method: 'delete'
    })
  }

}
