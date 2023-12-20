"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../Select/Select";
import { Server } from "../../types/server";
import { Video } from "../../types/video";
import { RadioGroup, RadioGroupItem } from "../RadioGroup/RadioGroup";
import { Label } from "@radix-ui/react-select";
const ServerModal = ({
  data,
  title,
  type,
}: {
  data?: Server[];
  title?: string;
  type?: string;
}) => {
  const [server, setServer] = useState<Server | null>(null);
  const [videosOfServer, setVideosOfServer] = useState<Video[] | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="flex gap-3 flex-col max-w-max">
          <Select
            onValueChange={(value) => {
              // alert((value as Server).URL);
              setServer(value as Server);
              setVideosOfServer((value as Server).videos ?? null);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={title} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Servers</SelectLabel>
                {data?.map((item) => (
                  <SelectItem className="min-w-full" value={item ?? ""}>
                    <div>{item.URL}</div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {videosOfServer === null ? (
            <div></div>
          ) : (
            <div className="">
              <Select
                onValueChange={(value) => {
                  if (value) setSelectedVideo(value as Video);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select your videos" />
                </SelectTrigger>
                <SelectContent className="overflow-y-auto max-h-40 h-max">
                  <SelectGroup>
                    <SelectLabel>Videos</SelectLabel>
                    {videosOfServer.map((videoItem: Video) => (
                      <SelectItem value={videoItem ?? ""}>
                        {videoItem.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {type === "2" && (
          <div>
            <RadioGroup defaultValue="first_fit">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first_fit" id="r1" />
                <label htmlFor="r1">First Fit</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="best_fit" id="r2" />
                <label htmlFor="r2">Best Fit</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight_allocate" id="r3" />
                <label htmlFor="r3">Weight Allocate</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual_choose" id="r4" />
                <label htmlFor="r4">Manual Choose</label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
      <div className="text-center my-5">
        <button>Start</button>
      </div>
    </div>
  );
};

export default ServerModal;
