exports.getBreederHome = (req, res, next) => {
    console.log('Welcome to home page');
        return res.render('breeder/index', {
                pageTitle: "Breeders"
            }
        );
}