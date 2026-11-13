// MODELO DE CATEGORÍA: Organiza los artículos (Escritura, Cuadernos, Arte...).
export class Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;

    constructor(fila: any) {
        this.id = fila.id;
        this.nombre = fila.nombre;
        this.descripcion = fila.descripcion ?? null;
    }
}
