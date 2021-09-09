import { Game } from "./game.js";
import { ImageLoader } from "./image_loader.js";

window.onload = () => {
	const game = new Game(document.getElementById("canvas").getContext("2d"));
	game.config.keybinds.flap = "";
	game.start();

	document.addEventListener("input", () => {
		game.config.speed_multiplier = parseFloat(document.getElementById("speed").value).toFixed(2);
		document.getElementById("speed-label").innerText = `${game.config.speed_multiplier}x Speed`;
	});
	document.getElementById("debug-mode").addEventListener("click", () => {
		game.config.debug_mode = document.getElementById("debug-mode").checked;
	});

	document.getElementById("reset-btn").addEventListener("click", () => {
		game.reset();
		game.restart();
	});
};