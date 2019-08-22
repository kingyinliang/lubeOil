
var vm=new Vue({
	el: '#vmObj',
	data: {
	    inviteMa:'',
	    inviteUrl:'',
	    imgSrc:'',
	    amount:58
	},
	created:function(){
		var self=this;
		self.getMa();
	},
	methods:{
		getMa:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/user/userInfo/getRecommendation', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{},
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : true, //是否异步
			  	//processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				//contentType : false,
			  	error:function(){
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			    	if (data.code==0) {
			    		self.inviteMa=data.data.recommendation;
			    		self.amount=data.data.money;
			    		self.inviteUrl=data.data.url+'&isShare=true';
			    		setTimeout(function(){
			    			var qrcode = $('.myPromo').qrcode(self.inviteUrl);
			    			$('canvas').height($('canvas').width());
			    		},500);
			    		$('.inviteCont').height($('.inviteCont').width()+20);
			    		$('.myPromo').height($('.myPromo').width());
			    		if(self.inviteUrl){
			    			//分享
//							var win_url =window.location.href;
							var shareUrl=testUrl+'/ljzc.html?isShare=true'+'&recommendation='+self.inviteMa;
							var imgUrls=testUrl+'/images/LOGO.png'//testUrl+self.inviteUrl;
							console.log(shareUrl);
							console.log(imgUrls);
							//微信 通过config接口注入权限验证配置
					        wx.config({
					            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					            appId: data.data.signature.appId, // 必填，公众号的唯一标识
					            timestamp: data.data.signature.timestamp, // 必填，生成签名的时间戳
					            nonceStr: data.data.signature.nonceStr, // 必填，生成签名的随机串
					            signature: data.data.signature.signature,// 必填，签名，见附录1
					            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					        });
					        //wx.config验证成功
					        wx.ready(function(){
					            var title = '益康阁';
					            var desc = '关注公众号领取'+self.amount+'元红包！';
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
			    		}
			     	}else if(data.code==-1){
			     		location.href='ljzc.html';
			     	}else{
			     		mui.toast(data.msg);
			     	}
			  	} 
			});
		}
	}
});