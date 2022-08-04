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
                wSkin["Standard " + weapon.displayName] = weapon.displayIcon;
            });
            skins[weapon.displayName] = wSkin;
        })
    }).then(()=>{
        loadPage();
        }).catch(err => console.error(err));

function loadPage() {
    Array.prototype.forEach.call(document.getElementsByClassName("weapon"), function (element) {
        let weapon = element.className.split(" ").at(-1)
        let nameDiv = document.createElement("div");
        nameDiv.className = "weaponName";
        nameDiv.innerHTML = weapon.toUpperCase();

        let imgContainer = document.createElement("div");
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