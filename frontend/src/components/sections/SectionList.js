import React from 'react';

import Section from './Section';
import MovieItem from '../movieItem/MovieItem.jsx';
import { videoItem } from '../movieItem/movieItem.js';

const SectionList = (props) => {
  const sections = props.labels.map((label) => {
    let threadsPerTag = [];
    props.threads.map((thread) => {
      if (thread.tag === label) threadsPerTag = [...threadsPerTag, thread];
      return thread;
    });
    return <Section key={props.labels.indexOf(label).toString()} tag={label} threadsByTag={threadsPerTag} />;
  });

  const videoSections = props.threads.map((thread) => {
    console.log(thread);
    let video = new videoItem(
      thread.filmInfo.name,
      thread.filmInfo.first_air_date,
      thread.filmInfo.poster_path,
      thread.filmType
    );

    return <MovieItem video={video} />;
  });

  return (
    <React.Fragment>
      <ul className="centered">{videoSections}</ul>
    </React.Fragment>
  );
};

export default SectionList;
