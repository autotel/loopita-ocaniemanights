'use strict';
var InstrumentConstruct=function(name,clickables,patchManVoicen,customization){
  onHandlers.call(this);
  worldManager.instrumentList[name]=this;
  var patchManVoice=patchMan.voices[patchManVoicen];
  this.voice=patchManVoice;
  console.log("patchManVoice"+patchManVoice);
  console.log("create construct "+name);
  this.name=name;
  this.clickables=clickables;
  var thisInstConst=this;
  var clength=clickables.length;
  var soundForce=0;
  var light = new THREE.PointLight( 0xff0000, 0, 100 );
  this.light=light;
  var myMainColor=0xff0000;
  var volMeter=new Tone.Meter();
  var mouseIsOver=0;
  patchManVoice.outputNode.connect(volMeter);

  //elements that are visible and part of this instrument but can't be clicked i.e. pies
  this.unclickables=[];
  //pendant: I don't know how to get the following right
  // var posAudio = new THREE.PositionalAudio( listener );
  // posAudio.setNodeSource(patchManVoice.outputNode);

  patchManVoice.InstrumentConstruct=this;
  // var helper = new THREE.PointLightHelper( light, 0.2 );
  // this.clickables[0].object.add( helper );
  this.clickables[0].add( light );
  this.clickables[0].object.add(light);
  light.position.set( 0, 1, 0 );
  var disableClickables=function(){
    for(var a of thisInstConst.clickables){
      a.clickEnabled=false;
    }
  }
  var enableClickables=function(){
    for(var a of thisInstConst.clickables){
      a.clickEnabled=true;
    }
  }
  this.setColor=function(to){
    for(var a of thisInstConst.clickables){
      a.displayStyle.color=to;
    }
    light.color=new THREE.Color(to);
    myMainColor=to;
  };
  var displayingWireframe=false;
  this.update=function(e){
    if(displayingWireframe){
      if(!thisInstConst.clickables[0].mesh.material.wireframe){
        for(var a of thisInstConst.clickables){
          a.mesh.material.wireframe=true;
        }
        for(var a of thisInstConst.unclickables){
          a.mesh.material.wireframe=true;
        }
      }
    }else{
      if(thisInstConst.clickables[0].mesh.material.wireframe){
        for(var a of thisInstConst.clickables){
          a.mesh.material.wireframe=false;
        }
        for(var a of thisInstConst.unclickables){
          a.mesh.material.wireframe=false;
        }
      }
    }

    // if(patchMan.currentPat>1)
    var emissive=0;
    var lightIntensity=0;
    soundForce=volMeter.getLevel();
    lightIntensity=soundForce;
    if(patchManVoice.isWaiting){
      displayingWireframe=true;

      emissive=0.5;
    }else if(patchManVoice.isLooping){
      displayingWireframe=false;
      emissive=soundForce;
    }else{
      displayingWireframe=false;
      emissive=soundForce*0.2;
    }
    if(patchMan.currentPat==3){
      displayingWireframe=true;
    }
    if(mouseIsOver){
      emissive+=0.3;
    }
    if(patchMan.currentPat==0){
      emissive+=0.03;
    }
    emissive*=mainLightsLevel;
    var color = new THREE.Color( (emissive/2)+emissive*0.03*((myMainColor&0xFF0000)>>16),(emissive/2)+emissive*0.03*((myMainColor&0xFF00)>>8),(emissive/2)+emissive*0.03*((myMainColor&0xFF)) );
    for(var a of thisInstConst.clickables){
      a.mesh.material.emissive=color;
      if(a.isHover){
        lightIntensity=Math.max(lightIntensity,0.3);
      }
    }
    if(patchMan.currentPat>0)
    light.intensity=lightIntensity*mainLightsLevel;
    e.soundForce=soundForce;
    thisInstConst.handle('update',e);
  }
  thisInstConst.isAppeared=true;
  this.disappear=function(){
    thisInstConst.isAppeared=false;
    disableClickables();
    for(var a of thisInstConst.clickables){
      a.mesh.visible=false;
    }
    for(var a of thisInstConst.unclickables){
      a.mesh.visible=false;
    }
    thisInstConst.handle("disappear");
  }
  this.appear=function(){
    thisInstConst.isAppeared=true;
    enableClickables();
    for(var a of thisInstConst.clickables){
      a.mesh.visible=true;
    }
    for(var a of thisInstConst.unclickables){
      a.mesh.visible=true;
    }
    thisInstConst.handle("appear");
  }

  for(var a in this.clickables){
    var a_clickable=this.clickables[a];
    // console.log(a_clickable.object.name+" setting click listener",this);
    a_clickable.on('mouseenter',function(e){
      soundForce=0.5;
      mouseIsOver++;
      thisInstConst.handle("mouseenter");
    });
    a_clickable.on('mousedown',function(e){
      soundForce=4;
      //more simple could be to activate/deactovate voie according to the state
      patchManVoice.toggle();
      thisInstConst.handle("mousedown");
    });
    a_clickable.on('mouseleave',function(e){
      mouseIsOver--;
      // console.log(thisInstConst.clickables[0]);
      thisInstConst.handle("mouseleave");
    });
  }
  worldManager.on('render',this.update);

  for(var a in customization){
    this[a]=customization[a];
  }
  return this;
}

