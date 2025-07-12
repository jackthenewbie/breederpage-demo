
const rclone = require('#Controller/Utils/Rclone/Rclone');
exports.listFilesRclone = (remotePath) => {
    const postData = JSON.stringify({
        fs: process.env.SRC_CLOUD,
        remote: ''
    });
    return rclone.Rclone(postData, '/operations/list')
}
