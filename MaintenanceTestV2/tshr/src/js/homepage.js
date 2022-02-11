import Page from './shared/page';
import SwiperSlider from './swiper/swiper-slider';

export default class Homepage extends Page {

	constructor(el) {
		super(el);
		this.init();
		this.pageInit();
	}

	pageInit() {
		SwiperSlider.init();
	}
}

window.onload = () => {
	const homepage = new Homepage();
};