import { tables } from "../data/options";

export default function getSQL(query: any) {
    if (tables.includes(query))
        return `SELECT * FROM ${query};`;

    switch (query) {
        case "ExibirMediasDisciplina":
            return `
            DELIMITER //
            CREATE PROCEDURE ExibirMediasDisciplina(IN idDisciplina INT)
            BEGIN
              SELECT 
                a.nome_aluno,
                d.nome_disc AS disciplina,
                calcular_media_por_disciplina(a.matricula, idDisciplina) AS media
              FROM 
                aluno a
                JOIN aluno_disciplina ad ON a.matricula = ad.fk_Aluno_matricula
                JOIN disciplina d ON ad.fk_Disciplina_cod_disc = d.cod_disc
              WHERE 
                d.cod_disc = idDisciplina
              GROUP BY 
                a.nome_aluno;
            END;
            //
            DELIMITER ;`
    }
}