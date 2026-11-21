// The twelve differences of Lantern Cove. Each has a hit circle in panel
// coordinates (480x360) and a plain-words name the toast announces on a find.
// Levels chain them: Dusk asks for eight, Lanterns for ten, Night for all.

export const DIFFERENCES = {
  sun: { x: 70, y: 60, r: 30, name: 'the sun became a moon' },
  cloud: { x: 352, y: 50, r: 26, name: 'a little cloud drifted off' },
  bird: { x: 300, y: 70, r: 20, name: 'one bird flew away' },
  lantern: { x: 240, y: 118, r: 16, name: 'the middle lantern changed colour' },
  lamp: { x: 378, y: 106, r: 22, name: 'the lighthouse lamp went out' },
  stripe: { x: 378, y: 159, r: 22, name: 'the lighthouse stripe changed colour' },
  flag: { x: 84, y: 151, r: 16, name: 'the cottage flag turned around' },
  window: { x: 62, y: 219, r: 15, name: 'the cottage window went dark' },
  fruit: { x: 122, y: 203, r: 27, name: 'the tree lost its fruit' },
  sail: { x: 246, y: 214, r: 28, name: "the boat's sail grew stripes" },
  fish: { x: 152, y: 258, r: 17, name: 'the jumping fish dived away' },
  buoy: { x: 398, y: 247, r: 16, name: 'the buoy changed colour' },
};

export const LEVELS = [
  {
    name: 'Dusk Cove',
    blurb: 'Eight differences hide in the sunset.',
    diffs: ['sun', 'sail', 'window', 'stripe', 'bird', 'fish', 'flag', 'buoy'],
  },
  {
    name: 'Lantern Cove',
    blurb: 'Ten differences under the lantern string.',
    diffs: ['sun', 'sail', 'window', 'stripe', 'bird', 'fish', 'flag', 'buoy', 'lantern', 'fruit'],
  },
  {
    name: 'Harbor Night',
    blurb: 'All twelve differences, if your eyes hold out.',
    diffs: ['sun', 'cloud', 'bird', 'lantern', 'lamp', 'stripe', 'flag', 'window', 'fruit', 'sail', 'fish', 'buoy'],
  },
];
