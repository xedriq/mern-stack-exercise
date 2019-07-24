import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profileActions'
import Spinner from '../common/Spinner'
import { Link } from 'react-router-dom'

class Dashboard extends Component {
    componentDidMount() {
        this.props.getCurrentProfile();
    }

    render() {

        const { user } = this.props.auth
        const { profile, loading } = this.props.profile

        let dashboardContent;

        if (profile === null || loading) {
            dashboardContent = <Spinner />
        } else {
            // Check if logged in user has profile
            if (Object.keys(profile) > 0) {
                // Display profile
                dashboardContent = <h4>Welcome {user.name}</h4>
            } else {
                // User is logged in but no profile
                dashboardContent = (
                    <div>
                        <p className="lead text-muted">Welcome {user.name}</p>
                        <p>You have not yet set up a profile, please add some info.</p>
                        <Link
                            to='/create-profile'
                            className="btn btn-lg btn-info">Create Profile
                        </Link>
                    </div>
                )
            }
        }

        return (
            <div className="Dashboard">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="display-4">Dashboard</h1>
                        {dashboardContent}
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
