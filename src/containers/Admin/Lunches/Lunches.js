import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { request as requestLunches } from 'helpers/lunchesFilters';
import { Link } from 'react-router';
import Button from 'components/Button/Button';
import styles from './styles.scss';

@asyncConnect([
  {key: 'lunches', promise: requestLunches}
])
export default class Lunches extends Component {
  static propTypes = {
    lunches: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  goToCreateLunch(event) {
    event.preventDefault();
    this.context.router.push('/admin/lunches/new');
  }

  render() {
    const { resources: lunches } = this.props.lunches;
    return (
      <div className={styles.root}>
        <div className={styles.firstLine}>
          <h1>Обеды</h1>
          <Button flat accent label="Создать обед" onClick={::this.goToCreateLunch}/>
        </div>
        <table className={styles.mainTable}>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Cook</th>
              <th>Actions</th>
            </tr>
            {lunches.map(lunch =>
              <tr key={lunch.id}>
                <td>{lunch.id}</td>
                <td><img src={lunch.photos[0].thumb.url}/></td>
                <td>{lunch.cook.first_name} {lunch.cook.last_name}</td>
                <td><Link to={`/admin/lunches/${lunch.id}/edit`}>Редактировать</Link></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
