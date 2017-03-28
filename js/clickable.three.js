var Clickable=function(object){
  console.log("clickable created",object.name)
  THREE.Object3D.apply(this, arguments);
  this.force=new THREE.Vector3(0,0,0);
  this.rotForce=new THREE.Vector3(0,0,0);
  this.object=object;
  this.meshes=find(this.object,"children","type","Mesh");
  this.mesh=this.meshes[0];
  this.isHover=false;
//pendant: this is no clean way to do it. These values come from colladaloaer
  // this.scale.x = this.scale.y = this.scale.z = 0.125; // 1/8 scale, modeled in cm
  // this.rotation.x = Math.PI / -2;
  //this.scale=this.object.scale;
  // console.log(this.object);
  var thisClickable=this;
  // console.log(this);
  // var light=addShadowedLight( 0,0.5,0, 0xffffff,0);

  // var light= new THREE.PointLight(0,1,0,0xff0000,0);
  this.additionalMaterials=[];
  //mouse interaction stuff ahead
  // for(var a of this.meshes)
  var bbox = new THREE.BoxHelper(this.object);
  bbox.material=new THREE.MeshBasicMaterial({color:0x00FF00,visible:true,transparent:true,opacity:0.2,wireframe:true});
  this.additionalMaterials[0]=new THREE.MeshStandardMaterial({side:THREE.DoubleSide,transparent:true,visible:true,metalness:1,color:0x000000});
  this.meshes[0].material=this.additionalMaterials[0];
  this.displayStyle={
    body:this.meshes[0].material
  }
  // this.castShadow = true;

  this.add(bbox);
  onHandlers.call(bbox);
  this.bbox=bbox;
  this.on=function(a,arguments){
    bbox.on(a,arguments);
  }

  bbox.on("mouseenter",function(e){
    thisClickable.isHover=true;
    // console.log("ent");
    // light.intensity=1;
    // thisClickable.mesh.material.blending=THREE.AdditiveBlending;

  });
  bbox.on("mouseleave",function(e){
    thisClickable.isHover=false;
    // console.log("leave");
    // light.intensity=0;
    // thisClickable.mesh.material.blending=THREE.SustractiveBlending;

  });
  bbox.on("mousedown",function(e){
    console.log(thisClickable.instId);
    // console.log("dn");
    // light.intensity=3;
    // thisClickable.mesh.material.blending=THREE.AdditiveBlending;
    // for(var a of ['x','y','z']){
    //   thisClickable.rotForce[a]+=Math.random()*0.005;
    // }


  });
  bbox.on("mouseup",function(e){

    // console.log("up");
    // light.intensity=1;
    // thisClickable.mesh.material.blending=THREE.SustractiveBlending;
  });
  scene.add(this);
  this.update=function(e){
    // console.log(time);
    var time=e.time;
    var update=false;
    for(var a of ['x','y','z']){
      // light.position[a]=thisClickable.object.position[a];
      if(thisClickable.force[a]!=0){
        thisClickable.mesh.position[a]+=thisClickable.force[a];
        update=true;
      }
      if(thisClickable.rotForce[a]!=0){
        thisClickable.mesh.rotation[a]+=thisClickable.rotForce[a];
        update=true;
      }
    }
    //if(update)
    bbox.update(thisClickable.object);
  }

  worldManager.on('render',this.update);

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
