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