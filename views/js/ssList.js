var vm=new Vue({
	el: '#vmObj',
	data: {
	    searchKey: '',
	    serchLists:[]
	},
	created:function(){
		var self=this;
		mui.plusReady(function(){
			var muiSelf = plus.webview.currentWebview();
			self.searchKey=muiSelf.serchName;
			console.log("extras:" + muiSelf.serchName);
			$('.serchCont').val(self.searchKey);
			self.getSerlist();
		});
		window.addEventListener("refresh", function(event) {
			self.searchKey=event.detail.serchName;
			console.log("extras:" + event);
			$('.serchCont').val(self.searchKey);
			self.getSerlist();
	    }, false);
	},
	methods:{
		getSerlist:function(){
			var self=this;
			$.ajax({  
		        dataType:"json",
		        type:"post",  
		        url:testUrl+'/api/prodoct/searthProduct',//接口服务器地址  
		        data:{
		        	name:self.searchKey
		        },//请求数据
		        xhrFields : { 
					withCredentials: true 
				},
			  	async : true, //是否异步
//			  	processData : false, 
//				// 告诉jQuery不要去设置Content-Type请求头
//				contentType : false,
		        success:function(res){
		        	console.log(res);
		        	if(res.code==0){
			        	self.serchLists=res.data;
			        	$.each(self.serchLists, function(i,v) {
			        		v.proImg=testUrl+'/'+v.url;
			        	});
			        }else{
			        	mui.toast(res.message);
			        }
		        },
		        error:function(e){
		            //失败执行  
		            if(e.status==400){
			  			mui.toast('参数格式有误')
			  		}else{
			  			mui.toast('无法连接到服务器，请稍后重试'); 
			  		}
		        }  
		  	});
		}
	}
});
$('.idxSearch').click(function(){
	mui.openWindow({
        url:'ssy.html',
        id:'ssy',
        extras:{
        }
   	});
});