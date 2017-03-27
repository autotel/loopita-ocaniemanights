var Instrument=function(name){
  THREE.Object3D.apply(this, arguments);
  scene.add(this);
  var thisInstrument=this;
  var light=addShadowedLight( 0,1,0, 0xffffff, 1.35 );
  thisInstrument.add(light);
  this.additionalMaterials=[];
  this.model=new Model('./models/'+name+".dae",function(){
    this.rotation.set( - Math.PI / 2, 0, 0 );
    //this.position.set(0,0,0);
    thisInstrument.additionalMaterials[0]=this.addMaterialLayer(new THREE.MeshBasicMaterial({wireframe:true,transparent:true,color:0xd9f2ff,emissive:0xd9f2ff}));
    thisInstrument.add(this);

    //mouse interaction stuff ahead

    var bbox = new THREE.BoxHelper(this.mesh);
    bbox.material=new THREE.LineBasicMaterial({visible:false});

    this.add(bbox);

    onHandlers.call(bbox);

    bbox.on("mouseenter",function(){
      console.log("ent");
      light.intensity=1;
    });
    bbox.on("mouseleave",function(){
      console.log("leave");
      light.intensity=0;
    });
    bbox.on("mousedown",function(){
      console.log("dn");
      light.intensity=3;
      thisInstrument.additionalMaterials[0].opacity=1;
    });
    bbox.on("mouseup",function(){
      console.log("up");
      light.intensity=1;
      thisInstrument.additionalMaterials[0].opacity=0;
    });


  });
}

Instrument.prototype = Object.create(THREE.Object3D.prototype);
Instrument.prototype.constructor = Instrument;