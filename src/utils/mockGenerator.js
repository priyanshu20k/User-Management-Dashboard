// mockGenerator.js - functions to clean api data and make fake users for testing.

export const DEPARTMENTS = [
  'Engineering',
  'Product Management',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Design',
  'Customer Success',
  'Operations',
  'Legal'
];

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Gregory', 'Christine', 'Alexander', 'Debra',
  'Frank', 'Rachel', 'Patrick', 'Carolyn', 'Raymond', 'Janet', 'Jack', 'Maria'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutiérrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza'
];

export function cleanUserData(apiUser) {
  // split the raw name string into first and last name
  const rawName = apiUser.name || '';
  const nameParts = rawName.trim().split(/\s+/);
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  // pick a department based on user ID
  const deptIndex = apiUser.id % DEPARTMENTS.length;
  const department = DEPARTMENTS[deptIndex];

  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    department,
    phone: apiUser.phone,
    website: apiUser.website,
  };
}

export function makeFakeUsers(startId, count) {
  const resultList = [];
  
  for (let i = 0; i < count; i++) {
    const nextId = startId + i;
    // pick some names from lists based on ID
    const firstName = FIRST_NAMES[(nextId * 7 + 13) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(nextId * 11 + 29) % LAST_NAMES.length];
    const department = DEPARTMENTS[(nextId * 3 + 5) % DEPARTMENTS.length];
    
    const domainName = lastName.toLowerCase().replace(/[^a-z]/g, '') || 'example';
    const emailAddress = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domainName}.com`;
    const phoneNumber = `+1 (${200 + (nextId % 800)}) 555-${String(1000 + (nextId % 9000))}`;
    
    resultList.push({
      id: nextId,
      firstName,
      lastName,
      email: emailAddress,
      department,
      phone: phoneNumber,
      website: `www.${domainName}.com`,
    });
  }
  
  return resultList;
}