import { createCanvas, loadImage, registerFont } from "canvas";

type Entry = {
  username: string;
  avatarURL: string;
  coins: number;
};

export async function generateLeaderboard(entries: Entry[]): Promise<Buffer> {
  const width = 400;
  const rowHeight = 55;
  const headerHeight = 40;
  const height = headerHeight + rowHeight * entries.length;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#2f3136";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Leaderboard", 10, 25)

  for (let i = 0; i < entries.length && i < 10; i++) {
    const y = headerHeight + i * rowHeight;
    const entry = entries[i]

    ctx.fillStyle = i % 2 === 0 ? "#36393f" : "#2f3136";
    ctx.fillRect(0, y, width, rowHeight);

    try {
        const res = await fetch(entry.avatarURL);
        const buffer = await res.arrayBuffer();
        const img = await loadImage(Buffer.from(buffer))
        ctx.drawImage(img, 10, y + 5, 40, 40)
    } catch {
        // ignore errors
    }

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 14px Arial"
    ctx.fillText(`#${i + 1} ● ${entry.username}`, 60, y + 20)

    ctx.font = "12px Arial"
    ctx.fillText(`${entry.coins} coins`, 60, y + 40)

  }

  return canvas.toBuffer();
}
