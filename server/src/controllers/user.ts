import { RequestHandler } from 'express';
import { FieldPacket } from 'mysql2/promise';
import { pipe, map, filter, toArray, each, includes } from '@fxts/core';
import promisePool from '../config/db';
import SelectedThumbs from '../types/selectedThumbs';
import Thumb from '../types/thumb';

const select: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req;
    const userId = user?.id;
    const { selectedThumbIds, unselectedThumbIds } = req.body;

    const [exSelectedThumbs]: [SelectedThumbs[], FieldPacket[]] =
      await promisePool.execute(
        'SELECT * FROM selected_thumbs WHERE user_id = ?',
        [userId],
      );

    const exSelectedThumbIds: SelectedThumbs['thumb_id'][] = await pipe(
      exSelectedThumbs,
      map((t: SelectedThumbs) => t.thumb_id),
      toArray,
    );

    const exUnselectedThumbIds: SelectedThumbs['thumb_id'][] = await pipe(
      exSelectedThumbs,
      filter((t) => t.score !== 1),
      filter((t) => includes(t.thumb_id, unselectedThumbIds)),
      map((t: SelectedThumbs) => t.thumb_id),
      toArray,
    );

    const mExThumbId = async (id: SelectedThumbs['thumb_id']) =>
      promisePool.execute(
        'UPDATE selected_thumbs SET score = score - 1 WHERE user_id = ? AND thumb_id = ?;',
        [userId, id],
      );

    each(mExThumbId, exUnselectedThumbIds);

    const exOneUnselectedThumbIds: SelectedThumbs['thumb_id'][] = await pipe(
      exSelectedThumbs,
      filter((t) => t.score === 1),
      filter((t) => includes(t.thumb_id, unselectedThumbIds)),
      map((t: SelectedThumbs) => t.thumb_id),
      toArray,
    );

    const delThumbId = (id: SelectedThumbs['thumb_id']) =>
      promisePool.execute(
        'DELETE FROM selected_thumbs WHERE user_id = ? AND thumb_id = ?;',
        [userId, id],
      );

    each(delThumbId, exOneUnselectedThumbIds);

    const exFiveSelectedThumbIds: SelectedThumbs['thumb_id'][] = await pipe(
      exSelectedThumbs,
      filter((t) => t.score !== 5),
      map((t: SelectedThumbs) => t.thumb_id),
      toArray,
    );

    console.log(exFiveSelectedThumbIds);

    const newThumbIds: SelectedThumbs['thumb_id'][] = pipe(
      selectedThumbIds,
      filter(
        (id: SelectedThumbs['thumb_id']) => !includes(id, exSelectedThumbIds),
      ),
      toArray,
    );

    const addNewThumbId = (id: SelectedThumbs['thumb_id']) =>
      promisePool.execute(
        'INSERT INTO selected_thumbs (user_id, thumb_id) VALUES (?, ?);',
        [userId, id],
      );

    each(addNewThumbId, newThumbIds);

    const exNotFiveSelectedThumbIds: SelectedThumbs['thumb_id'][] = pipe(
      selectedThumbIds,
      filter((id: SelectedThumbs['thumb_id']) =>
        includes(id, exFiveSelectedThumbIds),
      ),

      toArray,
    );

    console.log('selectedThumbIds', selectedThumbIds);
    console.log('exNotFiveSelectedThumbIds', exNotFiveSelectedThumbIds);

    const UpdateExThumbId = async (id: SelectedThumbs['thumb_id']) =>
      promisePool.execute(
        'UPDATE selected_thumbs SET score = score + 1 WHERE user_id = ? AND thumb_id = ?;',
        [userId, id],
      );

    each(UpdateExThumbId, exNotFiveSelectedThumbIds);
  } catch (error) {
    next(error);
  }
};

function splitStringAndRemoveEmoji(inputString: string): string[] {
  // 줄 바꿈과 띄어쓰기를 기준으로 문자열을 분할
  const stringArray: string[] = inputString.split(/[\s\n]+/);

  // 이모지, 기호, "http"로 시작하는 문자열을 제거하고 새로운 배열에 저장
  const resultArray: string[] = [];

  stringArray.forEach((str: string) => {
    // 정규 표현식을 사용하여 "http"로 시작하는 문자열을 삭제
    let modifiedStr = str.replace(/https?:\/\/[^\s]+/g, '');
    // 다른 문자 제거
    modifiedStr = modifiedStr.replace(/[\uD800-\uDFFF]|[\u2000-\u3300]/gu, '');
    modifiedStr = modifiedStr.replace(/[^a-zA-Z0-9가-힣]+/g, '');
    // 단어 형태로 만들기
    modifiedStr = modifiedStr.replace(/[가-힣]+/g, (word) =>
      // 조사 등을 삭제하기 위해 추가로 처리
      word.replace(/(이$|가$|을$|를$|에$|에서$|로$|와$|과$|은$)/, ''),
    );

    if (/[가-힣]/.test(modifiedStr)) {
      resultArray.push(modifiedStr);
    }
  });

  return resultArray;
}

const recommendation: RequestHandler = async (req, res, next) => {
  const { user } = req;
  const userId = user?.id;

  try {
    const [rows]: [Thumb[], FieldPacket[]] = await promisePool.execute(
      `SELECT t.title, t.description, t.category_id, st.score
     FROM selected_thumbs st
     INNER JOIN thumbnails t ON st.thumb_id = t.id
     WHERE st.user_id = ?`,
      [userId],
    );

    // 2. 관련 동영상의 카테고리, title, description, score를 분석하여 추천 검색어를 생성
    const recommendations: Record<string, number> = {};

    rows.forEach((row: any) => {
      const categoryId: string = row.category_id;
      const { title } = row;
      const { description } = row;
      const { score } = row;

      // 카테고리 기반 추천어
      // if (categoryId) {
      //   recommendations[categoryId] = (recommendations[categoryId] || 0) + 1;
      // }

      // Title 기반 추천어
      if (title) {
        const words: string[] = splitStringAndRemoveEmoji(title);
        words.forEach((word: string) => {
          recommendations[word] = (recommendations[word] || 0) + 1;
        });
      }

      // Description 기반 추천어 (줄 바꿈 기준 및 구두점 제거)
      if (description) {
        const lines: string[] = description.split('\n');
        lines.forEach((line: string) => {
          const words: string[] = splitStringAndRemoveEmoji(line);
          words.forEach((word: string) => {
            recommendations[word] = (recommendations[word] || 0) + 1;
          });
        });
      }

      // Score 기반 추천어
      if (score >= 4) {
        recommendations.high_score = (recommendations.high_score || 0) + 1;
      } else if (score <= 2) {
        recommendations.low_score = (recommendations.low_score || 0) + 1;
      }
    });

    // 3. 추천 검색어를 생성
    const sortedRecommendations: string[] = Object.keys(recommendations)
      .sort((a, b) => recommendations[b] - recommendations[a])
      .slice(0, 3);

    res.json(sortedRecommendations);
  } catch (err) {
    next(err);
  }
};

export { select, recommendation };