var CubeConstruct=function(myClickable,patn){
  this.isActive=false;
  var myMainColor=0xFFFFFF;
  var lastA=1;
  var light = new THREE.PointLight( myMainColor, 0, 100 );
  var lightIntensity=0.03;
  myClickable.object.add(light);
  myClickable.on("mousedown",function(e){
    // console.log("hi there from cube");
    patchMan.changePatternTo(patn);
  });
  this.update=function(e){
    var a=0;
    if(myClickable.isHover){
      a=0.1
    }
    if(patchMan.currentPat==patn){
      a=1;
    }
    if(patchMan.currentPat>0)
     a+=0.05*mainLightsLevel;

    if(lastA!=a){
      lastA=a;
      if(a>0){
      var color = new THREE.Color( (a/2)+a*0.03*((myMainColor&0xFF0000)>>16),(a/2)+a*0.03*((myMainColor&0xFF00)>>8),(a/2)+a*0.03*((myMainColor&0xFF)) );
        myClickable.mesh.material.emissive=color;
      }else{
        myClickable.mesh.material.emissive=new THREE.Color(0x000000);
      }
    }
    if(patchMan.currentPat>0)
    light.intensity=lightIntensity*mainLightsLevel;
  }
  worldManager.on('render',this.update);
}

var endingTriggerConstruct=function(myClickable,patn){
  this.isActive=false;
  var myMainColor=0x880000;
  var lastA=1;
  var light = new THREE.PointLight( myMainColor, 0, 100 );
  // var thisConstruct=this;

  var hasBeenClicked=false;
  (function(patns){
    var readyToShow=function(){
  		return (worldManager.instrumentList['organillo_1'].voice.isLooping
  			&&worldManager.instrumentList['organillo_2'].voice.isLooping
  			&&worldManager.instrumentList['timbal_1'].voice.isLooping
  			&&worldManager.instrumentList['timbal_2'].voice.isLooping
  			&&worldManager.instrumentList['clap'].voice.isLooping
  			&&worldManager.instrumentList['kick_1'].voice.isLooping
  			&&worldManager.instrumentList['kick_2'].voice.isLooping
  			&&worldManager.instrumentList['snare'].voice.isLooping
  			&&worldManager.instrumentList.clap.voice.isLooping)

  	}
    var assignMaterial=false;
    var animEnd=false;
    var animLen=1;
    var thisMesh=myClickable.mesh;
    // var originalPosition=thisMesh.position;
    var initialValue=0;
    var targetValue=0;

    console.log(thisMesh);
    thisMesh.material.transparent=true;
    assignMaterial=true;
    myClickable.clickEnabled=false;
    patchMan.on('patternchangerequested',function(){
      checkIfReadyToShow();
    });
    patchMan.on('loopStateChange',function(){
      checkIfReadyToShow();
    });
    var checkIfReadyToShow=function(){
      if(readyToShow()){
        if(patchMan.currentPat==6){
          assignMaterial=true;
          initialValue=thisMesh.material.opacity;
          targetValue=1;
          myClickable.clickEnabled=true;
        }else{
          assignMaterial=true;
          initialValue=thisMesh.material.opacity;
          targetValue=0;
          myClickable.clickEnabled=false;

        }
        myClickable.on('mousedown',function(){
          hasBeenClicked=true;
          thisMesh.material.transparent=false;
          setTimeout(function(){
            $("#ending").fadeIn(2000);
            $("#ending").css("pointer-events","all");
          },15000);
        });
      }else{
        // console.log("need more instruments");
      }
    }
    worldManager.on('render',function(e){
      if(assignMaterial){
        if(animEnd===false){
          // animStart=e.time;
          animEnd=e.time+animLen;
          initialValue=thisMesh.material.opacity;
        }else{

        }
        var animPos=1-(animEnd-e.time)/animLen;
        // console.log("step0"+animPos);

        thisMesh.material.opacity=targetValue*animPos+initialValue*(1-animPos);

        if(animPos>=0.99999){
          animEnd=false;
          assignMaterial=false;
        }
      }
      if(hasBeenClicked){
        light.intensity=1*mainLightsLevel;
        thisMesh.material.opacity=1;
        myClickable.mesh.material.emissive=new THREE.Color(myMainColor);
        mainLightsLevel*=0.8;
      }
    });
  }).call();



  myClickable.object.add(light);
  myClickable.on("mousedown",function(e){
    worldManager.handle('endingstart');
  });
  this.update=function(e){
    var a=0;
    if(myClickable.isHover){
      a=1;
      console.log("hover");
    }

    if(lastA!=a){
      lastA=a;
      if(a==1){
        myClickable.mesh.material.emissive=new THREE.Color(myMainColor);
        light.intensity=100;
      }else if(a==0){
        myClickable.mesh.material.emissive=new THREE.Color(0x000000);
        light.intensity=0;
      }
    }
  }
  worldManager.on('render',this.update);
}