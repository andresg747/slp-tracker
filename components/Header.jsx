import React from 'react'
import Image from 'next/image'
import { Row, Col, Divider } from 'antd'
import SLPLogo from '../public/images/small-love-potion.png'

const Header = () => (
  <Row style={{ background: '#2e4839', paddingBottom: '1em' }}>
    <Col style={{ display: 'flex', flexDirection: 'row', margin: '1em auto 0', alignItems: 'center' }}>
      <h1 style={{ textAlign: 'center', margin: '0', color: 'white' }}>Axie Infinity</h1>
      <Divider type="vertical" style={{ height: '30px', borderLeft: '1px solid #e8e8e8' }} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image width="32" height="32" src={SLPLogo} alt="Small love potion logo" />
        <h2 style={{
          margin: '0 0 0 0.4em', textAlign: 'center', color: 'white'
        }}>SLP Tracker</h2>
      </div>
    </Col>
  </Row>
)

export default Header;