import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Card, ListGroup, ListGroupItem } from 'reactstrap'
import '../css/search.css'

// This component provides a Search list, which can delete objects and send requests.
export default function Search (props) {
  const [view, setView] = useState(false)

  function getDelete (e) {
    if (view == true) {
      setView(false)
    } else {
      setView(true)
    }
    props.setDel(e)
  }

  function getView () {
    if (view == true) {
      setView(false)
    } else {
      setView(true)
    }
  }

  function sendReq () {

    props.search()
    setView(false)
  }

  return (
    <div>
      <Button
        type="button"
        onClick={getView}
        className='fixButton'
        color="warning"
      >
        <span>Search list</span>
      </Button>
      {view == false ? null :
        <Card
          style={{
            width: '18rem'
          }}
          className='fixCard view'
        >
          {/* <CardHeader>
            List
          </CardHeader> */}

          <ListGroup >
            {props.searchDescription.map((i) =>
              <ListGroupItem
                key={i}>
                {i}
                <div></div>
                <Button
                  onClick={(e) => getDelete(e.target.id)}
                  id={i}
                  color="danger"
                >
                  DELETE
                </Button>
              </ListGroupItem>
            )}
            {
              props.searchDescription.length == 0 ? <div>Please Add Something</div> : <Button
                type="button"
                onClick={sendReq}
                color="success"
              >
                Send
              </Button>
            }

          </ListGroup>
        </Card>}
    </div>
  )
}
