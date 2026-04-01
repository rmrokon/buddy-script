import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasOneGetAssociationMixin, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import Credential from '../credentials/model';
import Post from '../posts/model';
import Comment from '../comments/model';
import Reaction from '../reactions/model';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare getCredential: HasOneGetAssociationMixin<Credential>;
  declare getPosts: HasManyGetAssociationsMixin<Post>;
  declare getComments: HasManyGetAssociationsMixin<Comment>;
  declare getReactions: HasManyGetAssociationsMixin<Reaction>;
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
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
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: 'users',
    modelName: 'User',
    sequelize,
    paranoid: true
  },
);
