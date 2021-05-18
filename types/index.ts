import { ReactNode } from 'react';

export type User = {
  id: number;
  name: string;
};

export type NavItem = {
  link: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
};

type GaugeLocation = {
  lat: number;
  lon: number;
};

export type Gauge = {
  data_source: string;
  id: string;
  last_updated: string;
  location: GaugeLocation;
  name: string;
  region: string;
  river_name: string;
};
