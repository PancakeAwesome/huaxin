var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    content1:'',
    content2:'',
    content3:'',
    content4:'',
    isBomb:false,
    acId:null,
    userId:null,
    // 代表提交作业的类型,默认心探索
    homeworkType:3,
    focus1:true,
    focus2:false,
    focus3:false,
    focus4:false,
    isShowTip:false,
    alertText:'',
    // 弹窗的垂直属性
    // popTop:null,
  },
//   ##提交作业类型

// | 名称      | 常量值 |备注    |
// | :---:     | :---:  | :---:  |
// | 心学习 | 1      |        |
// | 心探索  | 2      |        |
// | 心学习、心探索皆可  | 3     |        |
  onLoad:function function_name(options) {
    // 获取参数
    // util.popReset(this,app)
    // console.log(this.data.popTop)
    this.setData({
      acId:options.acId,
      userId:app.globalData.userId,
      homeworkType:options.hwType
    })
    console.log(this.data.homeworkType)
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },
  // 弹窗js
  pop: function() {
    // 弹窗js
    // var that = this
    // that.setData({
    //   isBomb: true,
    //   disabled:true,
    // })
    
    wx.showToast({
      title:'请稍等～',
      icon:'loading',
      duration:1000,
      mask:true
    });

    var st = setTimeout(function () {
      wx.hideToast();

      // 判断是否内容全部填完
      if((this.data.content1 !== '') && (this.data.content2 !== '') && (this.data.content3 !== '') && (this.data.content4 !== '')){
        var that = this;
        wx.showModal({
          title: '提示',
          content: '确定提交吗？',
          success: function(res) {
            if (res.confirm) {
              that.pop2();
            } 
          }
        })
      }else{
        wx.showToast({
          title: '内容请填写完整！',
          icon: 'loading',
          duration: 1000
        })
      }
    }.bind(this),500);
  },

  pop2 : function function_name(argument) {
    // 提交作业
    var that = this
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/activityRecord/addHomeworkWithContent.do?userId='+app.globalData.userId+'&acId='+this.data.acId+'&homeworkType='+this.data.homeworkType,
      method:'POST',
      data:{
            "content1":this.data.content1,
            "content2":this.data.content2,
            "content3":this.data.content3,
            "content4":this.data.content4,
          },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        var data = res.data
        if(data.success){
          // 提交成功
          
          that.setData({
            isBomb:true,
            isBomb2:true,
            disabled:true,
          })

          setTimeout(function(){
            wx.redirectTo({
              url:'../action-detail/action-detail?acId='+that.data.acId
            })
          },1000)
        }else{
          util.alertShow(that,'提交失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'提交失败！')
      }
    })  
  },

  popConfirm: function (){
    this.pop2();
  },

  popCancle: function (){
    var that = this ;
    that.setData({
      isBomb: false,
      disabled:false,
    });
  },

  contentEvent1:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content1 : e.detail.value
    })
    console.log(that.data.content1)
  },

  contentEvent2:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content2 : e.detail.value
    })
    console.log(that.data.content2)
  },

  contentEvent3:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content3 : e.detail.value
    })
    console.log(that.data.content3)
  },

  contentEvent4:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content4 : e.detail.value
    })
    console.log(that.data.content4)
  },

  backToAc:function (argument) {
    // 返回上一页
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要放弃编辑吗？',
      success: function(res) {
        if (res.confirm) {
          wx.redirectTo({
            url:'../action-detail/action-detail?acId='+that.data.acId
          })
          // console.log('用户点击确定')
        } else if (res.cancel) {
          
          // console.log('用户点击取消')
        }
      }
    })
  },

  content_confirm1:function (argument) {
    // textarea点击完成
    this.setData({
      focus2:true
    })
  },

  content_confirm2:function (argument) {
    // textarea点击完成
    this.setData({
      focus3:true
    })
  },

  content_confirm3:function (argument) {
    // textarea点击完成
    this.setData({
      focus4:true
    })
  },

})
