var mouse=(function(){
  this.x=0;
  this.y=0;
  this.normalized=new THREE.Vector2(0,0);
  var underMouse;
  var raycaster = new THREE.Raycaster();
  var thisMouse=this;
  raycast=function(){
    raycaster.setFromCamera( thisMouse.normalized, camera );
    var intersects = raycaster.intersectObjects( scene.children , true);
    if ( intersects.length > 0 ) {
      if ( underMouse != intersects[ 0 ].object ) {
        if ( underMouse ) underMouse.handle('mouseleave');
        var thereis=false;
        var search=0;
        for(search=0;!thereis && search<intersects.length;search++){
          if(intersects[search].object.handle){
            thereis=search;
          }
        }
        if(thereis){
          //case where first intersect is object with handler
          underMouse = intersects[thereis].object;
          underMouse.handle('mouseenter');
        }else{
          //case intersect goes to object with handler to object without
          // console.log(intersects[0].object);
          underMouse = null;
        }
      }
    } else {
      if(underMouse)
      if(underMouse.handle){
        //case there was object with handler last frame but not anymore
        underMouse.handle('mouseleave');
        underMouse = null;
      }
    }
  }

  document.addEventListener("mousemove",function(e){
    // console.log(e);
    thisMouse.x=e.clientX;
    thisMouse.y=e.clientY;
    thisMouse.normalized.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    thisMouse.normalized.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
  });
  document.addEventListener("mousedown",function(e){
    if(underMouse)
    if(underMouse.handle){
      underMouse.handle("mousedown",e);
    }
  });
  document.addEventListener("mouseup",function(e){
    if(underMouse)
    if(underMouse.handle){
      underMouse.handle("mouseup",e);
    }
  });
  return this;
})();