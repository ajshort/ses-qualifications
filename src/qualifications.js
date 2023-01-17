import moment from 'moment';

/**
 * Analyse qualifications to create an operator profile.
 */
export function analyse(codes) {
  function or(...args) {
    if (args.some(x => x === 'YES')) {
      return 'YES';
    } else if (args.some(x => x === 'EXPIRED')) {
      return 'EXPIRED';
    } else {
      return 'NO';
    }
  }

  function and(...args) {
    if (args.every(x => x === 'YES')) {
      return 'YES';
    } else if (args.every(x => x === 'YES' || x === 'EXPIRED')) {
      return 'EXPIRED';
    } else {
      return 'NO';
    }
  }

  function has(code) {
    return codes.has(code) ? 'YES' : 'NO';
  }

  function current(code, years) {
    const found = codes.get(code);

    if (found === undefined) {
      return 'NO';
    } else if (moment(found).add(years, 'years').isBefore()) {
      return 'EXPIRED';
    } else {
      return 'YES';
    }
  }

  // All of these qualifications combine, so calculate them here.
  const operateCommsEquipment = has('PUAOPE013');
  const beaconField = has('BEF001');
  const introAiims = has('AIP002');
  const tsunamiAwareness = has('TSU002');

  const stormGround = or(has('SDC001'), has('SDG003C'), has('PUASES008A'));
  const stormHeights = or(has('SDH003C'), has('PUASES013A'));
  const chainsawCrossCut = has('CSC003');

  const landBased = or(has('FR1001'), has('PUASAR033'), has('PUASAR001'))
  const floodBoat = or(has('BMC004'), has('PUASES009A'), has('IRB001'));
  const inWater = or(has('FR3001'), has('PUASAR034'), has('PUASAR002'));

  const piaro = or(has('PRC001'), has('PRC002'), has('PUASAR001A'));
  const usar = has('USC002');
  const verticalRescue = or(has('VRC003'), has('VRC004'));

  const landSearch = has('LSC004');
  const mapAndNav = or(has('NVC003'), has('NVC004'));

  const leadershipFundamentals = has('LFC003');
  const fieldTeamLeader = has('FTL002');

  // Fitness / currency requirements.
  const verticalRescueFitness = 'NO';

  // Build up field course pre-reqs and operator status.
  const jobReady = 'YES';
  const foundation = and(jobReady, 'YES');
  const stormGroundOrPiaroOrLandSearch = or(stormGround, piaro, landSearch);

  const stormGroundOperator = and(foundation, stormGround);
  const stormHeightsOperator = and(stormGroundOperator, stormHeights);

  const chainsawL1 = and(foundation, stormGroundOrPiaroOrLandSearch, chainsawCrossCut);
  const chainsawL2 = and(chainsawL1, 'NO');

  const usarOperator = and(foundation, piaro, usar);
  const verticalRescueOperator = and(foundation, piaro, verticalRescue, verticalRescueFitness);

  const landSearchSuburban = jobReady;
  const landSearchOpen = and(landSearchSuburban, landSearch, 'NO');

  return {
    courses: {
      firstAid: 'NO',
      operateCommsEquipment,
      beaconField,
      introAiims,
      fieldCoreSkills: 'NO',
      tsunamiAwareness,

      stormGround,
      stormHeights,
      stormGroundOrPiaroOrLandSearch,
      chainsawCrossCut,

      floodBoat,
      landBased,
      inWater,

      piaro,
      usar,
      verticalRescue,

      landSearch,
      mapAndNav,

      leadershipFundamentals,
      fieldTeamLeader,
    },
    operator: {
      stormGround: stormGroundOperator,
      stormHeights: stormHeightsOperator,

      chainsawL1,
      chainsawL2,

      usar: usarOperator,
      verticalRescue: verticalRescueOperator,

      landSearchSuburban,
      landSearchOpen,
    },
    fitness: {
      verticalRescue: verticalRescueFitness,
    },
  };
}
