var WorldManager=function(){

  this.onSetup=function(){};
  this.onRender=function(){};
  var thisWorldManager=this;
  var container;
  var cameraTarget;
  var renderer;




  this.start=function(){
  	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  	init();
  	animate();
  }
  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.2, 15 );
    camera.position.set( 3, 0.15, 3 );
    cameraTarget = new THREE.Vector3( 0, -0.25, 0 );
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 2, 15 );
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;

    container.appendChild( renderer.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    thisWorldManager.onSetup.call(thisWorldManager,{renderer:renderer,container:container,});
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

      var hRat= ( mouse.y/ window.innerHeight)-0.5;
      var lkat=new THREE.Vector3();
      lkat.x = Math.cos( mouse.x/ window.innerWidth *Math.PI*2 ) * 1;
      lkat.y = hRat*3+0.6;
      lkat.z = Math.sin( mouse.x/ window.innerWidth *Math.PI*2 ) * 1;
      camera.position.x=0;
      camera.position.y=hRat+0.6;
      camera.position.z=0;
      camera.lookAt(lkat);

      mouse.raycast();
      renderer.render( scene, camera );

    thisWorldManager.onRender.call(thisWorldManager,timer);
  }
  return this;
}