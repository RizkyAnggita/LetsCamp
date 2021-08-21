mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker({
    color: 'green'
})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup()
            .setHTML(
                `<h3>${campground.title}</h3>
                <p>${campground.location}</p>
                `
            )
    )
    .addTo(map);