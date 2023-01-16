import moment from 'moment';

/**
 * Analyse qualifications to create an operator profile.
 */
export function analyse(qualifications) {
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
    return qualifications.find(x => x.code === code) ? 'YES' : 'NO';
  }

  function current(code, years) {
    const found = qualifications.find(x => x.code === code);

    if (found === undefined) {
      return 'NO';
    } else if (moment(found.date).add(years, 'years').isBefore()) {
      return 'EXPIRED';
    } else {
      return 'YES';
    }
  }

  // All of these qualifications combine, so calculate them here.
  const introAiims = has('AIP002');
  const beaconField = has('BEF001');

  const stormGround = has('SDG003C');
  const stormHeights = has('SDH003C');
  const chainsawCrossCut = has('CSC003');

  const floodBoat = has('BMC004');

  const piaro = has('PRC001');
  const usar = has('USC002');
  const verticalRescue = has('VRC003');

  const landSearch = has('LSC004');
  const mapAndNav = has('NVC004');

  const leadershipFundamentals = has('LFC003');

  // Build up field course pre-reqs.
  const foundation = 'YES';
  const stormGroundOperator = and(foundation, stormGround);

  return {
    courses: {
      firstAid: 'NO',
      operateCommsEquipment: 'NO',
      beaconField,
      introAiims,
      fieldCoreSkills: 'NO',
      tsunamiAwareness: 'NO',

      stormGround,
      stormHeights,
      stormGroundOrPiaroOrLandSearch: or(stormGround, piaro, landSearch),
      chainsawCrossCut,

      floodBoat,

      piaro,
      usar,
      verticalRescue,

      landSearch,
      mapAndNav,

      leadershipFundamentals,
    },
    operator: {
      stormGround: stormGroundOperator,
    },
  };
}
