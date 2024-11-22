// src/database/associations.ts
import { User } from 'src/modules/users/models/user.model';
import { Comment } from 'src/modules/comments/models/comment.model';
import { Sale } from 'src/modules/sales/models/sale.model';
import { Review } from 'src/modules/reviews/models/review.model';

Comment.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
Sale.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
Review.belongsTo(User, { foreignKey: 'idUser', as: 'user' });