InstrumentConstruct=function(name,clickables,patchManVoice,customization){
  console.log("create construct "+name);
  onHandlers.call(this);
  this.name=name;
  this.clickables=clickables;
  var thisInstConst=this;
  var clength=clickables.length;
  var soundForce=0;
  var light = new THREE.PointLight( 0xff0000, 1, 100 );
  var myMainColor=0xff0000;
  // var helper = new THREE.PointLightHelper( light, 0.2 );
  // this.clickables[0].object.add( helper );
  this.clickables[0].add( light );
  this.clickables[0].object.add(light);
  light.position.set( 0, 1, 0 );

  this.setColor=function(to){
    for(var a of thisInstConst.clickables){
      a.displayStyle.color=to;
    }
    light.color=new THREE.Color(to);
    myMainColor=to;
  };

  this.update=function(e){
    // if(currentPat>1)
    var a = soundForce;
    var color = new THREE.Color( (a/2)+a*0.03*((myMainColor&0xFF0000)>>16),(a/2)+a*0.03*((myMainColor&0xFF00)>>8),(a/2)+a*0.03*((myMainColor&0xFF)) );
    light.intensity=soundForce;
    for(var a of thisInstConst.clickables){
      a.mesh.material.emissive=color;
      if(a.isHover){
        soundForce=Math.max(soundForce,0.3);
      }
    }
    // helper.update();
    //pendant: should be function of delta time
    soundForce=soundForce*0.93;
    // if(soundForce>0.2)
    // console.log(soundForce);
  }

  for(var a in this.clickables){
    a_clickable=this.clickables[a];
    a_clickable.on('mouseenter',function(){
      soundForce=0.5;
    });
    a_clickable.on('mousedown',function(){
      soundForce=4;
      console.log("dn");
    });
    a_clickable.on('mouseleave',function(){
      console.log(thisInstConst.clickables[0]);
    });
  }
  worldManager.on('render',this.update);

  for(var a in customization){
    this[a]=customization[a];
  }
  return this;
}