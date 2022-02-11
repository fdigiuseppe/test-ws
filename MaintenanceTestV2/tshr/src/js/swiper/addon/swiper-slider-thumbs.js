
import SwiperSlider from '../swiper-slider';
import SwiperThumbs from '../shared/swiper-thumbs';

export default class SwiperSliderThumbs extends SwiperSlider {

	constructor(node) {
		super(node);
	}

	init() {
		//gallery with thumbs
		if (this.features.thumbs) {
			this.initThumbs();
			return;
		};
		this.swiper = new Swiper(this.node, this.params);
	}

	initThumbs() {
		this.thumbs = new SwiperThumbs(this.node, this.id);
		this.params = Object.assign(this.params, {
			thumbs: {
				swiper: this.thumbs.instance.swiper
			}
		});
		this.swiper = new Swiper(this.node, this.params);
		this.thumbs.bindSliders();
	}

	static init() {	
		const items = Array.from(document.querySelectorAll('[data-swiper-slider]')).filter(item => item.dataset.swiperSlider !== 'controls');
		SwiperSliderThumbs.item = items.map((node, index) => new SwiperSliderThumbs(node, index));
	}
}
