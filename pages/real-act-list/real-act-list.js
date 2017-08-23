var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    type:0,
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
  turnToSearch:function function_name(argument) {
      // 跳转搜索页面
      wx.navigateTo({
        url:'../search/search?keyIp='+''
      })
  },

  // switchTab
  switchTab:function function_name(e) {
    var type = e.currentTarget.dataset.type;
    // console.log(type)
    this.setData({
      type:type
    }) 
  },

  backToPage: function backToPage(){
    util.backToPage();
  },

  turnToNextPage: function turnToNextPage(e){
    // 获取页面跳转路径
    util.turnToNextPage(e);
  },

  actEvent:function actEvent(e) {
    // 跳转相应活动类型的活动列表页面
    var acType = e.currentTarget.dataset.type
    wx.navigateTo({
      url:'../act-list/act-list?acType='+acType
    })
  },
})
