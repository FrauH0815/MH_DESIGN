document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
  video.addEventListener('error', () => {
    if (video.nextElementSibling?.classList.contains('video-error')) return;
    const message = document.createElement('p');
    message.className = 'video-error';
    message.setAttribute('role', 'status');
    message.append('Das Video konnte nicht geladen werden. ');
    const link = document.createElement('a');
    link.href = video.querySelector('source').getAttribute('src');
    link.textContent = 'Videodatei direkt öffnen';
    message.append(link);
    video.after(message);
  });
});
