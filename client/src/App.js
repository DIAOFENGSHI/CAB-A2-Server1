import React, { useEffect, useState } from 'react'
import { useLoadScript } from "@react-google-maps/api"
import logo from './img/logo1.png'
import logo1 from './img/logo.png'
import cant from './img/cant.png'
import './css/App.css'
import Map from "./components/Map"
import Result from "./components/Result"
import List from "./components/List"
import Search from "./components/Search"
import 'bootstrap/dist/css/bootstrap.min.css'
import { BounceLoader } from 'react-spinners'
import { Container, Navbar, NavbarBrand, Row, Col, InputGroup, Input, Button } from 'reactstrap'




export default function App () {
  const [markers, setMarkers] = useState(null)
  const [topTen, setTopTen] = useState(null)
  const [searchID, setSearchID] = useState([])
  const [searchDescription, setSearchDescription] = useState([])
  const [del, setDel] = useState()
  const [searching, setSearching] = useState([])
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [InStatus, setInStatus] = useState({ "status": "", "text": "" })
  const [traReStatus, setTraReStatus] = useState({ "status": "", "text": "" })

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCQ1LyU9d52CXM2acseyFBFhU9SlHv9HXQ"
  })

  async function getData () {
    let res = await fetch("/init")
    setInStatus({ "status": res.status, "text": res.statusText })
    let data = await res.json()
    let mar = await data.apiInfo.info
    let top = await data.TopTen.data
    return [mar, top]
  }

  async function search () {
    setTraReStatus({ "status": "", "text": "" })
    setLoading(true)
    setCount(null)
    let s = searchDescription
    setSearching(s)
    updateList()
    try {
      let res = await fetch("/traffic", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchID)
      })
      setTraReStatus(({ "status": res.status, "text": res.statusText }))
      let data = await res.json()
      setCount(data.countInfo)
    } catch {

    }
  }

  async function updateList () {
    try {
      let res = await fetch("/init")
      let data = await res.json()
      let top = await data.TopTen.data
      setTopTen(top)
    } catch {
      console.log()
    }
  }

  async function deleteList () {
    let id = searchID
    let description = searchDescription
    let num
    description.map((i, n) => {
      if (i == del) {
        num = n
      }
    })
    id.splice(num, 1)
    description.splice(num, 1)
    setSearchID(id)
    setSearchDescription(description)
    setLoading(false)
  }

  useEffect(() => {
    (async () => {
      try {
        const [mar, top] = await getData()
        await setMarkers(mar)
        await setTopTen(top)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        deleteList()
      } catch (err) {
        console.log(err)
      }
    })()
  }, [del])

  return (
    <div className="App home">

      <header>
        <Navbar
          className="nav"
        >
          <NavbarBrand className="navfont">
            <img
              alt="logo"
              src={logo}
              style={{
                height: 40,
                width: 60,
              }}
            />
            <img
              alt="logo"
              src={logo1}
              style={{
                height: 40,
                width: 60,
              }}
            />
          </NavbarBrand>
        </Navbar>
      </header>
      {InStatus.status == 500 ?

        <div className="cant">
          {InStatus.status}
          <br></br>
          {InStatus.text}
          <br></br>
        </div> :

        <main className='main'>

          <section>
            <Container>
              <Row>
                <Col>
                  <h1 className="bigtitle">Traffic-Aid</h1>
                </Col>
              </Row>
            </Container>
          </section>

          {traReStatus.status == 408 || traReStatus.status == 404 ?
            <div className="cants">
              <img src={cant} className="cantimg"></img>
              {traReStatus.status}
              <img src={cant} className="cantimg"></img>
              <br></br>
              {traReStatus.text}
            </div>
            :
            <section>
              <Container>
                <Row>
                  <Col>
                    <Result searching={searching} count={count} loading={loading} />
                  </Col>
                </Row>
              </Container>
            </section>
          }

          <section className='fix'>
            <Container>
              <Row>
                <Col>
                  <Search searchID={searchID} searchDescription={searchDescription} setDel={setDel} search={search} />
                </Col>
              </Row>
            </Container>
          </section>

          {
            markers == null ?
              <section className='fix'>
                <Container>
                  <Row>
                    <Col>
                      <BounceLoader
                        color="#36d7b7"
                        size={100}
                        className='load'
                      />
                    </Col>
                  </Row>
                </Container>
              </section>
              :
              <section>
                <Container>
                  <Row>

                    <Col xs="5">
                      <List topTen={topTen} />
                    </Col>


                    <Col xs="7">
                      {isLoaded ? <Map markers={markers} setSearchID={setSearchID} setSearchDescription={setSearchDescription} searchID={searchID} searchDescription={searchDescription} /> : null}
                    </Col>

                  </Row>
                </Container>
              </section>
          }

        </main>
      }
      <footer>
        <div className='container-fluid footer'>
          <div>Copyright © 2022 PINK</div>
        </div>
      </footer>

    </div>

  )
}
