<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'priceHighlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<div class="pay" :class="{'enough':payClass}">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<div v-for="ball in balls">
				<transition v-on:before-enter="ballBeforeEnter" v-on:enter="ballEnter" v-on:after-enter="ballAfterEnter">
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<transition name="fold">
			<div class="shopCart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
	
</template>
<script>
	import cartcontrol from 'components/cartcontrol/cartcontrol'
	import BScroll from 'better-scroll'

	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show:false,
						id:1
					},
					{
						show:false,
						id:2
					},
					{
						show:false,
						id:3
					},
					{
						show:false,
						id:4
					},
					{
						show:false,
						id:5
					}
				],
				dropBalls: [

				],
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0
				this.selectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total
			},
			totalCount() {
				let count = 0
				this.selectFoods.forEach((food) => {
					count += food.count
				})
				return count
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`
				}else if (this.totalPrice < this.minPrice){
					let diff = this.minPrice - this.totalPrice
					return `还差￥${diff}元起送`
				}else{
					return `去结算`
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return
				}else{
					return 'enough'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true
					return false
				}
				let show = !this.fold
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent,{
								click: true
							})
						}else{
							this.scroll.refresh()
						}
						
					})
				}
				return show
			}
		},
		methods: {
			drop(el) {
				for(let i = 0; i<this.balls.length; i++){
					let ball = this.balls[i]
					if (!ball.show) {
						ball.show = true
						ball.el = el
						this.dropBalls.push(ball)
						return
					}	
				}
			},
			ballBeforeEnter: function(el) {
				let count = this.balls.length
				while(count--) {
					let ball = this.balls[count]
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect()
						let x = rect.left - 32
						let y = -(window.innerHeight - rect.top - 22)

						el.style.display = ''
						el.style.webKitTransform = `translate3d(0,${y}px,0)`
						el.style.transform = `translate3d(0,${y}px,0)`

						let inner = el.getElementsByClassName('inner-hook')[0]
						inner.style.webKitTransform = `translate3d(${x}px,0,0)`
						inner.style.transform = `translate3d(${x}px,0,0)`
					}
				}
			},
			ballEnter: function(el) {
				/* eslint-disable no-unused-vars */
				// 触发浏览器重绘
				let rf = el.offsetHeight

				this.$nextTick(() => {
					el.style.webKitTransform = `translate3d(0, 0, 0)`
					el.style.transform = `translate3d(0, 0, 0)`

					let inner = el.getElementsByClassName('inner-hook')[0]
					inner.style.webKitTransform = `translate3d(0,0,0)`
					inner.style.transform = `translate3d(0,0,0)`
				})
			},
			ballAfterEnter: function(el) {
				let ball = this.dropBalls.shift()
				if (ball) {
					ball.show = false
					el.style.display = 'none'
				}
			},
			toggleList: function() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold
			},
			empty: function() {
				this.selectFoods.forEach((food) => {
					food.count = 0
				})
			},
			hideList: function() {
				this.fold = true
			},
			pay: function() {
				if (this.totalPrice < this.minPrice) {
					return
				}
				window.alert(`支付${this.totalPrice}元`)
			}
		},
		components: {
			cartcontrol
		}
	}
</script>
<style>
	.shopcart{position: fixed;left: 0;bottom: 0;z-index: 50;width: 100%;height: 48px;}
	.shopcart .content{display: flex;background: #141d27;font-size: 0;color: rgba(255,255,255,0.4);}
	.shopcart .content-left{flex: 1;}
	.shopcart .content-right{flex: 0 0 150px;width: 150px;}
	.shopcart .content-left .logo-wrapper{display: inline-block;vertical-align: top;position: relative;top: -10px;margin: 0 12px;padding: 6px;width: 56px;height: 56px;box-sizing: border-box;border-radius: 50%;background: #141d27;}
	.shopcart .logo-wrapper .logo{width: 100%;height: 100%;border-radius: 50%;background: #2b343c;text-align: center;}
	.shopcart .logo-wrapper .highlight{background: rgb(0,160,220);}
	.shopcart .logo-wrapper .highlight .icon-shopping_cart{color: #fff;}
	.shopcart .logo-wrapper .icon-shopping_cart{line-height: 44px;font-size: 24px;color: #80858a;}
	.shopcart .logo-wrapper .num{position: absolute;top: 0;right: 0;width: 24px;height:16px;line-height: 16px;text-align: center;border-radius: 16px;font-size: 9px;font-weight: 700;color: #fff;background: rgb(240,20,20);box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)}
	.shopcart .content-left .price{display: inline-block;vertical-align: top;margin-top: 12px;padding-right: 12px;line-height: 24px;box-sizing: border-box;border-right: 1px solid rgba(255,255,255,0.1);font-size: 16px;font-weight: 700;}
	.shopcart .content-left .priceHighlight{color: #fff;}
	.shopcart .content-left .desc{display: inline-block;vertical-align: top;margin: 12px 0 0 12px;line-height: 24px;font-size: 10px;}
	.shopcart .content-right{flex: 0 0 105px;width: 105px;}
	.shopcart .content-right .pay{height: 48px;line-height: 48px;text-align: center;font-size: 12px;font-weight: 700;background: #2b333b;}
	.shopcart .content-right .enough{background: #00b43c;color: #fff;}

	.ball-container .ball{position: fixed;left: 32px;bottom: 22px;z-index: 200;transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)}
	.ball-container .ball .inner{display: block;width: 16px;height: 16px;border-radius: 50%;transition: all .4s linear;background: rgb(0,160,220);}

	.shopCart-list{position: absolute;top: 0;left: 0;z-index: -1;width: 100%;transition: all 0.5s;transform: translate3d(0,-100%,0);}
	.fold-enter,.fold-leave-active{transform: translate3d(0,0,0);}
	.list-header{height: 40px;line-height: 40px;padding: 0 18px;background: #f3f5f7;border-bottom: 1px solid rgba(7,17,27,0.1);}
	.list-header .title{float: left;font-size: 14px;color: rgb(7,17,27);}
	.list-header .empty{float: right;font-size: 12px;color: rgb(0,160,220);}
	.list-content{padding: 0 18px;max-height: 217px;background: #fff;overflow: hidden;}
	.list-content .food{position: relative;padding: 12px 0;box-sizing: border-box;border-bottom: 1px solid rgba(7,17,27,0.1);}
	.food .name{line-height: 24px;font-size: 14px;color: rgb(7,17,27);}
	.food .price{position: absolute;right: 100px;bottom: 12px;line-height: 24px;font-size: 12px;font-weight: 700;color: rgb(240,20,20);}
	.cartcontrol-wrapper{position: absolute;right: 0;bottom: 6px;}

	.list-mask{position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: -2;backdrop-filter:blur(10px);transition: 0.5s;opacity: 1;background: rgba(7,17,27,0.6);}
	.fade-enter,.fade-leave-active{opacity: 0;background: rgba(7,17,27,0);}
</style>


