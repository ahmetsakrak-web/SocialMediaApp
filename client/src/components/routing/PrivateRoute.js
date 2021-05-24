
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom"




const PrivateRoute = ({auth:{isAuthenticated,loading}, component:Component, ...rest}) => (
    <Route {...rest} render={prop=> 
        !isAuthenticated && !loading ? 
        (<Redirect to='/login' />) :
        (<Component {...prop}  />)} />
)



PrivateRoute.propTypes = {
    auth:PropTypes.object.isRequired
}


const mapStateToProps = state => (
    {
        auth:state.auth
    }
)

export default connect(mapStateToProps)(PrivateRoute)
