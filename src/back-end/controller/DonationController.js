import ContactDonorModel from '../model/Donation';
import MedicineDonationModel from '../model/Medicine_Donation';
import ConfirmedDonationBeneficiary from '../model/ConfirmedDonationBeneficiary';
const { Op } = require('sequelize');

class DonationController {
  async setDonation(req, res) {
    const {
      nameBeneficiary,
      idBeneficiary,
      nameDonor,
      idDonor,
      message,
      address,
      idMedicine,
      nameMedicine,
      quantityDonate,
      date,
      time,
    } = req.body;

    try {
      if (
        nameBeneficiary &&
        idBeneficiary &&
        nameDonor &&
        idDonor &&
        message &&
        address &&
        nameMedicine &&
        quantityDonate &&
        date &&
        time
      ) {
        await ContactDonorModel.create(req.body);
        await MedicineDonationModel.update(
          { status: false },
          { where: { id: idMedicine } }
        );
        res.status(201).json({
          successMessage: 'Notificação foi enviada.',
        });
      } else {
        res.status(406).json({
          errorMessage: 'Verifique se todos os campos estão preenchidos.',
        });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async getDonation(req, res) {
    const { user_id } = req.params;

    try {
      const notificationsUser = await ContactDonorModel.findAll({
        where: {
          [Op.or]: [{ idBeneficiary: user_id }, { idDonor: user_id }],
        },
      });

      if (notificationsUser) {
        res.status(200).json(notificationsUser);
      } else if (notificationsUser.length <= 0) {
        res.status(202).json({ message: 'Nenhuma Doação Cadastrada.' });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async haveDonationScheduledToday(req, res) {
    const { user_id } = req.params;

    let consultaDoação = await ContactDonorModel.findAll({
      where: {
        date: new Date(),
        [Op.or]: [{ idBeneficiary: user_id }, { idDonor: user_id }],
      },
    });
    if (consultaDoação.length > 0) {
      res.status(200).json({ message: 'Hoje você tem uma doação agendada.' });
    }
  }

  // metodo que verifica se a doação aconteceu.
  // pega o id do usuario que está logado.
  // e verifica na tabela de doação se é
  // do beneficiario.
  async checkDonation(req, res) {
    const { user_id } = req.params;

    try {
      let beneficiary = await ContactDonorModel.findAll({
        where: {
          date: {
            [Op.lt]: new Date(),
          },
          idBeneficiary: user_id,
        },
      });
      if (beneficiary.length > 0) {
        const medicinesScheduledDonation = beneficiary.map((donationData) => ({
          id: donationData.id,
          name: donationData.nameMedicine,
          quantity: donationData.quantityDonate,
          date: donationData.date,
          time: donationData.time,
        }));
        res.status(200).json({
          medicinesScheduledDonation,
        });
      } else {
        let donantion = await ContactDonorModel.findAll({
          where: {
            date: {
              [Op.lt]: new Date(),
            },
            idDonor: user_id,
          },
        });

        if (donantion.length > 0) {
          const medicinesScheduledDonation = donantion.map((donantionData) => ({
            id: donantionData.id,
            name: donantionData.nameMedicine,
            quantity: donantionData.quantityDonate,
            date: donantionData.date,
            time: donantionData.time,
          }));
          res.status(200).json({
            medicinesScheduledDonation,
          });
        } else {
          res
            .status(200)
            .json({ message: 'Você não tem nenhuma doação pendente.' });
        }
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async confirmDonation(req, res) {
    console.log(req.body);

    try {
      const dataConfirm = await ConfirmedDonationBeneficiary.create(req.body);
      console.log('>>>>> dataConfirm', dataConfirm);

      if (dataConfirm) {
        res.status(200).json({ message: 'Obrigado pela sua confirmação.' });
      } else {
        res
          .status(404)
          .json({ message: 'Não foi possível confirmar sua doação.' });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}

export default new DonationController();
