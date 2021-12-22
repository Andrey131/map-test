import type { NextPage } from "next";
import Head from "next/head";
import MapboxMap from "../components/mapbox-map";
import { useState } from "react";
import MapLoadingHolder from "../components/map-loading-holder";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const handleMapLoading = () => setLoading(false);

  return (
    <div>
      <Head>
        <title>MAP</title>
        <meta name="MAPMAPMAPMAP" content="MAP-MAP-MAP-MAP-MAP" />
      </Head>
      <div className="app-container">
        <div className="map-wrapper">
          <MapboxMap
            initialOptions={{ center: [27.555, 53.9] }}
            onLoaded={handleMapLoading}
          />
        </div>
        {loading && <MapLoadingHolder />}
      </div>
    </div>
  );
};

export default Home;
