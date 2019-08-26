var userPicker = new mui.PopPicker({
	layer: 1
});
var goodsPicker = new mui.PopPicker({
	layer: 1
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		goodDatas:'',
		goodLists:[],
		selGoods:'',
		goodName:'',
		goodId:'',
	    outPrice:'',
	    goodNum:'',
	    userLists:[],
	    userName:'',
	    userId:'',
	    zeroPrice:'',
	    payWay:'alipay',
	    markCont:'',
	    amount:'',
        selCont:1,
        page:1,
        dataLists: []
	},
	created:function(){
		var self=this;
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    style:'circle',
                    contentdown : "下拉可以刷新",
                    contentover : "释放立即刷新",
                    contentrefresh : "正在刷新...",
                    callback: self.pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    contentnomore:'暂无更多数据',
                    callback: self.pullupRefresh
                }
            }
        });
		self.getList();
		// self.getGood();
		// self.amount=Calculation('reduce',self.outPrice*self.goodNum,self.zeroPrice);
	},
	methods:{
        getList: function () {
            var self=this;
            var param={'token':token,'page':self.page,'month':self.selCont};
            postData('/api/Inventoryorder/outstockorder_list',param,function(res){
                if(res.code==200){
                    if(res.data.total==0){
                        mui.toast('暂无商品');
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    } else if (self.page === 1) {
                        self.dataLists = res.data.data
                        self.page++;
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    } else if(res.data.total<=self.dataLists.length){
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        },500);
                    }else{
                        self.dataLists=self.dataLists.concat(res.data.data);
                        self.page++;
                        setTimeout(function(){
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                        },500);
                    }
                }else{
                    mui.toast(res.message);
                }
            })
        },
		// getList:function(){
		// 	var self=this;
		// 	var param={'token':token,'keyword':'','type':-1};
		// 	postData('/api/customer/getlist',param,function(data){
		// 		if(data.code==200){
		// 			var datas=data.data.data;
		// 			for(var i=0;i<datas.length;i++){
		// 				self.userLists.push({value:i+1,text:datas[i].name});
		// 			};
		// 			console.log(self.userLists);
		// 			userPicker.setData(self.userLists);
		// 		}else{
		// 			mui.toast(data.message);
		// 		}
		// 	});
		// },
		selUnit:function(){
			var self=this;
			userPicker.show(function(items) {
				console.log(items);
				self.userName=items[0].text;
				self.userId=items[0].value;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
			//nextPage('selGoods.html');
		},
		getGood:function(){
			var self=this;
			var param={'token':token,'keyword':'','order_sort':''};
			postData('/api/inventorygoods/getList',param,function(data){
				if(data.code==200){
					self.goodDatas=data.data.data;
					for(var i=0;i<self.goodDatas.length;i++){
						self.goodLists.push({value:self.goodDatas[i].id,text:self.goodDatas[i].goods_name});
					};
					console.log(self.goodLists);
					goodsPicker.setData(self.goodLists);
				}else{
					mui.toast(data.message);
				}
			});
		},
		selGood:function(){
			var self=this;
			goodsPicker.show(function(items) {
				console.log(items);
				self.goodName=items[0].text;
				self.goodId=items[0].value;
				$.each(self.goodDatas, function(i,v) {
					if(v.id==self.goodId){
						self.selGoods=self.goodDatas[i];
					}
				});
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
			//nextPage('selGoods.html');
		},
		cfmOutbound:function(){
			var self=this;
			if(!self.userName){
				mui.toast('请选择客户');
			}else if(!self.selGoods){
				mui.toast('请选择商品');
			}else if(!self.goodNum){
				mui.toast('请输入商品数量');
			}else if(!self.outPrice){
				mui.toast('请输入金额');
			}else if(!self.zeroPrice){
				mui.toast('请输入抹零价格');
			}else if(!self.payWay){
				mui.toast('请选择支付方式');
			}else if(!self.markCont){
				mui.toast('请输入备注');
			}else{
			var param={'token':token,'customer_id':self.userId,'pay_type':self.payWay,'note':self.markCont,
			'goods_arr':[{'goods_id':self.goodId,'goods_num':self.selGoods.stock}]};
			postData('/api/inventoryorder/addOrder',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					setTimeout(function(){
						var self = plus.webview.currentWebview();
				　　　　	var opener = self.opener();
				        mui.fire(opener,'refresh',{}); 
			　　　　        	self.close();
					},500)
				}else{
					mui.toast(data.message);
				}
			});
			}
		},
        pulldownRefresh:function() {
            var self=this;
            self.page=1;
            setTimeout(function(){
                self.dataLists=[];
                self.getList();
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            },1500);
        },
        pullupRefresh:function() {
            var self=this;
            self.getList();
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