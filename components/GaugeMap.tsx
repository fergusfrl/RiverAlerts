import React, { ReactElement, useState } from 'react';
import ReactMapboxGL, { Cluster, Marker, ZoomControl } from 'react-mapbox-gl';

import { Gauge } from '../types';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import PlaceIcon from '@material-ui/icons/Place';

const useStyles = makeStyles((theme) => ({
  cluster: {
    position: 'fixed',
    top: 0,
    cursor: 'pointer',
    borderRadius: '50%',
    minWidth: 30,
    minHeight: 30,
    maxWidth: 70,
    maxHeight: 70,
    backgroundColor: '#193E60',
    opacity: 0.7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #666F78',
  },
  mapMarker: {
    cursor: 'pointer',
    position: 'fixed',
    top: 0,
  },
  pinLabel: ({ satellite }: { satellite: boolean }) => ({
    position: 'absolute',
    margin: '-31px 0 0 25px',
    maxWidth: 300,
    fontWeight: 'bold',
    WebkitTextStroke: satellite ? '1px black' : '1px white',
    color: satellite ? 'white' : 'black',
  }),
  formControl: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(9),
    },
  },
  switchLabel: ({ satellite }: { satellite: boolean }) => ({
    color: satellite ? 'white' : 'black',
  }),
  zoomControl: {
    margin: theme.spacing(0, 1, 8, 0),
  },
}));

const Map = ReactMapboxGL({
  accessToken:
    'pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww',
});

type Props = {
  gauges: Gauge[];
};

const GaugeMap = ({ gauges }: Props): ReactElement => {
  const [satellite, setSatellite] = useState(false);
  const [center, setCenter] = useState<[number, number]>([172.186, -41.1]);
  const [zoom, setZoom] = useState(4.5);
  const [pitch, setPitch] = useState(0);
  const classes = useStyles({ satellite });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  // react-mapbox-gl does not include types
  const handleZoom = (mapConfig: any): void => {
    setZoom(mapConfig.getZoom());
    setCenter(mapConfig.getCenter());
  };

  // react-mapbox-gl does not include types
  const handlePitch = (mapConfig: any): void => {
    setPitch(mapConfig.getPitch());
    setCenter(mapConfig.getCenter());
  };

  const marker = (gauge: Gauge, index: number): ReactElement => (
    <Marker
      key={index}
      className={classes.mapMarker}
      coordinates={[gauge.location.lon, gauge.location.lat]}
      onClick={() => console.log('CLICKITY CLANCK')}
    >
      <>
        <PlaceIcon color="primary" />
        <Typography color="primary" noWrap className={classes.pinLabel}>
          {gauge.name}
        </Typography>
      </>
    </Marker>
  );

  const clusterMarker = (coordinates: [number, number], pointCount: number): ReactElement => {
    const size = pointCount * zoom + 15;
    return (
      <Marker
        key={`map-cluster-lat=${coordinates[1]}lon=${coordinates[0]}`}
        className={classes.cluster}
        coordinates={coordinates}
        style={{ width: size, height: size }}
      >
        <Typography style={{ color: 'white' }}>{pointCount}</Typography>
      </Marker>
    );
  };

  return (
    <Map
      style={
        satellite
          ? 'mapbox://styles/mapbox/satellite-streets-v9'
          : 'mapbox://styles/mapbox/streets-v11'
      }
      zoom={[zoom]}
      pitch={[pitch]}
      center={center}
      onZoomEnd={handleZoom}
      onPitchEnd={handlePitch}
      containerStyle={{
        position: 'fixed',
        right: 0,
        height: '100vh',
        width: `calc(100vw - ${matches ? 0 : 453}px)`,
      }}
    >
      <>
        <Cluster
          zoomOnClick
          zoomOnClickPadding={70}
          radius={70}
          ClusterMarkerFactory={clusterMarker}
        >
          {gauges.map((gauge, index) => marker(gauge, index))}
        </Cluster>
        <FormControlLabel
          className={classes.formControl}
          control={
            <Switch
              color="secondary"
              checked={satellite}
              onChange={() => setSatellite(!satellite)}
            />
          }
          label={<Typography className={classes.switchLabel}>Satellite</Typography>}
        />
        {!matches && (
          <ZoomControl zoomDiff={1.3} position="bottom-right" className={classes.zoomControl} />
        )}
      </>
    </Map>
  );
};

export default GaugeMap;
