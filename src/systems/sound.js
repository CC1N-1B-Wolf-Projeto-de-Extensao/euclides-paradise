export const sounds = {
    match: "sound_effect",
    explosion: "explosion"
}

export function play(name) {

    const base = window.location.origin.split("/")[1];

    const BASE_PATH =
    window.location.hostname === "127.0.0.1"
    || window.location.hostname === "localhost"
        ? ""
        : "/euclides-paradise";

    const sound = new Audio(`${BASE_PATH}/assets/sound/${sounds[name]}.mp3`)
    console.log(sound.src)

    sound.volume = 0.4;

    sound.play();
}