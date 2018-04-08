var geonames = require('geonames-stream');
var dbclient = require('pelias-dbclient');
var model = require( 'pelias-model' );

var featureCodeFilterStream = require('../streams/featureCodeFilterStream');
var adminLookupStream = require('pelias-wof-admin-lookup');
var layerMappingStream = require( '../streams/layerMappingStream');
var peliasDocGenerator = require( '../streams/peliasDocGenerator');
var overrideLookedUpLocalityAndLocaladmin = require('../streams/overrideLookedUpLocalityAndLocaladmin');

module.exports = function( sourceStream, endStream ){
  endStream = endStream || dbclient();

  return sourceStream.pipe( geonames.pipeline )
    .pipe( featureCodeFilterStream.create() )
    .pipe( layerMappingStream.create() )
    .pipe( peliasDocGenerator.create() )
    .pipe( adminLookupStream.create() )
    .pipe( overrideLookedUpLocalityAndLocaladmin.create() )
    .pipe(model.createDocumentMapperStream())
    .pipe( endStream );
};
