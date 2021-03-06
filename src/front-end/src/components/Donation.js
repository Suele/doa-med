import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/UserContex';
import LayoutPrivate from '../layouts/LayoutPrivate';
import api from '../services/api';
import DialogBox from './DialogBox';

export default function Donation() {
  const [donationScheduled, setDonationScheduled] = useState([]);
  const [message, setMessage] = useState('');
  let { user } = useAuth();
  let history = useHistory();

  const getDonations = async () => {
    try {
      let getData = await api.get(`/check_donation/${user.id}`);

      console.log('>>>>>>>>> getData: ', getData);

      if (getData.status === 200) {
        setDonationScheduled(getData.data.dataDonation);
      }
      if (getData.data.message) {
        setMessage(getData.data.message);
      }
    } catch (error) {
      if (error.response === undefined) {
        setMessage('Servidor não está disponível.');
        console.log(message);
      }
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  const confirmDonantion = async (donation) => {
    const idBeneficiary = user.id;
    const idDonation = donation.id;
    const beneficiaryConfirm = true;

    const dataConfirm = {
      idBeneficiary,
      idDonation,
      beneficiaryConfirm,
    };

    try {
      const confirm = await api.post(
        `/confirm_donantion/${user.id}`,
        dataConfirm
      );
      if (confirm.status === 200) {
        setMessage(confirm.data.message);
      }
    } catch (error) {
      console.log('>>>> error', error);
    }
  };

  const onClickButton1 = () => history.push('/home');

  return (
    <LayoutPrivate>
      {donationScheduled &&
        donationScheduled.map((donation) => (
          <Paper
            elevation={8}
            style={{ marginTop: 30, background: '#a385cf', color: 'white' }}
            key={donation.id}
          >
            <div style={{ margin: 15, padding: 10 }}>
              <Typography
                style={{
                  fontWeight: 900,
                  marginBottom: 5,
                  paddingBottom: 5,
                  fontSize: 40,
                }}
              >
                Medicamento {donation.nameMedicine}
              </Typography>
              <Typography variant="body1" style={{ fontWeight: 900 }}>
                Quantidade doada {donation.quantityDonate}
              </Typography>
              <Typography variant="body1" style={{ fontWeight: 900 }}>
                Dia da doação {moment(donation.date).format('DD/MM/YYYY')}
              </Typography>
              <Typography variant="body1" style={{ fontWeight: 900 }}>
                Hora {donation.time}
              </Typography>
              <div style={{ marginTop: 7, paddingTop: 14 }}>
                <Typography variant="subtitle1" style={{ fontWeight: 900 }}>
                  Este medicamento foi doado para você?
                </Typography>
                <div
                  style={{
                    marginTop: 7,
                    marginBottom: 8,
                    paddingBottom: 16,
                    fontWeight: 900,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => confirmDonantion(donation)}
                  >
                    Sim
                  </Button>
                  <Button variant="contained" color="secondary">
                    Não
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        ))}
      {message && (
        <DialogBox
          message={message}
          onClickButton1={onClickButton1}
          titleButton1={'OK'}
        />
      )}
    </LayoutPrivate>
  );
}
