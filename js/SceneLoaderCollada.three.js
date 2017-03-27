Scenery = function(path) {
	var model;
	var animations;
	var kfAnimations = [];
	var kfAnimationsLength = 0;
	var loader = new THREE.ColladaLoader();
	var lastTimestamp = 0;
	var progress = 0;
  var scene=worldManager.scene;
  var camera=worldManager.camera;
  var container=worldManager.container;
  var objects = [];
  var scenery = [];
  var instrumentObjects = [];
  var lights = [];
	loader.load('./models/scenery.dae', function(collada) {
		console.log("loaded", collada);
		model = collada.scene;
		model.rotation.x = Math.PI / -2;
		animations = collada.animations;
		kfAnimationsLength = animations.length;
		model.scale.x = model.scale.y = model.scale.z = 0.125; // 1/8 scale, modeled in cm
		init();
		start();
		animate(lastTimestamp);
    worldManager.on('render',function(a){animate(a.time);});
		var nmaterial = new THREE.MeshStandardMaterial({
			color: 0x000000, //specular: 0xffffff,
			metalness: 1,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			// blending: THREE.AdditiveBlending,
			// transparent:true
		});
		var meshes = find(model, "children", "name", /^inst(Sub)*-.+/i);
		for (var a of meshes) {
			a.children[0].material = nmaterial;
		}
		meshes = find(model, "children", "name", /^[decor|pie|inst]*-.+/i);
		for (var a of meshes) {
			a.children[0].castShadow = true;
			a.children[0].receiveShadow = true;
		}
		var lights = find(model, "children", "name", /.*-shadow$/i);
		for (var a of lights) {
			console.log(a.children.length)
			shadowLight = a.children[0];
			console.log(shadowLight);
			shadowLight.castShadow = true;
			var d = 0.6;
			shadowLight.shadow.camera.left = -d;
			shadowLight.shadow.camera.right = d;
			shadowLight.shadow.camera.top = d;
			shadowLight.shadow.camera.bottom = -d;
			shadowLight.shadow.camera.near = 1;
			shadowLight.shadow.camera.far = 2.3;
			shadowLight.shadow.mapSize.width = 2048;
			shadowLight.shadow.mapSize.height = 2048;
			shadowLight.shadow.bias = -0.002;
			scene.add(new THREE.CameraHelper(shadowLight.shadow.camera))
		}
	});

	function init() {
		// camera.position.set(2.6, 1, 0);
		// camera.lookAt(new THREE.Vector3(0, 0.4, 0));
		// // Scene
		// scene = new THREE.Scene();
		// KeyFrame Animations
		for (var i = 0; i < kfAnimationsLength; ++i) {
			var animation = animations[i];
			var kfAnimation = new THREE.KeyFrameAnimation(animation);
			kfAnimation.timeScale = 1;
			kfAnimations.push(kfAnimation);
		}
		// Grid
		// var material = new THREE.LineBasicMaterial( { color: 0x303030 } );
		// var geometry = new THREE.Geometry();
		// var floor = -0.04,
		// 	step = 1,
		// 	size = 14;
		scene.add(model);
		// Lights
		// pointLight = new THREE.PointLight(0xffffff, 0.1);
		// scene.add(pointLight);
		// Renderer
		// renderer = new THREE.WebGLRenderer({
		// 	antialias: true
		// });
		// renderer.setPixelRatio(window.devicePixelRatio);
		// renderer.setSize(window.innerWidth, window.innerHeight);
		// container.appendChild(renderer.domElement);
		// Stats
		// stats = new Stats();
		// container.appendChild(stats.dom);
		// //
		// window.addEventListener('resize', onWindowResize, false);
	}


	function start() {
		for (var i = 0; i < kfAnimationsLength; ++i) {
			var animation = kfAnimations[i];
			for (var h = 0, hl = animation.hierarchy.length; h < hl; h++) {
				var keys = animation.data.hierarchy[h].keys;
				var sids = animation.data.hierarchy[h].sids;
				var obj = animation.hierarchy[h];
				if (keys.length && sids) {
					for (var s = 0; s < sids.length; s++) {
						var sid = sids[s];
						var next = animation.getNextKeyWith(sid, h, 0);
						if (next) next.apply(sid);
					}
					obj.matrixAutoUpdate = false;
					animation.data.hierarchy[h].node.updateMatrix();
					obj.matrixWorldNeedsUpdate = true;
				}
			}
			animation.loop = false;
			animation.play();
		}
	}

	function animate(timestamp) {
		var frameTime = (timestamp - lastTimestamp) * 0.001;
		if (progress >= 0 && progress < 48) {
			for (var i = 0; i < kfAnimationsLength; ++i) {
				kfAnimations[i].update(frameTime);
			}
		} else if (progress >= 48) {
			for (var i = 0; i < kfAnimationsLength; ++i) {
				kfAnimations[i].stop();
			}
			progress = 0;
			start();
		}
		// pointLight.position.copy(camera.position);
		progress += frameTime;
		lastTimestamp = timestamp;
		// renderer.render(scene, camera);
		// stats.update();
		// requestAnimationFrame(animate);
	}
}