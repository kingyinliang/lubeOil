var vm=new Vue({
	el: '#vmObj',
	data: {
		orderId:'',
        sendType:'',
		evalCont:'',
		imgUrl:'',
		score:2,
        sendTypeScore: 2
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.orderId=muiSelf.orderId;
				self.sendType=muiSelf.sendType;
				console.log("extras:" + self.orderId);
			});
		}else{
			self.orderId=JSON.parse($.getUrlParam('argument')).orderId;
			self.sendType=JSON.parse($.getUrlParam('argument')).sendType;
			console.log(self.orderId);
		}
	},
	methods:{
		eval_good:function(){
			var self=this;
			self.score=2;
		},
		eval_mid:function(){
			var self=this;
			self.score=1;
		},
		eval_bad:function(){
			var self=this;
			self.score=0;
		},
        sendTypeScore_good:function(){
            var self=this;
            self.sendTypeScore=2;
        },
        sendTypeScore_mid:function(){
            var self=this;
            self.sendTypeScore=1;
        },
        sendTypeScore_bad:function(){
            var self=this;
            self.sendTypeScore=0;
        },
		textNum:function(){
			var self=this;
			var len=self.evalCont.length;
			if(len<=200){
				$('.textLimit span').html(200-len);
			}
		},
		getImage:function(){
			var self=this;
			$('#photo1').click();
       	},
       	upImg:function(imgUrl){
			var self=this;
			console.log(imgUrl);
			var formData = new FormData();
			formData.append("file",imgUrl);
			$.ajax({   
			  	url:Url+'/api/file/upload', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:formData,
			  	xhrFields : { 
  					withCredentials: true 
				},
			  	async : true, //是否异步
			  	processData : false, 
				// 告诉jQuery不要去设置Content-Type请求头
				contentType : false,
			  	error:function(e){
			  		console.log(e);
			    	if(status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
			  	},
			  	success:function(data){
			  		console.log(data);
			  		//var upImg=data.data.file.url;
			    	if (data.code==200) {
			    		self.imgUrl=data.data.file.url;
			     	}else if(data.code==300){
			     		location.href='login.html';
			     	}else{
			     		mui.toast(data.message);
			     	}
			  	} 
			});
		},
       	evalBtn:function(){
			var self=this;
            var param;
			if (self.sendType==1) {
                param={'token':token,'order_id':self.orderId,'comment':self.evalCont,'pic':self.imgUrl,'goods_score':self.score, 'logistics_score': self.sendTypeScore};
			} else if (self.sendType==2) {
                param={'token':token,'order_id':self.orderId,'comment':self.evalCont,'pic':self.imgUrl,'goods_score':self.score, 'service_score': self.sendTypeScore};
			}
			postData('/api/comment/addComment',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					var paramObj={'status':3};
					nextPage('myOrder.html',paramObj);
					setTimeout(function(){
						var self = plus.webview.currentWebview();
				　　　　	var opener = self.opener();
				        mui.fire(opener,'refresh',{'status':3}); 
			　　　　        	self.close();
					})
				}else{
					mui.toast(data.message);
				}
			});
		},
		cancelEval:function(){
			window.close();
			var paramObj={'status':3};
           	nextPage('myOrder.html',paramObj);
		}
	}
});
function setImage(docObj, localImagId, imgObjPreview) {
    var f = $(docObj).val();
    f = f.toLowerCase();
    var strRegex = ".bmp|jpg|jpeg|png|gif$";
    var re=new RegExp(strRegex);
    if (re.test(f.toLowerCase())){
         //return true;
    }
    else{
        mui.toast("请选择正确格式的图片");
        file = $("#photo");
        file.after(file.clone());
        file.remove();
        return false;
    }
    if (docObj.files && docObj.files[0]) {
        //火狐下，直接设img属性
          imgObjPreview.style.display = 'block';
//        imgObjPreview.style.width = '51px';
//        imgObjPreview.style.height = '51px';
        //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式  
        imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
		vm.upImg(docObj.files[0]);
//		myStorage.setItem("upImg",docObj.files[0]);
    } else {
        //IE下，使用滤镜
        docObj.select();
        var imgSrc = document.selection.createRange().text;
        //必须设置初始大小
//        localImagId.style.width = "51px";
//        localImagId.style.height = "51px";
        //图片异常的捕捉，防止用户修改后缀来伪造图片
        try {
            localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
        } catch(e) {
            alert("您上传的图片格式不正确，请重新选择!");
            return false;
        }
        imgObjPreview.style.display = 'none';
        document.selection.empty();
        vm.upImg(docObj.files[0]);
    }
    return true;
}