import moment from 'moment';

// This is a list of known qualifications - unfortunately the codes are not so useful so we just
// go off names. Not super robust. We use this to throw a warning when we encounter a qualification
// we don't know about.
export const KNOWN = [
];

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

  function present(name) {
    return qualifications.find(x => x.name === name) ? 'YES' : 'NO';
  }

  function current(name, years) {
    const found = qualifications.find(x => x.name === name);

    if (found === undefined) {
      return 'NO';
    } else if (moment(found.date).add(years, 'years').isBefore()) {
      return 'EXPIRED';
    } else {
      return 'YES';
    }
  }

  return {
  };
}
