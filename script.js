// script.js – all player logic

var songs = [
    { title: 'Midnight Glow', artist: 'Luna Echo', dur: 225 },
    { title: 'Neon Dreams', artist: 'Arctic Pulse', dur: 210 },
    { title: 'Velvet Sky', artist: 'Aurora Waves', dur: 195 },
    { title: 'Echo Chamber', artist: 'Kai Zen', dur: 240 }
];

var index = 0;
var playing = false;
var audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
audio.volume = 0.7;

var playBtn = document.getElementById('playBtn');

function loadSong(i) {
    var s = songs[i];
    document.getElementById('title').textContent = s.title;
    document.getElementById('artist').textContent = s.artist;
    var m = Math.floor(s.dur / 60);
    var sec = s.dur % 60;
    document.getElementById('total').textContent = m + ':' + (sec < 10 ? '0' : '') + sec;
    document.getElementById('fill').style.width = '0%';
    document.getElementById('cur').textContent = '0:00';
    audio.currentTime = 0;

    var items = document.querySelectorAll('.song');
    for (var j = 0; j < items.length; j++) {
        items[j].classList.remove('active');
        if (j === i) items[j].classList.add('active');
    }
}

function renderList() {
    var list = document.getElementById('list');
    list.innerHTML = '';
    for (var i = 0; i < songs.length; i++) {
        var div = document.createElement('div');
        div.className = 'song';
        if (i === index) div.classList.add('active');
        div.innerHTML = '<span>' + songs[i].title + '</span><span>' + songs[i].artist + '</span>';
        div.onclick = (function(idx) {
            return function() {
                index = idx;
                loadSong(index);
                if (playing) audio.play().catch(function() {});
            };
        })(i);
        list.appendChild(div);
    }
}

function toggle() {
    if (playing) {
        audio.pause();
        playBtn.textContent = '▶';
        playing = false;
    } else {
        audio.play().catch(function() {});
        playBtn.textContent = '⏸';
        playing = true;
    }
}

function next() {
    index = (index + 1) % songs.length;
    loadSong(index);
    if (playing) audio.play().catch(function() {});
}

function prev() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    if (playing) audio.play().catch(function() {});
}

audio.addEventListener('timeupdate', function() {
    var pct = (audio.currentTime / songs[index].dur) * 100;
    document.getElementById('fill').style.width = Math.min(pct, 100) + '%';
    var m = Math.floor(audio.currentTime / 60);
    var s = Math.floor(audio.currentTime % 60);
    document.getElementById('cur').textContent = m + ':' + (s < 10 ? '0' : '') + s;
});

audio.addEventListener('ended', function() {
    next();
});

document.getElementById('vol').addEventListener('input', function() {
    audio.volume = parseFloat(this.value);
});

document.getElementById('bar').addEventListener('click', function(e) {
    var rect = this.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * songs[index].dur;
});

document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') {
        e.preventDefault();
        toggle();
    }
});

// initialization
renderList();
loadSong(0);
audio.volume = 0.7;
document.getElementById('vol').value = '0.7';