# ベスティカップ動画（Remotion初稿）

最終表示：**2026/11/01 第3回ベスティカップ**

## 現在の状態

- 1080 × 1920、30fps、12秒の編集用プロジェクトです。
- ロゴの輪郭を重ねて厚みを持たせ、浮遊・左右回転・正面着地を表現します。
- 最後の3.2秒に開催日と大会名を表示します。
- **参考MP4と元ロゴはまだリポジトリに入っていません。** チャット添付を読み込む制作環境が起動しなかったためです。
- 参考動画のカット、動き、尺との照合と、実行・型チェック・映像確認は未実施です。完成版ではありません。
- 音声は未追加です。

## 起動

Node.js 22 LTSを推奨します。

```sh
cd bestie-cup-video
npm install
npm run preview
```

表示されたローカルURLを開き、チャットに添付したロゴ画像を選んでください。
白い外背景だけを除き、文字の内側の白を残して透過処理します。
同じ画面で参考MP4を選び、比較できます。選択したファイルはサーバーへ送信しません。

## Studioで編集

1. プレビューの「透過ロゴを保存」から `logo.png` を保存します。
2. `public/logo.png` に置きます。
3. `src/Root.tsx` のCompositionの `defaultProps` を `logoSrc: 'logo.png'` に変更します。
4. 次を実行します。

```sh
npm run typecheck
npm run studio
```

`BestieCup` を開いてプレビューを確認します。
動きは `src/Root.tsx` の `angle`、`tilt`、`float` とタイムラインから編集できます。
終幕の文言はCompositionの `date` と `title` で変更できます。
日本語フォントはローカルのNoto Sans CJK JP / ヒラギノ / 游ゴシックを使います。
書き出し先にも日本語フォントをインストールしてください。

## MP4書き出し（必要な場合）

ロゴ設定とプレビュー確認後に実行してください。

```sh
npm run render
```

出力先：`out/bestie-cup.mp4`

## GitHubでMP4を自動書き出し

1. 元のロゴをPNG画像として `bestie-cup-video/public/logo.png` にアップロードし、mainへコミットします。
2. GitHub Actions の「Render Bestie Cup MP4」が自動で起動します。
3. 成功すると `bestie-cup-video/exports/bestie-cup.mp4` がmainへ保存されます。
4. 動画のGitHubページで「Download raw file」からダウンロードできます。ActionsのArtifactsにも30日間保存します。

白い外背景の除去と切り抜きは自動処理します。文字の内側の白は保持します。
ロゴが未追加の場合は書き出しを停止します。
Actionsが無効になっている場合はリポジトリのActions画面で有効にしてください。
ブランチ保護で自動コミットが拒否された場合も、書き出し成功後のMP4はActionsのArtifactから取得できます。

この設定の保存時点ではロゴ素材が未追加のため、MP4はまだ生成されていません。
参考動画との動きの照合と映像の目視確認も未完了です。
