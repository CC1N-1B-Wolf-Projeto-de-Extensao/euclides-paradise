export const sounds = {
    match: new URL("../../assets/sound/sound_effect.mp3", import.meta.url),
    explosion: new URL("../../assets/sound/explosion.mp3", import.meta.url)
}

export function play(name) {

    const base = window.location.pathname.split("/")[1];

    const sound = new Audio(`/${base}/assets/sound/${name}.mp3`)

    sound.volume = 0.4;

    sound.play();
}