import { FieldPacket } from 'mysql2';
import { map, pipe, toArray, filter, includes, each } from '@fxts/core';
import promisePool from '../config/db';
import SelectedThumbs from '../types/selectedThumbs';

const select = async (
  userId: number | undefined,
  selectedThumbIds: number[],
  unselectedThumbIds: number[],
) => {
  const [exSelectedThumbs]: [SelectedThumbs[], FieldPacket[]] =
    await promisePool.execute(
      'SELECT * FROM selected_thumbs WHERE user_id = ?',
      [userId],
    );

  const exSelectedThumbIds = pipe(
    exSelectedThumbs,
    map((t) => t.thumb_id),
    toArray,
  );

  const addExSelectedThumbs = (id: number) =>
    promisePool.execute(
      'INSERT INTO selected_thumbs (user_id, thumb_id) VALUES (?, ?);',
      [userId, id],
    );

  pipe(
    selectedThumbIds,
    filter((id) => !includes(id, exSelectedThumbIds)),
    toArray,
    each(addExSelectedThumbs),
  );

  const exNotFiveSelectedThumbIds = pipe(
    exSelectedThumbs,
    filter((t) => t.score !== 5),
    map((t) => t.thumb_id),
    toArray,
  );

  const increaseScore = (id: number) =>
    promisePool.execute(
      'UPDATE selected_thumbs SET score = score + 1 WHERE user_id = ? AND thumb_id = ?;',
      [userId, id],
    );

  pipe(
    selectedThumbIds,
    filter((id) => includes(id, exNotFiveSelectedThumbIds)),
    toArray,
    each(increaseScore),
  );

  const decreaseScore = (id: number) =>
    promisePool.execute(
      'UPDATE selected_thumbs SET score = score - 1 WHERE user_id = ? AND thumb_id = ?;',
      [userId, id],
    );

  pipe(
    exSelectedThumbs,
    filter((t) => t.score !== 1),
    filter((t) => includes(t.thumb_id, unselectedThumbIds)),
    map((t: SelectedThumbs) => t.thumb_id),
    toArray,
    each(decreaseScore),
  );

  const delThumbId = (id: number) =>
    promisePool.execute(
      'DELETE FROM selected_thumbs WHERE user_id = ? AND thumb_id = ?;',
      [userId, id],
    );

  pipe(
    exSelectedThumbs,
    filter((t) => t.score === 1),
    filter((t) => includes(t.thumb_id, unselectedThumbIds)),
    map((t) => t.thumb_id),
    toArray,
    each(delThumbId),
  );
};

const recommendation = async () => {};

export { select, recommendation };
