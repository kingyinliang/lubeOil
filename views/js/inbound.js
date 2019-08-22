var goodsPicker = new mui.PopPicker({
	layer: 1
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		imgUrl:'',
		goodName:'',
		goodSpec:'',
	    goodType:'',
	    purPrice:'',
	    salePrice_b:'',
	    salePrice_m:'',
	    salePrice_s:'',
	    goodNum:'',
	    goodsUnits:[],
	    unitName:'',
	    warnNum:''
	},
	created:function(){
		var self=this;
		self.getList();
	},
	methods:{
		getImg:function(){
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
		getList:function(){
			var self=this;
			postData('/api/public/getGoodsUnit','',function(data){
				if(data.code==200){
					var datas=data.data.goods_unit;
					for(var i=0;i<datas.length;i++){
						self.goodsUnits.push({value:i+1,text:datas[i]});
					};
					console.log(self.goodsUnits);
					goodsPicker.setData(self.goodsUnits);
				}else{
					mui.toast(data.message);
				}
			});
		},
		selUnit:function(){
			var self=this;
			goodsPicker.show(function(items) {
				console.log(items);
				self.unitName=items[0].text;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
			//nextPage('selGoods.html');
		},
		cfmInbound:function(){
			var self=this;
			if(!self.imgUrl){
				mui.toast('请上传图片');
			}else if(!self.goodName){
				mui.toast('请输入商品名称');
			}else if(!self.goodSpec){
				mui.toast('请输入商品规格');
			}else if(!self.goodType){
				mui.toast('请输入商品型号');
			}else if(!self.purPrice){
				mui.toast('请输入进货价');
			}else if(!self.salePrice_b){
				mui.toast('请输入大客户销售价');
			}else if(!self.salePrice_m){
				mui.toast('请输入中客户销售价');
			}else if(!self.salePrice_s){
				mui.toast('请输入小客户销售价');
			}else if(!self.goodNum){
				mui.toast('请输入商品数量');
			}else if(!self.unitName){
				mui.toast('请选择商品单位');
			}else if(!self.warnNum){
				mui.toast('请选择商品单位');
			}else{
			var param={'token':token,'goods_name':self.goodName,'goods_img':self.imgUrl,'cost_price':self.purPrice,
			'price_1':self.salePrice_s,'price_2':self.salePrice_m,'price_3':self.salePrice_b,'stock':self.goodNum,
			'unit':self.unitName,'spec':self.goodSpec,'note':self.goodType,'warn_stock':self.warnNum};
			postData('/api/inventorygoods/addGoods',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					setTimeout(function(){
//						var self = plus.webview.currentWebview();
//				　　　　	var opener = self.opener();
//				        mui.fire(opener,'refresh',{}); 
//			　　　　        	self.close();
						location.href="pursellSave.html";
					},500)
				}else{
					mui.toast(data.message);
				}
			});
			}
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
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	//nextPage('index.html');
    old_back();
}