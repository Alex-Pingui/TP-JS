export default function loadImage(path, alt){
    return `<img src="${path}" alt="${alt}" loading="lazy">`
}