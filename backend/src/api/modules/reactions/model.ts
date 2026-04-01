import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import User from '../users/model';

export default class Reaction extends Model<InferAttributes<Reaction>, InferCreationAttributes<Reaction>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare reactableType: string;
  declare reactableId: string;
  declare reactionType: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Reaction.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false,
    },
    reactableType: {
      field: 'reactable_type',
      type: new DataTypes.ENUM('post', 'comment'),
      allowNull: false,
    },
    reactableId: {
      field: 'reactable_id',
      type: DataTypes.UUID,
      allowNull: false,
    },
    reactionType: {
      field: 'reaction_type',
      type: new DataTypes.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry'),
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'reactions',
    modelName: 'Reaction',
    sequelize,
    paranoid: false,
    indexes: [
      {
        unique: true,
        name: 'unique_user_reaction',
        fields: ['user_id', 'reactable_type', 'reactable_id'],
      },
    ],
  },
);

User.hasMany(Reaction, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'reactions',
});

Reaction.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'user',
});
