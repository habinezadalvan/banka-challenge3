module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendees: {
      allowNull: true,
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    description: {
      type: DataTypes.STRING,
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
  Event.associate = (models) => {
    Event.hasMany(models.File, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Event;
};
