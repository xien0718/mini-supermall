// 只能用相对路径
import {
  getGoodsData,
  getMultiData
} from "../../service/home";
const tabList = ['pop', 'new', 'sell']
Page({
  data: {
    banners: [],
    recommends: [],
    goods: {
      'pop': {
        page: 0,
        list: [],
        scrollY: 0
      },
      'new': {
        page: 0,
        list: [],
        scrollY: 0,
      },
      'sell': {
        page: 0,
        list: [],
        scrollY: 0,
      }
    },
    currentType: 'pop',
    isShow: false,
    distance: 1000,
    isTabFixed: false,
    tabControlTop: 0,
    currentIndex: 0,
    recordScrollY: 1, //1为可记录，0为不可记录
  },
  onLoad: function (options) {
    // 1.获取轮播图数据
    getMultiData().then((res) => {
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list
      this.setData({
        banners,
        recommends
      })
    }).catch(err => {});
    // 2.获取tab-control要展示的商品数据
    this.getGoodsData('pop');
    this.getGoodsData('new');
    this.getGoodsData('sell');
  },
  getGoodsData(type) {
    const page = this.data.goods[type].page + 1
    getGoodsData(type, page).then((res) => {
      //1.从网络请求返回的res中取出新商品列表newItem
      const newItem = res.data.data.list
      //2.从data中取出旧商品列表oldList
      const oldList = this.data.goods[type].list
      //3.把新列表中的商品挨个加入到旧列表中
      oldList.push(...newItem)
      //3.根据传入的type值（pop或new或sell）来确定到底更改data.goods中哪个tab
      const newList = `goods.${type}.list`;
      const newPage = `goods.${type}.page`;
      this.setData({
        [newList]: oldList,
        [newPage]: page
      })
    })
  },
  itemClick(event) {
    //获取点击的tab的序号
    const index = event.detail.index
    //获取点击的tab的type
    const click = tabList[index]

    const goods = this.data.goods
    var popY = this.data.goods['pop'].scrollY

    var newY = this.data.goods['new'].scrollY
    var sellY = this.data.goods['sell'].scrollY

    // //0.最重要逻辑：点击tabControl回到离开之前的位置，点击时
    //0.1如果当前的scrollY小于tabControlTop，则把所有的scrollY都设置为当前的scrollY
    if (this.data.goods[this.data.currentType].scrollY < this.data.tabControlTop) {
      goods['pop'].scrollY = this.data.goods[this.data.currentType].scrollY;
      goods['new'].scrollY = this.data.goods[this.data.currentType].scrollY;
      goods['sell'].scrollY = this.data.goods[this.data.currentType].scrollY;
      this.setData({
        goods
      })
      //0.2如果当前的scrollY大于tabControlTop的情况下,
    } else {
      //0.2.1如果当前type不为pop且popY小于tabTop，则把它设置为tabControlTop
      if (this.data.currentType !== 'pop' && popY < this.data.tabControlTop) {
        goods['pop'].scrollY = this.data.tabControlTop;
        this.setData({
          goods
        })
      }
      //0.2.2如果当前type不为new且newY小于tabTop，则把它设置为tabControlTop
      if ('new' !== this.data.currentType && newY < this.data.tabControlTop) {
        goods['new'].scrollY = this.data.tabControlTop;
        this.setData({
          goods
        })
      }
      //0.2.3如果当前type不为sell且sellY小于tabTop，则把它设置为tabControlTop
      if ('sell' !== this.data.currentType && sellY < this.data.tabControlTop) {
        goods['sell'].scrollY = this.data.tabControlTop;
        this.setData({
          goods
        })
      }
      //0.2.4处理滚动：一次滚动完成后才可以记录滚动位置，滚动期间不记录滚动位置
      // 滚动前把recordScrollY属性为0，代表不可记录滚动位置，
      this.setData({
        recordScrollY: 0
      })
      // 滚动完成后把recordScrollY设置为1，表示可以记录滚动的位置
      wx.pageScrollTo({
        scrollTop: this.data.goods[click].scrollY,
        duration: 0,
        success: () => this.setData({
          recordScrollY: 1
        })
      })
    }




    //把点击的type给currentType
    this.setData({
      currentType: click
    })
    //把点击的序号给currentIndex
    this.setData({
      currentIndex: index
    })





  },
  onReachBottom() {
    this.getGoodsData(this.data.currentType)
  },
  onPageScroll(options) {
    // 1.滚动距离超过distance，back-top组件显示
    const backFlag = options.scrollTop >= this.data.distance
    if (backFlag !== this.data.isShow) {
      this.setData({
        isShow: backFlag
      })
    }
    //2.滚动距离超过第一个tab-control组件，isTabFixed变成true
    const tabFlag = options.scrollTop >= this.data.tabControlTop
    if (tabFlag !== this.data.isTabFixed) {
      this.setData({
        isTabFixed: tabFlag
      })
    }

    //3.可以记录滚动距离的时候，即recordScrollY为1的时候,记录滚动距离并保存
    const goods = this.data.goods
    if (this.data.recordScrollY) {
      goods[this.data.currentType].scrollY = options.scrollTop;
      this.setData({
        goods
      })
    }
  },
  imgLoad() {
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      const top = rect.top
      console.log(top);
      this.setData({
        tabControlTop: top
      })
    }).exec()
  }
})