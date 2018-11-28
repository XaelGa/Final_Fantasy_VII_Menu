// GLOBAL DATA=================================================================
    
    let totalPlayed; //Variable to store the amount of hours played from the Local Storage.
    let tokenMenu = 0; //Variable to store the value of the last selected menu object.
    let tokenHide = false; //Variable to store the bolean vaule if the extra menu is displayed or not.
    let tokenFile = 0; //Variable to store the present file selected.
    const img = document.createElement('img'); //Const to add the hand cursor.
    img.className = 'selected';
    img.src = 'img/FF7Cursor.png';
    const div = document.createElement('div'); //Const to add the shadow of the hand cursor.
    div.className = 'shadow';
    lowLag.init(); //lowlag.js to use quickly the menu sound of the cursor.
    lowLag.load("audio/sounds/FF7CursorMove.mp3");
    let load = new Audio(); //Variable of Audio kind to  store and use the load sound.
    load.src = 'audio/sounds/FF7CursorSaveLoad.mp3';
    
// SELECTION ELEMENTS
    
    let extras = document.querySelectorAll('.extra'); //Select all the Menus extra from the original.
    let menuItems = document.querySelectorAll('#menu li'); 
    
// EVENT LISTENERS==================================================================

(function eventListeners(){
    
    //Listen when the DOM is fully charged.
    document.addEventListener('DOMContentLoaded', function(){
        
        //Checks if there is a file in local Storage, and depends on the result begins a new countdown or get the JSON file.
        localStorage.getItem('totalPlayed') === null? totalPlayed = 1: totalPlayed = JSON.parse(localStorage.getItem('totalPlayed'));
        selection(tokenMenu);
        time();
        blink();
    });
    //Sets the opacity of the hands icons to 1 when the initial animation ends we use this instead animation-fill-mode to control the opacity with other function later.
    document.querySelector('#right').addEventListener("animationend", function(){
        document.querySelector('#right').style.opacity = "1";
        document.querySelector('#left').style.opacity = "1";
    },false);
    //Sets the opacity of the instructinos to 1 when the initial animation ends we use this instead animation-fill-mode to control the opacity with other function later.
    document.querySelector('#instructions').addEventListener("animationend", function(){
        document.querySelector('#instructions').style.opacity = "1";
    },false);     
    //Sets listener when a mouse is over a menu.
    document.body.addEventListener('mouseover', selectMouseOver);
    //Sets listener when a key is pressed.
    document.body.addEventListener('keydown', keyPressed);
    //Sets listener when a click is made in the hand icons.
    document.body.addEventListener('click', function(e){
    
    // Calling the changeScreen function depending of what hand icon was clicked with the file number to load.  

    if(e.target.id == "left"){

        if(tokenFile>0){
            changeScreen(--tokenFile);
        }else{
            tokenFile = 4;
            changeScreen(tokenFile);
        }
    }else if(e.target.id == "right"){
        
        if(tokenFile<4){
            changeScreen(++tokenFile);
        }else{
            tokenFile = 0;
            changeScreen(tokenFile);
        }
    }
    });
})();

// FUNCTIONS========================================================================

//Calculates and shows the time "played".
function time(){

    if(totalPlayed < 360000){
        let seconds = totalPlayed;
        let clock;
        let hh = Math.floor(seconds / 3600);
        seconds = seconds - (hh * 3600);
        let mm = Math.floor(seconds / 60);
        seconds = seconds - (mm * 60);
        let ss = seconds;
        clock = `${hh}<txt id = "colon">:</txt>${(mm => (mm < 10) ? mm ="0"+mm:mm)(mm)}:${(ss => (ss < 10) ? ss ="0"+ss: ss)(ss)}`;
        document.querySelector('#currentTime').innerHTML = clock;
    }else{
     document.querySelector('#currentTime').innerHTML = `${99}<txt id = "colon">:</txt>${99}:${99}`; //Use this if we surpass the 99:99:99 of time.
    }
    totalPlayed++;
    localStorage.setItem('totalPlayed', JSON.stringify(totalPlayed)); //Add the current count variable as a JSON string to local Storage.
    setTimeout(time, 1000); // Use this function calls the function (same this occation) when the same has finished, helps to avoid problems of
                            //syncronization seen in setInterval because this won't be executed again until the function has finished.
}

