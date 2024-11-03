// グローバルな音声オブジェクトを作成
let puzzleAudio = window.puzzleAudio || new Audio('https://souchan917.github.io/webnazorikaishita/assets/audio/Q4_nazo.mp3');
puzzleAudio.loop = true;

// 再生状態と再生位置をローカルストレージに保存する関数
function saveAudioState() {
    localStorage.setItem('puzzleAudioPlaying', !puzzleAudio.paused);
    localStorage.setItem('puzzleAudioCurrentTime', puzzleAudio.currentTime);
}

// ページ読み込み時に再生状態を復元
document.addEventListener('DOMContentLoaded', () => {
    const isPuzzleAudioPlaying = localStorage.getItem('puzzleAudioPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('puzzleAudioCurrentTime')) || 0;

    puzzleAudio.currentTime = savedTime; // 保存された再生位置に設定
    if (isPuzzleAudioPlaying) {
        puzzleAudio.play().catch(error => console.log('Puzzle audio play error:', error));
    }
});

// ページが閉じられる前に再生状態を保存
window.addEventListener('beforeunload', saveAudioState);

// 再生ボタンの制御
const playButton = document.getElementById('playPuzzleAudio');
if (playButton) {
    playButton.addEventListener('click', () => {
        if (!puzzleAudio.paused) {
            puzzleAudio.pause();
            playButton.textContent = '▶︎';
        } else {
            puzzleAudio.play().catch(error => console.log('Puzzle audio play error:', error));
            playButton.textContent = '❚❚';
        }
        saveAudioState(); // 状態を保存
    });
}

// プログレスバーとタイム表示の更新
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
puzzleAudio.addEventListener('timeupdate', () => {
    if (progressBar && timeDisplay) {
        const currentTime = puzzleAudio.currentTime;
        const duration = puzzleAudio.duration;
        progressBar.style.width = `${(currentTime / duration) * 100}%`;
        timeDisplay.textContent = formatTime(currentTime);
        saveAudioState(); // 再生位置を保存
    }
});

// 再生終了時の処理
puzzleAudio.addEventListener('ended', () => {
    if (playButton) playButton.textContent = '▶︎';
    if (progressBar) progressBar.style.width = '0%';
    if (timeDisplay) timeDisplay.textContent = '00:00';
    puzzleAudio.currentTime = 0;
    saveAudioState(); // 停止状態を保存
});

// 時間のフォーマット
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
