import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import Moment from 'react-moment'
import { deleteEducation } from '../../actions/profileActions'

class Education extends Component {

    onDeleteClick = (expId) => {
        this.props.deleteEducation(expId)
    }

    render() {
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree} in {edu.fieldofstudy}</td>
                <td>
                    <Moment format="YYYY/MMM/DD">{edu.from}</Moment> - {' '}
                    {edu.to === null ? ('Current') : <Moment format="YYYY/MMM/DD">{edu.to}</Moment>}

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
                <h4 className="mb-4">Education Credentials</h4>
                <table className="table">
                    <tbody>
                        <tr>
                            <th>School</th>
                            <th>Degree</th>
                            <th>Year</th>
                            <th></th>
                        </tr>
                        {education}
                    </tbody>
                </table>
            </div>
        )
    }
}

Education.propTypes = {
    deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(Education)
