import { Model, DataTypes } from 'sequelize';

class Medicine extends Model {
  static init(sequelize) {
    super.init(
      {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: { type: DataTypes.STRING },
        laboratory: { type: DataTypes.STRING },
        photo: {
          type: DataTypes.BLOB('long'),
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
        sequelize,
      }
    );
  }
}

export default Medicine;
