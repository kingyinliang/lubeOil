var orderId=$.getUrlParam('orderId');
var proId=$.getUrlParam('proId');
var vm=new Vue({
	el: '#vmObj',
	data: {
	    levelId:'',
	    evalCont:''
	},
	created:function(){
		var self=this;
	},
	methods:{
		textNum:function(){
			var len=vm.evalCont.length;
			$('.textLimit span').html(len);
		},
		evaluate:function(){
			var self=this;
			if(!self.levelId){
				mui.toast('请选择评价等级');
			}else if(!self.evalCont){
				mui.toast('请输入文字评价');
			}else{
				$.ajax({   
				  	url:testUrl+'/user/order/toComment', // 数据接口地址  
				  	type:'post',        //请求方式
				  	dataType:"json",   //返回数据类型
				 	data:{
				 		orderId:orderId,
				 		leven:self.levelId,
				 		content:self.evalCont
				 	},
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
				    		mui.toast('评价成功');
				    		setTimeout(function(){
				    			location.href="user.html?proId="+proId;
				    		},500);
				     	}else if(data.code==-1){
				     		location.href='ljzc.html';
				     	}else{
				     		mui.toast(data.msg);
				     	}
				  	} 
				});
			}
		}
	}
});
$("#img1").click(function(){
	$(this).attr("src","images/hao.png");
	$("#ping1").css("color","#E4601F");
	$("#ping2").css("color","#444");
	$("#ping3").css("color","#444");
	$("#img2").attr("src","images/zhongping.png");
	$("#img3").attr("src","images/chaping.png");
	vm.levelId=3;
});
$("#img2").click(function(){
	$(this).attr("src","images/zhong.png");
	$("#ping2").css("color","#E4601F");
	$("#ping1").css("color","#444");
	$("#ping3").css("color","#444");
	$("#img1").attr("src","images/haoping.png");
	$("#img3").attr("src","images/chaping.png");
	vm.levelId=2;
});
$("#img3").click(function(){
	$(this).attr("src","images/ku.png");
	$("#ping3").css("color","#E4601F");
	$("#ping2").css("color","#444");
	$("#ping1").css("color","#444");
	$("#img2").attr("src","images/zhongping.png");
	$("#img1").attr("src","images/haoping.png");
	vm.levelId=1;
});