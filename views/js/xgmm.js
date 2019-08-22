var vm=new Vue({
	el: '#vmObj',
	data: {
	    phoneNum:'',
	    checkNum:'',
	    psdNum:'',
	    psdNum1:''
	},
	created:function(){
		var self=this;
	},
	methods:{
		telBl:function(){//手机号失去光标事件
			var self=this;
			var userPhone = $.trim(self.phoneNum);
			var ret = /^1[358746]{1}[0-9]{9}$/;
			if(ret.test(userPhone)){
				return true;
			}else{
				mui.toast('手机号输入错误', {duration:'long', type:'div'});
				return false;
			}
		},
		confirmPsd:function(){
			var self=this;
			if(self.psdNum1!=self.psdNum){
				mui.toast('两次输入的密码不一样');
				return false;
			}else{
				return true;
			}
		},
		getChecknum:function(){
			var self=this;
			if(self.phoneNum==''){
		  		mui.toast('请输入手机号');
		  		return false;
		  	}else if(self.telBl()){
				$.ajax({  
			        url:testUrl+'/login/phoneCatche', // 数据接口地址  
				  	type:'post',        //请求方式
				  	dataType:"json",   //返回数据类型
				 	data:{
				 		phone:self.phoneNum
				 	},   //
				  	xhrFields : { 
	  					withCredentials: true 
					} ,
				  	async : true, //是否异步
			        success:function(res){
			        	console.log(res);
			        	if(res.code==0){
				        	$('.checkCode').html('已发送(30s)');
							$('.checkCode').css('background','#ccc');
							$('.checkCode').prop('disabled',true);
							var setTime;
					        $(document).ready(function(){
					            var time=parseInt($(".checkCode").text().substring(4,6));
					            setTime=setInterval(function(){
					                if(time<=0){
					                    clearInterval(setTime);
					                    $(".checkCode").text('重新获取');
					                    $('.checkCode').css('background','#e51d23');
					                    $('.checkCode').prop('disabled',false);
					                    return;
					                }
					                time--;
					                $(".checkCode").text('已发送（'+time+'s）');
					            },1000);
					        });
					        return true;
				        }else if(res.code==-1){
				     		location.href='ljzc.html';
				     	}else{
				        	mui.toast(res.msg);
				        	return false;
				        }
			        },
			        error:function(e){
			        	return false;
			            //失败执行  
			            //mui.toast(e.status+','+ e.statusText);
			        }  
			  	});
		  	}else{
		  		mui.toast('手机号输入错误', {duration:'long', type:'div'});
		  		return false;
		  	}
		},
		saveBtn:function(){
			var self=this;
			$.ajax({   
			  	url:testUrl+'/api/login/reset', // 数据接口地址  
			  	type:'post',        //请求方式
			  	dataType:"json",   //返回数据类型
			 	data:{
			 		phone:self.phoneNum,
			 		captcha:self.checkNum,
			 		password:self.psdNum
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
			    		mui.toast('修改成功');
			    		setTimeout(function(){
			    			location.href='grzx.html';
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
});