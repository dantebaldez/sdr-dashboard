export interface Semana {
	id: string;
	inicio: string; // data ISO (yyyy-mm-dd)
	fim: string | null; // null enquanto a semana está ativa
}