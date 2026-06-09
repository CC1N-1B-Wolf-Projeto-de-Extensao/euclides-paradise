export const sounds = {
    match: "../../assets/sound/sound_effect.mp3",
    explosion: "../../assets/sound/explosion.mp3"
}

export function play(name) {

    const sound = new Audio(sounds[name]);

    sound.volume = 0.4;

    sound.play();
}