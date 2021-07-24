import React, { useState, useEffect } from 'react'
import { Form, Select, Button, Row, Col, Input, DatePicker } from 'antd'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { differenceInDays } from 'date-fns'
import Image from 'next/image'
import { ReactQueryDevtoolsPanel } from 'react-query/devtools'
import Header from '../components/Header'
import SLPLogo from '../public/images/small-love-potion.png'

// Create a client
const queryClient = new QueryClient()

function disabledDate(current) {
  // Can not select days before today and today
  return current && current > Date.now();
}

export default function Home() {
  return (
    <div>
      <Header />
      <QueryClientProvider client={queryClient}>
        <HomePageContent />
      </QueryClientProvider>
    </div >
  )
}

const DataBlock = ({ title, slpAmount, subtitle }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <h4 style={{ color: 'yellow', fontFamily: 'Mulish', textAlign: 'center', fontSize: '0.8em' }}>{title}</h4>
      <div style={{ display: 'flex', margin: '0 0', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Image width="32" height="32" src={SLPLogo} alt="Small love potion logo" />
        <h3 style={{
          color: 'white',
          fontFamily: 'Mulish',
          margin: '0 0 0 0.2em',
          fontSize: '2em'
        }}>{slpAmount}</h3>
      </div>
      <p style={{ color: 'white', textAlign: 'center', margin: '0' }}>{subtitle}</p>
    </div>
  )
}

const HomePageContent = () => {
  const [roninAddress, setRoninAddress] = useState('');
  const [initialDate, setInitialDate] = useState(null);
  const [profitability, setProfitability] = useState();
  const [slpPriceUsd, setSlpPriceUsd] = useState(null);

  const fetchSlpPrice = async () => {
    return (await fetch(
      `https://jsonp.afeld.me/?url=https%3A%2F%2Fapi.coingecko.com%2Fapi%2Fv3%2Fcoins%2Fmarkets%3Fvs_currency%3Dusd%26ids%3Dsmooth-love-potion`
    ).then((res) => res.json()))
  }

  useQuery('slp-price', fetchSlpPrice, {
    onSuccess: (data) => setSlpPriceUsd(data[0].current_price),
  });

  const fetchAccountDetails = async () => {
    return (await fetch(
      `https://api.lunaciarover.com/stats/${roninAddress}`
    ).then((res) => res.json()))
  }

  const calculateProfitability = (data, initialDate) => {
    let days = 0;
    console.log('\n', '===============================================', '\n');
    console.log('data');
    console.log(data);
    console.log('\n', '===============================================', '\n');
    if (initialDate) {
      days = differenceInDays(new Date(), new Date(initialDate.format()));
      console.log('\n', '===============================================', '\n');
      console.log('days');
      console.log(days);
      console.log('\n', '===============================================', '\n');
      setProfitability(data.in_game_slp / days)
    }
  }

  const { isLoading, isError, data, error, refetch, isFetching } =
    useQuery('account-details', fetchAccountDetails, {
      enabled: false,
      onSuccess: (data) => calculateProfitability(data, initialDate),
    });

  const onFinish = (values) => {
    const address = values.address.replace('ronin:', '0x');
    setRoninAddress(address);
    setInitialDate(values.date);
  };

  // Actualiza la query cada vez que cambia el estado
  useEffect(() => {
    if (roninAddress) {
      refetch()
    }
  }, [roninAddress, initialDate])

  return (
    <div>
      <Form
        name="basic"
        onFinish={onFinish}
      >
        <Row style={{ backgroundColor: '#f7f7f7' }}>
          <Col className="upper-block" xs={{ span: 20, offset: 2 }} sm={{ span: 16, offset: 4 }} md={{ span: 12, offset: 6 }}>
            <p style={{ marginTop: 30 }}>Ingresa tu dirección Ronin</p>
            <Form.Item
              name="address"
              initialValue=""
              rules={[{ required: true, message: 'Este campo es requerido.' }]}
            >
              <Input.TextArea style={{ resize: 'none' }} />
            </Form.Item>

            <Form.Item
              name="date"
              label="Fecha de inicio"
              rules={[{ required: true, message: 'Este campo es requerido.' }]}
              style={{ width: '60%', float: 'left' }}
            >
              <DatePicker disabledDate={disabledDate} />
            </Form.Item>
            <Button loading={isLoading || isFetching} style={{ float: 'right', marginTop: '2em' }} size="large" type="primary" htmlType="submit">
              Calcular
            </Button>
          </Col>
        </Row>
        {data && (
          <div
            style={{
              minHeight: '200px',
              background: 'url(https://cdn.axieinfinity.com/assets/images/4478be76c1db578de2f733377049e16b.png) center 15px / 499px 39px repeat-x, linear-gradient(to right top, rgb(57, 71, 46), rgb(37, 73, 65))'
            }}
          >
            <Row style={{ padding: '6em 0' }}>
              <Col xs={{ span: 11, offset: 1 }} md={{ span: 6, offset: 6 }}>
                <DataBlock title="BALANCE ACTUAL" slpAmount={data.in_game_slp} subtitle={slpPriceUsd && `$${Number(data.in_game_slp * slpPriceUsd).toFixed(2)}`} />
              </Col>
              <Col xs={{ span: 11 }} md={{ span: 6 }}>
                <DataBlock title="RENTABILIDAD" slpAmount={Number(profitability).toFixed(0)} subtitle="SLP / 24hs" />
              </Col>
              <Col style={{ marginTop: '2em' }} xs={{ span: 11, offset: 1 }} md={{ span: 6, offset: 6 }}>
                <DataBlock title="PROYECCIÓN SEMANAL" slpAmount={Number(profitability * 7).toFixed(0)} subtitle={slpPriceUsd && `$${Number(profitability * 7 * slpPriceUsd).toFixed(2)}`} />
              </Col>
              <Col style={{ marginTop: '2em' }} xs={{ span: 11 }} md={{ span: 6 }}>
                <DataBlock title="PROYECCIÓN MENSUAL" slpAmount={Number(profitability * 30).toFixed(0)} subtitle={slpPriceUsd && `$${Number(profitability * 30 * slpPriceUsd).toFixed(2)}`} />
              </Col>
            </Row>
          </div>
        )}
      </Form>
    </div>
  )
}