export const sounds = {
    match: new URL("../../assets/sound/sound_effect.mp3", import.meta.url),
    explosion: new URL("../../assets/sound/explosion.mp3", import.meta.url)
}

export function play(name) {

    const sound = new Audio(sounds[name])

    sound.volume = 0.4;

    sound.play();
}