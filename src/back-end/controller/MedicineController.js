import MedicineModel from '../model/MedicineModel';

class Medicine {
  async medicineSearch(req, res) {
    try {
      const name = req.params.name;
      if (name) {
        const medicine = await MedicineModel.findAll({
          where: { name },
        });
        if (medicine.length > 0) {
          return res.status(200).json({ medicine });
        }
        return res.status(200).json({
          message: `${name} não tem cadastro para doação.`,
        });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

export default new Medicine();
