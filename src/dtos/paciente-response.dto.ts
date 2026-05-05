export interface PacienteResponseDto {
  id_paciente: number;
  numero_identificacion: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombre_completo: string;
  email: string;
  estado: string;
  fecha_ingreso: Date;
  usuario_ingreso: string;
  tipo_identificacion: {
    codigo_tipo_identificacion: string;
    nombre_tipo_identificacion: string;
  };
}