Mouse=function(){
  this.tool="draw";
  this.onMoveCallback=function(event){
  };
  this.onReleaseCallback=function(event){
  };
  dragEngaged=false;
}
Mouse.prototype.dragEngage=function(options){
  if(!this.dragEngaged){
    this._preEngageOptions={}
    for(var a in options){
      if(this.hasOwnProperty(a)){
        this._preEngageOptions[a]=this[a];
      }
      this[a]=options[a];
    }
    this.dragEngaged=true;
  }else{
    log("mouse engage requested, but it was already");
  }
}
Mouse.prototype.dragDisengage=function(){
  for(var a in this._preEngageOptions){
    this[a]=this._preEngageOptions[a];
  }
  this.dragEngaged=false;
}
mouse=new Mouse();


$(document).ready(function(){
  $(document).on("mousemove",function(event){
    mouse.onMoveCallback(event);
  });
  $(document).on("mousedown touchstart touchmove",function(event){
    mouse.buttonDown=true;
    // console.log(event);
  });
  $(document).on("mouseup touchend",function(event){
    mouse.onReleaseCallback(event);
    mouse.buttonDown=false;
  });
  // document.ontouchmove = function(event){
  //   event.preventDefault();
  // }
});