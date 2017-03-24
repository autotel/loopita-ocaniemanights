Rack=function(parent,options){
  var me=this;
  this.effects={};
  this.appendend=false;
  this.$={
    main:$('<div class="rack"></div>'),
  }
  //build the HTML ui, not yet appendend
  for(itm in this.$){
    if(itm!="main"){
      this.$.main.append(this.$[itm]);
    }
  }
  //pendant: this should be part of a base prototype, not repeated in each type
  if(typeof (parent.append||false)=="function"){
    parent.append(this.$.main);

  }else{
    console.log("a rack couldn't find dom element to attach himself");
  }
  this.effects.master=new Effect(this.$.main,{terminals:{master:new Connector(this.$.main,{label:"master out",audioNode:Tone.Master})}});
}
Effect=function(parent,options){
  var me=this;
  this.appendend=false;
  this.$={
    main:$('<div class="effect"></div>'),
  }
  this.terminals={
  }
  this.audioNode;
  //build the HTML ui, not yet appendend
  for(itm in this.$){
    if(itm!="main"){
      this.$.main.append(this.$[itm]);
    }
  }
  //pendant: this should be part of a base prototype, not repeated in each type
  if(typeof (parent.append||false)=="function"){
    parent.append(this.$.main);
  }else{
    console.log("an effect couldn't find dom element to attach himself");
  }
  this.applyOptions(options);
}
Effect.prototype.applyOptions=function(options){
  for(var a in options){
    this[a]=options[a];
  }
  this.updateDom();
}
Effect.prototype.updateDom=function(){
  console.log("update dom of effect has not been implemented yet");
}
