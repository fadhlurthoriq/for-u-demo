const Storage = {};

Storage.KEY = "for-u-save";

Storage.defaultState = {
    scene: "login-scene",
    galleryIndex: 0,
    song: 0,
    musicTime: 0,
    playing: false,
    popup: null,
    galleryState:{
        introFinished:false
    }
};

Storage.load = function () {

    const raw = sessionStorage.getItem(this.KEY);

    if (!raw) {

        console.log("Save Loaded : Default");

        return { ...this.defaultState };

    }

    try {

        const data = JSON.parse(raw);

        console.log("Save Loaded :", data);

        return {

            ...this.defaultState,

            ...data

        };

    } catch {

        return { ...this.defaultState };

    }

}

Storage.save = function (state) {

    sessionStorage.setItem(

        this.KEY,

        JSON.stringify(state)

    );

    console.log("Save Saved :", state);

}

Storage.update = function (partial) {

    const state = this.load();

    Object.assign(

        state,

        partial

    );

    this.save(state);

}

Storage.isFirstOpen=function(){

    return sessionStorage.getItem(

        this.KEY

    )===null;

}

Storage.reset = function () {

    sessionStorage.removeItem(

        this.KEY

    );

    console.log("Save Reset");

}