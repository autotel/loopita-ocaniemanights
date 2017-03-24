var loop;
var transportCurrentStep=0;
var globalTransport=false;
var transportStart;
$(window).on("load",function(){
  transportStart=function(){
    this.bps=(Tone.Transport.bpm.value/60);
    this.beatCalls=[
      function(){
        $("#listContainer").html("<pre>"+beatCalls.length+"</pre>");
      }
    ];
    Tone.Transport.scheduleRepeat (function(time){
      for(var n in beatCalls){
        beatCalls[n]({time:time,step:transportCurrentStep});
      }
      transportCurrentStep++;

    }, "32n");
    Tone.Transport.start();
    Tone.Transport.bpm.value = 120;
    this.onBeat=function(call){
      handlern=beatCalls.push(call);
      return beatCalls[handlern-1];
    }
    this.offBeat=function(handler){
      return beatCalls.splice(handler);
    }
    return this;
  };
  globalTransport=transportStart();
});