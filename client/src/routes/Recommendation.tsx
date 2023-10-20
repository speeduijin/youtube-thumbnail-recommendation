import React, { useState, useEffect } from 'react';
import { Link, useLoaderData, useOutletContext } from 'react-router-dom';
import axios from 'axios';

export const recommendationLoader = async () => {
  try {
    const response = await axios.get<string[]>('/user/recommendation');
    return response.data;
  } catch (error) {
    throw new Response();
  }
};

function Recommendation() {
  const recommendationData = useLoaderData() as string[];

  return (
    <div>
      <h1>추천 검색어</h1>
      <ul>
        {recommendationData.map((recommendation, index) => (
          <li key={index}>
            {/* 검색어 클릭 시 새 탭에서 유튜브 검색을 수행하도록 Link 컴포넌트 사용 */}
            <Link
              to={`https://www.youtube.com/results?search_query=${recommendation}`}
              target="_blank"
            >
              {recommendation}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendation;
