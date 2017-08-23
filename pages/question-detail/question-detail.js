var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    isShow:false,
    // qu:null,
    voicePath:null,
    quId:null,
    userId:null,
    isLiked:false,
    e:null,
    qus:null,
    // 问题创建时间
    quCreatedTimeFn:null,
    // 是否有语音正在播放
    isVoicePlaying:false,
    // 语音变量
    preIndex:null,
    // 定时器id
    st:null,
    pageSize:20,
    pageNum:1,
    // 回复列表
    replies:null,
    remark:'',
    isShowTip:false,
    alertText:'',
    userName:'',
    userPic:''
  },
  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },
  onLoad: function(options) { 
    var that = this;
    var quId = options.quId;
    var userId = app.globalData.userId;

    that.setData({
      userId:userId,
      quId:quId,
      userPic:app.globalData.userInfo.avatarUrl,
      userName:app.globalData.userInfo.nickName
    });
    // 获取回复列表
    function getReplies(that){
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/reply/getQuestionReplies.do?pageSize='+that.data.pageSize+'&pageNum='+that.data.pageNum+'&quId='+quId,
        method:'GET',
        header: {
            'Authorization': 'Bearer '+app.globalData.token
        },
        success: function(res) {
          // 提交问题成功
          var data = res.data;
          if(data.success){
            // 如果获取成功
            var replies = data.value.list;
            console.log(replies);
            for (var i = replies.length - 1; i >= 0; i--) {
              replies[i].createdTimeFn = util.difTimeInOD(replies[i].createdTime)
            }
            that.setData({
              replies:replies,
              isShow:true,
            });
          }else{
            util.alertShow(that,'获取回复列表失败！')
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,'获取回复列表失败！')
        }
      });
    }

    wx.request({
      url: 'https://www.huaxinapp.xyz/api/qa/getQAClientVO.do?quId='+quId+'&userId='+userId,
      method:'GET',
      header: {
          'Authorization': 'Bearer '+app.globalData.token
      },
      success: function(res) {
        // 提交问题成功
        var data = res.data;
        if(data.success){
          // 如果获取成功
          var qus = [data.value]
          console.log(qus)
          var quCreatedTimeFn = util.difTimeInOD(data.value.quCreatedTime)
          if(qus[0].anVoiceDuration != null){
            qus[0].anVoiceDurationFm = util.voiceDuration(qus[0].anVoiceDuration)
          }
          that.setData({
            qus:qus,
            voicePath:data.value.anVoice,
            quCreatedTimeFn:quCreatedTimeFn,
          });

          getReplies(that);
        }else{
          util.alertShow(that,'获取问题列表失败！')
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'获取问题列表失败！')
      }
    });

    // 定时渲染
    var st = setInterval(function (){
      getReplies(that);
    },10000);

    this.setData({
      st:st
    });
  },

  // 点赞事件
  liking: function (e) {
    // 判断登陆
    util.liking(e,this,app)
    
  },
  // 取消点赞事件
  unLiking: function (e) {
    util.unLiking(e,this,app)
  },

  voiceEvent: function (e) {
    // 播放语音接口
    util.voiceEvent(e,this,app)
  },

  remark_ip:function remark_ip (e) {
    this.setData({
      remark:e.detail.value
    });
  },

  blur_ip:function blur_ip () {
    // 输入框失去焦点时收起键盘
    wx.hideKeyboard();
  },

  submit_reply:function submit_reply() {
    var that = this;

    wx.showToast({
      icon:'loading',
      duration: 10000
    });
    // 回复问题
    wx.request({
      url: 'https://www.huaxinapp.xyz/api/reply/addReply.do',
      method:'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer '+app.globalData.token
      },
      data:{
        quId:that.data.quId,
        userId:that.data.userId,
        content:that.data.remark
      },
      success: function(res) {
        // 提交回复成功
        var data = res.data;

        if(data.success){
          // 如果提交成功
          // 手动添加一条回复
          var replies = that.data.replies;
          var reply = {
            content: that.data.remark,
            createdTimeFn:'0分钟',
            userNickName:that.data.userName,
            userPic:that.data.userPic
          };
          replies.unshift(reply);
          that.setData({
            replies:replies,
            remark:''
          });

          wx.hideToast();
          wx.showToast({
            title: '提交成功！',
            icon:'success',
            duration: 10000
          });

          setTimeout(function(){
            wx.hideToast();
          },1000);

        }else{
          util.alertShow(that,'提交回复失败！');
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'提交回复失败！');
      }
    });
  },

  // 取消定时器
  onUnload:function () {
    clearInterval(this.data.st);
  }
})
