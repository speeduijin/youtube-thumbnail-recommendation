import { RowDataPacket } from 'mysql2/promise';
import User from './user';
import Thumb from './thumb';

export default interface SelectedThumbs extends RowDataPacket {
  user_id: User.id;
  thumb_id: Thumb.id;
  score: number;
}
