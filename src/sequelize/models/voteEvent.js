module.exports = (sequelize, DataTypes) => {
  const VoteEvent = sequelize.define('VoteEvent', {
    votingMembers: {
      allowNull: true,
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    candidates: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    closeTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'closed',
    },
    notify: {
      allowNull: true,
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  }, {});
  VoteEvent.associate = (models) => {
    VoteEvent.belongsTo(models.User, {
      targetKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return VoteEvent;
};
