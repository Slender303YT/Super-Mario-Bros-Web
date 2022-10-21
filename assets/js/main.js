import Timer from "./Timer.js";
import Level from "./Level.js";
import SceneRunner from "./SceneRunner.js";
import Player from "./traits/Player.js";
import Scene from "./Scene.js";
import TimedScene from "./TimedScene.js";
import Killable from "./traits/Killable.js";
import FlagCinematic from "./traits/FlagCinematic.js";
import Go from "./traits/Go.js";
import {createLevelLoader, createMenuLevelLoader, createLevelEditorLoader, createLevelOnlineLoader} from "./loaders/level.js";
import {loadFont} from "./loaders/font.js";
import {loadEntities} from "./entities.js";
import {createPlayerEnv, makePlayer, resetPlayer, bootstrapPlayer, findPlayers, setWorld} from "./player.js";
import {setupKeyboard} from "./input.js";
import {createDashboardLayer} from "./layers/dashboard.js";
import {createPlayerProgressLayer} from "./layers/player-progress.js";
import {createColorLayer} from "./layers/color.js";
import {createTextLayer} from "./layers/text.js";
import {createCollisionLayer} from "./layers/collision.js";
import {mobile} from "./mobile.js";
import Pipe, {connectEntity} from "./traits/Pipe.js";
import PipeTraveller from "./traits/PipeTraveller.js";
import LevelTimer from "./traits/LevelTimer.js";
import {download} from "./generateFile.js";

let canStartGame = true;

function returnDashCoinType(type, dashCoin, canvas) {
	if(type === "overworld") {
        document.body.style.background = "url('assets/images/background.png')";
        canvas.style = "display: block; image-rendering: pixelated; height: 100vh; margin: auto; border: 64px solid; border-image: url('assets/images/border.png') 16; border-image-repeat: repeat; border-top: 0px";
	    dashCoin.type = "overworld";
	} else if(type === "underworld") {
        document.body.style.background = "url('assets/images/background-underworld.png')";
        canvas.style = "display: block; image-rendering: pixelated; height: 100vh; margin: auto; border: 64px solid; border-image: url('assets/images/border-underworld.png') 16; border-image-repeat: repeat; border-top: 0px";
	    dashCoin.type = "underworld";
	} else if(type === "intocastle") {
        document.body.style.background = "url('assets/images/background-intocastle.png')";
        canvas.style = "display: block; image-rendering: pixelated; height: 100vh; margin: auto; border: 64px solid; border-image: url('assets/images/border-intocastle.png') 16; border-image-repeat: repeat; border-top: 0px";
	    dashCoin.type = "intocastle";
	}
}

