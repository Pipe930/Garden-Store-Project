import { Role, RoleUser } from "src/modules/access-control/models/rol.model";
import { RefreshToken, TokenActivation } from "../../modules/users/models/token.model";
import { User } from "../../modules/users/models/user.model";
import { Permission, RolePermission } from "src/modules/access-control/models/permission.model";
import { Category } from "src/modules/categories/models/category.model";
import { Product } from "src/modules/products/models/product.model";

export const ArrayModels: Array<any> = [
    User,
    TokenActivation,
    RefreshToken,
    Role,
    RoleUser,
    Permission,
    RolePermission,
    Category,
    Product
]