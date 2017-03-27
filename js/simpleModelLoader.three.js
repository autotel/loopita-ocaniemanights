// ASCII file
var Model=function(path,loadCallback){
  THREE.Object3D.apply(this, arguments);
  this.mesh = new THREE.Mesh();
  this.geometry;
  this.addMaterialLayer=function(){};
  var thisModel=this;
  //get file extension and choose loading mode accordingly
  var extension=path.match(/\.\w*$/);
  console.log("loading model in "+extension+" mode");
  //pendant: proper loading management
  if(extension==".stl"){
    StlModel.call(this,arguments);
  }else{
    console.log("I don't know how to load this model format");
  }
  return this;
}
var StlModel=function(args){
  var path=args[0];
  var loadCallback=args[1];
  var thisModel=this;
  var loader = new THREE.STLLoader();
  loader.load(path, function ( geometry ) {
    thisModel.geometry=geometry;
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
}
Model.prototype = Object.create(THREE.Object3D.prototype);
Model.prototype.constructor = Model;