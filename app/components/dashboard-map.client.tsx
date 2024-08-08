import * as React from 'react'
import { Map, Marker, Overlay, ZoomControl } from 'pigeon-maps'
import { Link } from 'react-aria-components'
import dayjs from 'dayjs'
import { Icon } from './ui/icon'
import type { RouterOutput } from '#/utils/trpc/routers'
import { cx } from '#/utils/cva.config'

export default function DashboardMap({ markers }: { markers: RouterOutput['reports']['getAll'] }) {
  const mapTiler = (x: number, y: number, z: number, _dpr?: number) => {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/${z}/${x}/${y}@2x?access_token=pk.eyJ1IjoiamJodXRjaCIsImEiOiJjazMxcGthajMwOHVyM21vYmh5M3F4MG9zIn0.szsps_bAtin1myZ0Bi4rnQ`
  }

  const [activePopup, setActivePopup] = React.useState<RouterOutput['reports']['getAll'][number] | null>(null)

  return (
    <div className="size-full">
      <Map
        defaultCenter={[42.886, -78.879]}
        minZoom={11}
        defaultZoom={13}
        provider={mapTiler}
        twoFingerDrag
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
        {activePopup
          ? (
              <Overlay
                anchor={[activePopup.lat, activePopup.lng]}
                offset={[144, 0]}
                className="z-10"
              >
                <div className="w-72 rounded-lg border-t-8 bg-white p-4 shadow-xl" style={{ borderTopColor: activePopup.reportType.markerColor }}>
                  <div className={cx('mb-3 flex items-center gap-1', activePopup.status === 'CREATED' ? 'text-green-700' : 'text-red-700')}>
                    <Icon name={activePopup.status === 'CREATED' ? 'lock-open-outline' : 'lock-outline'} size={5} />
                    <span className="text-sm font-medium">
                      {activePopup.status === 'CREATED' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="mb-0.5">
                    <span className="text-sm text-gray-500">
                      {' '}
                      #
                      {activePopup.id}
                      {' '}
                      • Opened
                      {' '}
                      {dayjs(activePopup.createdAt).format('MMM D, YYYY')}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="font-medium text-black">
                      {activePopup.reportType.group}
                      {' '}
                      -
                      {' '}
                      {activePopup.reportType.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Icon name="location-on-outline" size={5} />
                      <span className="text-sm">
                        {' '}
                        {activePopup.lat.toFixed(3)}
                        ,
                        {' '}
                        {activePopup.lng.toFixed(3)}
                      </span>
                    </div>
                    <Link className="text-sm font-medium text-blue-700 underline" href={`/reports/${activePopup.id}`}>View Report</Link>
                  </div>
                </div>
              </Overlay>
            )
          : null }
        {markers.map(m => (
          <Marker
            key={m.id}
            width={25}
            anchor={[m.lat, m.lng]}
            color={m.reportType.markerColor}
            onClick={() => setActivePopup(m)}
          />
        ))}
      </Map>
    </div>
  )
}
