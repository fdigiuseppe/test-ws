import Page from './shared/page.js';
import ScrollAnchor from './shared/scroll.anchor';
import SwiperSlider from './swiper/swiper-slider.js';
import Accordion from './accordion/accordion.js'
import { Fancybox } from '@fancyapps/ui/src/Fancybox/Fancybox.js';
export default class SchedaSuite extends Page {

	constructor(el) {
		super(el);
		this.init();
		this.pageInit();
	}

	pageInit() {
		SwiperSlider.init();
		ScrollAnchor.init();
		this.initAccordion();
	}

	initAccordion() {
		const selectors = {
			buttonAttribute: 'accordion-button',
			contentAttribute: 'accordion-content',
			activeClass: 'active'
		};

		const settings = {
			closeOthers: false,
			toggleCurrent: false,
			defaultElementId: ''
		}

		Accordion.init('accordion-component', selectors, settings);
	}
}

window.onload = () => {
	const schedasuite = new SchedaSuite();
};