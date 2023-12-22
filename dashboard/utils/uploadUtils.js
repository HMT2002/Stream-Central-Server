import axios from 'axios';

const POSTLargeVideoMultipartUploadDashActionVer2 = async (
  formData,
  index,
  chunkName,
  arrayChunkName,
  filename,
  ext,
  title,
  infoID,
  fullUploadURL
) => {
  if (!formData) {
    return { status: 'fail' };
  }
  const { data } = await axios.post(fullUploadURL, formData, {
    validateStatus: () => true,
    headers: {
      type: 'blob',
      index: index,
      chunkname: chunkName,
      filename: filename,
      arrayChunkName,
      ext,
      title,
      infoID,
      // preferurl: '192.168.1.99',
      // preferport: ':9100',
    },
  });
  return data;
};

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
