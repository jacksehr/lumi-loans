export const PAGE_LENGTH = 25;

export default {
  page: {
    outName: 'skip',
    parser: (pageNumber) => (parseInt(pageNumber, 10) - 1) * PAGE_LENGTH
  },
  health: {
    outName: 'health',
    parser: (() => {
      const healthMap = new Map([['low', 50], ['medium', 80], ['high', 100]]);
      return (bracket) => healthMap.get(bracket) || 0;
    })(),
  },
  industry: {
    outName: 'industry',
    parser: industryName => industryName.charAt(0).toUpperCase() + industryName.slice(1).toLowerCase(),
  },
};

