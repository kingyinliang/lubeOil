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
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.boundId=muiSelf.boundId;
				console.log("extras:" + self.boundId);
				self.getInfo();
			});
		}else{
			console.log(JSON.parse($.getUrlParam('argument')));
			self.boundId=JSON.parse($.getUrlParam('argument')).boundId;
			console.log(self.boundId);
			self.getInfo();
		}
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'id':self.boundId};
			postData('/api/inventorygoods/getGoodsInfo',param,function(data){
				if(data.code==200){
					self.imgUrl=data.data.goods_img;
					self.goodName=data.data.goods_name;
					self.goodSpec=data.data.spec;
					self.goodType=data.data.note;
					self.purPrice=data.data.cost_price;
					self.salePrice_b=data.data.price_3;
					self.salePrice_m=data.data.price_2;
					self.salePrice_s=data.data.price_1;
					self.goodNum=data.data.stock;
					self.unitName=data.data.unit;
					self.warnNum=data.data.warn_stock;
				}else{
					mui.toast(data.message);
				}
			});
		},
		delbound:function(){
			var self=this;
			var param={'token':token,'id':self.boundId};
			postData('/api/inventorygoods/deleteGoods',param,function(data){
				if(data.code==200){
					mui.toast('删除成功');
					setTimeout(function(){
						var self = plus.webview.currentWebview();
				　　　　	var opener = self.opener();
				        mui.fire(opener,'refresh',{}); 
			　　　　        	self.close();
					},500);
				}else{
					mui.toast(data.message);
				}
			});
		},
		getImg:function(){
			var self=this;
			plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
                {title:"拍照"},  
                {title:"从相册中选择"}  
            ]}, function(e){//1 是拍照  2 从相册中选择  
                switch(e.index){  
                    case 1:appendByCamera();break;  
                    case 2:appendByGallery();break;  
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
			var param={'token':token,'id':self.boundId,'goods_name':self.goodName,'goods_img':self.imgUrl,'cost_price':self.purPrice,
			'price_1':self.salePrice_s,'price_2':self.salePrice_m,'price_3':self.salePrice_b,'stock':self.goodNum,
			'unit':self.unitName,'spec':self.goodSpec,'note':self.goodType,'warn_stock':self.warnNum};
			postData('/api/inventorygoods/addGoods',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					setTimeout(function(){
						var self = plus.webview.currentWebview();
				　　　　	var opener = self.opener();
				        mui.fire(opener,'refresh',{}); 
			　　　　        	self.close();
					},500);
				}else{
					mui.toast(data.message);
				}
			});
			}
		}
	}
});
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
                vm.imgUrl=upImg
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
var old_back = mui.back;
mui.back = function(){
 	//执行mui封装好的窗口关闭逻辑；
	//nextPage('index.html');
    old_back();
}