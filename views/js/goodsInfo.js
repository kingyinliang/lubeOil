var mask = mui.createMask(function(){
	$('.hide').hide();
	$('.popCart').hide();
});
var vm=new Vue({
	el: '#vmObj',
	data: {
		pId:'',
	    productInfos:'',
	    bannerIndexs:'',
	    proNum:1,
	    specPrice:'',
	    specId:0,
	    specName1:'',
	    specName2:'',
	    idx:0,
	    idx1:0,
	    idx2:0,
	    idx3:0,
	    tab:0,
	    isBuy:false
	},
	created:function(){
		var self=this;
		if(mui.os.plus){
			mui.plusReady(function(){
				var muiSelf = plus.webview.currentWebview();
				self.pId=muiSelf.pId;
				console.log("extras:" + self.pId);
				self.getInfo();
			});
//			window.addEventListener("refresh", function(event) {
//				console.log(event);
//				self.pId=event.detail.pId;
//				console.log("extras:" + self.pId);
//				self.getInfo();
//		    }, false);
		}else{
			self.pId=JSON.parse($.getUrlParam('argument')).pId;
			console.log(self.pId);
			self.getInfo();
		}
	},
	methods:{
		getInfo:function(){
			var self=this;
			var param={'goods_id':self.pId};
			postData('/api/goods/getGoodsInfo',param,function(data){
				if(data.code==200){
					self.productInfos=data.data;
					if(self.productInfos.gallery.length>0){
						self.bannerIndexs=self.productInfos.gallery;
					}
					if(!self.productInfos.spec_info){
						self.specPrice=self.productInfos.price;
						self.specId=0;
					}else{
						if(!self.productInfos.spec_info[0].spec2_list){
							self.specPrice=self.productInfos.spec_info[0].price;
							self.specName1=self.productInfos.spec_info[0].spec_value;
							self.specId=self.productInfos.spec_info[0].id;
						}else{
							self.specPrice=self.productInfos.spec_info[0].spec2_list[0].price;
							self.specName1=self.productInfos.spec_info[0].spec_value;
							self.specName2=self.productInfos.spec_info[0].spec2_list[0].spec2_value;
							self.specId=self.productInfos.spec_info[0].spec2_list[0].id;
						}
					}
					setTimeout(function(){
						var gallery = mui('#slider');
						gallery.slider({
						  	interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
						});
					},500);
				}else{
					mui.toast(data.message);
				}
			});
		},
		specify:function(){
			var self=this;
			self.isBuy=true;
			mask.show();
			$(".hide").show();
			if($('.specTop .specImg img').height()<$('.specTop .specImg img').width()){
				$('.specTop .specImg img').height('2.44rem');
			}else{
				$('.specTop .specImg img').width('2.44rem');
			}
		},
		comments:function(){
			var self=this;
//			location.href="comment.html?pId="+self.pId;
			var paramObj={'pId':self.pId};
			nextPage('comment.html',paramObj);
		},
		coupons:function(){
			var self=this;
			var paramObj={'pId':self.pId};
			nextPage('coupons.html',paramObj);
		},
		proType:function(index){
			var self=this;
			if (self.productInfos.spec_info[index].spec2_list) {
            self.productInfos.spec_info[index].spec2_list.forEach((item, index1)=>{
				if (item.stock > 0) {
                    self.idx1 = index1
					return false
				} else if (index1 + 1 == self.productInfos.spec_info[index].spec2_list.length) {
                    self.idx1 = 0
				}
			})
            }
			self.idx=index;
			console.log(self.idx1);
			if(!self.productInfos.spec_info[index].spec2_list){
				self.specPrice=self.productInfos.spec_info[index].price;
				self.specName1=self.productInfos.spec_info[index].spec_value;
				self.specId=self.productInfos.spec_info[index].id;
			}else{
				self.specPrice=self.productInfos.spec_info[index].spec2_list[self.idx1].price;
				self.specName1=self.productInfos.spec_info[index].spec_value;
				self.specName2=self.productInfos.spec_info[index].spec2_list[self.idx1].spec2_value;
				self.specId=self.productInfos.spec_info[index].spec2_list[self.idx1].id;
				self.specId=self.productInfos.spec_info[index].spec2_list[self.idx1].id;
			}
		},
		proType_sub:function(index){
			var self=this;
			if (self.productInfos.spec_info[self.idx].spec2_list[index].stock<=0) {
                mui.toast('库存不足');
                return false
			}
			self.idx1=index;
			console.log(self.idx1);
			self.specPrice=self.productInfos.spec_info[self.idx].spec2_list[index].price;
			self.specName2=self.productInfos.spec_info[self.idx].spec2_list[index].spec2_value;
			self.specId=self.productInfos.spec_info[self.idx].spec2_list[index].id;
		},
		selServ:function(){
			var self=this;
			if(self.idx2==0){
				self.idx2=1;
			}else{
				self.idx2=0;
			}
		},
		selPart:function(){
			var self=this;
			if(self.idx3==0){
				self.idx3=1;
			}else{
				self.idx3=0;
			}
		},
		jia:function(){
			var self=this;
			self.proNum++;
		},
		jian:function(){
			var self=this;
			if(self.proNum<=1){
				mui.toast('商品数量最少为1');
			}else{
				self.proNum--;
			}
		},
		shopCart:function(){
			var self=this;
			if(!token){
				mui.toast('您还未登录,请先登录');
				setTimeout(function(){
					location.href="login.html";
				},500);
			}else{
			self.specify();
			self.isBuy=false;
			console.log(self.isBuy);
			}
		},
		buy:function(){
			var self=this;
			if(!token){
				mui.toast('您还未登录,请先登录');
				setTimeout(function(){
					location.href="login.html";
				},500);
			}else{
				self.isBuy=true;
				self.specify();
			}
		},
		addCart:function(){
			var self=this;
            if (self.productInfos.spec_info[self.idx].spec2_list.length) {
				if (self.productInfos.spec_info[self.idx].spec2_list[self.idx1].stock < self.proNum) {
					mui.toast('库存不足');
					return false
				}
            }
			var specArr=[{'specprice_id':self.specId,'num':self.proNum}];
			var param={'token':token,'goods_id':self.pId,'specprice_info':specArr,'is_service':self.idx2,'is_peijian':self.idx3};
			postData('/api/shopcart/addShopCart',param,function(data){
				if(data.code==200){
					$('.popCart').show();
					setTimeout(function(){
						mask.close();
					},2000)
				}else{
					mui.toast(data.message);
				}
			});
		},
		confirm:function(){
			var self=this;
            if (self.productInfos.spec_info[self.idx].spec2_list.length) {
                if (self.productInfos.spec_info[self.idx].spec2_list[self.idx1].stock < self.proNum) {
                    mui.toast('库存不足');
                    return false
                }
            }
			var paramObj={'pId':self.pId,'num':self.proNum,'specId':self.specId,'proPrice':self.specPrice,'isServ':self.idx2,
			'specName':self.specName1+';'+self.specName2,'isPart':self.idx3};
			localStorage.setItem('goodsInfo',JSON.stringify(paramObj));
			nextPage('cfmOrder.html');
		},
		tabInfo:function(){
			var self=this;
			$('.infoTab span').eq(0).addClass('active').siblings().removeClass('active');
			self.tab=0;
		},
		tabSpec:function(){
			var self=this;
			$('.infoTab span').eq(1).addClass('active').siblings().removeClass('active');
			self.tab=1;
		},
		cancel_col:function(){
			var self=this;
			if(!token){
				mui.toast('您还未登录,请先登录');
				setTimeout(function(){
					location.href="login.html";
				},500);
			}else{
			var param={'token':token,'goods_id':self.pId};
			postData('/api/goods/collect',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					self.getInfo();
				}else{
					mui.toast(data.message);
				}
			});
			}
		},
		add_col:function(){
			var self=this;
			if(!token){
				mui.toast('您还未登录,请先登录');
				setTimeout(function(){
					location.href="login.html";
				},500);
			}else{
			var param={'token':token,'goods_id':self.pId};
			postData('/api/goods/collect',param,function(data){
				if(data.code==200){
					mui.toast(data.message);
					self.getInfo();
				}else{
					mui.toast(data.message);
				}
			});
			}
		},
		closeSpec:function(){
			mask.close();
		}
	},
	computed:{
		firstImg: function () {
			var self=this;
	        if (self.bannerIndexs.length==0) return "";
	        return self.bannerIndexs[0].goods_img;
    	},
    	lastImg: function () {
    		var self=this;
	        if(self.bannerIndexs.length==0){
	        	return "";
	        }else{
	        	return self.bannerIndexs[self.bannerIndexs.length-1].goods_img;
	        }
		}
	}
});
