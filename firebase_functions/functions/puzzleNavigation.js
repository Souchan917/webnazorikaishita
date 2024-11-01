// 進行状況の管理とナビゲーション機能
export class PuzzleNavigation {
    constructor() {
        this.totalQuestions = 9;
        // もし進捗が保存されていない場合は、現在のページ番号を基準にする
        this.currentProgress = this.getProgress();
        this.initializeNavigation();
    }

    // 現在の進行状況を取得
    getProgress() {
        const savedProgress = localStorage.getItem('puzzleProgress');
        // 現在のページ番号を取得（URLから）
        const currentPage = parseInt(window.location.pathname.match(/question-(\d+)\.html/)?.[1] || '1');
        
        // 保存された進捗がない場合は現在のページ番号を返す
        if (!savedProgress) {
            localStorage.setItem('puzzleProgress', currentPage.toString());
            return currentPage;
        }
        
        // 保存された進捗と現在のページ番号の大きい方を返す
        return Math.max(parseInt(savedProgress), currentPage);
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
        // ナビゲーションボタンの生成と配置
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
        
        // ページの先頭に追加
        document.body.insertBefore(nav, document.body.firstChild);
    }
}

// 問題の正解判定と遷移管理
class PuzzleQuestion {
    constructor(correctAnswer, nextQuestionNumber) {
        this.correctAnswer = correctAnswer;
        this.nextQuestionNumber = nextQuestionNumber;
        this.navigation = new PuzzleNavigation();
        this.initializeForm();
    }

    // フォームの初期化と送信処理の設定
    initializeForm() {
        const form = document.getElementById('answerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.checkAnswer();
            });
        }
    }

    // 解答のチェックと処理
    checkAnswer() {
        const answerInput = document.getElementById('answerInput');
        const userAnswer = answerInput.value.trim();
        
        if (userAnswer.toLowerCase() === this.correctAnswer.toLowerCase()) {
            this.navigation.updateProgress(this.nextQuestionNumber);
            window.location.href = `question-${this.nextQuestionNumber}.html`;
        } else {
            alert('不正解です。もう一度考えてみましょう。');
            answerInput.value = '';
        }
    }
}

export { PuzzleNavigation, PuzzleQuestion };