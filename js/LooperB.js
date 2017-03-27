var loopMan=(function(){
  onHandlers.call(this);
  this.metroMan=(function(){
    onHandlers.call(this);
    //controls looper timers with callbak
    return this;
  })();
  this.Looper=function(sample){
    var thisLooper=this;
    this.engine=new Tone.Player(sample);
    //connect output to master
    //fns
    this.enqueueStart=function(){
      //pendant:consider using the startingtime to schedule playback with more precision
      //.start ([startTime][, offset][, duration])
    }
    this.enqueueStop=function(){
    }
    this.play=function(){
      thisLooper.engine.start ();
    }
    this.stop=function(){}
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
  this.loops=loops;
  this.voices=voices;
  this.voiceOutputNodes=voiceOutputNodes;
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