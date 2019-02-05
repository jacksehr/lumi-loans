import Loan from '../../models/loan';
import filters, { PAGE_LENGTH } from './filters';

/**
 * Uses given Model and parameters to query database then convert results to plain objects
 * @param {mongoose.Model} model
 * @param {number} skip - number of entries to skip; for pagination
 * @param {Object} query - same API as first parameter of model.find()
 * @param {Array<string>} desiredFields
 * @param {Array<string>} unwantedFields
 * @returns {Promise<Object>} - Array of query results, all as plain objects
 */
async function extractLoansFromQuery(model, { skip = 0, ...query } = {}, desiredFields = [], unwantedFields = []) {
  const documents = await model.find(
    query,
    [...desiredFields, ...unwantedFields.map(field => `-${field}`)],
    { skip, limit: PAGE_LENGTH }
  );
  const pageCount = Math.ceil((await model.count(query)) / PAGE_LENGTH);

  return { pageCount, loans: documents.map(doc => doc._doc) };
}

/**
 * Parses a query from an Express request and translates to appropriate values for a mongoose query
 * @param {Object} queryObject - e.g. {param1: foo, param2: bar}
 * @returns {{skip: *, health: *, industry: Object.industry}}
 */
function parseRequestQuery(queryObject) {
  const builtQuery = {};
  for (const [key, { outName, parser }] of Object.entries(filters)) {
    if (queryObject[key]) {
      builtQuery[outName] = parser(queryObject[key]);
    }
  }
  return builtQuery;
}

/**
 * Get all Loans
 * @param req
 * @param res
 * @returns void
 */
export async function getLoans(req, res) {
  const query = parseRequestQuery(req.query);
  const desiredFields = ['name', 'health', 'industry'];
  const unwantedFields = ['_id'];

  const loans = await extractLoansFromQuery(Loan, query, desiredFields, unwantedFields);
  return res.send(loans);
}
