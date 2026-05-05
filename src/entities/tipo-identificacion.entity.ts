import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Paciente } from "./paciente.entity";

@Entity("daf_tipos_identificacion")
export class TipoIdentificacion {

  @PrimaryColumn({ name: "codigo_tipo_identificacion", type: "varchar2", length: 10 })
  codigoTipoIdentificacion!: string;

  @Column({ name: "nombre_tipo_identificacion", type: "varchar2", length: 50 })
  nombreTipoIdentificacion!: string;

  @Column({ name: "estado", type: "char", length: 1, default: "A" })
  estado!: string;

  @OneToMany(() => Paciente, (paciente) => paciente.tipoIdentificacion)
  pacientes!: Paciente[];
}