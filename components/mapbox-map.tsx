import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// импортируем стили mapbox-gl чтобы карта отображалась коррекно

interface MapboxMapProps {
  initialOptions?: Omit<mapboxgl.MapboxOptions, "container">;
  onCreated?(map: mapboxgl.Map): void;
  onLoaded?(map: mapboxgl.Map): void;
  onRemoved?(): void;
}

function MapboxMap({
  initialOptions = {},
  onCreated,
  onLoaded,
  onRemoved,
}: MapboxMapProps) {
  const [map, setMap] = useState<mapboxgl.Map>();
  const [lngLat, setLngLat] = useState<string>();
  const mapNode = useRef(null);

  useEffect(() => {
    const node = mapNode.current;

    if (typeof window === "undefined" || node === null) return;

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/navigation-day-v1",
      zoom: 9,
      ...initialOptions,
    });

    setMap(mapboxMap);

    if (onCreated) onCreated(mapboxMap);
    if (onLoaded) mapboxMap.once("load", () => onLoaded(mapboxMap));
    return () => {
      mapboxMap.remove();
      setMap(undefined);
      if (onRemoved) onRemoved();
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.on("mousemove", (e) => {
        setLngLat(JSON.stringify(e.lngLat.wrap()));
      });
    }
  });

  useEffect(() => {
    if (map) {
      map.on("load", () => {
        map.loadImage(
          "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
          (error, image) => {
            if (error) throw error;
            if (image) {
              console.log("neHUI");
              map.addImage("custom-marker", image);
            } else console.log("HUI");

            map.addSource("points", {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [27.55238901390978, 53.913188059745586],
                    },
                    properties: {
                      title: "Mapbox DC",
                    },
                  },
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [27.4327, 53.8967],
                    },
                    properties: {
                      title: "Lobanka",
                    },
                  },
                ],
              },
            });

            map.addLayer({
              id: "points",
              type: "symbol",
              source: "points",
              layout: {
                "icon-image": "custom-marker",
                "text-field": ["get", "title"],
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 1.25],
                "text-anchor": "top",
              },
            });
          }
        );
      });
    }
  }, [map]);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          minHeight: "30px",
          zIndex: 1,
          backgroundColor: "white",
        }}
      >
        {lngLat}
      </div>
      <div
        ref={mapNode}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
      />
    </div>
  );
}

export default MapboxMap;
