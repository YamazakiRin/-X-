from collections import deque
from pathlib import Path
import json
from PIL import Image

source = Path("public/logo.png")
if not source.is_file():
    raise SystemExit("public/logo.png に元ロゴを追加してください。ロゴなしの動画は書き出しません。")
image = Image.open(source).convert("RGBA")
image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
w, h = image.size
pixels = image.load()
visited = bytearray(w * h)
queue = deque()

def push(x, y):
    p = y * w + x
    if visited[p]:
        return
    visited[p] = 1
    r, g, b, a = pixels[x, y]
    if a < 12 or min(r, g, b) > 238:
        queue.append((x, y))

for x in range(w):
    push(x, 0)
    push(x, h - 1)
for y in range(h):
    push(0, y)
    push(w - 1, y)
while queue:
    x, y = queue.popleft()
    r, g, b, _ = pixels[x, y]
    pixels[x, y] = (r, g, b, 0)
    if x > 0: push(x - 1, y)
    if x < w - 1: push(x + 1, y)
    if y > 0: push(x, y - 1)
    if y < h - 1: push(x, y + 1)
bbox = image.getbbox()
if bbox is None:
    raise SystemExit("ロゴの輪郭が見つかりませんでした")
cropped = image.crop(bbox)
output = Image.new("RGBA", (cropped.width + 40, cropped.height + 40))
output.paste(cropped, (20, 20))
output.save("public/logo-render.png")
Path("render-props.json").write_text(json.dumps({
    "logoSrc": "logo-render.png",
    "date": "2026/11/01",
    "title": "第3回ベスティカップ"
}, ensure_ascii=False), encoding="utf-8")
