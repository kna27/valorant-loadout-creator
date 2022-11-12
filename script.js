var skins = {};
var skinSelect = document.getElementById("skinSelect");
var skinSelectWeaponName = document.getElementById("skinChange_WeaponName");
var skinSelectSelectedImage = document.getElementById("skinChange_SelectedImage");
var skinSelectSkinOptions = document.getElementById("skinChange_SkinOptions");
var highLightedSkin = "";

skinSelect.style.visibility = "hidden";

fetch("https://valorant-api.com/v1/weapons")
    .then(response => response.json())
    .then(json => {
        JSON.parse(JSON.stringify(json.data)).forEach(weapon => {
            let wSkin = {};
            weapon.skins.forEach(skin => {
                if (skin.displayIcon) {
                    wSkin[skin.displayName] = skin.displayIcon;
                }
                wSkin["Standard " + weapon.displayName] = weapon.displayIcon;
            });
            skins[weapon.displayName] = wSkin;
        });
    }).then(() => {
        removeMissingSkins();
        loadPage();
    }).catch(err => console.error(err));

function removeMissingSkins() {
    delete skins["Marshal"]["Sovereign Marshal"];
    delete skins["Guardian"]["Prime Guardian"];
    delete skins["Guardian"]["Sovereign Guardian"];
    delete skins["Melee"]["Luxe Knife"];
    delete skins["Melee"]["Melee"];
    Object.keys(skins).forEach(weapon=>{
        delete skins[weapon]["Random Favorite Skin"];
    })
}

function loadPage() {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"), function (element) {
        let weapon = element.className.split(" ").at(-1)
        let nameDiv = document.createElement("div");
        nameDiv.className = "weaponName";
        nameDiv.innerHTML = weapon.toUpperCase();

        let imgContainer = document.createElement("div");
        imgContainer.setAttribute("onClick", "javascript: selectSkin(this);");
        imgContainer.className = "imgContainer";

        let img = document.createElement("img");
        img.className = "weaponImg img" + weapon;
        img.innerHTML = weapon.toUpperCase();
        img.src = skins[weapon]["Standard " + weapon];
        element.appendChild(nameDiv);
        imgContainer.appendChild(img);
        element.appendChild(imgContainer);
    });
}

function selectSkin(weapon) {
    weapon = weapon.parentNode.className.split(" ").at(-1);
    skinSelectSelectedImage.src = skins[weapon]["Standard " + weapon];
    highLightedSkin = "Standard " + weapon;
    skinSelect.style.visibility = "visible";
    skinSelectWeaponName.innerText = weapon;
    while (skinSelectSkinOptions.firstChild) {
        skinSelectSkinOptions.removeChild(skinSelectSkinOptions.firstChild);
    }
    Object.keys(skins[weapon]).forEach(skin => {
        let img = document.createElement("img");
        img.className = "skinOptionImg";
        img.src = skins[weapon][skin];
        img.setAttribute("onClick", "javascript: highLight('" + skin + "');");
        skinSelectSkinOptions.appendChild(img);
    });
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function equipSkin() {
    weapon = titleCase(skinSelectWeaponName.innerText);
    skinSelect.style.visibility = "hidden";
    let skinImg = document.getElementsByClassName("img" + weapon)[0];
    skinImg.src = skins[weapon][highLightedSkin];
}

function resetLoadout() {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"), function (element) {
        let weapon = element.className.split(" ").at(-1)
        let skinImg = document.getElementsByClassName("img" + weapon)[0];
        skinImg.src = skins[weapon]["Standard " + weapon];
    });
}

function randomLoadout() {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"), function (element) {
        let weapon = element.className.split(" ").at(-1)
        let skinImg = document.getElementsByClassName("img" + weapon)[0];
        let randomSkin = "Standard " + weapon;
        while (randomSkin == "Standard " + weapon) {
            randomSkin = Object.keys(skins[weapon])[Math.floor(Math.random() * Object.keys(skins[weapon]).length)]
        }
        skinImg.src = skins[weapon][randomSkin];
    });
}

function highLight(skin) {
    highLightedSkin = skin
    skinSelectSelectedImage.src = skins[titleCase(skinSelectWeaponName.innerText)][skin];
}

function missingSkins() {
    alert(`Due to API limitations, the following skins are unavailable:
    Nitro Odin 
    Snowfall Ares 
    Aristocrat Vandal 
    Nitro Vandal 
    Aristocrat Bulldog 
    Genesis Bulldog 
    Rush Phantom 
    Kingdom Phantom 
    Galleria Phantom 
    Artisan Phantom 
    Snowfall Phantom 
    Rush Judge 
    dot EXE Judge 
    Snowfall Judge 
    Galleria Bucky 
    Genesis Bucky 
    Artisan Bucky 
    Rush Frenzy 
    Couture Frenzy 
    Spitfire Frenzy 
    Kingdom Classic 
    Snowfall Classic 
    Final Chamber Classic 
    dot EXE Ghost 
    Hush Ghost 
    Artisan Ghost 
    Vendetta Ghost 
    Soul Silencer Ghost 
    Aristocrat Sheriff 
    Protektor Sheriff 
    Game Over Sheriff 
    Genesis Shorty 
    Nitro Operator 
    Genesis Operator 
    Nitro Guardian 
    Galleria Guardian 
    Couture Marshal 
    Galleria Marshal 
    Artisan Marshal 
    Prime Spectre 
    Kingdom Spectre 
    Aristocrat Stinger 
    Couture Stinger 
    Blade of Serket 
    Prime Axe 
    Genesis Arc 
    Artisan Foil 
    Snowfall Wand
    Sovereign Marshal
    Prime Guardian
    Sovereign Guardian
    Luxe Knife
    `)
}