import { Bird } from "./bird.js";
import { Pipe } from "./pipe.js";
import { Config } from "./config.js";
import { ImageLoader } from "./image_loader.js";
import { Renderer } from "./renderer.js";
import { Neuroevolution } from "./neuro_evolution.js";

export class Game {
	constructor(ctx) {
		this.config = new Config();
		this.ctx = ctx || document.body.appendChild(document.createElement("canvas")).getContext("2d");
		this.renderer = new Renderer(this.ctx);
		this.ctx.canvas.width = this.config.width * 2;
		this.ctx.canvas.height = this.config.height * 2;
		this.ctx.canvas.style.width = this.config.width + "px";
		this.ctx.canvas.style.height = this.config.height + "px";
		this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
		this.target_position = {
			x: -10,
			y: -10,
		};
		this.paused = false;
	}

	restart() {
		this.birds = [];
		this.pipes = [];
		this.nearest_pipe = null;

		this.generation = this.neuro_evolution.nextGeneration();

		for(let i = 0; i < this.generation.length; i++) {
			this.birds.push(new Bird(this.images.bird, this.config));
		}
		this.score = 0;
		this.background_x = 0;
		this.interval = 0;
		this.generation_count++;
	}

	reset() {
		this.high_score = 0;
		this.generation = [];
		this.generation_count = 0;

		this.neuro_evolution = new Neuroevolution({
			population: this.config.generation_size,
			network: [2, [6], 1],
		});

		this.neuro_evolution.restart();
	}

	async start() {
		this.images = {
			bird: await ImageLoader.load("./assets/bird.png"),
			background: await ImageLoader.load("./assets/background.png"),
			pipetop: await ImageLoader.load("./assets/pipetop.png"),
			pipebottom: await ImageLoader.load("./assets/pipebottom.png"),
		};

		this.reset();
		this.restart();

		document.addEventListener("keydown", e => {
			if(!Object.values(this.config.keybinds).includes(e.key)) return;
			switch(Object.keys(this.config.keybinds).find(key => this.config.keybinds[key] == e.key)) {
				case "flap":
					e.preventDefault();
					if(this.birds.some(bird => bird.alive) && !this.paused) this.birds.forEach(bird => { if(bird.alive) bird.flap() });
					break;
				case "pause":
					this.paused = !this.paused;
					break;
			}
		});

		setTimeout(() => {
			this.update();
		}, 1000 / (this.config.tps * this.config.speed_multiplier));

		requestAnimationFrame(() => {
			this.render();
		});
	}

	update() {
		if(!this.paused) {
			this.background_x += this.config.background_speed;

			for(let i = 0; i < this.birds.length; i++) {
				if(this.birds[i].alive && this.generation.length == this.birds.length) {
					const inputs = [(this.birds[i].position.y - this.target_position.y) / this.config.height, (this.target_position.x - this.birds[i].position.x) / this.config.width];
					const output = this.generation[i].compute(inputs);

					if(output > 0.5) {
						this.birds[i].flap();
					}

					this.birds[i].update(this.pipes);

					if(!this.birds[i].alive){
						this.neuro_evolution.networkScore(this.generation[i], this.score);
					}
				}
			}

			for(let i = 0; i < this.pipes.length; i++) {
				this.pipes[i].update();
				if(this.pipes[i].out) {
					this.pipes.splice(i, 1);
					i--;
				}
			}

			this.score++;
			this.high_score = Math.max(this.score, this.high_score);

			if(this.interval == 0) {
				// const hole_y = Math.floor(Math.random() * (this.config.height - (this.config.hole_size * 2) - this.config.hole_size + 1) + this.config.hole_size);
				const delta_board = 50;
				const hole_position = Math.round(Math.random() * (this.config.height - delta_board * 2 - this.config.hole_size)) + delta_board;
				this.pipes.push(new Pipe(this.config.width, hole_position - this.images.pipetop.height, this.images.pipetop, true, this.config));
				this.pipes.push(new Pipe(this.config.width, hole_position + this.config.hole_size, this.images.pipebottom, false, this.config));
			}

			this.interval++;
			if(this.interval / this.config.tps == this.config.pipe_spawn_rate) {
				this.interval = 0;
			}

			const nearest_pipe = this.pipes.find(pipe => pipe.position.x + this.images.pipetop.width > this.config.bird_x);
			this.target_position = {
				x: nearest_pipe.position.x + this.images.pipetop.width / 2,
				y: nearest_pipe.position.y + this.images.pipetop.height + this.config.hole_size / 2,
			}

			if(!this.birds.some(bird => bird.alive)) {
				this.restart();
			};
		}

		setTimeout(() => {
			this.update();
		}, 1000 / (this.config.tps * this.config.speed_multiplier));
	}

	render() {
		this.ctx.clearRect(0, 0, this.config.width, this.config.height);

		for(let i = 0; i < Math.ceil(this.config.width / this.images.background.width) + 1; i++) {
			this.ctx.drawImage(this.images.background, i * this.images.background.width - Math.floor(this.background_x % this.images.background.width), 0);
		}

		this.renderer.render_pipes(this.pipes, this.images.pipetop, this.images.pipebottom, this.config.debug_mode);

		if(this.config.debug_mode) {
			this.ctx.fillStyle = "darkgreen";
			this.ctx.beginPath();
			this.ctx.arc(this.target_position.x, this.target_position.y, 5, 0, Math.PI * 2);
			this.ctx.fill();
		}

		for(let i = 0; i < this.birds.length; i++) {
			if(this.birds[i].alive) {
				this.renderer.render_bird(this.birds[i], this.images.bird, this.config.animate_bird, this.config.debug_mode);
			}
		}

		const font_size = 20;
		this.ctx.font = `${font_size}px Flappy Bird`;
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;
		this.renderer.draw_text(`Current Score: ${this.score}, High Score: ${this.high_score}`, 10, 20 + this.ctx.lineWidth * 2);
		this.renderer.draw_text(`Alive: ${this.birds.filter(bird => bird.alive).length}/${this.config.generation_size}`, 10, 20 + this.ctx.lineWidth * 2 + font_size);
		this.renderer.draw_text(`Generation: ${this.generation_count}`, 10, 20 + this.ctx.lineWidth * 2 + font_size * 2);

		requestAnimationFrame(() => {
			this.render();
		});
	}
}