const Server = require('./../models/mongo/Server');
const Video = require('./../models/mongo/Video');

const getAvailableServer = async () => {
    const servers = await Server.find({});
    return servers;
  };

  const getAvailableVideo = async (videoname,type) => {
    const availVideo = await Video.findOne({ videoname: videoname, type: type });
    return availVideo;
  };


  module.exports = {getAvailableVideo };
