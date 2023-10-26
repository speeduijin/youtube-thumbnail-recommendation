import { RequestHandler } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql2/promise';
import { map, pipe, toArray } from '@fxts/core';
import promisePool from '../config/db';
import { select as serviceSelect } from '../services/user';

const select: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req;
    const userId = user?.id;
    const { selectedThumbIds, unselectedThumbIds } = req.body;

    await serviceSelect(userId, selectedThumbIds, unselectedThumbIds);
  } catch (error) {
    next(error);
  }
};

const recommendation: RequestHandler = async (req, res, next) => {
  const { user } = req;
  const userId = user?.id;

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await promisePool.execute(
      `SELECT k.id AS keyword_id, k.name AS keyword, COUNT(ck.keyword_id) AS keyword_count
      FROM selected_thumbs st
      JOIN counted_keywords ck ON st.thumb_id = ck.thumbnail_id
      JOIN keywords k ON ck.keyword_id = k.id
      WHERE st.user_id = ?
      GROUP BY ck.keyword_id
      ORDER BY keyword_count DESC
      LIMIT 3;`,
      [userId],
    );

    const recommendations = pipe(
      rows,
      map((obj) => obj.keyword),
      toArray,
    );

    res.json(recommendations);
  } catch (err) {
    next(err);
  }
};

export { select, recommendation };