//Adds the blink effect to the semicolon in the clock.
function blink(){

    let blinked = document.querySelector('#colon');
    blinked.style.color = (blinked.style.color == "white" ? "grey" : "white");
    setTimeout(blink , 500);
}

//Adds the cursor hand and play the sound when the mouse is over a menu.
function selectMouseOver(e){

    e.preventDefault();
    if(e.target.parentNode.id == 'menu'){
        tokenMenu = parseInt(e.target.getAttribute("number"));
        selection(tokenMenu);
        lowLag.play("audio/sounds/FF7CursorMove.mp3");
    }
 }

//Adds the cursor hand and play the sound when the keys up, down have been pressed or when the h key was pressed to hide the extra menus.
function keyPressed(e){
    
    e.preventDefault();
    if((e.keyCode == 72 || e.keyCode == 104) && !tokenHide){
        tokenHide = true;
        extras.forEach(extra => {
        extra.style.opacity = "0";
      });

    }else if((e.keyCode == 72 || e.keyCode == 104) && tokenHide){
        tokenHide = false;
        extras.forEach(extra => {
        extra.style.opacity = "1";
       });
    }else if(e.keyCode == 38){
      tokenMenu > 0 ? tokenMenu != 9 ? tokenMenu -= 1: document.querySelector("#phs").innerHTML== "PHS"? tokenMenu -=1:tokenMenu =  7 : tokenMenu = 10;
      selection(tokenMenu);
      lowLag.play("audio/sounds/FF7CursorMove.mp3");
    }else if(e.keyCode == 40){
      tokenMenu < 10 ? tokenMenu != 7 ? tokenMenu += 1: document.querySelector("#phs").innerHTML== "PHS"? tokenMenu +=1:tokenMenu =  9 : tokenMenu = 0; 
      selection(tokenMenu);
      lowLag.play("audio/sounds/FF7CursorMove.mp3");
    }
 }

 //Prepents the hand and shadow icons.
 function selection(tokenMenu){
   
    menuItems[tokenMenu].prepend(img); //Prepend append an element before the selected target.
    menuItems[tokenMenu].prepend(div); //Using reference variables instead creating elements helps to no be removing each time.
}

//Function that calls the loadScreen and loadFile methods and manages the secuence of the screen changes.
function changeScreen(token){
    
    let x = 0;
    document.querySelector("#screen").classList.add("screenOff");
    let intervalID = setInterval(function () {

        if (x === 0) {  
        loadScreen(loadFile(token));
        load.play();
        document.querySelector("#screen").classList.remove("screenOff");
        document.querySelector("#screen").classList.add("screenOn"); 
        x++;
        }else{
        document.querySelector("#screen").classList.remove("screenOn");
        window.clearInterval(intervalID);
        }
    }, 1400);   
}

 //Removes the old class of limitBar and returns the new class to loadFile to change the color. 
function limitBarColor(status, amount, chara){
    
    //Use the string to locate the correct id whom class name will be replaced and then removes it.
    document.querySelector("[id="+`${chara}LimitBar`+"]").classList.remove(document.querySelector("[id="+`${chara}LimitBar`+"]").className);
    //Use the status and amount to determine the new class, if the amount is 180 (maximum) the class will be "Break" else will be determined by status.
    let newClass; 

    if (amount == 180){
            newClass = "limitBarBreak";
        }
    else {
        switch(status){

            case "Fury":
            newClass = "limitBarFury";
            break;

            case "Sadness":
            newClass = "limitBarSadness";
            break;

            default:
            newClass = "limitBar"; 
        }
    } 
    return newClass;
}

