
import SwiperSlider from '../swiper-slider';

export default class SwiperThumbs {

	constructor(parent, id) {
		this.parent = parent;
		this.id = id;
		this.init();
	}

	init() {
		const selector = `[data-swiper-thumb-id="${this.id}"]`;
		const node = document.querySelector(selector);
		this.node = new SwiperSlider(node);
	}

	get instance() {
		return this.node;
	}

	bindSliders() {
		this.slideChangeTransitionStart(this.parent.swiper, this.node.swiper);
		this.transitionStart(this.parent.swiper, this.node.swiper);
	}

	slideChangeTransitionStart(item, controls) {
		item.on('slideChangeTransitionStart', () => {
			controls.slideTo(item.activeIndex);
		});
	}

	transitionStart(item, controls) {
		controls.on('transitionStart', () => {
			item.slideTo(controls.activeIndex);
		});
	}
}
