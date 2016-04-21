module.exports = process.env.NODE_ENV === 'webpack' ? require('./dev') : require('./prod');
