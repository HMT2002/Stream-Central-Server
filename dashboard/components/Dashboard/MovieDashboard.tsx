"use client";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { useQuery } from "@tanstack/react-query";
// import Map from "../Maps/TestMap";
import { Server } from "../../types/server";
// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../Dialog/Dialog";
import ServerModal from "../SelectDropdown/SelectDropdown";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const MovieDashboard: React.FC = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await fetch("http://localhost:9000/api/v1/server");
      const jsonData = response.json();
      return jsonData;
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <div className="flex mb-5 gap-10">
        <Dialog>
          <DialogTrigger asChild>
            <button>BUTTON 1</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                {/* Make changes to your profile here. Click save when you're done. */}
              </DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <ServerModal
                  type="1"
                  title="Choose your server"
                  data={data.servers}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <button>BUTTON 2</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                {/* Make changes to your profile here. Click save when you're done. */}
              </DialogDescription>
            </DialogHeader>
            <div>
              <div>
                <ServerModal
                  type="2"
                  title="Choose your server"
                  data={data.servers}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {data.servers.map((item: Server) => (
          <div>
            <p>URL: {item.URL}</p>
            <p>Average Speed: {item.avarageSpeed?.toString()}</p>
            <p>Number of request: {item.numberOfRequest}</p>
            <p>Occupy: {item.occupy}</p>
            <p>Occupy Percentage: {item.occupyPercentage}</p>
            <p>Port: {item.port}</p>
            <p>Storage: {item.storage}</p>
          </div>
        ))}
      </div>
      <br />
      {data.servers.map((server: Server) => {
        return (
          <div>
            <br />
            <TableOne data={server} />
            <br />
          </div>
        );
      })}
    </>
  );
};

export default MovieDashboard;
