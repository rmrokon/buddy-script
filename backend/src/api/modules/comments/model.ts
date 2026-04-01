import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { sequelize } from '../../../loaders/datasource';
import User from '../users/model';
import Post from '../posts/model';

export default class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  declare id: CreationOptional<string>;
  declare postId: string;
  declare userId: string;
  declare parentCommentId: string | null;
  declare content: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;
}

Comment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    postId: {
      field: 'post_id',
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.UUID,
      allowNull: false,
    },
    parentCommentId: {
      field: 'parent_comment_id',
      type: DataTypes.UUID,
      allowNull: true,
    },
    content: {
      type: new DataTypes.TEXT,
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
    tableName: 'comments',
    modelName: 'Comment',
    sequelize,
    paranoid: true,
  },
);

User.hasMany(Comment, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'comments',
});

Comment.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'user',
});

Post.hasMany(Comment, {
  foreignKey: {
    name: 'postId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'comments',
});

Comment.belongsTo(Post, {
  foreignKey: {
    name: 'postId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  as: 'post',
});

