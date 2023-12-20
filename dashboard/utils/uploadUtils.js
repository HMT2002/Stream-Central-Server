import axios from 'axios';

const chunkFormData = (chunk, chunkIndex, chunkName, arrayChunkName, filename, ext) => {
  const formData = axios.toFormData({
    myMultilPartFileChunk: chunk,
    myMultilPartFileChunkIndex: chunkIndex,
    arraychunkname: arrayChunkName,
    filename: filename + '.' + ext,
  });
  return formData;
};
const uploadChunkDashVer2 = async (
  chunk,
  chunkIndex,
  chunkName,
  arrayChunkName,
  filename,
  ext,
  title,
  infoID,
  fullUploadURL
) => {
  try {
    const formData = chunkFormData(chunk, chunkIndex, chunkName, arrayChunkName, filename, ext);
    console.log(arrayChunkName);
    const responseDash = await POSTLargeVideoMultipartUploadDashActionVer2(
      formData,
      chunkIndex,
      chunkName,
      arrayChunkName,
      filename,
      ext,
      title,
      infoID,
      fullUploadURL
    );
    console.log(responseDash);
  } catch (error) {
    console.log(error);
  }
};
const uploadUtils = {
  uploadChunkDashVer2,
};

export default uploadUtils;
