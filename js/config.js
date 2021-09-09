export class Config {
	constructor() {
		this.width = 500; // Width of the canvas(Canvas dimensions will be changed according to this variable)
		this.height = 500; // Height of the canvas(Canvas dimensions will be changed according to this variable)
		this.bird_x = this.width / 4; // X coordinate of the bird(Never changes)
		this.gravity = 0.3; // How strong gravity is
		this.flap = -6; // How much velocity a flap adds
		this.tps = 60; // How many times per second the game updates(Multiplied by this.speed_multiplier)
		this.pipe_spawn_rate = 1.5; // After how many seconds should a new pipe spawn
		this.pipe_speed = 3; // Speed of the pipe
		this.hole_size = 120; // Size of the hole between the top and bottom pipes
		this.background_speed = 0.5; // Speed of the parallax background
		this.speed_multiplier = 1; // Speed multiplier(Can be used to speed up the game)
		this.debug_mode = false; // If true, the game will show debug information like hitboxes and the nearest hole's center
		this.animate_bird = true; // Should the bird be animated(Change rotation based on velocity)
		this.keybinds = { // Different keybinds for different actions
			flap: " ",
			pause: "p",
		};
		this.ceiling_kills = true; // If true, the bird will die if it touches the ceiling. If not, it will just bump into it
		this.generation_size = 50; // How many birds should be in each generation
		this.only_show_best_bird = false; // Only show the top bird of each generation
	}
}