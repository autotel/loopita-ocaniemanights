domList = [];
engineList = [];

var Looper;

$(window).on("load", function() {
	console.log("load");
	Looper = (function() {
		console.log("create looperman");
		//var $ = main.jQuery;
		console.log($);
		this.currentPat = 0;
		this.GuiLoop = function() {
			console.log("create looper");
			var me = this;
			//how many beats does this sample last
			this.beatsLength = 0;
			//wether triggering itself on each beatsLength cycle
			this.triggering = false;
			this.engine = false;
			this.appendend = false;
			this.playbackPosition = false;
			this.playbackRate = 1;
			this.length = 0;
			//this is the playback rate adjustment factor to the BPM. see tempoSync function
			this.playFactor = 1;
			//ui elements are distributed so to access them programatically in an efficient manner
			this.$ = {
				main: $('<div class="looper"></div>'),
				samplerTitle: $('<div class="ms-samplertitle">?</div>'),
				// playRatio:$('<div class="ms-display big">?</div>'),
				// sampLen:$('<div class="ms-display big">?</div>'),
				// playbackSliders:$('<div class="panel-playbackSliders"></div>'),
				// connectorsPanel:$('<div class="panel-connectors"></div>'),
				controlPanel: $('<div class="panel-control"></div>'),
			};
					//build the HTML ui, not yet appendend
			for (itm in this.$) {
				if (itm != "main") {
					this.$.main.append(this.$[itm]);
				}
			}
			this.components = {
				play: {},
				stop: new Button(this.$.controlPanel, {
						label: "■"
				}),
				// lock:new Button(this.$.controlPanel,{'switch':[
				//   {label:"Free ║",onClickCallback:function(){
				//     me.resetRate();
				//   }},
				//   {label:"Lokd ╫",onClickCallback:function(){
				//     me.tempoSync();
				//   }}
				// ]}),
				// playerPosition:new Slider(this.$.playbackSliders,{vertical:false}),
				// playerBender:new Slider(this.$.playbackSliders,{vertical:false,data:{value:0.5},mode:"relative"}),
				// double:new Button(this.$.controlPanel,{label:"*2"}),
				// half:new Button(this.$.controlPanel,{label:"/2"})
			}

			this.$appendTo = function($who) {
				if ($who.length > 0) {
					if (this.appended) {
						console.log("warning: this element was appended already");
					}
					$who.append(this.$.main);
					this.appendend = true;
				}
			}
			this.start = function() {
					if (this.playbackPosition === false) {
							this.playbackPosition = 0;
							this.$.main.addClass("playing");
					} else {
							this.engine.stop();
					}
					this.engine.start();
			}
			this.metroLoop = function() {
					this.$.main.addClass("waiting");
					this.isWaiting = true;
					//pendant: remeasure my own beatsLength here aswell.
					this.isTriggering = true;
			}
			this.beat = function(step) {
					if (this.isTriggering && step % this.beatsLength == 0) {
							this.start();
							if (this.isWaiting) {
									this.isWaiting = false;
									this.$.main.removeClass("waiting");
									this.$.main.addClass("playing");
							}
					}
			}

			this.stop = function() {
					if (this.playbackPosition !== false) {
							this.playbackPosition = false;
							this.$.main.removeClass("playing");
							if (this.isWaiting) {
									this.isWaiting = false;
									this.$.main.removeClass("waiting");
							}
					} else {}
					this.isTriggering = false;
					this.engine.stop();
			}
			this.setSampler = function(databaseItem) {
					var me = this;
					if (databaseItem.hasOwnProperty("source")) {
							if (databaseItem.hasOwnProperty("voicen")) {
									this.voicen = databaseItem.voicen;
									this.$.main.addClass("voicen-" + this.voicen);
							}
							if (databaseItem.hasOwnProperty("name")) {
									var titl = databaseItem.name;
									if (this.$.samplerTitle) this.$.samplerTitle.html(titl);
									var attrs = titl.split(' ');
									this.$.main.addClass("inst-" + attrs[0]);
									this.$.main.addClass("sub-" + attrs[1]);
							} else {
									if (this.$.samplerTitle) this.$.samplerTitle.html(databaseItem.source);
							}
							this.engine = new Tone.Player(databaseItem.source, function(a) {
									me.terminals = {
											// sound:new Connector(me.$.connectorsPanel,{audioNode:me.engine,label:"sound"}),
											// trigger:new Connector(me.$.connectorsPanel,{audioNode:me.engine,label:"trigger"})
									}
									me.beatsLength = Math.floor(globalTransport.bps * me.engine.buffer.duration);
									if (me.$.sampLen) me.$.sampLen.html(me.engine.buffer.duration + "beats that take: " + (me.beatsLength));
									// me.terminals.sound.connect();
									//apparently this way of scheduling events is not so good idea
									//I should try with the sequencer approach tomorrow. Is much more original, precise and versatile
									if (me.components.play) me.components.play = new Button(me.$.controlPanel, {
											label: "►"
									}).onClick(function() {
											me.metroLoop();
									});
									if (me.components.stop) me.components.stop.onClick(function() {
											me.stop();
									});
									if (me.components.double) me.components.double.onClick(function() {
											me.tempoFactor(2);
									});
									if (me.components.half) me.components.half.onClick(function() {
											me.tempoFactor(0.5);
									});
									if (me.components.playerBender) me.components.playerBender.onRelease(function(bender) {
											bender.setData(0.5);
									});
									if (me.components.playerBender) me.components.playerBender.onChange(function(bender) {
											var value = bender.data.value * 2;
											me.engine.playbackRate = (me.playbackRate) * value;
									});
							}).toMaster();
							this.engine.loop = false;
							this.engine.retrigger = true;
					} else {
							console.log("sorry, databaseItem didnt specify a source ", databaseItem);
					}
			}



			this.tempoSync = function(factor) {
					//pendant:this is a dummy adjustment technique. it needs development to be good enough
					//should look for the playback rate that is nearest to the current playback rate
					//pendiente: should I use duration or stated bpm?
					var duration = this.engine._buffer._buffer.duration;
					var bps = Tone.Transport.bpm.value / 60; //beats per second
					var beatDuration = 1 / bps;
					//search for nearest amount of beats to length
					var found = false;
					var currentAdjust = (duration / beatDuration) / 64;
					while (!found) {
							//going in powers of two
							currentAdjust *= 2;
							//dummy placeholder statement. There should be one that looks the clostest currentAdjust to 1
							if (currentAdjust > 0.5)
									found = true;
					}
					if (!factor) {
							factor = 1;
					}
					this.playFactor *= factor;
					this.playbackRate = currentAdjust * this.playFactor
					this.engine.playbackRate = this.playbackRate;
					this.$.playRatio.html("R:" + this.playbackRate);
			}
			this.tempoFactor = function(factor) {
					this.playFactor *= factor;
					this.playbackRate *= factor;
					this.engine.playbackRate = this.playbackRate;
					this.$.playRatio.html("R:" + this.playbackRate);
			}
			this.resetRate = function(rate) {
					if (!rate)
							rate = 1;
					//pendant: the following line is probably wrong:
					this.playFactor /= rate;
					this.playbackRate = rate;
					this.engine.playbackRate = this.playbackRate;
					this.$.playRatio.html("R:" + this.playbackRate);
			}
			return this;
		}
		return this;
	})();
});