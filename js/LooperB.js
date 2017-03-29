var transportMan=(function(){
  onHandlers.call(this);
  Tone.Transport.bpm.value = 120;
  this.bps=(Tone.Transport.bpm.value/60);
  this.currentStep=0;
  var thisTransport=this;
  Tone.Transport.scheduleRepeat (function(time){
    thisTransport.handle('beat',{time:time,step:thisTransport.currentStep});
    thisTransport.currentStep++;
  }, "32n");
  Tone.Transport.start();
  console.log("transport started");
  return this;
})();

var loopMan=(function(){
  onHandlers.call(this);
  this.isLooping=false;
  this.isWaiting=false;
  this.metroMan=(function(){
    onHandlers.call(this);
    //controls looper timers with callbak
    return this;
  })();
  this.Looper=function(SampleFilePath){
    onHandlers.call(this);
    this.beatsLength=0;
    var thisLooper=this;
    this.engine=new Tone.Player(SampleFilePath,function(e){
      thisLooper.beatsLength = Math.floor(transportMan.bps * thisLooper.engine.buffer.duration)*8;
      console.log(thisLooper.beatsLength);
    });
    this.engine.retrigger=true;
    //connect output to master
    //fns
    this.enqueueStart=function(){
      thisLooper.isLooping=true;
      this.isWaiting=true;
      this.handle("loopStateUpdate",{isWaiting:thisLooper.isWaiting,isLooping:thisLooper.isLooping});
      //pendant:consider using the startingtime to schedule playback with more precision
      //.start ([startTime][, offset][, duration])
    }
    this.enqueueStop=function(){
      thisLooper.isLooping=false;
      this.isWaiting=false;
      this.handle("loopStateUpdate",{isWaiting:thisLooper.isWaiting,isLooping:thisLooper.isLooping});
    }
    this.play=function(){
      thisLooper.engine.start ();
      this.isWaiting=false;
      this.handle("loopStateUpdate",{isWaiting:thisLooper.isWaiting,isLooping:thisLooper.isLooping});
    }
    this.stop=function(){
      thisLooper.engine.stop();
      this.isWaiting=false;
      this.handle("loopStateUpdate",{isWaiting:thisLooper.isWaiting,isLooping:thisLooper.isLooping});
    }
    this.beat = function(e) {
      var step=e.step;
      if (thisLooper.isLooping && step % thisLooper.beatsLength == 0) {
        thisLooper.play();
      }
    }
    transportMan.on('beat',this.beat);
  }
  return this;
})();

var patchMan=(function(){
  var audioCtx = new AudioContext();
  this.audioCtx=audioCtx;
  var masterNode=new Tone.Gain();
  masterNode.toMaster();
  var loops=[];
  var voices=[];
  var voiceOutputNodes=[];
  var voiceActiveState=[];
  this.loops=loops;
  this.voices=voices;
  this.voiceOutputNodes=voiceOutputNodes;
  var belongsToPattern=function(looper,pattern){
    //beloingstoPattern is a patchman private because looper.properties are set by patchman
    return looper.properties.patn.indexOf(pattern)!=-1;
  }
  this.updateVoiceStatuses=function(){
    for(var a in loops){
      var a_Loop=loops[a];
      if(a_Loop.isWaiting){
        voiceActiveState[a_Loop.properties.voicen]=1;
      }else if(a_Loop.isLooping){
        voiceActiveState[a_Loop.properties.voicen]=2;
      }else if(!voiceActiveState[a_Loop.properties.patn]){
        voiceActiveState[a_Loop.properties.voicen]=2;
      }
    }
  }
  this.getVoiceStatus=function(n,update){
    if(update){
      for(var a in voices[n]){
        var a_Loop=voices[n];
        if(a_Loop.isWaiting){
          voiceActiveState[a_Loop.properties.voicen]=1;
        }else if(a_Loop.isLooping){
          voiceActiveState[a_Loop.properties.voicen]=2;
        }else if(!voiceActiveState[a_Loop.properties.patn]){
          voiceActiveState[a_Loop.properties.voicen]=2;
        }
      }
    }
    return voiceActiveState[n];
  }
  this.changePatn=function(to){
    this.updateVoiceStatuses();
    for(var a in voiceActiveState){
      if(voiceActiveState[a]>0)
      activateVoice(a);
    }
  }
  this.stateAndRun=function(n,cb){
    //factually check if voice is playing.
    //If is, run callback with arg 2
    //if its waiting, run callback with arg 1
    //if its not playing, run callback with arg 0
    var retValue=0;
    var correspondingLooper=false;
    if(voices[n]){
      for(var a=0; (correspondingLooper==false) && (a<voices[n].length); a++){
        na_voice=voices[n][a];
        if(belongsToPattern(na_voice,currentPat)){
          correspondingLooper=na_voice;
          if(na_voice.isWaiting){
            retValue=1;
          }else if(na_voice.isLooping){
            retValue=2;
          }
          cb(retValue,correspondingLooper);
        }
      }
    }else{
      console.log("looperMan error: requested to activate a voice that doesn't exist: "+n);
    }
  }
  this.activateVoice=function(n){
    if(voices[n]){
      for(var a in voices[n]){
        na_voice=voices[n][a];
        if(belongsToPattern(na_voice,currentPat)){
            na_voice.enqueueStart();
        }else{
          if(na_voice.isLooping){
            na_voice.enqueueStop();
          }
        }
      }
    }else{
      console.log("looperMan error: requested to activate a voice that doesn't exist: "+n);
    }
  }
  this.deactivateVoice=function(n){
    if(voices[n]){
      for(var a in voices[n]){
        na_voice=voices[n][a];
        if(na_voice.isLooping)
        na_voice.enqueueStop();
      }
    }else{
      console.log("looperMan error: requested to activate a voice that doesn't exist: "+n);
    }
  }
  this.databaseItem=function(itm){
    newLooper=new loopMan.Looper(itm.source);
    newLooper.properties=itm;
    console.log("loading sample "+itm.name);
    loops.push(newLooper);
    if(!voices[itm.voicen]){
      nGainNode=new Tone.Gain();
      nGainNode.connect(masterNode);
      voiceOutputNodes[itm.voicen]=nGainNode;
      voices[itm.voicen]=[newLooper];
      console.log("--."+(audioCtx.createGain() instanceof AudioNode));
      newLooper.engine.connect(nGainNode);
    }else{
      voices[itm.voicen].push(newLooper);
      newLooper.engine.connect(voiceOutputNodes[itm.voicen]);
    }
  }
  return this;
})();