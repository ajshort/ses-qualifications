import moment from 'moment';

type Competencies = Map<string, Date>;

enum Status {
  CURRENT = 'CURRENT',
  EXPIRED = 'EXPIRED',
  NONE = 'NONE',
};

function and(...args: Status[]): Status {
  if (args.every(status => status === Status.CURRENT)) {
    return Status.CURRENT;
  } else if (args.every(status => status === Status.CURRENT || status === Status.EXPIRED)) {
    return Status.EXPIRED;
  }

  return Status.NONE;
}

function or(...args: Status[]): Status {
  if (args.some(status => status === Status.CURRENT)) {
    return Status.CURRENT;
  } else if (args.some(status => status === Status.EXPIRED)) {
    return Status.EXPIRED;
  }

  return Status.NONE;
}

const equivalencies = {
  alpineSearch: ['PUASES016'],
  beaconFamiliar: ['BEA001', 'BEA002', 'BEA002E'],
  beaconField: ['BEF001', 'BEF002', 'BEP001'],
  chainsawCrossCut: ['CSC001', 'CSC002', 'CSC003', 'FPIFGM069A', 'FPICOT2221A', 'FPICOT2239A', 'FWPCOT2256', 'FWPCOT2239'],
  chainsawFelling: ['CFC002', 'CFC003', 'FPIFGM3212', 'FPIFGM3204A'],
  codeOfConduct: ['COC003', 'CCE001E', 'COC003E'],
  communityLiason: ['CLO001'],
  diversityAndInclusion: ['DAI002E', 'DAI002'],
  emergencyManagement: ['EMOP001', 'EMPE001', 'EAE001', 'EMIP001'],
  fieldCoreSkills: ['FCP001'],
  fieldTeamLeader: ['TLC001', 'TLC002', 'FTL001', 'FTL002', 'PUAOPE012', 'PUAOPE012A', 'IC1001'],
  firstAid: ['PFA001', 'HLTAID003', 'HLTAID011', 'HLTFA412A', 'HLTFA404A', 'HLTFA301B', 'HLTFA311A', 'HLTFA301C', 'HLTAID014', 'HLTAID013', 'HLTAID005', 'X-HLTAID006', 'FAC003', 'SFC001', 'SFC002', 'FAC002'],
  floodBoat: ['PUASES009', 'PUASES009A', 'IRB001', 'PUASES003A', 'PUASES003B', 'BCC001', 'BMC001', 'BMC002', 'BMC003', 'BMC004', 'FLB005C'],
  floodRescueAwareness: ['FRA001', 'FRAP002', 'FRA003'],
  fundamentals: ['FDC001', 'FDC002'],
  industrialDomesticRescue: ['PUASAR026'],
  induction: ['INC001', 'INC002', 'INC003', 'INC0004', 'INP001', 'IND001E'],
  introAiims: ['22202VIC', 'AIP001', 'AIP002', 'AIP003', 'AIP004', 'AIP4001', 'AIP4002', 'VU22320', '22202VIC', '22459VIC', 'AIP004E'],
  inWater: ['FR3001', 'PUASAR034', 'PUASAR002', 'FRIW002', 'PUASES014'],
  jobReadyInduction: ['JR001', 'JRI002'],
  jobReadyWorkshop: ['IJR001'],
  landBased: ['FR1001', 'FRL001E', 'PUASAR033', 'PUASAR001', 'FRL002'],
  landSearch: ['LSC001', 'LSC002', 'LSC003', 'LSC004', 'LSC005', 'PUASAR027', 'PUASAR027A', 'PUASAR008A', 'PUASAR008B'],
  largeAnimalRescue: ['LARO002'],
  leadershipFundamentals: ['LFC003', 'PUAOPE015', 'PUAOPE015A', 'PUAOPE004A', 'PUAOPE004B'],
  mapAndNav: ['NVC001', 'NVC002', 'NVC003', 'NVC004', 'PUAOPE014', 'PUAOPE014A', 'PUAOPE003A', 'PUAOPE003B'],
  operateCommsEquipment: ['CEC001', 'CEC002', 'CEC003', 'CEC004', 'PUAOPE013', 'PUAOPE013A', 'PUAOPE002A', 'PUAOPE002B'],
  piaro: ['PRC001', 'PRC002', 'PUASAR022', 'PUASAR001A', 'PUASAR001B', 'PUASAR022A'],
  roadCrashRescue: ['RCC004', 'PUASAR024', 'PUASAR024A'],
  stormGround: ['PUASES008', 'PUASES008A', 'SDG003C', 'SDGC002', 'SDC001', 'SDC002', 'PUASES001A', 'PUASES001B'],
  stormHeights: ['SDHC001', 'SDHC002', 'SDH003C', 'PUASES013', 'PUASES013A', 'SDC001', 'SDC002', 'PUASES001A', 'PUASES001B'],
  tsunamiAwareness: ['TSU002', 'TSU002E'],
  urbanSearchRescue: ['USC002', 'PUASAR023', 'PUASAR023A', 'U1E001'],
  verticalRescue: ['VRC001', 'VRC002', 'VRC003', 'VRC004', 'PUASAR032', 'PUASAR004A', 'PUASAR004B', 'PUASAR032', 'PUASAR032A'],
};

