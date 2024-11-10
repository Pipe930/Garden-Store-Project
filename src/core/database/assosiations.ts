// src/database/associations.ts
import { User } from 'src/modules/users/models/user.model';
import { Comment } from 'src/modules/comments/models/comment.model';

User.hasMany(Comment, { foreignKey: 'idUser' });
Comment.belongsTo(User, { foreignKey: 'idUser', as: 'user' });