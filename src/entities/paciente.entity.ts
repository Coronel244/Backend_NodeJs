import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TipoIdentificacion } from "./tipo-identificacion.entity";

@Entity({ name: "MGM_PACIENTES" })
export class Paciente {

  @PrimaryColumn({ name: "ID_PACIENTE" })
  idPaciente!: number;

  @Column({ name: "NUMERO_IDENTIFICACION" })
  numeroIdentificacion!: string;

  @Column({ name: "PRIMER_NOMBRE" })
  primerNombre!: string;

  @Column({ name: "SEGUNDO_NOMBRE", nullable: true })
  segundoNombre?: string;

  @Column({ name: "PRIMER_APELLIDO" })
  primerApellido!: string;

  @Column({ name: "SEGUNDO_APELLIDO", nullable: true })
  segundoApellido?: string;

  @Column({ name: "NOMBRE_COMPLETO" })
  nombreCompleto!: string;

  @Column({ name: "EMAIL" })
  email!: string;

  @Column({ name: "ESTADO", default: "A" })
  estado!: string;

  @Column({ name: "FECHA_INGRESO", nullable: true })
  fechaIngreso!: Date;

  @Column({ name: "USUARIO_INGRESO", nullable: true })
  usuarioIngreso!: string;

  @Column({ name: "FECHA_MODIFICACION", nullable: true })
  fechaModificacion!: Date;

  @Column({ name: "USUARIO_MODIFICACION", nullable: true })
  usuarioModificacion!: string;

  @ManyToOne(() => TipoIdentificacion, (tipo) => tipo.pacientes)
  @JoinColumn({ name: "CODIGO_TIPO_IDENTIFICACION" })
  tipoIdentificacion!: TipoIdentificacion;
}