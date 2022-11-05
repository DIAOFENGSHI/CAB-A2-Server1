import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../css/list.css'
import { Table, ListGroupItem } from 'reactstrap'


export default function List (props) {
  return (
    <div>
      <Table striped bordered hover size="sm" className="styled-table">
        <thead>
          <tr className="active-row">
            <th>LOCATION</th>
            <th>QUERY</th>
          </tr>
        </thead>
        <tbody>
          {props.topTen == null ? null : props.topTen.map(({ name, id, count }, n) => (
            <tr className="active-row" key={id}>
              <td>{name}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>

      </Table>
    </div>
  )
}
