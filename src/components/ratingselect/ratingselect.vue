<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(2,$event)" class="block positive" :class="{'active': defaultType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active': defaultType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active': defaultType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent($event)" class="switch" :class="{'on':defaultOnlyContent==true}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>
<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				rype: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		data() {
			return {
				defaultType: this.selectType,
				defaultOnlyContent: this.onlyContent
			}
		},
		computed: {
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE
				})
			},
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE
				})
			}
		},
		methods: {
			select(type,event) {
				if (!event._constructed) {
					return
				}
				this.defaultType = type
				this.$parent.$emit('ratingtype.select',type)
			},
			toggleContent(event) {
				if (!event._constructed) {
					return
				}
				this.defaultOnlyContent = !this.onlyContent
				this.$parent.$emit('content.toggle',this.onlyContent)
			}
		}
	}
</script>
<style>
	.rating-type{padding: 18px 0;margin: 0 18px;border-bottom: 1px solid rgba(7,17,27,0.1);font-size: 0;}
	.block{display: inline-block;padding: 8px 12px;margin-right: 8px;line-height: 16px;border-radius: 1px;font-size: 12px;color: rgb(77,85,93);}
	.block .count{font-size: 8px;margin-left: 2px;}
	.positive{background: rgba(0,160,220,0.2);}
	.negative{background: rgba(77,85,93,0.2);}
	.block.active{color: #fff;}
	.active.positive{background: rgb(0,160,220);}
	.active.negative{background: rgb(77,85,93);}

	.switch{padding: 12px 18px;line-height: 24px;font-size: 12px;color: rgb(147,153,159);border-bottom: 1px solid rgba(7,17,27,0.1);font-size: 0;}
	.icon-check_circle{display: inline-block;vertical-align: middle; margin-right: 4px;font-size: 24px;}
	.on .icon-check_circle{color: #00c850;}
	.switch .text{display: inline-block;vertical-align: middle;font-size: 12px;}
</style>