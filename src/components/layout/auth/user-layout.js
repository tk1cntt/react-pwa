import React from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Footer from './footer';

export default class UserLayout extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const { children } = this.props;
    return (
      <div className="user-layout">
        <Sidebar activeMenu="" activeSubMenu="dashboard" />
        <div id="page-wrapper" className="gray-bg dashbard-1">
          <Header />
          <div className="row border-bottom white-bg dashboard-header">
            {children}
          </div>
          <div className="row">
            <div className="col-lg-12">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
