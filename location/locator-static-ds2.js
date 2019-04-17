/**
 * @extends PlaceLocator.StaticDataFeed
 * @constructor
 */
function PlaceDataSource() {
  $.extend(this, new PlaceLocator.StaticDataFeed);
  /*  
  Get data from mysql 
   */
  var that = this;
  $.get('address.php', function(data) {
   // console.log(that.parse_(data));
    that.setPlace(that.parse_(data));
  });
}

//place
/**
 * @const
 * @type {!PlaceLocator.FeatureSet}
 * @private
 */

PlaceDataSource.prototype.FEATURES_ = new PlaceLocator.FeatureSet( 
);

/**
 * @return {!PlaceLocator.FeatureSet}
 */
PlaceDataSource.prototype.getFeatures = function() {
  return this.FEATURES_;
};

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!PlaceLocator.place>}
 */
PlaceDataSource.prototype.parse_ = function(csv) {
  var places = [];
  var rows = csv.split('\n');
  var headings = this.parseRow_(rows[0]);

  for (var i = 1, row; row = rows[i]; i++) {
    row = this.toObject_(headings, this.parseRow_(row));  
   //console.log(row);   
    var features = new PlaceLocator.FeatureSet;  
    var position = new google.maps.LatLng(row.Xcoord, row.Ycoord);
    //console.log(position);    
    var shop = row.address; 
    var place = new PlaceLocator.place(row.id, position, features, {
      title: row.place_name,
      address: this.join_([shop], '<br>'),
    });
    places.push(place);    
  }
 return places;
};

/**
 * Joins elements of an array that are non-empty and non-null.
 * @private
 * @param {!Array} arr array of elements to join.
 * @param {string} sep the separator.
 * @return {string}
 */
PlaceDataSource.prototype.join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};

/**
 * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
 * IMPORTANT: Don't use this for general CSV parsing!
 * @private
 * @param {string} row
 * @return {Array.<string>}
 */
PlaceDataSource.prototype.parseRow_ = function(row) {
  // Strip leading quote.
  if (row.charAt(0) == '"') {
    row = row.substring(1);
  }
  // Strip trailing quote. There seems to be a character between the last quote
  // and the line ending, hence 2 instead of 1.
  if (row.charAt(row.length - 2) == '"') {
    row = row.substring(0, row.length - 2);
  }

  row = row.split('","');

  return row;
};

/**
 * Creates an object mapping headings to row elements.
 * @private
 * @param {Array.<string>} headings
 * @param {Array.<string>} row
 * @return {Object}
 */
PlaceDataSource.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0, ii = row.length; i < ii; i++) {
    result[headings[i]] = row[i];
  }
  return result;
};
