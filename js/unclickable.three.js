'use strict';

var Unclickable=function(object){
  // console.log("unclickable created",object.name)
  THREE.Object3D.apply(this, arguments);
  this.force=new THREE.Vector3(0,0,0);
  this.rotForce=new THREE.Vector3(0,0,0);
  this.object=object;
  this.meshes=find(this.object,"children","type","Mesh");
  this.mesh=this.meshes[0];
  this.isHover=false;
  this.clickEnabled=false;
  var thisUnclickable=this;
  this.additionalMaterials=[];


  this.additionalMaterials[0]=new THREE.MeshStandardMaterial({side:THREE.DoubleSide,transparent:true,visible:true,metalness:1,color:0x000000});
  this.meshes[0].material=this.additionalMaterials[0];
  this.displayStyle={
    body:this.meshes[0].material
  }
  scene.add(this);
  this.update=function(e){
    //pendant: remove the force stuff and in clickables aswell.
    // console.log(time);
    var time=e.time;
    var update=false;
    for(var a of ['x','y','z']){
      // light.position[a]=thisUnclickable.object.position[a];
      if(thisUnclickable.force[a]!=0){
        thisUnclickable.mesh.position[a]+=thisUnclickable.force[a];
        update=true;
      }
      if(thisUnclickable.rotForce[a]!=0){
        thisUnclickable.mesh.rotation[a]+=thisUnclickable.rotForce[a];
        update=true;
      }
    }
  }
  worldManager.on('render',this.update);
}
Unclickable.prototype = Object.create(THREE.Object3D.prototype);
Unclickable.prototype.constructor = Clickable;

