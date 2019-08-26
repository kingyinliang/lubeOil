var vm=new Vue({
	el: '#vmObj',
	data: {
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
	},
	methods:{
        getList: function () {
            var self=this;
            var param={'token':token,'page':self.page,'month':self.selCont};
            postData('/api/Inventoryorder/ruku_record',param,function(res){
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
        confirmIn: function (item) {
            var self=this;
            var param={'token':token,'id':item.id};
            postData('/api/Inventoryorder/confirm_ruku',param,function(res){
                if(res.code==200){
                    mui.toast(res.message);
                    self.page=1;
                    self.getList();
                }else{
                    mui.toast(res.message);
                }
            })
		},
        pulldownRefresh:function() {
            var self=this;
            self.page=1;
            setTimeout(function(){
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