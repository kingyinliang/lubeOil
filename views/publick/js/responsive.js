'use strict';

(function (window, undefined) {
    var resizeTimeout = 0,

    // html元素
    html = window.document.documentElement,

    // 设计图尺寸大小
    designWidth = 750,

    // 最大允许的窗体大小
    maxWidth = 750;
    function setBaseFontSize() {
        // 获取当前窗体宽度
        var windowWidth = html.getBoundingClientRect().width;
//      alert('windowWidth'+windowWidth);
        // 当窗体大小大于最大允许的窗体大小时，限制大小
        if (windowWidth > maxWidth) {
            windowWidth = maxWidth;
        }
        // 计算当前窗体宽度相对于设计图的倍率
        var ratio = windowWidth / designWidth;
        // 计算当前的基础字体大小
        var baseFontSize = ratio * 100;
        // 将基础字体大小赋值给html元素
        html.style.fontSize = baseFontSize + 'px';
        html.ratio = ratio;
        html.bfs = baseFontSize;
    }
    // 窗口大小改变时重新计算基础字体大小
    window.addEventListener('resize', function () {
        // 为了避免频繁计算，通过timeout进行节流
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(setBaseFontSize, 300);
    }, false);

    setBaseFontSize();
})(window);
