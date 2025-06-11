'use strict';
// var addFloor=function(h){
//   var plane = new THREE.Mesh(
//     new THREE.PlaneBufferGeometry( 40, 40 ),
//     new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x101010 } )
//   );
//   plane.rotation.x = -Math.PI/2;
//   plane.position.y = h;
//   this.add( plane );
//   plane.receiveShadow = true;
// }
function addBackgroundImage(callback){
  // instantiate a loader
  var loader = new THREE.TextureLoader();

  // load a resource
  loader.load(
  	// resource URL
  	// 'images/pexels-photo-x.jpeg',
    'images/wiki-Southern_Sky_crop.jpg',
  	// Function when resource is loaded
  	function ( texture ) {
  		// do something with the texture
      // console.log(texture);
      var rat=texture.image.height/texture.image.width;
      var width=20;
      var wireframeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
  		var material = new THREE.MeshBasicMaterial( {
  			map: texture,
        transparent:true,
        opacity:1,
        // emissive:200,
        side: THREE.BothSides
  		 } );
      var geometry = new THREE.PlaneBufferGeometry( width,width*rat, 1, 1 );
      var plane = new THREE.Mesh( geometry, material );
      var backPlane = new THREE.Mesh( geometry, material );

      plane.rotation.y=Math.PI/2;
      plane.position.x=-8;
      plane.position.y=3.3;
      plane.position.z=0;

      backPlane.rotation.y=Math.PI/-2;
      backPlane.position.x=8;
      backPlane.position.y=3.3;
      backPlane.position.z=0;

      // worldManager.on('render',function(e){backPlane.rotation.y+=0.2;console.log("a");});
      scenery.backgroundDome.children[0].material=material;

      scene.add( plane );
      scene.add( backPlane );
      callback(plane);

  	},
  	// Function called when download progresses
  	function ( xhr ) {
  		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  	},
  	// Function called when download errors
  	function ( xhr ) {
  		console.log( 'An error happened' );
  	}
  );
}
//pendant: this shoudl have prototype closure
// function addShadowedLight( x, y, z, color, intensity) {
//
//   var directionalLight = new THREE.DirectionalLight( color, intensity );
//
//   directionalLight.position.set( x, y, z );
//   scene.add( directionalLight );
//
//   directionalLight.castShadow = true;
//
//   var d = 1;
//   directionalLight.shadow.camera.left = -d;
//   directionalLight.shadow.camera.right = d;
//   directionalLight.shadow.camera.top = d;
//   directionalLight.shadow.camera.bottom = -d;
//
//   directionalLight.shadow.camera.near = 1;
//   directionalLight.shadow.camera.far = 4;
//
//   directionalLight.shadow.mapSize.width = 1024;
//   directionalLight.shadow.mapSize.height = 1024;
//
//   directionalLight.shadow.bias = -0.005;
//   return directionalLight;
// }