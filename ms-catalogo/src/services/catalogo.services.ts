import { Producto } from "@shared/types/producto.types";

export class CatalogoService { 
    private productos: Producto[] = [
    { id: 1, nombre: 'Laptop', precio: 1200 },
    { id: 2, nombre: 'Mouse', precio: 25 },
    { id: 3, nombre: 'Teclado', precio: 75 },
    { id: 4, nombre: 'Monitor', precio: 300 },
    { id: 5, nombre: 'Webcam', precio: 80 }
  ];

  obtenerProductoAleatorio(): Producto{
    const productoAleatorio = this.productos[
        Math.floor(Math.random()*this.productos.length)
    ];
    return {
        ...productoAleatorio,
        stock:Math.floor(Math.random()*100)+1,
        descripcion: `Descripcion general de ${productoAleatorio.nombre}`
    };
  }

  obtenerPorductoPorId(id:number): Producto{
    return this.obtenerProductoAleatorio();
  }

}

