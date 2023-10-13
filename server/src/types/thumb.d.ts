import { RowDataPacket } from 'mysql2/promise';

export default interface Thumb extends RowDataPacket {
  id: number;
  video_id: string;
  title: string;
  description: string;
  category_id: string;
  created_at: Date;
}
