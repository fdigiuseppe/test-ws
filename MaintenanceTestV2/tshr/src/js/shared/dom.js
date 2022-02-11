export default class Dom {

	static detect(node) {
		const userAgent = navigator.userAgent.toLowerCase();
		const explorer = userAgent.indexOf('msie') > -1;
		const frfx = userAgent.indexOf('firefox') > -1;
		const opera = userAgent.toLowerCase().indexOf('op') > -1;
		let crm = userAgent.indexOf('chrome') > -1;
		let saf = userAgent.indexOf('safari') > -1;
		let ed = userAgent.indexOf('edg') > -1;
		if ((crm) && (saf)) {
			saf = false;
		}
		if ((crm) && (opera)) {
			crm = false;
		}
		if ((crm) && (ed)) {
			crm = false;
		}

		const android = userAgent.match(/android/i);
		const blackberry = userAgent.match(/blackberry/i);
		const ios = userAgent.match(/iphone|ipod/i);
		const operamini = userAgent.match(/opera mini/i);
		const iemobile = userAgent.match(/iemobile/i) || navigator.userAgent.match(/wpdesktop/i);
		const mobile = android || blackberry || ios || operamini || iemobile;

		const overscroll = navigator.platform === 'MacIntel' && typeof navigator.getBattery === 'function';
		const classList = {
			crm,
			explorer,
			frfx,
			saf,
			opera,
			android,
			blackberry,
			ios,
			operamini,
			iemobile,
			mobile,
			overscroll,
			ed
		};
		Object.assign(Dom, classList);
		Object.keys(classList).forEach(x => {
			if (classList[x]) {
				node.classList.add(x);
			}
		});
		if (saf)
			document.querySelector('_blue-alt').style.display = 'none';
		const onTouchStart = () => {
			document.removeEventListener('touchstart', onTouchStart);
			Dom.touch = true;
			node.classList.add('touch');
		};
		document.addEventListener('touchstart', onTouchStart);
		const onMouseDown = () => {
			document.removeEventListener('mousedown', onMouseDown);
			Dom.mouse = true;
			node.classList.add('mouse');
		};
		document.addEventListener('mousedown', onMouseDown);
		if (mobile) {
			Dom.fastscroll = true;
			node.classList.add('fastscroll');
		}
	}

	static fragmentFirstElement(fragment) {
		return Array.prototype.slice.call(fragment.children).find((x) => x.nodeType === Node.ELEMENT_NODE);
	}

	static fragmentFromHTML(html) {
		return document.createRange().createContextualFragment(html);
	}
}
