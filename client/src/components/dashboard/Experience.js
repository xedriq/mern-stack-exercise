import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import Moment from 'react-moment'
import { deleteExperience } from '../../actions/profileActions'

class Experience extends Component {

    onDeleteClick = (expId) => {
        this.props.deleteExperience(expId)
    }

    render() {
        const experience = this.props.experience.map(exp => (
            <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>
                    <Moment format="YYYY/MMM/DD">{exp.from}</Moment> - {' '}
                    {exp.to === null ? ('Current') : <Moment format="YYYY/MMM/DD">{exp.to}</Moment>}

                </td>
                <td>
                    <button
                        className="btn btn-danger"
                        onClick={this.onDeleteClick}
                    >Delete</button>
                </td>
            </tr>
        ))
        return (
            <div>
                <h4 className="mb-4">Experience Credentials</h4>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Year</th>
                            <th></th>
                        </tr>
                        {experience}
                    </tbody>
                </table>
            </div>
        )
    }
}

Experience.propTypes = {
    deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience })(Experience)
