import Beneficiary from '../model/RegisterUser';
import MedicineBeneficiaryModel from '../model/Medicine_Beneficiary';
import MedicineDonationModel from '../model/Medicine_Donation';

class MedicineBeneficiary {
  async registerMedicineBeneficiary(req, res) {
    const { beneficiary_id } = req.params;
    const beneficiary = await Beneficiary.findByPk(beneficiary_id);

    const { name, quantity, prescription } = req.body;

    if (!beneficiary) {
      res
        .status(400)
        .json({ message: 'Não foi encontrado o beneficiário indicado.' });
    } else {
      if (name !== '' && quantity !== '' && prescription !== null) {
        const medicineBeneficiary = await MedicineBeneficiaryModel.create({
          name,
          quantity,
          prescription,
        });
        await beneficiary.addMedicinesBeneficiary(medicineBeneficiary);

        const nameMedicine = await MedicineDonationModel.findAll({
          where: {
            name: medicineBeneficiary.name,
          },
          include: [
            {
              model: MedicineDonationModel,
              as: 'medicines',
            },
          ],
        });

        if (nameMedicine.length > 0) {
          res.status(200).json({ nameMedicine });
        } else {
          res.json({
            message: `Não tem nenhum registro do ${medicineBeneficiary.name} para doação no momento.`,
          });
        }
      }
    }
  }
}

export default new MedicineBeneficiary();
