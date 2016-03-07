import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Dashboard extends Component {
  render() {
    return (
      <div className="container">
        <h1>Админка</h1>

        <ul>
          <li><Link to="/admin/cooks">Кулинары</Link></li>
          <li><Link to="/admin/users">Подписчики</Link></li>
          <li><Link to="/admin/lunches">Обеды</Link></li>
          <li><Link to="/admin/orders">Заказы</Link></li>
        </ul>
      </div>
    );
  }
}
