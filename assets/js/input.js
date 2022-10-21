import Keyboard from "./KeyboardState.js";
import InputRouter from "./InputRouter.js";
import Jump from "./traits/Jump.js";
import Go from "./traits/Go.js";
import FlagCinematic from "./traits/FlagCinematic.js";
import PipeTraveller from "./traits/PipeTraveller.js";

export function setupKeyboard(window) {
	const input = new Keyboard();
	const router = new InputRouter();
	input.listenTo(window);
	input.addMapping("KeyK", keyState => {
        router.route(entity => {
            entity.jumping = keyState ? true : false;
        });
		if(keyState) {
			router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).start()});
		} else {
			router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).cancel()});
		}
	});

	input.addMapping("KeyJ", keyState => {
    	router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.turbo(keyState)});
	});
	input.addMapping("KeyW", keyState => {
        router.route(entity => {
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.traits.get(PipeTraveller).direction.y += keyState ? -1 : 1;
            }
        });
    });

    input.addMapping("KeyS", keyState => {
        router.route(entity => {
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.shift(entity, keyState);
                entity.traits.get(PipeTraveller).direction.y += keyState ? 1 : -1;
            }
        });
    });

    input.addMapping("KeyD", keyState => {
        router.route(entity => {
            entity.moving = keyState ? true : false;
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.traits.get(Go).dir += keyState ? 1 : -1;
                entity.traits.get(PipeTraveller).direction.x += keyState ? 1 : -1;
            }
        });
    });

    input.addMapping("KeyA", keyState => {
        router.route(entity => {
            entity.moving = keyState ? true : false;
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.traits.get(Go).dir += keyState ? -1 : 1;
                entity.traits.get(PipeTraveller).direction.x += keyState ? -1 : 1;
            }
        });
    });

    input.addMapping("KeyX", keyState => {
        router.route(entity => {
            entity.jumping = keyState ? true : false;
        });
        if(keyState) {
            router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).start()});
        } else {
            router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).cancel()});
        }
    });

    input.addMapping("KeyZ", keyState => {
        router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.turbo(keyState)});
    });

    input.addMapping("Space", keyState => {
        router.route(entity => {
            entity.jumping = keyState ? true : false;
        });
        if(keyState) {
            router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).start()});
        } else {
            router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.traits.get(Jump).cancel()});
        }
    });

    input.addMapping("ShiftLeft", keyState => {
        router.route(entity => {if(entity.traits.get(FlagCinematic).active === false) entity.turbo(keyState)});
    });

    input.addMapping("ArrowUp", keyState => {
        router.route(entity => {
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.traits.get(PipeTraveller).direction.y += keyState ? -1 : 1;
            }
        });
    });

    input.addMapping("ArrowDown", keyState => {
        router.route(entity => {
            if(entity.traits.get(FlagCinematic).active === false) {
                entity.shift(entity, keyState);
                entity.traits.get(PipeTraveller).direction.y += keyState ? 1 : -1;
            }
        });
    });

    input.addMapping("ArrowRight", keyState => {
        router.route(entity => {
            entity.moving = keyState ? true : false;
            if(entity.traits.get(FlagCinematic).active | entity.shifting === false) {
                entity.traits.get(Go).dir += keyState ? 1 : -1;
                entity.traits.get(PipeTraveller).direction.x += keyState ? 1 : -1;
            }
        });
    });

    input.addMapping("ArrowLeft", keyState => {
        router.route(entity => {
            entity.moving = keyState ? true : false;
            if(entity.traits.get(FlagCinematic).active | entity.shifting === false) {
                entity.traits.get(Go).dir += keyState ? -1 : 1;
                entity.traits.get(PipeTraveller).direction.x += keyState ? -1 : 1;
            }
        });
    });

	return router;
}