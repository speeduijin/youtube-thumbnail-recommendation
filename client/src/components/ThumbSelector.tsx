import React, { useState, ChangeEvent } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import Thumb from '../types/thumb';
import User from '../types/user';

export const thumbLoader = async () => {
  try {
    const response = await axios.get<Thumb[]>('/thumb/random');
    return response.data;
  } catch (error) {
    throw new Response();
  }
};

const ThumbSelector = () => {
  const thumbData = useLoaderData() as Thumb[];

  const userData = useOutletContext() as User;

  const [selectedThumbs, setSelectedThumbs] = useState<number[]>([]);

  const handleThumbClick = (thumbId: number) => {
    const isThumbSelected = selectedThumbs.includes(thumbId);

    if (isThumbSelected) {
      setSelectedThumbs(selectedThumbs.filter((id) => id !== thumbId));
    } else {
      setSelectedThumbs([...selectedThumbs, thumbId]);
    }
  };

  const postThumb = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post('/thumb/select', {
        thumbs: selectedThumbs,
        userData,
      });
    } catch (error) {}
  };

  return (
    <section className="thumb-selector">
      <h1>이미지 3개를 선택하세요</h1>
      <form onSubmit={postThumb}>
        <div className="thumb-list">
          {thumbData.map((thumb) => (
            <label key={thumb.id} className="thumb-item">
              <input
                type="checkbox"
                onChange={() => handleThumbClick(thumb.id)}
                checked={selectedThumbs.includes(thumb.id)}
              />
              <img
                src={`/thumbnails/${thumb.video_id}.jpg`}
                alt={`이미지 ${thumb.video_id}`}
              />
            </label>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default ThumbSelector;
