var vm=new Vue({
	el: '#vmObj',
	data: {
		goodNum:'',
	    productLists:'',
	    goodAmount:'',
	    amount:'',
	    lastPrice:'',
	    orderAds:'',
	    adsId:'',
	    sendWay:1,
	    coupId:'',
	    coupPrice:'',
	    shopName:'',
	    shopId:'',
	    freight:0,
	    cartId:[]
	},
	created:function(){
		var self=this;
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
				self.shopId=JSON.parse($.getUrlParam('argument')).shopId
			}
			console.log(self.sendWay);
		}
		self.coupId=$.getUrlParam('coupId');
		self.coupPrice=$.getUrlParam('coupPrice');
		if(localStorage.getItem('adsId')){
			self.adsId=localStorage.getItem('adsId');
		}
		self.getAds();
		// self.getInfo();
		self.getGoods();
	},
	methods:{
		getGoods:function () {
            var self=this;
            self.productLists = JSON.parse(localStorage.getItem('cartInfo'));
            console.log(self.productLists);
            $.each(self.productLists, function(i,v) {
                self.goodNum=Calculation('add',self.goodNum,v.num);
                var specP=Calculation('add',v.service_price,v.peijian_price);
                self.goodAmount=Calculation('add',self.goodAmount,Calculation('add',v.num*v.list[0].price,specP));
                self.freight=Calculation('add',self.freight,v.freight);
                self.cartId.push(v.id);
            });
            self.amount=Calculation('reduce',self.goodAmount,self.coupPrice);
            self.lastPrice=Calculation('add',self.amount,self.freight);
            if($('.colCont .carBan img').height()<$('.colCont .carBan img').width()){
                $('.colCont .carBan img').height('1.48rem');
            }else{
                $('.colCont .carBan img').width('1.48rem');
            }
		},
		getInfo:function(){
			var self=this;
			var param={'token':token};
			postData('/api/shopcart/getlist',param,function(data){
				if(data.code==200){
					self.productLists=data.data;
					$.each(self.productLists, function(i,v) {
						self.goodNum=Calculation('add',self.goodNum,v.num);
						var specP=Calculation('add',v.service_price,v.peijian_price);
						self.goodAmount=Calculation('add',self.goodAmount,Calculation('add',v.num*v.list[0].price,specP));
						self.freight=Calculation('add',self.freight,v.freight);
						self.cartId.push(v.id);
					});
					self.amount=Calculation('reduce',self.goodAmount,self.coupPrice);
					self.lastPrice=Calculation('add',self.amount,self.freight);
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
            var paramObj={'addressId': self.adsId, 'type': '0'};
			nextPage('shopList.html', paramObj);
		},
		toMyCoup:function(){
			var self=this;
			var paramObj={'goodsPrice':self.goodAmount};
			nextPage('myCoup.html',paramObj);
		},
		subOrder:function(){
			var self=this;
			if(self.sendWay==1){
				if(!self.adsId){
					mui.toast('请添加收货地址');
				}else{
					var param={'token':token,'shopcart_ids':self.cartId,'address_id':self.adsId,'coupon_id':self.coupId,
					'send_type':self.sendWay,'qixiu_id':self.shopId};
				}
			}else{
				var param={'token':token,'shopcart_ids':self.cartId,'coupon_id':self.coupId,'send_type':self.sendWay,
				'qixiu_id':self.shopId};
			}
			postData('/api/order/addOrder',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
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
							           localStorage.removeItem('selAds');
						        	   var paramObj={'status':-1};
           								nextPage('myOrder.html',paramObj);
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
window.onpageshow=function(e){
    if(e.persisted) {
        window.location.reload()
    }
};

