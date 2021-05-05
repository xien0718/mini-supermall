// components/w-tab-control/w-tab-control.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(event) {
      const index=event.currentTarget.dataset.index
      this.setData({
        currentIndex: index
      })

      this.triggerEvent('itemClick',{index,list:this.properties.list[index]},{})
    }
    
  }
})