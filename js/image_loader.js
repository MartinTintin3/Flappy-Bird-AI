export class ImageLoader {
	static load(path) {
		return new Promise(r => {
			const image = new Image();
			image.onload = (() => r(image));
			image.src = path;
		});
	}
}