'use strict';
module.exports = (app) => {

  const geojson2h3 = require('geojson2h3')

  const getDistanceBetween = (lat1, lon1, lat2, lon2, unit) => {
    //https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}

  app.route('/').get((req, res) => {
    res.json(`Welcome to the h3 api`)
  })
  
  //http://bboxfinder.com/#0.000000,0.000000,0.000000,0.000000
  //http://localhost:4040/binsforbb/1/-125.722,26.784/-52.735,52.041
  app.route('/binsforbb/:resolution/:southwest/:northeast').get((req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    //get points for a rectangle bounding box polygon
    let southWestArr = req.params.southwest.split(',')
    let northEastArr = req.params.northeast.split(',')

    let northWestArr = [southWestArr[0], northEastArr[1]]
    let southEastArr = [northEastArr[0], southWestArr[1]]

    // make a ---------
    //        -       -
    //        -       -
    //        ---------
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          northWestArr.map(northWest => Number(northWest)),
          southWestArr.map(southWest => Number(southWest)),
          southEastArr.map(southEast => Number(southEast)),
          northEastArr.map(northEast => Number(northEast)),
          northWestArr.map(northWest => Number(northWest)),
        ]]
      }
    }

    const resolution = parseInt(req.params.resolution)
    
    const distance = getDistanceBetween(southWestArr[1], southWestArr[0], northEastArr[1], northEastArr[0], "M")
    //console.log('distance', distance)

    if(resolution > 4 && distance > 400) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 5 && distance > 220) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 6 && distance > 55) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 7 && distance > 45) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 8 && distance > 35) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 9 && distance > 25) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 10 && distance > 15) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 11 && distance > 10) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 12 && distance > 5) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 13 && distance > 2.5) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 14 && distance > .5) {
      res.json('Area too large for resolution.')
    }
    else if(resolution > 15) {
      res.json('Area too large for resolution.')
    }
    else {
      const hexagons = geojson2h3.featureToH3Set(polygon, resolution)
      const featureCollection = geojson2h3.h3SetToFeatureCollection(hexagons)
      res.json(featureCollection)
    }

  })
}