async function main(canvas) {
    var selectedBlock = "ground";
    var selectedLayer = 3;
    var selectedCollision = "ground";
    var isInEditor = false;
    var testing = false;
    var levelArrayLE = {
        "spriteSheet": "overworld",
        "musicSheet": "overworld",
        "patternSheet": "overworld-pattern",
        "leveldepth": 212,
        "playerX": 48,
        "playerY": 192,
        "layers": [
            {
                "dontDrawInEditor": true,
                "tiles": [
                    {
                        "name": "sky",
                        "ranges": [
                            [
                                0, 212,
                                0, 13
                            ]
                        ]
                    },
                    {
                        "name": "ground",
                        "type": "ground",
                        "ranges": [
                            [
                                0, 212,
                                13, 2
                            ]
                        ]
                    }
                ]
            },
            {
                "tiles": [
                    {
                        "pattern": "plant1-big",
                        "ranges": [
                            [0, 10],
                            [48, 10],
                            [96, 10],
                            [143, 10],
                            [190, 10]
                        ]
                    },
                    {
                        "pattern": "plant2-3w",
                        "ranges": [
                            [11, 12],
                            [59, 12],
                            [107, 12],
                            [136, 12],
                            [154, 12],
                            [201, 12]
                        ]
                    },
                    {
                        "pattern": "plant1-tiny",
                        "ranges": [
                            [16, 11],
                            [64, 11],
                            [112, 11],
                            [159, 11],
                            [206, 11]
                        ]
                    },
                    {
                        "pattern": "plant2",
                        "ranges": [
                            [23, 12],
                            [166, 12]
                        ]
                    },
                    {
                        "pattern": "plant2-2w",
                        "ranges": [
                            [41, 12],
                            [71, 12],
                            [89, 12],
                            [119, 12]
                        ]
                    },
                    {
                        "pattern": "cloud-single",
                        "ranges": [
                            [8, 3],

                            [19, 2],

                            [56, 3],

                            [67, 2],

                            [103, 3],

                            [114, 2],

                            [151, 3],

                            [162, 2],

                            [198, 3]
                        ]
                    },
                    {
                        "pattern": "cloud-two",
                        "ranges": [
                            [36, 2],

                            [84, 2],

                            [132, 2],

                            [178, 2]
                        ]
                    },
                    {
                       "pattern": "cloud-three",
                        "ranges": [
                            [27, 2],

                            [75, 3],

                            [122, 3],

                            [169, 3]
                        ] 
                    },
                    {
                        "name": "chocolate",
                        "type": "ground",
                        "ranges": [
                            [196, 12]
                        ]
                    },
                    {
                        "pattern": "goal",
                        "ranges": [
                            [196, 0]
                        ]
                    },
                    {
                        "pattern": "castle",
                        "ranges": [
                            [200, 8]
                        ]
                    }
                ]
            },
            {
                "tiles": [
                    {
                        "name": "sky",
                        "ranges": [
                            [0, 512]
                        ]
                    }
                ]
            },
            {
                "tiles": [
                    {
                        "name": "ground",
                        "type": "ground",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "bricks-top",
                        "type": "ground",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "bricks",
                        "type": "ground",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "chocolate",
                        "type": "ground",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "animation": "coin",
                        "type": "coin",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "animation": "chance",
                        "type": "PC",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "animation": "chance",
                        "type": "PB",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "animation": "chance",
                        "type": "P1UP",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "bricks-top",
                        "type": "PC",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "bricks-top",
                        "type": "PB",
                        "ranges": [
                            [0, 512]
                        ]
                    },
                    {
                        "name": "bricks-top",
                        "type": "P1UP",
                        "ranges": [
                            [0, 512]
                        ]
                    }
                ]
            },
            
            {
                "tiles": [

                ]
            }
        ],
        "entities": [
            
        ],
        "triggers": [
            
        ],
        "checkpoints": [
            
        ]
    };
    var selectedBlockIndex = 0;
	const videoCtx = canvas.getContext("2d");
	const audioCtx = new AudioContext();
	const [entityFactory, font] = await Promise.all([
		loadEntities(audioCtx),
		loadFont()
	]);
    const gameState = {
        "players": [
        ]
    }
	const dashboardCoin = entityFactory.dashCoin();
	const loadLevel = await createLevelLoader(entityFactory);
    const loadOnlineLevel = await createLevelOnlineLoader(entityFactory, levelData);
	const loadMenuLevel = await createMenuLevelLoader(entityFactory);
    const loadLevelEditorLevel = await createLevelEditorLoader(entityFactory);
	const sceneRunner = new SceneRunner();
    const players = [];
	var mario = entityFactory.mario();
    var selectedType = "normal", stEntity = null;
	if(localStorage.getItem("username")) {
        makePlayer(mario, localStorage.getItem("username"));
    } else {
        makePlayer(mario, "MARIO");
    }
	mobile.setup();

	function createLoadingScreen(name) {
        const scene = new Scene();
        scene.comp.layers.push(createColorLayer("#000"));
        scene.comp.layers.push(createTextLayer(font, `Loading ${name}`));
        return scene;
    }

	async function setupLevel(name) {
        if(pol === true) {
            name = levelName;
        }
        const loadingScreen = createLoadingScreen(name);
        sceneRunner.addScene(loadingScreen);
        sceneRunner.runNext();
        var level = null;
        if(pol === false) {
            level = await loadLevel(name);
        } else if(pol === true) {
            level = await loadOnlineLevel();
        }
        bootstrapPlayer(mario, level);
        mario.starTime = false;
        mario.traits.get(Go).acceleration = 400;
        mario.traits.get(FlagCinematic).canDir = true;
        mario.traits.get(FlagCinematic).reset();
        if(urlParams.get("ld") != null) {
            setWorld(mario, levelName);
        }
        if(name != mario.levelName) {
            mario.pos.x = level.variables[2];
            if(mario.powerup === "big") {
                 mario.pos.y = level.variables[1] - 16 + 1;
            } else {
                mario.pos.y = level.variables[1] + 1;
            }
            mario.traspassedCheckpoint = false;
            mario.levelName = name;
        }
        if(mario.traspassedCheckpoint === false) {
            mario.pos.x = level.variables[2];
            if(mario.powerup === "big") {
                 mario.pos.y = level.variables[1] - 16 + 1;
            } else {
                mario.pos.y = level.variables[1] + 1;
            }
        }
		mario.vel.set(0, 0);
        level.events.listen(Level.EVENT_TRIGGER, (spec, _, touches) => {
            if(spec.type === "goto") {
                for (const _ of findPlayers(touches)) {
                    mario.traits.get(FlagCinematic).canDir = false;
                    mario.traits.get(Go).acceleration = 0;
                    startWorld(spec.name);
                    return;
                }
            }
            if(spec.type === "flag") {
                for (const player of findPlayers(touches)) {
                    player.traits.get(FlagCinematic).active = true;
                    return;
                }
            }
        });
        level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async pipe => {
            if (pipe.props.goesTo) {
                const nextLevel = await setupLevel(pipe.props.goesTo.name);
		        returnDashCoinType(nextLevel.type, dashboardCoin, canvas);
		        nextLevel.entities.add(dashboardCoin);
                sceneRunner.addScene(nextLevel);
                sceneRunner.runNext();
                mario.traits.get(PipeTraveller).inPipe = false;
                if (pipe.props.backTo) {
                    nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
                        const level = await setupLevel(name);
                        const exitPipe = level.entities.get(pipe.props.backTo);
                        setTimeout(() => {
                        	mario.traits.get(PipeTraveller).inPipe = false;
                        }, 5000);
                        returnDashCoinType(level.type, dashboardCoin, canvas);
				        level.entities.add(dashboardCoin);
                        mario.pos.x = exitPipe.pos.x + 4;
                        connectEntity(exitPipe, mario);
                        sceneRunner.addScene(level);
                        sceneRunner.runNext();
                    });
                }
            } else {
                level.events.emit(Level.EVENT_COMPLETE);
            }
        });

        const dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);
        level.comp.layers.push(dashboardLayer);
        //level.comp.layers.push(createCollisionLayer(level));

        return level;
    }

    async function setupLETestLevel(loadLevelEditorTestLevel) {
        const name = "Test";
        const loadingScreen = createLoadingScreen(name);
        sceneRunner.addScene(loadingScreen);
        sceneRunner.runNext();
        var level = loadLevelEditorTestLevel();
        bootstrapPlayer(mario, level);
        mario.starTime = false;
        mario.traits.get(Go).acceleration = 400;
        mario.traits.get(FlagCinematic).canDir = true;
        mario.traits.get(FlagCinematic).reset();
        if(urlParams.get("ld") != null) {
            setWorld(mario, levelName);
        }
        if(name != mario.levelName) {
            mario.pos.x = level.variables[2];
            if(mario.powerup === "big") {
                 mario.pos.y = level.variables[1] - 16 + 1;
            } else {
                mario.pos.y = level.variables[1] + 1;
            }
            mario.traspassedCheckpoint = false;
            mario.levelName = name;
        }
        if(mario.traspassedCheckpoint === false) {
            mario.pos.x = level.variables[2];
            if(mario.powerup === "big") {
                 mario.pos.y = level.variables[1] - 16 + 1;
            } else {
                mario.pos.y = level.variables[1] + 1;
            }
        }
        mario.vel.set(0, 0);
        level.events.listen(Level.EVENT_TRIGGER, (spec, _, touches) => {
            if(spec.type === "goto") {
                for (const _ of findPlayers(touches)) {
                    mario.traits.get(FlagCinematic).canDir = false;
                    mario.traits.get(Go).acceleration = 0;
                    startWorld(spec.name);
                    return;
                }
            }
            if(spec.type === "flag") {
                for (const player of findPlayers(touches)) {
                    player.traits.get(FlagCinematic).active = true;
                    return;
                }
            }
        });
        level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async pipe => {
            if (pipe.props.goesTo) {
                const nextLevel = await setupLevel(pipe.props.goesTo.name);
                returnDashCoinType(nextLevel.type, dashboardCoin, canvas);
                nextLevel.entities.add(dashboardCoin);
                sceneRunner.addScene(nextLevel);
                sceneRunner.runNext();
                mario.traits.get(PipeTraveller).inPipe = false;
                if (pipe.props.backTo) {
                    nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
                        const level = await setupLevel(name);
                        const exitPipe = level.entities.get(pipe.props.backTo);
                        setTimeout(() => {
                            mario.traits.get(PipeTraveller).inPipe = false;
                        }, 5000);
                        returnDashCoinType(level.type, dashboardCoin, canvas);
                        level.entities.add(dashboardCoin);
                        mario.pos.x = exitPipe.pos.x + 4;
                        connectEntity(exitPipe, mario);
                        sceneRunner.addScene(level);
                        sceneRunner.runNext();
                    });
                }
            } else {
                level.events.emit(Level.EVENT_COMPLETE);
            }
        });

        const dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);
        level.comp.layers.push(dashboardLayer);
        //level.comp.layers.push(createCollisionLayer(level));

        return level;
    }

    async function setupMenuBg(name) {
        const level = await loadMenuLevel(name);

        const dashboardLayer = createDashboardLayer(font, mario, dashboardCoin, true);
        level.comp.layers.push(dashboardLayer);

        return level;
    }

    async function setupLevelEditor() {
        const level = await loadLevelEditorLevel("editorEmpty");

        return level;
    }

    async function loadLevelEditorLevelFunc(name) {
        const level = await loadLevelEditorLevel(name);

        return level;
    }

	async function startWorld(name) {
        const level = await setupLevel(name);
        resetPlayer(mario, name);
        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);

        const waitScreen = new TimedScene();
        waitScreen.countDown = 2;
        dashboardCoin.type = "underworld";
        waitScreen.events.listen(Scene.EVENT_COMPLETE, () => {
        	returnDashCoinType(level.type, dashboardCoin, canvas);
        });
        level.entities.add(dashboardCoin);
        waitScreen.comp.layers.push(createColorLayer('#000'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);

        sceneRunner.addScene(waitScreen);
        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    async function startLETestingLevel() {
        const level = await setupLETestLevel();
        resetPlayer(mario, name);
        const playerProgressLayer = createPlayerProgressLayer(font, level);
        const dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);

        const waitScreen = new TimedScene();
        waitScreen.countDown = 2;
        dashboardCoin.type = "underworld";
        waitScreen.events.listen(Scene.EVENT_COMPLETE, () => {
            returnDashCoinType(level.type, dashboardCoin, canvas);
        });
        level.entities.add(dashboardCoin);
        waitScreen.comp.layers.push(createColorLayer('#000'));
        waitScreen.comp.layers.push(dashboardLayer);
        waitScreen.comp.layers.push(playerProgressLayer);

        sceneRunner.addScene(waitScreen);
        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    async function startMenu(name) {
    	const logo = entityFactory.logo();
    	const logo2 = entityFactory.logo();
    	const logo3 = entityFactory.logo();
    	const logo4 = entityFactory.logo();
    	const logo5 = entityFactory.logo();
    	const logo6 = entityFactory.logo();
        const st = entityFactory.st();
    	logo2.type = 2;
    	logo3.type = 3;
    	logo4.type = 4;
    	logo5.type = 5;
    	logo6.type = 6;
    	const logoX = 40;
    	const logoY = 36;
    	logo.pos.set(logoX, logoY);
    	logo2.pos.set(logoX + 64, logoY);
    	logo3.pos.set(logoX + 128, logoY);
    	logo4.pos.set(logoX, logoY + 64);
    	logo5.pos.set(logoX + 64, logoY + 64);
    	logo6.pos.set(logoX + 128, logoY + 64);
        st.pos.x = 40;
        st.pos.y = 148;
        stEntity = st;
        const level = await setupMenuBg(name);
        mario.pos.set(48, 192);
        resetPlayer(mario, name, true);
        dashboardCoin.type = "underworld";
        returnDashCoinType(level.type, dashboardCoin, canvas);
        level.entities.add(dashboardCoin);
        level.entities.add(logo);
        level.entities.add(logo2);
        level.entities.add(logo3);
        level.entities.add(logo4);
        level.entities.add(logo5);
        level.entities.add(logo6);
        level.entities.add(st);

        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    const gameCtx = {
        audioCtx,
        videoCtx,
        entityFactory,
        deltaTime: null,
        mario,
        levelArrayLE,
        isInEditor,
        lemcspeed: 250
    };

    async function startLevelEditor() {
        isInEditor = true;
        const handleLEButtons = (e) => {
            switch(e.keyCode) {
                case 32:
                    if(testing == false) {
                        mario = entityFactory.mario();
                        const loadLevelEditorTestLevel = createLevelOnlineLoader(entityFactory, levelArrayLE);
                        console.log(loadLevelEditorTestLevel);
                        const name = "Test";
                        const loadingScreen = createLoadingScreen(name);
                        sceneRunner.addScene(loadingScreen);
                        sceneRunner.runNext();
                        Promise.all([loadLevelEditorTestLevel()]).then(([level]) => {
                            bootstrapPlayer(mario, level);
                            mario.starTime = false;
                            mario.traits.get(Go).acceleration = 400;
                            mario.traits.get(FlagCinematic).canDir = true;
                            mario.traits.get(FlagCinematic).reset();
                            if(urlParams.get("ld") != null) {
                                setWorld(mario, name);
                            }
                            if(name != mario.name) {
                                mario.pos.x = level.variables[2];
                                if(mario.powerup === "big") {
                                     mario.pos.y = level.variables[1] - 16 + 1;
                                } else {
                                    mario.pos.y = level.variables[1] + 1;
                                }
                                mario.traspassedCheckpoint = false;
                                mario.name = name;
                            }
                            if(mario.traspassedCheckpoint === false) {
                                mario.pos.x = level.variables[2];
                                if(mario.powerup === "big") {
                                     mario.pos.y = level.variables[1] - 16 + 1;
                                } else {
                                    mario.pos.y = level.variables[1] + 1;
                                }
                            }
                            mario.vel.set(0, 0);
                            level.events.listen(Level.EVENT_TRIGGER, (spec, _, touches) => {
                                if(spec.type === "goto") {
                                    for (const _ of findPlayers(touches)) {
                                        mario.traits.get(FlagCinematic).canDir = false;
                                        mario.traits.get(Go).acceleration = 0;
                                        startWorld(spec.name);
                                        return;
                                    }
                                }
                                if(spec.type === "flag") {
                                    for (const player of findPlayers(touches)) {
                                        player.traits.get(FlagCinematic).active = true;
                                        return;
                                    }
                                }
                            });
                            level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async pipe => {
                                if (pipe.props.goesTo) {
                                    const nextLevel = await setupLevel(pipe.props.goesTo.name);
                                    returnDashCoinType(nextLevel.type, dashboardCoin, canvas);
                                    nextLevel.entities.add(dashboardCoin);
                                    sceneRunner.addScene(nextLevel);
                                    sceneRunner.runNext();
                                    mario.traits.get(PipeTraveller).inPipe = false;
                                    if (pipe.props.backTo) {
                                        nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
                                            const level = await setupLevel(name);
                                            const exitPipe = level.entities.get(pipe.props.backTo);
                                            setTimeout(() => {
                                                mario.traits.get(PipeTraveller).inPipe = false;
                                            }, 5000);
                                            returnDashCoinType(level.type, dashboardCoin, canvas);
                                            level.entities.add(dashboardCoin);
                                            mario.pos.x = exitPipe.pos.x + 4;
                                            connectEntity(exitPipe, mario);
                                            sceneRunner.addScene(level);
                                            sceneRunner.runNext();
                                        });
                                    }
                                } else {
                                    level.events.emit(Level.EVENT_COMPLETE);
                                }
                            });

                            let dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);
                            level.comp.layers.push(dashboardLayer);
                            resetPlayer(mario, "Test");
                            const playerProgressLayer = createPlayerProgressLayer(font, level);
                            dashboardLayer = createDashboardLayer(font, mario, dashboardCoin);

                            const waitScreen = new TimedScene();
                            waitScreen.countDown = 2;
                            dashboardCoin.type = "underworld";
                            waitScreen.events.listen(Scene.EVENT_COMPLETE, () => {
                                returnDashCoinType(level.type, dashboardCoin, canvas);
                            });
                            level.entities.add(dashboardCoin);
                            waitScreen.comp.layers.push(createColorLayer('#000'));
                            waitScreen.comp.layers.push(dashboardLayer);
                            waitScreen.comp.layers.push(playerProgressLayer);

                            sceneRunner.addScene(waitScreen);
                            sceneRunner.addScene(level);
                            sceneRunner.runNext();
                            testing = true;
                        });
                    }
                break;
            }
        };
        document.addEventListener("keydown", handleLEButtons);
        const loadingScreen = createLoadingScreen("LEVEL EDITOR");
        sceneRunner.addScene(loadingScreen);
        sceneRunner.runNext();
        const level = await setupLevelEditor();
        mario.pos.set(48, 192);
        resetPlayer(mario, name, true);
        const blocksDiv = document.createElement("div");
        blocksDiv.style = "position: absolute; width: 384px; height: 64px";
        blocksDiv.style.top = window.innerHeight - 64 + "px";
        blocksDiv.style.left = window.innerWidth / 2 - 192 + "px";
        const collisionsDiv = document.createElement("div");
        collisionsDiv.style = "position: absolute; width: 256px; height: 64px; top: 0px; ";
        collisionsDiv.style.left = window.innerWidth / 2 - 128 + "px";
        // Blocks
        const block1 = document.createElement("div");
        block1.id = "block1";
        block1.style = "width: 64px; height: 64px";
        block1.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const block2 = document.createElement("div");
        block2.id = "block2";
        block2.style = "width: 64px; height: 64px; margin-left: 64px; margin-top: -64px;";
        block2.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const block3 = document.createElement("div");
        block3.id = "block3";
        block3.style = "width: 64px; height: 64px; margin-left: 128px; margin-top: -64px;";
        block3.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const block4 = document.createElement("div");
        block4.id = "block4";
        block4.style = "width: 64px; height: 64px; margin-left: 192px; margin-top: -64px;";
        block4.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const block5 = document.createElement("div");
        block5.id = "block5";
        block5.style = "width: 64px; height: 64px; margin-left: 256px; margin-top: -64px;";
        block5.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const block6 = document.createElement("div");
        block6.id = "block6";
        block6.style = "width: 64px; height: 64px; margin-left: 320px; margin-top: -64px;";
        block6.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        //const blocks = document.createElement("div");
        //blocks.id = "blocks";
        //blocks.style = "width: 72px; height: 72px; margin-left: 320px; margin-top: -64px;";
        //blocks.style.background = "url('assets/images/leveleditor/blockSelectedmarcui.png')";
        blocksDiv.appendChild(block1);
        blocksDiv.appendChild(block2);
        blocksDiv.appendChild(block3);
        blocksDiv.appendChild(block4);
        blocksDiv.appendChild(block5);
        blocksDiv.appendChild(block6);
        //blocksDiv.appendChild(blocks);
        // Select Blocks
        const blocku1 = document.createElement("div");
        blocku1.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku1.style.background = "url('assets/images/leveleditor/ground.png')";
        const blocku2 = document.createElement("div");
        blocku2.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku2.style.background = "url('assets/images/leveleditor/bricks-top.png')";
        const blocku3 = document.createElement("div");
        blocku3.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku3.style.background = "url('assets/images/leveleditor/bricks.png')";
        const blocku4 = document.createElement("div");
        blocku4.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku4.style.background = "url('assets/images/leveleditor/chocolate.png')";
        const blocku5 = document.createElement("div");
        blocku5.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku5.style.background = "url('assets/images/leveleditor/pc.png')";
        const blocku6 = document.createElement("div");
        blocku6.style = "width: 32px; height: 32px; margin-left: 16px;";
        blocku6.style.background = "url('assets/images/leveleditor/chance.png')";
        const br1 = document.createElement("br");
        const br2 = document.createElement("br");
        const br3 = document.createElement("br");
        const br4 = document.createElement("br");
        const br5 = document.createElement("br");
        const br6 = document.createElement("br");
        block1.appendChild(br1);
        block1.appendChild(blocku1);
        block2.appendChild(br2);
        block2.appendChild(blocku2);
        block3.appendChild(br3);
        block3.appendChild(blocku3);
        block4.appendChild(br4);
        block4.appendChild(blocku4);
        block5.appendChild(br5);
        block5.appendChild(blocku5);
        block6.appendChild(br6);
        block6.appendChild(blocku6);
        // Coliisions
        const collision1 = document.createElement("div");
        collision1.id = "collision1";
        collision1.style = "width: 64px; height: 64px";
        collision1.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const collision2 = document.createElement("div");
        collision2.id = "collision2";
        collision2.style = "width: 64px; height: 64px; margin-left: 64px; margin-top: -64px;";
        collision2.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const collision3 = document.createElement("div");
        collision3.id = "collision3";
        collision3.style = "width: 64px; height: 64px; margin-left: 128px; margin-top: -64px;";
        collision3.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        const collision4 = document.createElement("div");
        collision4.id = "block4";
        collision4.style = "width: 64px; height: 64px; margin-left: 192px; margin-top: -64px;";
        collision4.style.background = "url('assets/images/leveleditor/blockMarcui.png')";
        collisionsDiv.appendChild(collision1);
        collisionsDiv.appendChild(collision2);
        collisionsDiv.appendChild(collision3);
        collisionsDiv.appendChild(collision4);
        // Select Collisions
        const collisionu1 = document.createElement("div");
        collisionu1.style = "width: 32px; height: 32px; margin-left: 16px;";
        collisionu1.style.background = "url('assets/images/leveleditor/ground.png')";
        const collisionu2 = document.createElement("div");
        collisionu2.style = "width: 32px; height: 32px; margin-left: 16px;";
        collisionu2.style.background = "url('assets/images/leveleditor/pc.png')";
        const collisionu3 = document.createElement("div");
        collisionu3.style = "width: 32px; height: 32px; margin-left: 16px;";
        collisionu3.style.background = "url('assets/images/leveleditor/pb.png')";
        const collisionu4 = document.createElement("div");
        collisionu4.style = "width: 32px; height: 32px; margin-left: 16px;";
        collisionu4.style.background = "url('assets/images/leveleditor/p1up.png')";
        const br1u = document.createElement("br");
        const br2u = document.createElement("br");
        const br3u = document.createElement("br");
        const br4u = document.createElement("br");
        collision1.appendChild(br1u);
        collision1.appendChild(collisionu1);
        collision2.appendChild(br2u);
        collision2.appendChild(collisionu2);
        collision3.appendChild(br3u);
        collision3.appendChild(collisionu3);
        collision4.appendChild(br4u);
        collision4.appendChild(collisionu4);
        // Buttons
        const downloadButton = document.createElement("button");
        downloadButton.innerText = "Download Level";
        downloadButton.id = "downloadButton";
        downloadButton.style = "position: absolute; ";
        downloadButton.style.left = "0px";
        downloadButton.style.top = "0px";
        const loadLevelButton = document.createElement("input");
        loadLevelButton.type = "file";
        loadLevelButton.name = "code";
        loadLevelButton.id = "code";
        loadLevelButton.multiple = "false";
        loadLevelButton.style = "position: absolute; ";
        loadLevelButton.style.left = "0px";
        loadLevelButton.style.top = "32px";
        document.body.appendChild(downloadButton);
        document.body.appendChild(loadLevelButton);
        function same(v1, v2) {
            if(v1 === v2) {
                return true;
            } else {
                return false;
            }
        }
        let lastEvent;
        let mouse = "mouseup";
        let canClick = true;
        let removeBlock = false;
        let pushed = false;
        block1.addEventListener("click", () => {
            selectedBlock = "ground";
            selectedBlockIndex = 0;
        });
        block2.addEventListener("click", () => {
            selectedBlock = "bricks-top";
            selectedBlockIndex = 1;
        });
        block3.addEventListener("click", () => {
            selectedBlock = "bricks";
            selectedBlockIndex = 2;
        });
        block4.addEventListener("click", () => {
            selectedBlock = "chocolate";
            selectedBlockIndex = 3;
        });
        block5.addEventListener("click", () => {
            selectedBlock = "coin";
            selectedBlockIndex = 4;
        });
        block6.addEventListener("click", () => {
            selectedBlock = "chance";
            selectedBlockIndex = 5;
        });
        collision1.addEventListener("click", () => {
            selectedCollision = "ground";
        });
        collision2.addEventListener("click", () => {
            selectedCollision = "pc";
        });
        collision3.addEventListener("click", () => {
            selectedCollision = "pb";
        });
        collision4.addEventListener("click", () => {
            selectedCollision = "p1up";
        });
        downloadButton.addEventListener("click", () => {
            download("level.json", JSON.stringify(levelArrayLE), "json");
        });
        function read(e) {
            var file = e.target.files[0];
            if(!file) {
                return "";
            }

            var reader = new FileReader();
            reader.onload = e => {
                var content = e.target.result;
                levelArrayLE = content;
            };
            reader.readAsText(file);
        }
        var divideBy = Math.floor(window.innerWidth / 31);
        window.addEventListener("resize", () => {
            blocksDiv.style.left = window.innerWidth / 2 - 128 + "px";
            collisionsDiv.style.left = window.innerWidth / 2 - 128 + "px";
            divideBy = Math.floor(window.innerWidth / 31);
        });

        loadLevelButton.addEventListener("change", read, false);
        ["mousedown", "mousemove", "mouseup"].forEach(eventName => {
            canvas.addEventListener(eventName, event => {
                if(eventName === "mousedown" || eventName === "mouseup") mouse = eventName;
                if(mouse === "mouseup" && canClick === false) {
                    canClick = true;
                    pushed = false;
                }
                if(mouse === "mousedown" && canClick === true) {
                    canClick = false;
                    if(pushed === false) {
                        var x = Math.floor((event.offsetX / divideBy) + (level.camera.pos.x / 16)), y = Math.floor((event.offsetY / divideBy));
                        if(x != null && y != null) {
                            if(removeBlock === false) {
                                if(selectedBlock === "chance") {
                                    if(selectedCollision === "pc") {
                                        selectedBlockIndex = 5;
                                    }
                                    if(selectedCollision === "pb") {
                                        selectedBlockIndex = 6;
                                    }
                                    if(selectedCollision === "p1up") {
                                        selectedBlockIndex = 7;
                                    }
                                }
                                if(selectedBlock === "bricks-top") {
                                    if(selectedCollision === "pc") {
                                        selectedBlockIndex = 8;
                                    }
                                    if(selectedCollision === "pb") {
                                        selectedBlockIndex = 9;
                                    }
                                    if(selectedCollision === "p1up") {
                                        selectedBlockIndex = 10;
                                    }
                                }
                                levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges.push([x, y]);
                            } else if(removeBlock === true) {
                                if(y < 13) {
                                    for(var i = 0; i < levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges.length; i++) {
                                        if(levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] != undefined) {
                                            if(levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i][0] === x && levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i][1] === y) {
                                                delete levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i];
                                                const stringifyedLevel = JSON.stringify(levelArrayLE);
                                                const stringifyedParsedLevel = JSON.parse(stringifyedLevel);
                                                if(stringifyedParsedLevel.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] === null) {
                                                    stringifyedParsedLevel.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] = [0, 512];
                                                    levelArrayLE = stringifyedParsedLevel;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    for(var i = 0; i < levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges.length; i++) {
                                        if(levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] != undefined) {
                                            if(levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i][0] === x && levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i][1] === y) {
                                                delete levelArrayLE.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i];
                                                const stringifyedLevel = JSON.stringify(levelArrayLE);
                                                const stringifyedParsedLevel = JSON.parse(stringifyedLevel);
                                                if(stringifyedParsedLevel.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] === null) {
                                                    stringifyedParsedLevel.layers[selectedLayer].tiles[selectedBlockIndex].ranges[i] = [0, 512];
                                                    levelArrayLE = stringifyedParsedLevel;
                                                }
                                            }
                                        }
                                    }
                                    levelArrayLE.layers[2].tiles[0].ranges.push([x, y]);
                                }
                            }
                        }
                    }
                }
                lastEvent = event;
            });
        });

        canvas.addEventListener("contextmenu", event => {
            event.preventDefault();
        });

        function leKeys(e) {
            switch(e.keyCode) {
                case 37:
                    if(level.camera.pos.x >= 16) {
                        level.camera.pos.x -= gameCtx.lemcspeed * gameCtx.deltaTime;
                    }
                break;

                case 39:
                    level.camera.pos.x += gameCtx.lemcspeed * gameCtx.deltaTime;
                break;

                case 17:
                    removeBlock = true;
                break;
            }
        }

        function leKeysR(e) {
            switch(e.keyCode) {
                case 17:
                    removeBlock = false;
                break;
            }
        }

        document.addEventListener("keydown", leKeys);
        document.addEventListener("keyup", leKeysR);

        document.body.appendChild(blocksDiv);
        document.body.appendChild(collisionsDiv);

        sceneRunner.addScene(level);
        sceneRunner.runNext();
    }

    const ups = 30;
	const timer = new Timer(1/ups);
	timer.update = function update(deltaTime) {
		gameCtx.deltaTime = deltaTime;
        gameCtx.mario = mario;
        gameCtx.levelArrayLE = levelArrayLE;
        gameCtx.isInEditor = isInEditor;
		sceneRunner.update(gameCtx);
        if(stEntity != null) {
            if(selectedType === "normal") {
                stEntity.pos.y = 148;
            } else if(selectedType === "glitchedLevels") {
                stEntity.pos.y = 160;
            } else if(selectedType === "leveleditor") {
                stEntity.pos.y = 172;
            }
        }
		if(mobile.isInMobile === true) {
            if(mobile.pressedAnyButton === true && canStartGame === true) {
                canStartGame = false;
                stIn();
            }
			mobile.mobileUpdate(gameCtx);
		}
	};
	timer.start();
	window.runLevel = startWorld;
    if(pol === false) {
        if(Math.random(15) >= 0.35) {
            startMenu("1-1");
        } else {
            startMenu("É-1");
        }
    } else {
        const inputRouter = setupKeyboard(window);
        inputRouter.addReceiver(mario);
        startWorld(levelName);
    }
    const stIn = e => {
        switch(e.keyCode) {
            case 32:
                document.removeEventListener("keydown", stIn);
                const inputRouter = setupKeyboard(window);
                inputRouter.addReceiver(mario);
                if(selectedType === "normal") {
                    stEntity = null;
                    startWorld("1-1");
                } else if(selectedType === "glitchedLevels") {
                    stEntity = null;
                    //startWorld("É-1");
                    startWorld("ô-█");
                } else if(selectedType === "leveleditor") {
                    stEntity = null;
                    startLevelEditor();
                }
            break;
            case 38:
                if(selectedType === "normal") {
                    selectedType = "leveleditor";
                } else if(selectedType === "glitchedLevels") {
                    selectedType = "normal";
                } else if(selectedType === "leveleditor") {
                    selectedType = "glitchedLevels";
                }
            break;
            case 40:
                if(selectedType === "normal") {
                    selectedType = "glitchedLevels";
                } else if(selectedType === "glitchedLevels") {
                    selectedType = "leveleditor";
                } else if(selectedType === "leveleditor") {
                    selectedType = "normal";
                }
            break;
        }
    }
    if(pol === false) {
        document.addEventListener("keydown", stIn);
    }
    document.body.removeChild(document.getElementById("pleasewait"));
    gameState.players.push(mario);
}

const asdg = ["logo", "controls", "playGame", "updatesButton", "bugreportButton", "uploadlevelbutton", "searchlevelbutton", "onlinelevels", "username", "submitUsernameButton", "br1", "br2", "br3", "br4", "br5", "br6", "br7", "br8", "br9", "br10", "registeraccountbutton", "loginaccountbutton", "cn"];

const start = () => {
	document.getElementById("playGame").removeEventListener("click", start);
    document.getElementById("pleasewait").style.display = "inline-block";
    asdg.forEach(id => {
        if(document.getElementById(id) != null) document.body.removeChild(document.getElementById(id));
    });
    //document.body.style = "overflow: hidden;";
    const canvas = document.createElement("canvas");
    canvas.style = "display: block; image-rendering: pixelated; height: 100vh; margin: auto; border: 64px solid; border-image: url('assets/images/border.png') 16; border-image-repeat: repeat; border-top: 0px";
    canvas.width = 256;
    canvas.height = 240;
    document.body.appendChild(canvas);
	main(canvas);
};

document.getElementById("playGame").addEventListener("click", start);
document.querySelectorAll("button#onlinePlayGame").forEach(button => button.addEventListener("click", start));