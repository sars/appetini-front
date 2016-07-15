import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './styles.scss';

export const Pagination = ({pagesCount, changePage}) => {
  return (
    <ReactPaginate
      pageNum={pagesCount}
      pageRangeDisplayed={4}
      marginPagesDisplayed={1}
      clickCallback={changePage}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      previousLabel={<i className="fa fa-chevron-left"/>}
      nextLabel={<i className="fa fa-chevron-right"/>}
    />
  );
};

Pagination.propTypes = {
  pagesCount: React.PropTypes.number.isRequired,
  changePage: React.PropTypes.func.isRequired
};

export default Pagination;
