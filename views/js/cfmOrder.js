var mask = mui.createMask(function(){
	$('.hide').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		pId:'',
		goodNum:'',
	    productInfos:'',
	    bannerIndexs:'',
	    proNum:1,
	    specPrice:'',
	    specId:'',
	    specName:'',
	    isServ:0,
	    isPart:0,
	    goodAmount:'',
	    amount:'',
	    lastPrice:'',
	    orderAds:'',
	    adsId:0,
	    sendWay:1,
	    coupId:'',
	    coupPrice:'',
	    shopName:'',
	    shopId:''
	},
	created:function(){
		var self=this;
//		var orderAds=JSON.parse(localStorage.getItem('defaultAds'));
//		var selAds=JSON.parse(localStorage.getItem('selAds'));
//		if(orderAds&&selAds){
//			self.orderAds=selAds;
//			self.adsId=self.orderAds.id;
//		}else if(selAds){
//			self.orderAds=selAds;
//			self.adsId=self.orderAds.id;
//		}else if(orderAds){
//			self.orderAds=orderAds;
//			self.adsId=self.orderAds.id;
//		}
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				if(muiSelf.sendWay==2){
					self.sendWay=muiSelf.sendWay;
					self.shopName=decodeURI(decodeURI(muiSelf.shopName));
					self.shopId=muiSelf.shopId;
				}else{
					self.sendWay=1;
				}
				console.log("extras:" + self.sendWay);
			});
		}else{
			
			if(!JSON.parse($.getUrlParam('argument'))){
				self.sendWay=1;
			}else{
				self.sendWay=JSON.parse($.getUrlParam('argument')).sendWay;
				self.shopName=decodeURI(decodeURI(JSON.parse($.getUrlParam('argument')).shopName));
				self.shopId=JSON.parse($.getUrlParam('argument')).shopId;
			}
			console.log(self.sendWay);
		}
		var goodsInfo=JSON.parse(localStorage.getItem('goodsInfo'));
		console.log(goodsInfo);
		self.pId=goodsInfo.pId;
		self.proNum=goodsInfo.num;
		self.specId=goodsInfo.specId;
		self.specPrice=goodsInfo.proPrice;
		self.isServ=goodsInfo.isServ;
		self.isPart=goodsInfo.isPart;
		self.coupId=$.getUrlParam('coupId');
		self.coupPrice=$.getUrlParam('coupPrice');
		if(self.specId==0){
			self.specName='默认';
		}else{
			self.specName=goodsInfo.specName;
		}
		if(localStorage.getItem('adsId')){
			self.adsId=localStorage.getItem('adsId');
		}
		self.getAds();
		self.getInfo();
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'token':token,'goods_id':self.pId};
			postData('/api/goods/getGoodsInfo',param,function(data){
				if(data.code==200){
					self.productInfos=data.data;
					if(self.isServ==1&&self.isPart==1){
						var num=Calculation('add',self.productInfos.service_price,self.productInfos.peijian_price);
						self.goodAmount=Calculation('add',self.proNum*self.specPrice,num);
					}else if(self.isServ==1){
						self.goodAmount=Calculation('add',self.proNum*self.specPrice,self.productInfos.service_price);
					}else if(self.isPart==1){
						self.goodAmount=Calculation('add',self.proNum*self.specPrice,self.productInfos.peijian_price);
					}else{
						self.goodAmount=self.proNum*self.specPrice;
					}
					self.amount=Calculation('reduce',self.goodAmount,self.coupPrice);
					self.lastPrice=Calculation('add',self.amount,self.productInfos.freight);
					if($('.colCont .carBan img').height()<$('.colCont .carBan img').width()){
						$('.colCont .carBan img').height('1.48rem');
					}else{
						$('.colCont .carBan img').width('1.48rem');
					}
				}else{
					mui.toast(data.message);
				}
			});
		},
		getAds:function(){
			var self=this;
			var param={'token':token,'id':self.adsId};
			postData('/api/user/getUserAddressInfo',param,function(data){
				if(data.code==200){
					self.orderAds=data.data;
					self.adsId=data.data.id;
				}else{
					mui.toast(data.message);
				}
			});
		},
		toAds:function(){
			var self=this;
//			var paramObj={'isBuy':1};
//			nextPage('manageAds.html',paramObj);
			location.href="manageAds.html?isBuy=1";
		},
		toShop:function(){
			var self=this;
			//localStorage.setItem('sendWay',self.sendWay);
            var paramObj={'addressId': self.adsId, 'type': '1'};
			nextPage('shopList.html', paramObj);
			// location.href="shopList.html";
		},
		toMyCoup:function(){
			var self=this;
			var paramObj={'goodsPrice':self.goodAmount};
			nextPage('myCoup.html',paramObj);
		},
		subOrder:function(){
			var self=this;
			var specArr=[{'specprice_id':self.specId,'num':self.proNum}];
			var param={'token':token,'goods_id':self.pId,'specprice_info':specArr,'address_id':self.adsId,'coupon_id':
			self.coupId,'send_type':self.sendWay,'qixiu_id':self.shopId,'is_service':self.isServ,'is_peijian':self.isPart};
			if(self.sendWay==1){
				if(!self.adsId){
					mui.toast('请添加收货地址');
				}else{
					param={'token':token,'goods_id':self.pId,'specprice_info':specArr,'address_id':self.adsId,'coupon_id':self.coupId,
					'send_type':self.sendWay,'qixiu_id':self.shopId,'is_service':self.isServ,'is_peijian':self.isPart};
				}
			}else{
				param={'token':token,'goods_id':self.pId,'specprice_info':specArr,'coupon_id':self.coupId,
					'send_type':self.sendWay,'qixiu_id':self.shopId,'is_service':self.isServ,'is_peijian':self.isPart};
			}
			postData('/api/order/addOrderQuick',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					mask.close();
					var param1={'token':token,'order_sn':data.data.order_sn};
					postData('/api/pay/pay',param1,function(res){
						if(res.code==200){
							WeixinJSBridge.invoke(
						       	'getBrandWCPayRequest', {
						    	   "appId" : res.data.appId, /* 微信支付，坑一 冒号是中文字符 */
						           "timeStamp": res.data.timeStamp,         //时间戳，自1970年以来的秒数     
						           "nonceStr": res.data.nonceStr, //随机串     
						           "package": res.data.package,     
						           "signType": res.data.signType,         //微信签名方式：     
						           "paySign": res.data.paySign //微信签名 
						       	},
						       	function(res){  
							      	//alert(JSON.stringify(res))
						           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {
							           mui.toast("支付成功");
							           localStorage.removeItem('adsId');
						        	   //window.location.href="myOrder.html?status=1";
						        	   var paramObj={'status':-1};
           								nextPage('myOrder.html',paramObj)
						           	}else{
						        	   mui.toast("支付失败");
						        	   //window.location.href="wcdd.html";
						           	}
						       	}
						   	);
						}else{
							mui.toast(data.message);
						}
					});
				}else{
					mui.toast(data.message);
				}
			});
		}
	}
});
