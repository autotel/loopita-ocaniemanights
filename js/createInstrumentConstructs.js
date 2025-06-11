'use strict';
function createInstrumentConstructs(){



// 			6instSub-Organillo-Cuerpo-001  clickable.three.js:56:5
// toggling into start  LooperB.js:115:9
// 3inst-bombo-001  clickable.three.js:56:5
// toggling into start  LooperB.js:115:9
// 8inst-Timbal-001  clickable.three.js:56:5
// toggling into start  LooperB.js:115:9
// 13inst-Timbal-000  clickable.three.js:56:5
// toggling into start  LooperB.js:115:9
// 10inst-Clap  clickable.three.js:56:5
// toggling into start  LooperB.js:115:9



	var ssDSPR=function(){
		var construct=this;
		this.voice.on('patternchange',function(e){
			// mainLightsLevel=0;
			setTimeout(function(){mainLightsLevel=1},100);
			// console.log(this);
			if(!e.available){
				if(construct.isAppeared){
					construct.disappear();
				}
			}else{
				if(!construct.isAppeared){
					construct.appear();
				}
			}
		});
	}
	var GCKBMN=function(name){
		for(var a of clickables){
			// console.log("+",a.object.name+"!="+name);
			if(a.object.name==name)
			return a
		}
		for(var a of unclickables){
			// console.log("+",a.object.name+"!="+name);
			if(a.object.name==name)
			return a
		}
		console.error(name+" not found in scenery");
	}
	var shakerNin;
	var checkIfReadyForShakers=function(){
		console.log(worldManager.instrumentList);
		if (worldManager.instrumentList['organillo_1'].voice.isLooping
			&&worldManager.instrumentList['kick_1'].voice.isLooping
			&&worldManager.instrumentList['timbal_1'].voice.isLooping
			&&worldManager.instrumentList['timbal_2'].voice.isLooping
			&&worldManager.instrumentList.clap.voice.isLooping){
			shakerNin.appear();
		}else{
			shakerNin.disappear();
		}
	}
	//!7 hey is not mapped to any instrument nor 14 ride 2  minor pad 13 hh, 17 trumps
	var nin;
	nin=new InstrumentConstruct(
		"bombo",
		[GCKBMN("inst-bombo-002"),
		GCKBMN("inst-bombo-003"),
		GCKBMN("inst-bombo-004")],
		0
	);
	ssDSPR.call(nin);
	nin.setColor(0x00008f);
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"kick_1",
		[GCKBMN("inst-bombo-001")],
		9
	);
	ssDSPR.call(nin);
	nin.setColor(0x00008f);
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){
			checkIfReadyForShakers()
			// changePatternTo(1);
		}
	});
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"kick_2",
		[GCKBMN("inst-bombo-000")],
		12
	);
	ssDSPR.call(nin);
	nin.setColor(0x00008f);
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"shakers",
		[GCKBMN("inst-Shaker-000"),
		GCKBMN("inst-Shaker-001")],
		8
	);
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){

			patchMan.changePatternTo(1);
		}
	});
	shakerNin=nin;
	nin.unclickables=[GCKBMN("pie-shakers")];
	nin.on('update',function(e){
		if(this.voice.isPlaying&&e.soundForce){
			this.clickables[0].object.rotation.z=e.soundForce*3.6;
			this.clickables[1].object.rotation.z=e.soundForce*-3.6;
			this.clickables[0].object.rotation.y=e.soundForce*3.6;
			this.clickables[1].object.rotation.y=e.soundForce*-3.6;
		}
	});
	ssDSPR.call(nin);
	nin.setColor(0xFFFFFF);
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"timbal_1",
		[GCKBMN("inst-Timbal-001")],
		5
	);
	ssDSPR.call(nin);
	nin.setColor(0x763f2a);
	nin.unclickables=[GCKBMN("pie-timbales")];
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){
			checkIfReadyForShakers()
			// changePatternTo(1);
		}
	});
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"timbal_2",
		[GCKBMN("inst-Timbal-000")],
		6
	);
	ssDSPR.call(nin);
	nin.setColor(0x763f2a);
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){
			checkIfReadyForShakers()
			// changePatternTo(1);
		}
	});
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"organillo_1",
		[GCKBMN("instSub-Organillo-Cuerpo-001"),
		GCKBMN("instSub-Organillo-Manilla-001")],
		4
	);
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){
			checkIfReadyForShakers()
			// changePatternTo(1);
		}
	});
	nin.on('update',function(e){
		if(this.voice.isPlaying)
		this.clickables[1].object.rotation.x+=e.deltaTime*1.5;
	});

	ssDSPR.call(nin);

	nin.unclickables=[GCKBMN("pie-organillo-002")];

	nin.setColor(0x00ffff);
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"organillo_2",
		[GCKBMN("instSub-Organillo-Cuerpo-000"),
		GCKBMN("instSub-Organillo-Manilla-000")],
		3
	);
	nin.on('update',function(e){
		if(this.voice.isPlaying)
		this.clickables[1].object.rotation.x+=e.deltaTime*1.5;
	});
	ssDSPR.call(nin);
	nin.setColor(0x00ffff);
	nin.unclickables=[GCKBMN("pie-organillo-001")];
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"snare",
		[GCKBMN("inst-Snare")],
		10
	);
	ssDSPR.call(nin);
	nin.setColor(0xffff00);
	nin.unclickables=[GCKBMN("pie-snare")];

	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"clap",
		[GCKBMN("inst-Clap")],
		11
	);
	ssDSPR.call(nin);
	nin.setColor(0xccff00);
	nin.on('mousedown',function(){
		if(patchMan.currentPat==0){
			checkIfReadyForShakers()
			// changePatternTo(1);
		}
	});
	nin.unclickables=[GCKBMN("pie-clap")];
	instrumentConstructs.push(nin);
	nin=new InstrumentConstruct(
		"bass",
		[GCKBMN("inst-bass")],
		1
	);
	ssDSPR.call(nin);
	nin.setColor(0xff00ff);
	nin.unclickables=[GCKBMN("pie-bass")];
	instrumentConstructs.push(nin);


	for(var a=1; a<=6; a++){
		nin=new CubeConstruct(GCKBMN("Cube-00"+(a-1)),a);
		buttonConstructs.push(nin);
	}
	nin=new endingTriggerConstruct(GCKBMN("final-000"),a);
	buttonConstructs.push(nin);

}