//Function that contains the archives and returns an object with the selected file.
function loadFile(archive){

    var file;
    switch(archive){
        case 0:
        file = { 

            firstPosition: "front", firstName: "Cloud", firstLevel: 9, firstStatus: "", firstHpMin: 333, firstHpMax: 333, 
            firstMpMin: 63, firstMpMax: 63, firstLevelBar: 100, firstLimitBar: 25, firstLimitLevel: 1, firstActive: "yes",

            secondPosition: "front", secondName: "Barret", secondLevel: 7, secondStatus: "", secondHpMin: 341, secondHpMax: 341, 
            secondMpMin: 48, secondMpMax: 48, secondLevelBar: 80, secondLimitBar: 60, secondLimitLevel: 1, secondActive: "yes",
        
            thirdPosition: "front", thirdName: "Tifa", thirdLevel: 5, thirdStatus: "", thirdHpMin: 284, thirdHpMax: 284, 
            thirdMpMin: 41, thirdMpMax: 41, thirdLevelBar: 4, thirdLimitBar: 30, thirdLimitLevel: 1, thirdActive: "yes",
            
            gil: 435, location: "Sector 7 Slums", music: "Barret's Theme", phsExist: "no", phs: "no", save: "yes"
        };
        break;
        case 1:     
        file = { 

            firstPosition: "front", firstName: "Cloud", firstLevel: 10, firstStatus: "", firstHpMin: 353, firstHpMax: 353,
            firstMpMin: 79, firstMpMax: 80, firstLevelBar: 0, firstLimitBar: 150, firstLimitLevel: 1, firstActive: "yes",

            secondPosition: "behind", secondName: "Aerith", secondLevel: 5, secondStatus: "", secondHpMin: 341, secondHpMax: 341, 
            secondMpMin: 48, secondMpMax: 48, secondLevelBar: 80, secondLimitBar: 60, secondLimitLevel: 1, secondActive: "yes",
            
            thirdPosition: "", thirdName: "", thirdLevel: "", thirdStatus: "", thirdHpMin: "", thirdHpMax: "",
            thirdMpMin: "", thirdMpMax: "", thirdLevelBar: "", thirdLimitBar: "", thirdLimitLevel: "", thirdActive: "no",

            gil: 963, location: "Aerith's House", music: "Flowers Blooming in the Church" , phsExist: "no", phs: "no", save: "yes"
        };
        break;
        case 2:     
        file = { 

            firstPosition: "front", firstName: "Cloud", firstLevel: 21, firstStatus: "", firstHpMin: 709, firstHpMax: 709,
            firstMpMin: 176, firstMpMax: 176, firstLevelBar: 104, firstLimitBar: 107, firstLimitLevel: 2, firstActive: "yes",

            secondPosition: "behind", secondName: "Aerith", secondLevel: 20, secondStatus: "", secondHpMin: 695, secondHpMax: 695, 
            secondMpMin: 168, secondMpMax: 168, secondLevelBar: 10, secondLimitBar: 180, secondLimitLevel: 2, secondActive: "yes",
            
            thirdPosition: "front", thirdName: "Cait Sith", thirdLevel: 19, thirdStatus: "", thirdHpMin: 877, thirdHpMax: 877,
            thirdMpMin: 137, thirdMpMax: 139, thirdLevelBar: 0, thirdLimitBar: 0, thirdLimitLevel: 1, thirdActive: "yes",

            gil: 10836, location: "Wonder Square", music: "Cait Sith's Theme" , phsExist: "yes", phs: "no", save: "no"
        };
        break;
        case 3:
        file = { 

            firstPosition: "front", firstName: "Cloud", firstLevel: 36, firstStatus: "Sadness", firstHpMin: 1939, firstHpMax: 2494, 
            firstMpMin: 254, firstMpMax: 304,firstLevelBar: 40, firstLimitBar: 179, firstLimitLevel: 3, firstActive: "yes",
            
            secondPosition: "front", secondName: "Yuffie", secondLevel: 35, secondStatus: "", secondHpMin: 1248, secondHpMax: 1655, 
            secondMpMin: 295, secondMpMax: 323, secondLevelBar: 4, secondLimitBar: 162, secondLimitLevel: 2, secondActive: "yes",
            
            thirdPosition: "front", thirdName: "Cid", thirdLevel: 33, thirdStatus: "Fury", thirdHpMin: 1476, thirdHpMax: 1704, 
            thirdMpMin: 252, thirdMpMax: 252, thirdLevelBar: 4, thirdLimitBar: 30, thirdLimitLevel: 2, thirdActive: "yes",
            
            gil: 25012014, location: "Forgotten Capital", music: "You Can Hear the Cry of the Planet", phsExist: "yes", phs: "yes", save: "yes"
        };
        break;    
        case 4 :
        file = { 

            firstPosition: "front", firstName: "Cloud", firstLevel: 99, firstStatus: "Fury", firstHpMin: 9999, firstHpMax: 9999,
            firstMpMin: 999, firstMpMax: 999, firstLevelBar: 180, firstLimitBar: 180, firstLimitLevel: 4, firstActive: "yes",

            secondPosition: "front", secondName: "Red XIII", secondLevel: 99, secondStatus: "Fury", secondHpMin: 9999, secondHpMax: 9999, 
            secondMpMin: 999, secondMpMax: 999, secondLevelBar: 180, secondLimitBar: 180, secondLimitLevel: 4, secondActive: "yes",
        
            thirdPosition: "front", thirdName: "Vincent", thirdLevel: 99, thirdStatus: "Fury", thirdHpMin: 9999, thirdHpMax: 9999, 
            thirdMpMin: 999, thirdMpMax: 999, thirdLevelBar: 180, thirdLimitBar: 180, thirdLimitLevel: 4, thirdActive: "yes",

            gil: 24122015, location: "Inside Northern Cave", music: "Judgement Day", phsExist: "yes", phs: "no", save: "no"
        }; 
        break;
        default:
    }
    return(file);
}

