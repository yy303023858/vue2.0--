<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_left"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="food-cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-for="rating in food.ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" class="avatar" width="12" height="12">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import BScroll from 'better-scroll'
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import split from 'components/split/split'
	import ratingselect from 'components/ratingselect/ratingselect'
	import { formatDate } from 'common/js/date'
	import Vue from 'vue'

	const POSITIVE = 0
	const NEGATIVE = 1
	const ALL = 2

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		},
		created() {
			this.$on('ratingtype.select',this.ratingtypechange)
			this.$on('content.toggle',this.contentToggle)
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
			show() {
				this.selectType = ALL
				this.onlyContent = false
				this.showFlag = true
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food,{
							click: true
						})
					}else{
						this.scroll.refresh()
					}
				})
			},
			hide() {
				this.showFlag = false
			},
			addFirst(event) {
				if (!event._constructed) {
					return
				}
				this.$parent.$emit('cartadd',event.target)
				Vue.set(this.food,'count',1)
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
		filters: {
			formatDate(time) {
				let date = new Date(time)
				return formatDate(date,'yyyy-MM-dd hh:mm')
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		}
	}
</script>
<style>
	.food{position: fixed;left: 0;top: 0;bottom: 48px;z-index: 30;width: 100%;background: #fff;transition: all 0.2s linear;}
	.move-enter,.move-leave-active{transform: translate3d(100%,0,0);}

	.image-header{position: relative;width: 100%;height: 0;padding-top: 100%;}
	.image-header img{position: absolute;top: 0;left: 0;width: 100%;height: 100%;}
	.back{position: absolute;top: 10px;left: 0;}
	.icon-arrow_left{display: block;padding: 10px;font-size: 20px;color: #fff;}

	.food .content{position: relative;padding: 18px;}
	.food .content .title{line-height: 14px;margin-bottom: 8px;font-size: 14px;font-weight: 700;color: rgb(7,17,27);}
	.food .content .detail{position: static;margin-bottom: 18px;line-height: 10px;height: 10px;font-size: 0;background: none;transition: none;overflow: hidden;}
	.food .detail .sell-count,.food .detail .rating{font-size: 10px;color: rgb(147,153,159);}
	.food .detail .sell-count{margin-right: 12px;}

	.food .content .price{position: static;font-weight: 700;line-height: 24px;}
	.food .content .price .now{margin-right: 8px;font-size: 14px;color: rgb(240,20,20);}
	.food .content .price .old{text-decoration: line-through;font-size: 10px;color: rgb(147,153,159);}

	.food-cartcontrol-wrapper{position: absolute;right: 12px;bottom: 12px;}
	.buy{position: absolute;right: 18px;bottom: 18px;z-index: 10;height: 24px;line-height: 24px;padding: 0 12px;box-sizing: border-box;border-radius: 12px;color: #fff;background: rgb(0,160,220); font-size: 10px;transition: all 0.2s;opacity: 1;}
	.fade-enter,.fade-leave-active{opacity: 0;}

	.info{padding: 18px;}
	.info .title{line-height: 14px;margin-bottom: 6px;font-size: 14px;color: rgb(7,17,27);}
	.info .text{padding: 0 8px;line-height: 24px;font-size: 12px;color: rgb(77,85,93);}

	.rating{padding-top: 18px;}
	.rating .title{line-height: 14px;margin-left: 18px;font-size: 14px;color: rgb(7,17,27);}

	.rating-wrapper{padding: 0 18px;}
	.rating-item{position: relative;padding: 16px 0;border-bottom: 1px solid rgba(7,17,27,0.1)}
	.rating-item .user{position: absolute;right: 0;top: 16px;line-height: 12px;font-size: 0;}
	.rating-item .name{display: inline-block;margin-right: 6px;line-height: 12px;vertical-align: top;font-size: 10px;color: rgb(147,153,159);}
	.rating-item .avartar{border-radius: 50%;}
	.rating-item .time{margin-bottom: 6px;line-height: 12px;font-size: 10px;color: rgb(147,153,159);}
	.rating-item .text{line-height: 16px;font-size: 12px;color: rgb(7,17,27);}
	.icon-thumb_up,.icon-thumb_down{line-height: 16px;margin-right: 4px;font-size: 12px;}
	.icon-thumb_up{color: rgb(0,160,220);}
	.icon-thumb_down{color: rgb(147,153,159);}

	.no-rating{padding: 16px 0;font-size: 12px;color: rgb(147,153,159);}
</style>


