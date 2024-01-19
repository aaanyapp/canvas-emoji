const https = require("https");
const fs = require("fs");
const emojis = require("unicode-emoji-json");

const emojiHandle = require("node-emoji");

let i = 0;
async function dowload(emoji, unicode) {
  i++
  unicode = emoji.codePointAt().toString(16);
  let imageUrl = `https://emoji.aranja.com/static/emoji-data/img-apple-160/${unicode}.png`; // 图片的 URL
  let localImageFile = `./emoji_pngs/${emojiHandle.which(emoji)}.png`; // 本地保存图片的路径
  if (fs.existsSync(localImageFile)) {
    return;
  }
  await new Promise(function (resolve) {
    https.get(imageUrl, function (response) {
      if(response.statusCode === 200) {
        const writer = fs.createWriteStream(localImageFile);
        writer.on("finish", resolve);
        response.pipe(writer);
      } else {
        console.log(`${emoji} 下载失败`);
      }
    });
  });
}

async function main() {
  for (const emoji in emojis) {
    await dowload(emoji, emoji.codePointAt().toString(16));
  }
}

main();
