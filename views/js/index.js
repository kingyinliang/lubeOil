var cityInfo=JSON.parse(localStorage.getItem('cityInfo'));
var idxurl= location.href.split('#')[0];
var idxUrl=encodeURIComponent(idxurl);
function getLocation(){
  	if (navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(showPosition);
   	}else{
   		mui.toast('定位失败');
   	}
}
function showPosition(position){
	console.log(position);
	vm.lat = position.coords.latitude;
	vm.lng = position.coords.longitude;
	vm.getCity();
}
console.log(localStorage.getItem('cityInfo'));
	var vm=new Vue({
		el: '#vmObj',
		data: {
			wxParam:'',
			page:1,
		    bannerLists: '',
		    cityName:'',
		    cityId:'',
		    proLists:[],
		    lat:'',
		    lng:'',
		    ruleCont:''
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
//			if(!cityInfo){
				//定位
				//self.getWXparam();
				// getLocation();
            self.getCityid();
//				var map = new BMap.Map("mapContain");
//				var point = new BMap.Point(116.331398,39.897445);
//				map.centerAndZoom(point,15);
//				var geolocation = new BMap.Geolocation();
//				geolocation.getCurrentPosition(function(r){
//					if(this.getStatus() == BMAP_STATUS_SUCCESS){
//						console.log(r);
//						self.lat=r.point.lat;
//						self.lng=r.point.lng;
//						$('.geoName').html(r.address.city);
//						self.cityName=r.address.city//r.address.district;
//						localStorage.setItem('areaName',self.cityName);
//						//self.getCity();
//						self.getCityid();
//					}else {
//						mui.toast('定位失败：failed'+this.getStatus());
//					}        
//				},{enableHighAccuracy: true});
				
//			}else{
//				$('.geoName').html(cityInfo.name);
//				self.cityName=cityInfo.name;
//				//self.getCity();
//				self.getCityid();
//			}
		},
		methods:{
			getWXparam:function(){
				var self=this;
				var param={'url':idxUrl};
				postData('/api/public/getsign',param,function(data){
					if(data.code==200){
						mui.toast(data.message);
						self.wxParam=data.data;
						self.geo();
					}else{
						mui.toast(data.message);
					}
				});
			},
			geo:function(){
				var self=this;
				wx.config({
					debug : false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId : self.wxParam.appId,
					timestamp : self.wxParam.timestamp,
					nonceStr : self.wxParam.nonceStr,
					signature : self.wxParam.signature,
					jsApiList : ['getLocation']
				});
				wx.ready(function(){
					//使用微信内置地图查看位置接口
					wx.getLocation({  
					   	type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'  
					   	success: function (res) {
					   		console.log(res);
					       	self.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90  
					       	self.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。  
					       	self.speed = res.speed; // 速度，以米/每秒计  
					       	self.accuracy = res.accuracy; // 位置精度  
					   	}  
					});
					wx.checkJsApi({
			            jsApiList: ['getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
			            success: function(res) {
			            	alert(JSON.stringify(res));
			                // 以键值对的形式返回，可用的api值true，不可用为false
			                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
			            }
			        });
			        //wx.config验证失败
			        wx.error(function(res){
						alert("微信定位签名错误!"+JSON.stringify(res));
			            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			            //muiAjax();
			        });
				});
			},
			getCity:function(){
				var self=this;
//				if(token){
					var param={'token':token,'lat':self.lat,'lng':self.lng};
					postData('/api/user/setcity2',param,function(data){
						if(data.code==200){
							//mui.toast(data.message);
							$('.geoName').html(data.data.city);
							self.cityName=data.data.city;
							self.getCityid();
						}else{
							mui.toast(data.message);
						}
					});
//				}else{
//					self.getCityid();
//				}
			},
			getCityid:function(){
				var self=this;
				var param={'city':self.cityName};//{'city':'兖州区'};
				postData('/api/public/getAreaId',param,function(data){
					if(data.code==200){
						self.cityId=data.data.area_id;
						localStorage.setItem('cityId',self.cityId);
						self.getBan();
						self.getShop();
					}else{
						mui.toast(data.message);
					}
				});
			},
			//获取banner
			getBan:function(){
				var self=this;
				var param={'position_id':1,'city':self.cityId};
				postData('/api/ad/getAdList',param,function(data){
					if(data.code==200){
						self.bannerLists=data.data;
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
			getShop:function(){
				var self=this;
				var param={'page':self.page,'city':self.cityId};
				postData('/api/category/getRecommendGoods',param,function(data){
					if(data.code==200){
						if(data.data.total==0){
							mui.toast('暂无热销产品');
						}else if(data.data.total<=self.proLists.length){
		            		setTimeout(function(){
			        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			        		},500);
		            	}else{
							self.proLists=self.proLists.concat(data.data.data);
							self.page++;
				            setTimeout(function(){
			        			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			        		},500);
			        	}
					}else{
						mui.toast(data.message);
					}
				});
			},
			tobanner:function(index){
				var gallery = mui('#slider');
				gallery.slider().gotoItem(index);
			},
			toBannerCont:function(index){
//				var self=this;
//				var paramObj={'bannerInfos':self.bannerLists[index].content};
//				localStorage.setItem('bannerInfos',self.bannerLists[index].content);
//				nextPage('bannerInfo.html');
			},
			toInfo:function(index){
				var self=this;
				var paramObj={'pId':self.proLists[index].id};
				nextPage('goodsInfo.html',paramObj);
			},
            goMyCoup: function () {
                if(!token){
                    location.href="login.html";
                }else{
					var paramObj={'pId':''};
					nextPage('coupons.html',paramObj);
                }
			},
			pulldownRefresh:function() {
		   		var self=this;
		   		self.page=1;
				setTimeout(function(){
					self.proLists=[];
					self.getShop();
	               	mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	           	},1500);
	       	},
		   	pullupRefresh:function() {
		   		var self=this;
	       		self.getShop();
	       	}
		},
		computed:{
			firstImg: function () {
				var self=this;
		        if (!self.bannerLists) return "";
		        return self.bannerLists[0].pic;
	    	},
	    	lastImg: function () {
	    		var self=this;
		        if(self.bannerLists==''){
		        	return "";
		        }else{
		        	return self.bannerLists[self.bannerLists.length-1].pic;
		        }
			},
			firstUrl:function(){
				var self=this;
				return self.bannerLists[0].content;
			},
			lastUrl:function(){
				var self=this;
				return self.bannerLists[self.bannerLists.length-1].content;
			}
		}
	});
//	$('.toCity').click(function(){
//		nextPage('cityList.html');
//	});
	$('.idxSearch').click(function(){
		nextPage('search.html');
		//location.href="https://lube.sdszwlkj.com//lubeOil/showlng.html";
	});
	$('.toClassify').click(function(){
		nextPage('classify.html');
	});
	mui.plusReady(function(){
	    //首页返回键处理  
	    //处理逻辑：2秒内，连续两次按返回键，则退出应用  
	    var first = null;  
	    mui.back=function(){
	    if(!first){  
	            first = new Date().getTime();  
	            mui.toast('再按一次退出应用');  
	            setTimeout(function(){  
	                first = null;  
	            },2000);  
	        } else {  
	            if(new Date().getTime() - first < 2000){  
	                plus.runtime.quit();  
	            }  
	        }  
	    };
	
	});
//解析定位结果
function onComplete(data) {
    console.log(data);
//  myStorage.setItem("geoInfo", JSON.stringify(data.addressComponent));
//  myStorage.setItem("detailGeo", data.formattedAddress);
	myStorage.setItem("geoInfo", JSON.stringify(data));
	$('.geoName').html(data.addressComponent.district);
	vm.cityName=data.addressComponent.district;
	localStorage.setItem('areaName',self.cityName);
	vm.getCity();
	vm.getCityid();
}
//解析定位错误信息
function onError(data) {
	console.log(data);
	alert(JSON.stringify(data));
//	document.getElementById('tips').innerHTML = '北京市';//定位失败
//	mui.toast(data, {duration:'long', type:'div'});
}