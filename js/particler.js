'use strict';
var Particler=function(){
  //pendant: replace clock with using render delta passde function or the other way around
  // var clock = new THREE.Clock(true);
  // var sprite=new THREE.Object3D();
  var particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 250000
  });
  // this.sprite=particleSystem;
  var options = {
    position: new THREE.Vector3(),
    positionRandomness: .03,
    velocity: new THREE.Vector3(),
    velocityRandomness: .5,
    color: 0xaa88ff,
    colorRandomness: .2,
    turbulence: .5,
    lifetime: 2,
    size: 5,
    sizeRandomness: 1
  };

  var geometry = new THREE.BoxBufferGeometry( 0.1, 0.1, 0.1 );
  var material = new THREE.MeshBasicMaterial( {color: 0xcccccc,wireframe:true} );
  var cube = new THREE.Mesh( geometry, material );
  var light = new THREE.PointLight( 0xaa88ff, 1, 100 );
  scene.add( cube );
  // scene.add(sprite);
  scene.add(light);
  scene.add(particleSystem);
  light.position.set( 50, 50, 50 );
  // sprite.add( light );
  // sprite.add(particleSystem);
  var spawnerOptions = {
    spawnRate: 15000,
    horizontalSpeed: 1.5,
    verticalSpeed: 1.33,
    timeScale: 1
  };
  var tick=0;





  worldManager.on('render',function(e){
    var delta = e.deltaTime;
    tick += delta;
    if (tick < 0) tick = 0;
    if (delta > 0) {
      options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * .2;
      options.position.y = 0.5+Math.sin(tick * spawnerOptions.verticalSpeed) * .1;
      options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * .5;
      light.position.set( options.position.x, options.position.y, options.position.z );
      cube.position.set( options.position.x, options.position.y, options.position.z );
      for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
        // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
        // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        particleSystem.spawnParticle(options);
      }

    }
    particleSystem.update(tick);
  });
};