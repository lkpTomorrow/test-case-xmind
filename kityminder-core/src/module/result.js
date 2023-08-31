define(function (require, exports, module) {
  var kity = require('../core/kity')
  var utils = require('../core/utils')

  var Minder = require('../core/minder')
  var MinderNode = require('../core/node')
  var Command = require('../core/command')
  var Module = require('../core/module')
  var Renderer = require('../core/render')

  Module.register('ResultModule', function () {
    var minder = this
    // FIXME: 超级大坑，滴滴AgileTC用了 progress 记录测试结果，为了兼容这里只能继续用。
    var RESULT_DATA = 'progress'
    var DEFAULT_BACKGROUND = '#43BC00'
    var PASS_VALUE = 9
    var FAIL_VALUE = 1
    var BLOCK_VALUE = 5
    var SKIP_VALUE = 4
    var WAIT_VALUE = -1
    var FRAME_GRAD = new kity.LinearGradient().pipe(function(g) {
        g.setStartPosition(0, 0);
        g.setEndPosition(0, 1);
        g.addStop(0, '#fff');
        g.addStop(1, '#ccc');
    });
    //
    // minder.getPaper().addResource(FRAME_GRAD);
    // 进度图标的图形
    var ResultIcon = kity.createClass('ResultIcon', {
      base: kity.Group,
      constructor: function (value) {
        this.callBase()
        this.setSize(20)
        this.create()
        this.setValue(value)
        this.setId(utils.uuid('node_progress'))
        this.translate(0.5, 0.5)
      },
      setSize: function (size) {
        this.width = this.height = size
      },
      create: function () {
        var default_circle = new kity.Circle(9).fill("#FFED83")
        default_pie = new kity.Pie(9, 0).fill(DEFAULT_BACKGROUND)
        pass = new kity.Path().setTranslate( - 10, -10).setPathData("M15.812,7.896l-6.75,6.75l-4.5-4.5L6.25,8.459l2.812,2.803l5.062-5.053L15.812,7.896z").fill("#EEE")
        fail = new kity.Path().setTranslate( - 10, -10).setPathData("M5,5l.7,-.7l4.3,4.3l4.3,-4.3l1.4,1.4l-4.3,4.3l4.3,4.3l-1.4,1.4l-4.3,-4.3l-4.3,4.3l-1.4,-1.4l4.3,-4.3l-4.3,-4.3l.7,-.7z").fill("#d81e06")
        block = new kity.Pie(9, 0).fill("red")
        skip = new kity.Path().setTranslate( - 10, -10).setScale(.02).setPathData("M747.3152 415.6416a256.0512 256.0512 0 0 0-489.472 96.768H341.504a170.6496 170.6496 0 0 1 327.6288-58.624l-115.0976 20.9408 227.84 116.736 48.2816-251.392-82.8416 75.5712zM0 512C0 229.2224 229.1712 0 512 0c282.7776 0 512 229.1712 512 512 0 282.7776-229.1712 512-512 512-282.7776 0-512-229.1712-512-512z").fill("#BE96F9")
        wait = new kity.Path().setTranslate( - 10, -10).setScale(.02).setPathData("M512 967.111C260.636 967.111 56.889 763.364 56.889 512S260.636 56.889 512 56.889 967.111 260.636 967.111 512 763.364 967.111 512 967.111zM512 768c16.868 0 30.55-5.461 41.074-16.356 10.524-10.922 15.815-24.433 15.815-40.533s-5.262-29.355-15.815-39.737c-10.525-10.41-24.206-16.1-41.074-17.152-22.13 1.053-38.457 10.923-48.981 29.61-10.525 18.717-10.525 37.405 0 56.122C473.543 758.642 489.87 768 512 768z m43.577-185.828c0-3.27-1.138-12.657-0.996-11.32-1.166-11.833 0.399-22.358 6.884-32.512 4.722-7.424 12.032-14.393 22.955-20.85 64.227-37.945 87.722-80.214 86.385-124.189-1.99-65.877-50.517-130.531-155.761-131.47-87.98-0.825-145.807 41.671-159.488 121.458a42.667 42.667 0 0 0 84.081 14.421c6.23-36.124 26.454-51 74.61-50.574 52.821 0.484 70.542 24.092 71.282 48.697a20.48 20.48 0 0 1-3.243 11.975c-5.888 10.581-18.66 22.87-41.244 36.21-22.33 13.17-39.51 29.554-51.57 48.498-18.745 29.44-22.84 58.567-19.655 88.177 0.483 4.466 0.427 3.897 0.427 1.48a42.667 42.667 0 1 0 85.333 0z").fill("#1296db")
        this.addShapes([default_circle, default_pie,  skip, pass, fail, block, wait])
        this.pie = default_pie
        this.check = pass
        this.fail = fail
        this.block = block
        this.skip = skip
        this.wait = wait
        },
      setValue: function (value) {

        SKIP_VALUE !== value ? this.pie.setAngle( - 360 * (value - 1) / 8).fill(DEFAULT_BACKGROUND) : this.pie.setAngle(360).fill("#fff")
        this.check.setVisible(PASS_VALUE == value)
        this.fail.setVisible(FAIL_VALUE == value)
        this.block.setVisible(BLOCK_VALUE == value)
        this.skip.setVisible(SKIP_VALUE == value)
        this.wait.setVisible(WAIT_VALUE == value)
        BLOCK_VALUE == value && this.block.setAngle( - 180)
      }
    })
    /**
     * @command Result
     * @description 设置节点的结果信息（添加一个结果小图标）
     * @param {number} value 要设置的进度
     *     取值为 0 移除结果信息；
     *     取值为 1 表示成功；
     *     取值为 2 表示失败；
     *     取值为 3 表示忽略；
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var ResultCommand = kity.createClass('ResultCommand', {
      base: Command,
      execute: function (km, value) {
        var nodes = km.getSelectedNodes()
        // if (value > 0 && nodes.length === 1 && !nodes[0].isLeaf()) {
        //   ilayer.alert('父节点不允许标记测试结果。', {
        //     skin: 'layui-layer-molv',
        //     closeBtn: 0
        //   })
        //   return
        // }
        var msg_flag = false
        for (var i = 0; i < nodes.length; i++) {
          if (value === 0) {
            nodes[i].removeKey(RESULT_DATA).render()
          } else {
            nodes[i].setData(RESULT_DATA, value || null).render()
            // if (nodes[i].isLeaf()) {

            // } else {
            //   msg_flag = true
            // }
          }
        }
        // if (msg_flag) {
        //   ilayer.alert('父节点不允许标记测试结果。', {
        //     skin: 'layui-layer-molv',
        //     closeBtn: 0
        //   })
        // }
        km.layout()
      },
      queryValue: function (km) {
        var nodes = km.getSelectedNodes()
        var val
        for (var i = 0; i < nodes.length; i++) {
          val = nodes[i].getData(RESULT_DATA)
          if (val) break
        }
        return val || null
      },
      queryState: function (km) {
        return km.getSelectedNodes().length ? 0 : -1;
      }
    })
    return {
      commands: {
        result: ResultCommand
      },
      renderers: {
        left: kity.createClass('ResultRenderer', {
          base: Renderer,
          create: function (node) {
            return new ResultIcon()
          },
          shouldRender: function (node) {
            // return node.getData(RESULT_DATA);
            return node.getData(RESULT_DATA) && !node.getData('hideState')
          },
          update: function (icon, node, box) {
            var data = node.getData(RESULT_DATA)
            var spaceLeft = node.getStyle('space-left')
            var x, y
            icon.setValue(data)
            x = box.left - icon.width - spaceLeft
            y = -icon.height / 2
            icon.setTranslate(x + icon.width / 2, y + icon.height / 2)
            return new kity.Box(x, y, icon.width, icon.height)
          }
        })
      }
    }
  })
}
)
