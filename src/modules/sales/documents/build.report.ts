import type { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { SalesService } from "../sales.service";
import { Sale, SaleProduct } from "../models/sale.model";
import { Product } from "src/modules/products/models/product.model";
import { User } from "src/modules/users/models/user.model";

const logo: Content = { image: "src/assets/Logo_DuocUC.png", width: 120 };
const styles: StyleDictionary = {
    h1: {
        fontSize: 20,
        bold: true,
        margin: [0, 20],
    }
}

export const buildReport = async (idSale: string, timeAnalytics: number, result: number): Promise<TDocumentDefinitions> => {

    const sale = await Sale.findByPk(idSale, {
        include: [
            {
                model: SaleProduct,
                include: [
                    {
                    model: Product,
                    attributes: ['idCategory']
                    }
                ]
            }
        ]
    });

    const user = await User.findByPk(sale.idUser);

    const resultConvert = result === 1 ? 'Si' : 'No';

    return {
        header: {
            text: "Reporte de Análisis de Venta",
            alignment: "right",
            margin: [24, 24],
        },
        content: [
            logo,
            {
                text: 'Garden Store',
                style: "h1"
            },
            {
                columns: [
                    {
                        text: [
                            {text: "Calle Ficticia 1234 \n", bold: true, fontSize: 14},
                            `Comuna de Providencia, Santiago, Región Metropolitana, Chile \n Teléfono: +56 9 1234 5678 \n BN: 12345678-9 \n`,
                            {link: 'https://www.duoc.cl', text: 'www.gardenstore.cl', color: 'blue'}
                        ],
                    },
                    {
                        text: [
                            {text: `Codigo Venta: ${idSale.split('-')[0].toUpperCase()}\n `, bold: true},
                            `Fecha: ${new Date().toLocaleDateString()}\n Fecha Venta: ${new Date(sale.createdAt).toLocaleDateString()}`
                        ],
                        style: {
                            alignment: 'right'
                        }
                    },
                ]
            },
            {
                qr: `https://www.gardenstore.cl/sales/detail/${idSale}`,
                fit: 100,
                alignment: 'right',
                marginBottom: 24
            },
            {
                columns: [
                    {
                        text: [
                            { text: 'Detalle de Venta \n', fontSize: 14, bold: true },
                            `
                            Cantidad de Productos: ${sale.productsQuantity}\n Precio Total: $${sale.priceTotal}\n Precio Iva: $${sale.priceIva}\n Precio Neto: $${sale.priceNet}\nMetodo de Pago: ${sale.methodPayment}\n Estado de Venta: ${sale.statusPayment}\n`,
                        ]
                    },
                    {
                        text: [
                            { text: 'Datos del Cliente \n', fontSize: 14, bold: true },
                            `
                            Nombre: ${user.firstName} ${user.lastName}\n Email: ${user.email}\n Teléfono: ${user.phone}`
                        ],
                        alignment: 'right',
                    }
                ],
            },
            {
                text: 'Resultados del Análisis',
                style: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    margin: [20, 20],
                }
            },
            {
                margin: [0, 20],
                layout: 'lightHorizontalLines',
                table: {
                    widths: ['*', '*'],
                    body: [
                        ['Parametro', 'Valor'],
                        ['Tiempo Analisis', `${timeAnalytics} Segundos`],
                        ['Es Legitima', resultConvert]
                    ]

                }
            }
        ],
        styles: styles,
    }
}