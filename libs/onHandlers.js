/*
repository of this module is at
https://github.com/autotel/on
*/
onHandlers=function(){
  var eventVerbose=false;
  var owner=this;
  if (!this.ons) {
    this.ons = [];
  }
  this.on = function(name, callback) {
    var name = name.split(".");
    if (typeof callback === 'function') {
      if (name.length == 0) {
        throw ("sorry, you gave an invalid event name");
      } else if (name.length > 0) {
        if (!this.ons[name[0]]) this.ons[name[0]] = [];
        this.ons[name[0]].push([false, callback]);
      }
      // console.log(this.ons);
    } else {
      throw ("error at mouse.on, provided callback that is not a function");
    }
    return this;
  }
  // this.once = function(name, callback) {
  //   var name = name.split(".");
  //   if (typeof callback === 'function') {
  //     if (name.length == 0) {
  //       throw ("sorry, you gave an invalid event name");
  //     } else if (name.length > 0) {
  //       if (!this.ons[name[0]]) this.ons[name[0]] = [];
  //       this.ons[name[0]].push([true, callback]);
  //     }
  //     // console.log(this.ons);
  //   } else {
  //     throw ("error at mouse.on, provided callback that is not a function");
  //   }
  //   return this;
  // }
  this.off = function(name) {
    var name = name.split(".");
    if (name.length > 1) {
      if (!this.ons[name[0]]) this.ons[name[0]] = [];
      // console.log("prev",this.ons[name[0]]);
      this.ons[name[0]].splice(this.ons[name[0]].indexOf(name[1]), 1);
      // console.log("then",this.ons[name[0]]);
    } else {
      throw ("sorry, you gave an invalid event name" + name);
    }
  }
  this.handle = function(fname, params) {
    if(eventVerbose) console.log("Event "+fname+":",{caller:this,params:params});
    if (this.ons[fname]) {
      for (var n in this.ons[fname]) {
        //pendant: how to make a better error handling? otherwise the function is bubbling the error to the handle() caller!!
        try{
          // console.log(this.ons[fname][n][1]);
          this.ons[fname][n][1].call(owner,params);
          //if the flag is set to do once
          if(this.ons[fname][n][0]){
            this.ons[fname].splice(this.ons[fname][n], 1);
          }
        }catch(e){
          throw ("onHandler: error with "+fname+" callback:",e);
        }
      }
    }
  }

};