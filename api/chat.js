const fetch = require('node-fetch');

// 各問題に対応するプロンプトと答え
const questionConfig = {
    3: {
        prompt: `あなたはプレイヤーの質問にはい/いいえ/わかりませんで答えることで、
                プレイヤーが正解の単語を当てるゲームの進行役です。
                正解の単語は「馬」です。
                以下のルールに従って回答してください：
                1. プレイヤーの質問には必ず「はい」「いいえ」「わかりません」のいずれかで答えてください
                2. 答えに関係ない質問には「わかりません」と答えてください
                3. 正解を直接言わないでください
                4. 回答は簡潔に、1文で答えてください`,
        answer: "馬"
    }
};

module.exports = async (req, res) => {
    try {
        // CORS headers の追加
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // OPTIONS リクエストへの対応
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        // リクエストボディのパース
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({
                error: "無効なリクエスト形式です"
            });
        }

        const { userMessage, questionId } = req.body;

        // 入力値の検証
        if (!userMessage || typeof userMessage !== 'string') {
            return res.status(400).json({
                error: "有効な質問文を入力してください"
            });
        }

        if (!questionId || !questionConfig[questionId]) {
            return res.status(400).json({
                error: "無効な問題番号です"
            });
        }

        // API Key の検証
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API キーが設定されていません');
        }

        const config = questionConfig[questionId];

        // OpenAI APIへのリクエスト
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: config.prompt
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        // APIレスポンスのエラーハンドリング
        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            return res.status(response.status).json({
                error: "AIサービスでエラーが発生しました",
                details: process.env.NODE_ENV === 'development' ? errorData : undefined
            });
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('無効なAPIレスポンス形式です');
        }

        const aiReply = data.choices[0].message.content.trim();
        
        // 正解判定（大文字小文字、全角半角を考慮）
        const normalizedAnswer = config.answer.toLowerCase().replace(/\s/g, '');
        const normalizedUserMessage = userMessage.toLowerCase().replace(/\s/g, '');
        const isCorrect = normalizedUserMessage.includes(normalizedAnswer);

        res.status(200).json({
            reply: aiReply,
            isCorrect: isCorrect
        });

    } catch (error) {
        console.error("Error in chat.js:", error);
        res.status(500).json({
            error: "サーバーエラーが発生しました。しばらく待ってから再度お試しください。",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};