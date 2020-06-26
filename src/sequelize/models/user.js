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
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountStatus: {
      type: DataTypes.ENUM({
        values: ['activated', 'disactivated'],
      }),
      defaultValue: 'activated',
    },
    positionStatus: {
      type: DataTypes.ENUM({
        values: ['active', 'inactive'],
      }),
      defaultValue: 'active',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    indexes: [
      {
        fields: ['createdAt'],
      },
    ],
  });
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      targetKey: 'id',
      as: 'role',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Vote, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Contribution, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Loan, {
      foreignKey: 'userId',
      as: 'loans',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'reports',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.VoteEvent, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Event, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    User.hasOne(models.File, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return User;
};
