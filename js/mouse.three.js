'use strict';
var mouse=new (function(){
  this.x=-4;
  this.y=-4;
  this.normalized=new THREE.Vector2(-4,-4);
  var underMouse;
  var raycaster = new THREE.Raycaster();
  var thisMouse=this;
  function raycast(){
    //pendant: there should perhaps be a mouse scene, so the raycaster doesnt have to scan the whole model
    raycaster.setFromCamera( thisMouse.normalized, camera );
    var intersects = raycaster.intersectObjects( scene.children , true);
    if ( intersects.length > 0 ) {
      if ( underMouse != intersects[ 0 ].object ) {
        if ( underMouse ) underMouse.handle('mouseleave',{});
        var thereis=false;
        var search=0;
        /*if(intersects[0].object.handle){
          underMouse=intersects[0].object;
          underMouse.handle('mouseenter');
        }else{
          underMouse=null;
        }*/
        for(search=0;(!thereis) && search<intersects.length;search++){
          if(intersects[search].object.handle){
            // console.log(intersects[search]);
            if(intersects[search].object.parent.clickEnabled){
              thereis=search;
            }else{
              // console.log(intersects[search].object);
            }
          }
        }
        if(thereis){
          // if(underMouse!= intersects[thereis].object){
            underMouse = intersects[thereis].object;
            //case where first intersect is object with handler
            // console.log(underMouse);
            underMouse.handle('mouseenter',{});
          // }
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
        underMouse.handle('mouseleave',{});
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
    raycast();
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