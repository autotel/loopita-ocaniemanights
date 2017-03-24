/*
This script create DOM sliders that can be used in web browser to control stuff. They can be synced through sockets and others by using callbacks.
    Copyright (C) 2016 Joaquín Aldunate

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

BaseComponent=function(parent,options){
  //my reference number for data binding. With this number the socket binder knows who is the reciever of the data, and also with what name to send it
  //pendant: this can potentially create a problem, because two objects can be created simultaneously at different ends at the same time.
  //maybe instead of the simple push, there could be a callback, adn the object waits to receive it's socket id once its creation was propagated throughout all the network, or maybe there is an array for senting and other different for receiving... first option seems more sensible
  this.data={value:0};
  this._bindN=syncman.bindList.push(this)-1;
  this.$jq=$('<div></div>');
  this.label="";
  this.labeljq=$('<p></p>');
  this.css={};
  this._appliedCss={};
  this.onClickCallback=function(a){};
  this.onReleaseCallback=function(a){};
  this.onChangeCallback=function(a){};
  if(typeof (parent.append||false)=="function"){
    parent.append(this.$jq);
  }else if(typeof (parent.$jq.append||false)=="function"){
    parent.$jq.append(this.$jq);
  }else{
    console.log("an element couldn't find dom element to attach himself");
  }
  var me=this;
  //these on functions should be part of a parent prototype, because they are redefined on every kind of mscomponent
  this.addClass=function(to){
    this.$jq.addClass(to);
  }
  this.vertical=true;
  this.addClass("vertical");
  this._mouseDownDistance=0;
  this.$jq.on("mousedown tap touchstart",function(event){
    event.preventDefault();
    var absoluteData=0;
    if(me.vertical){
        absoluteData=(1-event.offsetY/me.$jq.height());//,true
    }else{
        absoluteData=(event.offsetX/me.$jq.width());//,true
    }
    // console.log(me.mode);
    if(me.mode=="relative"){
      // console.log(me.data);
        me._mouseDownDistance=absoluteData-me.data.value;
    }else{
      me.setData(absoluteData,true);
    }
  });

  this.$jq.on("mousemove touchenter mouseleave mouseup",function(event){
    if(mouse.buttonDown){
      event.preventDefault();
      //is this an release or leave event? this measn that it's the last change that will happen
      var finalEvent=event.type=="mouseleave"||event.type=="mouseup";
      var absoluteData;
      if(me.vertical){
        //the strange second paramenter in setdata was true, but it could clog the socket
        absoluteData=1-event.offsetY/me.$jq.height();//,true
      }else{
        absoluteData=event.offsetX/me.$jq.width();//,true
      }
      if(me.mode=="relative"){
        me.setData(absoluteData-me._mouseDownDistance);
        // console.log(absoluteData,finalEvent);
      }else{
        me.setData(absoluteData,finalEvent);
      }
      if(finalEvent){
        me.onReleaseCallback(me);
      }
    }else{
    }
  });
  this.eval=function(){
    var jq=this.$jq;
    jq.addClass("turn");
    window.setTimeout(function(){
      jq.removeClass("turn");
    },200);
    return this.data.value;
  }

  this.setData(0);
  this.applyOptions(options);
}
BaseComponent.prototype.onChange=function(callback){
  this.onChangeCallback=callback;
  return this;
}
BaseComponent.prototype.onRelease=function(callback){
  this.onReleaseCallback=callback;
  return this;
}

BaseComponent.prototype.setData=function(to,emit){
  var me=this;
  if(emit===true){
    //pendant: in sequencers we use parent.id, and here we use _bindN. Towards a controller API and a more sensical code, I think both should use the bind element array. read note in first line of this file.
    //pendant: parent in seq is what me is here. this is pretty confusing var name decision
    syncman.emit("slid:"+me._bindN+"","sV",to);
  }
  this.data.value=to;
  this.onChangeCallback(this);
  this.updateDom();
}
BaseComponent.prototype.applyOptions=function(options){
  for(var a in options){
    this[a]=options[a];
  }
  this.updateDom();
}
BaseComponent.prototype.updateDom=function(){
  if(this.vertical){
    if(this.mode!=this._modeAppliedToDom){
      this._modeAppliedToDom=this.mode;
      if(this.mode=="relative"){
        this.$faderjq.css({"background-color":"transparent","border-top":"solid 3px"});
      }else{
        this.$faderjq.css({"background-color":"","border-top":"none"});
      }
    }
    this.$faderjq.css({bottom:0,width:"100%",height:this.data.value*this.$jq.height()});

  }else{
    if(this.mode!=this._modeAppliedToDom){
      this._modeAppliedToDom=this.mode;
      if(this.mode=="relative"){
        this.$faderjq.css({"background-color":"transparent","border-right":"solid 3px"});
      }else{
        this.$faderjq.css({"background-color":"","border-right":"none"});
      }
    }
    this.$faderjq.css({bottom:0,width:this.data.value*this.$jq.width()+"px",height:"100%"});
    this.labeljq.html(this.label);
    if(this.relative){
    }
    // console.log("dompu",this.data.value*this.$jq.width()+"px");
  }
}