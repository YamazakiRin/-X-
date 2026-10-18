import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {BestieCup} from './Root';
import {prepareLogo} from './prepareLogo';

const App=()=>{
  const [logoSrc,setLogo]=useState('');
  const [reference,setReference]=useState('');
  const [status,setStatus]=useState('');
  useEffect(()=>()=>{if(reference)URL.revokeObjectURL(reference);},[reference]);
  const loadLogo=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];if(!file)return;
    setStatus('ロゴを処理しています…');
    try{setLogo(await prepareLogo(file));setStatus('ロゴを読み込みました');}
    catch(error){setStatus(error instanceof Error?error.message:'画像を読み込めませんでした');}
  };
  const download=()=>{
    const link=document.createElement('a');
    link.href=logoSrc;link.download='logo.png';link.click();
  };
  return <main style={{minHeight:'100vh',background:'#edf5f7',color:'#063444',fontFamily:'sans-serif',padding:'32px',boxSizing:'border-box'}}>
    <h1 style={{fontSize:26}}>ベスティカップ 動画プレビュー</h1>
    <p>参考動画との動きの照合前の初稿です。ロゴを選ぶと立体表現に反映します。</p>
    <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
      <div style={{width:'min(380px, 100%)'}}>
        <Player component={BestieCup} inputProps={{logoSrc,date:'2026/11/01',title:'第3回ベスティカップ'}} durationInFrames={360} compositionWidth={1080} compositionHeight={1920} fps={30} controls loop style={{width:'100%',borderRadius:16,overflow:'hidden'}}/>
      </div>
      <div style={{maxWidth:440}}>
        <p><label>ロゴ画像（PNG / JPEG / WebP）<br/><input type="file" accept="image/png,image/jpeg,image/webp" onChange={loadLogo}/></label></p>
        <p role="status">{status}</p>
        {logoSrc&&<p><button onClick={download}>透過ロゴを保存</button></p>}
        <p>画像はこのブラウザ内で処理します。保存した logo.png を public/ に置くと、Studioでも使えます。</p>
        <p><label>参考動画（比較用）<br/><input type="file" accept="video/*" onChange={e=>{const file=e.target.files?.[0];if(file)setReference(URL.createObjectURL(file));}}/></label></p>
        {reference&&<video src={reference} controls style={{width:'100%',maxHeight:560}}/>}
        <p>尺：12秒 ／ 縦型 1080 × 1920 ／ 30fps<br/>最後の3.2秒に開催日と大会名を表示します。</p>
      </div>
    </div>
  </main>;
};
createRoot(document.getElementById('root')!).render(<App/>);
