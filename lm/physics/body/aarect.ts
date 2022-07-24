import type p5 from 'p5';

import Body from './body';
import AABB from './aabb';
import ConvexPolygon from './convex-polygon';
import Rect from './rect';
import { vec2, Vector2 } from '../../math/vector';
import type { RenderOptions } from '../types';

export default class AARect extends Body {
  size: Vector2;
  normals = [vec2(1, 0), vec2(0, 1)];
  rotationalInertia = Infinity;

  constructor(
    x: number,
    y: number,
    width: number,
    height = width,
    mass?: number
  ) {
    super(x, y, mass);
    this.size = vec2(width, height);
  }

  get width(): number {
    return this.size.x;
  }
  set width(width: number) {
    this.size.x = width;
  }
  get height(): number {
    return this.size.y;
  }
  set height(height: number) {
    this.size.y = height;
  }

  get aabb(): AABB {
    const { x, y, width, height } = this;
    return new AABB(x - width / 2, y - height / 2, width, height);
  }

  collides(body: Body, resolve = false): boolean {
    if (body instanceof AARect) return this.aabb.intersects(body.aabb);
    if (body instanceof ConvexPolygon) {
      const rect = new Rect(this.x, this.y, this.width, this.height);
      return body.collides(rect, resolve);
    }
    return body.collides(this, resolve);
  }

  render(p: p5, options?: RenderOptions): void {
    const { x, y, width, height } = this;
    p.push();
    p.translate(x, y);

    p.stroke(61, 69, 224);
    p.strokeWeight(2);
    p.fill(81, 89, 232);
    p.rectMode(p.CENTER);
    p.rect(0, 0, width, height);
    p.rectMode(p.CORNER);

    p.stroke(0);
    p.strokeWeight(4);
    if (options?.position) p.point(0, 0);
    if (options?.vertices) {
      p.point(-width / 2, -height / 2);
      p.point(+width / 2, -height / 2);
      p.point(-width / 2, +height / 2);
      p.point(+width / 2, +height / 2);
    }
    if (options?.normals) {
      p.stroke(0, 0, 255);
      p.strokeWeight(2);
      p.line(width / 2, 0, width / 2 + 20, 0);
      p.line(0, height / 2, 0, height / 2 + 20);
    }

    p.pop();
  }
}
