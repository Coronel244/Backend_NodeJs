import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn,} from "typeorm";
import { TipoIdentificacion } from "./tipo-identificacion.entity";

@Entity("mgm_pacientes")
export class Paciente {

  @PrimaryColumn({ name: "id_paciente", type: "number" })
  idPaciente!: number;

  @Column({ name: "numero_identificacion", type: "varchar2", length: 20 })
  numeroIdentificacion!: string;

  @Column({ name: "primer_nombre", type: "varchar2", length: 50 })
  primerNombre!: string;

  @Column({ name: "segundo_nombre", type: "varchar2", length: 50, nullable: true })
  segundoNombre?: string;

  @Column({ name: "primer_apellido", type: "varchar2", length: 50 })
  primerApellido!: string;

  @Column({ name: "segundo_apellido", type: "varchar2", length: 50, nullable: true })
  segundoApellido?: string;

  @Column({ name: "nombre_completo", type: "varchar2", length: 150 })
  nombreCompleto!: string;

  @Column({ name: "email", type: "varchar2", length: 100 })
  email!: string;

  @Column({ name: "estado", type: "char", length: 1, default: "A" })
  estado!: string;

  @Column({ name: "fecha_ingreso", type: "timestamp", nullable: true })
  fechaIngreso!: Date;

  @Column({ name: "usuario_ingreso", type: "varchar2", length: 50, nullable: true })
  usuarioIngreso!: string;

  @Column({ name: "fecha_modificacion", type: "timestamp", nullable: true })
  fechaModificacion!: Date;

  @Column({ name: "usuario_modificacion", type: "varchar2", length: 50, nullable: true })
  usuarioModificacion!: string;

  @ManyToOne(() => TipoIdentificacion, (tipo) => tipo.pacientes)
  @JoinColumn({ name: "codigo_tipo_identificacion" })
  tipoIdentificacion!: TipoIdentificacion;
}