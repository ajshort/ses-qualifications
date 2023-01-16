import moment from 'moment';

// This is a list of known qualifications - unfortunately the codes are not so useful so we just
// go off names. Not super robust. We use this to throw a warning when we encounter a qualification
// we don't know about.
export const KNOWN = [
  'Apply advanced first aid',
  'Apply first aid',
  'Credit Transfer - First Aid Competencies',
  'First Aid',
  'Provide advanced first aid',
  'Provide Advanced First Aid',
  'Provide First Aid in remote or isolated site',
  'Provide first aid in remote situations',
  'Provide first aid',
  'Provide First Aid',

  'Tsunami Awareness (eLearning)',
  'Tsunami Awareness',
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

  function has(name) {
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

  // All of these qualifications combine, so calculate them here.
  const firstAid = or(
    current('Apply advanced first aid', 3),
    current('Apply first aid', 3),
    current('Credit Transfer - First Aid Competencies', 3),
    current('First Aid', 3),
    current('Provide advanced first aid', 3),
    current('Provide Advanced First Aid', 3),
    current('Provide First Aid in remote or isolated site', 3),
    current('Provide first aid in remote situations', 3),
    current('Provide first aid', 3),
    current('Provide First Aid', 3),
  );

  return {
    firstAid,

    tsunamiAwareness: or(has('Tsunami Awareness'), has('Tsunami Awareness (eLearning)'))
  };
}
