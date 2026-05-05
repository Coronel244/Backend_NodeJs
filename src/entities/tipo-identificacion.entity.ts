import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Paciente } from "./paciente.entity";

//@Entity("daf_tipos_identificacion")
@Entity({ name: "DAF_TIPOS_IDENTIFICACION" })
export class TipoIdentificacion {

 @PrimaryColumn({ name: "CODIGO_TIPO_IDENTIFICACION" })
  codigoTipoIdentificacion!: string;

  @Column({ name: "NOMBRE_TIPO_IDENTIFICACION" })
  nombreTipoIdentificacion!: string;

  @Column({ name: "ESTADO" })
  estado!: string;
  
  @OneToMany(() => Paciente, (paciente) => paciente.tipoIdentificacion)
  pacientes!: Paciente[];
}