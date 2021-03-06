import pkg from 'sequelize';
const { Model, DataTypes } = pkg;

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING },
      },
      {
        freezeTableName: true,

        timestamps: false,
        sequelize,
      }
    );
  }
}

export default User;
