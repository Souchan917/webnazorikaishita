// questionAudioControl.js
window.questionAudioController = {
    audio: new Audio('https://souchan917.github.io/webnazorikaishita/assets/audio/Q4_voice.mp3'),
    progressBar: null,
    timeDisplay: null,
    playButton: null,
    
    init() {
        this.progressBar = document.querySelector('.progress-bar');
        this.timeDisplay = document.querySelector('.time-display');
        this.playButton = document.querySelector('.audio-player');
        
        this.setupEventListeners();
        this.updateUI();
    },

    setupEventListeners() {
        // 再生ボタンのクリックイベント
        this.playButton?.addEventListener('click', () => this.toggle());
        
        // 音声の時間更新イベント
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });
        
        // 音声の終了イベント
        this.audio.addEventListener('ended', () => {
            this.updateUI();
            this.progressBar.style.width = '0%';
        });
        
        // エラーハンドリング
        this.audio.addEventListener('error', (e) => {
            console.error('問題音声の再生エラー:', e);
            this.updateUI();
        });
    },

    play() {
        this.audio.play().catch(error => {
            console.error('再生エラー:', error);
            this.updateUI();
        });
        this.updateUI();
    },

    pause() {
        this.audio.pause();
        this.updateUI();
    },

    toggle() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    },

    updateProgress() {
        if (this.progressBar && !isNaN(this.audio.duration)) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    },

    updateTimeDisplay() {
        if (this.timeDisplay) {
            const minutes = Math.floor(this.audio.currentTime / 60);
            const seconds = Math.floor(this.audio.currentTime % 60);
            this.timeDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    updateUI() {
        if (this.playButton) {
            this.playButton.textContent = this.audio.paused ? '▶︎' : '⏸️';
        }
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.questionAudioController.init();
});