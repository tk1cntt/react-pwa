import React from 'react';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';

import showDrawer from '../../../actions/setting';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
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
      height =
        w.innerHeight || documentElement.clientHeight || body.clientHeight;
    this.setState({ width, height });
  };

  openMiniNavbar = () => () => {
    this.props.showDrawer(true);
  };

  navbarMinimalizeButton = () => {
    if (this.state.width <= 768) {
      return (
        <div
          className="navbar-minimalize minimalize-styl-2 btn btn-primary"
          onClick={this.openMiniNavbar()}
        >
          <i className="fa fa-bars" />{' '}
        </div>
      );
    }
  };

  render() {
    return (
      <>
        <div className="row border-bottom">
          <nav
            className="navbar navbar-static-top"
            role="navigation"
            style={{ marginBottom: 0 }}
          >
            <div className="navbar-header">{this.navbarMinimalizeButton()}</div>
            <ul className="nav navbar-top-links navbar-right">
              <li>
                <Link to={'/logout'}>
                  <i className="fa fa-sign-out" /> Log out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ setting }) => ({
  setting
});

const mapDispatchToProps = {
  showDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
