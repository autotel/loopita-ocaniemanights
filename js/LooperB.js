var loopMan=(function(){
  onHandlers.call(this);
  this.metroMan=(function(){
    onHandlers.call(this);
    //controls looper timers with callbak
    return this;
  })();
  this.Looper=function(){
    this.engine=new Tone.Sampler();
    //connect output to master
    //fns
    this.enqueueStart=function(){}
    this.enqueueStop=function(){}
    this.play=function(){}
    this.stop=function(){}
  }
  return this;
})();
