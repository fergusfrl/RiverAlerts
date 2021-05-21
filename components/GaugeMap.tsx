import React, { ReactElement } from 'react';
import ReactMapboxGL from 'react-mapbox-gl';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Map = ReactMapboxGL({
  accessToken:
    'pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww',
});

const GaugeMap = (): ReactElement => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Map
      style="mapbox://styles/mapbox/satellite-streets-v9"
      zoom={[5]}
      pitch={[0]}
      center={[172.186, -41.1]}
      containerStyle={{
        position: 'fixed',
        right: 0,
        height: '100vh',
        width: `calc(100vw - ${matches ? 0 : 453}px)`,
      }}
    />
  );
};

export default GaugeMap;
