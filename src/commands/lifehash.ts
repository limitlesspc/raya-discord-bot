/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AttachmentBuilder } from 'discord.js';
import { createCanvas } from '@napi-rs/canvas';
import command from '@limitlesspc/limitless/discord/command';

import { strTo16x16 } from '$services/hash';

const size = 16;
const zoom = 4;
const width = size * zoom;
const iterations = 100;

export default command(
  {
    desc: "Runs Conway's Game of Life on a SHA-256 hash of a message",
    options: {
      message: {
        type: 'string',
        desc: 'The message to hash and convert to a lifehash'
      }
    }
  },
  async (i, { message }) => {
    const canvas = createCanvas(width, width);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, width);

    let grid = strTo16x16(message);
    drawGrid();

    // Conway's Game of Life
    for (let i = 0; i < iterations; i++) {
      const next = new Array<boolean[]>(size);
      for (let x = 0; x < size; x++) {
        const row = new Array<boolean>(size);
        for (let y = 0; y < size; y++) {
          const neighbors = getNeighbors(grid, x, y);
          const alive = neighbors.reduce(
            (sum, cell) => sum + (cell ? 1 : 0),
            0
          );
          row[y] = grid[x]![y] ? alive === 2 || alive === 3 : alive === 3;
        }
        next[x] = row;
      }
      grid = next;
      drawGrid();
    }

    function drawGrid() {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (grid[y]![x]) {
            ctx.fillStyle = '#f0f1';
            ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
          }
        }
      }
    }

    return i.reply({
      files: [new AttachmentBuilder(canvas.toBuffer('image/png'))]
    });
  }
);

function getNeighbors(grid: boolean[][], x: number, y: number): boolean[] {
  return [
    grid[(y - 1 + size) % size]![(x - 1 + size) % size]!,
    grid[(y - 1 + size) % size]![x]!,
    grid[(y - 1 + size) % size]![(x + 1) % size]!,
    grid[y]![(x - 1 + size) % size]!,
    grid[y]![(x + 1) % size]!,
    grid[(y + 1) % size]![(x - 1 + size) % size]!,
    grid[(y + 1) % size]![x]!,
    grid[(y + 1) % size]![(x + 1) % size]!
  ];
}
