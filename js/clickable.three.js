var Clickable=function(object){
  THREE.Object3D.apply(this, arguments);
  this.object=object;
  this.meshes=find(this.object,"children","type","Mesh");
  this.mesh=this.meshes[0];
  thisClickable=this;
//pendant: this is no clean way to do it. These values come from colladaloaer
  this.scale.x = this.scale.y = this.scale.z = 0.125; // 1/8 scale, modeled in cm
  this.rotation.x = Math.PI / -2;
  //this.scale=this.object.scale;
  console.log(this.object);
  var thisClickable=this;
  // var light=addShadowedLight( 0,1,0, 0xffffff,0);
  var light= new THREE.PointLight(0,1,0,0xff0000,0);
  thisClickable.add(light);
  this.additionalMaterials=[];
  //mouse interaction stuff ahead
  // for(var a of this.meshes)
  var bbox = new THREE.BoxHelper(this.object);
  bbox.material=new THREE.MeshBasicMaterial({color:0x00FF00,visible:false,wireframe:true});
  this.additionalMaterials[0]=new THREE.MeshStandardMaterial({transparent:true,visible:true,color:0x880000});
  this.meshes[0].material=this.additionalMaterials[0];

  // this.castShadow = true;

  this.add(bbox);
  onHandlers.call(bbox);

  bbox.on("mouseenter",function(){
    console.log("ent");
    light.intensity=1;
    thisClickable.mesh.material.blending=THREE.AdditiveBlending;
  });
  bbox.on("mouseleave",function(){
    console.log("leave");
    light.intensity=0;
    thisClickable.mesh.material.blending=THREE.SustractiveBlending;
  });
  bbox.on("mousedown",function(){
    console.log("dn");
    light.intensity=3;
    thisClickable.mesh.material.blending=THREE.AdditiveBlending;
  });
  bbox.on("mouseup",function(){
    console.log("up");
    light.intensity=1;
    thisClickable.mesh.material.blending=THREE.SustractiveBlending;
  });
  scene.add(this);
  bbox.update(this.object);
}
Clickable.prototype = Object.create(THREE.Object3D.prototype);
Clickable.prototype.constructor = Clickable;

var clickableCreateFromStl=function(name,cb){
  this.model=new Model('./models/'+name+".stl",function(){
    var inst=new Clickable(this);
    this.rotation.set( - Math.PI / 2, 0, 0 );
    //this.position.set(0,0,0);
    thisClickable.additionalMaterials[0]=this.addMaterialLayer(new THREE.MeshBasicMaterial({wireframe:true,transparent:true,color:0xd9f2ff,emissive:0xd9f2ff}));
    thisClickable.add(this);
    scene.add(this);
    cb.call(inst);
  });
}
