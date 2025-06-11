'use strict';
/*
regex snippets:
#find all by name component:

#created a new field in db
	*find_Part(\d\d).*
	*replace $&,\n\t\t"voicen":$1


*/
var states={
  0:{can:[1,2,3,4,6]},//br
  1:{can:[2,3,4,6]},//br
  2:{can:[1,3,4,6]},//br
  3:{can:[1,2,4,6]},//br

  4:{can:[5,0,1,2,3],switches:[5]},//chorus
  5:{can:[4,0,1,2,3],switches:[4]},//chorus

  6:{can:[0,1,2,3]},//chorus
}
var loopsDatabase=[{
    "name": "organ minor",
    "source": "audio/024_OcanBridg0_Part04.mp3",
		"voicen":4,
		"patn":[0]
}, {
    "name": "djembe low pat 01",
    "source": "audio/024_OcanBridg0_Part05.mp3",
		"voicen":5,
		"patn":[0]
}, {
    "name": "djembe hi pat 02",
    "source": "audio/024_OcanBridg0_Part06.mp3",
		"voicen":6,
		"patn":[0]
}, {
    "name": "hey nrm pat 01",
    "source": "audio/024_OcanBridg0_Part07.mp3",
		"voicen":7,
		"patn":[0,2,3,4,5,6]
}, {
    "name": "kick hi pat 01",
    "source": "audio/024_OcanBridg0_Part09.mp3",
		"voicen":9,
		"patn":[0]
}, {
    "name": "clap nrm pat 1",
    "source": "audio/024_OcanBridg0_Part11.mp3",
		"voicen":11,
		"patn":[0]
}, /*{
    "name": "kick low pat 01",
    "source": "audio/024_OcanBridg0_Part12.mp3",
		"voicen":12
}, */{
    "name": "ride nrm pat 01",
    "source": "audio/024_OcanBridg0_Part14.mp3",
		"voicen":14,
		"patn":[0]
}, /*{
    "name": "djembe gesture pat 01",
    "source": "audio/024_OcanBridg0_Part16.mp3",
		"voicen":16
}, */{
    "name": "bass acid pat 01",
    "source": "audio/025_OcanChor1_Part01.mp3",
		"voicen":1,
		"patn":[1]
}, {
    "name": "pad nrm pat minor",
    "source": "audio/025_OcanChor1_Part02.mp3",
		"voicen":2,
		"patn":[1]
}, {
    "name": "organ merry chords",
    "source": "audio/025_OcanChor1_Part04.mp3",
		"voicen":4,
		"patn":[1]
}, {
    "name": "djembe low pat 02",
    "source": "audio/025_OcanChor1_Part05.mp3",
		"voicen":5,
		"patn":[2,3,4,5,6]
}, {
    "name": "djembe hi pat 02",
    "source": "audio/025_OcanChor1_Part06.mp3",
		"voicen":6,
		"patn":[2,3,4,5,6]
}, {
    "name": "hey nrm pat 02",
    "source": "audio/025_OcanChor1_Part07.mp3",
		"voicen":7,
		"patn":[1]
}, {
    "name": "shaker nrm pat 01.mp3",
    "source": "audio/025_OcanChor1_Part08.mp3",
		"voicen":8,
		"patn":[1,2,3]
}, {
    "name": "kick hi pat 02.mp3",
    "source": "audio/025_OcanChor1_Part09.mp3",
		"voicen":9,
		"patn":[1]
}, {
    "name": "snare merry",
    "source": "audio/025_OcanChor1_Part10.mp3",
		"voicen":10,
		"patn":[1]
}, /*{
    "name": "clap nrm",
    "source": "audio/025_OcanChor1_Part11.mp3",
		"voicen":11,
		"patn":[1,3,4,5,6]
}, */{
    "name": "kick low",
    "source": "audio/025_OcanChor1_Part12.mp3",
		"voicen":12,
		"patn":[1,4,5,6]
}, {
    "name": "djembe higher",
    "source": "audio/025_OcanChor1_Part15.mp3",
		"voicen":15,//this is mapped wrong with respect to electribe
		"patn":[2,3,4,5,6]
}, {
    "name": "djembe gesture",
    "source": "audio/025_OcanChor1_Part16.mp3",
		"voicen":16,//this is mapped wrong with respect to electribe
		"patn":[2,3,4,5,6]
}, {
    "name": "bass acid",
    "source": "audio/026_OcanBridg1_Part01.mp3",
		"voicen":1,
		"patn":[2]
}, {
    "name": "pad nrm",
    "source": "audio/026_OcanBridg1_Part02.mp3",
		"voicen":2,
		"patn":[2]
}, {
    "name": "organ super",
    "source": "audio/026_OcanBridg1_Part03.mp3",
		"voicen":3,
		"patn":[2]
}, {
    "name": "organ merry",
    "source": "audio/026_OcanBridg1_Part04.mp3",
		"voicen":4,
		"patn":[2]
},/* {
    "name": "hey nrm",
    "source": "audio/026_OcanBridg1_Part07.mp3",
		"voicen":7
},*/ {
    "name": "shaker nrm",
    "source": "audio/026_OcanBridg1_Part08.mp3",
		"voicen":8,
		"patn":[4,5,6,7]
}, {
    "name": "kick hi",
    "source": "audio/026_OcanBridg1_Part09.mp3",
		"voicen":9,
		"patn":[2]
}, {
    "name": "snare merry",
    "source": "audio/026_OcanBridg1_Part10.mp3",
		"voicen":10,
		"patn":[2,3,4,5,6]
}, /*{
    "name": "kick low",
    "source": "audio/026_OcanBridg1_Part12.mp3",
		"voicen":12
},*/ {
    "name": "bass acid",
    "source": "audio/027_OcanBridg2_Part01.mp3",
		"voicen":1,
		"patn":[3]
}, {
    "name": "pad nrm",
    "source": "audio/027_OcanBridg2_Part02.mp3",
		"voicen":2,
		"patn":[3]
}, /*{
    "name": "djembe low pat",
    "source": "audio/027_OcanBridg2_Part05.mp3",
		"voicen":5,
    "patn":[2,3,4,5,6]
}, {
    "name": "djembe hi pat",
    "source": "audio/027_OcanBridg2_Part06.mp3",
		"voicen":6,
    "patn":[2,3,4,5,6]
}, {
    "name": "hey nrm",
    "source": "audio/027_OcanBridg2_Part07.mp3",
		"voicen":7
}, */{
    "name": "kick hi",
    "source": "audio/027_OcanBridg2_Part09.mp3",
		"voicen":9,
		"patn":[3]
}, /*{
    "name": "snare merry",
    "source": "audio/027_OcanBridg2_Part10.mp3",
		"voicen":10
},*/ {
    "name": "clap nrm",
    "source": "audio/027_OcanBridg2_Part11.mp3",
		"voicen":11,
    "patn":[2,3,4,5,6]
}, {
    "name": "kick low",
    "source": "audio/027_OcanBridg2_Part12.mp3",
		"voicen":12,
		"patn":[3]
}, {
    "name": "hh a.mp3",
    "source": "audio/027_OcanBridg2_Part13.mp3",
		"voicen":13,
		"patn":[3]
}, {
    "name": "hh b.mp3",
    "source": "audio/027_OcanBridg2_Part14.mp3",
		"voicen":14,
		"patn":[3]
}, {
    "name": "organ super",
    "source": "audio/028_OcanChor1Var1_Part03.mp3",
		"voicen":3,
		"patn":[4]
}, {
    "name": "organ merry",
    "source": "audio/028_OcanChor1Var1_Part04.mp3",
		"voicen":4,
		"patn":[4]
}, /*{
    "name": "djembe low pat",
    "source": "audio/028_OcanChor1Var1_Part05.mp3",
		"voicen":5
}, {
    "name": "djembe hi pat",
    "source": "audio/028_OcanChor1Var1_Part06.mp3",
		"voicen":6
}, /*{
    "name": "hey nrm",
    "source": "audio/028_OcanChor1Var1_Part07.mp3",
		"voicen":7
}, {
    "name": "shaker nrm",
    "source": "audio/028_OcanChor1Var1_Part08.mp3",
		"voicen":8
},*/ {
    "name": "kick hi",
    "source": "audio/028_OcanChor1Var1_Part09.mp3",
		"voicen":9,
		"patn":[4]
},/* {
    "name": "snare merry",
    "source": "audio/028_OcanChor1Var1_Part10.mp3",
		"voicen":10
}, {
    "name": "clap nrm",
    "source": "audio/028_OcanChor1Var1_Part11.mp3",
		"voicen":11
}, {
    "name": "kick low",
    "source": "audio/028_OcanChor1Var1_Part12.mp3",
		"voicen":12
}, */{
    "name": "organ super",
    "source": "audio/029_OcanChor1Var2_Part03.mp3",
		"voicen":3,
		"patn":[5]
}, {
    "name": "organ merry",
    "source": "audio/029_OcanChor1Var2_Part04.mp3",
		"voicen":4,
		"patn":[5]
}, /*{
    "name": "djembe low pat",
    "source": "audio/029_OcanChor1Var2_Part05.mp3",
		"voicen":5
}, {
    "name": "djembe hi pat",
    "source": "audio/029_OcanChor1Var2_Part06.mp3",
		"voicen":6
}, /*{
    "name": "hey nrm",
    "source": "audio/029_OcanChor1Var2_Part07.mp3",
		"voicen":7
}, {
    "name": "shaker nrm",
    "source": "audio/029_OcanChor1Var2_Part08.mp3",
		"voicen":8
}, */{
    "name": "kick hi",
    "source": "audio/029_OcanChor1Var2_Part09.mp3",
		"voicen":9,
		"patn":[5]
},/* {
    "name": "snare merry",
    "source": "audio/029_OcanChor1Var2_Part10.mp3",
		"voicen":10
}, {
    "name": "clap nrm",
    "source": "audio/029_OcanChor1Var2_Part11.mp3",
		"voicen":11
}, {
    "name": "kick low",
    "source": "audio/029_OcanChor1Var2_Part12.mp3",
		"voicen":12
},{
    "name": "djembe gesture",
    "source": "audio/029_OcanChor1Var2_Part16.mp3",
		"voicen":16
},*/ {
    "name": "bass acid",
    "source": "audio/030_OcanClos1Var1_Part01.mp3",
		"voicen":1,
		"patn":[6,5]
}, {
    "name": "organ super",
    "source": "audio/030_OcanClos1Var1_Part03.mp3",
		"voicen":3,
		"patn":[6]
}, {
    "name": "organ merry",
    "source": "audio/030_OcanClos1Var1_Part04.mp3",
		"voicen":4,
		"patn":[6]
}, /*{
    "name": "djembe low pat",
    "source": "audio/030_OcanClos1Var1_Part05.mp3",
		"voicen":5
}, {
    "name": "djembe hi pat",
    "source": "audio/030_OcanClos1Var1_Part06.mp3",
		"voicen":6
}, /*{
    "name": "hey nrm",
    "source": "audio/030_OcanClos1Var1_Part07.mp3",
		"voicen":7
}, {
    "name": "shaker nrm",
    "source": "audio/030_OcanClos1Var1_Part08.mp3",
		"voicen":8
}, */{
    "name": "kick hi",
    "source": "audio/030_OcanClos1Var1_Part09.mp3",
		"voicen":9,
		"patn":[6]
}, /*{
    "name": "snare merry",
    "source": "audio/030_OcanClos1Var1_Part10.mp3",
		"voicen":10
}, {
    "name": "clap nrm",
    "source": "audio/030_OcanClos1Var1_Part11.mp3",
		"voicen":11
}, {
    "name": "kick low",
    "source": "audio/030_OcanClos1Var1_Part12.mp3",
		"voicen":12
}, {
    "name": "djembe higher",
    "source": "audio/030_OcanClos1Var1_Part15.mp3",
		"voicen":15
}, /*{
    "name": "djembe gesture",
    "source": "audio/030_OcanClos1Var1_Part16.mp3",
		"voicen":16
}, */{
    "name": "percussion swing 00",
    "source": "audio/percBack.mp3",
		"voicen":0,
		"patn":[1,2,3,4,5,6]
},
// {
//     "name": "trumpet loop",
//     "source": "audio/works/tlgen/benjaminharveydesign__rhinoceros-trumpet.wav",
//     "patn":[0,1,2,3,4,5,6],
//     "voicen":17
// }

]
var grains=[]
