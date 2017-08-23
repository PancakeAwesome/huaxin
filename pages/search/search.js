var util = require('../../utils/util.js');
var app =getApp()
Page({
  data:{
    isShow:true,
    keyIp:null,
    focus:true,
    startTimeFm:null,
    userId:null,
    acs:null,
    qus:null,
    acShow:true,
    quShow:false,
    // 定义搜索历史数组
    scHs:new Array(),
    keyIpIsNull:true,
    isHsShow:true,
    acTypeShow:'0',
    // 搜索错误
    isError:false,
    pageSize:20,
    pageNum:1,
    isAcNotFound:false,
    isQuNotFound:false,
    isAcDfShow:null,
    isQuDfShow:null,
    scByHs:null,
    e:null,
    // 是否有语音正在播放
    isVoicePlaying:false,
    // 语音变量
    preIndex:null,
    // 定时器id
    st:null,
    isShowTip:false,
    alertText:'',
  },

  onLoad:function function_name(options) {
    // 检查搜索关键字
    // var keyIp = options.keyIp
    var scHs = wx.getStorageSync('scHs')
    if(scHs.length == 0){
      // 搜索历史为空
      this.setData({
        isHsShow:false
      })
      var arr = []
      wx.setStorageSync('scHs',arr)
    }

    this.setData({
      userId:app.globalData.userId,
      scHs:scHs,
    })
    
  },

  // 下拉刷新
  onPullDownRefresh: function(){
    var typeShow = this.data.acTypeShow
    var that = this
    this.setData({
      pageNum:this.data.pageNum+1
    })
    console.log(this.data.pageNum+typeShow)
    if(typeShow == '0'){
      // 搜索活动
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acName='+this.data.keyIp,
        success: function(res) {
          // 成功获取活动列表
          var data = res.data
          // console.log(data)
          if(data.success){
            // 如果获取成功
            // 格式化时间
            var acs = data.value.list
            if(acs.length == 0){
              // 没有加载数据
              wx.showToast({
                title: '没有更多了！',
                duration: 10000
              })

              setTimeout(function(){
                wx.hideToast()
              },1000)
            }
            for(var i = 0 ;i < acs.length;i++){
              // 转换时间戳
              var ac = acs[i]
              ac.startTimeFm = util.tsToDate(ac.startTime)
              // 活动类型分类
              var acTypeCn = util.acTypeToCn(ac.acType)
              ac.acTypeCn = acTypeCn
            }
            console.log(acs)
            var isAcNotFound = false
            if(acs.length == 0){
              isAcNotFound = true
            }

            that.setData({
              acs:that.data.acs.concat(acs),
              isAcNotFound:isAcNotFound
            })
          }else{
            util.alertShow(that,res.data.error)
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,res.data.error)
        }
      })
    }else if(typeShow == '1'){
      // 搜索问题
      wx.request({
        url: 'https://www.huaxinapp.xyz/api/qa/getAllQAClientVO.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&quContent='+this.data.keyIp,
        method:'GET',
        success: function(res) {
          // 成功获取问答列表
          var data = res.data
          console.log(data)
          if(data.success){
            // 如果获取成功
            // 格式化时间
            var qus = data.value.list
            if(qus.length == 0){
              // 没有加载数据
              wx.showToast({
                title: '没有更多了！',
                duration: 10000
              })

              setTimeout(function(){
                wx.hideToast()
              },1000)
            }
            for(var i = 0;i<qus.length;i++){
              // 格式化语音时长
              var qu = qus[i]
              qu.anVoiceDurationFm = util.voiceDuration(qu.anVoiceDuration)
            }
            if(qus == null){
              // 搜索结果为空
              wx.showToast({
                title: '没有找到结果！',
                icon: 'loading',
                duration: 10000
              })

              setTimeout(function(){
                wx.hideToast()
                return
              },1000)
            }
            // 转换时间戳
            for(var i = 0 ;i < qus.length;i++){
              var ac = qus[i]
              ac.startTimeFm = util.tsToDate(ac.startTime)
              qus[i] = ac
            }
            console.log(qus)
            var isQuNotFound = false
            if(qus.length == 0){
              isQuNotFound = true
            }
            that.setData({
              qus:that.data.qus.concat(qus),
              isQuNotFound:isQuNotFound
            })
          }else{
            util.alertShow(that,res.data.error)
          }
        },
        fail:function (res) {
          // body...
          util.alertShow(that,res.data.error)
        }
      })
    }
    
  },

  // searchEve:function() {
  //   // 存储搜索历史
  //   var scHs = this.data.scHs
  //   if(this.data.keyIp != null && this.data.keyIp != ''){
  //     // 通过用户输入搜索
  //     scHs[scHs.length] = this.data.keyIp
  //   }else if(this.data.scByHs != null && this.data.scByHs != ''){
  //     // 通过用户搜索历史搜素
  //     this.setData({
  //       keyIp:this.data.scByHs
  //     })
  //     scHs[scHs.length] = this.data.keyIp
  //   }
  //   console.log(scHs)
  //   wx.setStorageSync('scHs',scHs)
  //   wx.redirectTo({
  //     url:'../search/search?keyIp='+this.data.keyIp
  //   })
  // },

  scHsEvent:function (e) {
    // 通过搜索历史搜索内容
    var keyIp = e.currentTarget.dataset.type
    this.setData({
      scByHs:keyIp
    })
    this.searchIp()
  },

  // 搜索事件
  switchTab:function (e) {
    var typeShow = e.currentTarget.dataset.type;
    this.setData({
      acTypeShow:typeShow
    })
    console.log(typeShow)
    if(typeShow == '0'){
      // 搜索活动
      this.setData({
        acShow:true,
        quShow:false,
        isQuDfShow:false,
        isAcDfShow:this.data.isAcNotFound,
      })
    }else if(typeShow == '1'){
      // 搜索问题
      this.setData({
        quShow:true,
        acShow:false,
        isQuDfShow:this.data.isQuNotFound,
        isAcDfShow:false,
      })
    }
    
  },

  searchIp:function(e){
    // 关键字输入的操作
    var that = this

    if(typeof(e) == 'undefined'){
      // 通过搜索历史搜索
      this.setData({
        keyIp:this.data.scByHs
      })
    }else{

      this.setData({
        // keyIp : encodeURI(e.detail.value)
        keyIp : e.detail.value
      })
    }
    
    console.log(this.data.keyIp)
      // 搜索活动
    wx.request({
      url: encodeURI('https://www.huaxinapp.xyz/api/activity/getAllActivityClientVOs.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&acName='+this.data.keyIp),
      success: function(res) {
        // 成功获取活动列表
        var data = res.data
        console.log(res)
        if(data.success){
          // 如果获取成功
          // 格式化时间
          var acs = data.value.list
          
          for(var i = 0 ;i < acs.length;i++){
            // 转换时间戳
            var ac = acs[i]
            ac.startTimeFm = util.tsToDate(ac.startTime)
            // 活动类型分类
            var acTypeCn = util.acTypeToCn(ac.acType)
            ac.acTypeCn = acTypeCn
          }
          console.log(acs)
          var isAcNotFound = false
          if(acs.length == 0){
            isAcNotFound = true
          }
          that.setData({
            acs:acs,
            isHsShow:false,
            isAcNotFound:isAcNotFound,
            // isAcDfShow:isAcNotFound
          })
          if(that.data.acTypeShow == '0'){
            that.setData({
              isAcDfShow:isAcNotFound
            })
          }
          // 存储历史搜索记录
          var scHs = wx.getStorageSync('scHs')
          scHs = util.arrayProcess(that.data.keyIp,scHs)
          console.log(scHs)
          // scHs[scHs.length] = that.data.keyIp
          wx.setStorageSync('scHs',scHs)
        }else{

          util.alertShow(that,data.error)
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,'调用搜索活动接口失败')
      }
    })

    // 搜索问题
    wx.request({
      url: encodeURI('https://www.huaxinapp.xyz/api/qa/getAllQAClientVO.do?pageNum='+this.data.pageNum+'&pageSize='+this.data.pageSize+'&quContent='+this.data.keyIp),
      method:'GET',
      success: function(res) {
        // 成功获取问答列表
        var data = res.data
        console.log(data)
        if(data.success){
          // 如果获取成功
          // 格式化时间
          var qus = data.value.list
          for(var i = 0;i<qus.length;i++){
            // 格式化语音时长
            var qu = qus[i]
            qu.anVoiceDurationFm = util.voiceDuration(qu.anVoiceDuration)
          }
          if(qus == null){
            // 搜索结果为空
            wx.showToast({
              title: '没有找到结果！',
              icon: 'loading',
              duration: 10000
            })

            setTimeout(function(){
              wx.hideToast()
              return
            },1000)
          }
          // 转换时间戳
          for(var i = 0 ;i < qus.length;i++){
            var ac = qus[i]
            ac.startTimeFm = util.tsToDate(ac.startTime)
            qus[i] = ac
          }
          console.log(qus)
          var isQuNotFound = false
          if(qus.length == 0){
            isQuNotFound = true
          }
          that.setData({
            qus:qus,
            isHsShow:false,
            isQuNotFound:isQuNotFound,
          })
          if(that.data.acTypeShow == '1'){
            that.setData({
              isQuDfShow:isQuNotFound
            })
          }
        }else{
          util.alertShow(that,res.data.error)
        }
      },
      fail:function (res) {
        // body...
        util.alertShow(that,res.data.error)
      }
    })
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

  turnToAc: function (e) {
    // 进入问题详情页面
    var that = this
    var acId = e.currentTarget.dataset.type;
    console.log(acId)
    wx.navigateTo({
      url:'../action-detail/action-detail?acId='+acId
    })
  },

  // 进入问题详情
  turnToQu: function (e) {
    var that = this
    // var role = app.globalData.roleType
    var isLogin = app.globalData.isLogin
    if(isLogin){
      var quId = e.currentTarget.id;
      // console.log(role)
      // role = 1
      // if(role == 0){
      //   // normal user
      //   wx.navigateTo({
      //     url:'../question-detail/question-detail?quId='+quId,
      //   })
      // }else if(role == 1){
      //   // private user
      //   wx.navigateTo({
      //     url:'../answer-question/answer-question?quId='+quId,
      //   })
      // }
      wx.navigateTo({
        url:'../question-detail/question-detail?quId='+quId,
      })
    }else{
      // has not login 
      app.wechatLogin(function(){
        //  login success
        // wx.hideLoading();
        wx.hideToast();
        if(app.globalData.isLogin){
          // login success
          that.turnToQu(e)
        }else{
          util.alertShow(that,'login faile')
        }
      })
    }
    
  },

  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },
  backToPage: function backToPage(){
    util.backToPage();
  },

  voiceEvent: function (e) {
    // 播放语音接口
    util.voiceEvent(e,this,app)
    
  },

  inputCancel:function (argument) {
    // 输入字符清空
    this.setData({
      scByHs:''
    })
  },
})
