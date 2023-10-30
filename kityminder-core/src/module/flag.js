define(function (require, exports, module) {
  var kity = require('../core/kity')
  var utils = require('../core/utils')

  var Minder = require('../core/minder')
  var MinderNode = require('../core/node')
  var Command = require('../core/command')
  var Module = require('../core/module')
  var Renderer = require('../core/render')

  Module.register('flagModule', function () {
    var minder = this
    // FIXME: 超级大坑，滴滴AgileTC用了 flagCommand 记录测试结果，为了兼容这里只能继续用。
    var flag_DATA = 'flagCommand'
    var DEFAULT_BACKGROUND = '#43BC00'
    var flagRed = 1
    var flagOrange = 2
    var flagYellow = 3
    var flagBlue = 4
    var flagGreen = 5
    var flagPurple = 6
    var flagGray = 7
    var flag = 0
    var FRAME_GRAD = new kity.LinearGradient().pipe(function(g) {
        g.setStartPosition(0, 0);
        g.setEndPosition(0, 1);
        g.addStop(0, '#fff');
        g.addStop(1, '#ccc');
    });
    //
    // minder.getPaper().addResource(FRAME_GRAD);
    // 进度图标的图形
    var flagCommandicon = kity.createClass('flagCommandicon', {
      base: kity.Group,
      constructor: function (value) {
        this.callBase()
        this.setSize(20)
        this.create()
        this.setValue(value)
        this.setId(utils.uuid('node_flagCommand'))
        this.translate(0.5, 0.5)
      },
      setSize: function (size) {
        this.width = this.height = size
      },
      create: function () {
        // translate(-5px,-6px) scale(0.013)
        var default_circle = new kity.Circle(9).fill("rgba(255,0,0,0)")
        default_pie = new kity.Pie(9, 0).fill(DEFAULT_BACKGROUND)
        Red = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(255,0,0)")
        Orange = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(238,177,116)")
        Yellow = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(244,234,42)")
        Blue = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(18,150,219)")
        Green = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(50,205,50)")
        Purple = new kity.Path().setTranslate( - 5, - 8).setScale(.015).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(139,0,255)")
        Gray = new kity.Path().setTranslate( - 5, - 6).setScale(.013).setPathData("M256 0a42.666667 42.666667 0 0 1 21.354667 79.616L277.333333 981.333333h42.666667a21.333333 21.333333 0 0 1 0 42.666667H192a21.333333 21.333333 0 0 1 0-42.666667h42.666667V79.616A42.666667 42.666667 0 0 1 256 0z m357.674667 206.570667c125.781333 171.989333 230.186667 188.288 292.906666 165.76l2.389334-0.896-0.213334 0.149333c-9.536 7.146667-113.429333 134.592-278.72 134.592-114.005333 0-225.344 55.402667-334.08 166.186667V89.173333c126.677333-38.122667 232.576 1.002667 317.717334 117.418667z").fill("rgba(81,81,81)")
        this.addShapes([Red, Orange, Yellow, Blue, Green, Purple, Gray])
        this.pie = default_pie
        this.Red = Red
        this.Orange = Orange
        this.Yellow = Yellow
        this.Blue = Blue
        this.Green = Green
        this.Purple = Purple
        this.Gray = Gray
        },
      setValue: function (value) {
        // SKIP_VALUE !== value ? this.pie.setAngle( - 360 * (value - 1) / 8).fill(DEFAULT_BACKGROUND) : this.pie.setAngle(360).fill("#fff")
        this.Red.setVisible(flagRed == value)
        this.Orange.setVisible(flagOrange == value)
        this.Yellow.setVisible(flagYellow == value)
        this.Blue.setVisible(flagBlue == value)
        this.Green.setVisible(flagGreen == value)
        this.Purple.setVisible(flagPurple == value)
        this.Gray.setVisible(flagGray == value)
        // BLOCK_VALUE == value && this.block.setAngle( - 180)
      }
    })
    /**
     * @command flag
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
    var flagCommand = kity.createClass('flagCommand', {
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
          if (value == 0) {
            nodes[i].removeKey(flag_DATA).render()
          } else {
            nodes[i].setData(flag_DATA, value || null).render()
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
          val = nodes[i].getData(flag_DATA)
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
        flagicon: flagCommand
      },
      renderers: {
        left: kity.createClass('flagRenderer', {
          base: Renderer,
          create: function (node) {
            return new flagCommandicon()
          },
          shouldRender: function (node) {
            // return node.getData(flag_DATA);
            return node.getData(flag_DATA) && !node.getData('hideState')
          },
          update: function (icon, node, box) {
            var data = node.getData(flag_DATA)
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
