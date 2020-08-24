import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';

const Dashboard = ({ getCurrentProfile, auth : { user }, profile: { loading, profile } }) => {

  useEffect(() => {getCurrentProfile()}, []);

  return (
    loading && profile === null ? <Spinner /> : <Fragment>
      <h1 class="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? 
      ( 
        <DashboardActions />
       ) : ( 
        <Fragment>
          <p>You have not setup a profile yet, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile : state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);