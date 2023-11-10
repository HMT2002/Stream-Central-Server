import React from 'react';
import logo from '../../assets/img/ben10.jpg';
import Button from '../UI elements/Button';

const MovieItem = (props) => {
  console.log(props.video);
  const video = props.video;
  return (
    <div className=" w-60 shadow-lg hover:shadow-2xl text-sm">
      <img src={video.img != null ? video.img : './logo'} alt="video-image" />
      <div className="px-3 pt-1 pb-5 bg-white">
        <div className="flex ">
          <p className="mr-5">{video.release_date != null ? video.release_date : '2023'}</p>
          <p>{video.type != null ? video.type : 'Movie'}</p>
        </div>
        <p className="font-semibold ">{video.title != null ? video.title : 'Ben 10: Alien Force'}</p>
        <Button className="bg-red-400 w-full rounded-sm py-1" content="Watch now" />
      </div>
    </div>
  );
};

export default MovieItem;
