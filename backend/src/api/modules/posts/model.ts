import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import User from '../users/model';
import Reaction from '../reactions/model';
import { EPostVisibility } from './types';

export default class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<string>;
  declare content: string;
  declare image: string | null;
  declare visibility: EPostVisibility;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare getReactions: HasManyGetAssociationsMixin<Reaction>;
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM(EPostVisibility.PUBLIC, EPostVisibility.PRIVATE),
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

// Post.hasMany(Reaction, {
//   foreignKey: 'reactableId',
//   scope: {
//     reactableType: 'post'
//   },
//   as: 'reactions'
// });
