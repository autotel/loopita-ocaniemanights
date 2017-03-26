// ASCII file
var Model=function(path,loadCallback){
  THREE.Object3D.apply(this, arguments);
  var loader = new THREE.STLLoader();
  this.mesh = new THREE.Mesh();
  var thisModel=this;
  var geometry;
  this.addMaterialLayer=function(){};
  loader.load(path, function ( geometry ) {
    geometry=geometry;
    //more about stl loading: https://threejs.org/examples/webgl_loader_stl.html
    var material = new THREE.MeshStandardMaterial( {
      color: 0x000000, //specular: 0xffffff,
      metalness: 1, side: THREE.DoubleSide,
      shading: THREE.FlatShading,
      // blending: THREE.AdditiveBlending,
      // transparent:true
    } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;



    thisModel.mesh=mesh;
    thisModel.add( mesh );
    thisModel.addMaterialLayer=function(nmaterial){
      mesh = new THREE.Mesh( geometry, nmaterial );
      thisModel.add( mesh );
      return nmaterial;
    }
    if(loadCallback){loadCallback.call(thisModel)};
  });

  return this;
}
Model.prototype = Object.create(THREE.Object3D.prototype);
Model.prototype.constructor = Model;