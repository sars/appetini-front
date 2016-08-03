import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './styles.scss';

export const Pagination = ({pagination, changePage}) => {
  const currentPage = parseInt(pagination.currentPage, 10) - 1;
  const pagesCount = Math.ceil(pagination.resourcesCount / pagination.perPage);
  return (
    <ReactPaginate
      pageNum={pagesCount}
      pageRangeDisplayed={4}
      marginPagesDisplayed={1}
      forceSelected={currentPage}
      clickCallback={changePage}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      previousLabel={<i className="fa fa-chevron-left"/>}
      nextLabel={<i className="fa fa-chevron-right"/>}
    />
  );
};

Pagination.propTypes = {
  pagination: React.PropTypes.object.isRequired,
  changePage: React.PropTypes.func.isRequired
};

export default Pagination;
