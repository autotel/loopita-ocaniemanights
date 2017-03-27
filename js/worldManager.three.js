var worldManager=(function(){
  onHandlers.call(this);

  var objects = [];
  var scene={};
  var camera={};
  var thisWorldManager=this;

  init();

  this.objects=objects;
  this.scene=scene;
  this.camera=camera;

  this.onSetup=function(){};
  this.onRender=function(){};
  var container;
  var cameraTarget;
  var renderer;
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
    camera.position.set( 2.6,1,0 );
    camera.lookAt( new THREE.Vector3( 0,0.4,0 ) );



    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 2, 15 );
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    var shadow=false;
    if(shadow){
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.renderReverseSided = false;

      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // renderer.shadowMap.enabled = true;
      // renderer.shadowMap.renderReverseSided = false;
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
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
  function render() {
    var timer = Date.now() * 0.0005;
    // var vRat= 0.5-(( mouse.y/ window.innerHeight));
    // var lkat=new THREE.Vector3();
    // lkat.x = Math.cos( mouse.x/ window.innerWidth *Math.PI*2 ) * 1;
    // lkat.y = vRat*3+0.6;
    // lkat.z = Math.sin( mouse.x/ window.innerWidth *Math.PI*2 ) * 1;
    // camera.position.x=0;
    // camera.position.y=vRat+0.6;
    // camera.position.z=0;
    // camera.lookAt(lkat);
    camera.lookAt(new THREE.Vector3(-mouse.normalized.y * 2, 0.6, -mouse.normalized.x));

    mouse.raycast();
    renderer.render( scene, camera );
    this.handle('render',{time:timer,camera:camera,scene:scene});
    thisWorldManager.onRender.call(thisWorldManager,timer);
  }
  return this;
})();