"use client";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputNumber } from 'primereact/inputnumber';

import getEndpoint from "@/functions/getEndpoint";
import { procedures } from "@/data/options";
import getSQL from "@/functions/getSQL";

export default function Home() {
  const [selectedTable, setSelectedTable] = useState(null) as any;
  const [tables, setTables] = useState([
    { name: "VIEW v_aluno_disciplina", code: "v_aluno_disciplina" },
    { name: "VIEW view_disciplinas_professor", code: "view_disciplinas_professor" },
    { name: "PROC ExibirMediasDisciplina", code: "ExibirMediasDisciplina" },
    { name: "PROC RendaMediaPorCurso", code: "RendaMediaPorCurso" },
    { name: "PROC update_salario_departamento", code: "update_salario_departamento" },
  ]) as any;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = useState(0) as any;
  const [value2, setValue2] = useState(0) as any;
  const [value3, setValue3] = useState(0) as any;

  useEffect(() => {
    const getTableNames = async () => {
      const response = await fetch("https://api-bd2.vercel.app/tabelas");
      const data = await response.json();
      const tableNames = data.map((table: any) => ({ name: table, code: table}));
      setTables(tables.concat(tableNames));
      
    };
    getTableNames();
  }, []);

  const getTableData = async () => {
    setLoading(true);
    let params = procedures.includes(selectedTable?.code) ? (
      selectedTable?.code === "update_salario_departamento"
        ? `${value1},${value2},${value3}`
        : `${value1}`
    ) : null;
    let url = getEndpoint(selectedTable?.code, params);

    if (!url) {
      alert("Tabela não encontrada");
      setLoading(false);
      return;
    }
    await fetch(url).then(async (response) => {
      await response.json().then((data) => {
        procedures.includes(selectedTable?.code) ? setTableData(data[0]) : setTableData(data)
        setLoading(false)
      })
    });
  };

  return (
    <div className="w-11/12 flex flex-col justify-center items-center mx-auto my-0">
      <header className="w-screen flex flex-row items-center justify-between mobile:justify-center text-center bg-white px-8 py-4 rounded-b drop-shadow-md">
        <h1 className="text-xl font-bold mobile:text-lg">
          Sistema Acadêmico 📘👨🏻‍🎓👩🏾‍🎓
        </h1>
        <p className="text-lg mobile:hidden">Banco de Dados II</p>
      </header>
      <main className="w-full pt-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            <Dropdown
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.value)}
              options={tables}
              optionLabel="name"
              placeholder="Selecione uma tabela"
              className="w-full max-w-md md:w-14rem"
            />

            {procedures.includes(selectedTable?.code) &&
              (selectedTable?.code === "update_salario_departamento" ? (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="dept" className="text-sm font-semibold">Depart.</label>
                    <InputNumber
                      value={value1}
                      className="w-1/5"
                      onValueChange={(e) => setValue1(e.value)}
                      id="dept"
                      useGrouping={false}
                      placeholder="ID"
                    />

                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="sal-mestre" className="text-sm font-semibold">Mestre</label>
                    <InputNumber
                      minFractionDigits={1}
                      value={value2}
                      className="w-1/5"
                      onValueChange={(e) => setValue2(e.value)}
                      id="sal-mestre"
                      placeholder="Salário"
                      />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="sal-doutor" className="text-sm font-semibold">Doutorado</label>
                    <InputNumber
                      minFractionDigits={1}
                      value={value3}
                      className="w-1/5"
                      onValueChange={(e) => setValue3(e.value)}
                      id="sal-doutor"
                      placeholder="Salário"
                    />
                  </div>
                </>
              ) : (
                <>
                  <InputNumber
                    value={value1}
                    className="w-1/5"
                    onValueChange={(e) => setValue1(e.value)}
                    useGrouping={false}
                    placeholder="ID"
                  />
                </>
              ))}

            <Button
              label="Atualizar"
              icon="pi pi-refresh"
              className="w-full"
              loading={loading}
              onClick={() => getTableData()}
            />
          </div>

          <DataTable
            value={tableData || []}
            tableStyle={{ minWidth: "50rem" }}
            size="small"
            stripedRows
            scrollable
            paginator
            rows={10}
          >
            {tableData &&
              tableData.length > 0 &&
              Object.keys(tableData[0]).map((column, i) => (
                <Column key={i} field={column} header={column} />
              ))}
          </DataTable>

          {selectedTable?.code && (
            <div className="flex flex-col w-11/12 max-w-4xl">
              <h2 className="font-semibold">CÓDIGO SQL:</h2>
              <pre>
                <code>{getSQL(selectedTable?.code)}</code>
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
