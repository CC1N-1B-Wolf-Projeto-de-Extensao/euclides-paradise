export function shakeBoard(level="small") {

    const board = document.querySelector("#boardwrap");

    const cls =
        level === "big"
            ? "shake-big"
            : level === "medium"
            ? "shake-medium"
            : "shake-small";

    board.classList.remove(
        "shake-small",
        "shake-medium",
        "shake-big"
    );

    // força reflow
    void board.offsetWidth;

    board.classList.add(cls);

    board.addEventListener(
        "animationend",
        () => board.classList.remove(cls),
        { once:true }
    );
}