import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Actions
import { fetchLoans, setFilter } from './LoansActions';
import FilterDropdown from './components/FilterDropdown/FilterDropdown';
import Gauge from 'react-svg-gauge';
import styles from './Loans.css';

// Import Selectors
import { getLoans, getFilter, getPageCount } from './LoansReducer';

class LoansPage extends Component {
  constructor() {
    super();
    this.updateFilter = this.updateFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(setFilter(this.props.location.search));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter !== this.props.filter) {
      this.props.dispatch(
        fetchLoans(
          this.props.filter || '',
          () => this.props.history.push(`/${this.props.filter}`)
        )
      );
    }
  }

  getColor(val) {
    if (val > 80) return 'green';
    if (val > 50) return 'gold';
    return 'red';
  }

  updateFilter(field, newValue) {
    const query = this.props.location.query;
    query[field] = newValue;

    const newFilter = Object.entries(query)
      .filter(([_, value]) => value !== '')
      .sort()
      .map(pair => pair.join('='))
      .join('&');

    if (newFilter === '') {
      this.props.dispatch(setFilter(''));
    } else {
      this.props.dispatch(setFilter(`?${newFilter}`));
    }
  }

  handlePageChange(event) {
    if (event.target.value) {
      this.updateFilter('page', event.target.value);
    } else {
      let pageNum = this.props.location.query.page ? parseInt(this.props.location.query.page, 10) : 1;
      pageNum += event.currentTarget.innerHTML === '←' ? -1 : 1;
      pageNum = Math.max(1, pageNum);
      this.updateFilter('page', pageNum);
    }
  }

  handleFilter(event) {
    this.updateFilter(event.target.name, event.target.value);
  }

  render() {
    const { loans, location: { query: { page } } } = this.props;
    let list;

    if (loans && loans.length) {
      list = loans.map((loan, i) => {
        return (
          <div key={i} className={styles.loan}>
            <div className={styles.info}>
              <h2>{loan.name}</h2>
              <p>
                <b>Current Health:</b>
                <b style={{ color: this.getColor(loan.health) }}>
                  &nbsp; {loan.health}
                </b>
              </p>
              <p>
                <b>Industry:</b>
                &nbsp; {loan.industry}
              </p>
            </div>
            <div className={styles.graph}>
              <Gauge
                value={loan.health}
                color={this.getColor(loan.health)}
                width={150}
                height={150}
                label=""
              />
            </div>
          </div>
        );
      });
    }

    return (
      <div>
        <div className={styles['filter-container']}>
          <FilterDropdown
            name={'health'}
            onChange={this.handleFilter}
            currentValue={this.props.location.query.health}
            options={['low', 'medium', 'high']}
          />
          <FilterDropdown
            name={'industry'}
            onChange={this.handleFilter}
            currentValue={this.props.location.query.industry}
            options={['accomodation', 'agriculture', 'hospitality', 'retail']}
          />
        </div>
        <div className={styles['page-indicator']}>
          {page && page > 1 ?
            <button className={styles['left-button']} onClick={this.handlePageChange}>←</button>
            : <span />
          }
          <span>
            Page
            <FilterDropdown
              allowEmpty={false}
              currentValue={page}
              options={[...Array(this.props.pageCount).keys()].map(i => (i + 1).toString())}
              onChange={this.handlePageChange}
            />
            of {Math.ceil(this.props.pageCount)}
          </span>
          {(!page || (page && page < this.props.pageCount)) ?
            <button className={styles['right-button']} onClick={this.handlePageChange}>→</button>
            : <span />
          }
        </div>
        {list}
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
LoansPage.need = [() => { return fetchLoans(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    loans: getLoans(state),
    filter: getFilter(state),
    pageCount: getPageCount(state),
  };
}

LoansPage.propTypes = {
  loans: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  pageCount: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

LoansPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(LoansPage);
