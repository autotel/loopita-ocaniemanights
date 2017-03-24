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
Cable=function(parent,options){
  this.$jq=$('<div class="connector-cable"></div>');
  this.startTerminal={audioNode:{connect:function(to){console.log("connecting nothing to "+to);}}};
  this.endTerminal={audioNode:"nothing",$jq:$('<div style="position:fixed; z-index:2"></div>')};
  return this;
}
Cable.prototype.setStart=function(terminal){
  this.startTerminal=terminal;
  var me=this;
  this.endTerminal={audioNode:"nothing",$jq:$('<div style="position:absolute; z-index:2"></div>')};
  $("body").append(this.endTerminal.$jq);
  this.startTerminal.$jq.append(this.$jq);
  this._terminalUnderCursor=false;
  mouse.dragEngage({
    engageCable:this,
    onMoveCallback:function(event){
      event.preventDefault();
      var startOffset=me.startTerminal.$jq.offset();
      var distx=event.clientX-startOffset.left;
      var disty=(event.clientY+$(window).scrollTop())-startOffset.top;
      me.endTerminal.$jq.css({left:event.clientX,top:event.clientY});
      me.$jq.css({width:Math.sqrt(distx*distx+disty*disty)+"px",transform:"rotateZ("+Math.atan2(disty,distx)+"rad)",});
      // console.log(me._terminalUnderCursor);
    },onReleaseCallback:function(event){
      console.log(me._terminalUnderCursor);
      if(me._terminalUnderCursor){
        me.setEnd(me._terminalUnderCursor);
      }else{
        me.endTerminal.$jq.detach();
        me.$jq.detach();
        mouse.dragDisengage();
      }
    }
  });
  this.$jq.appendTo(terminal.jq);


}
Cable.prototype.setEnd=function(terminal){
  var startOffset=this.startTerminal.$jq.offset();
  var endOffset=this.endTerminal.$jq.offset();
  var distx=endOffset.left-startOffset.left;
  var disty=endOffset.top-startOffset.top;
  // this.$jq.css({width:Math.sqrt(distx*distx+disty*disty)+"px",transform:"rotateZ("+Math.atan2(disty,distx)+"rad)",});
  this.endTerminal=terminal;
  this.makeConnections();
}
Cable.prototype.makeConnections=function(){
  // console.log(this.startTerminal.audioNode);
  try{
    this.startTerminal.audioNode.connect(this.endTerminal.audioNode);
    mouse.dragDisengage();
  }
  catch(a){
    console.log("sorry, I could not make this connection",a);
    console.log("connect:",this.startTerminal.audioNode);
    console.log("->to:",this.endTerminal.audioNode);
    mouse.dragDisengage();
    this.$jq.css({"opacity":"0.5"});
    // this.$jq.detach();
  }
}
Connector=function(parent,options){
  //my reference number for data binding. With this number the socket binder knows who is the reciever of the data, and also with what name to send it
  //pendant: this can potentially create a problem, because two objects can be created simultaneously at different ends at the same time.
  //maybe instead of the simple push, there could be a callback, adn the object waits to receive it's socket id once its creation was propagated throughout all the network, or maybe there is an array for senting and other different for receiving... first option seems more sensible
  this.data={value:0};
  this.mode="absolute";
  this._bindN=syncman.bindList.push(this)-1;
  this.$jq=$('<div class="connector-terminal" style="position:relative"></div>');
  this.cables=[];
  this._cableOnCreation=false;
  this.label="";
  this.$labeljq=$('<p class="label connector-label">hola</p>');
  // this.$jq.append(this.$labeljq);
  this.audioNode={connect:function(to){console.log("connecting nothing to "+to)}};

  this.onReleaseCallback=function(a){};
  this.onChangeCallback=function(a){};
  //pendant: this should be part of a base prototype, not repeated in each type
  if(typeof (parent.append||false)=="function"){
    parent.append(this.$jq);
    parent.append(this.$labeljq);
  }else if(typeof (parent.$jq.append||false)=="function"){
    parent.$jq.append(this.$jq);
    parent.append(this.$labeljq);
  }else{
    console.log("a slider couldn't find dom element to attach himself");
  }
  var me=this;
  //these on functions should be part of a parent prototype, because they are redefined on every kind of mscomponent
  this.onChange=function(callback){
    me.onChangeCallback=callback;
    return this;
  }
  this.onRelease=function(callback){
    me.onReleaseCallback=callback;
    return this;
  }

  this.addClass=function(to){
    this.$jq.addClass(to);
  }
  this.vertical=true;
  this.addClass("vertical");
  this._mouseDownDistance=0;
  this.$jq.on("mousedown tap touchstart",function(event){
    event.preventDefault();
    var absoluteData=0;
  });

  this.$jq.on("mousedown",function(event){
    me._cableOnCreation=new Cable(me).setStart(me);
    me.cables.push(me._cableOnCreation);
  });
  this.$jq.on("mouseenter",function(event){
    if(mouse.dragEngaged){
      if(mouse.hasOwnProperty("engageCable")){
        mouse.engageCable._terminalUnderCursor=me;
      }
    }
  });
  this.$jq.on("mouseleave",function(event){
    if(mouse.dragEngaged){
      if(mouse.hasOwnProperty("engageCable")){
        mouse.engageCable._terminalUnderCursor=false;
      }
    }
  });
  this.setData(0);
  if(options){
    this.applyOptions(options);
    if(options.css)
      this.$jq.css(options.css);
  }
  this.css=function(css){
    this.$jq.css(css);
    return this;
  }
}
Connector.prototype.setData=function(to,emit){
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
Connector.prototype.applyOptions=function(options){
  for(var a in options){
    this[a]=options[a];
  }
  this.updateDom();
}
Connector.prototype.updateDom=function(){
  this.$labeljq.html(this.label);
}