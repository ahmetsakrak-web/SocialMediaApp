import React,{useEffect} from 'react'
import {Link} from "react-router-dom";
import PropTypes from "prop-types"
import {connect} from "react-redux";
import {getCurrentProfile} from "../../actions/profile";
import Spinner from "../layout/Spinner";


import { Fragment } from 'react';

const Dashboard = ({getCurrentProfile, auth:{user}, profile:{profile,loading}}) => {

    useEffect(()=>{
        getCurrentProfile();
    },[]);

    return loading && profile === null ? Spinner : <Fragment>
        <h1 className="large text-primary"></h1>
        <p className="lead">
        <i className="fa fa-user"></i> {` `}
        Welcome {user && user.name}</p>
        {profile !== null ? <Fragment>has</Fragment> :<Fragment>
            <p>You have not yet profile. Please add some info </p>
            <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
            </Fragment>}
    </Fragment>
}




Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps,{getCurrentProfile})(Dashboard)
