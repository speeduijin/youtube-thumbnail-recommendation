import React, { useState, ChangeEvent, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Thumb from '../types/thumb';

interface P {
  thumbsData: Thumb[];
}

export const thumbsLoader = async () => {
  try {
    const res = await axios.get<Thumb[]>('/thumb/random');
    return res.data;
  } catch (error) {
    throw new Response();
  }
};

const ThumbSelector: FC<P> = ({ thumbsData }) => {
  const [selectedThumbIds, setSelectedThumbIds] = useState<number[]>([]);
  const [unselectedThumbIds, setUnselectedThumbIds] = useState<number[]>(
    thumbsData.map((thumb) => thumb.id),
  );

  const navigate = useNavigate();

  const handleThumbClick = (thumbId: number) => {
    const isThumbSelected = selectedThumbIds.includes(thumbId);

    if (isThumbSelected) {
      setSelectedThumbIds(selectedThumbIds.filter((id) => id !== thumbId));
      setUnselectedThumbIds([...unselectedThumbIds, thumbId]);
    } else {
      setSelectedThumbIds([...selectedThumbIds, thumbId]);
      setUnselectedThumbIds(unselectedThumbIds.filter((id) => id !== thumbId));
    }
  };

  const postThumb = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (selectedThumbIds.length !== 0) {
        navigate('/recommendation');
        await axios.post('/user/select', {
          selectedThumbIds: selectedThumbIds,
          unselectedThumbIds: unselectedThumbIds,
        });
      }
    } catch (error) {}
  };

  return (
    <section className="thumb-selector">
      <h1>이미지를 선택하세요</h1>
      <form onSubmit={postThumb}>
        <div className="thumb-list">
          {thumbsData.map((thumb) => (
            <label key={thumb.id} className="thumb-item">
              <input
                type="checkbox"
                onChange={() => handleThumbClick(thumb.id)}
                checked={selectedThumbIds.includes(thumb.id)}
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