const equivalenciesFitness = {
  fitForTask: ['FIT001', 'FIT002'],
  swimTestInWater: ['SWM2003', 'SWM2001'],
  swimTestLandBased: ['SWM1003', 'SWM1001'],
  swimTestBoat: ['SWM3003', 'SWM3003P'],
  inWaterRefresher: ['FRPDC002', 'FRPDN002', 'FRPDV002', 'FRPD003', 'FR3RN001', 'FR3V001'],
  timedAscent: ['VRE003'],
  verticalPackTest: ['MPT001', 'APT001'],
}

/**
 * Analyse qualifications to create an operator profile.
 */
export function analyse(competencies: Competencies) {
  // Gets the current status for qualification code(s).
  function status(code: string, years?: number): Status {
    const entry = competencies.get(code);

    if (entry === undefined) {
      return Status.NONE;
    }

    if (years !== undefined && moment(entry).add(years, 'years').isBefore()) {
      return Status.EXPIRED;
    }

    return Status.CURRENT;
  }

  // Courses.
  const courses = Object.fromEntries(
    Object.entries(equivalencies)
      .map(([course, codes]) => (
        [course, or(...codes.map(code => status(code, course === 'firstAid' ? 3 : undefined)))]
      ))
  );

  courses.stormGroundOrPiaroOrLandSearch = or(
    courses.stormGround,
    courses.piaro,
    courses.landSearch,
  );

  // Count old fundamentals as equivalent for the Job Ready induction and Field Core Skills.
  if (courses.fundamentals === Status.CURRENT) {
    courses.jobReadyInduction = Status.CURRENT;
    courses.jobReadyWorkshop = Status.CURRENT;
    courses.fieldCoreSkills = Status.CURRENT;
  }

  // Fitness or currency tests.
  const fitForTask = status('FIT002');

  const swimTestInWater = status('SWM2003', 3);
  const swimTestLandBased = or(status('SWM1003', 3), swimTestInWater);
  const swimTestBoat = or(status('SWM3003', 3), swimTestLandBased);

  const boatFitness = swimTestBoat;
  const landBasedFitness = and(swimTestLandBased, fitForTask);
  const inWaterFitness = and(swimTestInWater, fitForTask);
  const inWaterRefresher = or(status('FRPDC002', 3), status('FRPDN002', 3), status('FRPDV002', 3), status('FRPD003', 3), status('FR3RN001', 3), status('FR3V001', 3));

  const timedAscent = status('VRE003', 1);
  const verticalPackTest = or(status('MPT001', 1), status('APT001', 1));
  const verticalRescueFitness = and(timedAscent, verticalPackTest);

  // Bundle up operator status.
  const jobReady = and(courses.beaconFamiliar, courses.codeOfConduct, courses.jobReadyInduction, courses.floodRescueAwareness, courses.jobReadyWorkshop);
  const foundation = and(courses.firstAid, courses.operateCommsEquipment, courses.beaconField, courses.introAiims, courses.fieldCoreSkills);
  const stormGroundOperator = and(foundation, courses.stormGround);
  const chainsawL1 = and(foundation, courses.stormGroundOrPiaroOrLandSearch, courses.chainsawCrossCut);

  return {
    courses,
    operator: {
      jobReady,
      foundation,

      stormGround: stormGroundOperator,
      stormHeights: and(stormGroundOperator, courses.stormHeights),

      chainsawL1: chainsawL1,
      chainsawL2: and(chainsawL1, courses.chainsawFelling),
    },
    currency: {
      boat: boatFitness,
      landBased: landBasedFitness,
      onWater: landBasedFitness,
      verticalRescue: verticalRescueFitness,
    }
  };
}
