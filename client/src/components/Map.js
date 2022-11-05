import React, { useState } from "react"
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api"
const google = window.google = window.google ? window.google : {}

const center = {
  lat: -27.47,
  lng: 153.026
}

function Map (props) {
  const google = window.google = window.google ? window.google : {}
  const [activeMarker, setActiveMarker] = useState(null)



  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return
    }
    setActiveMarker(marker)
  }

  async function searchCollect (id, description) {
    if (!props.searchID.includes(id)) {
      props.setSearchID(() => [...props.searchID, id])
      props.setSearchDescription(() => [...props.searchDescription, description])
    }
  }

  return (
    <GoogleMap
      zoom={12}
      center={center}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100%", height: "100%" }}
    >
      {props.markers == null ? <p>Loading</p> : props.markers.map(({ id, description, url, position }) => (
        <Marker
          key={id}
          position={position}
          onMouseOver={() => handleActiveMarker(id)}
          onClick={() => searchCollect(id, description)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>
                <div>{description}</div>
                <img src={url} />
              </div>

            </InfoWindow>
          ) : null}
        </Marker>
      ))
      }
    </GoogleMap >
  )
}

export default Map