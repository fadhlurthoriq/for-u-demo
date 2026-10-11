const Music = {

    player: null,
    audio: null,
    songs: CONFIG.music,
    current: 0,
    isPlaying: false

};

Music.init = function () {

    this.player = document.getElementById("music-player");
    this.audio = document.getElementById("player-audio");

    this.photoBgEl = document.querySelector(".player-photo-bg");
    this.coverEl = document.querySelector(".player-cover");
    this.titleEl = document.getElementById("player-title");
    this.artistEl = document.getElementById("player-artist");
    this.toggleEl = document.getElementById("player-toggle");
    this.playPauseEl = document.getElementById("player-playpause");
    this.prevEl = document.getElementById("player-prev");
    this.nextEl = document.getElementById("player-next");
    this.progressBar = document.getElementById("player-progress-bar");
    this.progressFill = document.getElementById("player-progress-fill");
    this.timeCurrentEl = document.getElementById("player-time-current");
    this.timeTotalEl = document.getElementById("player-time-total");

    this.bind();
    this.bindVisibility();
    this.restore();

};

Music.bind = function () {

    this.toggleEl.onclick = () => this.togglePlay();
    this.playPauseEl.onclick = () => this.togglePlay();

    this.nextEl.onclick = () => this.playNext();
    this.prevEl.onclick = () => this.playPrev();

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
    this.audio.addEventListener("ended", () => this.playNext(true));

    // ⬇️ TAMBAH INI: ikon & status selalu ngikutin kejadian asli di <audio>
    this.audio.addEventListener("play", () => {
        this.isPlaying = true;
        this.updateIcons();
        this.savePlaying();
    });

    this.audio.addEventListener("pause", () => {
        this.isPlaying = false;
        this.updateIcons();
        this.savePlaying();
    });

    this.progressBar.onclick = (e) => this.seek(e);

};

Music.bindVisibility = function () {

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            this.wasPlayingBeforeHidden = !this.audio.paused;

            if (this.wasPlayingBeforeHidden) this.pause();
        } else {
            if (this.wasPlayingBeforeHidden) this.play();
        }

    });

};

Music.loadSong = function (index, autoplay = true, startTime = 0) {

    const song = this.songs[index];

    if (!song) return;

    this.current = index;

    this.audio.src = song.src;
    this.titleEl.innerHTML = song.title;
    this.artistEl.innerHTML = song.artist;

    if (song.cover) {
        this.photoBgEl.style.backgroundImage = `url(${song.cover})`;
        this.coverEl.style.backgroundImage = `url(${song.cover})`;
        this.coverEl.innerHTML = "";
    } else {
        this.photoBgEl.style.backgroundImage = "none";
        this.coverEl.style.backgroundImage = "none";
        this.coverEl.innerHTML = "🎵";
    }

    this.save();

    if (startTime > 0) {
        this.audio.addEventListener(
            "loadedmetadata",
            () => {
                this.audio.currentTime = startTime;
            },
            { once: true }
        );
    }

    this.updateIcons(); // ⬅️ TAMBAH INI

    if (autoplay) {
        this.play();
    }

};

Music.savePlaying = function () {

    Storage.update({
        playing: !this.audio.paused
    });

};

Music.play = function () {

    this.audio.play().catch(() => {
        this.updateIcons();
    });

};

Music.pause = function () {

    this.audio.pause();

};

Music.togglePlay = function () {

    if (this.audio.paused) {
        this.play();
    } else {
        this.pause();
    }

};

Music.updateIcons = function () {

    const icon = this.audio.paused ? "▶" : "⏸";

    this.toggleEl.innerHTML = icon;
    this.playPauseEl.innerHTML = icon;

};

Music.playNext = function (forcePlay) {
    const nextIndex = (this.current + 1) % this.songs.length;
    const shouldPlay = forcePlay !== undefined ? forcePlay : this.isPlaying;
    this.loadSong(nextIndex, shouldPlay);
};

Music.playPrev = function () {

    const prevIndex = (this.current - 1 + this.songs.length) % this.songs.length;

    this.loadSong(prevIndex, this.isPlaying);

};

Music.updateProgress = function () {

    const { currentTime, duration } = this.audio;

    if (!duration) return;

    const percent = (currentTime / duration) * 100;

    this.progressFill.style.width = percent + "%";
    this.timeCurrentEl.innerHTML = this.formatTime(currentTime);

    const second = Math.floor(currentTime);

    if (second !== this.lastSavedSecond) {
        this.lastSavedSecond = second;

        Storage.update({
            musicTime: currentTime
        });
    }

};

Music.updateDuration = function () {

    this.timeTotalEl.innerHTML = this.formatTime(this.audio.duration);

};

Music.seek = function (e) {

    const rect = this.progressBar.getBoundingClientRect();

    const percent = (e.clientX - rect.left) / rect.width;

    if (this.audio.duration) {
        this.audio.currentTime = percent * this.audio.duration;
    }

};

Music.formatTime = function (seconds) {

    if (!seconds || isNaN(seconds)) return "0:00";

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");

    return `${m}:${s}`;

};

Music.save = function () {

    Storage.update({
        song: this.current
    });

};

Music.restore = function () {

    const save = Storage.load();

    this.loadSong(save.song || 0, false, save.musicTime || 0);

    if (save.playing) {

        const resume = () => {
            this.play();
            document.removeEventListener("click", resume);
        };

        this.audio.play().catch(() => {
            document.addEventListener("click", resume, { once: true });
        });

    }

};

Music.reset = function () {

    this.loadSong(0, false);

};

Music.show = function (callback) {

    this.player.classList.remove("float");
    this.player.classList.add("show");

    this.player.addEventListener(
        "animationend",
        () => {
            if (callback) {
                callback();
            }
        },
        { once: true }
    );

};

Music.float = function (callback) {

    this.player.classList.remove("show");
    this.player.classList.add("float");

    this.player.addEventListener(
        "animationend",
        () => {
            if (callback) {
                callback();
            }
        },
        { once: true }
    );

};