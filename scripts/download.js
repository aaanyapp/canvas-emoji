const https = require("https");
const fs = require("fs");
const emojis = require("unicode-emoji-json");

const emojiHandle = require("node-emoji");

let i = 0;
const faildEmoji = [];
async function dowload(emoji, unicode) {
  i++;
  if(emoji.length > 3) unicode = emoji.codePointAt(0).toString(16) + '-'+ emoji.codePointAt(2).toString(16);
  else unicode = emoji.codePointAt().toString(16);
  let imageUrl = `https://emoji.aranja.com/static/emoji-data/img-apple-160/${unicode}.png`; // 图片的 URL
  let localImageFile = `./emoji_pngs/${emojiHandle.which(emoji)}.png`; // 本地保存图片的路径
  if (fs.existsSync(localImageFile)) {
    return;
  }
  await new Promise(function (resolve, reject) {
    https.get(imageUrl, function (response) {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(localImageFile));
        resolve(`${i}: ${emoji} 下载成功`);
      } else {
        faildEmoji.push(emoji);
        reject(`${faildEmoji.length}: ${emoji} ${unicode} 下载失败 ${i}`, );
      }
    });
  });
}

async function main() {
  for (const emoji in emojis) {
    await dowload(emoji, emoji.codePointAt().toString(16)).catch((err) =>
      console.log(err)
    );
  }
  console.log(`下载完成，失败 ${faildEmoji.length} 个`);
  fs.writeFile("faildEmoji.json", JSON.stringify(faildEmoji), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("faildEmoji.json 文件写入成功");
    }
  });
}

main();
