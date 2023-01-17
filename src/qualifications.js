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
    if (typeof code === 'string') {
      return codes.has(code) ? 'YES' : 'NO';
    } else {
      return Array.from(codes.keys()).some(x => code.test(x)) ? 'YES' : 'NO';
    }
  }

  function current(code, years) {
    let found;

    if (typeof code === 'string') {
      found = codes.get(code);
    } else {
      found = Array.from(codes.entries()).find(([k, v]) => code.test(k));
      found = found ? found[1] : found;
    }

    if (found === undefined) {
      return 'NO';
    } else if (moment(found).add(years, 'years').isBefore()) {
      return 'EXPIRED';
    } else {
      return 'YES';
    }
  }

  // All of these qualifications combine, so calculate them here.
  const jobReadyInduction = has(/JRI[0-9]{3}/);
  const jobReadyWorkshop = has(/IJR[0-9]{3}/);
  const beaconFamiliar = has(/BE[AP][0-9]{3}/);
  const codeOfConduct = or(current('CCE001E', 3), current(/COC003E?/, 3));
  const floodRescueAwareness = has(/FRA[0-9]{3}/)

  const firstAid = or(current(/SFC[0-9]{3}/, 3), current('HLTAID003', 3), current('HLTAID011', 3));
  const operateCommsEquipment = or(has(/CEC[0-9]{3}/), has(/PUAOPE013A?/));
  const beaconField = or(has('BEF001'), has('BEF002'));
  const introAiims = has('AIP002');
  const fieldCoreSkills = 'YES'; // TODO
  const tsunamiAwareness = has(/TSU[0-9]{3}/);

  const stormGround = or(has('SDC001'), has('SDC002'), has('SDG003C'), has('PUASES008'), has('PUASES008A'));
  const stormHeights = or(has('SDC001'), has('SDC002'), has('SDH003C'), has('PUASES013'), has('PUASES013A'));
  const chainsawCrossCut = has(/CSC[0-9]{3}/);
  const chainsawFelling = has(/CFC[0-9]{3}/);

  const landBased = or(has('FR1001'), has('PUASAR033'), has('PUASAR001'))
  const floodBoat = or(has('BCC001'), has('BMC004'), has('PUASES009A'), has('IRB001'));
  const inWater = or(has('FR3001'), has('PUASAR034'), has('PUASAR002'));

  const piaro = or(has(/PRC[0-9]{3}/), has('PUASAR001A'), has('PUASAR001B'), has('PUASAR022A'));
  const usar = has(/USC[0-9]{3}/);
  const verticalRescue = or(has(/VRC[0-9]{3}/), has('PUASAR032A'));

  const landSearch = has(/LSC[0-9]{3}/);
  const mapAndNav = has(/NVC[0-9]{3}/);

  const leadershipFundamentals = has(/LFC[0-9]{3}/);
  const fieldTeamLeader = has('FTL002');

  // Fitness / currency requirements.
  const verticalRescueFitness = 'YES'; // TODO

  const boatFitness = 'YES';
  const landBasedFitness = 'YES';
  const inWaterFitness = 'YES';

  const landSearchOpenFitness = 'YES';
  const landSearchRuggedFitness = 'YES';
  const bushSearchFitness = 'YES';
  const alpineFitness = 'YES';

  // Build up field course pre-reqs and operator status.
  const jobReady = and(beaconFamiliar, codeOfConduct, floodRescueAwareness, jobReadyInduction, jobReadyWorkshop);
  const foundation = and(jobReady, firstAid, operateCommsEquipment, beaconField, introAiims, fieldCoreSkills);
  const stormGroundOrPiaroOrLandSearch = or(stormGround, piaro, landSearch);

  const stormGroundOperator = and(foundation, stormGround);
  const stormHeightsOperator = and(stormGroundOperator, stormHeights);

  const chainsawL1 = and(foundation, stormGroundOrPiaroOrLandSearch, chainsawCrossCut);
  const chainsawL2 = and(chainsawL1, chainsawFelling);

  const boatOperator = and(foundation, floodBoat, boatFitness);
  const landBasedOperator = and(foundation, piaro, landBased, landBasedFitness);
  const onWaterOperator = and(landBasedOperator, floodBoat);
  const inWaterOperator = and(landBasedOperator, inWater, inWaterFitness);

  const usarOperator = and(foundation, piaro, usar);
  const verticalRescueOperator = and(foundation, piaro, verticalRescue, verticalRescueFitness);

  const landSearchSuburban = jobReady;
  const landSearchOpen = and(landSearchSuburban, landSearch, landSearchOpenFitness);

  return {
    courses: {
      beaconFamiliar,
      codeOfConduct,
      floodRescueAwareness,
      jobReadyInduction,
      jobReadyWorkshop,

      firstAid,
      operateCommsEquipment,
      beaconField,
      introAiims,
      fieldCoreSkills,
      tsunamiAwareness,

      stormGround,
      stormHeights,
      stormGroundOrPiaroOrLandSearch,
      chainsawCrossCut,
      chainsawFelling,

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
      jobReady,
      foundation,

      stormGround: stormGroundOperator,
      stormHeights: stormHeightsOperator,

      chainsawL1,
      chainsawL2,

      boat: boatOperator,
      landBased: landBasedOperator,
      onWater: onWaterOperator,
      inWater: inWaterOperator,

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
