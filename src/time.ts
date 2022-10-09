const NORWEGIAN_LOCALE = "no-nb"

export function localTime() {
    return new Date().toLocaleTimeString(NORWEGIAN_LOCALE)
}

export function localDate() {
    return new Date().toLocaleDateString(NORWEGIAN_LOCALE)
}
