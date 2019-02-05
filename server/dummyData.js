import Loan from './models/loan';

const firstName = [
  'Pauls',
  'Beeshals',
  'Luizs',
  'Nicks',
  'Annas',
  'Yanirs',
];
const adjective = [
  'Awesome',
  'Pitiful',
  'Great',
  'Cool',
  'Beautiful',
  'Above Average',
];
const types = [
  { name: 'Pizzeria', industry: 'Hospitality' },
  { name: 'Pub', industry: 'Hospitality' },
  { name: 'Hotel', industry: 'Accomodation' },
  { name: 'Bed and Breakfast', industry: 'Accomodation' },
  { name: 'Clothes shop', industry: 'Retail' },
  { name: 'Supermarket', industry: 'Retail' },
  { name: 'Vegetable Farm', industry: 'Agriculture' },
  { name: 'Dairy Farm', industry: 'Agriculture' },
];


async function populateData() {
  // loop tings
  for (let count = 0; count < 1000; count++) {
    // take first thing off queue
    const first = firstName.shift();
    const second = adjective.shift();
    const type = types.shift();

    await Loan.create({
      name: `${first} ${second} ${type.name}`,
      industry: type.industry,
      health: Math.floor(Math.random() * 100) + 1,
    });

    // Put back on queue
    firstName.push(first);
    adjective.push(second);
    types.push(type);
  }
}


export default async function () {
  try {
    const count = await Loan.count().exec();
    if (count > 0) {
      return;
    }

    await populateData();
  } catch (err) {
    console.log(err);
  }
}