//Function that changes all the paramethers on the screen depends on the file loaded.
function loadScreen(file){

    //Position in battle.
    file.firstPosition == "front" ? document.querySelector("#firstPosition").style.marginLeft = "0px" : document.querySelector("#firstPosition").style.marginLeft = "62.5px";
    file.secondPosition == "front" ? document.querySelector("#secondPosition").style.marginLeft = "0px" : document.querySelector("#secondPosition").style.marginLeft = "62.5px";
    file.thirdPosition == "front" ? document.querySelector("#thirdPosition").style.marginLeft = "0px" : document.querySelector("#thirdPosition").style.marginLeft = "62.5px";
    
    //Characters image.
    file.firstName != ""? document.querySelector("#firstPosition").src = `img/${file.firstName}.jpg`:document.querySelector("#firstPosition").src = "//:0";
    file.secondName != ""? document.querySelector("#secondPosition").src = `img/${file.secondName}.jpg`:document.querySelector("#secondPosition").src = "//:0";
    file.thirdName != ""?document.querySelector("#thirdPosition").src = `img/${file.thirdName}.jpg`:document.querySelector("#thirdPosition").src = "//:0";

    //Characters name.
    document.querySelector("#firstName").textContent = file.firstName;
    document.querySelector("#secondName").textContent = file.secondName;
    document.querySelector("#thirdName").textContent = file.thirdName;

    //Characters Level and Status.
    file.firstLevel < 10 ? document.querySelector("#firstLevel").style.textIndent = "20px" : document.querySelector("#firstLevel").style.textIndent = "4px";
    file.secondLevel < 10 ? document.querySelector("#secondLevel").style.textIndent = "20px": document.querySelector("#secondLevel").style.textIndent ="4px";
    file.thirdLevel < 10 ? document.querySelector("#thirdLevel").style.textIndent = "20px" : document.querySelector("#thirdLevel").style.textIndent = "4px";
    document.querySelector("#firstLevel").innerHTML =`${file.firstLevel}<span id = "firstStatus">${file.firstStatus}</span>`;
    document.querySelector("#secondLevel").innerHTML =`${file.secondLevel}<span id = "secondStatus">${ file.secondStatus}</span>`;
    document.querySelector("#thirdLevel").innerHTML =`${file.thirdLevel}<span id = "thirdStatus">${file.thirdStatus}</span}`;
    
    //Characters HP.
     //Min.
    document.querySelector("#firstHpMin").textContent = `${file.firstHpMin}/`;
    document.querySelector("#secondHpMin").textContent = `${file.secondHpMin}/`;
    document.querySelector("#thirdHpMin").textContent = `${file.thirdHpMin}/`;           
     //Max.
    document.querySelector("#firstHpMax").textContent = file.firstHpMax;
    document.querySelector("#secondHpMax").textContent = file.secondHpMax;
    document.querySelector("#thirdHpMax").textContent = file.thirdHpMax;
     //Bar.
    document.querySelector("#firstHpBar").style.width = `${((file.firstHpMin*145)/file.firstHpMax)}px`;
    document.querySelector("#secondHpBar").style.width = `${((file.secondHpMin*145)/file.secondHpMax)}px`;
    document.querySelector("#thirdHpBar").style.width = `${((file.thirdHpMin*145)/file.thirdHpMax)}px`;

    //Characters MP.
     //Min.
    document.querySelector("#firstMpMin").textContent = `${file.firstMpMin}/`;
    document.querySelector("#secondMpMin").textContent = `${file.secondMpMin}/`;
    document.querySelector("#thirdMpMin").textContent = `${file.thirdMpMin}/`;           
     //Max.
    document.querySelector("#firstMpMax").textContent = file.firstMpMax;
    document.querySelector("#secondMpMax").textContent = file.secondMpMax;
    document.querySelector("#thirdMpMax").textContent = file.thirdMpMax;
     //Bar.
    document.querySelector("#firstMpBar").style.width = `${((file.firstMpMin*145)/file.firstMpMax)}px`;
    document.querySelector("#secondMpBar").style.width = `${((file.secondMpMin*145)/file.secondMpMax)}px`;
    document.querySelector("#thirdMpBar").style.width = `${((file.thirdMpMin*145)/file.thirdMpMax)}px`;       
     
    //Characters Level Bar.
    document.querySelector("#firstLevelBar").style.width = `${file.firstLevelBar}px`;
    document.querySelector("#secondLevelBar").style.width = `${file.secondLevelBar}px`;
    document.querySelector("#thirdLevelBar").style.width = `${file.thirdLevelBar}px`;

    //Characters Limit Level.
    document.querySelector("#firstLimitLevel").innerHTML = `Limit level &nbsp;${file.firstLimitLevel}<div id ="firstLimitBar" class = "limitBar"></div><div class = "limitBarFont"></div>`;
    document.querySelector("#secondLimitLevel").innerHTML = `Limit level &nbsp;${file.secondLimitLevel}<div id ="secondLimitBar" class = "limitBar"></div><div class = "limitBarFont"></div>`;
    document.querySelector("#thirdLimitLevel").innerHTML = `Limit level &nbsp;${file.thirdLimitLevel}<div id ="thirdLimitBar" class = "limitBar"></div><div class = "limitBarFont"></div>`;

    //Characters Limit Bar.
    document.querySelector("#firstLimitBar").style.width = `${file.firstLimitBar}px`;
    document.querySelector("#secondLimitBar").style.width = `${file.secondLimitBar}px`;
    document.querySelector("#thirdLimitBar").style.width = `${file.thirdLimitBar}px`;
    document.querySelector("#firstLimitBar").classList.add(limitBarColor(file.firstStatus,file.firstLimitBar,"first"));
    document.querySelector("#secondLimitBar").classList.add(limitBarColor(file.secondStatus,file.secondLimitBar,"second"));
    document.querySelector("#thirdLimitBar").classList.add(limitBarColor(file.thirdStatus,file.thirdLimitBar, "third"));

    //Party Gil.
    document.querySelector("#gilAmount").textContent = file.gil;

    //Party Location.
    document.querySelector("#footer").textContent = file.location;
    
    //Location music.
    document.querySelector("#music").src = `audio/music/${file.music}.mp3`;
    document.querySelector("#controls").load();

    //Menu Available. 
    file.phsExist == "yes" ? document.querySelector("#phs").innerHTML= "PHS": document.querySelector("#phs").innerHTML= "<br>";
    file.phs == "yes" ? document.querySelector("#phs").style.color= "white": document.querySelector("#phs").style.color= "grey";
    file.save == "yes" ? document.querySelector("#save").style.color= "white": document.querySelector("#save").style.color= "grey";

    //Check Active Characters.
    file.firstActive == "yes" ? document.querySelector("#firstCharacter").style.display= "block": document.querySelector("#firstCharacter").style.display= "none";
    file.secondActive == "yes" ? document.querySelector("#secondCharacter").style.display= "block": document.querySelector("#secondCharacter").style.display= "none";
    file.thirdActive == "yes" ? document.querySelector("#thirdCharacter").style.display= "block": document.querySelector("#thirdCharacter").style.display= "none";

    //Restarts the hand icon position.
    tokenMenu = 0;
    selection(tokenMenu);

}
