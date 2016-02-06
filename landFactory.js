angular.module('app')
	.factory('landFactory', [function() {
		// note : I assume that the map is always square.
		// Okay, so first we go and we go through and we identify everything that's on fire.  We push that all to an array that we're going to
		// test.  Once we have that array, we go through and if it's at one, we increment its fireStatus.  If its at two, we burn all of its neighbors

		var ROWLENGTH = 9
		var ROWHEIGHT = 9

		var Tile = (function() {
			var tiles = [];


			function TileConstructor (name,flammable, map) { // name is the name, flammable is true or false
				this.name = name;
				this.flammable = flammable;
				this.fireStatus = null; //null is it hasn't been tested yet, 0 is it can't burn, 1 is it's starting to burn, 2 is it's full red
				tiles.push(this);
				this.neighbors = setNeighbors.call(this)
				this.map = map;
			}

			TileConstructor.prototype.burn = function () { // tests the terrain type to see if it's flammible, and if it is, 
				if (this.flammable === false) {
					this.fireStatus = 0;
				} else if (this.fireStatus === null || this.fireStatus === 1 || this.fireStatus === 2) {
					this.fireStatus++
					enflameNeighbors.call(this)
				} else {
					enflameNeighbors.call(this)
				}
			}

			function enflameNeighbors() {
				this.neighbors.forEach(function(cur) {
					if (tiles[cur].flammable === true && tiles[cur].fireStatus === null) {
						tiles[cur].fireStatus = 1
					}
				})
			}


			function setNeighbors () {
				var index = tiles.indexOf(this);
				var rowLength = ROWLENGTH;
				var neighbors = [];
				if ( index - rowLength > -1 )
					neighbors.push(index - rowLength)
				if (index + rowLength < rowLength * ROWHEIGHT)
					neighbors.push(index + rowLength)
				if (index % rowLength !== 0)
					neighbors.push(index-1)
				if ((index + 1) % rowLength !== 0)
					neighbors.push(index + 1)
				return neighbors;
			}

			return TileConstructor;
		})()


		var Map = ( function () {

			function MapConstructor (contentsArray, width) {
				this.contents = contentsArray;
				this.width = width;
				this.burnEvent = burnEvent;
				this.counter = 0;
			}

			function burnEvent () {
				var toBurn = findFlames.call(this);
				//console.log(toBurn);
				toBurn.forEach( function(cur) {
					cur.burn()
				})
				this.counter = (this.counter + 1) % 2;
				//console.log(this.counter)
			}

			MapConstructor.prototype.addTile = function(name,flammable,map) {
				this.contents.push(new Tile(name,flammable,this.contents))
			}

			MapConstructor.prototype.getByIndex = function(index) {
				return this.contents[index]
			}

			function findFlames () {

				return this.contents.filter(function(cur) {
					if (this.counter === 0) {
						return cur.fireStatus
					} else {
						return cur.fireStatus === 1
					}
				}, this)
			}

			return MapConstructor
		})()


		var land = ['Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees','Grass','Shrubs','Trees']

		var map = new Map([], 9);
		land.forEach(function(cur) { map.addTile(cur , true, map ) })
		//console.log(map.contents[80].neighbors)
		//map.contents[55].fireStatus = 1;
		//map.burnEvent.call(map)
		//map.burnEvent.call(map)

		return {
			map : map
		}

	}])

	// If it's flammable, this if it's at 0 or 1 assign to 