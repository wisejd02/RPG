var selFighter;
var attacker;
var defender;
var graveYard;
var numFighters;
var fighterList = {};
$(".btn-block").prop("disabled",true);
//btn event handler to start game
$(".newGm").on("click",function(){

    newGame();
})
//sets up new game
function newGame (){
   
    $(".newGm").prop("disabled",true);
    createFighterList();
    graveYard = [];
    selFighter = false;
    numFighters =  $('.fighter').length;
    $('#sectMsg').html("Click to select your attacker:")
    selectAttacker();
    selectDefender();
}
//find all fighter divs and create new obj for each element
function createFighterList(){
    $('.fighter').each(function() {
        fighter={};
        fighter["name"] = this.id;
        fighter["id"] = this.children[0].id
        getFighterAttr(fighter);
        fighterList[this.id] = fighter;
    });
}
//assigns fighters their aatributes
function getFighterAttr(obj){
    if(obj.name == "fighter1"){
        obj.hp = 3;
        obj.health = 45;
        obj.cntrAtck = 10;  
    }else if (obj.name == "fighter2"){
        obj.hp = 2;
        obj.health = 26;
        obj.cntrAtck = 12;
    }else if (obj.name == "fighter3"){
        obj.hp = 8;
        obj.health = 68;
        obj.cntrAtck = 5;
    }else if (obj.name == "fighter4"){
        obj.hp = 5;
        obj.health = 40;
        obj.cntrAtck = 17;
    }
}
//event handler to assign attacker
function selectAttacker(){
    selFighter = true;
    $('.fighter').on("click", function(){
        if(!attacker){
            var attackerName = $(this).attr("id")
            attacker = associateFighter(attackerName,0);
            attacker.base = attacker.hp;
            $('#sectMsg').html("Click to select your defender:");   
        }
        
    })
}
//event handler to assign defender
function selectDefender(){
    $('.fighter').on("click", function(){
        if($(this).attr("id") != attacker.name && $("#divDefendArea").has(".fighter").length == 0 && $("#divAttackArea").has(".fighter").length == 1){
            $('#gameWord').html("");
            var defenderName = $(this).attr("id");
            defender = associateFighter(defenderName,1);
            $(".btn-block").prop("disabled",false);
            $('#sectMsg').html("Click to attack to play");
        }
        
    })
}
//sends selected fighter to correct area and updates display
function associateFighter(name,pos){
    var obj = fighterList[name];
    var imgChng = "assets/images/"+obj.id+"_"+pos+".jpg";
    if(pos == 1){
        $("#"+name).appendTo('#divDefendArea');
        $("#"+name).children('img').attr("src", imgChng);
    }else{
        $("#"+name).appendTo('#divAttackArea');
        $("#"+name).children('img').attr("src", imgChng);
    }
    
    $("#"+ name).addClass("imgResize");
    
    displayData(obj);
    return obj;
}
//display fighter data when in area
function displayData(obj){
 $("#"+obj.name+" .fData").html(obj.id+"<br>"+obj.health);
}

$('.btn-block').on("click", function(){
    if(availDef()){
        fightArena();
    }
        
})
//checks to see if any fighters are remaining to continue game play
function availDef(){
    if(graveYard.length !== numFighters -1){
        return true;
    }else{
        $('#sectMsg').html(defender.id+" has been defeated!!")
        $("#gameWord").html("You Win!! You have defeated all the defenders!!");  
        resetGmPg();
        return false;
    }
}
//perform fighter actions, calls to update display and calls to see if any fighter is defeated
function fightArena(){
    if(defender.health > 1 || attacker.health > 1){
        defender.health -= attacker.hp;
        attacker.health -= defender.cntrAtck;
        attacker.hp += attacker.base;
        displayData(attacker);
        displayData(defender);
        chkDefeat();
    }
}
//checks to see if fighter has been defeated
function chkDefeat(){
    if(defender.health < 1 && attacker.health < 1){
        $("#divGmStats").append('<div>' + defender.id + '</b> </div>');
        $("#gameWord").html("Both attacker, "+attacker.id+", and defender, "+defender.id+", have been defeated!! <br>Game Over!!");
        $(".btn-block").prop("disabled",true);
        cleanArena(attacker);
        cleanArena(defender);
        graveYard.push(defender);
        resetGmPg();
    }else if(defender.health < 1){
        $("#divGmStats").append('<div>' + defender.id + '</b> </div>');
        graveYard.push(defender);
        cleanArena(defender);
        $('#gameWord').html("Select next defender."); 
        availDef();
        $(".btn-block").prop("disabled",true);
    }else if (attacker.health < 1){
        cleanArena(attacker);
        $("#gameWord").html("You Lose!! Your attacker, "+attacker.id+", has been defeated!! <br>Game Over!!");
        $(".btn-block").prop("disabled",true);
        resetGmPg();
    }
}
//removes defeated fighter element and clears defeated object 
function cleanArena(obj){
   // remEle.push($("#"+obj.name).clone());
    $("#"+obj.name).remove();
    $('#sectMsg').html(obj.id+" has been defeated!!")
    obj = {};
}
//allows for replay game after game is over
function resetGmPg(){
    $(".newGm").html("New Game")
    $(".newGm").prop("disabled",false);
    $(".newGm").on("click", function(){
    location.reload();
    
 })
}