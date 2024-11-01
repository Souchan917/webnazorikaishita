const fetch = require('node-fetch');

// 各問題に対応するプロンプト
const prompts = {
    1: "あなたはウミガメのスープの謎解きゲームの問題1の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    2: "あなたはウミガメのスープの謎解きゲームの問題2の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    3: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    4: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    5: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    6: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    7: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    8: "あなたはウミガメのスープの謎解きゲームの問題3の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。",
    9: "あなたはウミガメのスープの謎解きゲームの問題9の出題者です。プレイヤーの質問に基づいて、答えに近づくヒントを提供し、正しい単語が出たらそれを知らせてください。"
};

module.exports = async (req, res) => {
    const { userMessage, questionId } = req.body;  // ユーザーの質問内容と問題番号を取得

    const prompt = prompts[questionId] || "デフォルトのプロンプト: プレイヤーの質問に基づいて答えに近づくヒントを提供してください。";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 50
            })
        });

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        res.status(200).json({ reply: aiReply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "AIとの通信でエラーが発生しました" });
    }
};
