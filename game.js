function main() {
let totalRarity = 100
let poleysObj = {}

let catchingMusic = new Audio("./catching.mp3")
catchingMusic.volume = 0.5
catchingMusic.loop = true
let throwSfx = new Audio("./throw.mp3")
throwSfx.volume = 0.7
let shinySfx = new Audio("./shinyPoley.mp3")

if (typeof running == "undefined") {
    window.running = true
} else {
    window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}

function playsfx() {
    if (this.paused) {
        this.play()
    } else {
        this.currentTime = 0;
    }
}

function objectMap(obj, func) { 
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
} // this is from stack overflow

function roundBy(num, places) {
    return Math.round(num * 10**places) / 10**places
}


Audio.prototype.playsfx = playsfx // and this is from my other project

class Poley {
    constructor(name, display, rarity) {
        this.name = name;
        this.rarity = rarity;
        this.display = display;
        this.shinyDisplay = "Shiny " + display;
        this.shinyRarity = rarity / 100;
        this.amt = 0;
        this.shinyAmt = 0;
        this.percentChunk = [totalRarity, totalRarity - rarity]
        this.shinyPercentChunk =[this.percentChunk[0], this.percentChunk[0] - this.shinyRarity] 
        totalRarity -= this.rarity
        poleysObj[name] = this
        this.texturePath = `./poleys/${name}.png`
        this.shinyTexturePath = `./poleys/shiny${name}.png`
    }
}

// define in alphabetical order
let portalPoley = new Poley("portalPoley", "Portal Poley", 0.5)
let pole = new Poley("pole", "Pole", 10)
let plantey = new Poley("plantey", "Plantey", 8)
let magicPoley = new Poley("magicPoley", "Magic Poley", 0.1)
let goldenPoley = new Poley("goldenPoley", "Golden Poley", 0.6)
let firePoley = new Poley("firePoley", "Fire Poley", 5.5)
let enchantedPoley = new Poley("enchantedPoley", "Enchanted Poley", 1)
let deskPoley = new Poley("deskPoley", "Desk Poley", 10)
let computerPoley = new Poley("computerPoley", "Computer Poley", 4)
let classyPoley = new Poley("classyPoley", "Classy Poley", 2.5)
let calculatorPoley = new Poley("calculatorPoley", "Calculator Poley", 6)
let bugPoley = new Poley("bugPoley", "Bug Poley", 1)
let bob = new Poley("bob", "Bob", 13)
let poley = new Poley("poley", "Poley", totalRarity)

function choose() {
    let rand = Math.random() * 100
    console.log(rand)
    let objValues = Object.values(poleysObj)
    let chosenPoley = objValues.find((x) => {
        return x.percentChunk[0] >= rand && rand >= x.percentChunk[1] 
    })
    return {poley: chosenPoley, shiny: chosenPoley.shinyPercentChunk[0] >= rand && rand >= chosenPoley.shinyPercentChunk[1] ? true : false}
}

function sortByText(a, b) {
    if (a.display < b.display) {
        return -1;
    }
    if (a.display > b.display) {
        return 1;
    }
    return 0;  
}

function collect() {
    catchingMusic.play() 
    throwSfx.playsfx()
    let chosenPoley = choose()
    document.querySelector("#poleyimg").setAttribute("src", chosenPoley.poley.texturePath)
    document.querySelector("#poleygot").innerHTML = "You just got: " + chosenPoley.poley.display
    if (chosenPoley.shiny) {
        shinySfx.playsfx()
        document.querySelector("#poleyimg").setAttribute("src", chosenPoley.poley.shinyTexturePath)
        document.querySelector("#poleygot").innerHTML = "You just got: " + chosenPoley.poley.shinyDisplay
        chosenPoley.poley.shinyAmt += 1
    } else {
        chosenPoley.poley.amt += 1
    }
 
    $("#changePoley").attr("disabled", "")
    updateDisplay(chosenPoley)
    setTimeout(() => {
        $("#changePoley").removeAttr("disabled")
    }, 3000)
    setTimeout(() => {
        $("#poleyimg").addClass("pop")
        setTimeout(() => {
            $("#poleyimg").removeClass("pop")
        }, 500);
    }, 20); // what's callback hell?
}   

function generateDisplays() {
    for (i in poleysObj) {
        i = poleysObj[i]
        let displayText = `
            <img src="poleys/${i.name}.png" id="${i.name}Img" class="sill">
            <span id="${i.name}Counter">???</span>
        `
        $("#poleysTitle").after(displayText)
        let shinyDisplayText = `
            <img src="poleys/shiny${i.name}.png" id="shiny${i.name}Img" class="sill">
            <span id="shiny${i.name}Counter">Shiny ???</span>
        `
        $("#shinyPoleysTitle").after(shinyDisplayText)
    }
}

function updateDisplay(poley) {
    let name = poley.poley.name
    if (poley.shiny) {
        if (poley.poley.shinyAmt >= 1) {
            $(`#shiny${name}Img`).removeClass("sill")
            $(`#shiny${name}Counter`).html(`${poley.poley.shinyDisplay}: ${poley.poley.shinyAmt} (${roundBy(poley.poley.shinyRarity, 4)}%)`)
        }
    } else {
        if (poley.poley.amt >= 1) {
            $(`#${name}Img`).removeClass("sill")
            $(`#${name}Counter`).html(`${poley.poley.display}: ${poley.poley.amt} (${roundBy(poley.poley.rarity, 4)}%)`)
        }
    }
}

function updateAllDisplays() {
    for (i in poleysObj) {
        i = poleysObj[i]
        updateDisplay({poley: i, shiny: false})
        updateDisplay({poley: i, shiny: true})
    }
}

function writeSave() {
    // the most useful one liner in all of JS
    let normalString = objectMap(poleysObj, (x) => x.amt)
    let shinyString = objectMap(poleysObj, (x) => x.shinyAmt)
    let completeString = JSON.stringify({normal: normalString, shiny: shinyString})
    document.cookie = `save=${btoa(completeString)}; SameSite=Strict; Expires=Tues, 1 Jan 2030 12:00:00 UTC`
}

function loadSave() {
    let save = JSON.parse(atob(document.cookie.substring(5)))
    for (i in save.normal) {
        poleysObj[i].amt = save.normal[i]
    }
    for (i in save.shiny) {
        poleysObj[i].shinyAmt = save.shiny[i]
    }

    updateAllDisplays()
}

generateDisplays()

if (document.cookie) {
    loadSave()
}

setInterval(writeSave, 10000)
document.onbeforeunload = writeSave
$("#changePoley").click(collect)
}
main()