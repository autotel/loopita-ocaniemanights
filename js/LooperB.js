'use strict';
//pendant: remove this
// var granularSynth
// function createGS(){granularSynth=(function(){
//   var context=Tone.context;
//   var outputNode=context.createGain();
//   outputNode.toMaster();
//   var thisGS=this;
//   this.granules=[];
//   for(var a=0; a<grains.length; a++){
//     (function(){
//       var dir=grains[a].source;
//       var name=grains[a].name;
//       granules[a]={};
//       granules[a].mixNode=context.createGain();
//       granules[a].mixNode.gain.value=0;
//       var source = context.createBufferSource();
//       granules[a].source=source;
//       source.connect(granules[a].mixNode);
//       granules[a].mixNode.connect(outputNode);
//       var request = new XMLHttpRequest();
//       request.open('GET', dir, true);
//       request.responseType = 'arraybuffer';
//       request.onload = function() {
//         console.log("loaded grain "+name,request.response);
//         context.decodeAudioData(request.response, function(response) {
//           source.buffer = response;
//           source.start(0);
//           source.loop = true;
//          }, function (e) { console.error('The request failed.',e); } );
//       }
//       request.send();
//     })()
//   }
//   var granuleFader=0;
//   var volumeFader=0;
//   function cub(a){return a*a*a;}
//   this.soundUpdate=function(){
//     granuleFader=(mouse.normalized.x+1)/2;
//     volumeFader=(mouse.normalized.y+1)/2;
//     outputNode.gain.value=volumeFader;
//     var denormGranuleFader=granuleFader*thisGS.granules.length;
//     var granuleRange=5;
//     var halfRange=Math.floor(granuleRange/2);
//     for(var a =0; a<granules.length;a++){
//       a_granule=granules[a];
//       a_granule.mixNode.gain.value=1-cub(Math.abs(granuleFader-(a/granules.length)));
//       // if(a==Math.floor(denormGranuleFader)){
//       //
//       //   a_granule.mixNode.gain.value=1;
//       // }else{
//       //   a_granule.mixNode.gain.value=0;
//       // }
//     }
//   }
//   worldManager.on('render',this.soundUpdate);
//   return this;
// })();
// }
var transportMan=new (function(){
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

var loopMan=new(function(){
  onHandlers.call(this);
  this.isLooping=false;
  this.isWaiting=false;
  this.metroMan=(function(){
    onHandlers.call(this);
    //controls looper timers with callbak
    return this;
  })();
  this.Player=function(SampleFilePath){
    // onHandlers.call(this);
    this.beatsLength=0;
    var thisPlayer=this;
    try{
      this.engine=new Tone.Player(SampleFilePath,function(e){
        thisPlayer.beatsLength = Math.floor(transportMan.bps * thisPlayer.engine.buffer.duration)*8;
        console.log(thisPlayer.beatsLength);
      });
    }catch(e){
      console.log(e,SampleFilePath);
    }
    this.engine.retrigger=true;
    this.play=function(){
      thisPlayer.engine.start ();
    }
    this.stop=function(){
      thisPlayer.engine.stop();
    }
  }
  this.Voice=function(player){
    onHandlers.call(this);
    var thisVoice=this;
    this.players=[player];
    var currentPlayer=0;
    this.isPlaying=false;
    //beware! isLooping doesnt mean the usual looping. It means wether it will keep playing on the next cycle.
    this.isLooping=false;
    // this.outputNode=new Tone.Gain();
    this.outputNode=Tone.context.createGain();
    player.engine.connect(this.outputNode);
    this.toggle=function(){
      if(this.isLooping){
        // console.log("toggling into stop");
        this.enqueueStop();
      }else{
        // console.log("toggling into start");

        this.enqueueStart();
      }
    }
    this.changeCurrentPlayerToPatn=function(n){
      var logLoopers="playing: ";
      var availableThisN=false;
      for(var a in this.players){
        var a_player=this.players[a];
        if(a_player.properties.patn.indexOf(n)!=-1){
          logLoopers+=("["+a+"]"+a_player.properties.name);
          availableThisN=true;
          currentPlayer=a;
        }else{
          // console.log(a_player.properties.patn+" is not "+n);
        }
      }
      if(!availableThisN){
        thisVoice.enqueueStop();
      }
      // console.log(logLoopers);
      return availableThisN;
    }
    this.addPlayer=function(newPlayer){
      thisVoice.players.push(newPlayer);
      newPlayer.engine.connect(this.outputNode);
    }
    this.enqueueStart=function(){
      thisVoice.isLooping=true;
      thisVoice.isWaiting=true;
      thisVoice.handle("loopstatechange",{isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
      patchMan.handle("loopStateChange",{voice:thisVoice,isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});

      // console.log( "my beatslen"+thisVoice.players[currentPlayer].beatsLength );
      //pendant:consider using the startingtime to schedule playback with more precision
      //.start ([startTime][, offset][, duration])
    }
    this.enqueueStop=function(){
      thisVoice.isLooping=false;
      thisVoice.isWaiting=false;
      thisVoice.handle("loopstatechange",{isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
    }
    this.stop=function(){
      thisVoice.isPlaying=false;
      thisVoice.isWaiting=false;
      thisVoice.isLooping=false;
      thisVoice.players[currentPlayer].stop();
      thisVoice.handle("loopstatechange",{isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
    }
    this.play=function(){
      thisVoice.isPlaying=true;
      thisVoice.isWaiting=false;
      thisVoice.players[currentPlayer].play();
      thisVoice.handle("loopstatechange",{isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
      patchMan.handle("loopStateChange",{voice:thisVoice,isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
    }
    this.beat = function(e) {
      // console.log("beat");
      var step=e.step;
        if(step % thisVoice.players[currentPlayer].beatsLength == 0){
          if (thisVoice.isLooping) {
        // console.log("play");
          thisVoice.handle("loopstatechange",{isWaiting:thisVoice.isWaiting,isLooping:thisVoice.isLooping});
          thisVoice.play();
        }else{
          thisVoice.isPlaying=false;
        }
      }
    }
    transportMan.on('beat',this.beat);
  }
  return this;
})();

var patchMan=new(function(){
  this.currentPat=0;
  var audioCtx = new AudioContext();
  this.audioCtx=audioCtx;
  var masterNode=new Tone.Gain();
  masterNode.toMaster();
  var thisPatchMan=this;

  onHandlers.call(this);

  var effectsNode=Tone.context.createGain();
  var dryLevel=Tone.context.createGain();
  var wetLevel=Tone.context.createGain();
  effectsNode.connect(dryLevel);
  effectsNode.connect(wetLevel);


  var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5);
  // var convolver = new Tone.Convolver("Audio/impulses/RoomLarge.aiff");
  wetLevel.connect(feedbackDelay);
  feedbackDelay.connect(masterNode);
  // convolver.connect(masterNode);
  dryLevel.connect(masterNode);

  this.setWet=function(val){
    wetLevel.gain.value=val;
    dryLevel.gain.value=1-val;
    // feedbackDelay.feedback=value*0.7;
  }

  var loops=[];
  var voices=[];
  this.loops=loops;
  this.voices=voices;

  this.changePatternTo=function(n){
    console.log("patternto");
    this.currentPat=n;
    this.handle('patternchangerequested',n);
    for(var a in this.voices){
      this.voices[a].handle('patternchange',{newPatn:n,available:this.voices[a].changeCurrentPlayerToPatn(n)});
    }
  }

  this.databaseItem=function(itm){
    try{
      var newLooper=new loopMan.Player(itm.source);
      newLooper.properties=itm;
      newLooper.engine.connect(effectsNode);
      console.log("loading sample "+itm.name);
      loops.push(newLooper);
      if(!voices[itm.voicen]){
        //pendant: looper should be created in loopMan.Voice constructor
        voices[itm.voicen]=new loopMan.Voice(newLooper);
      }else{
        voices[itm.voicen].addPlayer(newLooper);
      }
    }catch(e){
      console.log("failed loading",itm,e);
    }
  }
  return this;
})();