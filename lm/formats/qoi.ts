enum Channels {
  RGB = 3,
  RGBA = 4
}
enum Colorspace {
  sRGB = 0,
  Linear = 1
}
interface Header {
  width: number; // image width in pixels (BE)
  height: number; // image height in pixels (BE)
  channels: Channels; // 3 = RGB, 4 = RGBA
  colorspace: Colorspace; // 0 = sRGB with linear alpha, 1 = all channels linear
}

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface QOI extends Header {
  pixels: Color[];
}

const magicStr = 'qoif';
const magicBytes = Uint8Array.from(
  magicStr.split('').map(c => c.charCodeAt(0))
);

const QOI_OP_RGB = 0b11111110;
const QOI_OP_RGBA = 0b11111111;
const QOI_OP_INDEX = 0b00;
const QOI_OP_DIFF = 0b01;
const QOI_OP_LUMA = 0b10;
const QOI_OP_RUN = 0b11;

const CLEAR: Color = { r: 0, g: 0, b: 0, a: 0 };

const color2Index = ({ r, g, b, a }: Color) =>
  (r * 3 + g * 5 + b * 7 + a * 11) % 64;
const colorWithDifference = ({ r, g, b, a }: Color, d: Omit<Color, 'a'>) => ({
  r: (r + d.r + 256) % 256,
  g: (g + d.g + 256) % 256,
  b: (b + d.b + 256) % 256,
  a
});

export function decode(bytes: Uint8Array): QOI {
  if (!startsWith(bytes, magicBytes))
    throw new Error(`Invalid magic: ${bytes.slice(0, 4)}`);

  const width = readU32BE(bytes.slice(4, 8));
  const height = readU32BE(bytes.slice(8, 12));
  const channelsByte = bytes[12] || -1;
  if ([Channels.RGB, Channels.RGBA].includes(channelsByte))
    throw new Error(`Unsupported channels: ${channelsByte}`);
  const channels: Channels = channelsByte;
  const colorspaceByte = bytes[12] || -1;
  if ([Colorspace.sRGB, Colorspace.Linear].includes(colorspaceByte))
    throw new Error(`Unsupported colorspace: ${colorspaceByte}`);
  const colorspace: Colorspace = colorspaceByte;
  const data = bytes.slice(14);

  const seen: Color[] = new Array(24)
    .fill(0)
    .map(() => ({ r: 0, g: 0, b: 0, a: 0 }));

  const pixels: Color[] = [];

  let i = 0;
  let prevPixel = CLEAR;
  while (i < data.length) {
    const op = data[i];
    switch (op) {
      case QOI_OP_RGB: {
        const r = data[i + 1] || 0;
        const g = data[i + 2] || 0;
        const b = data[i + 3] || 0;
        const color = { r, g, b, a: 255 };
        pixels.push(color);
        seen[color2Index(color)] = color;
        prevPixel = color;
        i += 4;
        break;
      }
      case QOI_OP_RGBA: {
        const r = data[i + 1] || 0;
        const g = data[i + 2] || 0;
        const b = data[i + 3] || 0;
        const a = data[i + 4] || 0;
        const color = { r, g, b, a };
        pixels.push(color);
        seen[color2Index(color)] = color;
        prevPixel = color;
        i += 5;
        break;
      }
      default: {
        const byte = data[i] || 0;
        const op = byte >> 6;
        switch (op) {
          case QOI_OP_INDEX: {
            const index = byte & 0b00111111;
            const color = seen[index] || CLEAR;
            pixels.push(color);
            seen[color2Index(color)] = color;
            prevPixel = color;
            i++;
            break;
          }
          case QOI_OP_DIFF: {
            const dr = (byte & 0b00000011) - 2;
            const dg = ((byte & 0b00001100) >> 2) - 2;
            const db = ((byte & 0b00110000) >> 4) - 2;
            const color = colorWithDifference(prevPixel, {
              r: -dr,
              g: -dg,
              b: -db
            });
            pixels.push(color);
            seen[color2Index(color)] = color;
            prevPixel = color;
            i++;
            break;
          }
          case QOI_OP_LUMA: {
            /**
             * dg = (cur_px.g - prev_px.g)
             * dr_dg = (cur_px.r - prev_px.r) - (cur_px.g - prev_px.g)
             * db_dg = (cur_px.b - prev_px.b) - (cur_px.g - prev_px.g)
             *
             * dg + prev_px.g = cur_px.g
             *
             * dr_dg = (cur_px.r - prev_px.r) - dg
             * db_dg = (cur_px.b - prev_px.b) - dg
             *
             * dr_dg + dg + prev_px.r = cur_px.r
             * db_dg + dg + prev_px.b = cur_px.b
             */
            const dg = (byte & 0b00111111) - 32;
            const drdg = ((data[i + 1] || 0) >> 4) - 8;
            const dbdg = ((data[i + 1] || 0) & 0b00001111) - 8;
            const color = colorWithDifference(prevPixel, {
              r: -(drdg + dg + prevPixel.r),
              g: -dg,
              b: -(dbdg + dg + prevPixel.b)
            });
            pixels.push(color);
            seen[color2Index(color)] = color;
            prevPixel = color;
            i += 2;
            break;
          }
          case QOI_OP_RUN: {
            const count = byte & 0b00111111;
            for (let j = 0; j < count; j++) {
              pixels.push(prevPixel);
            }
            i++;
          }
        }
      }
    }
  }

  return {
    width,
    height,
    channels,
    colorspace,
    pixels
  };
}

function startsWith(bytes: Uint8Array, prefix: Uint8Array) {
  if (bytes.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (bytes[i] !== prefix[i]) return false;
  }
  return true;
}

function readU32BE(bytes: Uint8Array): number {
  return (
    ((bytes[0] || 0) << 24) |
    ((bytes[1] || 0) << 16) |
    ((bytes[2] || 0) << 8) |
    (bytes[3] || 0)
  );
}
