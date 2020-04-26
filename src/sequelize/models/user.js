module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    positionId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    userPositionStatusId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    savingsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accountStatus: {
      type: DataTypes.ENUM({
        values: ['active', 'disactivated'],
      }),
      defaultValue: 'active',
    },
  }, {});
  User.associate = (models) => {
    User.hasOne(models.Role, {
      targetKey: 'id',
      as: 'role',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Saving, {
      foreignKey: 'savingsId',
      as: 'savings',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Vote, {
      targetKey: 'candidateId',
      as: 'vote',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Position, {
      foreignKey: 'positionId',
      as: 'positions',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.UserPositionStatus, {
      foreignKey: 'userPositionStatusId',
      as: 'positionStatus',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Contribution, {
      targetKey: 'userId',
      as: 'contributions',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Loan, {
      targetKey: 'userId',
      as: 'loans',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Report, {
      targetKey: 'userId',
      as: 'reports',
      onDelete: 'CASCADE',
    });
  };
  return User;
};
