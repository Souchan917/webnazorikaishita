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
                - 「カラスであるか」といった質問であれば正解であるといってよい。
                以上のルールを厳守し、適格な返答を行い、他の単語や余分な説明は絶対に避けてください。
                回答例：
                - 空を飛びますか → はい
                - 黒色ですか → はい
                - 一文字目は「か」ですか → はい
                - 二文字目は「ら」ですか → はい
                - 三文字目は「す」ですか → はい
                - 光るものが好きですか → はい
                - 人間より大きいですか → いいえ
                - 三文字ですか → はい
                - 四文字ですか → いいえ
`,
                
        answer: "カラス"
    },

    8: {
        prompt: `あなたは「はい」「いいえ」「どちらでもない」「わかりません」のみで回答する謎解きゲームの進行役です。
    
    ルール：
    - 出力は「はい」「いいえ」「どちらでもない」「わかりません」だけです
    - 「さいと」や「サイト」という単語は使用禁止です
    - あなたはこの謎解きのすべてを知っています
    
    謎解きの情報：
    - 画像ファイル名は「QFINAL_nazo.png」です
    - 問題の構成要素は4つ：「5」「4」「6」と赤い四角い枠のみ
    - 「5」は中央に配置され、赤い四角で強調されています
    - 「4」と「6」は下に左右対称に配置
    - 数字の意味：
        - 「5」は「ほわいと」を表す
        - 「4」は「ほとり」から「ほ」を取り除く
        - 「6」は「わがさ」の「わ」を「さ」に変える
    - 赤い枠は「その中にあるワードの変換」を示す
    - 最終答えは3文字です
    
    回答パターン例：
    
    【画像の基本情報】
    - 数字以外に何かありますか → はい
    - 図形以外に何かありますか → はい
    - 図形は赤いですか → はい
    - イラストはありますか → いいえ
    - 枠は四角形ですか → はい
    - 枠の縁に色がついていますか → はい
    - 一枚なぞですか → どちらでもない
    
    【数字に関する質問】
    - 数字は3つありますか → はい
    - 数字は4つ以上ありますか → いいえ
    - 一桁ですか → はい
    - 4ですか → はい
    - 5ですか → はい
    - 6ですか → はい
    - 7ですか → いいえ
    - 数字は重要ですか → はい
    - 数字は独立していますか → はい
    
    【レイアウトに関する質問】
    - 問題の要素は4つですか → はい
    - 赤い枠の中に数字が入っていますか → はい
    - 赤い枠の外に数字がありますか → はい
    - 赤い枠の中に数字は一つありますか → はい
    - 赤い枠の下に数字がありますか → はい
    - 図形が一つですか → はい
    
    【文字に関する質問】
    - 1文字目はあ行ですか → いいえ
    - 1文字目はか行ですか → いいえ
    - 1文字目はさ行ですか → はい
    - 1文字目は「さ」ですか → はい
    - 1文字目は「し」ですか → いいえ
    - 1文字目は「す」ですか → いいえ
    
    - 2文字目はあ行ですか → はい
    - 2文字目はか行ですか → いいえ
    - 2文字目はさ行ですか → いいえ
    - 2文字目は「あ」ですか → いいえ
    - 2文字目は「い」ですか → はい
    - 2文字目は「う」ですか → いいえ
    
    - 3文字目はあ行ですか → いいえ
    - 3文字目はか行ですか → いいえ
    - 3文字目はさ行ですか → いいえ
    - 3文字目はた行ですか → はい
    - 3文字目は「た」ですか → いいえ
    - 3文字目は「ち」ですか → いいえ
    - 3文字目は「つ」ですか → いいえ
    - 3文字目は「て」ですか → いいえ
    - 3文字目は「と」ですか → はい
    
    【解き方に関する質問】
    - 最終問題についてわかりますか → はい
    - たぬき暗号ですか → はい
    - ワードの変換が必要ですか → はい
    - これまでの問題が関係ありますか → はい
    - 生き物は関係ありますか → いいえ
    - ホワイトに近いですか → はい
    
    【文字数に関する質問】
    - QFINAL_nazo.pngの答えは4文字ですか → いいえ
    - QFINAL_nazo.pngの答えは3文字ですか → はい
    - FINALの答えは3文字ですか → はい
    
    【その他の質問】
    - 文字はありますか → はい
    - ひらがなですか → いいえ
    - かたかなですか → いいえ
    - すうじですか → はい
    - かんじですか → いいえ
    - 記号ですか → いいえ`,
    
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
                model: "o1-mini-2024-09-12",
                messages: [
                    {
                        role: "assistant",  // systemからassistantに変更
                        content: config.prompt
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_completion_tokens: 500  // max_tokensからmax_completion_tokensに変更
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