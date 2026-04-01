import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import User from '../users/model';
import { EPostVisibility } from './types';

export default class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare content: string;
  declare image: string;
  declare visibility: EPostVisibility;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    content: {
      type: new DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    visibility: {
      type: new DataTypes.ENUM(EPostVisibility.PUBLIC, EPostVisibility.PRIVATE),
      allowNull: false,
      defaultValue: EPostVisibility.PUBLIC,
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
    tableName: 'posts',
    modelName: 'Post',
    sequelize,
    paranoid: true,
  },
);

User.hasMany(Post, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'posts',
});

Post.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'user',
});
