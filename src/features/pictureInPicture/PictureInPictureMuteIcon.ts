import { snow } from '../../theme/theme';
import { Vector2 } from '../../types/spatials';
import { PictureInPictureRenderable } from './PictureInPictureRenderable';

const MUTED_PATH = new Path2D(
  'M12 3C10.3431 3 9 4.34315 9 6V8.97806L14.1364 12.1061C14.6704 11.5644 15 10.8207 15 10V6C15 4.34315 13.6569 3 12 3ZM5.03292 10.2932L2.78576 8.92669C2.315 8.64043 2.16544 8.02674 2.4517 7.55599C2.73797 7.08524 3.35165 6.93568 3.8224 7.22194L19.2045 16.5757C19.6753 16.862 19.8249 17.4757 19.5386 17.9464C19.2523 18.4172 18.6387 18.5667 18.1679 18.2805L14.9404 16.3178C14.3374 16.6141 13.6862 16.8222 13 16.9255V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H12H9C8.44771 21 8 20.5523 8 20C8 19.4477 8.44771 19 9 19H11V16.9255C7.78824 16.4419 5.34161 13.6624 5.03292 10.2932ZM7.41314 11.7406C8.19324 13.6828 9.98656 15 12 15C12.2327 15 12.4625 14.9824 12.6882 14.9483L7.41314 11.7406ZM19 9.57143C19 11.2871 18.4454 12.8863 17.5059 14.1581L15.7897 13.1129C16.5398 12.1715 17 10.9414 17 9.57143V9C17 8.44771 17.4477 8 18 8C18.5523 8 19 8.44771 19 9V9.57143Z'
);

const SCALE = 4;

export class PictureInPictureMuteIcon extends PictureInPictureRenderable {
  render = (position: Vector2) => {
    this.ctx.fillStyle = snow.palette.brandColors.cherry.bold;
    this.ctx.strokeStyle = snow.palette.brandColors.ink.regular;
    this.ctx.lineWidth = 1;
    // offset drawing position
    this.ctx.setTransform(SCALE, 0, 0, SCALE, position.x, position.y);
    this.ctx.fill(MUTED_PATH);
    this.ctx.stroke(MUTED_PATH);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
