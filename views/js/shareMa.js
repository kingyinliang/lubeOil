var mask = mui.createMask(function(){
	$('.productShare').hide();
});
var shareurl= location.href.split('#')[0];
var shareUrl=encodeURIComponent(shareurl);
var vm=new Vue({
	el: '#vmObj',
	data: {
		userInfos:'',
		shareMa:'',
		weichatInfo:''
	},
	created:function(){
		var self=this;
		self.userInfos=JSON.parse(localStorage.getItem('userInfos'));
		self.getInfo();
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'url':shareUrl};
			postData('/api/user/myqrcode',param,function(data){
				if(data.code==200){
					self.shareMa=data.data.url;
					self.weichatInfo=data.data.share_config;
					setTimeout(function(){
						$('.myPromo').qrcode(self.shareMa);
					},500);
				}else{
					mui.toast(data.message);
				}
			});
		},
		weiFriend:function(){
			var self=this;
			// 更新分享列表//self.weichatInfo.url;
			var imgUrls=Url+'/images/LOGO.png'//testUrl+self.inviteUrl;
			console.log(shareUrl);
			console.log(imgUrls);
			//微信 通过config接口注入权限验证配置
	        wx.config({
	            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	            appId: self.weichatInfo.appId, // 必填，公众号的唯一标识
	            timestamp: self.weichatInfo.timestamp, // 必填，生成签名的时间戳
	            nonceStr: self.weichatInfo.nonceStr, // 必填，生成签名的随机串
	            signature: self.weichatInfo.signature,// 必填，签名，见附录1
	            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	        });
	        //wx.config验证成功
	        wx.ready(function(){
	            var title = '东海润通';
	            var desc = '扫二维码，关注公众号！';
	            //默认分享链接
	            //朋友圈
	            wx.onMenuShareTimeline({
	                title: title, // 分享标题
	                desc: desc,     //描述
	                link: shareUrl/*win_url*/, // 分享链接
	                imgUrl: imgUrls, // 分享图标
	                success: function () {
	                	
	                    mui.toast("分享成功！");
	                },
	                cancel: function () {
	                    mui.toast("取消分享！");
	                }
	            });
	            //朋友
	            wx.onMenuShareAppMessage({
	                title: title, // 分享标题
	                desc: desc,     //描述
	                link: shareUrl, // 分享链接
	                imgUrl: imgUrls, // 分享图标
	                success: function () {
	                    mui.toast("分享成功！");
	                },
	                cancel: function () {
	                    mui.toast("取消分享！");
	                }
	            });
	
	        });
	        wx.checkJsApi({
	            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
	            success: function(res) {
	            	//alert(res)
	                // 以键值对的形式返回，可用的api值true，不可用为false
	                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
	            }
	        });
	        //wx.config验证失败
	        wx.error(function(res){
				//alert("微信分享签名错误!"+JSON.stringify(res))
	            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	            //muiAjax();
	        });
//			var shareBts=[];
//		    var ss=shares['weixin'];
//		    ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
//		    shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
//			shareAction(shareBts[1],true);
			mask.close();
		},
		circleFriend:function(){
			var self=this;
			// 更新分享列表
			var shareBts=[];
		    var ss=shares['weixin'];
		    ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
		    shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'}));
			shareAction(shareBts[0],true);
			mask.close();
		},
		cancelShare:function(index){
			mask.close();
		}
	},
	mounted:function(){
		var self=this;
		console.log(self.shareMa);
		//$('.myPromo').qrcode(self.shareMa);
	}
});
$('.headTxt').click(function(){
	mask.show();
	$('.productShare').show();
});
// H5 plus事件处理
function plusReady(){
    updateSerivces();
    if(plus.os.name=="Android"){
        main = plus.android.runtimeMainActivity();
        Intent = plus.android.importClass("android.content.Intent");
        File = plus.android.importClass("java.io.File");
        Uri = plus.android.importClass("android.net.Uri");
    }
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener("plusready",plusReady,false);
}
/* 更新分享服务*/
function updateSerivces(){
    plus.share.getServices( function(s){
        shares={};
        for(var i in s){
            var t=s[i];
            shares[t.id]=t;
        }
    }, function(e){
        mui.toast("获取分享服务列表失败："+e.message );
    } );
}
/*
* 分享操作
* @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
* @param {Boolean} bh 是否分享链接
*/
function shareAction(sb,bh) {
    if(!sb||!sb.s){
        mui.toast("无效的分享服务！");
        return;
    }
    var win_url = vm.shareMa;
    var msg={title:'东海润通',content:'东海润通',extra:{scene:sb.x}};
    if(bh){
        //msg.href=win_url;
        msg.href=win_url;
        msg.thumbs=["_www/images/logo.png"];
        msg.pictures=["_www/images/logo.png"];
    }else{
        if(pic&&pic.realUrl){
            msg.pictures=[pic.realUrl];
        }
    }
    // 发送分享
    if ( sb.s.authenticated ) {
        //alert("---已授权---");
        shareMessage(msg,sb.s);
    } else {
        //alert("---未授权---");
        sb.s.authorize( function(){
                shareMessage(msg,sb.s);
            },function(e){
                mui.toast("认证授权失败："+e.code+" - "+e.message );
            
        });
    }
}
/*
* 发送分享消息
* @param {JSON} msg
* @param {plus.share.ShareService} s
*/
function shareMessage(msg,s){
	console.log(JSON.stringify(s));
	console.log(JSON.stringify(msg));
	s.send( msg, function(){
        mui.toast("分享到\""+s.description+"\"成功！ " );
    }, function(e){
        mui.toast( "分享到\""+s.description+"\"失败");
    	console.log(JSON.stringify(e));
    });
}
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	//nextPage('index.html');
    old_back();
}