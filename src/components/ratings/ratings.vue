<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="score-title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务态度</span>
						<star class="star" :size="36" :score="seller.serviceScore"></star>
						<span class="star-score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<star class="star" :size="36" :score="seller.foodScore"></star>
						<span class="star-score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<split></split>
			<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-for="rating in ratings" class="ratings-item" v-show="needShow(rating.rateType,rating.text)">
						<div class="rating-avatar">
							<img width="28" height="28" :src="rating.avatar">
						</div>
						<div class="content">
							<h1 class="rating-name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<star class="star" :size="24" :score="rating.score"></star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span class="item" v-for="item in rating.recommend">{{item}}</span>
							</div>
							<div class="rating-time">
								{{rating.rateTime | formatDate}}
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import BScroll from 'better-scroll'
	import star from 'components/star/star'
	import split from 'components/split/split'
	import ratingselect from 'components/ratingselect/ratingselect'
	import { formatDate } from 'common/js/date'

	const ALL = 2
	const ERR_OK = 0
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings: [],
				selectType: ALL,
				onlyContent: true
			}
		},
		created() {
			this.$on('ratingtype.select',this.ratingtypechange)
			this.$on('content.toggle',this.contentToggle)

			this.$http.get('/api/ratings').then((response) => {
				response = response.body
				if (response.errno === ERR_OK) {
					this.ratings = response.data
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.ratings, {
								click: true
							})
						}else{
							this.scroll.refresh()
						}
					})
				}
			})
		},

		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date,'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
			ratingtypechange(type) {
				this.selectType = type
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},
			contentToggle(content) {
				this.onlyContent = content
				this.$nextTick(() => {
					this.scroll.refresh()
				})
			},
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false
				}
				if (this.selectType === ALL) {
					return true
				}else{
					return type === this.selectType
				}
			}
		},
		components: {
			star,
			split,
			ratingselect
		}

	}
</script>
<style>
	.ratings{position: absolute;top: 174px;left: 0;bottom: 0;width: 100%;overflow: hidden;}
	.overview{display: flex;padding: 18px 0;}
	.overview-left{flex: 0 0 137px;padding: 6px 0;width: 137px;border-right: 1px solid rgba(7,17,27,0.1);text-align: center;}
	.score{margin-bottom: 6px;padding-top: 6px;line-height: 28px;font-size: 24px;color: rgb(255,153,0);}
	.score-title{margin-bottom: 8px;line-height: 12px;font-size: 12px;color: rgb(7,17,27);}
	.rank{line-height: 10px;font-size: 10px;color: rgb(147,153,159);}


	.overview-right{flex: 1;padding: 6px 0 6px 24px;}
	.score-wrapper{margin-bottom: 8px;font-size: 0;}
	.score-wrapper .title{display: inline-block;line-height: 18px;font-size: 12px;color: rgb(7,17,27);}
	.score-wrapper .star{display: inline-block;margin: 0 12px;vertical-align: top;}
	.score-wrapper .star-score{display: inline-block;line-height: 18px;vertical-align: top;font-size: 12px;color: rgb(255,153,0);}
	.delivery-wrapper{font-size: 0;}
	.delivery-wrapper .title{display: inline-block;line-height: 18px;font-size: 12px;color: rgb(7,17,27);}
	.delivery-wrapper .delivery{margin-left: 12px;font-size: 12px;color: rgb(147,153,159);}

	.rating-wrapper{padding: 0 18px;}
	.ratings-item{display: flex;padding: 18px 0;}
	.ratings-item .rating-avatar{flex: 0 0 28px;width: 28px;margin-right: 12px;}
	.ratings-item .rating-avatar img{border-radius: 50%;}
	.ratings-item .content{position: relative;flex: 1;}
	.ratings-item .content .rating-name{margin-bottom: 4px;line-height: 12px;font-size: 10px;color: rgb(7,17,27);}
	.ratings-item .star-wrapper{margin-bottom: 6px;font-size: 0;}
	.star-wrapper .star{display: inline-block;margin-right: 6px;vertical-align: top;}
	.star-wrapper .delivery{display: inline-block;vertical-align: top;line-height: 12px;font-size: 10px;color: rgb(147,153,27);}
	.ratings-item .text{margin-bottom: 8px;line-height: 18px;color: rgb(7,17,27);font-size: 12px;}
	.ratings-item .recommend{line-height: 16px;font-size: 0;}
	.ratings-item .icon-thumb_up,.ratings-item .item{display: inline-block;margin: 8px 4px 0;font-size: 9px;}
	.ratings-item .item{padding: 0 6px;border: 1px solid rgba(7,17,27,0.1);border-radius: 1px;background: #fff;}
	.ratings-item .rating-time{position: absolute;top: 0;right: 0;line-height: 12px;font-size: 10px;color: rgb(147,153,159);}

	@media only screen and (max-width: 320px){
		.overview-left{flex: 0 0 120px;width: 120px;}
		.overview-right{padding-left: 6px;}
	}
</style>
