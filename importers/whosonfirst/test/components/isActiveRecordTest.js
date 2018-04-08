var tape = require('tape');
var event_stream = require('event-stream');

var isActiveRecord = require('../../src/components/isActiveRecord');

function test_stream(input, testedStream, callback) {
    var input_stream = event_stream.readArray(input);
    var destination_stream = event_stream.writeArray(callback);

    input_stream.pipe(testedStream).pipe(destination_stream);
}

tape('isActiveRecord', function(test) {
  test.test('undefined/blank edtf:deprecated values should return true', function(t) {
    var input = [
      { properties: { 'edtf:deprecated': undefined } },
      { properties: { 'edtf:deprecated': '' } },
      { properties: { 'edtf:deprecated': ' \t ' } }
    ];
    var expected = [
      { properties: { 'edtf:deprecated': undefined } },
      { properties: { 'edtf:deprecated': '' } },
      { properties: { 'edtf:deprecated': ' \t ' } }
    ];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned true');
      t.end();
    });

  });

  test.test('undefined/non-array/zero-length wof:superseded_by should return true', function(t) {
    var input = [
      { properties: { 'wof:superseded_by': undefined } },
      { properties: { 'wof:superseded_by': 'this is not an array' } },
      { properties: { 'wof:superseded_by': [] } }
    ];
    var expected = [
      { properties: { 'wof:superseded_by': undefined } },
      { properties: { 'wof:superseded_by': 'this is not an array' } },
      { properties: { 'wof:superseded_by': [] } }
    ];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned true');
      t.end();
    });

  });

  test.test('properties without wof:superseded_by or edtf:deprecated or mz:is_current should return true', function(t) {
    var input = [
      { properties: { } }
    ];
    var expected = [
      { properties: { } }
    ];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned true');
      t.end();
    });

  });

  test.test('non-blank edtf:deprecated values should return false', function(t) {
    var input = [
      { properties: { 'edtf:deprecated': 'some value' } }
    ];
    var expected = [];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned true');
      t.end();
    });

  });

  test.test('non-zero-length wof:superseded_by array should return false', function(t) {
    var input = [
      { properties: { 'wof:superseded_by': [1, 2] } }
    ];
    var expected = [];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned false');
      t.end();
    });

  });

  test.test('mz:is_current 0 value should return false', function(t) {
    var input = [
      { properties: { 'mz:is_current': 0 } }
    ];
    var expected = [];

    test_stream(input, isActiveRecord.create(), function(err, actual) {
      t.deepEqual(actual, expected, 'should have returned false');
      t.end();
    });

  });

});
