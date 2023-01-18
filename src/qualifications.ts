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

  const beaconFamiliar = status('BEA002');

  return {
    courses: {
      beaconFamiliar,
    },
    operator: { },
  };
}
