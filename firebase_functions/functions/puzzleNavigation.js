// 進行状況の管理とナビゲーション機能
export class PuzzleNavigation {
    constructor() {
        this.totalQuestions = 9;
        this.currentProgress = this.getProgress();
        this.initializeNavigation();
        
        // 現在のページが「通過ページ」だった場合、進行状況を1つ進める
        this.updateProgressForPassThroughPage();
    }

    // 現在の進行状況を取得
    getProgress() {
        const savedProgress = localStorage.getItem('puzzleProgress');
        const currentPage = parseInt(window.location.pathname.match(/question-(\d+)\.html/)?.[1] || '1');
        
        if (!savedProgress) {
            localStorage.setItem('puzzleProgress', currentPage.toString());
            return currentPage;
        }
        
        return Math.max(parseInt(savedProgress), currentPage);
    }

    // 通過ページの場合に進行状況を更新
    updateProgressForPassThroughPage() {
        const passThroughPage = 6; // 例：通過用のページ番号
        if (window.location.pathname.includes(`question-${passThroughPage}.html`)) {
            this.updateProgress(passThroughPage + 1); // 次の問題への進行状況に更新
        }
    }

    // 進行状況を更新
    updateProgress(level) {
        const currentProgress = this.getProgress();
        if (level > currentProgress) {
            localStorage.setItem('puzzleProgress', level.toString());
            this.currentProgress = level;
        }
    }

    // ナビゲーションの初期化
    initializeNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'question-nav';
        
        for (let i = 1; i <= this.totalQuestions; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = 'nav-button';
            
            if (i <= this.currentProgress) {
                button.addEventListener('click', () => {
                    window.location.href = `question-${i}.html`;
                });
            } else {
                button.classList.add('disabled');
                button.disabled = true;
            }
            
            nav.appendChild(button);
        }
        
        document.body.insertBefore(nav, document.body.firstChild);
    }
}
