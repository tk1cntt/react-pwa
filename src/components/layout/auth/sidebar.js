import React from 'react';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';
import { Drawer, Menu, Icon } from 'antd';
// eslint-disable-next-line
import imgProfile from '../../../resources/img/profile_small.jpg';
import showDrawer from '../../../actions/setting';

const { SubMenu } = Menu;

export class Sidebar extends React.Component {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    this.props.showDrawer(false);
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ width, height });
  };

  userMenuEx() {
    const menus = [];
    menus.push(
      <Menu.Item key="shopping-cart">
        <Link to={'/shopping-cart'}>
          <Icon type="shopping-cart" /> Giỏ hàng
        </Link>
      </Menu.Item>
    );
    menus.push(
      <Menu.Item key="order-cart">
        <Link to={'/order-cart'}>
          <Icon type="bars" />
          Danh sách đơn hàng
        </Link>
      </Menu.Item>
    );
    menus.push(
      <Menu.Item key="payment">
        <Link to={'/payment'}>
          <Icon type="pay-circle" />
          Ví tiền
        </Link>
      </Menu.Item>
    );
    menus.push(
      <Menu.Item key="setting">
        <Link to={'/account/settings'}>
          <Icon type="user" />
          Thông tin cá nhân
        </Link>
      </Menu.Item>
    );
    return menus;
  }

  managerMenuEx() {
    const { activeMenu, activeSubMenu } = this.props;
    return (
      <SubMenu
        key="payment-management"
        title={
          <span>
            <Icon type="gift" />
            <span>Payment</span>
          </span>
        }
      >
        <Menu.Item key="banktransfer">
          <Link to={'/management/banktransfer'}>
            <i className="fa fa-sign-in" /> Nạp tiền
          </Link>
        </Menu.Item>
        <Menu.Item key="history">
          <Link to={'/management/history'}>
            <i className="fa fa-exchange" /> Lịch sử thanh toán
          </Link>
        </Menu.Item>
      </SubMenu>
    );
  }


  staffMenuEx() {
    return (
      <SubMenu
        key="staff"
        title={
          <span>
            <Icon type="setting" />
            <span>Quản lý đơn hàng</span>
          </span>
        }
      >
        <Menu.Item key="order-list">
          <Link to={'/staff/order-list'}>
            <i className="fa fa-list" /> Danh sách đơn hàng
          </Link>
        </Menu.Item>
        <Menu.Item key="order-deposited">
          <Link to={'/staff/order-deposited'}>
            <i className="fa fa-sign-in" /> Đơn hàng chưa xử lý
          </Link>
        </Menu.Item>
        <Menu.Item key="order-buying">
          <Link to={'/staff/order-buying'}>
            <i className="fa fa-exchange" /> Đơn hàng bạn đã nhận
          </Link>
        </Menu.Item>
        <Menu.Item key="order-purchased">
          <Link to={'/staff/order-purchased'}>
            <i className="fa fa-check-circle" /> Đơn hàng đã xử lý
          </Link>
        </Menu.Item>
        <Menu.Item key="order-cancel">
          <Link to={'/staff/order-cancel'}>
            <i className="fa fa-window-close" /> Đơn hàng đã huỷ
          </Link>
        </Menu.Item>
      </SubMenu>
    );
  }

  logisticsMenu() {
    const { activeMenu, activeSubMenu } = this.props;
    return (
      <li className={`${activeMenu === 'order-management' ? 'active' : ''}`}>
        <Link to={'/staff/order-deposited'}>
          <i className="fa fa-gift" /> <span className="nav-label">Quản lý vận chuyển hàng</span> <span className="fa arrow" />
        </Link>
        <ul className={`${activeMenu === 'order-management' ? 'nav nav-second-level collapse in' : 'nav nav-second-level collapse'}`}>
          <li className={`${activeSubMenu === 'order-deposited' ? 'active' : ''}`}>
            <Link to={'/staff/order-deposited'}>
              <i className="fa fa-sign-in" /> Nhập hàng ở kho Trung Quốc
            </Link>
          </li>
          <li className={`${activeSubMenu === 'order-buying' ? 'active' : ''}`}>
            <Link to={'/staff/order-buying'}>
              <i className="fa fa-exchange" /> Đóng bao
            </Link>
          </li>
          <li className={`${activeSubMenu === 'order-purchased' ? 'active' : ''}`}>
            <Link to={'/staff/order-purchased'}>
              <i className="fa fa-check-circle" /> Xuất hàng kho Trung Quốc
            </Link>
          </li>
          <li className={`${activeSubMenu === 'order-purchased' ? 'active' : ''}`}>
            <Link to={'/staff/order-purchased'}>
              <i className="fa fa-check-circle" /> Nhập hàng kho Việt Nam
            </Link>
          </li>
          <li className={`${activeSubMenu === 'order-purchased' ? 'active' : ''}`}>
            <Link to={'/staff/order-purchased'}>
              <i className="fa fa-check-circle" /> Đơn hàng yêu cầu giao
            </Link>
          </li>
          <li className={`${activeSubMenu === 'order-purchased' ? 'active' : ''}`}>
            <Link to={'/staff/order-purchased'}>
              <i className="fa fa-check-circle" /> Giao hàng
            </Link>
          </li>
        </ul>
      </li>
    );
  }

  adminMenuEx() {
    return (
      <SubMenu
        key="administration"
        title={
          <span>
            <Icon type="setting" />
            <span>Administration</span>
          </span>
        }
      >
        <Menu.Item key="user-management">
          <Link to={'/admin/user-management'}>
            <i className="fa fa-user" />
            Users
          </Link>
        </Menu.Item>
        <Menu.Item key="metrics">
          <Link to={'/admin/metrics'}>
            <i className="fa fa-tachometer-alt" /> Metrics
          </Link>
        </Menu.Item>
        <Menu.Item key="health">
          <Link to={'/admin/health'}>
            <i className="fa fa-heart" /> Health
          </Link>
        </Menu.Item>
        <Menu.Item key="configuration">
          <Link to={'/admin/configuration'}>
            <i className="fa fa-list" /> Configuration
          </Link>
        </Menu.Item>
        <Menu.Item key="audits">
          <Link to={'/admin/audits'}>
            <i className="fa fa-bell" /> Audits
          </Link>
        </Menu.Item>
        <Menu.Item key="logs">
          <Link to={'/admin/logs'}>
            <i className="fa fa-tasks" /> Logs
          </Link>
        </Menu.Item>
      </SubMenu>
    );
  }

  onClose = () => {
    this.props.showDrawer(false);
  };

  showDrawerMenu() {
    return (
      <Drawer width={235} placement="left" closable={false} onClose={this.onClose} visible={this.props.setting.showDrawer}>
        {this.showNormalMenu()}
      </Drawer>
    );
  }

  showNormalMenu() {
    const { activeMenu, activeSubMenu } = this.props;
    const selectedKeys = activeSubMenu;
    const defaultOpenKeys = activeMenu;
    return (
      <>
        <li className="nav-header">
          <div className="dropdown profile-element">
            <span>
              <img alt="image" className="img-circle" src={imgProfile} />
            </span>
          </div>
          <div className="logo-element">IN+</div>
        </li>
        <Menu
          mode="inline"
          theme="dark"
          style={{ width: 220 }}
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={[defaultOpenKeys]}
          selectedKeys={[selectedKeys]}
        >
          <Menu.Item key="dashboard">
            <Link to={'/'}>
              <Icon type="appstore" />
              Thông tin chung
            </Link>
          </Menu.Item>
          {this.userMenuEx()}
          {this.staffMenuEx()}
          {this.managerMenuEx()}
          {this.adminMenuEx()}
        </Menu>
      </>
    );
  }

  render() {
    return (
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            {this.state.width > 768 ? this.showNormalMenu() : this.showDrawerMenu()}
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ authentication, setting }) => ({
  account: authentication.account,
  setting,
});

const mapDispatchToProps = { showDrawer };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
