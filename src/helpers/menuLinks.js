import React from 'react';

const menuLinks = [
  {to: '/', label: 'Главная', index: true},
  {to: '/team_offers', label: 'Корпоративные обеды'},
  {to: '/cooks', label: 'Кулинары'},
  {to: '/about', label: 'О Нас'},
  {to: '/tariffs', label: <span><span className="tariffs long">Тарифные планы</span><span className="tariffs short">Тарифы</span></span>}
];

export default menuLinks;
