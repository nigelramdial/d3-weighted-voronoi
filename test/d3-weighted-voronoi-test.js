var tape = require("tape"),
    d3WeightedVoronoi = require('../build/d3-weighted-voronoi');

tape("weightedVoronoi(...) should set the expected defaults", function(test) {
  var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
      datum = {x: 1, y: 2, weight: 3};

  test.equal(weightedVoronoi.x()(datum), 1);
  test.equal(weightedVoronoi.y()(datum), 2);
  test.equal(weightedVoronoi.weight()(datum), 3);
  test.deepEqual(weightedVoronoi.clip(), [[0,0], [0,1], [1,1], [1,0]]);
  test.end();
});

tape("weightedVoronoi.x(...) should set the specified x-accessor", function(test) {
  var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
      datum = {xPrime: 1, y: 2, weight: 3};

  test.equal(weightedVoronoi.x(function(d){ return d.xPrime; }), weightedVoronoi);
  test.equal(weightedVoronoi.x()(datum), 1);
  test.end();
});

tape("weightedVoronoi.y(...) should set the specified y-accessor", function(test) {
  var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
      datum = {x: 1, yPrime: 2, weight: 3};

  test.equal(weightedVoronoi.y(function(d){ return d.yPrime; }), weightedVoronoi);
  test.equal(weightedVoronoi.y()(datum), 2);
  test.end();
});

tape("weightedVoronoi.weight(...) should set the specified weight-accessor", function(test) {
  var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
      datum = {xPrime: 1, y: 2, weightPrime: 3};

  test.equal(weightedVoronoi.weight(function(d){ return d.weightPrime; }), weightedVoronoi);
  test.equal(weightedVoronoi.weight()(datum), 3);
  test.end();
});

tape("weightedVoronoi.clip(...) should set the adequate convex, hole-free, counterclockwise clipping polygon", function(test) {
  var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
      newClip = [[0,0], [0,1], [1,0], [1,1]];   //self-intersecting polygon

  test.equal(weightedVoronoi.clip(newClip), weightedVoronoi);
  test.deepEqual(weightedVoronoi.clip(), [[1,1], [1,0], [0,0], [0,1]]);
  test.end();
});

tape("weightedVoronoi.(...) should compute weighted voronoi diagram", function(test) {
    test.test("basic use case", function(test) {
      var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
          data = [{x: 0.25, y: 0.5, weight: 0},
                    {x: 0.75, y: 0.5, weight: 0.25}],
          cells = weightedVoronoi(data);

      test.equal(cells.length, 2);
      test.end();
    });

    test.test("on same sites, highest weight should overweight others sites", function(test) {
    var weightedVoronoi = d3WeightedVoronoi.weightedVoronoi(),
        s0 = {x: 0.5, y: 0.5, weight: 0.5},
        s1 = {x: 0.5, y: 0.5, weight: 2},
        s2 = {x: 0.5, y: 0.5, weight: 1}
        data = [s0, s1],
        cells = weightedVoronoi(data);

      test.equal(cells.length, 1);
      test.equal(cells[0].site.originalObject, s1)
      test.end();
    });
});