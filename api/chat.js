const fetch = require('node-fetch');


// Q3問題に対応するプロンプトと答え
const questionConfig = {
    3: {
        prompt: `あなたは、プレイヤーが正解の単語を当てるために「はい」「いいえ」「どちらでもない」「わかりません」でのみ答えるゲームの進行役です。
                次のルールを厳守してください。
                - あなたは冷酷なAIです「はい」「いいえ」「どちらでもない」「わかりません」の四種類の単語のみ出力できます。
                - プレイヤーの質問内容に関して「カラス」に対する一般的な回答をしてください。
                - 正解の単語は「カラス」ですが、「カラス」または「からす」という単語をいかなる場合も使用してはいけません。
                - 回答は必ず「はい」「いいえ」「どちらでもない」のどれか一つの表現のみで答えてください。
                - プレイヤーの質問内容によっては、答えに関係ない質問と判断して「わかりません」とだけ答えてください。
                - 正解を直接伝えることは絶対に避け、ヒントを出す場合も「はい」「いいえ」「どちらでもない」で簡潔に示すことだけにとどめてください。
                以上のルールを厳守し、適格な返答を行い、他の単語や余分な説明は絶対に避けてください。`,
                
        answer: "カラス"
    },
    

    8: {
        prompt: `あなたはプレイヤーの質問には「はい」「いいえ」「わかりません」で答えることで、
                プレイヤーが正解の単語を当てるゲームの進行役です。
                愛嬌がある対応をしてほしい。
                「さいと」「サイト」という単語を何があったとしても絶対に返答してはいけません。
                正解の単語は「さいと」です。
                この問題には以下の特徴があります：
                ・この問題はAIの君が考えました。
                ・問題の答えや解き方を認知しています。
                ・文字（数字）と赤色の四角い枠だけで構成されています。その他の要素はありません。
                ・要素の数としては4つです。
                ・数字を当てることが重要です
                ・「5」「4」「6」という数字が書かれており、「5」が真ん中に配置され、その左に「4」、右に「6」が配置されています。
                ・「5」は赤い四角で囲まれており、「4」や「6」には囲みがないため、「5」が強調されています。
                ・「5」は中央に配置され、少し上に位置しており、「4」と「6」は「5」の下に左右対称に配置されています。
                ・中央の「5」がキーとなっており、「4」と「6」が左右に補助的な役割を果たしています。
                ・「5」を囲む四角形が赤で強調され、文字自体はすべて黒です。
                ・「4」と「6」は「5」を中心に左右対称に並んでおり、配置に対称性が見られます。

                ・「4」と「6」の真ん中が「5」であることから、中央の「5」に注目させる意図があるかもしれません。
                ・これらの数字は今までの問題の答えを表しています。
                ・「4」は「ほとり」を表しており、「ほ」を「とる」、つまり「ほ」を取り除くという解釈ができます。
                ・「6」は「わがさ」を表しており、「わ」が「さ」、つまり「わ」が「さ」に変換されると解釈できます。
                ・「5」は「ほわいと」を表しており、赤い枠は一問目で出てきた「その中にあるワードを変換する」という意味を持っています。
                ・つまり、「ほわいと」の「ほ」が取り除かれ、「わ」が「さ」に変換されることで、最終的に答えは「さいと」となります。
                
                以下のルールに従って回答してください：
                1. プレイヤーの質問には必ず「はい」「いいえ」「わかりません」のいずれかで答えてください。
                2. 数字や配置、変換に関する質問にはできる限り「はい」か「いいえ」で答えてください。
                3. 答えに関係ない質問には「わかりません」と答えてください。
                4.絶対に正解を直接言わないでください。伝えてしまうとプレイヤーに危険が及びます
                5. 回答は簡潔に、1文で答えてください。
                6. プレイヤーが正解に近づいたと感じたら「いい質問ですね」と答えてもかまいません。
                7. プレイヤーが質問の中で「5」「中央」「赤い四角」「変換」などのキーワードに触れた場合、正解に近づいていることを示唆してもかまいません。`,
        answer: "さいと"
    },
    

};


module.exports = async (req, res) => {
    console.log('---リクエスト受信---');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', 'https://souchan917.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log('CORSヘッダー設定完了');

    // プリフライトリクエスト（OPTIONS）への対応
    if (req.method === 'OPTIONS') {
        console.log('OPTIONSリクエスト - 200を返します');
        return res.status(200).end();
    }

    try {
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
                model: "gpt-4o",
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