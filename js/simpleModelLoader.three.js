function childLog(obj,recursion){
  if(!recursion){
    var recursion=0;
    console.log("childlog of",obj.name);
  }
  var tabbing="";
  for(var a=0; a<recursion; a++){
    tabbing+=" ";
  }

  if(recursion>20){
    console.log(tabbing+"reached recursion limit here");
  }else{
    // if(obj.children){
      for(var a in obj.children){
        console.log(tabbing+"+"+obj.children[a].type+", "+obj.children[a].name);
        childLog(obj.children[a],recursion+1);
      }
    // }
  }
}
function find(obj,through,property,value,recursion){
  var rets=[];
  if(!recursion){
    var recursion=0;
    console.log("find objs whose "+property+" is "+value+" recursively through "+through);
  }
  var tabbing="";
  for(var a=0; a<recursion; a++){
    tabbing+=" ";
  }

  if(recursion>20){
    console.log(tabbing+"reached recursion limit here");
    return false;
  }else{
    // if(obj.children){
    for(var a in obj[through]){
      console.log(tabbing+"+"+obj[through][a][property]);
      rets =rets.concat(find(obj[through][a],through,property,value,recursion+1));
      if(obj[through][a][property]==value){
        console.log(tabbing+" ->returning");
        rets.push(obj[through][a]);
      }
    }
    // }
  }
  return rets;
}
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
  }else if(extension==".dae"){
    DaeModel.call(this,arguments);
  }else{
    console.log("I don't know how to load this model format");
  }
  return this;
}
Model.prototype = Object.create(THREE.Object3D.prototype);
Model.prototype.constructor = Model;

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
var DaeModel=function(args){
  var path=args[0];
  var loadCallback=args[1];
  var thisModel=this;

  var lastTimestamp = 0;
  var progress = 0;

  var objects;

  var model, animations, kfAnimationsLength;
  var kfAnimations=[];

  var loader = new THREE.ColladaLoader();

  loader.load(path, function ( collada ) {
    model = collada.scene;
    console.log(collada);
    mesh=find(model,"children","type","Mesh");
    animations = collada.animations;
    kfAnimationsLength = animations.length;

    for ( var i = 0; i < kfAnimationsLength; ++i ) {
      var animation = animations[ i ];
      var kfAnimation = new THREE.KeyFrameAnimation( animation );
      kfAnimation.timeScale = 1;
      kfAnimations.push( kfAnimation );
    }

    thisModel.addMaterialLayer=function(nmaterial){
      for(var a in mesh){
        mesh[a].material=nmaterial;
        thisModel.add( mesh[a] );
        return nmaterial;
      }
    }

    start();
    animate( lastTimestamp );
    if(loadCallback){loadCallback.call(thisModel)};

  } );

  function start() {

    for ( var i = 0; i < kfAnimationsLength; ++i ) {

      var animation = kfAnimations[i];

      for ( var h = 0, hl = animation.hierarchy.length; h < hl; h++ ) {

        var keys = animation.data.hierarchy[ h ].keys;
        var sids = animation.data.hierarchy[ h ].sids;
        var obj = animation.hierarchy[ h ];

        if ( keys.length && sids ) {

          for ( var s = 0; s < sids.length; s++ ) {

            var sid = sids[ s ];
            var next = animation.getNextKeyWith( sid, h, 0 );

            if ( next ) next.apply( sid );

          }

          obj.matrixAutoUpdate = false;
          animation.data.hierarchy[ h ].node.updateMatrix();
          obj.matrixWorldNeedsUpdate = true;

        }

      }

      animation.loop = false;
      animation.play();

    }

  }

  this.udpateAnimation=function(timestamp){
    var frameTime = ( timestamp - lastTimestamp ) * 0.001;
    if ( progress >= 0 && progress < 48 ) {
      for ( var i = 0; i < kfAnimationsLength; ++i ) {
        kfAnimations[ i ].update( frameTime );
      }
    } else if ( progress >= 48 ) {
      for ( var i = 0; i < kfAnimationsLength; ++i ) {
        kfAnimations[ i ].stop();
      }
      progress = 0;
      start();
    }
    // pointLight.position.copy( camera.position );
    progress += frameTime;
    lastTimestamp = timestamp;
  };
}
