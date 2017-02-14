<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="supports">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item,index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close">
					<i class="icon-close" @click="detailClose"></i>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	import star from 'components/star/star'
	export default{
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				detailShow: false
			}
		},
		methods: {
			showDetail() {
				this.detailShow = true
			},
			detailClose() {
				this.detailShow = false
			}
		},
		created (){
			this.classMap = ['decrease','discount','special','invoice','guarantee']
		},
		components: {
			star
		}
	}
</script>
<style>
	.header{position: relative;color: #fff;background: rgba(7,17,27,0.5);overflow: hidden;}
	.content-wrapper{position: relative;padding: 24px 12px 18px 24px;font-size: 0px;}
	.header .avatar{display: inline-block;}
	.header .avatar img{border-radius: 2px;}
	.header .content{display: inline-block;margin-left: 16px;font-size: 14px;vertical-align: top;}
	.header .title{margin: 2px 0 8px 0;}
	.header .brand{display: inline-block;width: 30px;height: 18px;background: url(./brand@2x.png)no-repeat;background-size: cover;vertical-align: top;}
	.header .name{margin-left: 6px;font-size: 16px;font-weight: bold;line-height: 18px;}
	.description{margin-bottom: 10px;line-height: 12px;font-size: 12px;}
	.supports{font-size: 0px;}
	.header .icon{display: inline-block;vertical-align: top;width: 12px;height: 12px;margin-right: 4px;background-size: 12px 12px;background-repeat: no-repeat;}
	.text{line-height: 12px;font-size: 12px;}
	.support-count{position: absolute;right: 12px;bottom: 18px;padding: 0 8px;height: 24px;line-height: 24px;border-radius: 14px;background-color: rgba(0,0,0,0.2);text-align: center;}
	.count{font-size: 10px;}
	.bulletin-wrapper{position: relative;height: 28px;line-height: 28px;padding: 0 22px 0 12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;background-color: rgba(7,17,27,0.2);}
	.bulletin-title{display: inline-block;vertical-align: top;margin-top: 7px;width: 22px;height: 12px;background: url(./bulletin@2x.png)no-repeat;background-size: cover;}
	.bulletin-text{margin: 0 4px;vertical-align: top;font-size: 10px;font-weight: 200;}
	.bulletin-wrapper .icon-keyboard_arrow_right{position: absolute;right: 12px;top: 8px;font-size: 10px;}
	.background{position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: -1;filter: blur(10px);}

	.icon-keyboard_arrow_right{font-size: 10px;}

	/*弹出层*/
	.detail{position: fixed;top: 0;left: 0;z-index: 100;width: 100%;height: 100%;overflow: auto;transition: all 0.5s;background: rgba(7,17,27,0.8);backdrop-filter: blur(5px);}
	.fade-enter,.fade-leave-active {opacity: 0;}
	.detail-wrapper{min-height: 100%;width: 100%;}
	.detail-main{margin-top: 64px;padding-bottom: 64px;}
	.detail-close{position: relative;width: 32px;height: 32px;margin: -64px auto;clear: both;font-size: 32px;}
	.detail-main .name{line-height: 16px;text-align: center;font-size: 16px;font-weight: 700;}
	.detail-main .star-wrapper{margin-top: 18px;padding: 2px 0;text-align: center;}
	.detail-main .title{display: flex;width: 80%;margin: 28px auto 24px;}
	.detail-main .line{flex: 1;position: relative;top: -6px;border-bottom: 1px solid rgba(255,255,255,0.2);}
	.detail-main .text{padding: 0 12px;font-weight: 700;font-size: 14px;}
	.detail-main .supports{width: 80%;margin: 0 auto;}
	.supports .support-item{padding: 0 12px;margin-bottom: 12px;font-size: 0;}
	.supports .support-item:last-child{margin-bottom: 0;}
	.supports .icon{display: inline-block;width: 16px;height: 16px;vertical-align: top;margin-right: 6px;background-size: 16px 16px;background-repeat: no-repeat;}
	.supports .text{line-height: 16px;font-size: 12px;}
	.supports .decrease{background-image: url(./decrease_2@2x.png);}
	.supports .discount{background-image: url(./discount_2@2x.png);}
	.supports .guarantee{background-image: url(./guarantee_2@2x.png);}
	.supports .invoice{background-image: url(./invoice_2@2x.png);}
	.supports .special{background-image: url(./special_2@2x.png);}
	.bulletin{width: 80%;margin: 0 auto;}
	.bulletin .content{padding: 0 12px;margin: 0;line-height: 24px;font-size: 12px;}


	.decrease{background-image: url(./decrease_1@2x.png);}
	.discount{background-image: url(./discount_1@2x.png);}
	.guarantee{background-image: url(./guarantee_1@2x.png);}
	.invoice{background-image: url(./invoice_1@2x.png);}
	.special{background-image: url(./special_1@2x.png);}
</style>