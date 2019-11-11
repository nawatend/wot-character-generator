let database = firebase.database()

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        showContentGrid()
        console.log("Grid rendered")
    } else {
        showLoginForm()
        console.log("login form rendered")
    }
})

let generateGrid = () => {
    let gridContainer = document.getElementById('gridContainer')
    gridContainer.innerHTML = ""
    for (let i = 0; i < 64; i++) {
        let div = document.createElement('div');
        div.classList.add('grid__box')
        gridContainer.appendChild(div)
    }
}
//loop thru all chars
let loopAllChars = () => {
    let refSavedChars = database.ref("/characters/saved/")
    let loopGridContainer = document.getElementById("loopGridContainer")

    refSavedChars.once("value", (snapshot) => {

        let grids = []
        //to get latest first in chars list
        snapshot.forEach(char => {
            grids.push(char)
        });

        grids.reverse()
        grids.forEach((char, i) => {
            setTimeout(() => {
                let pboxes = JSON.parse(char.val())
                loopGridContainer.innerHTML = ""
                pboxes.forEach((box) => {

                    let div = document.createElement('div');
                    if (box[0] === 0) {
                        div.classList.add('loop__grid__box')
                    } else {
                        div.classList.add('loop__grid__box')
                        div.classList.add('loop__grid__selected')
                    }
                    loopGridContainer.appendChild(div)
                })
            }, i * 500)

        });


    }, (error) => {
        console.log(error)
    })
}

//get saved chars from firebase and render
let generateSmallGrids = () => {

    let refSavedChars = database.ref("/characters/saved/")
    let allCharacters = document.getElementById("allCharacters")

    refSavedChars.on("value", (snapshot) => {
        allCharacters.innerHTML = "<div class='all__chars--text font-bold text-xl mb-2'> All characters</div>"

        let grids = []
        //to get latest first in chars list
        snapshot.forEach(char => {
            grids.push(char)
        });

        grids.reverse()
        grids.forEach(char => {
            let boxes = JSON.parse(char.val())

            let divSmallGrid = document.createElement("div")
            divSmallGrid.classList.add("grid__small")

            boxes.forEach(box => {
                let div = document.createElement('div');
                if (box[0] === 0) {
                    div.classList.add('grid__small--box')
                } else {
                    div.classList.add('grid__small--box')
                    div.classList.add('grid__selected')
                }

                divSmallGrid.appendChild(div)
            });

            allCharacters.appendChild(divSmallGrid)
        });

    }, (error) => {
        console.log(error)
    })
}

let generateId = () => {
    return '-' + Math.random().toString(32).substr(2, 5);
}

let getCurrentTimeStamp = () => {
    return Math.floor(Date.now() / 1000)
}

let addNewCharacter = (charArrColors) => {
    let timeStamp = getCurrentTimeStamp()
    database.ref("characters/saved/" + timeStamp).set(JSON.stringify(charArrColors))
}

let genRandomColor = () => {
    return Math.floor(Math.random() * 256);
}

let generateRandomCharacter = () => {

    let x = [0, 0, 0]
    let yellow = [251, 217, 66]

    let newChar = [
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
    ]


    for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 4; j++) {

            let randomIsLightOn = Math.floor(Math.random() * 2)

            if (randomIsLightOn === 0) {
                newChar[i * 8 + j] = x
                newChar[i * 8 + Math.abs(j - 7)] = x

            } else {
                newChar[i * 8 + j] = yellow
                newChar[i * 8 + Math.abs(j - 7)] = yellow
            }
        }
    }


    //console.log(JSON.stringify(newChar))

    return newChar


}
let doesElemHasClass = (element, className) => {
    return element.classList.contains(className)
}

//created a 8x8 grid in gridContainer
generateGrid()
//created small grids for saved chars
generateSmallGrids()

//handle click on boxes
let boxes = Array.from(document.getElementsByClassName('grid__box'))
let btnClear = document.getElementById('btnClear')
let btnSave = document.getElementById("btnSave")
let btnLoop = document.getElementById("btnLoop")
let btnStopLoop = document.getElementById("btnStopLoop")
let btnGenerateChars = document.getElementById("btnGenerate")
//get changes and update live
let getCurrentChar = () => {
    let boxes = Array.from(document.getElementsByClassName("grid__box"))
    let x = [0, 0, 0]
    let yellow = [251, 217, 66]

    let grid = [
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
    ]

    boxes.forEach((box, i) => {
        (doesElemHasClass(box, "grid__selected")) ? grid[i] = yellow: grid[i] = x;
    });

    database.ref("characters/live").set(JSON.stringify(grid))
    return grid
}

//addNewCharacter(generateRandomCharacter())
let updateLiveChar = () => {
    getCurrentChar()
}

//clear all selected
let clearGrid = () => {
    let boxes = Array.from(document.getElementsByClassName('grid__box'))
    boxes.forEach(box => {
        box.classList.remove('grid__selected')
    });

    let loopGridContainer = document.getElementById("loopGridContainer")
    let gridContainer = document.getElementById("gridContainer")
    loopGridContainer.classList.add("remove")
    gridContainer.classList.remove("remove")
}

//execute all functions here
btnClear.addEventListener("click", () => {
    clearGrid()
})


btnSave.addEventListener("click", () => {
    addNewCharacter(getCurrentChar())
})

btnLoop.addEventListener("click", () => {
    database.ref("characters/loop").set(true)
    let loopGridContainer = document.getElementById("loopGridContainer")
    let gridContainer = document.getElementById("gridContainer")
    loopGridContainer.classList.toggle("remove")
    gridContainer.classList.toggle("remove")

    btnLoop.classList.add("remove")
    btnStopLoop.classList.remove("remove")

    let loop = database.ref("/characters/loop")
    loop.once("value", (snapshot) => {
        if (snapshot.val()) {
            loopAllChars()
        }
    })
})

btnStopLoop.addEventListener("click", () => {
    database.ref("characters/loop").set(false)
    let loopGridContainer = document.getElementById("loopGridContainer")
    let gridContainer = document.getElementById("gridContainer")
    loopGridContainer.classList.toggle("remove")
    gridContainer.classList.toggle("remove")

    btnLoop.classList.remove("remove")
    btnStopLoop.classList.add("remove")
})

btnGenerateChars.addEventListener("click", () => {

    let newChar = generateRandomCharacter()

    boxes.forEach((box, id) => {
        (newChar[id][0] === 0) ? box.className = "grid__box": box.className = "grid__box grid__selected"
    });


})






//get all saved chars from dom
setTimeout(() => {
    let domAllSmallGrids = Array.from(document.getElementsByClassName("grid__small"))
    let gridContainer = document.getElementById("gridContainer")
    domAllSmallGrids.forEach((domSmallGrid, id) => {

        domSmallGrid.addEventListener("click", () => {

            let smallGridBoxes = Array.from(domSmallGrid.getElementsByClassName("grid__small--box"))
            let gridBoxes = Array.from(gridContainer.getElementsByClassName("grid__box"))


            //gridContainer.innerHTML = domSmallGrid.innerHTML.replace(/grid__small--box/g, "grid__box")

            gridBoxes.forEach((box, id) => {
                (smallGridBoxes[id].classList.contains("grid__selected")) ? box.className = "grid__box grid__selected": box.className = "grid__box"
            });

            console.log("small grid selected")
        })
    })
}, 2000)


boxes.forEach(box => {
    box.addEventListener("click", () => {
        box.classList.toggle('grid__selected')
        updateLiveChar()
    })
});