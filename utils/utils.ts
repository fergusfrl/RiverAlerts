import { Gauge, GroupedGauges, RegionGroup } from '../types';

type Tmp = {
  region: string;
  rivers: GroupedGauges;
};

const reduceToGroup = (arr: Gauge[], targetVal: string): GroupedGauges =>
  arr.reduce((acc: GroupedGauges, curr: Gauge): GroupedGauges => {
    if (!(curr[targetVal] in acc)) {
      acc[curr[targetVal]] = [];
    }
    acc[curr[targetVal]].push(curr);
    return acc;
  }, {});

/**
 * Takes the full list of gauges and groups then by river and by region.
 *
 * @param gauges
 * @returns RegionGroup[] an array of regions with river and gauge info
 */
export const groupByRegionAndRiver = (gauges: Gauge[]): RegionGroup[] => {
  const regions = reduceToGroup(gauges, 'region');

  const gaugeRivers: Tmp[] = Object.keys(regions).map(
    (region: string): Tmp => ({
      region,
      rivers: reduceToGroup(regions[region], 'river_name'),
    })
  );

  const test_test = gaugeRivers
    .map(
      (region: Tmp): RegionGroup => ({
        ...region,
        rivers: Object.keys(region.rivers)
          .map((riverName: string) => ({
            river: riverName,
            gauges: [...region.rivers[riverName].sort((a, b) => ((a.name, b.name) ? 1 : -1))],
          }))
          .sort((a, b) => (a.river > b.river ? 1 : -1)),
      })
    )
    .sort((a, b) => (a.region > b.region ? 1 : -1));

  return test_test;
};
