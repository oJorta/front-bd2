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
        case "RendaMediaPorCurso":
            return `
DELIMITER //

CREATE PROCEDURE RendaMediaPorCurso(IN depto_id INT)
BEGIN
    SELECT c.nome_curso, AVG(a.renda_SM) AS media_salarios_minimos
    FROM aluno a
    JOIN curso c ON a.fk_Curso_cod_curso = c.cod_curso
    WHERE c.fk_Departamento_cod_depto = depto_id
    GROUP BY c.nome_curso;
END //

DELIMITER ;`
        case "update_salario_departamento":
            return `
DELIMITER //
CREATE PROCEDURE update_salario_departamento(id_departamento INT, aumento_mestre DECIMAL(10,2), aumento_doutor DECIMAL(10,2))
BEGIN
    -- Atualizar salários dos professores com titulação de mestre
    UPDATE professor AS p
    JOIN (
        SELECT cod_prof, calcular_salario(titulacao, aumento_mestre, aumento_doutor) AS novo_salario
        FROM professor
        WHERE fk_Departamento_cod_depto = id_departamento
    AND titulacao = 'Mestrado'
    ) AS table_mestre
    ON p.cod_prof = table_mestre.cod_prof
    SET p.salario = table_mestre.novo_salario;

    -- Atualizar salários dos professores com titulação de doutorado
    UPDATE professor AS p
    JOIN (
        SELECT cod_prof, calcular_salario(titulacao, aumento_mestre, aumento_doutor) AS novo_salario
        FROM professor
        WHERE fk_Departamento_cod_depto = id_departamento
          AND titulacao = 'Doutorado'
    ) AS table_doutor 
    ON p.cod_prof = table_doutor.cod_prof
    SET p.salario = table_doutor.novo_salario;
END //
DELIMITER ;`
    }
}