var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isBomb: false,
    array: ['人际交往', '个人成长', '恋爱情感', '家庭关系', '情绪压力', '职业规划', '性心理', '其他'],
   // 数组的下标
   index: 0,
   // 是否匿名
   anonymous:true,
   quType:1,
   content:null,
   quId:null,
   // 字数统计
   text_number:0,
   isShowTip:false,
   alertText:'',
  }, 
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },
  // pricker发生变化
//   ##线下活动

// | 名称      | 常量值 |备注    |
// | :---:     | :---:  | :---:  |
// | 沙盘疗法体验  | 1      |        |3
// | 园艺心理体验  | 2      |        |3
// | 艺术心理体验  | 3      |        |3
// | 中心回访体验  | 4      |        |
// | 脑图像技术体验 | 5      |        |
// | 催眠体验  | 6      |        |
// | 脑波音乐    | 7      |        |
// | 减压绘画体验      | 8      |        |
// | 放松训练项目      | 9      |        |3
// | 心微课  | 21      |        |
// | 心理学讲座  | 22      |        |
// | 心理学课程  | 23      |        |
// | 团体心理辅导  | 24      |        |
// | 心理志愿服务  | 31      |        |
// | 525心理健康节  | 32      |        |
// | 920新生心理健康节    | 33      |        |
// | 心理辅导站活动      | 34      |        |
// | 心理社团活动   | 35      |        |
// | 沙河心韵  | 41      |        |
// | 一心一语  | 42      |        |
// | 成长吧  | 43     |        |
// | XY老师的心理沙龙    | 44      |        |
// | 成长导师      | 45      |        |
// | 心理测评      | 51      |        |
// 问题类型选择器
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      quType: parseInt(e.detail.value)+1,
      index:e.detail.value
    })
    console.log(this.data.quType)
  },
  // 弹窗js
  pop: function() {
    // 弹窗js
    // var that = this
    // that.setData({
    //   isBomb: true,
    // })
    var that = this
    console.log(this.data.text_number)
    if(this.data.text_number < 40 ){
      // 输入内容不符合要求
      wx.showToast({
        title: '请输入不少于40字的内容！',
        icon: 'loading',
        duration: 10000
      })

      setTimeout(function(){
        wx.hideToast()
      },1000)
    }else{
      wx.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: function(res) {
          if (res.confirm) {
            that.pop2()
            // console.log('用户点击确定')
          } else if (res.cancel) {
            
            // console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  pop2 : function function_name(argument) {
      // 确认提交
    var that = this ;

    // 提交问题
    var userId = app.globalData.userId
    console.log(userId)
    var that = this;
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/addQuestion.do',
      method:'POST',
      data:{
            "content":this.data.content,
            "quType":this.data.quType,
            "anonymous":this.data.anonymous,
            "userId":userId
          },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        var data = res.data
        if(data.success){
          // 如果获取成功
          // that.setData({
          //   isBomb:true,
          //   isBomb2: true
          // });
          wx.showToast({
            title: '问题提交成功',
            icon: 'success',
            duration: 10000
          })

          setTimeout(function(){
            wx.hideToast()
            wx.navigateTo({
              url: '../index/index'
            });
          },1000)
    
        }else{
          util.alertShow(that,data.error)
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,res.data.error)
      }
    }) 

  },

  popConfirm: function (){
    this.pop2();
  },

  popCancle: function (){
    var that = this ;
    that.setData({
      isBomb: false
    });
  },
  // 匿名改变
  switch1Change: function (e){
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var title = null
    var anonymous = null
    if(e.detail.value){
      // 开启匿名
      title = '已开启匿名'
      anonymous = true
    }else{
      title = '已关闭匿名'
      anonymous = false
    }
    this.setData({
      anonymous:anonymous
    })
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 10000
    })

    setTimeout(function(){
      wx.hideToast()
    },1000)
  },

  contentEvent:function(e){
    // 问题内容输入的操作
    this.setData({
      content : e.detail.value,
    })
  },

  textInput:function (e) {
    // 统计输入字数
    this.setData({
      text_number:e.detail.value.length
    })

  },
})
