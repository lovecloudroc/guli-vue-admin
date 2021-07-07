import request from '@/utils/request'

export default {

  // 添加小节
  addVideo(video) {
    return request({
      url: '/eduservice/video/addVideo',
      method: 'post',
      data: video
    })
  },
  // 通过id查询小节信息
  getVideoById(videoId) {
    return request({
      url: '/eduservice/video/getVideoById/'+videoId,
      method: 'get'
    })
  },
  // 修改小节信息
  updateVideo(video) {
    return request({
      url:'/eduservice/video/updateVideo',
      method:'put',
      data:video
    })
  },

  // 删除小节
  deleteVideo(id) {
    return request({
      url: '/eduservice/video/'+id,
      method: 'delete'
    })
  }

}
