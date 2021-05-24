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

type Observables = {
  latest_value: number;
  type: 'flow' | 'stage_height';
  units: 'cumecs' | 'meters';
};

export type Gauge = {
  [key: string]: any;
  data_source: string;
  id: string;
  last_updated: string;
  location: GaugeLocation;
  name: string;
  region: string;
  river_name: string;
  observables: Observables[];
};

export type GroupedGauges = {
  [key: string]: Gauge[];
};

type RiverGroup = {
  river: string;
  gauges: Gauge[];
};

export type RegionGroup = {
  region: string;
  rivers: RiverGroup[];
};

export type Reading = {
  stage_height?: number;
  flow?: number;
  time: string;
};

export type GaugeData = {
  id: string;
  last_updated: string;
  name: string;
  flows: Reading[];
};
