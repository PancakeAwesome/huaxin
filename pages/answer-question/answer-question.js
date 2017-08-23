var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isVoiceReStart:true,
    isVoiceStart:false,
    isVoiceStop:false,
    // 警告窗口
    isShowTip:false,
    alertText:'',
    isBomb:false,
    voiceFilePath:'',
    // 用户id
    userId:'',
    // 问题id
    quId:'',
    qu:null,
    content:null,
    quCreatedTimeFn:null,
    isShow:false,
    recordDuration:0,
    timer:null,
    voiceDuration:0,
    isShowTip:false,
    alertText:'',
  },
  onLoad:function function_name(options) {
    // 获得问题详情
    var that = this
    var quId = options.quId
    // var quId = "0c70ef18041c437c82e1292f7430804e"
    var userId = app.globalData.userId
    // var userId = '08EA55C27A0E8C34D45D30FA333DD462'
    that.setData({
      userId:userId,
      quId:quId
    })
    console.log(userId)

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/getQAClientVO.do?quId='+quId+'&userId='+userId,
      method:'GET',
      header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
      success: function(res) {
        var data = res.data;
        if(data.success){
          // 如果获取成功
          console.log(data.value)
          var quCreatedTimeFn = util.difTimeInOD(data.value.quCreatedTime)
          
          that.setData({
            qu:data.value,
            isShow:true,
            quCreatedTimeFn:quCreatedTimeFn,
          });
        }else{
          util.alertShow(that,'调用失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'调用失败！')
      }
    })
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },

  recordStart: function function_name(argument) {
    // 开始录音
    var that = this;

    that.setData({
      isVoiceReStart:false,
      isVoiceStart:true,
      isVoiceStop:false,
    });

    var timer = setInterval(function() {
      var v = that.data.recordDuration
      if (v < 180 * 1000) {
        
        v = v + 1
        that.setData({
          recordDuration: v
        })

      }else{
        return
      }
    }, 1000);

    this.setData({
      timer:timer
    })

    wx.startRecord({
      success: function(res) {
        // 文件的临时路径
        var tempFilePath = res.tempFilePath 
        that.setData({
          // 临时存储录音文件
          voiceFilePath:tempFilePath
        });
        console.log(tempFilePath)
        util.alertShow(that,'录音成功！');
      },
      fail: function(res) {
         //录音失败
         util.alertShow(that,'录音失败！');
      }
    })
  },

  recordStop: function (argument) {
    this.setData({
      isVoiceReStart:false,
      isVoiceStart:false,
      isVoiceStop:true
    });
    // 停止录音
    wx.stopRecord();
    this.setData({
      voiceDuration:this.data.recordDuration,
      recordDuration:0
    })
    clearInterval(this.data.timer)
  },

  recordRestart: function function_name(argument) {
    // 重新录音
    var that = this;

    this.setData({
      isVoiceReStart:false,
      isVoiceStart:true,
      isVoiceStop:false,
    });

    var timer = setInterval(function() {
      var v = that.data.recordDuration
      if (v < 180 * 1000) {
        
        v = v + 1
        that.setData({
          recordDuration: v
        })

      }else{
        return
      }
    }, 1000);

    this.setData({
      timer:timer
    })
    
    wx.startRecord({
      success: function(res) {
        // 文件的临时路径
        var tempFilePath = res.tempFilePath 
        // 调用上传录音文件接口
        that.setData({
          // 临时存储录音文件
          voiceFilePath:tempFilePath
        });
        util.alertShow(that,'录音成功！');
      },
      fail: function(res) {
         //录音失败
         util.alertShow(that,'录音失败！');
      }
    })
  },

  // 弹窗js
  pop: function() {
    // 弹窗js
    var that = this
    // that.setData({
    //   isBomb: true
    // })
    wx.showModal({
      title: '提示',
      content: '确定提交吗？',
      success: function(res) {
        if (res.confirm) {
          that.popConfirm()
          // console.log('用户点击确定')
        } else if (res.cancel) {
          
          // console.log('用户点击取消')
        }
      }
    })
  },

  popConfirm: function (){
    // 回答问题
    var userId = this.data.userId
    var that = this
    console.log(userId)
    wx.uploadFile({
      url: 'https://www.huaxinapp.xyz/api/upload/upload.do?dir=audio',
      filePath: this.data.voiceFilePath,
      name: 'file',
      header: {
        'Authorization': 'Bearer '+app.globalData.token,
        'content-type': 'multipart/form-data'   
      },
      success: function(res){
        // 成功获取活动列表
        var data = JSON.parse(res.data)
        console.log(data)
        if(data.isSuccess){
          console.log(data.param.fid)
          wx.request({
            url: 'https://www.huaxinapp.xyz/api/qa/addAnswer.do?quId='+that.data.quId, 
            method:'POST',
            data: {
              "anVoice":data.param.fid[0],
              "userId":userId,
              "content":that.data.content,
              "voiceDuration":that.data.voiceDuration
            },
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer '+app.globalData.token
              // 'Authorization': 'Bearer '+'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIwOEVBNTVDMjdBMEU4QzM0RDQ1RDMwRkEzMzNERDQ2MiIsImlhdCI6MTQ5MDY4NDAwNywic3ViIjoiY2xpZW50IiwiZXhwIjoxNDk2NzMyMDA3fQ.k1zx-HAYdNn6uOsLVZwqrfiQRMeJfvbvkK4uSFy18pQ'
            },
            success: function(res) {
              if(res.data.success){
                // 提交问题成功
                wx.showToast({
                  title: '回答提交成功',
                  icon: 'success',
                  duration: 10000
                })

                setTimeout(function(){
                  wx.hideToast()
                  wx.redirectTo({
                    url:'../index/index'
                  })
                },3000)
              }else{
                that.setData({
                  isBomb:false
                })

                wx.showToast({
                  title: '回答提交失败',
                  icon: 'loading',
                  duration: 10000
                })
                util.alertShow(that,res.error)
                setTimeout(function(){
                  wx.hideToast()
                },1000)
                
              }
              
            }
          })
        }else{
          util.alertShow(that,'上传图片失败！')
        }
      }
    })
    
  },

  popCancle: function (){
    var that = this ;
    that.setData({
      isBomb: false
    });
  },
  contentEvent:function(e){
    // 问题内容输入的操作
    var that = this
    that.setData({
      content : e.detail.value
    })
  },

  mask_cancle:function function_name(argument) {
    this.setData({
      isBomb:false,
    })
  },


})
