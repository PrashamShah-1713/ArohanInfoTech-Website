import React from 'react'
import styles from "../Styles/viewinternship.module.css";

const viewinternships = () => {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Internships and Courses Details</h1>

        <div className={styles.internshipCourses}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.row}>
                <th>Sr. No.</th>
                <th>Internship/Course Name</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Fees</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.row}>
                <td id="sr-no"></td>
                <td id="internship-name"></td>
                <td id="duration"></td>
                <td id="start-date"></td>
                <td id="end-date"></td>
                <td id="fees"></td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default viewinternships