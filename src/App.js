import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import axios from 'axios';

function App() {
  const [inputText, setInputText] = useState('');
  const [proofreadText, setProofreadText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProofread = async () => {
    if (!inputText) return;

    setLoading(true);
    setError(null);

    try{
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'あなたは日本語の文章を修正するアシスタントです。修正後の文章のみを表示してください。' },
            { role: 'user', content: `この文章を修正してください。: ${inputText}` },
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const proofreadMessage = response.data.choices[0].message.content;
      setProofreadText(proofreadMessage);
    }catch(err){
      setError("OpenAIとの連携でエラーが発生しました。");
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>文章校閲</h1>
      <textarea
      rows="10"
      cols="50"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      placeholder='ここに文章を入力してください。'
      />
      <br />
      <button onClick={handleProofread} disabled={loading}>
        {loading ? "文章校閲中..." : "校閲する。"}
      </button>
      {error && <p style={{color:'red'}}>{error}</p>}
      {proofreadText && (
        <div>
          <h2>校閲済みテキスト</h2>
          <p>{proofreadText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
