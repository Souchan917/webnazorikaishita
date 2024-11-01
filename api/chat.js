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
    console.log('---リクエスト受信---');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

    try {
        // CORS headers の追加
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        console.log('CORSヘッダー設定完了');

        // OPTIONS リクエストへの対応
        if (req.method === 'OPTIONS') {
            console.log('OPTIONSリクエスト - 200を返します');
            return res.status(200).end();
        }

        // リクエストボディのパース
        if (!req.body || typeof req.body !== 'object') {
            console.error('無効なリクエスト形式:', req.body);
            return res.status(400).json({
                error: "無効なリクエスト形式です"
            });
        }

        const { userMessage, questionId } = req.body;
        console.log('パース済みデータ:', { userMessage, questionId });

        // 入力値の検証
        if (!userMessage || typeof userMessage !== 'string') {
            console.error('無効な質問文:', userMessage);
            return res.status(400).json({
                error: "有効な質問文を入力してください"
            });
        }

        if (!questionId || !questionConfig[questionId]) {
            console.error('無効な問題番号:', questionId);
            return res.status(400).json({
                error: "無効な問題番号です"
            });
        }

        // API Key の検証
        if (!process.env.OPENAI_API_KEY) {
            console.error('OpenAI APIキーが設定されていません');
            throw new Error('OpenAI API キーが設定されていません');
        }

        const config = questionConfig[questionId];
        console.log('選択された問題設定:', questionId);

        console.log('OpenAI APIリクエスト開始');
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
        console.log('OpenAI APIレスポンスステータス:', response.status);

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
        console.log('OpenAI APIレスポンスデータ:', JSON.stringify(data, null, 2));
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('無効なAPIレスポンス形式:', data);
            throw new Error('無効なAPIレスポンス形式です');
        }

        const aiReply = data.choices[0].message.content.trim();
        console.log('AI応答:', aiReply);
        
        // 正解判定
        const normalizedAnswer = config.answer.toLowerCase().replace(/\s/g, '');
        const normalizedUserMessage = userMessage.toLowerCase().replace(/\s/g, '');
        const isCorrect = normalizedUserMessage.includes(normalizedAnswer);
        console.log('正解判定:', { normalizedAnswer, normalizedUserMessage, isCorrect });

        const responseData = {
            reply: aiReply,
            isCorrect: isCorrect
        };
        console.log('返信データ:', responseData);

        res.status(200).json(responseData);

    } catch (error) {
        console.error("詳細なエラー情報:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({
            error: "サーバーエラーが発生しました。しばらく待ってから再度お試しください。",
            details: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};