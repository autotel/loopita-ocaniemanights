'use strict';
function find(obj,through,property,value,recursion){
  var rets=[];
  if(!recursion){
    var recursion=0;
    // console.log("find objs whose "+property+" is "+value+" recursively through "+through);
  }
  var tabbing="";
  for(var a=0; a<recursion; a++){
    tabbing+=" ";
  }

  if(recursion>20){
    // console.log(tabbing+"reached recursion limit here");
    return false;
  }else{
    // if(obj.children){
    for(var a in obj[through]){
      // console.log(tabbing+"+"+obj[through][a][property]);
      rets =rets.concat(find(obj[through][a],through,property,value,recursion+1));
      if(obj[through][a][property].match(value)){
        // console.log(tabbing+" ->returning");
        rets.push(obj[through][a]);
      }
    }
    // }
  }
  return rets;
}
var colladaLoadedModel=[];
var Scenery = function(path,loadCallback) {
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
  var thisScenery=this;
  this.objects = [];
  this.building = [];
  this.instrumentObjects = [];
  this.instrumentStands=[];
  this.lights = [];

	loader.load(path, function(collada) {
		// console.log("loaded", collada);
		model = collada.scene;
    colladaLoadedModel=model;
    thisScenery.model=model;
		model.rotation.x = Math.PI / -2;
    model.scale.x = model.scale.y = model.scale.z = 0.125; // 1/8 scale, modeled in cm
    console.log("model scaled and rotated");
		animations = collada.animations;
		kfAnimationsLength = animations.length;
		init();
		start();
		animate(lastTimestamp);

    thisScenery.camera = find(model, "children", "name", "Camera");
    console.log("camera:",thisScenery.camera);


    worldManager.on('render',function(a){animate(a.time);});
		var nmaterial = new THREE.MeshStandardMaterial({
			color: 0x000000, //specular: 0xffffff,
			metalness: 1,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			// blending: THREE.AdditiveBlending,
			// transparent:true
		});

		thisScenery.instrumentObjects = find(model, "children", "name", /^inst(Sub)*-.+/i);
    thisScenery.instrumentStands = find(model, "children", "name", /^pie-.+/);
		for (var a of thisScenery.objects) {
			a.children[0].material = nmaterial;
		}


    thisScenery.building = find(model, "children", "name", /^building-.+/i);
		for (var a of thisScenery.building) {
      a.activateShadow=function(helper){
        console.log("activate shadow of "+a.name);
  			a.children[0].castShadow = true;
  			a.children[0].receiveShadow = true;
      }
		}

    thisScenery.cubes = find(model, "children", "name", /^cube-.+/i);
		for (var a of thisScenery.cubes) {
      a.activateShadow=function(helper){
        console.log("activate shadow of "+a.name);
  			a.children[0].castShadow = true;
  			a.children[0].receiveShadow = true;
      }
		}

    thisScenery.endingTrigger = find(model, "children", "name", /^final-.+/i);

		thisScenery.objects = find(model, "children", "name", /^[decor|pie|inst]*-.+/i);
		for (var a of thisScenery.objects) {
      a.activateShadow=function(helper){
  			a.children[0].castShadow = true;
  			a.children[0].receiveShadow = true;
      }
		}

    thisScenery.backgroundDome = find(model, "children", "name", /^dome-background/i)[0];


		thisScenery.lights = find(model, "children", "name", /^light-.+/i);
		for (var a of thisScenery.lights) {
			console.log(a.children.length)
			var a_light = a.children[0];
			// console.log(a_light);
      a.activateShadow=function(helper){
  			a_light.castShadow = true;
  			var d = 0.6;
  			a_light.shadow.camera.left = -d;
  			a_light.shadow.camera.right = d;
  			a_light.shadow.camera.top = d;
  			a_light.shadow.camera.bottom = -d;
  			a_light.shadow.camera.near = 1;
  			a_light.shadow.camera.far = 2.3;
  			a_light.shadow.mapSize.width = 1024;
  			a_light.shadow.mapSize.height = 1024;
  			a_light.shadow.bias = -0.002;
        if(helper)
  			scene.add(new THREE.CameraHelper(a_light.shadow.camera))
      }
		}
    loadCallback.call(thisScenery);
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
    // model.updateMatrix();
    // model.updateProjectionMatrix();
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
			animation.loop = true;
			// animation.play();
		}
	}

	function animate(timestamp) {
    // console.log(timestamp);
		var frameTime = (timestamp - lastTimestamp) * 0.001;
		if (progress >= 0 && progress < 10) {
			for (var i = 0; i < kfAnimationsLength; ++i) {
				kfAnimations[i].update(frameTime);
			}
		} else if (progress >= 10) {
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