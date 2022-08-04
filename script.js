window.onload = function () {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"), function (element) {
        let e = document.createElement("div");
        e.className = "weaponName";
        e.innerHTML = element.className.split(" ").at(-1).toUpperCase();
        element.appendChild(e);
    });
};

var skins = {};
fetch("https://valorant-api.com/v1/weapons")
    .then(response => response.json())
    .then(json => {
        JSON.parse(JSON.stringify(json.data)).forEach(weapon => {
            let wSkin = {};
            weapon.skins.forEach(skin => {
                if (skin.displayIcon) {
                    wSkin[skin.displayName] = skin.displayIcon;
                }
            });
            skins[weapon.displayName] = wSkin;
        })
    }).catch(err => console.error(err));