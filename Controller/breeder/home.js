const listRclone = require('#Controller/Utils/Rclone/List');
exports.getBreederHome = (req, res, next) => {
    console.log('Welcome to home page');
    //Test if rclone connectable
    //listRclone.listFilesRclone('')
    //.then(data => console.log(data))
    //.catch(error => console.error('Failed to list:', error.message))
    return res.render('breeder/index', {
            pageTitle: "Breeders",
            uploadStatus: "notUpload"
        }
    );
}