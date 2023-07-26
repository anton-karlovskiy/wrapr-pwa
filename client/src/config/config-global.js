module.exports = {
    publicUploadDev: false,
    newAnimatedBannerUrl: 'https://www.facebook.com/videowrapprofficial/videos/152377878980905/',
    acceptedUploadImageFiles: 'image/*',
    // TODO: confirm image upload limits for specific steps
    uploadImageMaxSize: 50000000,
    initialBackgroundSize: {
        width: 512,
        height: 360
    },
    acceptedUploadVideoFiles: 'video/*',
    uploadVideoMaxSize: 5000000000,
    headerFooterCountLimit: 3,
    // TODO: could be managed with database with upload module
    ttfFontListPathPrefix: './assets/fonts/',

    stripe: {
        publicKey: 'pk_test_WZ83WqUtiRIHQYl5r7VeXqui',
        currency: 'USD'
    },
    proxyUrl: 'http://localhost:3001',
};
