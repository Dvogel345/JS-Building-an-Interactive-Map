// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 10,
		});

		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '14',
		}).addTo(this.map)
		
		// create and add geolocation marker
		const greenIcon = L.marker(this.coordinates)
		greenIcon.addTo(this.map).bindPopup('<p1><b>Here I am!</b><br></p1>').openPopup()
	},

	// add business markers
	addMarkers() {
		for (let i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}


// get coordinates via geolocation api
async function getCoords(){
	const position = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [position.coords.latitude, position.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
	
let clientId = 'UYR55FVRBH5JQXIGPA0N0KJLOTZFKWBJ2TLWT4CZK5ZHIBIL'
	let clientSecret = 'XWFPKGLXI11JS2E0QSWK3IGL3IFQDXIBPJ3RRIP2JX4JWHXS'
	let limit = 5;
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(
			`https://api.foursquare.com/v3/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20211120&limit=${limit}&ll=${lat},${lon}&query=${business}`, {
				method: "GET",
				headers: {
					"Accept": "application/json", 
				},
				body: JSON.stringify()
			}
		);
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.response.groups[0].items
	return businesses
}

// foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
		name: element.venue.name,
		lat: element.venue.location.lat,
		long: element.venue.location.lng,
		};
		return location
	})
	return businesses
}

// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// submit button for getting businesses
document.getElementById('submit')
addEventListener('click', (event) => {
	console.log("this is working");
	business = document.getElementById('business').value
	data = getFoursquare(business)		
	event.preventDefault()
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
	
