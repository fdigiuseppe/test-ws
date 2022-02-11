import Page from './shared/page';
import Dom from './shared/dom';

export default class TempHeader extends Page {

	constructor(el) {
		super(el);
		this.init();
	}
}

window.onload = () => {
	const tempheader = new TempHeader();
};