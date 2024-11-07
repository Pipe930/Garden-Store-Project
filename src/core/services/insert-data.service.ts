import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Commune, Province, Region } from 'src/modules/address/models/locates.model';
import { Category } from 'src/modules/categories/models/category.model';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Role, RoleUser } from 'src/modules/access-control/models/rol.model';
import { Permission, RolePermission } from 'src/modules/access-control/models/permission.model';
import { User } from 'src/modules/users/models/user.model';
import { hashSync } from 'bcrypt';
import { Tag } from 'src/modules/posts/models/tag.model';

@Injectable()
export class InsertDataService {

    private readonly urlPath = join(__dirname, "..", "database", "default-data.json");

    constructor(
        private readonly httpService: HttpService
    ){}

    private readJsonData(){
        return JSON.parse(readFileSync(this.urlPath, "utf-8"));
    }

    async insertDataLocates(): Promise<void> {

        if(await Region.count() > 0) return;

        console.log("[+] Inserting Locates...");

        const regions = await this.httpService.axiosRef.get("https://apis.digital.gob.cl/dpa/regiones", { headers: { "User-Agent": "" } });

        for (let region of regions.data) {
            const newRegion = await Region.create<Region>({
                code: region.codigo,
                name: region.nombre
            });

            const provinces = await this.httpService.axiosRef.get(`https://apis.digital.gob.cl/dpa/regiones/${region.codigo}/provincias`, { headers: { "User-Agent": "" } });

            for (let province of provinces.data) {
                const newProvince = await Province.create<Province>({
                    name: province.nombre,
                    idRegion: newRegion.idRegion
                });


                const communes = await this.httpService.axiosRef.get(`https://apis.digital.gob.cl/dpa/provincias/${province.codigo}/comunas`, { headers: { "User-Agent": "" } });

                const listCommunes = [];

                for (let commune of communes.data) {
                    listCommunes.push({
                        name: commune.nombre,
                        idProvince: newProvince.idProvince
                    });
                }

                await Commune.bulkCreate(listCommunes);
            }
        }

        console.log("[+] Data Inserted Locates Successfully");
    }

    async insertDataCategories(): Promise<void> {

        if(await Category.count() > 0) return;

        console.log("[+] Inserting Categories...");

        const jsonData = this.readJsonData();

        jsonData.categories.forEach((category: Category) => {
            category.slug = category.name.toLowerCase().replace(/ /g, "-");
            category.name = category.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        });
        await Category.bulkCreate(jsonData.categories);

        console.log("[+] Data Inserted Categories Successfully");
    }

    async insertDataAccessControl(): Promise<void> {

        if(await Role.count() > 0 || await Permission.count() > 0 || await RolePermission.count() > 0) return;

        console.log("[+] Inserting Roles and Permission...");

        const jsonData = this.readJsonData();

        await Role.bulkCreate(jsonData.roles);
        await Permission.bulkCreate(jsonData.permissions);
        await RolePermission.bulkCreate(jsonData.rolePermission);

        console.log("[+] Data Inserted Roles and Permissions Successfully");
    }

    async createSuperUser(): Promise<void> {

        if(await User.count() > 0) return;

        const superuser = await User.create<User>({
            firstName: "Super",
            lastName: "User",
            email: "admin@gmail.com",
            password: hashSync("admin1234", 10),
            phone: "+56912345678",
            active: true
        });

        await RoleUser.create({
            idRole: 2,
            idUser: superuser.idUser
        })
    }

    async insertTags(): Promise<void> {

        if(await Tag.count() > 0) return;

        console.log("[+] Inserting Tags...");

        const jsonData = this.readJsonData();

        jsonData.tags.forEach((tag: Tag) => {
            tag.slug = tag.name.toLowerCase().replace(/ /g, "-");
            tag.name = tag.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        });
        await Tag.bulkCreate(jsonData.tags);

        console.log("[+] Data Inserted Tags Successfully");
    }
}
