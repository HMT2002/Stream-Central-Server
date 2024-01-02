'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import Map from "../Maps/TestMap";
import { Server } from '../../types/server';
// without this the component renders on server and throws an error
import dynamic from 'next/dynamic';

import ServerModal from '../../components/SelectDropdown/SelectDropdown';
import { Button } from '../../components/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogOverlay,
} from '../../components/Dialog/Dialog';
import { Video } from '../../types/video';
import { GETAllInfoAction } from '../../APIs/transfer-apis';
import MovieItem from '../../components/movieItem/MovieItem';
import { videoItem } from '../../types/movieItem';

const MovieDashboard: React.FC = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [allFilmsInfoData, setAllFilmsInfoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState<string[]>([]);
  let selectingVideo: string[] = [];
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['allVideos'],
    queryFn: async () => {
      const response = await fetch('http://34.126.69.58/api/v1/video/');
      const jsonData = response.json();
      return jsonData;
    },
  });

  const allFilmsInfo = useQuery({
    queryKey: ['allFilmsInfo'],
    queryFn: async () => {
      const response = await fetch('http://34.126.69.58/api/v1/info/');
      const jsonData = response.json();
      return jsonData;
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setAllVideos(data.data.videos);
    }
    if (allFilmsInfo.data) {
      setAllFilmsInfoData(allFilmsInfo.data.data);
    }
  }, [data]);

  const videoSections = allFilmsInfoData.map((item) => {
    let video = new videoItem(
      item.filmInfo.name,
      item.filmInfo.first_air_date,
      item.filmInfo.poster_path,
      item.filmInfo.filmType,
      item.filmInfo._id
    );

    return <MovieItem video={video} />;
  });

  return (
    <>
      <div className="flex mb-5 gap-10 justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-white" variant={'default'}>
              ADD VIDEO INTO FILM
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-[700px] bg-black">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                {/* Make changes to your profile here. Click save when you're done. */}
                <div className="min-h-max grid grid-rows-3 grid-flow-col gap-4 overflow-y-auto">{videoSections}</div>
              </DialogDescription>
            </DialogHeader>
            <div>
              <div>{/* <ServerModal type="2" title="Choose your server" data={data.allVideos} /> */}</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* {data.videos &&
          data.videos.map((item: Video) => (
            <div>
              <p>Title: {item.title}</p>
              <p>Videoname: {item.videoname}</p>
            </div>
          ))} */}
        {allVideos.map((item: Video) => {
          return (
            <div
              className="w-full hover:cursor-pointer"
              onClick={() => {
                setSelectedVideo([...selectedVideo, item._id]);
              }}
            >
              <p>{item.title}</p>
              <p>{item.videoname}</p>
            </div>
          );
        })}
      </div>
      <br />
    </>
  );
};

export default MovieDashboard;
