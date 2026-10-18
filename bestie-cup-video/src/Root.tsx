import React from 'react';
import {AbsoluteFill, Composition, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type VideoProps = {logoSrc: string; date: string; title: string};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// These layers share a single artwork and form its extruded silhouette.
// The front keeps the supplied artwork; the sides use the same alpha mask.
const LogoObject: React.FC<{src: string; angle: number; tilt: number; scale: number}> = ({src, angle, tilt, scale}) => (
  <div style={{position:'absolute',left:120,top:400,width:840,height:840,perspective:2000}}>
    <div style={{width:'100%',height:'100%',transformStyle:'preserve-3d',transform:`rotateX(${tilt}deg) rotateY(${angle}deg) scale(${scale})`}}>
      {Array.from({length:33},(_,i)=>(
        <Img key={i} src={src} style={{position:'absolute',width:'100%',height:'100%',objectFit:'contain',transform:`translateZ(${-64+i*2}px)`,filter:i===32?'drop-shadow(0px -2px 2px rgba(255,255,255,.35))':`brightness(0) saturate(100%) invert(11%) sepia(44%) saturate(1400%) hue-rotate(151deg) brightness(${0.72+i/75})`,backfaceVisibility:'visible'}}/>
      ))}
    </div>
  </div>
);

const EndTitle: React.FC<{date:string;title:string}> = ({date,title}) => {
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  return <div style={{position:'absolute',top:1275,left:80,right:80,textAlign:'center',color:'#062e3c',opacity:interpolate(f,[0,.45*fps],[0,1],clamp),translate:`0 ${interpolate(f,[0,.6*fps],[60,0],clamp)}px`}}>
    <div style={{fontSize:74,fontWeight:800,letterSpacing:5,fontVariantNumeric:'tabular-nums'}}>{date}</div>
    <div style={{fontSize:70,fontWeight:900,marginTop:24,letterSpacing:2}}>{title}</div>
  </div>;
};

export const BestieCup: React.FC<VideoProps> = ({logoSrc,date,title}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const enter=spring({frame,fps,config:{damping:16,stiffness:75,mass:1.2}});
  const angle=interpolate(t,[0,2.5,5.2,7.3,8.8,12],[-68,28,-28,24,0,0],clamp);
  const tilt=interpolate(t,[0,3,6,8.8,12],[18,-8,12,0,0],clamp);
  const float=t<8.8?Math.sin(t*2.3)*24:0;
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 35% 20%, #ffffff 0%, #e5f4f7 55%, #a9d3e2 100%)',fontFamily:'"Noto Sans CJK JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',overflow:'hidden'}}>
    <div style={{position:'absolute',width:830,height:160,left:125,top:1180,borderRadius:'50%',background:'#083b49',filter:'blur(36px)',opacity:interpolate(t,[0,2,8.8],[.06,.17,.12],clamp),scale:interpolate(t,[0,2,8.8],[.45,1,.8],clamp)}}/>
    <div style={{position:'absolute',inset:0,translate:`0 ${(1-enter)*(-950)+float+interpolate(t,[7.4,8.8],[0,-105],clamp)}px`}}>
      {logoSrc
        ? <LogoObject src={logoSrc.startsWith('data:')||logoSrc.startsWith('http')?logoSrc:staticFile(logoSrc)} angle={angle} tilt={tilt} scale={interpolate(t,[0,2,5,8.8],[.7,1,.96,.94],clamp)}/>
        : <div style={{position:'absolute',top:650,left:120,right:120,textAlign:'center',color:'#073444',fontSize:52,fontWeight:800}}>ロゴ画像を設定してください</div>}
    </div>
    <Sequence name="開催日・大会名" from={8.8*fps} durationInFrames={3.2*fps} premountFor={fps}>
      <EndTitle date={date} title={title}/>
    </Sequence>
  </AbsoluteFill>;
};

export const Root: React.FC = () => <Composition id="BestieCup" component={BestieCup} width={1080} height={1920} fps={30} durationInFrames={360} defaultProps={{logoSrc:'',date:'2026/11/01',title:'第3回ベスティカップ'}}/>;
