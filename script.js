const skinSelect = document.getElementById("skinSelect");
const skinSelectWeaponName = document.getElementById("skinChange_WeaponName");
const skinSelectSelectedImg = document.getElementById("skinChange_SelectedImg");
const skinSelectSelected = document.getElementById("skinChange_Selected");
const skinSelectSkinOptions = document.getElementById("skinChange_SkinOptions");
var skins = {};
var equippedSkins = {};
var highLightedSkin = "";

fetch("https://valorant-api.com/v1/weapons")
    .then(res => res.json())
    .then(json => {
        JSON.parse(JSON.stringify(json.data)).forEach(weapon => {
            let wSkin = {};
            weapon.skins.forEach(skin => {
                if (skin.displayIcon) {
                    wSkin[skin.displayName] = skin.displayIcon;
                }
                wSkin[`Standard ${weapon.displayName}`] = weapon.displayIcon;
            });
            skins[weapon.displayName] = wSkin;
        });
    }).then(() => {
        removeMissingSkins();
        equipAllSkins();
        loadPage();
    }).catch(err => console.error(err));

const removeMissingSkins = () => {
    delete skins["Marshal"]["Sovereign Marshal"];
    delete skins["Guardian"]["Prime Guardian"];
    delete skins["Guardian"]["Sovereign Guardian"];
    delete skins["Melee"]["Luxe Knife"];
    delete skins["Melee"]["Melee"];
    Object.keys(skins).forEach(weapon => {
        delete skins[weapon]["Random Favorite Skin"];
    });
}

const equipAllSkins = () => {
    if (localStorage.getItem("equippedSkins")) {
        equippedSkins = JSON.parse(localStorage.getItem("equippedSkins"));
    } else {
        Object.keys(skins).forEach(weapon => {
            equippedSkins[weapon] = `Standard ${weapon}`;
        });
    }
}

const loadPage = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"),
        (element) => {
            let weapon = element.className.split(" ").at(-1);
            let nameDiv = document.createElement("div");
            nameDiv.className = "weaponName";
            nameDiv.innerHTML = weapon.toUpperCase();

            let imgContainer = document.createElement("div");
            imgContainer.setAttribute("onClick",
                "javascript: selectSkin(this);");
            imgContainer.className = "imgContainer";

            let img = document.createElement("img");
            img.className = `weaponImg img${weapon}`;
            img.innerHTML = weapon.toUpperCase();
            img.src = skins[weapon][equippedSkins[weapon]];
            element.appendChild(nameDiv);
            imgContainer.appendChild(img);
            element.appendChild(imgContainer);
        });
}

const selectSkin = (weapon) => {
    weapon = weapon.parentNode.className.split(" ").at(-1);
    highLightedSkin = equippedSkins[weapon];
    skinSelectSelectedImg.src = skins[weapon][equippedSkins[weapon]];
    skinSelectSelected.innerHTML = equippedSkins[weapon];
    skinSelect.style.visibility = "visible";
    skinSelectWeaponName.innerText = weapon;
    while (skinSelectSkinOptions.firstChild) {
        skinSelectSkinOptions.removeChild(skinSelectSkinOptions.firstChild);
    }
    Object.keys(skins[weapon]).forEach(skin => {
        let img = document.createElement("img");
        img.className = "skinOptionImg";
        img.src = skins[weapon][skin];
        img.setAttribute("onClick", `javascript: highLight("${skin}");`);
        skinSelectSkinOptions.appendChild(img);
    });
}

const equipSkin = () => {
    weapon = titleCase(skinSelectWeaponName.innerText);
    equippedSkins[weapon] = highLightedSkin;
    skinSelect.style.visibility = "hidden";
    let skinImg = document.getElementsByClassName(`img${weapon}`)[0];
    skinImg.src = skins[weapon][highLightedSkin];
    saveToLocalStorage();
}

const resetLoadout = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"),
        (element) => {
            let weapon = element.className.split(" ").at(-1);
            let skinImg = document.getElementsByClassName(`img${weapon}`)[0];
            skinImg.src = skins[weapon][`Standard ${weapon}`];
            equippedSkins[weapon] = `Standard ${weapon}`;
            saveToLocalStorage();
        });
}

const randomLoadout = () => {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"),
        (element) => {
            let weapon = element.className.split(" ").at(-1);
            let skinImg = document.getElementsByClassName(`img${weapon}`)[0];
            let randomSkin = `Standard ${weapon}`;
            while (randomSkin === `Standard ${weapon}`) {
                randomSkin = Object.keys(skins[weapon])
                [Math.floor(Math.random() * Object.keys(skins[weapon]).length)];
            }
            skinImg.src = skins[weapon][randomSkin];
            equippedSkins[weapon] = randomSkin;
            saveToLocalStorage();
        });
}

const highLight = (skin) => {
    highLightedSkin = skin;
    skinSelectSelectedImg.src =
        skins[titleCase(skinSelectWeaponName.innerText)][skin];
    skinSelectSelected.innerHTML = skin;
}

const titleCase = (str) => {
    return str.toLowerCase().split(" ").map((word) => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(" ");
}

const saveToLocalStorage = () => {
    localStorage.setItem("equippedSkins", JSON.stringify(equippedSkins));
}

const missingSkins = () => {
    fetch("./missingSkins.txt")
        .then(res => res.text()).then(text => {
            alert(`Due to API limitations, the following skins are unavailable:
${text}`);
        });
}

const about = () => {
    alert(
        `This tool helps you by letting you:
1. Create a Valorant loadout without paying for skins.
2. Stop wasting money on skins and decide which ones you really want.`);
}
