import Page from './shared/page.js';
import Toggle from './shared/toggle.js';
import { Datepicker } from 'vanillajs-datepicker';

export default class ListingEventi extends Page {

	constructor(el) {
		super(el);
		this.init();
		
		this.pageInit();
	}

	pageInit() {
		this.initToggle();
		this.initDatePicker();	
		if (document.querySelector('body').classList.contains('frfx'))
			document.querySelector('._pink-alt').style.display = 'none';

	}

	initToggle() {
		const selectors = {
			buttonsAttribute: '[data-toggle-btn]',
			buttonsTarget: '[data-toggle-target]',
		}

		const settings = {
			activeClass: 'active'
		}

		//buttons for mobile and desktop
		this.buttons = Toggle.init(
			selectors.buttonsAttribute, 
			selectors.buttonsTarget, 
			this.body, 
			settings.activeClass
		);
	}

	initDatePicker() {
		const selector = '[data-datepicker]';
		const options = {} // https://mymth.github.io/vanillajs-datepicker/#/options

		let datePickers = [];
		const elements = Array.from(this.body.querySelectorAll(selector));
		
		elements.forEach(x => {
			datePickers.push(
				new Datepicker(x, options)
			);
		});
	}
}

window.onload = () => {
	const listingeventi = new ListingEventi();
};