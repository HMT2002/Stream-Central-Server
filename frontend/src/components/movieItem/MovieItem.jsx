import React from 'react';
import logo from '../../assets/img/ben10.jpg';

const MovieItem = () => {
  return (
    <div className="w-48 shadow-lg hover:shadow-2xl">
      <img src={logo} alt="ben-10-image" />
      <div className="px-3 pt-1 pb-5 bg-white">
        <div className="flex ">
          <p className="mr-5">2023</p>
          <p>Movie</p>
        </div>
        <p className="font-semibold">Ben 10: Alien Force</p>
      </div>
    </div>
  );
};

export default MovieItem;
