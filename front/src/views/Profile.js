import { useState } from 'react';
import { Col, Container, Nav, NavItem, NavLink, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import UserDetails from '#c/components/profile/UserDetails';
import UserAccountDetails from '#c/components/profile/UserAccountDetails';
import MyOrders from '#c/components/profile/MyOrders';
import MyTransactions from '#c/components/profile/MyTransactions';
import MyRequests from '#c/components/profile/MyRequests';
import MyAds from '#c/components/profile/MyAds';

const Tabs = [
  { id: 'profile', label: 'profile' },
  { id: 'my-orders', label: 'my orders' },
  { id: 'transactions', label: 'transactions' },
  // { id: 'requests', label: 'requests' },
  // { id: 'myads', label: 'my ads' },
];

export default function Profile() {
  const { t } = useTranslation();
  const location = useLocation();
  let { hash = 'profile' } = location;
  const [tab, setTab] = useState(() => hash.replace('#', '') || 'profile');

  return (
    <Container fluid className="main-content-container px-4 py-5">
      <Row className="w-100">
        <Col lg="4" className="sticky">
          <UserDetails />
          <Nav
            justified
            tabs
            className="post-product-nav profile-nav vertical-nav">
            {Tabs.map((i, idx) => (
              <NavItem key={idx}>
                <NavLink
                  active={tab === i.id}
                  href={`#${i.id}`}
                  onClick={() => setTab(i.id)}>
                  {i.icon && i.icon}
                  <span>{t(i.label)}</span>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Col>
        <Col lg="8" id={tab}>
          {tab === 'profile' && (
            <UserAccountDetails title={t('account details')} />
          )}

          {tab === 'my-orders' && <MyOrders title={t('my orders')} />}
          {tab === 'transactions' && (
            <MyTransactions title={t('transactions')} />
          )}
          {tab === 'requests' && <MyRequests title={t('requests')} />}
          {tab === 'myads' && <MyAds title={t('my ads')} />}
        </Col>
      </Row>
    </Container>
  );
}
