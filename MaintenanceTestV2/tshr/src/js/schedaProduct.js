import Page from './shared/page.js';
import Accordion from './accordion/accordion.js'
export default class SchedaProduct extends Page {

	constructor(el) {
		super(el);
		this.init();
		this.pageInit();
	}

	pageInit() {
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
			filtersSelect: true,
			defaultElementId: ''
		}

		Accordion.init('accordion-component', selectors, settings);
	}
}

window.onload = () => {
	const schedaproduct = new SchedaProduct();
};