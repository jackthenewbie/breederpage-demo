const rclone = require('#Controller/Utils/Rclone/Rclone');
exports.copyRclone = (srcRemote, dstRemote) => {
  const postData = JSON.stringify({
      srcFs: process.env.SRC_CLOUD,
      srcRemote: srcRemote,
      dstFs: process.env.DST_CLOUD,
      dstRemote: dstRemote
    });
  return rclone.Rclone(postData, '/operations/copyfile')
}
