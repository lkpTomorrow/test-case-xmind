/**
 * @fileOverview
 *
 * 支持节点详细信息（HTML）格式
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('NotePdsModule', function() {



        /**
         * @command notePds
         * @description 设置节点的备注信息
         * @param {string} notePds 要设置的备注信息，设置为 null 则移除备注信息
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        var FONT_ADJUST = {
            'safari': {
                '微软雅黑,Microsoft YaHei': -0.17,
                '楷体,楷体_GB2312,SimKai': -0.1,
                '隶书, SimLi': -0.1,
                'comic sans ms': -0.23,
                'impact,chicago': -0.15,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0
            },
            'ie': {
                10: {
                    '微软雅黑,Microsoft YaHei': -0.17,
                    'comic sans ms': -0.17,
                    'impact,chicago': -0.08,
                    'times new roman': 0.04,
                    'arial black,avant garde': -0.17,
                    'default': -0.15
                },
                11: {
                    '微软雅黑,Microsoft YaHei': -0.17,
                    'arial,helvetica,sans-serif': -0.17,
                    'comic sans ms': -0.17,
                    'impact,chicago': -0.08,
                    'times new roman': 0.04,
                    'sans-serif': -0.16,
                    'arial black,avant garde': -0.17,
                    'default': -0.15
                }
            },
            'edge': {
                '微软雅黑,Microsoft YaHei': -0.15,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'sans-serif': -0.16,
                'arial black,avant garde': -0.17,
                'default': -0.15
            },
            'sg': {
                '微软雅黑,Microsoft YaHei': -0.15,
                'arial,helvetica,sans-serif': -0.05,
                'comic sans ms': -0.22,
                'impact,chicago': -0.16,
                'times new roman': -0.03,
                'arial black,avant garde': -0.22,
                'default': -0.15
            },
            'chrome': {
                'Mac': {
                    'andale mono': -0.05,
                    'comic sans ms': -0.3,
                    'impact,chicago': -0.13,
                    'times new roman': -0.1,
                    'arial black,avant garde': -0.17,
                    'default': 0
                },
                'Win': {
                    '微软雅黑,Microsoft YaHei': -0.15,
                    'arial,helvetica,sans-serif': -0.02,
                    'arial black,avant garde': -0.2,
                    'comic sans ms': -0.2,
                    'impact,chicago': -0.12,
                    'times new roman': -0.02,
                    'default': -0.15
                },
                'Lux': {
                    'andale mono': -0.05,
                    'comic sans ms': -0.3,
                    'impact,chicago': -0.13,
                    'times new roman': -0.1,
                    'arial black,avant garde': -0.17,
                    'default': 0
                }
            },
            'firefox': {
                'Mac': {
                    '微软雅黑,Microsoft YaHei': -0.2,
                    '宋体,SimSun': 0.05,
                    'comic sans ms': -0.2,
                    'impact,chicago': -0.15,
                    'arial black,avant garde': -0.17,
                    'times new roman': -0.1,
                    'default': 0.05
                },
                'Win': {
                    '微软雅黑,Microsoft YaHei': -0.16,
                    'andale mono': -0.17,
                    'arial,helvetica,sans-serif': -0.17,
                    'comic sans ms': -0.22,
                    'impact,chicago': -0.23,
                    'times new roman': -0.22,
                    'sans-serif': -0.22,
                    'arial black,avant garde': -0.17,
                    'default': -0.16
                },
                'Lux': {
                    "宋体,SimSun": -0.2,
                    "微软雅黑,Microsoft YaHei": -0.2,
                    "黑体, SimHei": -0.2,
                    "隶书, SimLi": -0.2,
                    "楷体,楷体_GB2312,SimKai": -0.2,
                    "andale mono": -0.2,
                    "arial,helvetica,sans-serif": -0.2,
                    "comic sans ms": -0.2,
                    "impact,chicago": -0.2,
                    "times new roman": -0.2,
                    "sans-serif": -0.2,
                    "arial black,avant garde": -0.2,
                    "default": -0.16
                }
            },
        };
    

        var TextPdsCommand = kity.createClass('TextPdsCommand', {
            base: Command,

            execute: function(minder, note) {
                var node = minder.getSelectedNode();
                node.setData('textPds', note);
                node.render();
                minder.layout();
            },

            queryState: function(minder) {
                return minder.getSelectedNodes().length === 1 ? 0 : -1;
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('textPds');
            }
        });
    
        var textPdsIconRenderer = kity.createClass('textPdsIconRenderer', {
            base: Renderer,
            create: function() {
                return new kity.Group().setId(utils.uuid('node_textdps'));
            },
    
            update: function(textGroup, node,box) {
    
                function getDataOrStyle(name) {
                    return node.getData(name) || node.getStyle(name);
                }
    
                var nodeText = node.getData('textPds');
                var textArr = nodeText ? nodeText.split('\n') : [' '];
                var lineHeight = node.getStyle('line-height');
    
                var fontSize = getDataOrStyle('font-size');
                var fontFamily = getDataOrStyle('font-family') || 'default';
                var boxHeight=box.height || 0
                var height = (lineHeight * fontSize) * textArr.length - (lineHeight - 1) * fontSize;
                var yStart = (nodeText&&(-height / 2))<0?(boxHeight==20?10:boxHeight/2):-height / 2;
                var Browser = kity.Browser;
                var adjust;
    
                if (Browser.chrome || Browser.opera || Browser.bd ||Browser.lb === "chrome") {
                    adjust = FONT_ADJUST['chrome'][Browser.platform][fontFamily];
                } else if (Browser.gecko) {
                    adjust = FONT_ADJUST['firefox'][Browser.platform][fontFamily];
                } else if (Browser.sg) {
                    adjust = FONT_ADJUST['sg'][fontFamily];
                } else if (Browser.safari) {
                    adjust = FONT_ADJUST['safari'][fontFamily];
                } else if (Browser.ie) {
                    adjust = FONT_ADJUST['ie'][Browser.version][fontFamily];
                } else if (Browser.edge) {
                    adjust = FONT_ADJUST['edge'][fontFamily];
                } else if (Browser.lb) {
                    // 猎豹浏览器的ie内核兼容性模式下
                    adjust = 0.9;
                }
    
                textGroup.setTranslate(0, (adjust || 0) * fontSize);
    
                var rBox = new kity.Box(),
                    r = Math.round;
    
    
                var textLength = textArr.length;
    
                var textGroupLength = textGroup.getItems().length;
    
                var i, ci, textShape, text;
    
                if (textLength < textGroupLength) {
                    for (i = textLength, ci; ci = textGroup.getItem(i);) {
                        textGroup.removeItem(i);
                    }
                } else if (textLength > textGroupLength) {
                    var growth = textLength - textGroupLength;
                    while (growth--) {
                        textShape = new kity.Text()
                            .setAttr('text-rendering', 'inherit');
                        if (kity.Browser.ie || kity.Browser.edge) {
                            textShape.setVerticalAlign('top');
                        } else {
                            textShape.setAttr('dominant-baseline', 'text-before-edge');
                        }
                        textShape.fill('#000')
                        textGroup.addItem(textShape);
                    }
                }
    
                for (i = 0, text, textShape;
                    (text = textArr[i], textShape = textGroup.getItem(i)); i++) {
                    textShape.setContent(text);
                    if (kity.Browser.ie || kity.Browser.edge) {
                        textShape.fixPosition();
                    }
                }
    
    
                var textHash = node.getData('textPds') +
                    ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/');
    
                if (node._currentTextHash == textHash && node._currentTextGroupBox) return node._currentTextGroupBox;
    
                node._currentTextHash = textHash;
                return function() {
                    textGroup.eachItem(function(i, textShape) {
                        var y = yStart + i * fontSize * lineHeight;
                        textShape.setY(y);
                        var bbox = textShape.getBoundaryBox();
                        rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, fontSize));
                    });
                    var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));
                    node._currentTextGroupBox = nBox;
                    return nBox;
                };
    
            },
    
        });



        return {
            renderers: {
                right: textPdsIconRenderer
            },
            commands: {
                'textspan': TextPdsCommand
            }
        };
    });
});