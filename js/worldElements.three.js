addFloor=function(h){
  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 40, 40 ),
    new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x101010 } )
  );
  plane.rotation.x = -Math.PI/2;
  plane.position.y = h;
  this.add( plane );
  plane.receiveShadow = true;
}

var StarField=function(){
  //https://aerotwist.com/tutorials/creating-particles-with-three-js/
  THREE.Object3D.apply(this, arguments);
  // create the particle variables
  var particleCount = 180000,
      particles = new THREE.Geometry(),
      pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.03,
        map: THREE.ImageUtils.loadTexture(
          "images/starparticle.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
      });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {
    var randa=Math.random()*Math.PI*2;
    var randb=Math.random()*Math.PI*2;
    var randc=Math.random();
    var r=5.5;
    x = r * Math.sin( randa )* Math.sin( randb )+randc+2;
    y = r * Math.sin( randa )* Math.cos( randb )*-1+randc;
    z = r * Math.cos( randa )* Math.sin( randb )+randc;
    particle = new THREE.Vector3(x,Math.abs(y),z);
    // create a particle with random
    // position values, -250 -> 250
    // var pX = () * 2.5,
    //     pY = (Math.cos((Math.random()-0.5)*Math.PI)) * 2.5
    //     pZ = (Math.atan((Math.random()-0.5)*Math.PI)) * 2.5,
    //     particle = new THREE.Vector3(pX, pY, pZ)

    // add it to the geometry
    particles.vertices.push(particle);
  }

  // create the particle system
  var particleSystem = new THREE.Points(particles, pMaterial);
  this.add(particleSystem);
  scene.add(this);
}
StarField.prototype = Object.create(THREE.Object3D.prototype);
StarField.prototype.constructor = StarField;
//pendant: this shoudl have prototype closure
function addShadowedLight( x, y, z, color, intensity) {

  var directionalLight = new THREE.DirectionalLight( color, intensity );

  directionalLight.position.set( x, y, z );
  scene.add( directionalLight );

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.005;
  return directionalLight;
}