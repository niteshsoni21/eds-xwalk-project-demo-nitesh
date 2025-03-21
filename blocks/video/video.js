export default function decorate(block) {
    const videoUrl = block.querySelector(":scope > div > div");

    const videoContainer = document.createElement('div');
    videoContainer.classList.add("video-container");

    const video = document.createElement('video');
    video.muted = true;
    video.toggleAttribute('autoplay',true);
    video.toggleAttribute('controls', true);
    video.toggleAttribute('loop', true);
    video.toggleAttribute('playsinline', true);
    const source = document.createElement('source');
    source.setAttribute('src', videoUrl.innerText);
    source.setAttribute('type', 'video/mp4');
    video.append(source);

    videoContainer.append(video);

    block.innerHTML = '';
    block.appendChild(videoContainer);
}