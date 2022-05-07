/**
 * @desc 
 */
const { createProxyMiddleware } = require('http-proxy-middleware')


const createProxy = (url = '', target = '') =>
    createProxyMiddleware(url, {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${url}`]: '',
        },
    })



/**
 * 
 */
module.exports = function (app) {
    app.use(
        createProxy('/api', `http://13.214.198.186:6000/api/`),//
        // createProxy('/api', `http://47.241.253.161:5000/api/`),//
    )
}


