function StaticComponentEnveloper(options) {}

StaticComponentEnveloper.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // Create a header string for the generated file:
    var filelist = 'In this build:\n\n';

    // Loop through all compiled assets,
    // adding a new line item for each filename.
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n');
    }

    console.log('RUNNING PLUGIN');
    console.log(filelist);


    callback();
  });
};

module.exports = StaticComponentEnveloper;
