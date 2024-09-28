import { Role, RoleUser } from "src/modules/access-control/models/rol.model";
import { RefreshToken, TokenActivation } from "../../modules/users/models/token.model";
import { User } from "../../modules/users/models/user.model";
import { Permission, RolePermission } from "src/modules/access-control/models/permission.model";
import { Category } from "src/modules/categories/models/category.model";
import { Product } from "src/modules/products/models/product.model";
import { Cart } from "src/modules/cart/models/cart.model";
import { Item } from "src/modules/cart/models/item.model";
import { Commune, Province, Region } from "src/modules/address/models/locates.model";
import { Address, AddressUser } from "src/modules/address/models/address.model";

export const ArrayModels: Array<any> = [
    User,
    TokenActivation,
    RefreshToken,
    Role,
    RoleUser,
    Permission,
    RolePermission,
    Category,
    Product,
    Cart,
    Item,
    Region,
    Province,
    Commune,
    Address,
    AddressUser
]