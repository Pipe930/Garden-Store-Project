import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Commune, Province, Region } from 'src/modules/address/models/locates.model';
import { Category } from 'src/modules/categories/models/category.model';
import { readFileSync } from 'fs';

@Injectable()
export class InsertDataService {

    constructor(
        private readonly httpService: HttpService
    ){}

    async insertDataLocates(): Promise<void> {

        if(await Region.count() > 0) return;

        console.log("[+] Inserting Categories...");

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

        console.log("[+] Data Inserted Categories Successfully");
    }

    async insertDataCategories(): Promise<void> {

        if(await Category.count() > 0) return;

        console.log("[+] Inserting Categories...");

        const categories = JSON.parse(readFileSync("src/core/data/categories.json"));
    }
}
