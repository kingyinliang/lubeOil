var vm=new Vue({
	el: '#vmObj',
	data: {
	    userInfors:''
	},
	created:function(){
		var self=this;
//		console.log(userInfo);
		self.userInfors=JSON.parse(localStorage.getItem('userInfos'));
        console.log(self.userInfors);
	},
	methods:{
        getUserInfo: function () {
            var param={'token':token};
            postData('/api/user/getuserinfo',param,function(res){
                if(res.code==200){
                    self.userInfors=res.data;
                    localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
                }else{
                    mui.toast(res.message);
                }
            });
        },
		changeImg:function(){
			var self=this;
//			plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
//              {title:"拍照"},  
//              {title:"从相册中选择"}  
//          ]}, function(e){//1 是拍照  2 从相册中选择  
//              switch(e.index){  
//                  case 1:appendByCamera();break;  
//                  case 2:appendByGallery();break;  
//              }  
//          });
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
			  		var upImg=data.data.file.url;
			    	if (data.code==200) {
			    		var param={'token':token,'avatar':upImg};
			    		postData('/api/user/setUserInfo',param,function(res){
							if(res.code==200){
								mui.toast('修改成功');
				        		self.userInfors.avatar=upImg;
				        		localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
							}else{
								mui.toast(res.message);
							}
						});
			     	}else if(data.code==300){
			     		location.href='login.html';
			     	}else{
			     		mui.toast(data.message);
			     	}
			  	} 
			});
		},
        updatePhone: function (e) {
            mui.openWindow({
                url:'undatePhone.html',
                id:'undatePhone',
                extras:{
                    psdType:0
                }
            });
        },
        updateInfoBrand: function (e) {
            var self=this;
            e.detail.gesture.preventDefault();
            var btnArray = ['取消', '确定'];
            mui.prompt('请输入您的汽车品牌：', self.userInfors.brand, '汽车品牌', btnArray, function(e) {
                if (e.index == 1) {
                    console.log(e.value);
                    var param={'token':token,'brand':e.value};
                    postData('/api/user/setUserInfo',param,function(res){
                        if(res.code==200){
                            mui.toast('修改成功');
                            self.userInfors.brand=e.value;
                            localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
                        }else{
                            mui.toast(res.message);
                        }
                    });
                } else {
                }
            })
        },
        updateInfoType: function (e) {
            var self=this;
            e.detail.gesture.preventDefault();
            var btnArray = ['取消', '确定'];
            mui.prompt('请输入您的汽车车型：', self.userInfors.type, '车型', btnArray, function(e) {
                if (e.index == 1) {
                    console.log(e.value);
                    var param={'token':token,'type':e.value};
                    postData('/api/user/setUserInfo',param,function(res){
                        if(res.code==200){
                            mui.toast('修改成功');
                            self.userInfors.type=e.value;
                            localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
                        }else{
                            mui.toast(res.message);
                        }
                    });
                } else {
                }
            })
        },
        updateInfoDisplacement: function (e) {
            var self=this;
            e.detail.gesture.preventDefault();
            var btnArray = ['取消', '确定'];
            mui.prompt('请输入您的汽车排量：', self.userInfors.displacement, '排量', btnArray, function(e) {
                if (e.index == 1) {
                    console.log(e.value);
                    var param={'token':token,'displacement':e.value};
                    postData('/api/user/setUserInfo',param,function(res){
                        if(res.code==200){
                            mui.toast('修改成功');
                            self.userInfors.displacement=e.value;
                            localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
                        }else{
                            mui.toast(res.message);
                        }
                    });
                } else {
                }
            })
        },
        updateInfoDate: function (e) {
            var self=this;
            e.detail.gesture.preventDefault();
            var btnArray = ['取消', '确定'];
            mui.prompt('请输入您的汽车购买日期：', self.userInfors.purchase_date, '购买日期', btnArray, function(e) {
                if (e.index == 1) {
                    var param={'token':token,'purchase_date':e.value};
                    postData('/api/user/setUserInfo',param,function(res){
                        if(res.code==200){
                            mui.toast('修改成功');
                            self.userInfors.purchase_date=e.value;
                            localStorage.setItem('userInfos',JSON.stringify(self.userInfors));
                        }else{
                            mui.toast(res.message);
                        }
                    });
                } else {
                }
            })
        },
		resetPsd:function(){
			mui.openWindow({
                url:'resetPsd.html',
                id:'resetPsd',
                extras:{
                	psdType:0
                }
           	});
		},
		logout:function(){
			localStorage.removeItem('token_lube');
			localStorage.removeItem('adsId');
			location.href="login.html";
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
// 拍照添加文件
function appendByCamera(){
    plus.camera.getCamera().captureImage(function(e){
        console.log(e);
        plus.io.resolveLocalFileSystemURL(e, function(entry) { 
	        var path = entry.toLocalURL() + "?version=" + new Date().getTime();
	        var name="_doc/upload/"+entry.name;//_doc/upload/F_ZDDZZ-1467602809090.jpg
			plus.zip.compressImage({
				src:path,//src: (String 类型 )压缩转换原始图片的路径
				dst:name,//压缩转换目标图片的路径
				quality:20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
				overwrite:true//overwrite: (Boolean 类型 )覆盖生成新文件
			},
			function(event) {
				var imgUrl = name;//压缩转换目标图片的路径
				upload(imgUrl);
			},function(error) {
				plus.nativeUI.toast("压缩图片失败，请稍候再试");
			});
        }, function(e) { 
            mui.toast("读取拍照文件错误：" + e.message); 
        }); 

    });    
}
// 从相册添加文件
function appendByGallery(){
    plus.gallery.pick(function(path){
    	console.log(path);
        plus.io.resolveLocalFileSystemURL(path, function(entry) { 
	        var path = entry.toLocalURL() + "?version=" + new Date().getTime();
	        var name="_doc/upload/"+entry.name;//_doc/upload/F_ZDDZZ-1467602809090.jpg
			plus.zip.compressImage({
					src:path,//src: (String 类型 )压缩转换原始图片的路径
					dst:name,//压缩转换目标图片的路径
					quality:20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100
					overwrite:true//overwrite: (Boolean 类型 )覆盖生成新文件
				},
				function(event) {
					var imgUrl = name;//压缩转换目标图片的路径
					upload(imgUrl);
				},function(error) {
					plus.nativeUI.toast("压缩图片失败，请稍候再试");
			});
       });
    });
}
// 上传文件
function upload(imgUrl){
    var wt=plus.nativeUI.showWaiting();
    var task=plus.uploader.createUpload(Url+'/api/file/upload',
        {method:"POST"},
        function(t,status){ //上传完成
            if(status==200){
                console.log("上传成功："+t.responseText);
                console.log(JSON.parse(t.responseText).data);
                var upImg=JSON.parse(t.responseText).data.file.url;
                console.log(upImg);
                $.ajax({  
			        dataType:"json",
			        type:"post",  
			        url:Url+'/api/user/setUserInfo',//接口服务器地址  
			        data:{
			        	token:token,
			        	avatar:upImg
			        },//请求数据
			        success:function(res){
			        	console.log(res);
			        	if(res.code==200){
				        	mui.toast('修改成功');
			        		vm.userInfors.avatar=upImg;
			        		localStorage.setItem('userInfos',JSON.stringify(vm.userInfors));
				        }else{
				        	mui.toast(res.message);
				        }
			        },
			        error:function(e){
			        	mui.toast('网络请求失败,请检查网络连接');
			            //失败执行  
			            //mui.toast(e.status+','+ e.statusText);
			        }  
			  	});
                wt.close(); //关闭等待提示按钮
            }else{
                console.log("上传失败："+status);
                wt.close();//关闭等待提示按钮
            }
        }
    );  
    //添加其他参数
    task.addFile(imgUrl,{key:"file"});
//  task.addData(token,"token");
    task.start();
}
//var old_back = mui.back;
//mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
// 	plus.webview.close('my.html');
// 	plus.webview.close('myInfo.html');
//	plus.webview.create('my.html').show();
//	mui.fire('my.html','myInfo');
//	old_back();
//}