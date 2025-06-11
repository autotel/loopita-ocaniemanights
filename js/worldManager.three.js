'use strict';


var worldManager=new (function(){
  onHandlers.call(this);
  this.instrumentList={};
  var objects = [];
  var scene={};
  var camera={};
  var thisWorldManager=this;
  init();

  this.objects=objects;
  this.scene=scene;
  this.camera=camera;
  var listener;
  this.listener;



  this.onSetup=function(){};
  this.onRender=function(){};
  var container;
  var cameraTarget;
  var renderer;
  // var cameraCenter;
  this.start=function(){
    thisWorldManager.handle('start');
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    animate();
  }
  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.2, 15 );
    // camera.position.set( 3, 0.15, 3 );
    // cameraTarget = new THREE.Vector3( 0, -0.25, 0 );


    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.01, 1000 );
    //x: z
    //y: y
    //z: x
    camera.position.set( 2,0.7,0 );
    // cameraCenter=new THREE.Vector3(2,0.7,0);

    camera.lookAt( new THREE.Vector3( 0,0.4,0 ) );


    var listener = new THREE.AudioListener();
    listener.context=Tone.context;
    thisWorldManager.listener=listener;
    camera.add( listener );


    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 2, 15 );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    thisWorldManager.renderer=renderer;


    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    var shadow=true;
    if(shadow){
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.renderReverseSided = false;

      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.shadowMap.enabled = true;

    }
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    thisWorldManager.handle("setup",{renderer:renderer,container:container});
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  function animate() {
    requestAnimationFrame( animate );
    render();
  }
  var endingCamera=false;
  this.on('endingstart',function(){
    endingCamera=0;
  });
  var lastTimer=0;
  //how much the camera is mouse controlled
  var freeCamera=false;
  function render() {
    var timer = Date.now() * 0.0005;
    var deltaTime=timer-lastTimer;
    lastTimer=timer;

    //this is to smoothly transition into fixed camera to free moving camera in the beggining
    var lookat=[];
    if(patchMan.currentPat==0)
      lookat=[0, 0.6, 0];
    if(patchMan.currentPat>0&&freeCamera===false) freeCamera=0;
    if(freeCamera!==false&&freeCamera<1){
      lookat=[0, 0.6, 0];
      // console.log(freeCamera);
      freeCamera+=deltaTime*0.5;
      var lookata= [-5, mouse.normalized.y*3+2, mouse.normalized.x*-1];
      for(var a in lookat){
        lookat[a]=(freeCamera*lookata[a])+((1-freeCamera)*lookat[a]);
      }
    }else if(freeCamera>0.6){
      lookat= [-5, mouse.normalized.y*3+2, mouse.normalized.x*-1];
    }
    //this is to smoothly transition into ending camera

    if(endingCamera!==false&&endingCamera<1){
      var endLookat=[5, mouse.normalized.y*-3, mouse.normalized.x*1];
      endingCamera+=deltaTime*0.1;
      // console.log(endingCamera);
      for(var a in lookat){
        lookat[a]=((endingCamera)*endLookat[a])+((1-endingCamera)*lookat[a]);
      }
      for(var v of patchMan.voices){
        v.enqueueStop();
      }
      patchMan.voices[8].enqueueStart();
      patchMan.changePatternTo(7);
      patchMan.setWet(endingCamera*0.1);
    }else if(endingCamera!==false){
      var endLookat=[5, mouse.normalized.y*-3, mouse.normalized.x*1];
      endingCamera+=deltaTime*0.5;
      for(var a in lookat){
        lookat[a]=endLookat[a];
      }
			patchMan.setWet(endingCamera*0.1);
      lookat=[5, mouse.normalized.y*-3, mouse.normalized.x*1];
    }else{
      patchMan.setWet(Math.max(0,mouse.normalized.y)*0.7);
    }

    camera.lookAt(new THREE.Vector3(lookat[0],lookat[1],lookat[2]));
    // for (var a of ["x","y","z"]){
    //   camera.position[a]=cameraCenter[a]*0.3+camera.lookAt[a]*0.7;
    // }


    // mouse.raycast();
    renderer.render( scene, camera );
    thisWorldManager.handle('render',{time:timer,camera:camera,scene:scene,deltaTime:deltaTime});
    thisWorldManager.onRender.call(thisWorldManager,timer);
  }
  return this;
})();