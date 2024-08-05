import { Map, Marker, ZoomControl } from 'pigeon-maps'

export default function ReportMap({ marker }: {
  marker: {
    markerColor: string
    lat: number
    lng: number
  }
}) {
  const mapTiler = (x: number, y: number, z: number, _dpr?: number) => {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${z}/${x}/${y}@2x?access_token=pk.eyJ1IjoiamJodXRjaCIsImEiOiJjazMxcGthajMwOHVyM21vYmh5M3F4MG9zIn0.szsps_bAtin1myZ0Bi4rnQ`
  }

  return (
    <div className="size-full">
      <Map
        defaultCenter={[marker.lat, marker.lng]}
        minZoom={11}
        defaultZoom={17}
        provider={mapTiler}
        mouseEvents={false}
        touchEvents={false}
        attributionPrefix={(
          <span>
            Imagery ©
            {' '}
            <a
              style={{ color: 'rgb(0, 120, 168)', textDecoration: 'none' }}
              href="https://www.mapbox.com/"
            >
              Mapbox
            </a>
          </span>
        )}
      >
        <ZoomControl
          style={{ left: 'unset', right: 10, top: 10, zIndex: 100 }}
        />
        <Marker
          width={25}
          anchor={[marker.lat, marker.lng]}
          color={marker.markerColor || 'black'}
        />
      </Map>
    </div>
  )
}
