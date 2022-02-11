import Page from './shared/page.js';
export default class SchedaEvento extends Page {

	constructor(el) {
		super(el);
		this.init();
		this.pageInit();
	}

	pageInit() {
	}
}

window.onload = () => {
	const schedaevento = new SchedaEvento();
};