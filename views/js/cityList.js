var vm=new Vue({
	el: '#vmObj',
	data: {
	    
	},
	created:function(){
		var self=this;
	},
	methods:{}
});
/**
 * 省市拼音排序
 */
function pySegSort(arr, empty) {
    if(!String.prototype.localeCompare)
        return null;
    var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
    var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
    var segs = [];// 存放数据
    var py = [];// 存放首字母
    var res = {};
    var curr;
    $.each(letters, function(i) {
        curr = {
            letter: this,
            data: []
        };
        $.each(arr, function(k, v) {
            if((!zh[i - 1] || zh[i - 1].localeCompare(v.addressName) <= 0) && v.addressName.localeCompare(zh[i]) == -1) {
                curr.data.push(this);
            }
        });
        if(empty || curr.data.length) {
            py.push(this);
            segs.push(curr);
            
            curr.data.sort(function(a, b) {

                return a.addressName.localeCompare(b.addressName);
            });
        }
    });
    res["segs"] = segs;
    res["py"] = py;
    return res;
}
var provinces;
var cityWrapper = document.querySelector('.city-wrapper-hook');
var cityScroller = document.querySelector('.scroller-hook');
var cities = document.querySelector('.cities-hook');
var shortcut = document.querySelector('.shortcut-hook');
var scroll;
var shortcutList = [];
var anchorMap = {};
function initCities() {
	 var y = 0;
	 var titleHeight = 28;
	 var itemHeight = 40;
	 var lists = '';
	 var en = '<ul>';
	 console.log(provinces);
	 provinces.forEach(function (group) {
		 var name = group.letter;
		 lists += '<div class="title">'+name+'</div>';
		 lists += '<ul>';
		 group.data.forEach(function(g) {
		 	lists += '<li class="item" data-pin="'+codefans_net_CC2PY(g.addressName)+'" data-name="'+ g.addressName +'" data-id="'+ g.id +'"><span class="border-1px name">'+ g.addressName +'</span></li>';
		 });
		 lists += '</ul>';
		 var name = group.letter.substr(0, 1);
		 en += '<li data-anchor="'+name+'" class="item">'+name+'</li>';
		 var len = group.data.length;
		 anchorMap[name] = y;
		 y -= titleHeight + len * itemHeight;
	 });
	 en += '</ul>';
	 cities.innerHTML = lists;
	 shortcut.innerHTML = en;
	 shortcut.style.top = (cityWrapper.clientHeight - shortcut.clientHeight) / 2 + 'px';
	 scroll = new window.BScroll(cityWrapper, {
	 	probeType: 3 //1 会截流,只有在滚动结束的时候派发一个 scroll 事件。2在手指 move 的时候也会实时派发 scroll 事件，不会截流。 3除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
	 });
	 scroll.scrollTo(0, 0);
}
function bindEvent() {
	 var touch = {};
	 var firstTouch;
	 shortcut.addEventListener('touchstart', function (e) {
		 var anchor = e.target.getAttribute('data-anchor');
		 firstTouch = e.touches[0];
		 touch.y1 = firstTouch.pageY;
		 touch.anchor = anchor;
		 scrollTo(anchor);
	 });
	 shortcut.addEventListener('touchmove', function (e) {
		 firstTouch = e.touches[0];
		 touch.y2 = firstTouch.pageY;
		 var anchorHeight = 16;
		 var delta = (touch.y2 - touch.y1) / anchorHeight | 0;
		 var anchor = shortcutList[shortcutList.indexOf(touch.anchor) + delta];
		 scrollTo(anchor);
		 e.preventDefault();
		 e.stopPropagation();
	 });
	 function scrollTo(anchor) {
		 var maxScrollY = cityWrapper.clientHeight - cityScroller.clientHeight;
		 var y = Math.min(0, Math.max(maxScrollY, anchorMap[anchor]));
		 if (typeof y !== 'undefined') {
		 	scroll.scrollTo(0, y);
	 	 }
	 }
}